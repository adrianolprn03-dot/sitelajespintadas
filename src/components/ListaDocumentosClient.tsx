"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaFileAlt, FaDownload, FaCalendarAlt, FaSearch, FaHistory, FaInfoCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

type Documento = {
    id: string;
    titulo: string;
    tipo: string;
    arquivo: string;
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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchDocumentos();
    };

    return (
        <div className="max-w-[1240px] mx-auto px-6 py-20 font-['Montserrat',sans-serif]">
            {/* Aviso de Transparência Ativa */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 mb-16 text-white shadow-2xl shadow-blue-200 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shrink-0 border border-white/30">
                        <FaInfoCircle size={32} className="text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Transparência Ativa PNTP 2025</h2>
                        <p className="text-blue-50 font-medium leading-relaxed max-w-2xl">
                            Estes arquivos são disponibilizados rigorosamente conforme as diretrizes do Programa Nacional de Transparência Pública. 
                            Acesso fácil, rápido e em formatos abertos para o controle social.
                        </p>
                    </div>
                    <Link href="/servicos/esic" className="shrink-0 bg-white text-blue-700 font-black px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all uppercase tracking-widest text-[10px] shadow-lg">
                        Solicitar via e-SIC
                    </Link>
                </div>
            </motion.div>

            {/* Painel de Filtros e Busca de Luxo */}
            <div className="bg-white rounded-[3rem] p-8 mb-12 shadow-xl shadow-gray-200/40 border border-gray-100/50 flex flex-col lg:flex-row lg:items-center gap-6">
                <form onSubmit={handleSearchSubmit} className="flex-1 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar no título do documento..."
                            value={buscaFiltro}
                            onChange={(e) => setBuscaFiltro(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                        />
                    </div>
                    <div className="w-full md:w-48 relative group">
                        <FaCalendarAlt className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="number"
                            placeholder="Ano"
                            value={anoFiltro}
                            onChange={(e) => setAnoFiltro(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-blue-200 active:scale-95">
                        Filtrar
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex flex-col justify-center items-center py-32 gap-6">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
                    </div>
                    <p className="font-black text-gray-400 text-[10px] uppercase tracking-[0.3em] animate-pulse">Carregando Acervo...</p>
                </div>
            ) : documentosFiltrados.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[4rem] border border-dashed border-gray-200 p-24 text-center shadow-inner"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gray-50 text-gray-300 mb-8 border border-gray-100">
                        <FaSearch size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight mb-3">{tituloVazio}</h3>
                    <p className="text-gray-400 font-medium max-w-sm mx-auto">{mensagemVazia}</p>
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
                                className="group relative bg-white rounded-[2.5rem] border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-500"
                            >
                                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center shrink-0 border border-gray-100 shadow-inner group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                    <FaFileAlt size={28} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-3">
                                        <span className="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                                            Documento Oficial
                                        </span>
                                        {doc.ano && (
                                            <span className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                                <FaCalendarAlt size={10} className="text-blue-500" /> Exercício {doc.ano}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                            <FaHistory size={10} className="text-amber-500" /> {new Date(doc.criadoEm).toLocaleDateString("pt-BR")}
                                        </span>
                                    </div>
                                    <h3 className="font-black text-gray-800 text-lg uppercase tracking-tight group-hover:text-blue-600 transition-colors mb-1">
                                        {doc.titulo}
                                    </h3>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Lajes Pintadas – Rio Grande do Norte</p>
                                </div>
                                <a 
                                    href={doc.arquivo} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full md:w-auto shrink-0 flex items-center justify-center gap-3 bg-blue-600 text-white hover:bg-blue-700 px-8 py-5 rounded-[1.5rem] transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 active:scale-95"
                                >
                                    <FaDownload /> Baixar PDF
                                </a>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Rodapé Informativo */}
            <div className="mt-24 text-center">
                <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.4em] mb-4">Lei de Responsabilidade Fiscal • LDP • PNTP</p>
                <div className="w-16 h-1 bg-gray-200 mx-auto rounded-full" />
            </div>
        </div>
    );
}
