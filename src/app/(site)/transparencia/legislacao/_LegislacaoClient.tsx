"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaFileAlt, FaScroll, FaGavel, FaDownload, FaCalendarAlt, FaSearch, FaHistory, FaInfoCircle, FaCheckCircle, FaSpinner, FaArrowRight, FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
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

const tipoInfo: Record<string, { label: string; corClass: string; icon: any }> = {
    "lei-organica": { label: "Lei Orgânica", corClass: "bg-purple-50 text-purple-600 border-purple-100/50", icon: FaScroll },
    "lei": { label: "Lei Municipal", corClass: "bg-blue-50 text-blue-600 border-blue-100/50", icon: FaFileAlt },
    "decreto": { label: "Decreto", corClass: "bg-amber-50 text-amber-600 border-amber-100/50", icon: FaGavel },
    "portaria": { label: "Portaria", corClass: "bg-emerald-50 text-emerald-600 border-emerald-100/50", icon: FaFileAlt },
    "portaria_diaria": { label: "Portaria de Diária", corClass: "bg-rose-50 text-rose-600 border-rose-100/50", icon: FaFileAlt },
    "resolucao": { label: "Resolução", corClass: "bg-indigo-50 text-indigo-600 border-indigo-100/50", icon: FaFileAlt },
};

