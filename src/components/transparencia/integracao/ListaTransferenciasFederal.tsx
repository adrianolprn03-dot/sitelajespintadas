"use client";
import { useState, useEffect } from "react";
import { 
    TrendingUp, Calendar, Landmark, ExternalLink, 
    Loader2, AlertCircle, Search, ChevronLeft, ChevronRight 
} from "lucide-react";
import { FaLandmark, FaChartLine, FaRegClock } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface Transferencia {
    id: number;
    dataLancamento: string;
    valor: number;
    tipoTransferencia: string;
    acao: { nome: string };
}

export default function ListaTransferenciasFederal() {
    const [itens, setItens] = useState<Transferencia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [ano, setAno] = useState("2024");
    const [mes, setMes] = useState("03");

    useEffect(() => {
        fetchTransferencias();
    }, [ano, mes]);

    async function fetchTransferencias() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/integracao/cgu?ano=${ano}&mes=${mes}`);
            const data = await res.json();
            
            if (data.error) throw new Error(data.error);
            setItens(data.items || []);
        } catch (err) {
            setError("Falha ao carregar repasses federais.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const totalPeriodo = itens.reduce((acc, cur) => acc + cur.valor, 0);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="space-y-8 font-['Montserrat',sans-serif]">
            {/* Header de Controle do Componente */}
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between bg-white/40 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/60 shadow-2xl shadow-slate-200/20">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                        <FaLandmark size={28} />
                    </div>
                    <div>
                        <h3 className="text-slate-800 font-black text-lg uppercase tracking-tighter leading-none mb-1">Tesouro Nacional</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                           <FaRegClock className="text-emerald-500" /> Sincronizado via API CGU
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-[1.5rem] border border-slate-100 shadow-inner">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
                        <FaCalendarAlt className="text-slate-300" size={12} />
                        <select 
                            value={ano} 
                            onChange={(e) => setAno(e.target.value)}
                            className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none transition-all hover:text-emerald-600 appearance-none pr-4"
                        >
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
                        <select 
                            value={mes} 
                            onChange={(e) => setMes(e.target.value)}
                            className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none transition-all hover:text-emerald-600 appearance-none pr-4"
                        >
                            {Array.from({ length: 12 }).map((_, i) => (
                                <option key={i} value={(i + 1).toString().padStart(2, '0')}>
                                    {new Date(0, i).toLocaleString('pt-BR', { month: 'long' }).toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Card Bento Lateral - Resumo Financeiro */}
                <div className="lg:col-span-1 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-900/10 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute -inset-24 bg-emerald-500/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Volume Mensal</span>
                            <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center">
                                <FaChartLine size={14} />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-white tracking-tighter leading-none mb-2">
                            {totalPeriodo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-10 leading-relaxed italic">
                            Somatória integral dos repasses constitucionais e fundo-a-fundo.
                        </p>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-white/5 mt-auto">
                        <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_white]" />
                             Status da Transmissão
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5 }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" 
                            />
                        </div>
                    </div>
                </div>

                {/* Lista de Itens Principal */}
                <div className="lg:col-span-3 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-slate-100/50 shadow-inner group">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-200 border border-slate-50 mb-6 text-emerald-500"
                            >
                                <Loader2 size={32} />
                            </motion.div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-emerald-600 transition-colors">
                                Sincronizando com Base CGU...
                            </p>
                        </div>
                    ) : (
                        <motion.div 
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="space-y-4"
                        >
                            <AnimatePresence mode="popLayout">
                                {itens.map((item, idx) => (
                                    <motion.div 
                                        layout
                                        variants={itemVariants}
                                        key={item.id} 
                                        className="bg-white/70 backdrop-blur-lg rounded-[2rem] border border-white/60 p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between group shadow-xl shadow-slate-200/30 hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-500 ease-out z-10 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/20 rounded-bl-[4rem] group-hover:scale-110 transition-transform -z-0"></div>
                                        
                                        <div className="flex items-center gap-6 relative z-10 w-full sm:w-auto">
                                            <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 group-hover:rotate-6 shadow-sm border border-slate-100">
                                                <Landmark size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-slate-800 font-black text-sm tracking-tight uppercase group-hover:text-emerald-700 transition-colors line-clamp-1">{item.acao.nome}</h4>
                                                <div className="flex items-center gap-4 mt-1.5">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                        {item.tipoTransferencia}
                                                    </span>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-2">
                                                        <FaCalendarAlt size={8} /> {new Date(item.dataLancamento).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right mt-6 sm:mt-0 relative z-10 w-full sm:w-auto">
                                            <div className="text-slate-900 font-black text-xl tracking-tighter mb-1">
                                                {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </div>
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.25em] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                                                    Liquidado
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {!loading && itens.length === 0 && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[3rem] p-32 text-center border border-slate-100 border-dashed group"
                        >
                            <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-slate-200 group-hover:scale-110 transition-transform duration-700">
                                <Search size={40} />
                            </div>
                            <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">Sem registros federais</h4>
                            <p className="text-slate-400 font-bold italic text-xs max-w-sm mx-auto">Não foram detectados repasses da União para o período e critérios selecionados.</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
