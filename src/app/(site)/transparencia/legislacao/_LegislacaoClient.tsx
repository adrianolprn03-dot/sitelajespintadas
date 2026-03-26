"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaFileAlt, FaScroll, FaGavel, FaDownload, FaCalendarAlt, FaSearch, FaHistory, FaInfoCircle, FaCheckCircle, FaGavel as FaLaw } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
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

    const currentYear = new Date().getFullYear();
    const anos = Array.from({ length: 20 }, (_, i) => (currentYear - i).toString());

    const fetchLeis = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({ page: page.toString(), limit: "15" });
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
    }, [tipoFiltro, anoFiltro, page]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchLeis();
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 font-['Montserrat',sans-serif]">
            {/* Filtros e Info PNTP */}
            <div className="flex flex-col lg:flex-row gap-8 mb-16 -mt-24 relative z-30">
                <div className="flex-1 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-blue-900/5 border border-white flex flex-col gap-8">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-end gap-6">
                        <div className="flex-1 w-full space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 ml-2">Pesquisar Legislação</label>
                            <div className="relative group">
                                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Número, ano ou termo da ementa..."
                                    value={buscaFiltro}
                                    onChange={(e) => setBuscaFiltro(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-48 space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 ml-2">Ano</label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                                <select
                                    value={anoFiltro}
                                    onChange={(e) => { setAnoFiltro(e.target.value); setPage(1); }}
                                    className="w-full pl-14 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold appearance-none focus:ring-4 focus:ring-blue-500/10 transition-all outline-none cursor-pointer"
                                >
                                    <option value="">Todos</option>
                                    {anos.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg active:scale-95">
                            Filtrar
                        </button>
                    </form>

                    {!hideTipoFilter && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                            {["Todos", "lei", "decreto", "portaria", "resolucao", "lei-organica"].map((f) => {
                                const labels: Record<string, string> = {
                                    "Todos": "Todos os Tipos",
                                    "lei": "Leis",
                                    "decreto": "Decretos",
                                    "portaria": "Portarias",
                                    "resolucao": "Resoluções",
                                    "lei-organica": "Lei Orgânica"
                                };
                                const isActive = tipoFiltro === f || (f === "Todos" && (tipoFiltro === "" || tipoFiltro === "Todos"));
                                return (
                                    <button 
                                        key={f} 
                                        onClick={() => { setTipoFiltro(f === "Todos" ? "" : f); setPage(1); }}
                                        className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                            isActive 
                                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200" 
                                            : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100"
                                        }`}
                                    >
                                        {labels[f]}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Card PNTP */}
                <div className="lg:w-80 bg-[#1E293B] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                <FaCheckCircle className="text-white" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">LEGALIDADE</span>
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-tight mb-2">Transparência Ativa</h4>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                            Atos oficiais publicados em conformidade com a Lei de Acesso à Informação (Lei 12.527/2011).
                        </p>
                    </div>
                </div>
            </div>

            {/* Listagem */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-32 gap-6">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
                        </div>
                        <p className="font-black text-gray-300 text-[9px] uppercase tracking-[0.4em] animate-pulse">Consultando Atos Oficiais...</p>
                    </div>
                ) : leis.length === 0 ? (
                    <div className="bg-white rounded-[3.5rem] border border-dashed border-gray-200 p-24 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gray-50 text-gray-300 mb-8">
                            <FaSearch size={24} />
                        </div>
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-3">Nenhum documento encontrado</h3>
                        <p className="text-gray-400 font-medium text-sm">Tente ajustar seus filtros ou termos de pesquisa.</p>
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
                                            className="group relative bg-white rounded-[2rem] border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500"
                                        >
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 ${info.corClass}`}>
                                                <Icon size={22} className="group-hover:text-white" />
                                            </div>
                                            <div className="flex-1 text-center md:text-left">
                                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-3">
                                                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${info.corClass}`}>
                                                        {info.label}
                                                    </span>
                                                    <span className="flex items-center gap-2 text-gray-300 font-black text-[9px] uppercase tracking-widest">
                                                        <FaCalendarAlt size={10} className="text-amber-500/70" /> {lei.ano}
                                                    </span>
                                                </div>
                                                <h3 className="font-black text-gray-800 text-lg uppercase tracking-tight group-hover:text-blue-600 transition-colors mb-2">
                                                    {lei.numero}
                                                </h3>
                                                <p className="text-gray-500 text-sm leading-relaxed font-medium line-clamp-2 uppercase tracking-tight opacity-80">
                                                    {lei.ementa}
                                                </p>
                                            </div>
                                            {lei.arquivo ? (
                                                <a href={lei.arquivo} target="_blank" rel="noopener noreferrer"
                                                    className="w-full md:w-auto shrink-0 flex items-center justify-center gap-3 bg-[#1E293B] text-white hover:bg-blue-600 px-8 py-5 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/10">
                                                    <FaDownload size={12} /> Ver PDF
                                                </a>
                                            ) : (
                                                <Link href="/servicos/esic"
                                                    className="w-full md:w-auto shrink-0 flex items-center justify-center gap-3 bg-gray-50 text-gray-400 hover:bg-gray-100 px-8 py-5 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest border border-gray-100">
                                                    Solicitar
                                                </Link>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Paginação Premium */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-16">
                                <button
                                    disabled={page === 1}
                                    onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="px-6 py-3 rounded-xl bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 disabled:opacity-30 shadow-sm transition-all"
                                >
                                    Anterior
                                </button>
                                <div className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100/50">
                                    Página {page} / {totalPages}
                                </div>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="px-6 py-3 rounded-xl bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 disabled:opacity-30 shadow-sm transition-all"
                                >
                                    Próxima
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Rodapé Informativo */}
            <div className="mt-32 pt-16 border-t border-gray-100">
                <BannerPNTP />
                
                <div className="mt-16 space-y-4 text-center">
                    <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.4em]">Diário Oficial do Município • Legislação Municipal de Lajes Pintadas</p>
                    <div className="w-12 h-1 bg-blue-500/20 mx-auto rounded-full" />
                </div>
            </div>
        </div>
    );
}
