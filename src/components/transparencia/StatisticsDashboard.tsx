"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { FaChartPie, FaChartBar, FaSpinner } from "react-icons/fa";

type StatData = { name: string; value: number };

type StatisticsDashboardProps = {
    type: "ouvidoria" | "esic";
};

export default function StatisticsDashboard({ type }: StatisticsDashboardProps) {
    const [data, setData] = useState<{ porTipo?: StatData[]; porOrgao?: StatData[]; porStatus?: StatData[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/transparencia/estatisticas");
                const stats = await res.json();
                setData(type === "ouvidoria" ? stats.ouvidoria : stats.esic);
            } catch (error) {
                console.error("Erro ao buscar estatísticas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [type]);

    const COLORS = ["#01b0ef", "#0088b9", "#FDB913", "#10b981", "#ef4444", "#8b5cf6"];

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <FaSpinner className="animate-spin text-[#01b0ef] text-3xl" />
            </div>
        );
    }

    const mainChartData = type === "ouvidoria" ? data?.porTipo : data?.porOrgao;
    const statusData = data?.porStatus;

    return (
        <section className="mt-12 space-y-8 font-['Montserrat',sans-serif]">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-[#01b0ef]/10 rounded-xl flex items-center justify-center text-[#01b0ef]">
                    <FaChartBar size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-[#0088b9] uppercase tracking-tighter">Relatório Estatístico</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Dados atualizados em tempo real</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfico Principal */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-white">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">
                        {type === "ouvidoria" ? "Manifestações por Tipo" : "Pedidos por Órgão"}
                    </h3>
                    <div className="h-[300px] w-full">
                        {mainChartData && mainChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mainChartData} layout="vertical" margin={{ left: 30, right: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        axisLine={false} 
                                        tickLine={false}
                                        tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 700 }}
                                        width={100}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: "#f3f4f6" }}
                                        contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                                    />
                                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                                        {mainChartData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-300 italic text-sm">
                                Sem dados estatísticos no momento
                            </div>
                        )}
                    </div>
                </div>

                {/* Gráfico de Status */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-white">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Situação das Demandas</h3>
                    <div className="h-[300px] w-full flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 h-full w-full">
                            {statusData && statusData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {statusData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-300 italic text-sm">
                                    Aguardando registros
                                </div>
                            )}
                        </div>
                        <div className="flex-shrink-0 grid grid-cols-1 gap-4">
                            {statusData?.map((item, index) => (
                                <div key={item.name} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] }}></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.name}</p>
                                        <p className="text-xl font-black text-gray-800 leading-none">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
