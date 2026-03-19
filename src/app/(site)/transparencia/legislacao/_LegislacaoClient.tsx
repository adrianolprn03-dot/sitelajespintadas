"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaFileAlt, FaScroll, FaGavel, FaDownload, FaCalendarAlt, FaSearch } from "react-icons/fa";

type Legislacao = {
    id: string;
    tipo: string;
    numero: string;
    ano: number;
    ementa: string;
    arquivo: string | null;
    criadoEm: string;
};

const tipoInfo: Record<string, { label: string; cor: string; icon: typeof FaFileAlt }> = {
    "lei-organica": { label: "Lei Orgânica", cor: "bg-purple-100 text-purple-700 border-purple-200", icon: FaScroll },
    "lei": { label: "Lei Municipal", cor: "bg-blue-100 text-blue-700 border-blue-200", icon: FaFileAlt },
    "decreto": { label: "Decreto", cor: "bg-orange-100 text-orange-700 border-orange-200", icon: FaGavel },
    "portaria": { label: "Portaria", cor: "bg-teal-100 text-teal-700 border-teal-200", icon: FaFileAlt },
    "resolucao": { label: "Resolução", cor: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: FaFileAlt },
};

export default function LegislacaoClient() {
    const [leis, setLeis] = useState<Legislacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [tipoFiltro, setTipoFiltro] = useState("");
    const [anoFiltro, setAnoFiltro] = useState("");
    const [buscaFiltro, setBuscaFiltro] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLeis = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({ page: page.toString(), limit: "20" });
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
        <div className="max-w-[1200px] mx-auto px-6 py-16">
            {/* Aviso de atualização */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-10 flex items-start gap-4">
                <span className="text-2xl">⚠️</span>
                <div>
                    <p className="font-black text-amber-800 text-sm uppercase tracking-wider mb-1">Documentos em processo de digitalização</p>
                    <p className="text-amber-700 text-sm font-medium">
                        Os documentos legislativos municipais estão sendo digitalizados e disponibilizados progressivamente.
                        Para acesso imediato a documentos não encontrados aqui, entre em contato com a Secretaria de Administração pelo e-SIC.
                    </p>
                    <Link href="/servicos/esic" className="inline-block mt-3 text-xs font-black uppercase tracking-widest text-amber-800 underline underline-offset-4">
                        Solicitar via e-SIC →
                    </Link>
                </div>
            </div>

            {/* Painel de Filtros e Busca */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
                <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Buscar por número, ano ou palavras-chave na ementa..."
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
                        Buscar
                    </button>
                </form>

                <div className="flex flex-wrap gap-2">
                    {["Todos", "lei", "decreto", "portaria", "resolucao", "lei-organica"].map((f) => {
                        const labels: Record<string, string> = {
                            "Todos": "Todos os Tipos",
                            "lei": "Leis",
                            "decreto": "Decretos",
                            "portaria": "Portarias",
                            "resolucao": "Resoluções",
                            "lei-organica": "Lei Orgânica"
                        };
                        const isActive = tipoFiltro === f || (f === "Todos" && tipoFiltro === "");
                        
                        return (
                            <button 
                                key={f} 
                                onClick={() => { setTipoFiltro(f === "Todos" ? "" : f); setPage(1); }}
                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest border transition-all ${
                                    isActive 
                                    ? "bg-[#01b0ef] text-white border-[#01b0ef]" 
                                    : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                                }`}
                            >
                                {labels[f]}
                            </button>
                        );
                    })}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#01b0ef] border-t-transparent"></div>
                </div>
            ) : leis.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 text-gray-300 mb-6">
                        <FaSearch size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhum documento encontrado</h3>
                    <p className="text-gray-500">Tente ajustar seus filtros ou realizar uma nova busca.</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {leis.map((lei) => {
                            const info = tipoInfo[lei.tipo] || tipoInfo["lei"];
                            const Icon = info.icon;
                            return (
                                <div key={lei.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex items-start gap-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${info.cor}`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${info.cor}`}>
                                                {info.label}
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                                                <FaCalendarAlt size={10} /> {lei.ano}
                                            </span>
                                        </div>
                                        <h3 className="font-black text-[#0088b9] text-base mb-1">{lei.numero}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed font-medium">{lei.ementa}</p>
                                    </div>
                                    {lei.arquivo ? (
                                        <a href={lei.arquivo} target="_blank" rel="noopener noreferrer"
                                            className="shrink-0 flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-[#01b0ef] hover:text-white px-4 py-2 rounded-xl transition-all text-xs font-black uppercase tracking-widest">
                                            <FaDownload /> PDF
                                        </a>
                                    ) : (
                                        <Link href="/servicos/esic"
                                            className="shrink-0 flex items-center gap-2 bg-gray-50 text-gray-400 hover:bg-gray-100 px-4 py-2 rounded-xl transition-all text-xs font-black uppercase tracking-widest">
                                            Solicitar
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Paginação */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-12">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-4 py-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Anterior
                            </button>
                            <span className="px-4 text-sm font-medium text-gray-600">
                                Página {page} de {totalPages}
                            </span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Próxima
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Link para e-SIC */}
            <div className="mt-16 bg-gradient-to-r from-[#0088b9] to-[#01b0ef] rounded-[2.5rem] p-10 text-white text-center">
                <h2 className="font-black text-2xl uppercase tracking-tighter mb-4">Não encontrou o que procura?</h2>
                <p className="text-blue-100 mb-8 font-medium">
                    Solicite qualquer documento oficial através do nosso canal de Acesso à Informação (e-SIC), 
                    em conformidade com a Lei 12.527/2011.
                </p>
                <Link href="/servicos/esic" className="inline-block bg-[#FDB913] text-[#0088b9] font-black px-10 py-4 rounded-2xl hover:bg-white transition-all uppercase tracking-widest text-sm shadow-xl">
                    Fazer Pedido via e-SIC
                </Link>
            </div>
        </div>
    );
}
