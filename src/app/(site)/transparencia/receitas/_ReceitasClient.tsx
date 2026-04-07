"use client";

import { useState, useEffect } from "react";
import { 
    FaChartBar, FaSpinner, FaCoins, FaHistory, 
    FaTable, FaChartLine, FaWallet, FaSearch, 
    FaArrowRight, FaArrowTrendUp, FaBuildingColumns,
    FaArrowTrendDown, FaMagnifyingGlass, FaCircleCheck,
    FaCircleInfo, FaDownload, FaFilter
} from "react-icons/fa6";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type Receita = {
    id: string;
    descricao: string;
    categoria: string;
    valor: number;
    mes: number;
    ano: number;
    criadoEm: string;
};

const mesesLabels = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const mesesAbrev = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const COLORS = ["#3b82f6", "#0ea5e9", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function ReceitasPage() {
    const [receitas, setReceitas] = useState<Receita[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState("");
    const [categoria, setCategoria] = useState("");
    const [aba, setAba] = useState<"tabela" | "grafico">("tabela");

    useEffect(() => {
        const fetchReceitas = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    ano,
                    mes,
                    categoria,
                    query: busca
                });
                const res = await fetch(`/api/receitas?${query.toString()}`);
                const data = await res.json();
                setReceitas(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar receitas:", error);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchReceitas, 300);
        return () => clearTimeout(timer);
    }, [ano, mes, categoria, busca]);

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setMes("");
        setCategoria("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = receitas.map(r => ({
            "Descrição": r.descricao,
            "Categoria": r.categoria,
            "Mês": mesesLabels[r.mes-1],
            "Ano": r.ano,
            "Valor Arrecadado": fmt(r.valor)
        }));

        const filename = `receitas_${mes || 'anual'}_${ano}`;
        const title = `Relatório de Arrecadação de Receitas – Lajes Pintadas/RN (${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const totalArrecadado = receitas.reduce((acc, curr) => acc + curr.valor, 0);

    const dadosGrafico = Array.from({ length: 12 }, (_, i) => ({
        name: mesesAbrev[i],
        valor: receitas.filter(r => r.mes === i + 1).reduce((sum, r) => sum + r.valor, 0)
    })).filter(d => d.valor > 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Arrecadação de Receitas"
                subtitle="Transparência sobre as fontes de recursos e o ingresso de receitas nos cofres públicos."
                variant="premium"
                icon={<FaCoins />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Receitas" }
                ]}
            />

            <motion.main 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-width-[1240px] mx-auto px-6 py-12 -mt-16 relative z-30"
            >
                {/* Summary Section - Diamond Standard Bento */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch">
                    
                    {/* Primary Highlight Card - Total Arrecadado */}
                    <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden group border border-slate-800">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] -mr-40 -mt-40 group-hover:bg-emerald-600/20 transition-all duration-700" />
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Fluxo Arrecadatório Ativo</span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <div className="flex items-center gap-2">
                                            <FaCircleCheck className="text-emerald-400" size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Certificado PNTP</span>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 mb-3 ml-1">Volume Arrecadado</h3>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-7xl font-black tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
                                        {loading ? <FaSpinner className="animate-spin text-4xl" /> : fmt(totalArrecadado).split(',')[0]}
                                    </span>
                                    <span className="text-2xl font-black text-white/20">,{fmt(totalArrecadado).split(',')[1]}</span>
                                </div>
                            </div>
                            
                            <div className="mt-16 flex flex-wrap gap-12 items-center border-t border-white/5 pt-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Ano base</span>
                                    <span className="text-2xl font-black tracking-tight">{ano} <span className="text-sm text-white/40 font-bold uppercase">Exercício</span></span>
                                </div>
                                <div className="w-px h-12 bg-white/5 hidden md:block" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Performance Fiscal</span>
                                    <span className="text-2xl font-black tracking-tight uppercase italic text-emerald-400">Arrecadação <span className="text-white/40 font-bold">Consolidada</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Context Card */}
                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100/50 flex flex-col justify-between relative overflow-hidden group">
                         <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                         <div className="relative">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-inner group-hover:shadow-emerald-600/40">
                                <FaWallet className="text-emerald-200 group-hover:text-white transition-colors" size={36} />
                            </div>
                            <h4 className="text-3xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-4 uppercase">
                                Gestão de <br/> <span className="text-emerald-600">Receitas</span>
                            </h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed opacity-80">
                                Monitoramento das fontes de recursos próprios e transferências constitucionais.
                            </p>
                         </div>
                         <div className="pt-10 border-t border-slate-50">
                             <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Consultada</span>
                                 </div>
                                 <FaCircleInfo className="text-slate-200" />
                             </div>
                         </div>
                    </div>
                </motion.div>

                {/* Advanced Filters Section */}
                <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-2 mb-12">
                    <TransparencyFilters
                        searchValue={busca}
                        onSearch={setBusca}
                        currentYear={ano}
                        onYearChange={setAno}
                        currentMonth={mes}
                        onMonthChange={setMes}
                        onClear={handleClearFilters}
                        onExport={handleExport}
                        placeholder="Pesquisar por descrição da receita (ex: FPM, ICMS, IPTU)..."
                    >
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-emerald-600 transition-colors z-10">
                                    <FaFilter size={14} />
                                </div>
                                <select 
                                    value={categoria} 
                                    onChange={(e) => setCategoria(e.target.value)}
                                    className="pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none focus:ring-4 focus:ring-emerald-600/5 focus:bg-white transition-all appearance-none cursor-pointer hover:border-emerald-400 min-w-[220px] shadow-inner"
                                >
                                    <option value="">TODAS AS CATEGORIAS</option>
                                    <option value="impostos">Impostos e Taxas</option>
                                    <option value="transferencias">Transferências da União/Estado</option>
                                    <option value="receitas-proprias">Receitas Próprias</option>
                                    <option value="outras">Outras Fontes</option>
                                </select>
                            </div>
                        </div>
                    </TransparencyFilters>
                </motion.div>

                {/* Dashboard Main Container */}
                <motion.div variants={itemVariants} className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden mb-12 relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-600 via-blue-900 to-indigo-900" />
                    
                    <div className="flex flex-col sm:flex-row bg-slate-50/70 p-4 items-center justify-between border-b border-slate-100 gap-4">
                        <div className="flex bg-white/70 backdrop-blur p-2 rounded-2xl border border-slate-200/50 shadow-sm w-full sm:w-auto">
                            <button 
                                onClick={() => setAba("tabela")}
                                className={`flex items-center justify-center gap-3 px-10 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${aba === "tabela" ? "bg-white text-emerald-600 shadow-lg border border-slate-100" : "text-slate-400 hover:text-emerald-600"}`}
                            >
                                <FaTable size={14} /> Visão em Tabela
                            </button>
                            <button 
                                onClick={() => setAba("grafico")}
                                className={`flex items-center justify-center gap-3 px-10 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${aba === "grafico" ? "bg-white text-emerald-600 shadow-lg border border-slate-100" : "text-slate-400 hover:text-emerald-600"}`}
                            >
                                <FaChartLine size={14} /> Análise Gráfica
                            </button>
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-6 hidden sm:block">
                            Lajes Pintadas • Arrecadação {ano}
                        </div>
                    </div>

                    <div className="p-10">
                        <AnimatePresence mode="wait">
                            {aba === "tabela" ? (
                                <motion.div 
                                    key="tabela"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    {loading ? (
                                        <div className="py-32 text-center">
                                            <div className="relative inline-block mb-8">
                                                <div className="w-24 h-24 border-8 border-slate-100 rounded-full" />
                                                <div className="absolute inset-0 border-8 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                                <FaCoins className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-100" size={40} />
                                            </div>
                                            <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.5em] animate-pulse">Cruzando Dados Arrecadatórios</p>
                                        </div>
                                    ) : receitas.length === 0 ? (
                                        <div className="py-32 text-center border-4 border-dashed border-slate-50 rounded-[3rem] group">
                                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-all">
                                                <FaMagnifyingGlass className="text-slate-200 text-4xl" />
                                            </div>
                                            <h4 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-4">Nenhuma receita localizada</h4>
                                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest opacity-60 italic mb-10">Ajuste os filtros para realizar uma nova consulta fiscal.</p>
                                            <button onClick={handleClearFilters} className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-xl active:scale-95">Resetar Filtros</button>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-sm scrollbar-thin">
                                            <table className="w-full border-collapse text-left">
                                                <thead>
                                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                                        <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Fonte da Receita</th>
                                                        <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Classificação</th>
                                                        <th className="px-10 py-8 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Competência</th>
                                                        <th className="px-10 py-8 text-right text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Total Arrecadado</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50/50">
                                                    {receitas.map((r, idx) => (
                                                        <motion.tr 
                                                            key={r.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: idx * 0.03 }}
                                                            className="group hover:bg-emerald-50/30 transition-all duration-300"
                                                        >
                                                            <td className="px-10 py-8">
                                                                <div className="flex items-center gap-5">
                                                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-600/30 transition-all duration-500">
                                                                        <FaBuildingColumns size={16} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[14px] font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-700 transition-colors leading-none mb-1.5">{r.descricao}</p>
                                                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Fonte de Recurso Auditada</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-10 py-8 text-center md:text-left">
                                                                <span className="px-4 py-1.5 rounded-xl bg-blue-50/50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100/50">
                                                                    {r.categoria}
                                                                </span>
                                                            </td>
                                                            <td className="px-10 py-8 text-center">
                                                                <div className="inline-flex flex-col items-center">
                                                                    <div className="text-[11px] font-black text-slate-600 bg-slate-50 shadow-inner px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-tighter group-hover:bg-white transition-colors">{mesesAbrev[r.mes-1]} <span className="text-slate-300">/</span> {r.ano}</div>
                                                                </div>
                                                            </td>
                                                            <td className="px-10 py-8 text-right">
                                                                <div className="flex flex-col items-end">
                                                                    <p className="text-2xl font-black text-slate-950 tracking-tighter tabular-nums group-hover:text-emerald-600 transition-all duration-300 group-hover:scale-105">{fmt(r.valor)}</p>
                                                                    <div className="flex items-center gap-2 mt-1 px-2 py-0.5 bg-emerald-50 rounded-lg border border-emerald-100 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                                                        <FaCircleCheck className="text-emerald-500" size={10} />
                                                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Efetivado</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="bg-slate-900 border-t border-slate-800 text-white">
                                                        <td colSpan={3} className="px-10 py-10 text-[12px] font-black uppercase tracking-[0.4em] text-white/40 italic">Consolidado Geral de Arrecadação</td>
                                                        <td className="px-10 py-10 text-right">
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-4xl font-black text-emerald-400 tracking-tighter tabular-nums mb-1">{fmt(totalArrecadado)}</span>
                                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Lajes Pintadas • Recursos Públicos</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="grafico"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="py-6"
                                >
                                    <div className="mb-12 flex items-center justify-between px-4">
                                        <div>
                                            <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Sazonalidade Fiscal</h4>
                                            <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-3">
                                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/40" /> Fluxo de Arrecadação Mensal - {ano}
                                            </p>
                                        </div>
                                        <div className="hidden lg:flex gap-10">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Ponto de Máximo</span>
                                                <span className="text-xl font-black text-slate-900 uppercase tracking-tight">Set/2024</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Tendência</span>
                                                <span className="text-xl font-black text-emerald-500 flex items-center gap-2">ALTA <FaArrowTrendUp size={16} /></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-[500px] w-full p-10 bg-slate-50/50 rounded-[3.5rem] border border-slate-100 shadow-inner group">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                                                <defs>
                                                    <linearGradient id="receitaGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                                        <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="12 12" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                                <XAxis 
                                                    dataKey="name" 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }} 
                                                    dy={20}
                                                />
                                                <YAxis 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900 }}
                                                    tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                                                    dx={-10}
                                                />
                                                <Tooltip 
                                                    cursor={{ fill: 'rgba(16, 185, 129, 0.05)', radius: 16 }}
                                                    contentStyle={{ 
                                                        borderRadius: '2rem', 
                                                        border: '1px solid #f1f5f9', 
                                                        boxShadow: '0 40px 80px -20px rgba(16, 185, 129, 0.15)',
                                                        padding: '1.5rem',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                                        backdropFilter: 'blur(20px)'
                                                    }}
                                                    formatter={(v: number) => [fmt(v), "ARRECADAÇÃO BRUTA"]}
                                                    labelStyle={{ fontSize: '12px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.1em' }}
                                                    itemStyle={{ fontSize: '16px', fontWeight: 950, color: '#111827', tracking: '-0.05em' }}
                                                />
                                                <Bar dataKey="valor" radius={[16, 16, 6, 6]} barSize={50} animationDuration={1500} animationBegin={300}>
                                                    {dadosGrafico.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="transition-all hover:opacity-80" />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Footer Guide Section */}
                <motion.div variants={itemVariants} className="mt-20 flex flex-col md:flex-row justify-between items-center bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 gap-8">
                    <div className="flex items-center gap-6 text-center md:text-left">
                         <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center shadow-inner group transition-all hover:bg-emerald-600 relative overflow-hidden shrink-0">
                            <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <FaHistory className="text-slate-300 group-hover:text-white relative z-10 transition-colors" size={32} />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">Ciclo de Arrecadação Fiscal</span>
                            <span className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">Atualizado em Tempo Real</span>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                         </div>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end gap-3">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Relatórios Oficiais de Receita</span>
                        <div className="flex gap-3">
                            <button onClick={() => handleExport("pdf")} className="group flex items-center gap-4 px-8 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-emerald-600 shadow-lg shadow-slate-950/20 active:scale-95">
                                Exportar PDF <FaDownload size={12} className="group-hover:translate-y-1 transition-transform" />
                            </button>
                            <button onClick={() => handleExport("xlsx")} className="group flex items-center gap-4 px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-emerald-50 hover:border-emerald-200 shadow-sm active:scale-95">
                                Tabela Excel <FaDownload size={12} className="group-hover:translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-24">
                    <BannerPNTP />
                    <div className="mt-20 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-[2] max-w-2xl mx-auto">
                            PORTAL DA TRANSPARÊNCIA • PREFEITURA DE LAJES PINTADAS/RN <br/>
                            <span className="opacity-40 font-bold italic">Os dados apresentados são sincronizados com a contabilidade municipal conforme LC 131/2009.</span>
                        </p>
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
}
