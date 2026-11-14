"use client";

import { useEffect, useMemo, useState } from "react";
import {
    FaCalendarAlt,
    FaChevronDown,
    FaChevronUp,
    FaDownload,
    FaEnvelope,
    FaFileAlt,
    FaGavel,
    FaUserTie,
    FaUsers,
} from "react-icons/fa";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import { normalizeText } from "@/lib/unidades";

export interface ConselhoAtaPublica {
    id: string;
    titulo: string;
    dataReuniao: string;
    arquivo: string | null;
}

export interface ConselhoPublico {
    id: string;
    nome: string;
    sigla: string | null;
    tipo: string;
    descricao: string;
    composicao: string;
    presidente: string | null;
    email: string | null;
    mandatoVigencia: string | null;
    atoNomeacao: string | null;
    regimentoInternoUrl: string | null;
    calendarioReunioes: string | null;
    atualizadoEm: string;
    atas: ConselhoAtaPublica[];
}

function getBadgePNTP(tipo: string) {
    const t = normalizeText(tipo);
    if (t.includes("saude")) return { code: "PNTP 18.6", label: "Saúde", color: "bg-emerald-50 text-emerald-800 border-emerald-200" };
    if (t.includes("fundeb")) return { code: "PNTP 19.3", label: "FUNDEB", color: "bg-blue-50 text-[#1254A3] border-blue-200" };
    if (t.includes("social")) return { code: "PNTP 19.4", label: "Assistência Social", color: "bg-purple-50 text-purple-800 border-purple-200" };
    if (t.includes("educa")) return { code: "Educação", label: "Educação", color: "bg-indigo-50 text-indigo-800 border-indigo-200" };
    return { code: "Controle Social", label: tipo, color: "bg-slate-100 text-slate-700 border-slate-200" };
}

function isRealUrl(val: string | null | undefined): boolean {
    if (!val) return false;
    const t = val.trim();
    return t.startsWith("http://") || t.startsWith("https://") || t.startsWith("/");
}