export default function LegislacaoClient({ initialTipo = "", hideTipoFilter = false }: { initialTipo?: string, hideTipoFilter?: boolean }) {
    const [leis, setLeis] = useState<Legislacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [tipoFiltro, setTipoFiltro] = useState(initialTipo);
    const [anoFiltro, setAnoFiltro] = useState("");
    const [buscaFiltro, setBuscaFiltro] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLeis = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({ 
                page: page.toString(), 
                limit: "15" 
            });
            if (tipoFiltro && tipoFiltro !== "Todos") query.append("tipo", tipoFiltro);
            if (anoFiltro) query.append("ano", anoFiltro);
            if (buscaFiltro) query.append("busca", buscaFiltro);

            const res = await fetch(`/api/legislacao?${query.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setLeis(data.items);
                setTotalPages(Math.ceil(data.total / data.limit));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeis();
    }, [tipoFiltro, anoFiltro, page, buscaFiltro]);

    const handleClearFilters = () => {
        setBuscaFiltro("");
        setAnoFiltro("");
        setTipoFiltro(initialTipo);
        setPage(1);
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = leis.map(l => ({
            "Tipo": tipoInfo[l.tipo]?.label || l.tipo,
            "Número": l.numero,
            "Ano": l.ano,
            "Ementa": l.ementa
        }));

        const filename = `legislacao_${anoFiltro || 'geral'}`;
        const title = `Relatório de Legislação Municipal – Lajes Pintadas/RN`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    return (
        <div className="max-w-[1240px] mx-auto px-6 py-12 font-['Montserrat',sans-serif]">
            <div className="flex flex-col gap-8 mb-16 -mt-24 relative z-30">
                <TransparencyFilters
                    searchValue={buscaFiltro}
                    onSearch={setBuscaFiltro}
                    currentYear={anoFiltro}
                    onYearChange={(y) => { setAnoFiltro(y); setPage(1); }}
                    currentMonth=""
                    onMonthChange={() => {}}
                    onClear={handleClearFilters}
                    onExport={handleExport}
                    placeholder="Número, ano ou termo da ementa..."
                >
                    {!hideTipoFilter && (
                        <div className="flex items-center gap-3">
                           <select 
                                value={tipoFiltro} 
                                onChange={(e) => { setTipoFiltro(e.target.value); setPage(1); }}
                                className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-700 outline-none hover:border-blue-400 transition-colors shadow-sm"
                            >
                                <option value="">Todos os Tipos</option>
                                <option value="lei">Leis</option>
                                <option value="decreto">Decretos</option>
                                <option value="portaria">Portarias</option>
                                <option value="portaria_diaria">Portarias de Diárias</option>
                                <option value="resolucao">Resoluções</option>
                                <option value="lei-organica">Lei Orgânica</option>
                            </select>
                        </div>
                    )}
                </TransparencyFilters>
            </div>

            <div className="space-y-6 min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-32 gap-6">
                        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
                        <p className="font-black text-gray-300 text-[9px] uppercase tracking-[0.4em]">Consultando Atos Oficiais...</p>
                    </div>
                ) : leis.length === 0 ? (
                    <div className="bg-white rounded-[3.5rem] border border-dashed border-gray-200 p-24 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gray-50 text-gray-300 mb-8">
                            <FaSearch size={24} />
                        </div>
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-3">Nenhum documento encontrado</h3>
                        <p className="text-gray-400 font-medium text-sm italic">Tente ajustar seus filtros ou termos de pesquisa.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6">
                            <AnimatePresence mode="popLayout">
                                {leis.map((lei, idx) => {
                                    const info = tipoInfo[lei.tipo] || tipoInfo["lei"];
                                    const Icon = info.icon;
                                    return (
                                        <motion.div 
                                            key={lei.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="group relative bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 overflow-hidden"
                                        >
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 ${info.corClass}`}>
                                                <Icon size={24} className="group-hover:text-white" />
                                            </div>
                                            <div className="flex-1 text-center md:text-left">
                                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-3">
                                                    <span className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border shadow-sm ${info.corClass}`}>
                                                        {info.label}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-gray-400 font-black text-[9px] uppercase tracking-widest">
                                                        <FaCalendarAlt size={10} className="text-amber-500/50" /> {lei.ano}
                                                    </span>
                                                </div>
                                                <h3 className="font-black text-gray-800 text-lg uppercase tracking-tighter group-hover:text-blue-600 transition-colors mb-3">
                                                    {lei.numero}
                                                </h3>
                                                <div className="bg-gray-50/40 p-4 rounded-xl border border-gray-50 group-hover:bg-white transition-colors">
                                                    <p className="text-gray-500 text-xs leading-relaxed font-bold line-clamp-2 italic opacity-95">
                                                        "{lei.ementa}"
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 group-hover:scale-105 transition-transform duration-500">
                                                {lei.arquivo ? (
                                                    <a href={lei.arquivo} target="_blank" rel="noopener noreferrer"
                                                        className="w-full md:w-40 shrink-0 flex items-center justify-center gap-2 bg-[#1E293B] text-white hover:bg-blue-600 px-6 py-3.5 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/10">
                                                        <FaDownload size={10} /> Baixar PDF
                                                    </a>
                                                ) : (
                                                    <Link href="/servicos/esic"
                                                        className="w-full md:w-40 shrink-0 flex items-center justify-center gap-2 bg-gray-50 text-gray-400 hover:bg-gray-100 px-6 py-3.5 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest border border-gray-100">
                                                        Solicitar LAI
                                                    </Link>
                                                )}
                                                <button className="text-blue-600 text-[8px] font-black uppercase tracking-widest hover:underline text-center">
                                                    Ver Detalhes
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-6 mt-20">
                                <button
                                    disabled={page === 1}
                                    onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                                    className="px-8 py-4 rounded-[2rem] bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-400 shadow-xl shadow-blue-900/5 transition-all outline-none"
                                >
                                    Página Anterior
                                </button>
                                <div className="px-10 py-4 bg-blue-50 text-blue-600 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] border border-blue-100/50 shadow-inner">
                                    {page} / {totalPages}
                                </div>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                                    className="px-8 py-4 rounded-[2rem] bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-400 shadow-xl shadow-blue-900/5 transition-all outline-none"
                                >
                                    Próxima Página
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="mt-32 pt-16">
                <BannerPNTP />
                
                <div className="mt-16 space-y-4 text-center">
                    <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.4em]">Diário Oficial do Município • Legislação Municipal de Lajes Pintadas/RN</p>
                    <div className="w-12 h-1 bg-blue-500/20 mx-auto rounded-full" />
                </div>
            </div>
        </div>
    );
}
