"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    FaFilePdf, FaMagnifyingGlass, FaCalendarDays, FaDownload, 
    FaEye, FaXmark, FaGavel, FaFileSignature, FaScroll, FaFileLines, FaScaleBalanced,
    FaFileExcel, FaFileCsv
} from "react-icons/fa6";
import { FaRegFileLines } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import PDFViewer from "@/components/transparencia/PDFViewer";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type Legislacao = {
    id: string;
    tipo: string;
    numero: string;
    ano: number;
    ementa: string;
    arquivo: string | null;
    criadoEm: string;
};

const tipoInfo: Record<string, { label: string; icon: any }> = {
    "lei-organica": { label: "Lei Orgânica", icon: FaScroll },
    "lei": { label: "Lei Municipal", icon: FaScaleBalanced },
    "decreto": { label: "Decreto", icon: FaGavel },
    "portaria": { label: "Portaria", icon: FaFileSignature },
    "portaria_diaria": { label: "Portaria de Diária", icon: FaRegFileLines },
    "resolucao": { label: "Resolução", icon: FaFileLines },
};

export default function LegislacaoClient({ initialTipo = "", hideTipoFilter = false }: { initialTipo?: string, hideTipoFilter?: boolean }) {
    const [leis, setLeis] = useState<Legislacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [tipoFiltro, setTipoFiltro] = useState(initialTipo || "TODOS");
    const [anoFiltro, setAnoFiltro] = useState<number | null>(null);
    const [buscaFiltro, setBuscaFiltro] = useState("");
    const [pdfViewer, setPdfViewer] = useState<{ url: string; titulo: string } | null>(null);

    const fetchLeis = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({ 
                limit: "1000" // Buscamos um lote maior para filtrar no cliente ou exibir agrupado
            });
            if (tipoFiltro && tipoFiltro !== "TODOS") query.append("tipo", tipoFiltro);
            // Omitimos ano e busca da query para ter todos os anos disponíveis no filtro
            
            const res = await fetch(`/api/legislacao?${query.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setLeis(data.items || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeis();
    }, [tipoFiltro]);

    const filtered = leis.filter(l => {
        const matchesSearch = l.ementa.toLowerCase().includes(buscaFiltro.toLowerCase()) || 
                             l.numero.toLowerCase().includes(buscaFiltro.toLowerCase());
        const matchesAno = anoFiltro === null || l.ano === anoFiltro;
        return matchesSearch && matchesAno;
    });

    const todosOsAnos = Array.from(new Set(leis.map(l => l.ano))).sort((a, b) => b - a);
    const anosDisponiveis = Array.from(new Set(filtered.map(l => l.ano))).sort((a, b) => b - a);

    const handleClearFilters = () => {
        setBuscaFiltro("");
        setAnoFiltro(null);
        setTipoFiltro(initialTipo || "TODOS");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = filtered.map(l => ({
            "Tipo": tipoInfo[l.tipo]?.label || l.tipo,
            "Número": l.numero,
            "Ano": l.ano,
            "Ementa": l.ementa,
            "Data": new Date(l.criadoEm).toLocaleDateString("pt-BR")
        }));

        const filename = `legislacao_${tipoFiltro.toLowerCase()}_${anoFiltro || 'geral'}`;
        const title = `Relatório de Legislação Municipal – Lajes Pintadas/RN`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const hasActiveFilters = buscaFiltro || anoFiltro || (tipoFiltro !== "TODOS" && !hideTipoFilter);

    // Estatísticas para Bento Cards
    const stats = {
        total: filtered.length,
        anoAtual: filtered.filter(l => l.ano === new Date().getFullYear()).length,
        comArquivo: filtered.filter(l => l.arquivo).length
    };

    return (
        <div className="w-full px-4 md:px-10 lg:px-20 py-10 font-['Montserrat',sans-serif]">
            
            {/* Bento Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-slate-100 flex items-center gap-6 transition-all hover:scale-[1.02]">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
                        <FaScroll size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total de Atos</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{stats.total}</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-slate-100 flex items-center gap-6 transition-all hover:scale-[1.02]">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner">
                        <FaCalendarDays size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Publicados em {new Date().getFullYear()}</p>
                        <p className="text-3xl font-black text-emerald-600 tracking-tighter">{stats.anoAtual}</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-slate-100 flex items-center gap-6 transition-all hover:scale-[1.02]">
                    <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center shadow-inner">
                        <FaFilePdf size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Arquivos Disponíveis</p>
                        <p className="text-3xl font-black text-amber-600 tracking-tighter">{stats.comArquivo}</p>
                    </div>
                </div>
            </div>

            {/* ═══════ FILTROS ═══════ */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm mb-8">
                
                {/* Abas de Tipo (se não estiver escondido) */}
                {!hideTipoFilter && (
                    <div className="px-5 pt-5 pb-0">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">Tipo de Ato</label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: "TODOS", label: "Todos" },
                                { id: "lei", label: "Leis" },
                                { id: "decreto", label: "Decretos" },
                                { id: "portaria", label: "Portarias" },
                                { id: "resolucao", label: "Resoluções" },
                                { id: "lei-organica", label: "Lei Orgânica" }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setTipoFiltro(tab.id)}
                                    className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                                        tipoFiltro === tab.id
                                        ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Busca + Ano + Exportação */}
                <div className="p-5 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <div className="relative flex-1">
                        <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={13} />
                        <input
                            type="text"
                            placeholder="Pesquisar por número ou ementa..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all outline-none"
                            value={buscaFiltro}
                            onChange={(e) => setBuscaFiltro(e.target.value)}
                        />
                    </div>

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
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-8 bg-slate-200" />

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

                {/* Filtros ativos */}
                {hasActiveFilters && (
                    <div className="px-5 pb-4 flex items-center gap-2 flex-wrap border-t border-slate-50 pt-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Filtros:</span>
                        {tipoFiltro !== "TODOS" && !hideTipoFilter && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 rounded-md text-[11px] font-semibold border border-primary-100">
                                {tipoInfo[tipoFiltro]?.label || tipoFiltro}
                                <button onClick={() => setTipoFiltro("TODOS")} className="ml-0.5 hover:text-primary-900"><FaXmark size={8} /></button>
                            </span>
                        )}
                        {anoFiltro && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-[11px] font-semibold border border-amber-100">
                                Ano: {anoFiltro}
                                <button onClick={() => setAnoFiltro(null)} className="ml-0.5 hover:text-amber-900"><FaXmark size={8} /></button>
                            </span>
                        )}
                        {buscaFiltro && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-sky-700 rounded-md text-[11px] font-semibold border border-sky-100">
                                &quot;{buscaFiltro}&quot;
                                <button onClick={() => setBuscaFiltro("")} className="ml-0.5 hover:text-sky-900"><FaXmark size={8} /></button>
                            </span>
                        )}
                        <button
                            onClick={handleClearFilters}
                            className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase transition-colors ml-1"
                        >
                            Limpar tudo
                        </button>
                    </div>
                )}
            </div>

            {/* ═══════ LISTAGEM ═══════ */}
            <div className="space-y-12 min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
                        <p className="text-sm text-slate-400 font-medium tracking-widest uppercase text-[10px] font-black">Sincronizando base de dados...</p>
                    </div>
                ) : anosDisponiveis.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaMagnifyingGlass className="text-slate-300" size={28} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-700 mb-2">Nenhum ato encontrado</h4>
                        <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
                            Não localizamos registros para os critérios selecionados.
                        </p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {anosDisponiveis.map(ano => {
                            const itensDoAno = filtered.filter(l => l.ano === ano);
                            return (
                                <motion.div
                                    key={ano}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Divisor de Ano */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-primary-600/20">
                                                <FaCalendarDays size={14} />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-800">{ano}</h3>
                                        </div>
                                        <div className="flex-1 h-px bg-slate-200" />
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                                            {itensDoAno.length} {itensDoAno.length === 1 ? "Ato" : "Atos"}
                                        </span>
                                    </div>

                                    {/* Grid de Atos */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {itensDoAno.map((l, idx) => {
                                            const info = tipoInfo[l.tipo] || { label: l.tipo, icon: FaFileLines };
                                            const Icon = info.icon;
                                            return (
                                                <motion.div
                                                    key={l.id}
                                                    initial={{ opacity: 0, y: 16 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.04 }}
                                                    className="group bg-white rounded-xl border border-slate-200/80 hover:border-primary-300 shadow-sm hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 flex flex-col"
                                                >
                                                    {/* Card body */}
                                                    <div className="p-6 flex-1">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100 uppercase tracking-widest mb-2 w-fit">
                                                                    {info.label}
                                                                </span>
                                                                <h4 className="text-2xl font-black text-slate-900 group-hover:text-primary-600 transition-colors duration-300">
                                                                    Nº {l.numero}
                                                                </h4>
                                                            </div>
                                                            <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                                                <FaFilePdf size={16} />
                                                            </div>
                                                        </div>
                                                        
                                                        <p className="text-[13px] font-medium text-slate-600 leading-relaxed mb-4 line-clamp-4 group-hover:text-slate-800 transition-colors" title={l.ementa}>
                                                            {l.ementa}
                                                        </p>

                                                        <div className="flex items-center gap-2 mt-auto pt-2">
                                                            <FaCalendarDays size={12} className="text-slate-300" />
                                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                                                Publicado em {new Date(l.criadoEm).toLocaleDateString("pt-BR")}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Card footer com ações */}
                                                    <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-2">
                                                        {l.arquivo ? (
                                                            <>
                                                                <button
                                                                    onClick={() => setPdfViewer({ url: l.arquivo!, titulo: `${info.label} Nº ${l.numero}/${l.ano}` })}
                                                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold hover:bg-primary-600 hover:text-white transition-all duration-200"
                                                                >
                                                                    <FaEye size={12} />
                                                                    Visualizar
                                                                </button>
                                                                <a
                                                                    href={l.arquivo}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-700 hover:text-white transition-all duration-200"
                                                                >
                                                                    <FaDownload size={11} />
                                                                    Baixar
                                                                </a>
                                                            </>
                                                        ) : (
                                                            <div className="w-full py-2.5 bg-slate-50 text-slate-400 rounded-lg text-xs font-bold text-center border border-dashed border-slate-200">
                                                                Arquivo Indisponível
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>

            <div className="mt-20">
                <BannerPNTP />
            </div>

            {/* ═══════ MODAL PDF VIEWER ═══════ */}
            <AnimatePresence>
                {pdfViewer && (
                    <PDFViewer
                        url={pdfViewer.url}
                        titulo={pdfViewer.titulo}
                        onClose={() => setPdfViewer(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

