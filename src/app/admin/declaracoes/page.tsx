"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    FaArchive,
    FaCheckCircle,
    FaEdit,
    FaExternalLinkAlt,
    FaFilePdf,
    FaFileUpload,
    FaMagic,
    FaPlus,
    FaSearch,
    FaShieldAlt,
    FaSpinner,
    FaStamp,
    FaTrash,
} from "react-icons/fa";
import AdminModal from "@/components/admin/AdminModal";
import {
    CATALOGO_DECLARACOES_INEXISTENCIA,
    obterModeloDeclaracao,
} from "@/lib/declaracoes-catalogo";
import {
    baixarCertidaoDeclaracaoPDF,
    type DeclaracaoRegistro,
} from "@/components/admin/DeclaracaoInexistenciaBanner";

const COMPETENCIAS_PADRAO = [
    "Exercício Anual",
    "1º Semestre",
    "2º Semestre",
    "1º Quadrimestre",
    "2º Quadrimestre",
    "3º Quadrimestre",
    "Janeiro a Junho",
    "Julho a Dezembro",
    "Últimos 12 Meses",
];

export default function AdminDeclaracoesPage() {
    const anoAtual = new Date().getFullYear();

    const [items, setItems] = useState<DeclaracaoRegistro[]>([]);
    const [loading, setLoading] = useState(true);

    // Filtros
    const [busca, setBusca] = useState("");
    const [filtroModulo, setFiltroModulo] = useState("todos");
    const [filtroExercicio, setFiltroExercicio] = useState("todos");
    const [filtroStatus, setFiltroStatus] = useState<"todas" | "ativas" | "arquivadas">("todas");

    // Modal Emissão / Edição
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [modulo, setModulo] = useState("terceirizados");
    const [criterioPntp, setCriterioPntp] = useState("6.6");
    const [tipoSituacao, setTipoSituacao] = useState("nao_ocorrencia_declarada");
    const [exercicio, setExercicio] = useState(anoAtual);
    const [competencia, setCompetencia] = useState("Exercício Anual");
    const [orgaoResponsavel, setOrgaoResponsavel] = useState("");
    const [responsavelNome, setResponsavelNome] = useState("");
    const [responsavelCargo, setResponsavelCargo] = useState("");
    const [fundamentoLegal, setFundamentoLegal] = useState("");
    const [textoDeclaracao, setTextoDeclaracao] = useState("");
    const [arquivoAssinadoUrl, setArquivoAssinadoUrl] = useState("");
    const [ativa, setAtiva] = useState(true);

    const carregarDados = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/declaracoes", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setItems(Array.isArray(data.items) ? data.items : []);
            } else {
                toast.error("Erro ao carregar declarações.");
            }
        } catch {
            toast.error("Erro de conexão ao carregar declarações.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    const aplicarModelo = (
        slugAlvo: string,
        anoRef = exercicio,
        compRef = competencia
    ) => {
        const mod = obterModeloDeclaracao(slugAlvo);
        setModulo(mod.slug === "geral" ? slugAlvo : mod.slug);
        setCriterioPntp(mod.criterioPntp);
        setOrgaoResponsavel(mod.orgaoResponsavelPadrao);
        setResponsavelNome(mod.responsavelNomePadrao);
        setResponsavelCargo(mod.responsavelCargoPadrao);
        setFundamentoLegal(mod.fundamentoLegalPadrao);
        setTextoDeclaracao(mod.gerarTextoPadrao(anoRef, compRef, mod.orgaoResponsavelPadrao));
    };

    const abrirNovaDeclaracao = (slugInicial = "terceirizados") => {
        setEditingId(null);
        setTipoSituacao("nao_ocorrencia_declarada");
        setExercicio(anoAtual);
        setCompetencia("Exercício Anual");
        setArquivoAssinadoUrl("");
        setAtiva(true);
        aplicarModelo(slugInicial, anoAtual, "Exercício Anual");
        setModalOpen(true);
    };

    const abrirEditarDeclaracao = (d: DeclaracaoRegistro) => {
        const mod = obterModeloDeclaracao(d.modulo || d.criterioPntp);
        setEditingId(d.id);
        setModulo(d.modulo);
        setCriterioPntp(d.criterioPntp || mod.criterioPntp);
        setTipoSituacao(d.tipoSituacao || "nao_ocorrencia_declarada");
        setExercicio(d.exercicio);
        setCompetencia(d.competencia || "Exercício Anual");
        setOrgaoResponsavel(d.orgaoResponsavel);
        setResponsavelNome(d.responsavelNome);
        setResponsavelCargo(d.responsavelCargo || mod.responsavelCargoPadrao);
        setFundamentoLegal(d.fundamentoLegal || mod.fundamentoLegalPadrao);
        setTextoDeclaracao(d.textoDeclaracao);
        setArquivoAssinadoUrl(d.arquivoAssinadoUrl || "");
        setAtiva(Boolean(d.ativa));
        setModalOpen(true);
    };

    const handleUploadArquivo = async (file: File) => {
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (res.ok && data.url) {
                setArquivoAssinadoUrl(data.url);
                toast.success("PDF assinado anexado com sucesso!");
            } else {
                toast.error(data.error || "Falha ao enviar PDF.");
            }
        } catch {
            toast.error("Erro ao enviar arquivo.");
        } finally {
            setUploading(false);
        }
    };

    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!textoDeclaracao.trim()) {
            toast.error("Informe o texto oficial da declaração.");
            return;
        }
        setSaving(true);
        try {
            const url = editingId ? `/api/declaracoes/${editingId}` : "/api/declaracoes";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    modulo,
                    criterioPntp: criterioPntp || null,
                    orgaoResponsavel,
                    exercicio,
                    competencia,
                    tipoSituacao,
                    textoDeclaracao,
                    fundamentoLegal,
                    responsavelNome,
                    responsavelCargo,
                    arquivoAssinadoUrl: arquivoAssinadoUrl || null,
                    ativa,
                    substituirAnteriores: ativa,
                }),
            });

            if (res.ok) {
                toast.success(
                    editingId
                        ? "Declaração atualizada com sucesso!"
                        : "Declaração oficial publicada no Portal!"
                );
                setModalOpen(false);
                carregarDados();
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(err.error || "Erro ao salvar declaração.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleAtiva = async (d: DeclaracaoRegistro) => {
        try {
            const res = await fetch(`/api/declaracoes/${d.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ativa: !d.ativa,
                    substituirAnteriores: !d.ativa,
                }),
            });
            if (res.ok) {
                toast.success(!d.ativa ? "Declaração ativada no Portal!" : "Declaração arquivada.");
                carregarDados();
            } else {
                toast.error("Erro ao alterar status.");
            }
        } catch {
            toast.error("Erro de conexão.");
        }
    };

    const handleExcluir = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta declaração oficial?")) return;
        try {
            const res = await fetch(`/api/declaracoes/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Declaração removida.");
                carregarDados();
            } else {
                toast.error("Erro ao excluir declaração.");
            }
        } catch {
            toast.error("Erro de conexão.");
        }
    };

    const kpis = useMemo(() => {
        const ativas = items.filter((i) => i.ativa);
        const modulosUnicos = new Set(
            ativas
                .filter((i) => i.exercicio === anoAtual)
                .map((i) => obterModeloDeclaracao(i.modulo || i.criterioPntp).slug)
        );
        const ultima = items[0]?.dataConferencia || items[0]?.dataEmissao || null;
        return {
            total: items.length,
            ativas: ativas.length,
            modulosCobertosAno: modulosUnicos.size,
            ultimaData: ultima ? new Date(ultima).toLocaleDateString("pt-BR") : "—",
        };
    }, [items, anoAtual]);

    const slugsAtivosNoAno = useMemo(() => {
        const s = new Set<string>();
        items
            .filter((i) => i.ativa && i.exercicio === anoAtual)
            .forEach((i) => {
                s.add(obterModeloDeclaracao(i.modulo || i.criterioPntp).slug);
            });
        return s;
    }, [items, anoAtual]);

    const anosDisponiveis = useMemo(() => {
        const set = new Set<number>([anoAtual, anoAtual - 1, anoAtual - 2]);
        items.forEach((i) => set.add(i.exercicio));
        return Array.from(set).sort((a, b) => b - a);
    }, [items, anoAtual]);

    const filtradas = useMemo(() => {
        return items.filter((d) => {
            if (filtroStatus === "ativas" && !d.ativa) return false;
            if (filtroStatus === "arquivadas" && d.ativa) return false;
            if (filtroExercicio !== "todos" && String(d.exercicio) !== filtroExercicio) return false;
            if (filtroModulo !== "todos") {
                const mod = obterModeloDeclaracao(d.modulo || d.criterioPntp);
                if (mod.slug !== filtroModulo && d.modulo !== filtroModulo) return false;
            }
            if (busca.trim()) {
                const q = busca.trim().toLowerCase();
                const modTitulo = obterModeloDeclaracao(d.modulo || d.criterioPntp).titulo.toLowerCase();
                return (
                    d.modulo.toLowerCase().includes(q) ||
                    modTitulo.includes(q) ||
                    (d.criterioPntp || "").toLowerCase().includes(q) ||
                    d.orgaoResponsavel.toLowerCase().includes(q) ||
                    d.textoDeclaracao.toLowerCase().includes(q) ||
                    d.responsavelNome.toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [items, filtroStatus, filtroExercicio, filtroModulo, busca]);

    const atalhosPrincipais = CATALOGO_DECLARACOES_INEXISTENCIA.filter((m) => m.slug !== "geral");

    return (
        <div className="space-y-6 pb-16">
            {/* Cabeçalho */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0072CE] text-[10px] font-black uppercase tracking-wider mb-2">
                        <FaShieldAlt /> Governança PNTP 2026 • ATRICON / TCE-RN
                    </div>
                    <h1 className="text-2xl font-black text-[#0F2942] flex items-center gap-2.5">
                        <FaStamp className="text-[#0072CE]" /> Central de Declarações de Inexistência e Não Ocorrência
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Emita, edite, gere certidões em PDF e publique declarações oficiais para os módulos sem fato gerador ou sem ocorrência no período.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2.5 shrink-0">
                    <Link
                        href="/admin/pntp"
                        className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 transition"
                    >
                        <FaShieldAlt className="text-[#0072CE]" /> Painel PNTP
                    </Link>
                    <button
                        type="button"
                        onClick={() => abrirNovaDeclaracao("terceirizados")}
                        className="px-5 py-2.5 rounded-xl bg-[#0072CE] hover:bg-[#005ba6] text-white text-xs font-black flex items-center gap-2 shadow-sm transition cursor-pointer"
                    >
                        <FaPlus /> Nova Declaração Oficial
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                        Total Registrado
                    </span>
                    <div className="text-2xl font-black text-[#0F2942]">{kpis.total}</div>
                    <p className="text-xs text-slate-500 mt-1">Histórico completo auditado</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-blue-200 shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#0072CE] block mb-1">
                        Ativas no Portal Público
                    </span>
                    <div className="text-2xl font-black text-emerald-600">{kpis.ativas}</div>
                    <p className="text-xs text-slate-500 mt-1">Visíveis ao cidadão e ao TCE</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                        Módulos Cobertos ({anoAtual})
                    </span>
                    <div className="text-2xl font-black text-[#0072CE]">{kpis.modulosCobertosAno}</div>
                    <p className="text-xs text-slate-500 mt-1">Com declaração vigente no ano</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                        Última Emissão / Conferência
                    </span>
                    <div className="text-2xl font-black text-amber-600">{kpis.ultimaData}</div>
                    <p className="text-xs text-slate-500 mt-1">Data de referência registrada</p>
                </div>
            </div>

            {/* Atalhos Rápidos 1-Clique por Módulo PNTP */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                <div>
                    <h2 className="text-sm font-black text-[#0F2942] uppercase tracking-tight">
                        Emissão Rápida por Item PNTP (1 Clique)
                    </h2>
                    <p className="text-xs text-slate-500">
                        Clique em um assunto abaixo para abrir o formulário já preenchido com o texto jurídico padrão daquele critério.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {atalhosPrincipais.map((m) => {
                        const ativoNoAno = slugsAtivosNoAno.has(m.slug);
                        return (
                            <button
                                key={m.slug}
                                type="button"
                                onClick={() => abrirNovaDeclaracao(m.slug)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition cursor-pointer ${
                                    ativoNoAno
                                        ? "bg-emerald-50/70 border-emerald-200 text-emerald-900 hover:bg-emerald-100"
                                        : "bg-[#F4F7FB] border-blue-100 text-[#0F2942] hover:border-[#0072CE] hover:bg-blue-50"
                                }`}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full shrink-0 ${
                                        ativoNoAno ? "bg-emerald-500" : "bg-[#FACC15]"
                                    }`}
                                />
                                <span>{m.tituloCurto}</span>
                                {m.criterioPntp && (
                                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-white text-[#0072CE] border border-blue-200">
                                        {m.criterioPntp}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div className="lg:col-span-2">
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">
                            Buscar Declaração
                        </label>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                            <input
                                type="text"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder="Buscar por critério, órgão, responsável ou texto..."
                                className="input-field pl-9 text-xs"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">
                            Módulo / Assunto
                        </label>
                        <select
                            value={filtroModulo}
                            onChange={(e) => setFiltroModulo(e.target.value)}
                            className="input-field text-xs font-semibold cursor-pointer"
                        >
                            <option value="todos">Todos os Módulos</option>
                            {CATALOGO_DECLARACOES_INEXISTENCIA.map((m) => (
                                <option key={m.slug} value={m.slug}>
                                    {m.criterioPntp ? `${m.criterioPntp} — ` : ""}
                                    {m.tituloCurto}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">
                            Exercício
                        </label>
                        <select
                            value={filtroExercicio}
                            onChange={(e) => setFiltroExercicio(e.target.value)}
                            className="input-field text-xs font-semibold cursor-pointer"
                        >
                            <option value="todos">Todos os Exercícios</option>
                            {anosDisponiveis.map((ano) => (
                                <option key={ano} value={String(ano)}>
                                    {ano}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">
                            Situação no Portal
                        </label>
                        <select
                            value={filtroStatus}
                            onChange={(e) =>
                                setFiltroStatus(e.target.value as "todas" | "ativas" | "arquivadas")
                            }
                            className="input-field text-xs font-semibold cursor-pointer"
                        >
                            <option value="todas">Todas ({items.length})</option>
                            <option value="ativas">Somente Ativas</option>
                            <option value="arquivadas">Arquivadas / Histórico</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Lista de Declarações */}
            <div className="space-y-3">
                {loading ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <FaSpinner className="animate-spin inline-block text-2xl text-[#0072CE] mb-2" />
                        <p className="text-xs font-bold text-slate-500">Carregando declarações oficiais...</p>
                    </div>
                ) : filtradas.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0072CE] flex items-center justify-center mx-auto">
                            <FaStamp size={20} />
                        </div>
                        <h3 className="text-sm font-black text-slate-800">
                            Nenhuma declaração encontrada para os filtros selecionados
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                            Use um dos atalhos acima ou clique em &ldquo;Nova Declaração Oficial&rdquo; para emitir uma certidão de inexistência ou não ocorrência.
                        </p>
                    </div>
                ) : (
                    filtradas.map((d) => {
                        const mod = obterModeloDeclaracao(d.modulo || d.criterioPntp);
                        return (
                            <div
                                key={d.id}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-blue-200 transition"
                            >
                                <div className="p-5 flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                    <div className="space-y-2 flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-black text-[#0F2942]">
                                                {mod.slug !== "geral" ? mod.titulo : d.modulo}
                                            </span>
                                            {(d.criterioPntp || mod.criterioPntp) && (
                                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-[#0072CE] border border-blue-200">
                                                    Critério {d.criterioPntp || mod.criterioPntp}
                                                </span>
                                            )}
                                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-[#FACC15]">
                                                Exercício {d.exercicio}
                                                {d.competencia && d.competencia !== String(d.exercicio)
                                                    ? ` • ${d.competencia}`
                                                    : ""}
                                            </span>
                                            <span
                                                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                                                    d.ativa
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : "bg-slate-200 text-slate-600"
                                                }`}
                                            >
                                                {d.ativa ? "Ativa no Portal" : "Arquivada"}
                                            </span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                                {d.tipoSituacao === "nao_aplicavel"
                                                    ? "Não Aplicável"
                                                    : "Não Ocorrência"}
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-700 leading-relaxed bg-[#F4F7FB] p-3.5 rounded-xl border border-slate-100">
                                            “{d.textoDeclaracao}”
                                        </p>

                                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-slate-500">
                                            <span>
                                                <strong>Órgão:</strong> {d.orgaoResponsavel}
                                            </span>
                                            <span>
                                                <strong>Responsável:</strong> {d.responsavelNome}
                                                {d.responsavelCargo ? ` (${d.responsavelCargo})` : ""}
                                            </span>
                                            <span>
                                                <strong>Emitida em:</strong>{" "}
                                                {new Date(d.dataEmissao).toLocaleDateString("pt-BR")}
                                            </span>
                                            {d.fundamentoLegal && (
                                                <span>
                                                    <strong>Base Legal:</strong> {d.fundamentoLegal}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap lg:flex-col items-stretch gap-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => baixarCertidaoDeclaracaoPDF(d, mod.titulo)}
                                            className="px-3.5 py-2 rounded-xl bg-[#F4F7FB] hover:bg-[#0072CE] text-[#0072CE] hover:text-white border border-blue-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                                        >
                                            <FaFilePdf /> Baixar PDF
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => abrirEditarDeclaracao(d)}
                                                className="flex-1 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                                            >
                                                <FaEdit /> Editar
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleToggleAtiva(d)}
                                                className={`flex-1 px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                                                    d.ativa
                                                        ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200"
                                                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
                                                }`}
                                            >
                                                {d.ativa ? <FaArchive /> : <FaCheckCircle />}
                                                {d.ativa ? "Arquivar" : "Ativar"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleExcluir(d.id)}
                                                className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
                                                title="Excluir declaração"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>

                                        <Link
                                            href={mod.rotaPublica}
                                            target="_blank"
                                            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
                                        >
                                            Ver no Portal <FaExternalLinkAlt size={9} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal Emissão / Edição */}
            <AdminModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                subtitle="Controle PNTP 2026 • Ato Formal de Transparência"
                title={
                    editingId
                        ? "Editar Declaração de Inexistência"
                        : "Emitir Declaração de Inexistência / Não Ocorrência"
                }
                icon={
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0072CE] flex items-center justify-center">
                        <FaStamp size={18} />
                    </div>
                }
                maxWidth="2xl"
                footer={
                    <div className="flex flex-wrap items-center justify-between w-full gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                aplicarModelo(modulo, exercicio, competencia);
                                toast.success("Modelo oficial PNTP restaurado!");
                            }}
                            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-[#FACC15] text-amber-900 font-bold text-xs flex items-center gap-1.5 border border-[#FACC15] transition cursor-pointer"
                        >
                            <FaMagic /> Preencher Modelo Oficial PNTP
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="form-central-declaracao"
                                disabled={saving}
                                className="px-5 py-2 rounded-xl bg-[#0072CE] hover:bg-[#005ba6] text-white text-xs font-black flex items-center gap-2 shadow-sm disabled:opacity-60 transition cursor-pointer"
                            >
                                {saving ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                                {editingId ? "Salvar Alterações" : "Publicar Declaração"}
                            </button>
                        </div>
                    </div>
                }
            >
                <form id="form-central-declaracao" onSubmit={handleSalvar} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Módulo / Assunto PNTP *
                            </label>
                            <select
                                value={
                                    CATALOGO_DECLARACOES_INEXISTENCIA.some((m) => m.slug === modulo)
                                        ? modulo
                                        : "geral"
                                }
                                onChange={(e) => {
                                    const novoSlug = e.target.value;
                                    if (!editingId) {
                                        aplicarModelo(novoSlug, exercicio, competencia);
                                    } else {
                                        setModulo(novoSlug);
                                    }
                                }}
                                className="input-field text-xs font-semibold"
                            >
                                {CATALOGO_DECLARACOES_INEXISTENCIA.map((m) => (
                                    <option key={m.slug} value={m.slug}>
                                        {m.criterioPntp ? `Critério ${m.criterioPntp} — ` : ""}
                                        {m.titulo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Tipo de Situação Formal *
                            </label>
                            <select
                                value={tipoSituacao}
                                onChange={(e) => setTipoSituacao(e.target.value)}
                                className="input-field text-xs font-semibold"
                            >
                                <option value="nao_ocorrencia_declarada">
                                    Declaração de Inexistência / Não Ocorrência
                                </option>
                                <option value="nao_aplicavel">
                                    Declaração de Não Aplicabilidade Legal
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Exercício (Ano) *
                            </label>
                            <input
                                type="number"
                                required
                                min={2018}
                                max={2035}
                                value={exercicio}
                                onChange={(e) => setExercicio(Number(e.target.value) || anoAtual)}
                                className="input-field text-xs font-bold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Competência / Período
                            </label>
                            <input
                                type="text"
                                list="competencias-central-list"
                                value={competencia}
                                onChange={(e) => setCompetencia(e.target.value)}
                                className="input-field text-xs"
                            />
                            <datalist id="competencias-central-list">
                                {COMPETENCIAS_PADRAO.map((c) => (
                                    <option key={c} value={c} />
                                ))}
                            </datalist>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Código Critério PNTP
                            </label>
                            <input
                                type="text"
                                value={criterioPntp}
                                onChange={(e) => setCriterioPntp(e.target.value)}
                                placeholder="Ex: 6.6"
                                className="input-field text-xs font-mono"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Órgão / Secretaria Responsável *
                        </label>
                        <input
                            type="text"
                            required
                            value={orgaoResponsavel}
                            onChange={(e) => setOrgaoResponsavel(e.target.value)}
                            className="input-field text-xs"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Autoridade / Responsável *
                            </label>
                            <input
                                type="text"
                                required
                                value={responsavelNome}
                                onChange={(e) => setResponsavelNome(e.target.value)}
                                className="input-field text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Cargo / Função
                            </label>
                            <input
                                type="text"
                                value={responsavelCargo}
                                onChange={(e) => setResponsavelCargo(e.target.value)}
                                className="input-field text-xs"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Fundamento Legal
                        </label>
                        <input
                            type="text"
                            value={fundamentoLegal}
                            onChange={(e) => setFundamentoLegal(e.target.value)}
                            className="input-field text-xs"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Texto Oficial da Declaração *
                        </label>
                        <textarea
                            rows={5}
                            required
                            value={textoDeclaracao}
                            onChange={(e) => setTextoDeclaracao(e.target.value)}
                            className="input-field text-xs leading-relaxed"
                        />
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-[#F4F7FB] p-3.5 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <label className="text-xs font-bold text-slate-700">
                                PDF Assinado Digitalmente (Opcional)
                            </label>
                            <label className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer transition">
                                {uploading ? <FaSpinner className="animate-spin" /> : <FaFileUpload />}
                                {uploading ? "Enviando..." : "Enviar PDF Assinado"}
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    disabled={uploading}
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) handleUploadArquivo(f);
                                    }}
                                />
                            </label>
                        </div>
                        <input
                            type="text"
                            value={arquivoAssinadoUrl}
                            onChange={(e) => setArquivoAssinadoUrl(e.target.value)}
                            placeholder="https://... (deixe em branco para usar o PDF gerado automaticamente)"
                            className="input-field text-xs bg-white"
                        />
                    </div>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={ativa}
                            onChange={(e) => setAtiva(e.target.checked)}
                            className="w-4 h-4 accent-[#0072CE] rounded cursor-pointer"
                        />
                        <span className="text-xs font-bold text-emerald-950">
                            Publicar imediatamente como Declaração Ativa no Portal (arquiva anteriores do mesmo exercício)
                        </span>
                    </label>
                </form>
            </AdminModal>
        </div>
    );
}
