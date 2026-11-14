"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
    FaCapsules,
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaCheckCircle,
    FaExclamationTriangle,
    FaSpinner,
    FaUpload,
    FaEye,
    FaEyeSlash,
    FaFileCsv,
    FaListAlt,
    FaBookMedical,
    FaMagic,
    FaInfoCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import {
    CATALOGO_BASE_SUS,
    CATEGORIAS_MEDICAMENTO_SUGESTOES,
    COMPONENTES_SUS,
    UNIDADES_MEDIDA_SUGESTOES,
} from "@/lib/assistencia-farmaceutica";
import OrientacoesMedicamentosEditor from "@/components/admin/OrientacoesMedicamentosEditor";
import AdminModal from "@/components/admin/AdminModal";

export type MedicamentoAdmin = {
    id: string;
    nome: string;
    principioAtivo: string | null;
    apresentacao: string | null;
    unidadeMedida: string | null;
    categoria: string;
    tipoComponente: string | null;
    quantidadeEstoque: number | null;
    estoqueMinimo: number | null;
    unidadeSaude: string | null;
    loteValidade: string | null;
    status: string;
    observacao: string | null;
    ativo: boolean;
    atualizadoEm?: string;
};

const EMPTY_FORM = {
    nome: "",
    principioAtivo: "",
    apresentacao: "Comprimido 500mg",
    unidadeMedida: "Comprimido",
    categoria: "Analgésico / Antitérmico",
    tipoComponente: "Básico (CBAF)",
    quantidadeEstoque: 0,
    estoqueMinimo: 10,
    unidadeSaude: "CAF / Farmácia Básica Municipal",
    loteValidade: "",
    status: "disponivel",
    observacao: "",
    ativo: true,
};

function getComponenteBadgeClass(componente?: string | null) {
    if (componente === "Especializado (CEAF)") {
        return "bg-purple-100 text-purple-800 border-purple-200";
    }
    if (componente === "Estratégico (CESAF)") {
        return "bg-teal-100 text-teal-800 border-teal-200";
    }
    return "bg-blue-100 text-blue-800 border-blue-200";
}

