"use client";
import { useState, useEffect } from "react";
import { exportToCSV, exportToJSON, exportToPDF } from "@/lib/exportUtils";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { FaChartBar, FaSpinner, FaBuilding, FaDownload } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Despesa = {
    id: string;
    ano: number;
    mes: number;
    valor: number;
    categoria: string;
    descricao: string;
    secretaria: string;
    data: string;
};

export default function DespesasPage() {
    const [despesas, setDespesas] = useState<Despesa[]>([]);
    const [loading, setLoading] = useState(true);
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState((new Date().getMonth() + 1).toString());
    const [busca, setBusca] = useState("");
    const [total, setTotal] = useState(0);

    const mesesLabels = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    useEffect(() => {
        const fetchDespesas = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/despesas?ano=${ano}&mes=${mes}`);
                const data = await res.json();
                setDespesas(data.items || []);
                setTotal(data.totalValor || 0);
            } catch (error) {
                console.error("Erro ao buscar despesas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDespesas();
    }, [ano, mes]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
    };

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setMes((new Date().getMonth() + 1).toString());
    };

    const handleExport = (format: "pdf" | "csv" | "json") => {
        const payload = filtrados.map((d: Despesa) => ({
            "Data": new Date(d.data || `${d.ano}-${d.mes}-01`).toLocaleDateString("pt-BR"),
            "Categoria": d.categoria,
            "Descrição": d.descricao,
            "Secretaria": d.secretaria,
            "Valor": formatCurrency(d.valor)
        }));

        const filename = `despesas_municipais_${mes || "anual"}_${ano}`;
        const title = `Relatório de Despesas Públicas - Lajes Pintadas/RN (${mes ? mesesLabels[Number(mes)-1] : "Ano"} / ${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const filtrados = despesas.filter((d: Despesa) => {
        const b = busca.toLowerCase();
        return !busca || 
            d.descricao.toLowerCase().includes(b) || 
            d.categoria.toLowerCase().includes(b) || 
            d.secretaria.toLowerCase().includes(b);
    });

    const totalFiltrado = filtrados.reduce((acc: number, curr: Despesa) => acc + curr.valor, 0);

    const chartData = filtrados.reduce((acc: any[], curr: Despesa) => {
        const existing = acc.find(item => item.name === curr.categoria);
        if (existing) {
            existing.value += curr.valor;
        } else {
            acc.push({ name: curr.categoria, value: curr.valor });
        }
        return acc;
    }, []).sort((a, b) => b.value - a.value);

    const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-900 py-16 px-4 shadow-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto">
                    <nav className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-6 flex items-center gap-2">
                        <a href="/transparencia" className="hover:text-white transition-colors">Transparência</a>
                        <span className="opacity-50">/</span>
                        <span className="text-white">Despesas Públicas</span>
                    </nav>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-4">
                        <div className="w-12 h-1 bg-white rounded-full"></div>
                        Despesas Públicas
                    </h1>
                    <p className="text-blue-100/80 max-w-2xl font-medium leading-relaxed">
                        Acompanhe em tempo real a aplicação dos recursos do município. Transparência total sobre empenhos, liquidações e pagamentos.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 -mt-10">
                <TransparencyFilters
                    searchValue={busca}
                    onSearch={setBusca}
                    currentYear={ano}
                    onYearChange={setAno}
                    currentMonth={mes}
                    onMonthChange={setMes}
                    onClear={handleClearFilters}
                    onExport={handleExport}
                    placeholder="Pesquisar por descrição, categoria ou secretaria..."
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-[2rem] shadow-sm p-8 border border-gray-100">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Total Liquidado</div>
                        <div className="text-3xl font-black text-indigo-600">{formatCurrency(totalFiltrado)}</div>
                    </div>
                    <div className="bg-white rounded-[2rem] shadow-sm p-8 border border-gray-100">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Empenhos no Período</div>
                        <div className="text-3xl font-black text-blue-600">{filtrados.length}</div>
                    </div>
                    <div className="bg-white rounded-[2rem] shadow-sm p-8 border border-gray-100">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Exercício Fiscal</div>
                        <div className="text-3xl font-black text-gray-800">{ano}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                            Distribuição por Categoria
                        </h3>
                        <div className="h-[300px] w-full">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 40 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: "#6b7280", fontSize: 12 }}
                                            width={120}
                                        />
                                        <Tooltip
                                            formatter={(value: number) => [formatCurrency(value), "Total"]}
                                            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                                        />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                            {chartData.map((_entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400 italic">
                                    Sem dados para exibir o gráfico
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                            Resumo do Período
                        </h3>
                        <div className="space-y-4">
                            {chartData.map((item: any, idx: number) => (
                                <div key={item.name} className="flex flex-col gap-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-700">{item.name}</span>
                                        <span className="font-bold text-gray-900">{formatCurrency(item.value)}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${(item.value / (total || 1)) * 100}%`,
                                                backgroundColor: COLORS[idx % COLORS.length]
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800">Relatório Detalhado</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-gray-100">
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4">Categoria / Descrição</th>
                                    <th className="px-6 py-4">Secretaria</th>
                                    <th className="px-6 py-4 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <FaSpinner className="animate-spin inline-block text-blue-500 text-2xl" />
                                        </td>
                                    </tr>
                                ) : despesas.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                                            Nenhuma despesa encontrada para o período selecionado.
                                        </td>
                                    </tr>
                                ) : despesas.map((d) => (
                                    <tr key={d.id} className="hover:bg-blue-50 transition-colors group">
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(d.data || `${d.ano}-${d.mes}-01`).toLocaleDateString("pt-BR")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-800 text-sm">{d.categoria}</div>
                                            <div className="text-xs text-gray-500 line-clamp-1">{d.descricao}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded w-fit">
                                                <FaBuilding className="text-gray-400" /> {d.secretaria}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-mono font-bold text-indigo-600">{formatCurrency(d.valor)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