export default function ConselhosClient({ conselhos }: { conselhos: ConselhoPublico[] }) {
    const [tipoFiltro, setTipoFiltro] = useState("todos");
    const [busca, setBusca] = useState("");
    const [expandedAtas, setExpandedAtas] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (typeof window === "undefined") return;
        const t = new URLSearchParams(window.location.search).get("tipo");
        if (t) setTipoFiltro(t.toLowerCase());
    }, []);

    const filtrados = useMemo(() => {
        return conselhos.filter((c) => {
            if (tipoFiltro !== "todos" && normalizeText(c.tipo) !== normalizeText(tipoFiltro)) {
                return false;
            }
            if (!busca.trim()) return true;
            const q = normalizeText(busca);
            return (
                normalizeText(c.nome).includes(q) ||
                normalizeText(c.sigla).includes(q) ||
                normalizeText(c.presidente).includes(q) ||
                normalizeText(c.composicao).includes(q) ||
                normalizeText(c.descricao).includes(q) ||
                c.atas.some((a) => normalizeText(a.titulo).includes(q))
            );
        });
    }, [conselhos, tipoFiltro, busca]);

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const rows = filtrados.map((c) => ({
            Conselho: c.nome,
            Sigla: c.sigla || "-",
            Area_PNTP: `${getBadgePNTP(c.tipo).label} (${getBadgePNTP(c.tipo).code})`,
            Presidente: c.presidente || "-",
            Contato_Email: c.email || "-",
            Mandato_Vigencia: c.mandatoVigencia || "-",
            Ato_Nomeacao: c.atoNomeacao || "-",
            Calendario_Reunioes: c.calendarioReunioes || "-",
            Composicao_Membros: c.composicao,
            Total_Atas_Publicadas: c.atas.length,
            Atualizado_Em: new Date(c.atualizadoEm).toLocaleDateString("pt-BR"),
        }));

        const filename = "conselhos_municipais_composicao_atas_pntp";
        const meta = {
            titulo: "Conselhos Municipais - Composição e Funcionamento (PNTP 18.6, 19.3 e 19.4)",
            fonte: "Controle Social Municipal",
            filtros: `Tipo=${tipoFiltro}${busca ? `, Busca=${busca}` : ""}`,
        };

        if (format === "csv") exportToCSV(rows, filename, meta);
        else if (format === "xlsx") exportToXLSX(rows, filename, meta);
        else if (format === "json") exportToJSON(rows, filename, meta);
        else exportToPDF(rows, filename, meta.titulo, meta);
    };

    const toggleAtas = (id: string) => {
        setExpandedAtas((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="space-y-8">
            <TransparencyFilters
                hideYearFilter
                hideMonthFilter
                searchValue={busca}
                onSearch={setBusca}
                onClear={() => {
                    setBusca("");
                    setTipoFiltro("todos");
                }}
                onExport={handleExport}
                placeholder="Pesquisar por conselho, membro, segmento ou ata..."
            >
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 w-full">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                        Área / Critério PNTP:
                    </span>
                    {[
                        { id: "todos", label: `Todos (${conselhos.length})` },
                        { id: "saude", label: "Saúde (PNTP 18.6)" },
                        { id: "fundeb", label: "FUNDEB (PNTP 19.3)" },
                        { id: "social", label: "Assistência Social (PNTP 19.4)" },
                        { id: "educacao", label: "Educação" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setTipoFiltro(tab.id)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition ${
                                tipoFiltro === tab.id
                                    ? "bg-[#1254A3] text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </TransparencyFilters>

            {filtrados.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-16 text-center space-y-2">
                    <FaUsers className="mx-auto text-4xl text-slate-300" />
                    <h3 className="text-lg font-bold text-slate-800">Nenhum conselho encontrado</h3>
                    <p className="text-sm text-slate-500">
                        Ajuste os filtros acima ou verifique os conselhos cadastrados no painel administrativo.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {filtrados.map((c) => {
                        const badge = getBadgePNTP(c.tipo);
                        const mostrarTodas = Boolean(expandedAtas[c.id]);
                        const atasVisiveis = mostrarTodas ? c.atas : c.atas.slice(0, 3);

                        return (
                            <article
                                key={c.id}
                                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
                            >
                                <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col lg:flex-row lg:items-start justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full border text-xs font-black ${badge.color}`}>
                                                {badge.label} • {badge.code}
                                            </span>
                                            {c.sigla && (
                                                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-white text-xs font-mono font-bold">
                                                    {c.sigla}
                                                </span>
                                            )}
                                            <span className="text-xs text-slate-400 font-medium">
                                                Atualizado em {new Date(c.atualizadoEm).toLocaleDateString("pt-BR")}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900">{c.nome}</h2>
                                        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                                            {c.descricao}
                                        </p>
                                    </div>

                                    {isRealUrl(c.regimentoInternoUrl) ? (
                                        <a
                                            href={c.regimentoInternoUrl!}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2.5 rounded-xl bg-[#1254A3] hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-2 shrink-0 transition shadow-sm"
                                        >
                                            <FaDownload /> Baixar Regimento Interno
                                        </a>
                                    ) : (
                                        <span className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold shrink-0">
                                            Regimento disponível na Secretaria
                                        </span>
                                    )}
                                </div>

                                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    {/* Dados Gerais e Composição */}
                                    <div className="lg:col-span-7 space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            {c.presidente && (
                                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                                    <span className="font-bold text-slate-400 uppercase block mb-0.5 flex items-center gap-1">
                                                        <FaUserTie className="text-[#1254A3]" /> Presidência
                                                    </span>
                                                    <span className="font-bold text-slate-800">{c.presidente}</span>
                                                </div>
                                            )}
                                            {c.email && (
                                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                                    <span className="font-bold text-slate-400 uppercase block mb-0.5 flex items-center gap-1">
                                                        <FaEnvelope className="text-[#1254A3]" /> E-mail Oficial
                                                    </span>
                                                    <span className="font-semibold text-slate-800 break-all">{c.email}</span>
                                                </div>
                                            )}
                                            {c.mandatoVigencia && (
                                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                                    <span className="font-bold text-slate-400 uppercase block mb-0.5">
                                                        Mandato / Vigência
                                                    </span>
                                                    <span className="font-bold text-slate-800">{c.mandatoVigencia}</span>
                                                </div>
                                            )}
                                            {c.atoNomeacao && (
                                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                                    <span className="font-bold text-slate-400 uppercase block mb-0.5 flex items-center gap-1">
                                                        <FaGavel className="text-[#1254A3]" /> Ato de Nomeação
                                                    </span>
                                                    <span className="font-semibold text-slate-800">{c.atoNomeacao}</span>
                                                </div>
                                            )}
                                            {c.calendarioReunioes && (
                                                <div className="sm:col-span-2 p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
                                                    <span className="font-bold text-[#1254A3] uppercase block mb-0.5 flex items-center gap-1">
                                                        <FaCalendarAlt /> Funcionamento / Calendário de Reuniões
                                                    </span>
                                                    <span className="font-semibold text-slate-800">{c.calendarioReunioes}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                                <FaUsers className="text-[#1254A3]" /> Composição Atualizada dos Membros (Titulares e Suplentes)
                                            </h3>
                                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs md:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                                                {c.composicao}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Atas e Deliberações */}
                                    <div className="lg:col-span-5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                                <FaCalendarAlt className="text-emerald-600" /> Atas de Reunião ({c.atas.length})
                                            </h3>
                                        </div>

                                        {c.atas.length === 0 ? (
                                            <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500 text-center">
                                                Nenhuma ata digitalizada vinculada ainda a este conselho.
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {atasVisiveis.map((ata) => {
                                                    const temUrl = isRealUrl(ata.arquivo);
                                                    const ehTexto =
                                                        Boolean(ata.arquivo) &&
                                                        ata.arquivo !== "#" &&
                                                        !temUrl;
                                                    return (
                                                        <div
                                                            key={ata.id}
                                                            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2"
                                                        >
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div>
                                                                    <h4 className="font-bold text-slate-900 text-xs md:text-sm">
                                                                        {ata.titulo}
                                                                    </h4>
                                                                    <span className="text-[11px] font-semibold text-slate-500">
                                                                        Data:{" "}
                                                                        {new Date(ata.dataReuniao).toLocaleDateString(
                                                                            "pt-BR",
                                                                            { timeZone: "UTC" }
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                {temUrl && (
                                                                    <a
                                                                        href={ata.arquivo!}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="px-3 py-1.5 rounded-lg bg-[#1254A3] hover:bg-blue-800 text-white text-[11px] font-bold flex items-center gap-1.5 shrink-0 transition"
                                                                    >
                                                                        <FaFileAlt size={10} /> Ver Ata
                                                                    </a>
                                                                )}
                                                            </div>
                                                            {ehTexto && (
                                                                <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 line-clamp-3">
                                                                    {ata.arquivo}
                                                                </p>
                                                            )}
                                                            {!temUrl && !ehTexto && (
                                                                <span className="inline-block text-[11px] text-slate-400 italic">
                                                                    Arquivo físico arquivado na sede do Conselho.
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })}

                                                {c.atas.length > 3 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleAtas(c.id)}
                                                        className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                                                    >
                                                        {mostrarTodas ? (
                                                            <>
                                                                Recolher histórico <FaChevronUp size={11} />
                                                            </>
                                                        ) : (
                                                            <>
                                                                Visualizar histórico completo de atas ({c.atas.length}){" "}
                                                                <FaChevronDown size={11} />
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
