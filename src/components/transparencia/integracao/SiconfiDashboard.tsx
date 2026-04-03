"use client";
import { useState, useEffect } from "react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer, Cell 
} from "recharts";
import { 
    TrendingUp, Landmark, Calendar, Loader2, 
    AlertCircle, Download, FileBarChart 
} from "lucide-react";
import { motion } from "framer-motion";

interface SiconfiItem {
    coluna: string;
    conta: string;
    valor: number;
}

export default function SiconfiDashboard() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [ano, setAno] = useState(new Date().getFullYear());
    const [periodo, setPeriodo] = useState(1);

    useEffect(() => {
        fetchSiconfi();
    }, [ano, periodo]);

    async function fetchSiconfi() {
        setLoading(true);
        setError(null);
        try {
            // Anexo 1 do RREO (Balanço Orçamentário)
            const res = await fetch(`/api/integracao/siconfi?tipo=rreo&ano=${ano}&periodo=${periodo}&anexo=01`);
            const json = await res.json();
            
            if (json.error) throw new Error(json.error);
            
            // Processar dados para o gráfico (Simplificado para o Balanço Orçamentário)
            const items = json.items || [];
            if (items.length === 0) {
                setData([]);
                return;
            }

            // Filtrar totais principais (Exemplo simplificado de agregação)
            const resumo = [
                {
                    name: "Receitas",
                    valor: items.filter((i: any) => i.coluna === "Receitas Realizadas").reduce((acc: number, cur: any) => acc + cur.valor, 0)
                },
                {
                    name: "Despesas",
                    valor: items.filter((i: any) => i.coluna === "Despesas Liquidadas").reduce((acc: number, cur: any) => acc + cur.valor, 0)
                }
            ];

            setData(resumo);
        } catch (err) {
            setError("Falha ao sincronizar com o Tesouro Nacional.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-xl animate-pulse">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Sincronizando com o Tesouro Nacional...</p>
            </div>
        );
    }

    const totalReceita = data.find(d => d.name === "Receitas")?.valor || 0;
    const totalDespesa = data.find(d => d.name === "Despesas")?.valor || 0;
    const saldo = totalReceita - totalDespesa;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <FileBarChart size={24} />
                    </div>
                    <div>
                        <h3 className="text-gray-800 font-black text-sm uppercase tracking-tighter">Execução Orçamentária Única</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fonte: SICONFI / Tesouro Nacional</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select 
                        value={ano} 
                        onChange={(e) => setAno(Number(e.target.value))}
                        className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value={2025}>2025</option>
                        <option value={2024}>2024</option>
                    </select>
                    <select 
                        value={periodo} 
                        onChange={(e) => setPeriodo(Number(e.target.value))}
                        className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        {[1,2,3,4,5,6].map(b => (
                            <option key={b} value={b}>{b}º Bimestre</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 md:p-10 border border-gray-100 shadow-xl">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Comparativo Receitas vs Despesas</h4>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fill: '#64748b' }}
                                    tickFormatter={(val) => `R$ ${(val / 1000000).toFixed(1)}M`}
                                />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                    formatter={(val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                />
                                <Bar dataKey="valor" radius={[15, 15, 0, 0]} barSize={80}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-8">
                        <div className="flex items-center justify-between mb-4">
                            <TrendingUp className="text-emerald-500" />
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase">Receitas</span>
                        </div>
                        <div className="text-2xl font-black text-emerald-900 tracking-tighter">
                            {totalReceita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                        <p className="text-[10px] text-emerald-700/60 font-medium mt-2">Arrecadação total no período selecionado.</p>
                    </div>

                    <div className="bg-rose-50 border border-rose-100 rounded-[2.5rem] p-8">
                        <div className="flex items-center justify-between mb-4">
                            <Landmark className="text-rose-500" />
                            <span className="text-[9px] font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full uppercase">Despesas</span>
                        </div>
                        <div className="text-2xl font-black text-rose-900 tracking-tighter">
                            {totalDespesa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                        <p className="text-[10px] text-rose-700/60 font-medium mt-2">Total de gastos liquidados no período.</p>
                    </div>

                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/40">
                        <h4 className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2">Equilíbrio Fiscal</h4>
                        <div className={`text-2xl font-black tracking-tighter ${saldo >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Status</span>
                            <span className={`text-[9px] font-black uppercase tracking-widest rounded-full px-3 py-1 ${saldo >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                {saldo >= 0 ? 'Superavit' : 'Deficit'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            {data.length === 0 && !loading && (
                <div className="bg-white rounded-[3rem] p-16 text-center border border-gray-100 shadow-xl">
                    <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold text-sm">Nenhum dado fiscal homologado para este período no Siconfi.</p>
                </div>
            )}
        </div>
    );
}
