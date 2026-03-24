"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaFileAlt, FaDownload, FaCalendarAlt, FaSearch } from "react-icons/fa";

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

    // Filtragem local por título
    const documentosFiltrados = documentos.filter(doc => 
        doc.titulo.toLowerCase().includes(buscaFiltro.toLowerCase())
    );

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchDocumentos();
    };

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-16">
            {/* Aviso de atualização */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-10 flex items-start gap-4">
                <span className="text-2xl">⚠️</span>
                <div>
                    <p className="font-black text-amber-800 text-sm uppercase tracking-wider mb-1">Documentos Oficiais</p>
                    <p className="text-amber-700 text-sm font-medium">
                        Os arquivos são disponibilizados rigorosamente conforme as diretrizes do Programa Nacional de Transparência Pública (PNTP) 2025.
                        Para acesso a registros históricos não listados, entre em contato via e-SIC.
                    </p>
                    <Link href="/servicos/esic" className="inline-block mt-3 text-xs font-black uppercase tracking-widest text-amber-800 underline underline-offset-4">
                        Acessar e-SIC →
                    </Link>
                </div>
            </div>

            {/* Painel de Filtros e Busca */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
                <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Buscar no título do documento..."
                            value={buscaFiltro}
                            onChange={(e) => setBuscaFiltro(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#01b0ef] focus:ring-1 focus:ring-[#01b0ef] outline-none transition-all"
                        />
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="w-full md:w-48">
                        <input
                            type="number"
                            placeholder="Ano (ex: 2024)"
                            value={anoFiltro}
                            onChange={(e) => setAnoFiltro(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#01b0ef] focus:ring-1 focus:ring-[#01b0ef] outline-none transition-all"
                        />
                    </div>
                    <button type="submit" className="bg-[#01b0ef] hover:bg-[#0088b9] text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all">
                        Filtrar
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#01b0ef] border-t-transparent"></div>
                </div>
            ) : documentosFiltrados.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 text-gray-300 mb-6">
                        <FaSearch size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{tituloVazio}</h3>
                    <p className="text-gray-500">{mensagemVazia}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {documentosFiltrados.map((doc) => (
                        <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex items-start gap-6">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border bg-blue-50 text-blue-600 border-blue-100">
                                <FaFileAlt size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-gray-100 text-gray-600 border-gray-200">
                                        Formato PDF
                                    </span>
                                    {doc.ano && (
                                        <span className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                                            <FaCalendarAlt size={10} /> Exercício {doc.ano}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-black text-[#0088b9] text-base mb-1">{doc.titulo}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed font-medium"> Publicado em: {new Date(doc.criadoEm).toLocaleDateString("pt-BR")}</p>
                            </div>
                            <a href={doc.arquivo} target="_blank" rel="noopener noreferrer"
                                className="shrink-0 flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-[#01b0ef] hover:text-white px-4 py-2 rounded-xl transition-all text-xs font-black uppercase tracking-widest">
                                <FaDownload /> Baixar
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