export default function MedicamentosAdminManager() {
    const [abaAdmin, setAbaAdmin] = useState<"catalogo" | "orientacoes">("catalogo");
    const [medicamentos, setMedicamentos] = useState<MedicamentoAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [filtroComponente, setFiltroComponente] = useState("todos");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MedicamentoAdmin | null>(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchMedicamentos = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/medicamentos", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setMedicamentos(Array.isArray(data) ? data : []);
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(err.error || "Erro ao carregar medicamentos.");
            }
        } catch {
            toast.error("Falha de conexão ao carregar medicamentos.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMedicamentos();
    }, [fetchMedicamentos]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isModalOpen) {
                setIsModalOpen(false);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isModalOpen]);

    const handleOpenModal = (item?: MedicamentoAdmin) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                nome: item.nome,
                principioAtivo: item.principioAtivo || "",
                apresentacao: item.apresentacao || "Comprimido / Frasco",
                unidadeMedida: item.unidadeMedida || "Unidade",
                categoria: item.categoria || "Outro",
                tipoComponente: item.tipoComponente || "Básico (CBAF)",
                quantidadeEstoque: item.quantidadeEstoque ?? 0,
                estoqueMinimo: item.estoqueMinimo ?? 10,
                unidadeSaude: item.unidadeSaude || "CAF / Farmácia Básica Municipal",
                loteValidade: item.loteValidade || "",
                status: item.status || "disponivel",
                observacao: item.observacao || "",
                ativo: item.ativo,
            });
        } else {
            setEditingItem(null);
            setFormData(EMPTY_FORM);
        }
        setIsModalOpen(true);
    };

    const handleComponenteChange = (novoComponente: string) => {
        const next: typeof formData = { ...formData, tipoComponente: novoComponente };
        if (!editingItem) {
            if (novoComponente === "Especializado (CEAF)") {
                next.categoria = "Alto Custo / Especializado (CEAF)";
                next.unidadeSaude = "SMS (Protocolo LME) / UNICAT SESAP-RN";
                next.estoqueMinimo = 0;
                if (!next.observacao) {
                    next.observacao =
                        "Alto Custo (CEAF). Solicitação mediante LME, exames comprobatórios e receita conforme PCDT.";
                }
            } else if (novoComponente === "Estratégico (CESAF)") {
                next.categoria = "Estratégico / Programas de Saúde (CESAF)";
                next.unidadeSaude = "UBS / Vigilância Epidemiológica Municipal";
            } else if (formData.categoria.includes("CEAF") || formData.categoria.includes("CESAF")) {
                next.categoria = "Analgésico / Antitérmico";
                next.unidadeSaude = "CAF / Farmácia Básica Municipal";
            }
        }
        setFormData(next);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nome.trim() || !formData.categoria.trim()) {
            toast.error("Informe o nome e a categoria do medicamento.");
            return;
        }
        setSaving(true);
        try {
            const url = editingItem
                ? `/api/admin/medicamentos/${editingItem.id}`
                : "/api/admin/medicamentos";
            const method = editingItem ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                toast.success(
                    editingItem
                        ? "Medicamento atualizado com sucesso!"
                        : "Medicamento cadastrado com sucesso!"
                );
                setIsModalOpen(false);
                fetchMedicamentos();
            } else {
                toast.error(data.error || "Erro ao salvar medicamento.");
            }
        } catch {
            toast.error("Falha na requisição ao salvar medicamento.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, nome: string) => {
        if (!confirm(`Tem certeza que deseja excluir o medicamento "${nome}" do REMUME?`)) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/medicamentos/${id}`, { method: "DELETE" });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setMedicamentos((prev) => prev.filter((m) => m.id !== id));
                toast.success("Medicamento excluído e removido do portal!");
                fetchMedicamentos();
            } else {
                toast.error(data.error || "Erro ao excluir medicamento.");
            }
        } catch {
            toast.error("Falha de comunicação ao excluir medicamento.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggleAtivo = async (item: MedicamentoAdmin) => {
        try {
            const res = await fetch(`/api/admin/medicamentos/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ativo: !item.ativo }),
            });
            if (res.ok) {
                toast.success(
                    !item.ativo ? "Medicamento ativado no portal." : "Medicamento ocultado do portal."
                );
                fetchMedicamentos();
            } else {
                const data = await res.json().catch(() => ({}));
                toast.error(data.error || "Erro ao alterar visibilidade.");
            }
        } catch {
            toast.error("Falha ao atualizar visibilidade.");
        }
    };

    const handleToggleStatus = async (item: MedicamentoAdmin) => {
        const novoStatus = item.status === "disponivel" ? "indisponivel" : "disponivel";
        try {
            const res = await fetch(`/api/admin/medicamentos/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: novoStatus }),
            });
            if (res.ok) {
                toast.success(
                    novoStatus === "disponivel"
                        ? `${item.nome} marcado como Disponível.`
                        : `${item.nome} marcado como Em Falta.`
                );
                fetchMedicamentos();
            } else {
                const data = await res.json().catch(() => ({}));
                toast.error(data.error || "Erro ao atualizar situação.");
            }
        } catch {
            toast.error("Falha de conexão ao atualizar situação.");
        }
    };

    const handleSeedBaseSus = async () => {
        if (
            !confirm(
                `Deseja importar o elenco padrão SUS (${CATALOGO_BASE_SUS.length} medicamentos entre Básicos CBAF, Alto Custo CEAF e Estratégicos CESAF)? Apenas itens que ainda não existem no cadastro serão adicionados.`
            )
        ) {
            return;
        }
        setSeeding(true);
        try {
            const res = await fetch("/api/admin/medicamentos/seed", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ componente: "todos" }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                if (data.inserted > 0) {
                    toast.success(
                        `Carga concluída: ${data.inserted} medicamento(s) adicionado(s) (${data.skipped} já existiam).`
                    );
                } else {
                    toast.success("Todos os medicamentos do elenco base já estão cadastrados.");
                }
                fetchMedicamentos();
            } else {
                toast.error(data.error || "Erro ao carregar lista padrão SUS.");
            }
        } catch {
            toast.error("Falha de conexão ao importar lista base.");
        } finally {
            setSeeding(false);
        }
    };

    const filtrados = useMemo(() => {
        const term = busca.toLowerCase().trim();
        return medicamentos.filter((item) => {
            const matchStatus =
                filtroStatus === "todos"
                    ? true
                    : filtroStatus === "oculto"
                      ? !item.ativo
                      : item.status === filtroStatus;
            const matchComp =
                filtroComponente === "todos" ||
                (item.tipoComponente || "Básico (CBAF)") === filtroComponente;
            const matchBusca =
                !term ||
                item.nome.toLowerCase().includes(term) ||
                (item.principioAtivo && item.principioAtivo.toLowerCase().includes(term)) ||
                item.categoria.toLowerCase().includes(term) ||
                (item.unidadeSaude && item.unidadeSaude.toLowerCase().includes(term)) ||
                (item.observacao && item.observacao.toLowerCase().includes(term));
            return matchStatus && matchComp && matchBusca;
        });
    }, [medicamentos, filtroStatus, filtroComponente, busca]);

    const kpis = useMemo(() => {
        const total = medicamentos.length;
        const cbaf = medicamentos.filter(
            (m) => (m.tipoComponente || "Básico (CBAF)") === "Básico (CBAF)"
        ).length;
        const ceaf = medicamentos.filter((m) => m.tipoComponente === "Especializado (CEAF)").length;
        const disponiveis = medicamentos.filter(
            (m) => m.ativo && m.status === "disponivel"
        ).length;
        const alertas = medicamentos.filter((m) => !m.ativo || m.status !== "disponivel").length;
        return { total, cbaf, ceaf, disponiveis, alertas };
    }, [medicamentos]);

    const handleExportCsv = () => {
        const headers = [
            "Nome",
            "Principio Ativo",
            "Apresentacao",
            "Unidade",
            "Categoria",
            "Componente SUS",
            "Qtd Estoque",
            "Estoque Minimo",
            "Status",
            "Visivel Portal",
            "Unidade Saude",
            "Lote / Validade",
            "Observacao",
        ];
        const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
        const rows = filtrados.map((m) => [
            escape(m.nome),
            escape(m.principioAtivo),
            escape(m.apresentacao),
            escape(m.unidadeMedida),
            escape(m.categoria),
            escape(m.tipoComponente || "Básico (CBAF)"),
            escape(m.quantidadeEstoque ?? 0),
            escape(m.estoqueMinimo ?? 0),
            escape(m.status),
            escape(m.ativo ? "Sim" : "Não"),
            escape(m.unidadeSaude),
            escape(m.loteValidade),
            escape(m.observacao),
        ]);
        const csv = "\uFEFF" + [headers.map(escape).join(";"), ...rows.map((r) => r.join(";"))].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `remume-medicamentos-sus-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Planilha CSV exportada com sucesso!");
    };

    return (
        <div className="space-y-6">
            {/* Navegação Principal do Módulo Farmacêutico */}
            <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() => setAbaAdmin("catalogo")}
                    className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                        abaAdmin === "catalogo"
                            ? "bg-[#003366] text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    <FaListAlt /> Lista de Medicamentos SUS (REMUME & Alto Custo)
                </button>
                <button
                    type="button"
                    onClick={() => setAbaAdmin("orientacoes")}
                    className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                        abaAdmin === "orientacoes"
                            ? "bg-[#003366] text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    <FaBookMedical /> Como Obter Medicamentos (Básicos e Alto Custo / CEAF)
                </button>
            </div>

            {abaAdmin === "orientacoes" ? (
                <OrientacoesMedicamentosEditor />
            ) : (
                <>
                    {/* Cabeçalho da Lista REMUME */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                                <FaCapsules className="text-emerald-600" /> Relação de Medicamentos SUS e Estoques (REMUME)
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Gerencie os componentes Básico (CBAF), Alto Custo (CEAF) e Estratégico (CESAF). Alterações refletem imediatamente em{" "}
                                <Link
                                    href="/transparencia/saude"
                                    target="_blank"
                                    className="text-[#003366] font-bold underline"
                                >
                                    /transparencia/saude
                                </Link>{" "}
                                e{" "}
                                <Link
                                    href="/transparencia/medicamentos-sus"
                                    target="_blank"
                                    className="text-[#003366] font-bold underline"
                                >
                                    /transparencia/medicamentos-sus
                                </Link>
                                .
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={handleSeedBaseSus}
                                disabled={seeding}
                                className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50"
                                title="Insere o elenco padrão SUS (CBAF + Alto Custo CEAF + Estratégicos) sem duplicar itens já cadastrados"
                            >
                                {seeding ? <FaSpinner className="animate-spin" /> : <FaMagic />}
                                Carregar Lista Padrão SUS
                            </button>
                            <button
                                type="button"
                                onClick={handleExportCsv}
                                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                            >
                                <FaFileCsv /> Exportar CSV
                            </button>
                            <Link
                                href="/admin/importacao"
                                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                            >
                                <FaUpload /> Importar CSV
                            </Link>
                            <button
                                type="button"
                                onClick={() => handleOpenModal()}
                                className="px-5 py-2.5 bg-[#50B749] hover:bg-[#439c3d] text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-95"
                            >
                                <FaPlus /> Novo Medicamento
                            </button>
                        </div>
                    </div>

                    {/* KPIs do Elenco */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                            <div className="text-[10px] font-black uppercase text-gray-400">Total Cadastrado</div>
                            <div className="text-2xl font-black text-gray-900 mt-1">{kpis.total}</div>
                        </div>
                        <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
                            <div className="text-[10px] font-black uppercase text-blue-600">Básico (CBAF)</div>
                            <div className="text-2xl font-black text-blue-900 mt-1">{kpis.cbaf}</div>
                        </div>
                        <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm">
                            <div className="text-[10px] font-black uppercase text-purple-600">Alto Custo (CEAF)</div>
                            <div className="text-2xl font-black text-purple-900 mt-1">{kpis.ceaf}</div>
                        </div>
                        <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
                            <div className="text-[10px] font-black uppercase text-emerald-600">Ativos & Disponíveis</div>
                            <div className="text-2xl font-black text-emerald-800 mt-1">{kpis.disponiveis}</div>
                        </div>
                        <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm">
                            <div className="text-[10px] font-black uppercase text-amber-600">Em Falta / Ocultos</div>
                            <div className="text-2xl font-black text-amber-800 mt-1">{kpis.alertas}</div>
                        </div>
                    </div>

                    {/* Barra de Filtros */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-2">
                                {[
                                    { id: "todos", label: `Todos (${medicamentos.length})` },
                                    { id: "disponivel", label: "Disponíveis" },
                                    { id: "indisponivel", label: "Em Falta" },
                                    { id: "oculto", label: "Ocultos do Portal" },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setFiltroStatus(tab.id)}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                            filtroStatus === tab.id
                                                ? "bg-[#003366] text-white shadow-sm"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="relative w-full lg:w-80">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="text"
                                    placeholder="Buscar medicamento, princípio ativo, unidade..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#003366]"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
                            <span className="text-[10px] font-black uppercase text-gray-400 mr-1">
                                Componente SUS:
                            </span>
                            {["todos", ...COMPONENTES_SUS].map((comp) => (
                                <button
                                    key={comp}
                                    type="button"
                                    onClick={() => setFiltroComponente(comp)}
                                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                                        filtroComponente === comp
                                            ? "bg-slate-900 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                >
                                    {comp === "todos" ? "Todos os Componentes" : comp}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tabela */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="p-12 text-center text-gray-400 space-y-2">
                                <FaSpinner className="animate-spin text-2xl text-[#003366] mx-auto" />
                                <p className="text-xs font-bold uppercase tracking-wider">
                                    Carregando catálogo REMUME...
                                </p>
                            </div>
                        ) : filtrados.length === 0 ? (
                            <div className="p-12 text-center text-gray-400 space-y-3">
                                <p className="text-sm font-bold text-gray-600">
                                    Nenhum medicamento encontrado.
                                </p>
                                <p className="text-xs">
                                    Cadastre um item manualmente, carregue a Lista Padrão SUS ou importe via planilha CSV.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <th className="px-6 py-4">Medicamento / Princípio Ativo</th>
                                            <th className="px-6 py-4">Categoria / Componente</th>
                                            <th className="px-6 py-4">Estoque / Local</th>
                                            <th className="px-6 py-4">Situação</th>
                                            <th className="px-6 py-4 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-xs">
                                        {filtrados.map((item) => {
                                            const qty = item.quantidadeEstoque ?? 0;
                                            const min = item.estoqueMinimo ?? 0;
                                            const estoqueCritico =
                                                item.status === "disponivel" &&
                                                qty > 0 &&
                                                min > 0 &&
                                                qty <= min;

                                            return (
                                                <tr
                                                    key={item.id}
                                                    className={`hover:bg-blue-50/20 ${
                                                        !item.ativo ? "opacity-60 bg-gray-50/50" : ""
                                                    }`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900">{item.nome}</div>
                                                        {item.principioAtivo && (
                                                            <div className="text-[11px] text-gray-500">
                                                                {item.principioAtivo}
                                                            </div>
                                                        )}
                                                        <div className="text-[10px] text-gray-400 mt-0.5">
                                                            {item.apresentacao} • {item.unidadeMedida}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 space-y-1">
                                                        <span className="inline-block bg-gray-100 text-gray-700 font-bold px-2.5 py-1 rounded-lg text-[10px] uppercase">
                                                            {item.categoria}
                                                        </span>
                                                        <div>
                                                            <span
                                                                className={`inline-block border font-bold px-2 py-0.5 rounded-md text-[10px] ${getComponenteBadgeClass(
                                                                    item.tipoComponente
                                                                )}`}
                                                            >
                                                                {item.tipoComponente || "Básico (CBAF)"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-black text-gray-800 flex items-center gap-2">
                                                            <span>
                                                                {qty} {item.unidadeMedida || "un"}
                                                            </span>
                                                            {estoqueCritico && (
                                                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-black uppercase">
                                                                    Baixo
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] text-gray-500 truncate max-w-[220px]">
                                                            {item.unidadeSaude || "Farmácia Básica"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleToggleStatus(item)}
                                                                title="Clique para alternar Disponível / Em Falta"
                                                                className="text-left"
                                                            >
                                                                {item.status === "disponivel" ? (
                                                                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] hover:underline">
                                                                        <FaCheckCircle /> Disponível
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1.5 text-amber-600 font-bold text-[11px] hover:underline">
                                                                        <FaExclamationTriangle /> Em Falta
                                                                    </span>
                                                                )}
                                                            </button>
                                                            <div className="text-[10px] font-bold text-gray-400">
                                                                {item.ativo ? "Visível no Portal" : "Oculto"}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="inline-flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleToggleAtivo(item)}
                                                                title={
                                                                    item.ativo
                                                                        ? "Ocultar do portal"
                                                                        : "Exibir no portal"
                                                                }
                                                                className="p-2 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 rounded-lg transition-colors"
                                                            >
                                                                {item.ativo ? <FaEye /> : <FaEyeSlash />}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenModal(item)}
                                                                title="Editar medicamento"
                                                                className="p-2 bg-gray-100 hover:bg-amber-100 text-gray-600 hover:text-amber-700 rounded-lg transition-colors"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(item.id, item.nome)}
                                                                disabled={deletingId === item.id}
                                                                title="Excluir medicamento"
                                                                className="p-2 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-700 rounded-lg transition-colors disabled:opacity-50"
                                                            >
                                                                {deletingId === item.id ? (
                                                                    <FaSpinner className="animate-spin" />
                                                                ) : (
                                                                    <FaTrash />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Modal Cadastro / Edição */}
            <AdminModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                subtitle="Assistência Farmacêutica SUS"
                title={editingItem ? "Editar Medicamento (REMUME)" : "Novo Medicamento (REMUME)"}
                maxWidth="2xl"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs uppercase"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="form-medicamento-admin"
                            disabled={saving}
                            className="px-6 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-black rounded-xl text-xs uppercase disabled:opacity-50"
                        >
                            {saving ? "Salvando..." : editingItem ? "Salvar Alterações" : "Cadastrar"}
                        </button>
                    </>
                }
            >
                        {formData.tipoComponente === "Especializado (CEAF)" && (
                            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-purple-900">
                                <FaInfoCircle className="text-purple-700 shrink-0 mt-0.5" size={16} />
                                <div>
                                    <span className="font-black uppercase">
                                        Medicamento de Alto Custo (CEAF):
                                    </span>{" "}
                                    Informe na observação os requisitos do PCDT (ex: LME, exames comprobatórios, TER) e indique o fluxo via Secretaria de Saúde / UNICAT-SESAP.
                                </div>
                            </div>
                        )}

                        <form id="form-medicamento-admin" onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                        Nome / Denominação *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        placeholder="Ex: Losartana Potássica 50mg"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                        Princípio Ativo (DCB)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.principioAtivo}
                                        onChange={(e) =>
                                            setFormData({ ...formData, principioAtivo: e.target.value })
                                        }
                                        placeholder="Ex: Losartana potássica"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                        Componente SUS
                                    </label>
                                    <select
                                        value={formData.tipoComponente}
                                        onChange={(e) => handleComponenteChange(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
                                    >
                                        {COMPONENTES_SUS.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                        Categoria *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        list="med-categorias-sugestoes"
                                        value={formData.categoria}
                                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                        placeholder="Ex: Anti-hipertensivo"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                    <datalist id="med-categorias-sugestoes">
                                        {CATEGORIAS_MEDICAMENTO_SUGESTOES.map((cat) => (
                                            <option key={cat} value={cat} />
                                        ))}
                                    </datalist>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                        Apresentação
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.apresentacao}
                                        onChange={(e) =>
                                            setFormData({ ...formData, apresentacao: e.target.value })
                                        }
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                        Qtd. em Estoque
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={formData.quantidadeEstoque}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                quantidadeEstoque: Math.max(0, parseInt(e.target.value, 10) || 0),
                                            })
                                        }
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                        Estoque Mínimo
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={formData.estoqueMinimo}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                estoqueMinimo: Math.max(0, parseInt(e.target.value, 10) || 0),
                                            })
                                        }
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                        Unidade de Medida
                                    </label>
                                    <input
                                        type="text"
                                        list="med-unidades-sugestoes"
                                        value={formData.unidadeMedida}
                                        onChange={(e) =>
                                            setFormData({ ...formData, unidadeMedida: e.target.value })
                                        }
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                    <datalist id="med-unidades-sugestoes">
                                        {UNIDADES_MEDIDA_SUGESTOES.map((u) => (
                                            <option key={u} value={u} />
                                        ))}
                                    </datalist>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                        Situação
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    >
                                        <option value="disponivel">Disponível</option>
                                        <option value="indisponivel">Em Falta / Indisponível</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                        Local / Unidade de Saúde
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.unidadeSaude}
                                        onChange={(e) =>
                                            setFormData({ ...formData, unidadeSaude: e.target.value })
                                        }
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                        Lote / Validade
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.loteValidade}
                                        onChange={(e) =>
                                            setFormData({ ...formData, loteValidade: e.target.value })
                                        }
                                        placeholder="Ex: Lote 1234 • Val. 12/2027"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                    Observações e Critérios ao Cidadão
                                </label>
                                <textarea
                                    rows={2}
                                    value={formData.observacao}
                                    onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                                    placeholder="Ex: Exige receita em 2 vias / Para Alto Custo informar necessidade de LME + PCDT"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="medAtivoCheck"
                                    checked={formData.ativo}
                                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                                    className="w-4 h-4 text-[#003366] rounded"
                                />
                                <label
                                    htmlFor="medAtivoCheck"
                                    className="text-xs font-bold text-gray-700 uppercase cursor-pointer"
                                >
                                    Medicamento Ativo e Visível no Portal
                                </label>
                            </div>
                        </form>
            </AdminModal>
        </div>
    );
}
