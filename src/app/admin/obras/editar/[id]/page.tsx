"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    FaSave,
    FaArrowLeft,
    FaSpinner,
    FaPlus,
    FaTrash,
    FaHammer,
    FaExclamationTriangle,
    FaListOl,
    FaMoneyCheckAlt
} from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";

type ItemPlanilha = {
    item: string;
    unidade: string;
    quantidade: string;
    precoUnitario: string;
    precoTotal: string;
};

type MedicaoItem = {
    numero: string;
    data: string;
    percentual: string;
    valorMedido: string;
    valorPago: string;
    ordemBancaria?: string;
};

export default function EditarObraPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [form, setForm] = useState({
        titulo: "",
        descricao: "",
        local: "",
        valor: "",
        valorPago: "",
        status: "em-andamento",
        dataInicio: "",
        previsaoTermino: "",
        empresa: "",
        cnpjEmpresa: "",
        numeroContrato: "",
        percentual: 0,
        imagem: "",
        motivoParalisacao: "",
        responsavelParalisacao: "",
        previsaoReinicio: "",
    });

    const [itensPlanilha, setItensPlanilha] = useState<ItemPlanilha[]>([]);
    const [novoItem, setNovoItem] = useState<ItemPlanilha>({
        item: "",
        unidade: "m²",
        quantidade: "",
        precoUnitario: "",
        precoTotal: ""
    });

    const [medicoes, setMedicoes] = useState<MedicaoItem[]>([]);
    const [novaMedicao, setNovaMedicao] = useState<MedicaoItem>({
        numero: "1ª Medição",
        data: new Date().toISOString().split("T")[0],
        percentual: "",
        valorMedido: "",
        valorPago: "",
        ordemBancaria: ""
    });

    useEffect(() => {
        if (params.id) {
            fetch(`/api/admin/obras/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    setForm({
                        titulo: data.titulo || "",
                        descricao: data.descricao || "",
                        local: data.local || "",
                        valor: data.valor !== undefined && data.valor !== null ? String(data.valor) : "",
                        valorPago: data.valorPago !== undefined && data.valorPago !== null ? String(data.valorPago) : "",
                        status: data.status || "em-andamento",
                        dataInicio: data.dataInicio ? data.dataInicio.split("T")[0] : "",
                        previsaoTermino: data.previsaoTermino ? data.previsaoTermino.split("T")[0] : "",
                        empresa: data.empresa || "",
                        cnpjEmpresa: data.cnpjEmpresa || "",
                        numeroContrato: data.numeroContrato || "",
                        percentual: data.percentual || 0,
                        imagem: data.imagem || "",
                        motivoParalisacao: data.motivoParalisacao || "",
                        responsavelParalisacao: data.responsavelParalisacao || "",
                        previsaoReinicio: data.previsaoReinicio ? data.previsaoReinicio.split("T")[0] : "",
                    });

                    if (Array.isArray(data.quantitativosContratados)) {
                        setItensPlanilha(data.quantitativosContratados.map((it: any) => ({
                            item: it.item || "",
                            unidade: it.unidade || "un",
                            quantidade: String(it.quantidade || ""),
                            precoUnitario: String(it.precoUnitario || ""),
                            precoTotal: String(it.precoTotal || "")
                        })));
                    }

                    if (Array.isArray(data.medicoes)) {
                        setMedicoes(data.medicoes.map((m: any) => ({
                            numero: m.numero || "",
                            data: m.data ? m.data.split("T")[0] : "",
                            percentual: String(m.percentual || ""),
                            valorMedido: String(m.valorMedido || ""),
                            valorPago: String(m.valorPago || ""),
                            ordemBancaria: m.ordemBancaria || ""
                        })));
                    }

                    setFetching(false);
                })
                .catch(() => {
                    toast.error("Erro ao carregar obra");
                    router.push("/admin/obras");
                });
        }
    }, [params.id, router]);

    const handleAddItemPlanilha = () => {
        if (!novoItem.item || !novoItem.quantidade || !novoItem.precoUnitario) {
            toast.error("Preencha item, quantidade e preço unitário.");
            return;
        }
        const qtd = parseFloat(novoItem.quantidade) || 0;
        const vUnit = parseFloat(novoItem.precoUnitario) || 0;
        const total = (qtd * vUnit).toFixed(2);

        setItensPlanilha([...itensPlanilha, { ...novoItem, precoTotal: total }]);
        setNovoItem({ item: "", unidade: "m²", quantidade: "", precoUnitario: "", precoTotal: "" });
        toast.success("Item adicionado à planilha da obra!");
    };

    const handleRemoveItemPlanilha = (index: number) => {
        setItensPlanilha(itensPlanilha.filter((_, i) => i !== index));
    };

    const handleAddMedicao = () => {
        if (!novaMedicao.numero || !novaMedicao.valorMedido) {
            toast.error("Informe o número e o valor da medição.");
            return;
        }
        setMedicoes([...medicoes, novaMedicao]);
        setNovaMedicao({
            numero: `${medicoes.length + 2}ª Medição`,
            data: new Date().toISOString().split("T")[0],
            percentual: "",
            valorMedido: "",
            valorPago: "",
            ordemBancaria: ""
        });
        toast.success("Boletim de medição vinculado!");
    };

    const handleRemoveMedicao = (index: number) => {
        setMedicoes(medicoes.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...form,
                valor: parseFloat(form.valor) || 0,
                valorPago: parseFloat(form.valorPago) || 0,
                quantitativosContratados: itensPlanilha,
                medicoes: medicoes.map(m => ({
                    ...m,
                    valorMedido: parseFloat(m.valorMedido) || 0,
                    valorPago: parseFloat(m.valorPago) || 0,
                    percentual: parseFloat(m.percentual) || 0
                }))
            };

            const res = await fetch(`/api/admin/obras/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success("Obra atualizada com sucesso!");
                router.push("/admin/obras");
            } else {
                toast.error("Erro ao atualizar obra");
            }
        } catch {
            toast.error("Erro de conexão");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center py-20">
                <FaSpinner className="animate-spin text-3xl text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/obras"
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-bold text-xs uppercase tracking-widest"
                >
                    <FaArrowLeft /> Voltar para Obras
                </Link>
                <div className="text-right">
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        PNTP Critérios 10.1 a 10.4
                    </span>
                    <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight mt-1">
                        Editar Obra Pública
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. DADOS GERAIS */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FaHammer />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-gray-800 uppercase">1. Informações Básicas da Obra</h2>
                            <p className="text-xs text-gray-500">Identificação, localização, contrato e situação da obra pública</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Título da Obra *
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                                value={form.titulo}
                                onChange={e => setForm({ ...form, titulo: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Descrição e Objetivos do Projeto *
                            </label>
                            <textarea
                                required
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                value={form.descricao}
                                onChange={e => setForm({ ...form, descricao: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Localização (Bairro, Rua, Ponto) *
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={form.local}
                                onChange={e => setForm({ ...form, local: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Situação Atual da Obra *
                            </label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                                value={form.status}
                                onChange={e => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="planejada">Planejada / A Iniciar</option>
                                <option value="em-andamento">Em Andamento</option>
                                <option value="paralisada">Paralisada (Critério 10.4)</option>
                                <option value="concluida">Concluída (Critério 10.1)</option>
                                <option value="cancelada">Cancelada</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Valor Contratado (R$) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                value={form.valor}
                                onChange={e => setForm({ ...form, valor: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Valor Efetivamente Pago Acumulado (R$) - Critério 10.3
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono font-bold text-emerald-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0.00"
                                value={form.valorPago}
                                onChange={e => setForm({ ...form, valorPago: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Empresa Executante / Contratada
                            </label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={form.empresa}
                                onChange={e => setForm({ ...form, empresa: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                CNPJ da Empresa
                            </label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="00.000.000/0000-00"
                                value={form.cnpjEmpresa}
                                onChange={e => setForm({ ...form, cnpjEmpresa: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Número do Contrato / Processo Licitatório
                            </label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ex: Contrato nº 042/2024"
                                value={form.numeroContrato}
                                onChange={e => setForm({ ...form, numeroContrato: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Execução Física Geral ({form.percentual}%)
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                value={form.percentual}
                                onChange={e => setForm({ ...form, percentual: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Data de Início da Obra
                            </label>
                            <input
                                type="date"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={form.dataInicio}
                                onChange={e => setForm({ ...form, dataInicio: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                {form.status === "concluida" ? "Data Efetiva de Conclusão (10.1)" : "Previsão de Término"}
                            </label>
                            <input
                                type="date"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={form.previsaoTermino}
                                onChange={e => setForm({ ...form, previsaoTermino: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Foto ou Registro Visual da Obra
                        </label>
                        <ImageUpload
                            value={form.imagem}
                            onChange={url => setForm({ ...form, imagem: url })}
                        />
                    </div>
                </div>

                {/* 2. CRITÉRIO 10.4 - DETALHAMENTO DE OBRAS PARALISADAS */}
                {form.status === "paralisada" && (
                    <div className="bg-amber-50/70 border-2 border-amber-300 rounded-3xl p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg">
                                <FaExclamationTriangle />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                                    Critério 10.4 Obrigatório
                                </span>
                                <h3 className="text-base font-black text-amber-900 uppercase">
                                    Detalhamento de Paralisação da Obra
                                </h3>
                                <p className="text-xs text-amber-700">
                                    Obrigatório registrar motivo oficial, responsável pela inexecução e previsão de reinício.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                                    Motivo da Paralisação *
                                </label>
                                <textarea
                                    required={form.status === "paralisada"}
                                    rows={2}
                                    placeholder="Ex: Rescisão contratual com a executante original, readequação da planilha orçamentária ou aguardo de repasse federal..."
                                    className="w-full bg-white border border-amber-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                    value={form.motivoParalisacao}
                                    onChange={e => setForm({ ...form, motivoParalisacao: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                                    Responsável pela Inexecução Temporária *
                                </label>
                                <input
                                    type="text"
                                    required={form.status === "paralisada"}
                                    placeholder="Ex: Empresa contratada, Concedente ou Administração"
                                    className="w-full bg-white border border-amber-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                    value={form.responsavelParalisacao}
                                    onChange={e => setForm({ ...form, responsavelParalisacao: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                                    Data Prevista para Reinício dos Serviços *
                                </label>
                                <input
                                    type="date"
                                    required={form.status === "paralisada"}
                                    className="w-full bg-white border border-amber-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                    value={form.previsaoReinicio}
                                    onChange={e => setForm({ ...form, previsaoReinicio: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. CRITÉRIO 10.2 - QUANTITATIVOS CONTRATADOS / PLANILHA ORÇAMENTÁRIA */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <FaListOl />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                                    Critério 10.2
                                </span>
                                <h3 className="text-base font-black text-gray-800 uppercase">
                                    Quantitativos e Preços Unitários Contratados
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Itens contratados com unidade, quantidade, preço unitário e preço total
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Formulário de inserção de item */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                        <div className="sm:col-span-4">
                            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Item / Serviço</label>
                            <input
                                type="text"
                                placeholder="Ex: Pavimentação em paralelepípedo"
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-blue-500"
                                value={novoItem.item}
                                onChange={e => setNovoItem({ ...novoItem, item: e.target.value })}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Unidade</label>
                            <input
                                type="text"
                                placeholder="m², m³, un, kg"
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-blue-500"
                                value={novoItem.unidade}
                                onChange={e => setNovoItem({ ...novoItem, unidade: e.target.value })}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Qtd</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="100.00"
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-blue-500"
                                value={novoItem.quantidade}
                                onChange={e => setNovoItem({ ...novoItem, quantidade: e.target.value })}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Preço Unit. (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="50.00"
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-blue-500"
                                value={novoItem.precoUnitario}
                                onChange={e => setNovoItem({ ...novoItem, precoUnitario: e.target.value })}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <button
                                type="button"
                                onClick={handleAddItemPlanilha}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                            >
                                <FaPlus size={11} /> Adicionar
                            </button>
                        </div>
                    </div>

                    {/* Tabela de itens cadastrados */}
                    {itensPlanilha.length > 0 ? (
                        <div className="overflow-x-auto border border-gray-200 rounded-xl">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                                    <tr>
                                        <th className="p-3">#</th>
                                        <th className="p-3">Item / Descrição</th>
                                        <th className="p-3">Unid.</th>
                                        <th className="p-3 text-right">Qtd Contratada</th>
                                        <th className="p-3 text-right">Preço Unitário</th>
                                        <th className="p-3 text-right">Preço Total</th>
                                        <th className="p-3 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {itensPlanilha.map((it, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="p-3 font-mono text-gray-400">{idx + 1}</td>
                                            <td className="p-3 font-semibold text-gray-800">{it.item}</td>
                                            <td className="p-3 text-gray-600 uppercase">{it.unidade}</td>
                                            <td className="p-3 text-right font-mono">{parseFloat(it.quantidade || "0").toLocaleString("pt-BR")}</td>
                                            <td className="p-3 text-right font-mono">
                                                R$ {parseFloat(it.precoUnitario || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-3 text-right font-mono font-bold text-gray-900">
                                                R$ {parseFloat(it.precoTotal || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItemPlanilha(idx)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 italic text-center py-4">
                            Nenhum item da planilha orçamentária contratada inserido ainda. Adicione os itens acima para cumprir o Critério 10.2.
                        </p>
                    )}
                </div>

                {/* 4. CRITÉRIO 10.3 - MEDIÇÕES E VALORES EFETIVAMENTE PAGOS */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <FaMoneyCheckAlt />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                    Critério 10.3
                                </span>
                                <h3 className="text-base font-black text-gray-800 uppercase">
                                    Boletins de Medição e Pagamentos Efetuados
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Quantitativos medidos executados, datas de medição e ordens bancárias / valores pagos
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Formulário de inserção de medição */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                        <div className="sm:col-span-3">
                            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Medição</label>
                            <input
                                type="text"
                                placeholder="Ex: 1ª Medição"
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-blue-500"
                                value={novaMedicao.numero}
                                onChange={e => setNovaMedicao({ ...novaMedicao, numero: e.target.value })}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Data</label>
                            <input
                                type="date"
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-blue-500"
                                value={novaMedicao.data}
                                onChange={e => setNovaMedicao({ ...novaMedicao, data: e.target.value })}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">% Executado</label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="Ex: 25.5"
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-blue-500"
                                value={novaMedicao.percentual}
                                onChange={e => setNovaMedicao({ ...novaMedicao, percentual: e.target.value })}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Valor Medido (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-blue-500"
                                value={novaMedicao.valorMedido}
                                onChange={e => setNovaMedicao({ ...novaMedicao, valorMedido: e.target.value })}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Valor Pago (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-blue-500"
                                value={novaMedicao.valorPago}
                                onChange={e => setNovaMedicao({ ...novaMedicao, valorPago: e.target.value })}
                            />
                        </div>
                        <div className="sm:col-span-1">
                            <button
                                type="button"
                                onClick={handleAddMedicao}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center transition-colors"
                                title="Adicionar Medição"
                            >
                                <FaPlus size={11} />
                            </button>
                        </div>
                    </div>

                    {/* Tabela de medições */}
                    {medicoes.length > 0 ? (
                        <div className="overflow-x-auto border border-gray-200 rounded-xl">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                                    <tr>
                                        <th className="p-3">Medição</th>
                                        <th className="p-3">Data</th>
                                        <th className="p-3 text-center">% Medição</th>
                                        <th className="p-3 text-right">Valor Medido</th>
                                        <th className="p-3 text-right">Valor Pago</th>
                                        <th className="p-3 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {medicoes.map((m, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="p-3 font-bold text-gray-800">{m.numero}</td>
                                            <td className="p-3 text-gray-600">
                                                {m.data ? new Date(m.data + "T00:00:00").toLocaleDateString("pt-BR") : "-"}
                                            </td>
                                            <td className="p-3 text-center font-mono font-semibold">{m.percentual}%</td>
                                            <td className="p-3 text-right font-mono font-bold text-gray-900">
                                                R$ {parseFloat(m.valorMedido || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-3 text-right font-mono font-bold text-emerald-700">
                                                R$ {parseFloat(m.valorPago || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveMedicao(idx)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 italic text-center py-4">
                            Nenhum boletim de medição lançado ainda. Registre as medições e pagamentos para cumprir o Critério 10.3.
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                    <Link
                        href="/admin/obras"
                        className="px-6 py-3.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Salvar Alterações da Obra
                    </button>
                </div>
            </form>
        </div>
    );
}
