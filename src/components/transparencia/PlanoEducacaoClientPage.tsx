"use client";

import { useEffect, useMemo, useState } from "react";
import {
    FaBookOpen,
    FaChartLine,
    FaCheckCircle,
    FaDownload,
    FaExclamationCircle,
    FaFilePdf,
    FaHistory,
} from "react-icons/fa";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import DataAtualizacao from "@/components/transparencia/DataAtualizacao";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import { normalizeText } from "@/lib/unidades";

interface DocPME {
    id: string;
    titulo: string;
    descricao: string | null;
    tipo: string;
    orgaoResponsavel: string | null;
    arquivo: string | null;
    documentUrl: string | null;
    arquivoEditavelUrl: string | null;
    ano: number | null;
    competencia: string | null;
    criadoEm: string;
    atualizadoEm?: string;
}

export default function PlanoEducacaoClientPage({
    initialDocs,
}: {
    initialDocs?: DocPME[];
}) {
    const [docs, setDocs] = useState<DocPME[]>(initialDocs || []);
    const [loading, setLoading] = useState(!initialDocs);
    const [tipoFiltro, setTipoFiltro] = useState<"todos" | "plano-educacao" | "relatorio-plano-educacao">("todos");
    const [anoFiltro, setAnoFiltro] = useState("");
    const [busca, setBusca] = useState("");

    useEffect(() => {
        if (initialDocs) {
            setDocs(initialDocs);
            setLoading(false);
            return;
        }
        async function load() {
            setLoading(true);
            try {
                const res = await fetch(
                    "/api/documentos?tipo=plano-educacao,relatorio-plano-educacao",
                    { cache: "no-store" }
                );
                if (res.ok) {
                    const data = await res.json();
                    setDocs(Array.isArray(data) ? data : []);
                }
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [initialDocs]);

    const filteredDocs = useMemo(() => {
        return docs.filter((d) => {
            if (tipoFiltro !== "todos" && d.tipo !== tipoFiltro) return false;
            if (anoFiltro && String(d.ano || "") !== anoFiltro) return false;
            if (!busca.trim()) return true;
            const q = normalizeText(busca);
            return (
                normalizeText(d.titulo).includes(q) ||
                normalizeText(d.descricao).includes(q) ||
                normalizeText(d.competencia).includes(q) ||
                normalizeText(d.orgaoResponsavel).includes(q) ||
                String(d.ano || "").includes(q)
            );
        });
    }, [docs, tipoFiltro, anoFiltro, busca]);

    const pmes = docs.filter((d) => d.tipo === "plano-educacao");
    const relatorios = docs.filter((d) => d.tipo === "relatorio-plano-educacao");
    const anosDisponiveis = useMemo(() => {
        const anos = new Set<string>(["2026", "2025", "2024", "2023", "2022"]);
        docs.forEach((d) => {
            if (d.ano) anos.add(String(d.ano));
        });
        return Array.from(anos).sort((a, b) => Number(b) - Number(a));
    }, [docs]);

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const rows = filteredDocs.map((d) => ({
            Instrumento:
                d.tipo === "relatorio-plano-educacao"
                    ? "Relatório de Resultados / Monitoramento do PME"
                    : "Plano Municipal de Educação (PME)",
            Titulo: d.titulo,
            Exercicio: d.ano || "-",
            Periodo_Competencia: d.competencia || "-",
            Orgao_Responsavel: d.orgaoResponsavel || "Secretaria Municipal de Educação",
            Resumo_Metas: d.descricao || "-",
            Data_Publicacao: new Date(d.criadoEm).toLocaleDateString("pt-BR"),
            Link_Documento: d.arquivo || d.documentUrl || "-",
        }));

        const filename = "plano_educacao_relatorio_resultados_pntp_19_1";
        const meta = {
            titulo: "Plano Municipal de Educação (PME) e Relatório de Resultados (PNTP 19.1)",
            fonte: "Secretaria Municipal de Educação",
            filtros: `Tipo=${tipoFiltro}, Ano=${anoFiltro || "Todos"}${busca ? `, Busca=${busca}` : ""}`,
        };

        if (format === "csv") exportToCSV(rows, filename, meta);
        else if (format === "xlsx") exportToXLSX(rows, filename, meta);
        else if (format === "json") exportToJSON(rows, filename, meta);
        else exportToPDF(rows, filename, meta.titulo, meta);
    };

    const resolveLink = (d: DocPME) => {
        const raw = d.arquivo || d.documentUrl || "";
        if (!raw) return null;
        if (raw.startsWith("http") || raw.startsWith("/")) return raw;
        return `/${raw}`;
    };

    return (
        <div className="space-y-8">
            {/* Status PNTP 19.1: Plano + Relatório de Resultados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1254A3] flex items-center justify-center shrink-0">
                        <FaBookOpen size={20} />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900">Plano Municipal de Educação (PME)</h3>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                {pmes.length} publicado(s)
                            </span>
                        </div>
                        <p className="text-xs text-slate-500">
                            Diretrizes, objetivos e metas decenais da educação básica pública municipal.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <FaChartLine size={20} />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900">Relatório de Resultados / Monitoramento do PME</h3>
                            {relatorios.length > 0 ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                    <FaCheckCircle size={10} /> {relatorios.length} publicado(s)
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                    <FaExclamationCircle size={10} /> Em publicação no Admin Educação
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500">
                            Acompanhamento de metas e indicadores exigido pelo Critério 19.1 da Cartilha PNTP 2026.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <TransparencyFilters
                hideMonthFilter
                availableYears={anosDisponiveis}
                currentYear={anoFiltro}
                onYearChange={setAnoFiltro}
                searchValue={busca}
                onSearch={setBusca}
                onClear={() => {
                    setBusca("");
                    setAnoFiltro("");
                    setTipoFiltro("todos");
                }}
                onExport={handleExport}
                placeholder="Pesquisar por título, metas, relatório bienal ou órgão responsável..."
            >
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 w-full">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                        Tipo de Instrumento (19.1):
                    </span>
                    {[
                        { id: "todos", label: `Todos (${docs.length})` },
                        { id: "plano-educacao", label: `Plano de Educação (${pmes.length})` },
                        {
                            id: "relatorio-plano-educacao",
                            label: `Relatório de Resultados do PME (${relatorios.length})`,
                        },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setTipoFiltro(tab.id as any)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition ${
                                tipoFiltro === tab.id
                                    ? "bg-[#1254A3] text-white shadow-sm"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </TransparencyFilters>

            {/* Listagem */}
            {loading ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-14 text-center text-slate-500">
                    Consultando documentos do Plano Municipal de Educação...
                </div>
            ) : filteredDocs.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-14 text-center space-y-2">
                    <FaBookOpen className="mx-auto text-4xl text-slate-300" />
                    <h3 className="text-lg font-bold text-slate-800">
                        Nenhum documento localizado para os filtros aplicados
                    </h3>
                    <p className="text-sm text-slate-500 max-w-lg mx-auto">
                        {tipoFiltro === "relatorio-plano-educacao" && relatorios.length === 0
                            ? "Ainda não há Relatório de Resultados do PME publicado nesta categoria. O gestor pode publicá-lo diretamente no painel Admin > Educação / PME (19.1)."
                            : "Limpe os filtros ou selecione 'Todos os Anos' para consultar a série histórica completa."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredDocs.map((doc) => {
                        const isRelatorio = doc.tipo === "relatorio-plano-educacao";
                        const url = resolveLink(doc);
                        const editavelUrl = doc.arquivoEditavelUrl;
                        return (
                            <div
                                key={doc.id}
                                className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                            >
                                <div className="flex items-start gap-4 flex-1">
                                    <div
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                                            isRelatorio
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : "bg-blue-50 text-[#1254A3] border border-blue-200"
                                        }`}
                                    >
                                        <FaFilePdf size={22} />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                                    isRelatorio
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : "bg-blue-100 text-[#1254A3]"
                                                }`}
                                            >
                                                {isRelatorio
                                                    ? "Relatório de Resultados / Monitoramento do PME"
                                                    : "Plano Municipal de Educação (PME)"}
                                            </span>
                                            {doc.ano && (
                                                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                                                    Exercício {doc.ano}
                                                </span>
                                            )}
                                            {doc.competencia && (
                                                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800">
                                                    {doc.competencia}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-black text-slate-900">{doc.titulo}</h3>
                                        {doc.descricao && (
                                            <p className="text-sm text-slate-600 leading-relaxed">{doc.descricao}</p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                                            <span>
                                                Órgão:{" "}
                                                <strong>
                                                    {doc.orgaoResponsavel || "Secretaria Municipal de Educação"}
                                                </strong>
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <FaHistory size={10} /> Publicado em{" "}
                                                {new Date(doc.criadoEm).toLocaleDateString("pt-BR")}
                                            </span>
                                        </div>
                                        <DataAtualizacao
                                            variant="compact"
                                            dataAtualizacao={new Date(
                                                doc.atualizadoEm || doc.criadoEm
                                            ).toLocaleDateString("pt-BR")}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 shrink-0">
                                    {url && (
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-5 py-3 rounded-2xl bg-[#1254A3] hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-2 transition shadow-sm"
                                        >
                                            <FaDownload /> Baixar Documento (PDF)
                                        </a>
                                    )}
                                    {editavelUrl && (
                                        <a
                                            href={editavelUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 transition"
                                        >
                                            Planilha / Dados Editáveis
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
