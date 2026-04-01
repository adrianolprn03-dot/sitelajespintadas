"use client";
import { useState, useEffect } from "react";
import { FaChartBar, FaSpinner, FaCoins, FaSearch, FaHistory, FaCheckCircle, FaExclamationTriangle, FaTable, FaChartLine, FaArrowRight, FaWallet } from "react-icons/fa";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
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

const COLORS = ["#059669", "#0284c7", "#7c3aed", "#ea580c", "#dc2626", "#4b5563"];

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
        fetchReceitas();
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

    // Dados para gráfico
    const dadosGrafico = Array.from({ length: 12 }, (_, i) => ({
        name: mesesAbrev[i],
        valor: receitas.filter(r => r.mes === i + 1).reduce((sum, r) => sum + r.valor, 0)
    })).filter(d => d.valor > 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Receitas Públicas"
                subtitle="Acompanhe a arrecadação e as fontes de recursos que sustentam as políticas públicas do município."
                variant="premium"
                icon={<FaCoins />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Receitas" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12 -mt-10 relative z-30">
                <TransparencyFilters
                    searchValue={busca}
                    onSearch={setBusca}
                    currentYear={ano}
                    onYearChange={setAno}
                    currentMonth={mes}
                    onMonthChange={setMes}
                    onClear={handleClearFilters}
                    onExport={handleExport}
                    placeholder="Buscar por descrição da receita..."
                >
                    <div className="flex items-center gap-3">
                        <select 
                            value={categoria} 
                            onChange={(e) => setCategoria(e.target.value)}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-700 outline-none hover:border-emerald-400 transition-colors shadow-sm"
                        >
                            <option value="">Todas as Categorias</option>
                            <option value="impostos">Impostos</option>
                            <option value="transferencias">Transferências</option>
                            <option value="receitas-proprias">Receitas Próprias</option>
                            <option value="outras">Outras Receitas</option>
                        </select>
                    </div>
                </TransparencyFilters>

                {/* Resumo Financeiro */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100/50 border-l-4 border-l-emerald-500 group">
                        <div className="flex justify-between items-start mb-3 text-emerald-100 group-hover:text-emerald-500 transition-colors">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Arrecadação Total</div>
                            <FaWallet size={20} />
                        </div>
                        <div className="text-xl font-black text-gray-800 tracking-tight">{loading ? "..." : fmt(totalArrecadado)}</div>
                        <div className="mt-2 text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Soma das receitas filtradas</div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100/50 border-l-4 border-l-blue-500 group">
                        <div className="flex justify-between items-start mb-3 text-blue-100 group-hover:text-blue-500 transition-colors">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Exercício</div>
                            <FaHistory size={20} />
                        </div>
                        <div className="text-xl font-black text-gray-800 tracking-tight">{ano}</div>
                        <div className="mt-2 text-[9px] font-bold text-blue-500 uppercase tracking-tighter">Ano de referência</div>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
                    <div className="flex bg-gray-50/50 p-2 border-b border-gray-100">
                        <button 
                            onClick={() => setAba("tabela")}
                            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${aba === "tabela" ? "bg-white text-emerald-600 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <FaTable size={14} /> Tabela de Dados
                        </button>
                        <button 
                            onClick={() => setAba("grafico")}
                            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${aba === "grafico" ? "bg-white text-emerald-600 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <FaChartLine size={14} /> Análise Evolutiva
                        </button>
                    </div>

                    <div className="p-6">
                        {aba === "tabela" ? (
                            <div className="space-y-6">
                                {loading ? (
                                    <div className="py-20 text-center">
                                        <FaSpinner className="animate-spin text-emerald-500 text-4xl mb-4 mx-auto" />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Processando dados arrecadatórios...</p>
                                    </div>
                                ) : receitas.length === 0 ? (
                                    <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                                        <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-4">Nenhum dado localizado</h4>
                                        <p className="text-gray-400 text-sm italic font-medium">Tente ajustar o ano ou o termo de busca.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Descrição da Receita</th>
                                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria</th>
                                                    <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Mês / Ano</th>
                                                    <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Arrecadado</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {receitas.map((r) => (
                                                    <tr key={r.id} className="group hover:bg-emerald-50/40 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <p className="text-xs font-black text-gray-800 uppercase tracking-tight group-hover:text-emerald-700 transition-colors">{r.descricao}</p>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest border border-blue-100">
                                                                {r.categoria}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            <p className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded inline-block uppercase tracking-widest">{mesesAbrev[r.mes-1]} / {r.ano}</p>
                                                        </td>
                                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                                            <p className="text-sm font-black text-emerald-600 tracking-tighter">{fmt(r.valor)}</p>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="bg-emerald-50/30 border-t border-emerald-100">
                                                    <td colSpan={3} className="px-6 py-5 text-[10px] font-black text-emerald-800 uppercase tracking-widest">Soma Total Arrecadada</td>
                                                    <td className="px-6 py-5 text-right text-lg font-black text-emerald-700 tracking-tighter">{fmt(totalArrecadado)}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-8">
                                <div className="mb-10 flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-1">Curva de Arrecadação</h4>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Evolução mensal das receitas em {ano}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Valor Realizado</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[400px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis 
                                                dataKey="name" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 900 }} 
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 900 }}
                                                tickFormatter={(v) => `R$ ${v > 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                                            />
                                            <Tooltip 
                                                cursor={{ fill: '#f8fafc' }}
                                                contentStyle={{ 
                                                    borderRadius: '1.5rem', 
                                                    border: 'none', 
                                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                                    padding: '1rem'
                                                }}
                                                formatter={(v: number) => [fmt(v), "Arrecadado"]}
                                            />
                                            <Bar dataKey="valor" radius={[10, 10, 0, 0]} barSize={40}>
                                                {dadosGrafico.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-20">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
