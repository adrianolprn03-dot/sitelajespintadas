"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    FaFileAlt, FaScroll, FaGavel, FaDownload, 
    FaCalendarAlt, FaSearch, FaHistory, FaInfoCircle, 
    FaCheckCircle, FaSpinner, FaArrowRight, FaFilter,
    FaRegFileLines, FaScaleBalanced, FaFileSignature,
    FaArrowDownWideShort, FaMagnifyingGlass
} from "react-icons/fa6";
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
    "lei-organica": { label: "Lei Orgânica", corClass: "bg-purple-50 text-purple-600 border-purple-100", icon: FaScroll },
    "lei": { label: "Lei Municipal", corClass: "bg-blue-50 text-blue-600 border-blue-100", icon: FaScaleBalanced },
    "decreto": { label: "Decreto", corClass: "bg-amber-50 text-amber-600 border-amber-100", icon: FaGavel },
    "portaria": { label: "Portaria", corClass: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: FaFileSignature },
    "portaria_diaria": { label: "Portaria de Diária", corClass: "bg-rose-50 text-rose-600 border-rose-100", icon: FaRegFileLines },
    "resolucao": { label: "Resolução", corClass: "bg-indigo-50 text-indigo-600 border-indigo-100", icon: FaFileAlt },
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
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-8 mb-16 -mt-24 relative z-30"
            >
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-2">
                    <TransparencyFilters
                        searchValue={buscaFiltro}
                        onSearch={setBuscaFiltro}
                        currentYear={anoFiltro}
                        onYearChange={(y) => { setAnoFiltro(y); setPage(1); }}
                        currentMonth=""
                        onMonthChange={() => {}}
                        onClear={handleClearFilters}
                        onExport={handleExport}
                        placeholder="Pesquisar por número, ano ou termos da ementa..."
                    >
                        {!hideTipoFilter && (
                            <div className="flex items-center gap-3">
                               <select 
                                    value={tipoFiltro} 
                                    onChange={(e) => { setTipoFiltro(e.target.value); setPage(1); }}
                                    className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-700 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all cursor-pointer"
                                >
                                    <option value="">TODOS OS ATOS</option>
                                    <option value="lei">LEIS MUNICIPAIS</option>
                                    <option value="decreto">DECRETOS</option>
                                    <option value="portaria">PORTARIAS</option>
                                    <option value="portaria_diaria">DIÁRIAS</option>
                                    <option value="resolucao">RESOLUÇÕES</option>
                                    <option value="lei-organica">LEI ORGÂNICA</option>
                                </select>
                            </div>
                        )}
                    </TransparencyFilters>
                </div>
            </motion.div>

            <div className="space-y-6 min-h-[500px]">
                {loading ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col justify-center items-center py-40 gap-6"
                    >
                        <FaSpinner className="animate-spin text-blue-600 text-5xl" />
                        <p className="font-black text-slate-300 text-[10px] uppercase tracking-[0.4em]">Sincronizando Atos Oficiais...</p>
                    </motion.div>
                ) : leis.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[3.5rem] border-4 border-dashed border-slate-100 p-24 text-center group"
                    >
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-slate-50 text-slate-200 mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <FaMagnifyingGlass size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-3">Nenhum ato localizado</h3>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest opacity-60">Ajuste os filtros para uma nova consulta na base de legislação.</p>
                        <button 
                            onClick={handleClearFilters}
                            className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                        >
                            Resetar Filtros
                        </button>
                    </motion.div>
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
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: idx * 0.04, duration: 0.5 }}
                                            className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 overflow-hidden"
                                        >
                                            {/* Left Icon Area */}
                                            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shrink-0 border-2 transition-all duration-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 shadow-sm ${info.corClass}`}>
                                                <Icon size={36} className="group-hover:scale-110 transition-transform duration-700" />
                                            </div>

                                            {/* Central Content */}
                                            <div className="flex-1 text-center md:text-left">
                                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-4">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm transition-colors group-hover:bg-white/10 ${info.corClass}`}>
                                                        {info.label}
                                                    </span>
                                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest shadow-inner group-hover:bg-white transition-colors">
                                                        <FaCalendarAlt size={10} className="text-blue-500/50" /> Exercício {lei.ano}
                                                    </div>
                                                </div>
                                                
                                                <h3 className="font-black text-slate-900 text-2xl uppercase tracking-tighter group-hover:text-blue-600 transition-colors mb-4 md:mb-5 leading-none">
                                                    Nº {lei.numero}
                                                </h3>

                                                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 group-hover:bg-blue-50/30 group-hover:border-blue-100 transition-all duration-500">
                                                    <p className="text-slate-600 text-sm leading-relaxed font-bold italic opacity-90 group-hover:opacity-100 transition-opacity">
                                                        {lei.ementa}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Actions Area */}
                                            <div className="flex flex-col gap-3 min-w-[180px] w-full md:w-auto">
                                                {lei.arquivo ? (
                                                    <a 
                                                        href={lei.arquivo} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-3 bg-slate-900 text-white hover:bg-blue-600 px-8 py-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:shadow-blue-600/30 active:scale-95"
                                                    >
                                                        <FaDownload size={14} /> PDF Oficial
                                                    </a>
                                                ) : (
                                                    <Link 
                                                        href="/servicos/esic"
                                                        className="flex items-center justify-center gap-3 bg-slate-50 text-slate-400 hover:bg-slate-200 px-8 py-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 shadow-inner active:scale-95"
                                                    >
                                                        Solicitar LAI
                                                    </Link>
                                                )}
                                                <button className="flex items-center justify-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:translate-x-2 transition-all p-2 group/btn">
                                                    Ficha Técnica <FaArrowRight className="group-hover/btn:translate-x-1" size={10} />
                                                </button>
                                            </div>

                                            {/* Decorative Elements */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors duration-700 -z-10" />
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Pagination Premium */}
                        {totalPages > 1 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-center items-center gap-8 mt-24"
                            >
                                <button
                                    disabled={page === 1}
                                    onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                                    className="group flex items-center gap-4 px-10 py-5 rounded-2xl bg-white border border-slate-100 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-900 hover:text-white disabled:opacity-20 disabled:pointer-events-none shadow-xl shadow-slate-200/50 transition-all active:scale-90"
                                >
                                    <FaArrowRight className="rotate-180 group-hover:-translate-x-2 transition-transform" /> Anterior
                                </button>
                                
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 font-mono">Página</span>
                                    <div className="px-10 py-5 bg-blue-50 text-blue-700 rounded-3xl text-sm font-black tracking-widest border-2 border-blue-100 shadow-inner min-w-[120px] text-center">
                                        {page} <span className="opacity-20 mx-2">/</span> {totalPages}
                                    </div>
                                </div>
                                
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                                    className="group flex items-center gap-4 px-10 py-5 rounded-2xl bg-white border border-slate-100 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-900 hover:text-white disabled:opacity-20 disabled:pointer-events-none shadow-xl shadow-slate-200/50 transition-all active:scale-90"
                                >
                                    Próxima <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </motion.div>
                        )}
                    </>
                )}
            </div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-32 border-t border-slate-100 pt-20"
            >
                <BannerPNTP />
                
                <div className="mt-20 space-y-6 text-center max-w-2xl mx-auto">
                    <div className="flex justify-center gap-2 mb-4">
                        {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-600/20" />)}
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] leading-relaxed">
                        Sistema Integrado de Legislação Municipal • Lajes Pintadas/RN <br/>
                        <span className="opacity-40">Compilação Oficial de Atos Normativos • LAI 12.527/2011</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
