"use client";
import { useState, useEffect } from "react";
import { 
    FileText, Calendar, Landmark, ExternalLink, 
    Search, ChevronLeft, ChevronRight, Loader2, AlertCircle, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PNCPDocumentosModal from "./PNCPDocumentosModal";

interface PNCPItem {
    numeroControlePNCP: string;
    objetoCompra: string;
    valorTotalEstimado: number;
    valorTotalHomologado: number;
    modalidadeNome: string;
    modoDisputaNome: string;
    dataPublicacaoPncp: string;
    dataAberturaProposta: string | null;
    dataEncerramentoProposta: string | null;
    situacaoCompraNome: string;
    sequencialCompra: number;
    anoCompra: number;
    numeroCompra: string;
    processo: string;
    linkSistemaOrigem: string;
    srp: boolean;
    existeResultado?: boolean;
    amparoLegal?: { nome: string; descricao: string };
}

const MODALIDADE_COR: Record<string, string> = {
    "Pregão - Eletrônico":   "bg-blue-50 text-blue-700 border-blue-100",
    "Dispensa de Licitação": "bg-amber-50 text-amber-700 border-amber-100",
    "Inexigibilidade":       "bg-purple-50 text-purple-700 border-purple-100",
    "Concorrência - Eletrônica": "bg-teal-50 text-teal-700 border-teal-100",
};

export default function ListaPNCP() {
    const [itens, setItens] = useState<PNCPItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [filtro, setFiltro] = useState("");
    const [anoFiltro, setAnoFiltro] = useState(new Date().getFullYear().toString());

    useEffect(() => {
        fetchItens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagina, anoFiltro]);

    async function fetchItens() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/integracao/pncp?pagina=${pagina}&tamanho=10&anoInicial=${anoFiltro}&anoFinal=${anoFiltro}`);
            const data = await res.json();
            
            if (data.error) throw new Error(data.error);
            
            setItens(data.data || []);
            setTotalPaginas(data.totalPaginas || 1);
            setTotalRegistros(data.totalRegistros || 0);
        } catch (err) {
            setError("Não foi possível carregar as licitações do PNCP no momento.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const filteredItems = itens.filter(item => 
        item.objetoCompra?.toLowerCase().includes(filtro.toLowerCase()) ||
        item.modalidadeNome?.toLowerCase().includes(filtro.toLowerCase()) ||
        item.numeroCompra?.toLowerCase().includes(filtro.toLowerCase())
    );

    const anosDisponiveis = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    if (loading && pagina === 1 && !itens.length) {
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
                    className="bg-red-500 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2 mx-auto"
                >
                    <RefreshCw size={14} /> Tentar Novamente
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Cabeçalho com filtros */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/60 backdrop-blur-xl p-4 rounded-[2rem] border border-white shadow-xl">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Filtrar por objeto, modalidade ou número..." 
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/80 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-400 outline-none text-sm font-medium transition-all"
                        />
                    </div>
                    <select
                        value={anoFiltro}
                        onChange={(e) => { setAnoFiltro(e.target.value); setPagina(1); }}
                        className="py-3 px-4 bg-white/80 rounded-2xl border border-gray-100 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                        {anosDisponiveis.map(a => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                </div>
                
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {totalRegistros} processo{totalRegistros !== 1 ? "s" : ""} encontrado{totalRegistros !== 1 ? "s" : ""}
                    </span>
                    <button 
                        disabled={pagina === 1 || loading}
                        onClick={() => setPagina(p => p - 1)}
                        className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm disabled:opacity-30 hover:bg-primary-50 transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {pagina}/{totalPaginas}
                    </span>
                    <button 
                        disabled={pagina === totalPaginas || loading}
                        onClick={() => setPagina(p => p + 1)}
                        className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm disabled:opacity-30 hover:bg-primary-50 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Lista */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item, idx) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.04 }}
                                key={item.numeroControlePNCP} 
                                className="group relative bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary-500/10 transition-colors" />
                                
                                <div className="flex flex-col gap-5">
                                    {/* Badges */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${MODALIDADE_COR[item.modalidadeNome] || "bg-gray-50 text-gray-600 border-gray-100"}`}>
                                            {item.modalidadeNome}
                                        </span>
                                        <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-emerald-100">
                                            {item.situacaoCompraNome}
                                        </span>
                                        {item.srp && (
                                            <span className="bg-orange-50 text-orange-700 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-orange-100">
                                                SRP
                                            </span>
                                        )}
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-auto">
                                            Nº {item.numeroCompra}/{item.anoCompra} • Proc. {item.processo}
                                        </span>
                                    </div>

                                    {/* Objeto */}
                                    <h3 className="text-gray-800 font-bold text-base leading-snug group-hover:text-primary-600 transition-colors line-clamp-3">
                                        {item.objetoCompra}
                                    </h3>

                                    {/* Infos */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={13} className="text-gray-400 shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Publicação</span>
                                                <span className="text-[11px] font-bold text-gray-700">
                                                    {new Date(item.dataPublicacaoPncp).toLocaleDateString("pt-BR")}
                                                </span>
                                            </div>
                                        </div>
                                        {item.dataAberturaProposta && (
                                            <div className="flex items-center gap-2">
                                                <Calendar size={13} className="text-blue-400 shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Abertura</span>
                                                    <span className="text-[11px] font-bold text-gray-700">
                                                        {new Date(item.dataAberturaProposta).toLocaleDateString("pt-BR")}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Landmark size={13} className="text-gray-400 shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Valor Estimado</span>
                                                <span className="text-[11px] font-bold text-gray-700">
                                                    {item.valorTotalEstimado?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                </span>
                                            </div>
                                        </div>
                                        {item.valorTotalHomologado > 0 && (
                                            <div className="flex items-center gap-2">
                                                <Landmark size={13} className="text-green-500 shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Val. Homologado</span>
                                                    <span className="text-[11px] font-bold text-green-700">
                                                        {item.valorTotalHomologado?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Amparo Legal */}
                                    {item.amparoLegal && (
                                        <p className="text-[10px] text-gray-400 italic bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                            📋 {item.amparoLegal.nome}
                                        </p>
                                    )}

                                    {/* Ações */}
                                    <div className="flex flex-wrap gap-3 pt-1">
                                        <PNCPDocumentosModal
                                            anoCompra={item.anoCompra}
                                            sequencialCompra={item.sequencialCompra}
                                            numeroCompra={item.numeroCompra}
                                            objetoCompra={item.objetoCompra}
                                        />
                                        <a 
                                            href={`https://pncp.gov.br/app/editais/${item.numeroControlePNCP}`}
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-primary-600 hover:scale-105 transition-all shadow-xl"
                                        >
                                            Ver no PNCP <ExternalLink size={10} />
                                        </a>
                                        {item.linkSistemaOrigem && (
                                            <a 
                                                href={item.linkSistemaOrigem}
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:scale-105 transition-all"
                                            >
                                                <FileText size={10} /> Portal de Compras
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {filteredItems.length === 0 && !loading && (
                <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
                    <p className="text-gray-300 font-black uppercase tracking-widest text-xs">
                        Nenhum processo federal encontrado para Lajes Pintadas em {anoFiltro}.
                    </p>
                </div>
            )}
        </div>
    );
}
