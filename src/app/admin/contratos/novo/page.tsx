"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner, FaPlus, FaTrash, FaUserShield, FaFileContract } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

type Fiscal = {
    nome: string;
    cargo: string;
    portaria: string;
    dataDesignacao: string;
    periodoAtuacao: string;
    tipo: "titular" | "substituto";
    status: "ativo" | "encerrado";
};

type Aditivo = {
    numero: string;
    objeto: string;
    valor: string;
    data: string;
    url: string;
};

export default function NovoContratoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        numero: "",
        ano: new Date().getFullYear(),
        objeto: "",
        valor: "",
        fornecedor: "",
        cnpjFornecedor: "",
        modalidadeOrigem: "Pregão Eletrônico",
        dataAssinatura: "",
        dataInicio: "",
        dataFim: "",
        status: "vigente",
        secretaria: "Secretaria de Administração e Planejamento",
        instrumentoIntegralUrl: "",
        codigoPermanente: "",
    });

    const [fiscais, setFiscais] = useState<Fiscal[]>([]);
    const [novoFiscal, setNovoFiscal] = useState<Fiscal>({
        nome: "",
        cargo: "Servidor Público Municipal",
        portaria: "",
        dataDesignacao: new Date().toISOString().split("T")[0],
        periodoAtuacao: `${new Date().getFullYear()} - Vigência Contratual`,
        tipo: "titular",
        status: "ativo"
    });

    const [aditivos, setAditivos] = useState<Aditivo[]>([]);
    const [novoAditivo, setNovoAditivo] = useState<Aditivo>({
        numero: "1º Termo Aditivo",
        objeto: "Prorrogação de vigência e acréscimo de valor",
        valor: "",
        data: new Date().toISOString().split("T")[0],
        url: ""
    });

    const [secretarias, setSecretarias] = useState<{ id: string; nome: string }[]>([]);

    useEffect(() => {
        fetch("/api/secretarias")
            .then((res) => res.json())
            .then((data) => setSecretarias(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, []);

    const handleAddFiscal = () => {
        if (!novoFiscal.nome || !novoFiscal.portaria) {
            toast.error("Informe o nome do fiscal e a portaria de designação.");
            return;
        }
        setFiscais([...fiscais, novoFiscal]);
        setNovoFiscal({
            nome: "",
            cargo: "Servidor Público Municipal",
            portaria: "",
            dataDesignacao: new Date().toISOString().split("T")[0],
            periodoAtuacao: `${new Date().getFullYear()} - Vigência Contratual`,
            tipo: "titular",
            status: "ativo"
        });
        toast.success("Fiscal vinculado ao contrato!");
    };

    const handleRemoveFiscal = (index: number) => {
        setFiscais(fiscais.filter((_, i) => i !== index));
    };

    const handleAddAditivo = () => {
        if (!novoAditivo.numero || !novoAditivo.objeto) {
            toast.error("Informe o número e o objeto do aditivo.");
            return;
        }
        setAditivos([...aditivos, novoAditivo]);
        setNovoAditivo({
            numero: `${aditivos.length + 2}º Termo Aditivo`,
            objeto: "",
            valor: "",
            data: new Date().toISOString().split("T")[0],
            url: ""
        });
        toast.success("Termo aditivo vinculado!");
    };

    const handleRemoveAditivo = (index: number) => {
        setAditivos(aditivos.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...form,
                valor: parseFloat(form.valor) || 0,
                dataInicio: form.dataInicio || form.dataAssinatura,
                fiscais,
                aditivos: aditivos.map((a) => ({
                    ...a,
                    valor: a.valor ? parseFloat(a.valor) : 0
                }))
            };

            const res = await fetch("/api/contratos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success("Contrato cadastrado com sucesso!");
                router.push("/admin/contratos");
            } else {
                const err = await res.json();
                toast.error(err.error || "Erro ao salvar contrato");
            }
        } catch {
            toast.error("Erro de conexão ao salvar contrato");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/contratos"
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-semibold"
                >
                    <FaArrowLeft /> Voltar para Contratos
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Novo Contrato Administrativo</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Número do Contrato *
                        </label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            placeholder="Ex: 001/2026"
                            value={form.numero}
                            onChange={(e) => setForm({ ...form, numero: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Ano / Exercício *
                        </label>
                        <input
                            type="number"
                            required
                            className="input-field"
                            value={form.ano}
                            onChange={(e) => setForm({ ...form, ano: parseInt(e.target.value, 10) })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Objeto do Contrato *
                        </label>
                        <textarea
                            required
                            rows={3}
                            className="input-field resize-none"
                            placeholder="Descrição completa do objeto contratado..."
                            value={form.objeto}
                            onChange={(e) => setForm({ ...form, objeto: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Contratado / Fornecedor *
                        </label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            placeholder="Razão Social ou Nome do Profissional"
                            value={form.fornecedor}
                            onChange={(e) => setForm({ ...form, fornecedor: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            CNPJ / CPF do Contratado
                        </label>
                        <input
                            type="text"
                            className="input-field font-mono"
                            placeholder="00.000.000/0000-00"
                            value={form.cnpjFornecedor}
                            onChange={(e) => setForm({ ...form, cnpjFornecedor: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Valor Total Global (R$) *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="input-field"
                            placeholder="0.00"
                            value={form.valor}
                            onChange={(e) => setForm({ ...form, valor: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Modalidade de Licitação de Origem
                        </label>
                        <select
                            className="input-field"
                            value={form.modalidadeOrigem}
                            onChange={(e) => setForm({ ...form, modalidadeOrigem: e.target.value })}
                        >
                            <option value="Pregão Eletrônico">Pregão Eletrônico</option>
                            <option value="Dispensa de Licitação">Dispensa de Licitação</option>
                            <option value="Inexigibilidade">Inexigibilidade</option>
                            <option value="Concorrência">Concorrência</option>
                            <option value="Adesão a Registro de Preços">Adesão a Registro de Preços</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Data de Assinatura *
                        </label>
                        <input
                            type="date"
                            required
                            className="input-field"
                            value={form.dataAssinatura}
                            onChange={(e) => setForm({ ...form, dataAssinatura: e.target.value, dataInicio: form.dataInicio || e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Término da Vigência *
                        </label>
                        <input
                            type="date"
                            required
                            className="input-field"
                            value={form.dataFim}
                            onChange={(e) => setForm({ ...form, dataFim: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Secretaria Responsável
                        </label>
                        <select
                            className="input-field"
                            value={form.secretaria}
                            onChange={(e) => setForm({ ...form, secretaria: e.target.value })}
                        >
                            <option value="Secretaria de Administração e Planejamento">Secretaria de Administração e Planejamento</option>
                            <option value="Secretaria Municipal de Saúde">Secretaria Municipal de Saúde</option>
                            <option value="Secretaria Municipal de Educação">Secretaria Municipal de Educação</option>
                            <option value="Secretaria de Obras e Serviços Urbanos">Secretaria de Obras e Serviços Urbanos</option>
                            <option value="Secretaria de Assistência Social">Secretaria de Assistência Social</option>
                            {secretarias.map((s) => (
                                <option key={s.id} value={s.nome}>{s.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Status Contratual
                        </label>
                        <select
                            className="input-field"
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                        >
                            <option value="vigente">Vigente</option>
                            <option value="finalizado">Finalizado / Encerrado</option>
                            <option value="cancelado">Rescindido / Cancelado</option>
                        </select>
                    </div>

                    {/* Inteiro Teor do Contrato (Critério 9.2) */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            URL do Inteiro Teor do Contrato Assinado (Critério PNTP 9.2) *
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="https://... ou caminho do arquivo PDF do Contrato Assinado"
                            value={form.instrumentoIntegralUrl}
                            onChange={(e) => setForm({ ...form, instrumentoIntegralUrl: e.target.value })}
                        />
                    </div>
                </div>

                {/* Seção 1: Fiscais do Contrato (Critério 9.3) */}
                <div className="border-t border-gray-100 pt-6 space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                            <FaUserShield className="text-[#1254A3]" /> Fiscais do Contrato e Atos de Designação (PNTP 9.3)
                        </h3>
                        <p className="text-xs text-gray-500">
                            Registre os fiscais designados por portaria, períodos de atuação e eventuais substituições.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Nome do Fiscal *</label>
                            <input
                                type="text"
                                placeholder="Nome completo"
                                value={novoFiscal.nome}
                                onChange={(e) => setNovoFiscal({ ...novoFiscal, nome: e.target.value })}
                                className="input-field text-xs"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Portaria de Designação *</label>
                            <input
                                type="text"
                                placeholder="Ex: Portaria nº 042/2026-GP"
                                value={novoFiscal.portaria}
                                onChange={(e) => setNovoFiscal({ ...novoFiscal, portaria: e.target.value })}
                                className="input-field text-xs"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Período de Atuação</label>
                            <input
                                type="text"
                                placeholder="Ex: 01/01/2026 a 31/12/2026"
                                value={novoFiscal.periodoAtuacao}
                                onChange={(e) => setNovoFiscal({ ...novoFiscal, periodoAtuacao: e.target.value })}
                                className="input-field text-xs"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Tipo / Atuação</label>
                            <div className="flex gap-2">
                                <select
                                    value={novoFiscal.tipo}
                                    onChange={(e) => setNovoFiscal({ ...novoFiscal, tipo: e.target.value as any })}
                                    className="input-field text-xs"
                                >
                                    <option value="titular">Titular</option>
                                    <option value="substituto">Substituto</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={handleAddFiscal}
                                    className="px-3 py-2 bg-[#1254A3] text-white rounded-xl text-xs font-bold hover:bg-blue-800 shrink-0"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>
                    </div>

                    {fiscais.length > 0 && (
                        <div className="space-y-2">
                            {fiscais.map((f, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white text-xs shadow-xs"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                f.tipo === "titular" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                            }`}
                                        >
                                            {f.tipo}
                                        </span>
                                        <span className="font-bold text-gray-800">{f.nome}</span>
                                        <span className="text-gray-500 font-mono">({f.portaria})</span>
                                        <span className="text-gray-400">• {f.periodoAtuacao}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFiscal(idx)}
                                        className="text-rose-500 hover:text-rose-700 p-1"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Seção 2: Termos Aditivos (Critério 9.2) */}
                <div className="border-t border-gray-100 pt-6 space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                            <FaFileContract className="text-[#1254A3]" /> Termos Aditivos ao Contrato (PNTP 9.2)
                        </h3>
                        <p className="text-xs text-gray-500">
                            Vincule aditivos de valor, vigência ou objeto com número, justificativa e link do documento assinado.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Nº do Aditivo *</label>
                            <input
                                type="text"
                                placeholder="Ex: 1º Termo Aditivo"
                                value={novoAditivo.numero}
                                onChange={(e) => setNovoAditivo({ ...novoAditivo, numero: e.target.value })}
                                className="input-field text-xs"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Objeto do Aditivo *</label>
                            <input
                                type="text"
                                placeholder="Ex: Prorrogação de vigência por 12 meses"
                                value={novoAditivo.objeto}
                                onChange={(e) => setNovoAditivo({ ...novoAditivo, objeto: e.target.value })}
                                className="input-field text-xs"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Valor Aditivado (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={novoAditivo.valor}
                                onChange={(e) => setNovoAditivo({ ...novoAditivo, valor: e.target.value })}
                                className="input-field text-xs"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">URL do PDF do Aditivo</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={novoAditivo.url}
                                    onChange={(e) => setNovoAditivo({ ...novoAditivo, url: e.target.value })}
                                    className="input-field text-xs"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddAditivo}
                                    className="px-3 py-2 bg-[#1254A3] text-white rounded-xl text-xs font-bold hover:bg-blue-800 shrink-0"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>
                    </div>

                    {aditivos.length > 0 && (
                        <div className="space-y-2">
                            {aditivos.map((ad, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white text-xs shadow-xs"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-gray-800">{ad.numero}:</span>
                                        <span className="text-gray-600">{ad.objeto}</span>
                                        {ad.valor && <span className="font-bold text-emerald-700">R$ {parseFloat(ad.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAditivo(idx)}
                                        className="text-rose-500 hover:text-rose-700 p-1"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <Link
                        href="/admin/contratos"
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
                        <span>Salvar Contrato</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
