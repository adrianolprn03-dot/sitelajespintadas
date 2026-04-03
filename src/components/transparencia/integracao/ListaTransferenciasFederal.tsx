"use client";
import { useState, useEffect } from "react";
import { 
    TrendingUp, Calendar, Landmark, ExternalLink, 
    Loader2, AlertCircle, Search, ChevronLeft, ChevronRight 
} from "lucide-react";
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

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h3 className="text-gray-800 font-black text-sm uppercase tracking-tighter">Repasses da União (CGU)</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lajes Pintadas | Base Federal</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select 
                        value={ano} 
                        onChange={(e) => setAno(e.target.value)}
                        className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                    </select>
                    <select 
                        value={mes} 
                        onChange={(e) => setMes(e.target.value)}
                        className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        {Array.from({ length: 12 }).map((_, i) => (
                            <option key={i} value={(i + 1).toString().padStart(2, '0')}>
                                {new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl flex flex-col justify-between">
                    <div>
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Total no Mês</h4>
                        <div className="text-2xl font-black text-emerald-400 tracking-tighter">
                            {totalPeriodo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                    </div>
                    <div className="mt-8">
                        <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2 italic">Destaque: FPM e FUNDEB</div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "70%" }}
                                className="h-full bg-emerald-500" 
                            />
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-[2.5rem] border border-gray-100 animate-pulse">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronizando com a CGU...</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {itens.map((item, idx) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={item.id} 
                                    className="bg-white rounded-3xl border border-gray-100 p-6 flex items-center justify-between group hover:shadow-xl transition-all"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                            <Landmark size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-gray-800 font-bold text-sm tracking-tight">{item.acao.nome}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                {item.tipoTransferencia} • {new Date(item.dataLancamento).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gray-900 font-black text-sm">
                                            {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </div>
                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">Repassado</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}

                    {!loading && itens.length === 0 && (
                        <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-gray-100">
                            <p className="text-gray-300 font-black uppercase tracking-widest text-[10px]">Nenhuma transferência federal registrada no período.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
