"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner, FaPlus, FaTrash, FaHammer, FaExclamationTriangle, FaListOl, FaMoneyCheckAlt } from "react-icons/fa";
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

export default function NovaObraPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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

    // Itens contratados (10.2)
    const [itensPlanilha, setItensPlanilha] = useState<ItemPlanilha[]>([]);
    const [novoItem, setNovoItem] = useState<ItemPlanilha>({
        item: "",
        unidade: "m²",
        quantidade: "",
        precoUnitario: "",
        precoTotal: ""
    });

    // Medições e pagamentos (10.3)
    const [medicoes, setMedicoes] = useState<MedicaoItem[]>([]);
    const [novaMedicao, setNovaMedicao] = useState<MedicaoItem>({
        numero: "1ª Medição",
        data: new Date().toISOString().split("T")[0],
        percentual: "",
        valorMedido: "",
        valorPago: "",
        ordemBancaria: ""
    });

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

            const res = await fetch("/api/admin/obras", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success("Obra cadastrada com sucesso!");
                router.push("/admin/obras");
            } else {
                toast.error("Erro ao cadastrar obra");
            }
        } catch {
            toast.error("Erro de conexão");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/obras"
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-semibold"
                >
                    <FaArrowLeft /> Voltar para Obras
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Nova Obra Pública</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título da Obra *</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            placeholder="Ex: Pavimentação e Drenagem da Rua São Francisco"
                            value={form.titulo}
                            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Descrição e Objetivos *</label>
                        <textarea
                            required
                            rows={3}
                            className="input-field resize-none"
                            placeholder="Detalhes técnicos, objetivos da intervenção e comunidade beneficiada..."
                            value={form.descricao}
                            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Localização *</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            placeholder="Bairro, Rua ou Zona Rural"
                            value={form.local}
                            onChange={(e) => setForm({ ...form, local: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nº do Contrato Vinculado</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Ex: 015/2026"
                            value={form.numeroContrato}
                            onChange={(e) => setForm({ ...form, numeroContrato: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Valor Contratado Previsto (R$) *</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="input-field font-mono"
                            placeholder="0.00"
                            value={form.valor}
                            onChange={(e) => setForm({ ...form, valor: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Valor Efetivamente Pago (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="input-field font-mono"
                            placeholder="0.00"
                            value={form.valorPago}
                            onChange={(e) => setForm({ ...form, valorPago: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Situação / Status da Obra</label>
                        <select
                            className="input-field font-bold"
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                        >
                            <option value="licitacao">Fase de Licitação</option>
                            <option value="em-andamento">Em Andamento</option>
                            <option value="concluida">Concluída (10.1)</option>
                            <option value="paralisada">Paralisada (10.4)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Percentual de Execução: <strong className="text-[#1254A3]">{form.percentual}%</strong>
                        </label>
                        <div className="flex items-center gap-3 pt-2">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                className="flex-1 accent-[#1254A3]"
                                value={form.percentual}
                                onChange={(e) => setForm({ ...form, percentual: parseInt(e.target.value, 10) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Data de Início das Obras</label>
                        <input
                            type="date"
                            className="input-field"
                            value={form.dataInicio}
                            onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            {form.status === "concluida" ? "Data Efetiva de Conclusão (10.1)" : "Previsão de Término"}
                        </label>
                        <input
                            type="date"
                            className="input-field"
                            value={form.previsaoTermino}
                            onChange={(e) => setForm({ ...form, previsaoTermino: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Empresa Contratada</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Razão Social da Construtora"
                            value={form.empresa}
                            onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CNPJ da Empresa</label>
                        <input
                            type="text"
                            className="input-field font-mono"
                            placeholder="00.000.000/0000-00"
                            value={form.cnpjEmpresa}
                            onChange={(e) => setForm({ ...form, cnpjEmpresa: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <ImageUpload
                            value={form.imagem}
                            onChange={(url) => setForm({ ...form, imagem: url })}
                            label="Foto da Obra / Placa Informativa"
                        />
                    </div>
                </div>

                {/* Campos Específicos para Obra Paralisada (Critério 10.4) */}
                {form.status === "paralisada" && (
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                            <FaExclamationTriangle /> Informações Oficiais de Paralisação (PNTP 10.4)
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-3">
                                <label className="block text-xs font-bold text-rose-900 uppercase mb-1">
                                    Motivo da Paralisação *
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    className="input-field border-rose-300"
                                    placeholder="Ex: Aguardando liberação de repasse federal / rescisão contratual..."
                                    value={form.motivoParalisacao}
                                    onChange={(e) => setForm({ ...form, motivoParalisacao: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-rose-900 uppercase mb-1">
                                    Responsável pela Inexecução Temporária *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="input-field border-rose-300"
                                    placeholder="Ex: Construtora (abandono de obra) ou Órgão Concedente (atraso repasse)"
                                    value={form.responsavelParalisacao}
                                    onChange={(e) => setForm({ ...form, responsavelParalisacao: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-rose-900 uppercase mb-1">
                                    Previsão de Reinício *
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="input-field border-rose-300"
                                    value={form.previsaoReinicio}
                                    onChange={(e) => setForm({ ...form, previsaoReinicio: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Seção 1: Quantitativos e Preços Contratados (Critério 10.2) */}
                <div className="border-t border-gray-100 pt-6 space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                            <FaListOl className="text-[#1254A3]" /> Quantitativos, Preços Unitários e Totais Contratados (PNTP 10.2)
                        </h3>
                        <p className="text-xs text-gray-500">
                            Exponha a planilha orçamentária contratada com itens, unidades de medida e valores.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Item / Serviço</label>
                            <input
                                type="text"
                                placeholder="Ex: Pavimentação em paralelepípedo"
                                value={novoItem.item}
                                onChange={(e) => setNovoItem({ ...novoItem, item: e.target.value })}
                                className="input-field text-xs"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Unidade</label>
                            <select
                                value={novoItem.unidade}
                                onChange={(e) => setNovoItem({ ...novoItem, unidade: e.target.value })}
                                className="input-field text-xs"
                            >
                                <option value="m²">m²</option>
                                <option value="m³">m³</option>
                                <option value="m">m (metro)</option>
                                <option value="km">km</option>
                                <option value="un">un (unidade)</option>
                                <option value="vb">vb (verba)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Quantidade</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={novoItem.quantidade}
                                onChange={(e) => setNovoItem({ ...novoItem, quantidade: e.target.value })}
                                className="input-field text-xs font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Preço Unit. (R$)</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={novoItem.precoUnitario}
                                    onChange={(e) => setNovoItem({ ...novoItem, precoUnitario: e.target.value })}
                                    className="input-field text-xs font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddItemPlanilha}
                                    className="px-3 py-2 bg-[#1254A3] text-white rounded-xl text-xs font-bold hover:bg-blue-800 shrink-0"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>
                    </div>

                    {itensPlanilha.length > 0 && (
                        <div className="overflow-x-auto border border-gray-200 rounded-xl">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-50 text-gray-600 uppercase">
                                    <tr>
                                        <th className="p-3">Item / Serviço</th>
                                        <th className="p-3">Unid.</th>
                                        <th className="p-3">Qtd.</th>
                                        <th className="p-3">Preço Unit.</th>
                                        <th className="p-3">Total (R$)</th>
                                        <th className="p-3 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {itensPlanilha.map((it, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="p-3 font-medium text-gray-800">{it.item}</td>
                                            <td className="p-3 font-mono">{it.unidade}</td>
                                            <td className="p-3 font-mono">{it.quantidade}</td>
                                            <td className="p-3 font-mono">R$ {parseFloat(it.precoUnitario).toFixed(2)}</td>
                                            <td className="p-3 font-mono font-bold text-[#1254A3]">R$ {parseFloat(it.precoTotal).toFixed(2)}</td>
                                            <td className="p-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItemPlanilha(idx)}
                                                    className="text-rose-500 hover:text-rose-700"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Seção 2: Medições e Valores Efetivamente Pagos (Critério 10.3) */}
                <div className="border-t border-gray-100 pt-6 space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                            <FaMoneyCheckAlt className="text-[#1254A3]" /> Quantitativos Executados e Valores Pagos (PNTP 10.3)
                        </h3>
                        <p className="text-xs text-gray-500">
                            Vincule os boletins de medição com quantitativo físico executado e pagamentos efetuados.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Nº Medição</label>
                            <input
                                type="text"
                                placeholder="1ª Medição"
                                value={novaMedicao.numero}
                                onChange={(e) => setNovaMedicao({ ...novaMedicao, numero: e.target.value })}
                                className="input-field text-xs"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Data</label>
                            <input
                                type="date"
                                value={novaMedicao.data}
                                onChange={(e) => setNovaMedicao({ ...novaMedicao, data: e.target.value })}
                                className="input-field text-xs"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">% Acumulado</label>
                            <input
                                type="number"
                                placeholder="Ex: 25"
                                value={novaMedicao.percentual}
                                onChange={(e) => setNovaMedicao({ ...novaMedicao, percentual: e.target.value })}
                                className="input-field text-xs font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Valor Medido (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={novaMedicao.valorMedido}
                                onChange={(e) => setNovaMedicao({ ...novaMedicao, valorMedido: e.target.value })}
                                className="input-field text-xs font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Valor Pago (R$)</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={novaMedicao.valorPago}
                                    onChange={(e) => setNovaMedicao({ ...novaMedicao, valorPago: e.target.value })}
                                    className="input-field text-xs font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddMedicao}
                                    className="px-3 py-2 bg-[#1254A3] text-white rounded-xl text-xs font-bold hover:bg-blue-800 shrink-0"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>
                    </div>

                    {medicoes.length > 0 && (
                        <div className="overflow-x-auto border border-gray-200 rounded-xl">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-50 text-gray-600 uppercase">
                                    <tr>
                                        <th className="p-3">Boletim</th>
                                        <th className="p-3">Data</th>
                                        <th className="p-3">% Executado</th>
                                        <th className="p-3">Valor Medido</th>
                                        <th className="p-3">Valor Pago (R$)</th>
                                        <th className="p-3 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {medicoes.map((m, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="p-3 font-bold text-gray-800">{m.numero}</td>
                                            <td className="p-3">{new Date(m.data).toLocaleDateString("pt-BR")}</td>
                                            <td className="p-3 font-mono font-bold text-[#1254A3]">{m.percentual}%</td>
                                            <td className="p-3 font-mono">R$ {parseFloat(m.valorMedido || "0").toFixed(2)}</td>
                                            <td className="p-3 font-mono font-bold text-emerald-700">R$ {parseFloat(m.valorPago || "0").toFixed(2)}</td>
                                            <td className="p-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveMedicao(idx)}
                                                    className="text-rose-500 hover:text-rose-700"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <Link
                        href="/admin/obras"
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-[#1254A3] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-sm disabled:opacity-50"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        <span>Cadastrar Obra</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
