"use client";

import { useState, useEffect, useCallback } from "react";
import { FaFilePdf, FaMagnifyingGlass, FaCalendarDays, FaChartLine, FaDownload, FaFileExcel, FaFileCsv, FaXmark, FaEye } from "react-icons/fa6";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { motion, AnimatePresence } from "framer-motion";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import PDFViewer from "@/components/transparencia/PDFViewer";

type RelatorioFiscal = {
    id: string;
    titulo: string;
    tipo: string;
    periodo: string;
    ano: number;
    arquivo: string;
    dataPublicacao: string;
};

interface Props {
    title: string;
    subtitle: string;
    tipo: string;
    icon: React.ReactNode;
    breadcrumbLabel: string;
    showTabs?: string[];
}

export default function RelatoriosFiscaisTemplate({ title, subtitle, tipo, icon, breadcrumbLabel, showTabs }: Props) {
    const [relatorios, setRelatorios] = useState<RelatorioFiscal[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [tabAtiva, setTabAtiva] = useState(showTabs ? "TODOS" : tipo);
    const [anoFiltro, setAnoFiltro] = useState<number | null>(null);
    const [pdfViewer, setPdfViewer] = useState<{ url: string; titulo: string } | null>(null);

    useEffect(() => {
        const fetchRelatorios = async () => {
            try {
                setLoading(true);
                const urls = [
                    showTabs ? "/api/admin/relatorios-fiscais" : `/api/admin/relatorios-fiscais?tipo=${tipo}`
                ];

                const hasBudget = showTabs?.some(t => ["LOA", "LDO", "PPA"].includes(t));
                if (hasBudget) {
                    urls.push("/api/legislacao?tipo=LOA,LDO,PPA&limit=200");
                }
                
                const docTypes = showTabs ? showTabs.map(t => t.toLowerCase()).join(",") : tipo.toLowerCase();
                urls.push(`/api/documentos?tipo=${docTypes}`);

                const responses = await Promise.all(urls.map(url => fetch(url)));
                const dataSets = await Promise.all(responses.map(res => res.ok ? res.json() : []));

                let combinedRecords: RelatorioFiscal[] = [];

                if (dataSets[0]) {
                    combinedRecords = [...(Array.isArray(dataSets[0]) ? dataSets[0] : [])];
                }

                if (hasBudget && dataSets[1] && dataSets[1].items) {
                    const mappedBudget: RelatorioFiscal[] = dataSets[1].items.map((item: any) => ({
                        id: item.id,
                        titulo: item.ementa,
                        tipo: item.tipo,
                        periodo: "Instrumento de Planejamento",
                        ano: item.ano,
                        arquivo: item.arquivo || "",
                        dataPublicacao: item.criadoEm
                    }));
                    combinedRecords = [...combinedRecords, ...mappedBudget];
                }

                const docIndex = hasBudget ? 2 : 1;
                if (dataSets[docIndex]) {
                    const mappedDocs: RelatorioFiscal[] = (Array.isArray(dataSets[docIndex]) ? dataSets[docIndex] : []).map((item: any) => ({
                        id: item.id,
                        titulo: item.titulo,
                        tipo: item.tipo.toUpperCase(),
                        periodo: "Documento",
                        ano: item.ano || new Date(item.criadoEm).getFullYear(),
                        arquivo: item.arquivo || "",
                        dataPublicacao: item.criadoEm
                    }));
                    combinedRecords = [...combinedRecords, ...mappedDocs];
                }

                setRelatorios(combinedRecords);
            } catch (error) {
                console.error("Erro ao buscar relatórios:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRelatorios();
    }, [tipo, showTabs]);

    const filtered = relatorios.filter(r => {
        const matchesSearch = r.titulo.toLowerCase().includes(search.toLowerCase()) || 
                             r.periodo.toLowerCase().includes(search.toLowerCase());
        const matchesTab = !showTabs || tabAtiva === "TODOS" || r.tipo === tabAtiva;
        const matchesAno = anoFiltro === null || r.ano === anoFiltro;
        return matchesSearch && matchesTab && matchesAno && (showTabs ? true : r.tipo === tipo);
    });

    const todosOsAnos = Array.from(
        new Set(
            relatorios
                .filter(r => {
                    const matchesTab = !showTabs || tabAtiva === "TODOS" || r.tipo === tabAtiva;
                    return matchesTab && (showTabs ? true : r.tipo === tipo);
                })
                .map(r => r.ano)
        )
    ).sort((a, b) => b - a);

    const anosDisponiveis = Array.from(new Set(filtered.map(r => r.ano))).sort((a, b) => b - a);

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = filtered.map(r => ({
            "Título": r.titulo,
            "Tipo": r.tipo,
            "Período": r.periodo,
            "Ano": r.ano,
            "Data de Publicação": new Date(r.dataPublicacao).toLocaleDateString("pt-BR"),
            "Link": r.arquivo
        }));

        const filename = `relatorios_${tipo.toLowerCase()}${anoFiltro ? `_${anoFiltro}` : ""}`;
        const exportTitle = `Relatórios de Transparência Fiscal - ${title}${anoFiltro ? ` (${anoFiltro})` : ""} – Lajes Pintadas/RN`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, exportTitle);
    };

    const closePdfViewer = useCallback(() => setPdfViewer(null), []);

    const hasActiveFilters = search || anoFiltro || (showTabs && tabAtiva !== "TODOS");

    return (
        <div className="min-h-screen bg-slate-50/50 font-['Montserrat',sans-serif]">
            <PageHeader
                title={title}
                subtitle={subtitle}
                variant="premium"
                icon={icon}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: breadcrumbLabel }
                ]}
            />

            <div className="w-full px-4 md:px-10 lg:px-20 py-10">
                
                {/* Bento Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-slate-100 flex items-center gap-6 transition-all hover:scale-[1.02]">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
                            <FaChartLine size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total de Documentos</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">{filtered.length}</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-slate-100 flex items-center gap-6 transition-all hover:scale-[1.02]">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner">
                            <FaCalendarDays size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Publicados em {new Date().getFullYear()}</p>
                            <p className="text-3xl font-black text-emerald-600 tracking-tighter">
                                {relatorios.filter(r => r.ano === new Date().getFullYear()).length}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-slate-100 flex items-center gap-6 transition-all hover:scale-[1.02]">
                        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center shadow-inner">
                            <FaFilePdf size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Arquivos em PDF</p>
                            <p className="text-3xl font-black text-amber-600 tracking-tighter">
                                {relatorios.filter(r => r.arquivo.toLowerCase().endsWith('.pdf')).length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ═══════ FILTROS ═══════ */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm mb-8">
                    
                    {/* Categoria / Abas (se houver) */}
                    {showTabs && (
                        <div className="px-5 pt-5 pb-0">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">Tipo de Relatório</label>
                            <div className="flex flex-wrap gap-2">
                                {["TODOS", ...showTabs].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setTabAtiva(tab)}
                                        className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                                            tabAtiva === tab
                                            ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                                        }`}
                                    >
                                        {tab === "TODOS" ? "Todos" : tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Barra de busca + Ano + Exportação */}
                    <div className="p-5 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                        
                        {/* Busca */}
                        <div className="relative flex-1">
                            <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={13} />
                            <input
                                type="text"
                                placeholder="Pesquisar documento..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Filtro de Ano */}
                        <div className="relative w-full md:w-52">
                            <FaCalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={13} />
                            <select
                                value={anoFiltro ?? ""}
                                onChange={(e) => setAnoFiltro(e.target.value ? Number(e.target.value) : null)}
                                className="w-full pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all outline-none cursor-pointer appearance-none"
                            >
                                <option value="">Todos os anos</option>
                                {todosOsAnos.map(ano => (
                                    <option key={ano} value={ano}>{ano}</option>
                                ))}
                            </select>
                            <ChevronDown />
                        </div>

                        {/* Separador vertical */}
                        <div className="hidden md:block w-px h-8 bg-slate-200" />

                        {/* Exportar */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden lg:block">Exportar:</span>
                            {[
                                { id: 'pdf' as const, icon: <FaFilePdf size={13} />, label: 'PDF', color: 'text-red-500 hover:bg-red-50' },
                                { id: 'xlsx' as const, icon: <FaFileExcel size={13} />, label: 'Excel', color: 'text-emerald-500 hover:bg-emerald-50' },
                                { id: 'csv' as const, icon: <FaFileCsv size={13} />, label: 'CSV', color: 'text-blue-500 hover:bg-blue-50' }
                            ].map(tool => (
                                <button
                                    key={tool.id}
                                    onClick={() => handleExport(tool.id)}
                                    title={`Exportar como ${tool.label}`}
                                    className={`p-2.5 rounded-lg transition-all ${tool.color} border border-transparent hover:border-current/10`}
                                >
                                    {tool.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Resumo dos filtros ativos */}
                    {hasActiveFilters && (
                        <div className="px-5 pb-4 flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Filtros:</span>
                            {showTabs && tabAtiva !== "TODOS" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 rounded-md text-[11px] font-semibold border border-primary-100">
                                    {tabAtiva}
                                    <button onClick={() => setTabAtiva("TODOS")} className="ml-0.5 hover:text-primary-900"><FaXmark size={8} /></button>
                                </span>
                            )}
                            {anoFiltro && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-[11px] font-semibold border border-amber-100">
                                    Ano: {anoFiltro}
                                    <button onClick={() => setAnoFiltro(null)} className="ml-0.5 hover:text-amber-900"><FaXmark size={8} /></button>
                                </span>
                            )}
                            {search && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-sky-700 rounded-md text-[11px] font-semibold border border-sky-100">
                                    &quot;{search}&quot;
                                    <button onClick={() => setSearch("")} className="ml-0.5 hover:text-sky-900"><FaXmark size={8} /></button>
                                </span>
                            )}
                            <button
                                onClick={() => { setSearch(""); setAnoFiltro(null); if (showTabs) setTabAtiva("TODOS"); }}
                                className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase transition-colors ml-1"
                            >
                                Limpar tudo
                            </button>
                        </div>
                    )}
                </div>

                {/* ═══════ CONTADOR ═══════ */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-slate-500">
                        <span className="font-bold text-slate-800">{filtered.length}</span> documento{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {/* ═══════ LISTAGEM ═══════ */}
                <div className="space-y-12">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
                            <p className="text-sm text-slate-400 font-medium">Carregando documentos...</p>
                        </div>
                    ) : anosDisponiveis.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaChartLine className="text-slate-300" size={28} />
                            </div>
                            <h4 className="text-lg font-bold text-slate-700 mb-2">Nenhum documento encontrado</h4>
                            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
                                Não há relatórios para os filtros selecionados. Tente alterar os critérios de busca.
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={() => { setSearch(""); setAnoFiltro(null); if (showTabs) setTabAtiva("TODOS"); }}
                                    className="px-6 py-3 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors"
                                >
                                    Limpar filtros
                                </button>
                            )}
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {anosDisponiveis.map(ano => {
                                const relatoriosDoAno = filtered.filter(r => r.ano === ano);
                                return (
                                    <motion.div
                                        key={ano}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                    >
                                        {/* Cabeçalho do ano */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center font-black text-sm">
                                                    <FaCalendarDays size={14} />
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-800">{ano}</h3>
                                            </div>
                                            <div className="flex-1 h-px bg-slate-200" />
                                            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
                                                {relatoriosDoAno.length} {relatoriosDoAno.length === 1 ? "documento" : "documentos"}
                                            </span>
                                        </div>

                                        {/* Grid de cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                                            {relatoriosDoAno.map((r, idx) => (
                                                <motion.div
                                                    key={r.id}
                                                    initial={{ opacity: 0, y: 16 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.04 }}
                                                    className="group bg-white rounded-xl border border-slate-200/80 hover:border-primary-300 shadow-sm hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 flex flex-col"
                                                >
                                                    {/* Card body */}
                                                    <div className="p-5 flex-1">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-11 h-11 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                                                                <FaFilePdf size={18} />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <h4 className="font-bold text-slate-800 text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-primary-700 transition-colors">
                                                                    {r.titulo.replace(/\.pdf$/i, "")}
                                                                </h4>
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                                                                        {r.tipo}
                                                                    </span>
                                                                    <span className="text-[11px] text-slate-400">
                                                                        {r.periodo}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Card footer com ações */}
                                                    <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-2">
                                                        <button
                                                            onClick={() => setPdfViewer({ url: r.arquivo, titulo: r.titulo.replace(/\.pdf$/i, "") })}
                                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold hover:bg-primary-600 hover:text-white transition-all duration-200"
                                                        >
                                                            <FaEye size={12} />
                                                            Visualizar
                                                        </button>
                                                        <a
                                                            href={r.arquivo}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-700 hover:text-white transition-all duration-200"
                                                        >
                                                            <FaDownload size={11} />
                                                            Baixar
                                                        </a>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>

                <div className="mt-16">
                    <BannerPNTP />
                </div>
            </div>

            {/* ═══════ MODAL PDF VIEWER ═══════ */}
            <AnimatePresence>
                {pdfViewer && (
                    <PDFViewer
                        url={pdfViewer.url}
                        titulo={pdfViewer.titulo}
                        onClose={closePdfViewer}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

const ChevronDown = () => (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    </div>
);
