"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    FaPlus,
    FaTrash,
    FaSave,
    FaUndo,
    FaSpinner,
    FaExternalLinkAlt,
    FaCapsules,
    FaShieldAlt,
    FaNotesMedical,
    FaCheckSquare,
} from "react-icons/fa";
import toast from "react-hot-toast";
import {
    DEFAULT_ORIENTACOES_MEDICAMENTOS,
    type BlocoComponenteOrientacao,
    type OrientacoesMedicamentosSUS,
} from "@/lib/assistencia-farmaceutica";

function BlocoOrientacaoForm({
    bloco,
    onChange,
    accentLabel,
}: {
    bloco: BlocoComponenteOrientacao;
    onChange: (updated: BlocoComponenteOrientacao) => void;
    accentLabel: string;
}) {
    const updateField = <K extends keyof BlocoComponenteOrientacao>(
        key: K,
        value: BlocoComponenteOrientacao[K]
    ) => {
        onChange({ ...bloco, [key]: value });
    };

    const addLocal = () => {
        updateField("locaisDispensacao", [...bloco.locaisDispensacao, ""]);
    };

    const updateLocal = (idx: number, value: string) => {
        const next = [...bloco.locaisDispensacao];
        next[idx] = value;
        updateField("locaisDispensacao", next);
    };

    const removeLocal = (idx: number) => {
        if (bloco.locaisDispensacao.length <= 1) return;
        updateField(
            "locaisDispensacao",
            bloco.locaisDispensacao.filter((_, i) => i !== idx)
        );
    };

    const addEtapa = () => {
        updateField("etapas", [
            ...bloco.etapas,
            { id: `etapa-${Date.now()}`, titulo: "", descricao: "" },
        ]);
    };

    const updateEtapa = (idx: number, field: "titulo" | "descricao", value: string) => {
        const next = bloco.etapas.map((e, i) => (i === idx ? { ...e, [field]: value } : e));
        updateField("etapas", next);
    };

    const removeEtapa = (idx: number) => {
        if (bloco.etapas.length <= 1) return;
        updateField(
            "etapas",
            bloco.etapas.filter((_, i) => i !== idx)
        );
    };

    const addDocumento = () => {
        updateField("documentosExigidos", [
            ...bloco.documentosExigidos,
            { id: `doc-${Date.now()}`, titulo: "", descricao: "", obrigatorio: true },
        ]);
    };

    const updateDocumento = (
        idx: number,
        field: "titulo" | "descricao" | "obrigatorio",
        value: string | boolean
    ) => {
        const next = bloco.documentosExigidos.map((d, i) =>
            i === idx ? { ...d, [field]: value } : d
        );
        updateField("documentosExigidos", next);
    };

    const removeDocumento = (idx: number) => {
        if (bloco.documentosExigidos.length <= 1) return;
        updateField(
            "documentosExigidos",
            bloco.documentosExigidos.filter((_, i) => i !== idx)
        );
    };

    const addObs = () => {
        updateField("observacoesImportantes", [...bloco.observacoesImportantes, ""]);
    };

    const updateObs = (idx: number, value: string) => {
        const next = [...bloco.observacoesImportantes];
        next[idx] = value;
        updateField("observacoesImportantes", next);
    };

    const removeObs = (idx: number) => {
        if (bloco.observacoesImportantes.length <= 1) return;
        updateField(
            "observacoesImportantes",
            bloco.observacoesImportantes.filter((_, i) => i !== idx)
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#003366]">
                    Identificação & Atendimento — {accentLabel}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Título da Seção *
                        </label>
                        <input
                            type="text"
                            value={bloco.titulo}
                            onChange={(e) => updateField("titulo", e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Subtítulo / Selo Oficial
                        </label>
                        <input
                            type="text"
                            value={bloco.subtitulo}
                            onChange={(e) => updateField("subtitulo", e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Descrição Geral ao Cidadão
                    </label>
                    <textarea
                        rows={3}
                        value={bloco.descricaoGeral}
                        onChange={(e) => updateField("descricaoGeral", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Custo / Gratuidade
                        </label>
                        <input
                            type="text"
                            value={bloco.custoCidadao}
                            onChange={(e) => updateField("custoCidadao", e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Horário de Atendimento
                        </label>
                        <input
                            type="text"
                            value={bloco.horarioAtendimento}
                            onChange={(e) => updateField("horarioAtendimento", e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Prazo / Fluxo Estimado
                        </label>
                        <input
                            type="text"
                            value={bloco.prazoEstimado}
                            onChange={(e) => updateField("prazoEstimado", e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Endereço Principal
                        </label>
                        <input
                            type="text"
                            value={bloco.enderecoPrincipal}
                            onChange={(e) => updateField("enderecoPrincipal", e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Telefone / WhatsApp
                        </label>
                        <input
                            type="text"
                            value={bloco.contatoTelefone}
                            onChange={(e) => updateField("contatoTelefone", e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            E-mail de Atendimento
                        </label>
                        <input
                            type="email"
                            value={bloco.contatoEmail}
                            onChange={(e) => updateField("contatoEmail", e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Texto do Link Externo (Opcional)
                        </label>
                        <input
                            type="text"
                            value={bloco.linkExternoLabel || ""}
                            onChange={(e) => updateField("linkExternoLabel", e.target.value)}
                            placeholder="Ex: Protocolos Clínicos (PCDT) — Ministério da Saúde"
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            URL do Link Externo (Opcional)
                        </label>
                        <input
                            type="text"
                            value={bloco.linkExternoUrl || ""}
                            onChange={(e) => updateField("linkExternoUrl", e.target.value)}
                            placeholder="https://www.gov.br/..."
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Locais de Dispensação */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase text-gray-800">
                        Locais de Retirada / Protocolo
                    </h4>
                    <button
                        type="button"
                        onClick={addLocal}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#003366] font-bold rounded-lg text-[11px] flex items-center gap-1.5"
                    >
                        <FaPlus size={10} /> Adicionar Local
                    </button>
                </div>
                <div className="space-y-2">
                    {bloco.locaisDispensacao.map((local, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={local}
                                onChange={(e) => updateLocal(idx, e.target.value)}
                                placeholder="Ex: Unidades Básicas de Saúde (UBS)"
                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => removeLocal(idx)}
                                disabled={bloco.locaisDispensacao.length <= 1}
                                className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-30"
                                title="Remover local"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Etapas / Passo a Passo */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase text-gray-800">
                        Etapas do Atendimento (Passo a Passo)
                    </h4>
                    <button
                        type="button"
                        onClick={addEtapa}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#003366] font-bold rounded-lg text-[11px] flex items-center gap-1.5"
                    >
                        <FaPlus size={10} /> Adicionar Etapa
                    </button>
                </div>
                <div className="space-y-3">
                    {bloco.etapas.map((etapa, idx) => (
                        <div
                            key={etapa.id}
                            className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-[#003366] text-white">
                                    Etapa {String(idx + 1).padStart(2, "0")}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeEtapa(idx)}
                                    disabled={bloco.etapas.length <= 1}
                                    className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-30"
                                    title="Remover etapa"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={etapa.titulo}
                                onChange={(e) => updateEtapa(idx, "titulo", e.target.value)}
                                placeholder="Título da etapa"
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                            />
                            <textarea
                                rows={2}
                                value={etapa.descricao}
                                onChange={(e) => updateEtapa(idx, "descricao", e.target.value)}
                                placeholder="Descrição detalhada do que o cidadão deve fazer..."
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Documentos Exigidos */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase text-gray-800">
                        Documentos Necessários
                    </h4>
                    <button
                        type="button"
                        onClick={addDocumento}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[11px] flex items-center gap-1.5"
                    >
                        <FaPlus size={10} /> Adicionar Documento
                    </button>
                </div>
                <div className="space-y-3">
                    {bloco.documentosExigidos.map((doc, idx) => (
                        <div
                            key={doc.id}
                            className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-2"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <label className="inline-flex items-center gap-2 text-[11px] font-bold text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={doc.obrigatorio}
                                        onChange={(e) => updateDocumento(idx, "obrigatorio", e.target.checked)}
                                        className="w-3.5 h-3.5 text-emerald-600 rounded"
                                    />
                                    <FaCheckSquare className="text-emerald-600" /> Documento Obrigatório
                                </label>
                                <button
                                    type="button"
                                    onClick={() => removeDocumento(idx)}
                                    disabled={bloco.documentosExigidos.length <= 1}
                                    className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-30"
                                    title="Remover documento"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={doc.titulo}
                                onChange={(e) => updateDocumento(idx, "titulo", e.target.value)}
                                placeholder="Ex: LME — Laudo de Solicitação de Medicamento"
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                            />
                            <textarea
                                rows={2}
                                value={doc.descricao}
                                onChange={(e) => updateDocumento(idx, "descricao", e.target.value)}
                                placeholder="Detalhes, validade ou orientações para o documento..."
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Observações Importantes */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase text-gray-800">
                        Observações e Regras Importantes
                    </h4>
                    <button
                        type="button"
                        onClick={addObs}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg text-[11px] flex items-center gap-1.5"
                    >
                        <FaPlus size={10} /> Adicionar Observação
                    </button>
                </div>
                <div className="space-y-2">
                    {bloco.observacoesImportantes.map((obs, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                            <textarea
                                rows={2}
                                value={obs}
                                onChange={(e) => updateObs(idx, e.target.value)}
                                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                            />
                            <button
                                type="button"
                                onClick={() => removeObs(idx)}
                                disabled={bloco.observacoesImportantes.length <= 1}
                                className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-30 mt-1"
                                title="Remover observação"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function OrientacoesMedicamentosEditor() {
    const [orientacoes, setOrientacoes] = useState<OrientacoesMedicamentosSUS>(
        DEFAULT_ORIENTACOES_MEDICAMENTOS
    );
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [subTab, setSubTab] = useState<"cbaf" | "ceaf" | "cesaf">("cbaf");

    const fetchOrientacoes = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/medicamentos/orientacoes", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setOrientacoes(data);
            } else {
                toast.error("Erro ao carregar orientações cadastradas.");
            }
        } catch {
            toast.error("Falha de comunicação ao buscar orientações.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrientacoes();
    }, [fetchOrientacoes]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/admin/medicamentos/orientacoes", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orientacoes),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setOrientacoes(data);
                toast.success("Orientações atualizadas e publicadas no portal com sucesso!");
            } else {
                toast.error(data.error || "Erro ao salvar orientações.");
            }
        } catch {
            toast.error("Falha de conexão ao salvar orientações.");
        } finally {
            setSaving(false);
        }
    };

    const handleResetDefaults = () => {
        if (
            !confirm(
                "Deseja restaurar o texto padrão municipal de orientações para medicamentos básicos (CBAF), alto custo (CEAF) e estratégicos? Clique em Salvar Orientações em seguida para publicar."
            )
        ) {
            return;
        }
        setOrientacoes(DEFAULT_ORIENTACOES_MEDICAMENTOS);
        toast.success("Modelo padrão restaurado no formulário. Clique em Salvar para aplicar no site.");
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center text-gray-400 space-y-2">
                <FaSpinner className="animate-spin text-2xl text-[#003366] mx-auto" />
                <p className="text-xs font-bold uppercase tracking-wider">
                    Carregando guia de acesso e alto custo...
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                        Guia de Acesso: Como Obter Medicamentos (Básicos e Alto Custo)
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Edite etapas, documentos exigidos (receita, Cartão SUS, LME, PCDT, exames, procuração), endereços e horários exibidos no portal.
                    </p>
                    {orientacoes.atualizadoEm && (
                        <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                            Última atualização: {new Date(orientacoes.atualizadoEm).toLocaleString("pt-BR")}
                            {orientacoes.atualizadoPor ? ` • por ${orientacoes.atualizadoPor}` : ""}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href="/transparencia/medicamentos-sus?aba=como-obter"
                        target="_blank"
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5"
                    >
                        <FaExternalLinkAlt size={11} /> Ver Básicos no Site
                    </Link>
                    <Link
                        href="/transparencia/medicamentos-sus?aba=especializado"
                        target="_blank"
                        className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold rounded-xl text-xs flex items-center gap-1.5"
                    >
                        <FaExternalLinkAlt size={11} /> Ver Alto Custo no Site
                    </Link>
                    <button
                        type="button"
                        onClick={handleResetDefaults}
                        className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs flex items-center gap-1.5"
                    >
                        <FaUndo size={11} /> Restaurar Padrão
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-black rounded-xl text-xs uppercase flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        {saving ? "Salvando..." : "Salvar Orientações"}
                    </button>
                </div>
            </div>

            {/* Sub-navegação de Componentes SUS */}
            <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                <button
                    type="button"
                    onClick={() => setSubTab("cbaf")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                        subTab === "cbaf"
                            ? "bg-[#003366] text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    <FaCapsules /> Medicamentos Básicos (CBAF / REMUME)
                </button>
                <button
                    type="button"
                    onClick={() => setSubTab("ceaf")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                        subTab === "ceaf"
                            ? "bg-purple-700 text-white shadow-sm"
                            : "bg-purple-50 text-purple-800 hover:bg-purple-100"
                    }`}
                >
                    <FaNotesMedical /> Alto Custo / Especializado (CEAF / LME)
                </button>
                <button
                    type="button"
                    onClick={() => setSubTab("cesaf")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                        subTab === "cesaf"
                            ? "bg-emerald-700 text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    <FaShieldAlt /> Estratégico (CESAF) & Base Legal
                </button>
            </div>

            {subTab === "cbaf" && (
                <BlocoOrientacaoForm
                    bloco={orientacoes.cbaf}
                    accentLabel="Atenção Básica (CBAF)"
                    onChange={(cbaf) => setOrientacoes({ ...orientacoes, cbaf })}
                />
            )}

            {subTab === "ceaf" && (
                <BlocoOrientacaoForm
                    bloco={orientacoes.ceaf}
                    accentLabel="Alto Custo (CEAF / LME / UNICAT)"
                    onChange={(ceaf) => setOrientacoes({ ...orientacoes, ceaf })}
                />
            )}

            {subTab === "cesaf" && (
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                        <h3 className="text-sm font-black uppercase text-gray-800">
                            Componente Estratégico (CESAF) — Programas Especiais do Ministério da Saúde
                        </h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                Título
                            </label>
                            <input
                                type="text"
                                value={orientacoes.cesaf.titulo}
                                onChange={(e) =>
                                    setOrientacoes({
                                        ...orientacoes,
                                        cesaf: { ...orientacoes.cesaf, titulo: e.target.value },
                                    })
                                }
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                Resumo de Funcionamento
                            </label>
                            <textarea
                                rows={3}
                                value={orientacoes.cesaf.resumo}
                                onChange={(e) =>
                                    setOrientacoes({
                                        ...orientacoes,
                                        cesaf: { ...orientacoes.cesaf, resumo: e.target.value },
                                    })
                                }
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                Onde Retirar / Fluxo Municipal
                            </label>
                            <input
                                type="text"
                                value={orientacoes.cesaf.ondeRetirar}
                                onChange={(e) =>
                                    setOrientacoes({
                                        ...orientacoes,
                                        cesaf: { ...orientacoes.cesaf, ondeRetirar: e.target.value },
                                    })
                                }
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-gray-700 uppercase">
                                    Programas Cobertos (um por item)
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOrientacoes({
                                            ...orientacoes,
                                            cesaf: {
                                                ...orientacoes.cesaf,
                                                exemplosProgramas: [...orientacoes.cesaf.exemplosProgramas, ""],
                                            },
                                        })
                                    }
                                    className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-[11px] flex items-center gap-1"
                                >
                                    <FaPlus size={10} /> Adicionar Programa
                                </button>
                            </div>
                            {orientacoes.cesaf.exemplosProgramas.map((prog, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={prog}
                                        onChange={(e) => {
                                            const next = [...orientacoes.cesaf.exemplosProgramas];
                                            next[idx] = e.target.value;
                                            setOrientacoes({
                                                ...orientacoes,
                                                cesaf: { ...orientacoes.cesaf, exemplosProgramas: next },
                                            });
                                        }}
                                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (orientacoes.cesaf.exemplosProgramas.length <= 1) return;
                                            setOrientacoes({
                                                ...orientacoes,
                                                cesaf: {
                                                    ...orientacoes.cesaf,
                                                    exemplosProgramas: orientacoes.cesaf.exemplosProgramas.filter(
                                                        (_, i) => i !== idx
                                                    ),
                                                },
                                            });
                                        }}
                                        className="p-2 text-gray-400 hover:text-red-600"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                        <h3 className="text-sm font-black uppercase text-gray-800">
                            Canais de Ouvidoria, Links Oficiais SUS e Fundamentação Legal
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                    Telefone Ouvidoria / Assistência Farmacêutica
                                </label>
                                <input
                                    type="text"
                                    value={orientacoes.canaisApoio.telefoneOuvidoria}
                                    onChange={(e) =>
                                        setOrientacoes({
                                            ...orientacoes,
                                            canaisApoio: {
                                                ...orientacoes.canaisApoio,
                                                telefoneOuvidoria: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                    E-mail da Ouvidoria / Saúde
                                </label>
                                <input
                                    type="email"
                                    value={orientacoes.canaisApoio.emailOuvidoria}
                                    onChange={(e) =>
                                        setOrientacoes({
                                            ...orientacoes,
                                            canaisApoio: {
                                                ...orientacoes.canaisApoio,
                                                emailOuvidoria: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                    Endereço Secretaria Municipal de Saúde
                                </label>
                                <input
                                    type="text"
                                    value={orientacoes.canaisApoio.enderecoSms}
                                    onChange={(e) =>
                                        setOrientacoes({
                                            ...orientacoes,
                                            canaisApoio: {
                                                ...orientacoes.canaisApoio,
                                                enderecoSms: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                    Horário da Secretaria de Saúde
                                </label>
                                <input
                                    type="text"
                                    value={orientacoes.canaisApoio.horarioSms}
                                    onChange={(e) =>
                                        setOrientacoes({
                                            ...orientacoes,
                                            canaisApoio: {
                                                ...orientacoes.canaisApoio,
                                                horarioSms: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                    Link Oficial RENAME (MS)
                                </label>
                                <input
                                    type="text"
                                    value={orientacoes.canaisApoio.linkRenameOficial}
                                    onChange={(e) =>
                                        setOrientacoes({
                                            ...orientacoes,
                                            canaisApoio: {
                                                ...orientacoes.canaisApoio,
                                                linkRenameOficial: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                    Link Oficial PCDT (MS)
                                </label>
                                <input
                                    type="text"
                                    value={orientacoes.canaisApoio.linkPcdtOficial}
                                    onChange={(e) =>
                                        setOrientacoes({
                                            ...orientacoes,
                                            canaisApoio: {
                                                ...orientacoes.canaisApoio,
                                                linkPcdtOficial: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                Fundamentação Legal (Rodapé do Guia)
                            </label>
                            <textarea
                                rows={2}
                                value={orientacoes.canaisApoio.fundamentacaoLegal}
                                onChange={(e) =>
                                    setOrientacoes({
                                        ...orientacoes,
                                        canaisApoio: {
                                            ...orientacoes.canaisApoio,
                                            fundamentacaoLegal: e.target.value,
                                        },
                                    })
                                }
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                            />
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
