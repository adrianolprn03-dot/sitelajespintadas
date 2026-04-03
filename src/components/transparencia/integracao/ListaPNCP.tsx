"use client";
import { useState, useEffect } from "react";
import { 
    FileText, Calendar, Landmark, ExternalLink, 
    Search, Filter, ChevronLeft, ChevronRight, Loader2, AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PNCPItem {
    numeroControlePNCP: string;
    objetoContratacao: string;
    valorTotalEstimado: number;
    modalidadeNome: string;
    dataPublicacaoPncp: string;
    situacaoNome: string;
    numeroSequencial: number;
    anoContratacao: number;
}

export default function ListaPNCP() {
    const [itens, setItens] = useState<PNCPItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        fetchItens();
    }, [pagina]);

    async function fetchItens() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/integracao/pncp?pagina=${pagina}&tamanho=10`);
            const data = await res.json();
            
            if (data.error) throw new Error(data.error);
            
            setItens(data.data || []);
            setTotalPaginas(data.totalPaginas || 1);
        } catch (err) {
            setError("Não foi possível carregar as licitações do PNCP no momento.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const filteredItems = itens.filter(item => 
        item.objetoContratacao.toLowerCase().includes(filtro.toLowerCase()) ||
        item.modalidadeNome.toLowerCase().includes(filtro.toLowerCase())
    );

    if (loading && pagina === 1) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Consultando Base Federal (PNCP)...</p>
            </div>
        );
    }

    if (error && itens.length === 0) {
        return (
            <div className="bg-red-50 border border-red-100 rounded-[2rem] p-10 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-red-900 font-black uppercase tracking-tight mb-2">Falha na Conexão Federal</h3>
                <p className="text-red-600 text-sm font-medium mb-6">{error}</p>
                <button 
                    onClick={() => fetchItens()}
                    className="bg-red-500 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-600 transition-all"
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/60 backdrop-blur-xl p-4 rounded-[2rem] border border-white shadow-xl">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Filtrar por objeto ou modalidade..." 
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/80 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-400 outline-none text-sm font-medium transition-all"
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        disabled={pagina === 1 || loading}
                        onClick={() => setPagina(p => p - 1)}
                        className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm disabled:opacity-30 hover:bg-primary-50 transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Página {pagina} de {totalPaginas}</span>
                    <button 
                        disabled={pagina === totalPaginas || loading}
                        onClick={() => setPagina(p => p + 1)}
                        className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm disabled:opacity-30 hover:bg-primary-50 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, idx) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            key={item.numeroControlePNCP} 
                            className="group relative bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary-500/10 transition-colors" />
                            
                            <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="bg-primary-50 text-primary-700 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-primary-100">
                                            {item.modalidadeNome}
                                        </span>
                                        <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-emerald-100">
                                            {item.situacaoNome}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            PNCP: {item.numeroSequencial}/{item.anoContratacao}
                                        </span>
                                    </div>

                                    <h3 className="text-gray-800 font-bold text-base leading-snug group-hover:text-primary-600 transition-colors">
                                        {item.objetoContratacao}
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                                                <Calendar size={14} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Publicação</span>
                                                <span className="text-[11px] font-bold text-gray-700">
                                                    {new Date(item.dataPublicacaoPncp).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                                                <Landmark size={14} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Valor Estimado</span>
                                                <span className="text-[11px] font-bold text-gray-700">
                                                    {item.valorTotalEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 md:justify-end">
                                            <a 
                                                href={`https://pncp.gov.br/app/editais/${item.numeroControlePNCP}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-primary-500 hover:scale-105 transition-all shadow-xl"
                                            >
                                                Ver no PNCP <ExternalLink size={10} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredItems.length === 0 && !loading && (
                <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
                    <p className="text-gray-300 font-black uppercase tracking-widest text-xs">Nenhum processo federal encontrado para Lajes Pintadas em 2024/2025.</p>
                </div>
            )}
        </div>
    );
}
