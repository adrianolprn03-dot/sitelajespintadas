"use client";
import { useState, useEffect } from "react";
import { FaBalanceScale, FaDownload, FaSearch, FaSpinner, FaCalendarAlt, FaFileContract, FaInfoCircle, FaCheckCircle, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type Documento = {
    id: string;
    titulo: string;
    tipo: string;
    arquivo: string;
    ano: number;
    tamanho: number;
};

const TIPO_DESCRICOES = {
    "PPA": "O Plano Plurianual define as diretrizes e metas da administração pública para um período de 4 anos.",
    "LDO": "A Lei de Diretrizes Orçamentárias orienta a elaboração da Lei Orçamentária Anual (LOA) do exercício seguinte.",
    "LOA": "A Lei Orçamentária Anual estima as receitas e fixa as despesas do governo para o ano seguinte."
};

export default function OrcamentoPage() {
    const [docs, setDocs] = useState<Documento[]>([]);
    const [loading, setLoading] = useState(true);
    const [tipo, setTipo] = useState("");
    const [ano, setAno] = useState(""); // Default to all years

    const currentYear = new Date().getFullYear();
    const anos = Array.from({ length: 15 }, (_, i) => (currentYear - i).toString());

    const fetchData = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams();
            if (ano) query.append("ano", ano);
            if (tipo) query.append("tipo", tipo.toUpperCase()); else query.append("tipo", "LOA,LDO,PPA");
            query.append("limit", "100");

            const res = await fetch(`/api/legislacao?${query.toString()}`);
            const data = await res.json();
            
            const mappedDocs = (data.items || []).map((item: any) => ({
                id: item.id,
                titulo: item.ementa,
                tipo: item.tipo,
                arquivo: item.arquivo,
                ano: item.ano,
                tamanho: 0
            }));
            
            setDocs(mappedDocs);
        } catch (error) {
            console.error("Erro ao buscar documentos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [ano, tipo]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-['Montserrat',sans-serif]">
            {/* Header Premium */}
            <div className="bg-[#1E293B] relative overflow-hidden pt-24 pb-32 px-6 border-b-4 border-[#3B82F6]">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 skew-x-12 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-600/5 -skew-x-12 -translate-x-1/2" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <nav className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-8 flex items-center gap-3">
                        <a href="/transparencia" className="hover:text-white transition-colors">Transparência</a>
                        <FaChevronRight className="text-[8px]" />
                        <span className="text-white opacity-60">Planejamento</span>
                        <FaChevronRight className="text-[8px]" />
                        <span className="text-white">LOA, LDO e PPA</span>
                    </nav>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/40 relative group"
                        >
                            <FaBalanceScale className="text-white text-3xl group-hover:rotate-12 transition-transform" />
                            <div className="absolute inset-0 bg-white/20 rounded-[2rem] scale-110 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                        
                        <div>
                            <motion.h1 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter"
                            >
                                Planejamento e <span className="text-blue-500 text-shadow-glow">Orçamento</span>
                            </motion.h1>
                            <p className="text-slate-400 max-w-2xl text-lg font-medium leading-relaxed">
                                Instrumentos de planejamento governamental que definem as prioridades e a aplicação dos recursos públicos de Lajes Pintadas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-16 pb-20 relative z-20">
                {/* Painel de Filtros e Card Informativo */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
                    {/* Filtros */}
                    <div className="w-full lg:col-span-4 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 p-8 md:p-10 border border-white flex flex-col md:flex-row items-stretch md:items-end gap-6 text-slate-700">
                        <div className="flex-1">
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-[0.2em] ml-2">Qual instrumento deseja consultar?</label>
                            <div className="relative group">
                                <select
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                    value={tipo}
                                    onChange={(e) => setTipo(e.target.value)}
                                >
                                    <option value="">Todos os Instrumentos</option>
                                    <option value="loa">LOA - Lei Orçamentária Anual</option>
                                    <option value="ldo">LDO - Lei de Diretrizes Orçamentárias</option>
                                    <option value="ppa">PPA - Plano Plurianual</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                                    <FaChevronRight className="rotate-90 text-[10px]" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="md:w-56">
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-[0.2em] ml-2">Exercício</label>
                            <div className="relative group">
                                <select
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                    value={ano}
                                    onChange={(e) => setAno(e.target.value)}
                                >
                                    <option value="">Todos os Anos</option>
                                    {anos.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                                    <FaChevronRight className="rotate-90 text-[10px]" />
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={fetchData}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-[1.125rem] rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            <FaSearch className="group-hover:scale-110 transition-transform" /> 
                            <span>Filtrar</span>
                        </button>
                    </div>

                </div>

                {/* Lista de Documentos */}
                <div className="mt-16 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
                        <div>
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3 mb-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                Base de Documentos
                            </h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">
                                Exibindo resultados para {tipo || "todos os instrumentos"} {ano ? `de ${ano}` : "de todos os exercícios"}
                            </p>
                        </div>
                        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm text-xs font-black text-slate-500 uppercase tracking-widest">
                            Total: <span className="text-blue-600 ml-1">{docs.length}</span>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-40 bg-white rounded-[3.5rem] border border-slate-100 shadow-inner"
                            >
                                <div className="relative mb-8">
                                    <FaSpinner className="animate-spin text-blue-600 text-6xl" />
                                    <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
                                </div>
                                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Sincronizando base de dados...</p>
                            </motion.div>
                        ) : docs.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-40 bg-white rounded-[3.5rem] border-4 border-dashed border-slate-50"
                            >
                                <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 text-slate-200">
                                    <FaCalendarAlt size={48} />
                                </div>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tighter mb-4">Nenhum registro encontrado</h2>
                                <p className="text-slate-400 font-medium max-w-md mx-auto px-6">
                                    Tente ajustar os filtros acima para encontrar o planejamento orçamentário desejado.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5">
                                {docs.map((d, idx) => (
                                    <motion.div 
                                        key={d.id} 
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="bg-white rounded-[2.5rem] p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8 border border-white shadow-xl shadow-slate-200/40 hover:border-blue-200 hover:shadow-blue-500/10 transition-all group overflow-hidden relative"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-16 -translate-y-16 group-hover:bg-blue-50/50 transition-colors" />
                                        
                                        <div className="flex items-center gap-8 flex-1 relative z-10 w-full">
                                            <div className="shrink-0 w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-500 group-hover:rotate-6 shadow-inner">
                                                <FaFileContract size={32} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                                    <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 tracking-widest">
                                                        {d.tipo}
                                                    </span>
                                                    <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200 uppercase tracking-widest">
                                                        Exercício {d.ano}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest">
                                                        <FaCheckCircle size={10} /> Consolidado
                                                    </span>
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter group-hover:text-blue-700 transition-colors line-clamp-2 md:line-clamp-none">
                                                    {d.titulo}
                                                </h3>
                                            </div>
                                        </div>
                                        <a
                                            href={d.arquivo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-[#1E293B] hover:bg-blue-600 text-white flex items-center gap-4 px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:shadow-blue-500/20 transition-all active:scale-95 group/btn w-full md:w-auto min-w-[260px] justify-center relative z-10"
                                        >
                                            <FaDownload className="group-hover/btn:-translate-y-1 transition-transform" /> 
                                            <span>Visualizar Arquivo</span>
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Seção Informativa - Mover para baixo para priorizar os documentos */}
                <div className="mt-24 border-t border-slate-100 pt-20">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Entenda os Instrumentos</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter">Conheça o Ciclo <span className="text-blue-600">Orçamentário</span></h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {Object.entries(TIPO_DESCRICOES).map(([key, desc], idx) => (
                            <div key={key} className="bg-white rounded-[3rem] p-10 border border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors" />
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-8 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-blue-500/20 transition-all duration-500">
                                        <FaFileContract size={24} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-3">
                                        <span className="text-blue-600">{idx + 1}.</span> {key}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Footer de Apoio */}
            <div className="bg-white border-t border-slate-100 pt-20 pb-24">
                <BannerPNTP />
                
                <div className="max-w-7xl mx-auto px-6 mt-16 text-center">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Lei de Responsabilidade Fiscal • Município de Lajes Pintadas</p>
                    <div className="w-12 h-1 bg-indigo-500/20 mx-auto rounded-full mt-4" />
                </div>
            </div>
        </div>
    );
}
