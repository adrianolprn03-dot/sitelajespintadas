"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaFileAlt, FaDownload, FaCalendarAlt, FaSearch, FaHistory, FaInfoCircle, FaCheckCircle, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import BannerPNTP from "./transparencia/BannerPNTP";

type Documento = {
    id: string;
    titulo: string;
    tipo: string;
    arquivo: string | null;
    documentUrl?: string | null;
    ano: number | null;
    tamanho: number | null;
    criadoEm: string;
};

interface ListaDocumentosClientProps {
    tipoDocumento: string;
    tituloVazio?: string;
    mensagemVazia?: string;
}

export default function ListaDocumentosClient({ 
    tipoDocumento, 
    tituloVazio = "Nenhum documento encontrado", 
    mensagemVazia = "Tente ajustar seus filtros ou realizar uma nova busca."
}: ListaDocumentosClientProps) {
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [loading, setLoading] = useState(true);
    const [anoFiltro, setAnoFiltro] = useState("");
    const [buscaFiltro, setBuscaFiltro] = useState("");

    const currentYear = new Date().getFullYear();
    const anos = Array.from({ length: 15 }, (_, i) => (currentYear - i).toString());

    const fetchDocumentos = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams();
            query.append("tipo", tipoDocumento);
            if (anoFiltro) query.append("ano", anoFiltro);

            const res = await fetch(`/api/documentos?${query.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setDocumentos(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocumentos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [anoFiltro]);

    const documentosFiltrados = documentos.filter(doc => 
        doc.titulo.toLowerCase().includes(buscaFiltro.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 font-['Montserrat',sans-serif]">
            {/* Seção de Filtros */}
            <div className="flex flex-col lg:flex-row gap-8 mb-16 -mt-24 relative z-30">
                {/* Painel de Filtros */}
                <div className="w-full bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-end gap-6">
                    <div className="flex-1 w-full space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Pesquisar Documento</label>
                        <div className="relative group">
                            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Ex: Decreto de nomeação..."
                                value={buscaFiltro}
                                onChange={(e) => setBuscaFiltro(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-100 transition-all outline-none text-slate-700 placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-64 space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Exercício</label>
                        <div className="relative group">
                            <FaCalendarAlt className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
                            <select
                                value={anoFiltro}
                                onChange={(e) => setAnoFiltro(e.target.value)}
                                className="w-full pl-14 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-100 transition-all outline-none cursor-pointer text-slate-700"
                            >
                                <option value="">Todos os Anos</option>
                                {anos.map(a => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                            <FaChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 rotate-90 text-[10px] pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Listagem */}
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-8 px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                            Base de Documentos
                        </h2>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-4 py-2 rounded-full border border-blue-100/50">
                        Total: {documentosFiltrados.length}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center py-32 gap-6">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
                        </div>
                        <p className="font-black text-gray-300 text-[9px] uppercase tracking-[0.4em] animate-pulse">Consultando acervo...</p>
                    </div>
                ) : documentosFiltrados.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[3.5rem] border border-dashed border-gray-200 p-24 text-center shadow-inner"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gray-50 text-gray-300 mb-8 border border-gray-100">
                            <FaSearch size={24} />
                        </div>
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-3">{tituloVazio}</h3>
                        <p className="text-gray-400 font-medium text-sm max-w-sm mx-auto">{mensagemVazia}</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <AnimatePresence mode="popLayout">
                            {documentosFiltrados.map((doc, idx) => (
                                <motion.div 
                                    key={doc.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group relative bg-white rounded-[2rem] border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-500"
                                >
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                        <FaFileAlt size={22} className="text-gray-400 group-hover:text-white transition-colors" />
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-3">
                                            <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100/50">
                                                {tipoDocumento.toUpperCase()}
                                            </span>
                                            {doc.ano && (
                                                <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 border border-gray-200/50">
                                                    Exercício {doc.ano}
                                                </span>
                                            )}
                                            <div className="flex items-center gap-2 text-gray-400 text-[9px] font-black uppercase tracking-widest ml-1">
                                                <FaHistory size={10} className="text-amber-500/70" /> {new Date(doc.criadoEm).toLocaleDateString("pt-BR")}
                                            </div>
                                        </div>
                                        <h3 className="font-black text-gray-800 text-lg uppercase tracking-tight group-hover:text-blue-600 transition-colors mb-1">
                                            {doc.titulo}
                                        </h3>
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest opacity-60">Prefeitura de Lajes Pintadas – RN</p>
                                    </div>

                                    <a 
                                        href={doc.arquivo || doc.documentUrl || "#"} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full md:w-auto shrink-0 flex items-center justify-center gap-3 bg-[#1E293B] text-white hover:bg-blue-600 px-8 py-5 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/10 active:scale-95"
                                    >
                                        <FaDownload className="text-xs" /> {doc.arquivo ? "Visualizar Arquivo" : "Acessar Link"}
                                    </a>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Rodapé Informativo */}
            <div className="mt-32 pt-16 border-t border-slate-100">
                <BannerPNTP />
                
                <div className="mt-16 space-y-4 text-center">
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">Lei de Responsabilidade Fiscal • Município de Lajes Pintadas</p>
                    <div className="w-12 h-1 bg-indigo-500/20 mx-auto rounded-full" />
                </div>
            </div>
        </div>
    );
}
