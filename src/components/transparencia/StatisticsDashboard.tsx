"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { FaChartPie, FaChartBar, FaSpinner, FaShieldAlt } from "react-icons/fa";

type StatData = { name: string; value: number };

type StatisticsDashboardProps = {
    type: "ouvidoria" | "esic";
};

export default function StatisticsDashboard({ type }: StatisticsDashboardProps) {
    const [data, setData] = useState<{ porTipo?: StatData[]; porOrgao?: StatData[]; porStatus?: StatData[]; porSigilo?: StatData[] } | null>(null);
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

    const COLORS = ["#01b0ef", "#0088b9", "#FDB913", "#10b981", "#ef4444", "#8b5cf6", "#6366f1"];

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <FaSpinner className="animate-spin text-[#01b0ef] text-3xl" />
            </div>
        );
    }

    const mainChartData = type === "ouvidoria" ? data?.porTipo : data?.porOrgao;
    const statusData = data?.porStatus;
    const sigiloData = data?.porSigilo;

    return (
        <section className="mt-12 space-y-12 font-['Montserrat',sans-serif]">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-[#01b0ef]/10 rounded-2xl flex items-center justify-center text-[#01b0ef] shadow-sm">
                    <FaChartBar size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-[#0088b9] uppercase tracking-tighter">Indicadores e Estatísticas</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Base de dados atualizada em tempo real</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfico Principal (Órgão / Tipo) */}
                <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-white">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10 flex items-center gap-2">
                       <FaChartBar className="text-[#01b0ef]" /> {type === "ouvidoria" ? "Manifestações por Tipo" : "Pedidos por Órgão"}
                    </h3>
                    <div className="h-[350px] w-full">
                        {mainChartData && mainChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mainChartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        axisLine={false} 
                                        tickLine={false}
                                        tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 700 }}
                                        width={120}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: "#f3f4f6", radius: 8 }}
                                        contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                                    />
                                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={28}>
                                        {mainChartData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-300 italic text-sm border-2 border-dashed border-gray-50 rounded-2xl">
                                Sem registros estatísticos no momento
                            </div>
                        )}
                    </div>
                </div>

                {/* Gráfico de Status */}
                <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-white">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10 flex items-center gap-2">
                       <FaChartPie className="text-emerald-500" /> Situação Atual das Demandas
                    </h3>
                    <div className="h-[350px] w-full flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 h-full w-full">
                            {statusData && statusData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            innerRadius={70}
                                            outerRadius={110}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {statusData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-300 italic text-sm border-2 border-dashed border-gray-50 rounded-2xl w-full">
                                    Aguardando registros
                                </div>
                            )}
                        </div>
                        <div className="flex-shrink-0 grid grid-cols-1 gap-6 pr-4">
                            {statusData?.map((item, index) => (
                                <div key={item.name} className="flex items-center gap-4">
                                    <div className="w-4 h-4 rounded-lg shadow-sm" style={{ backgroundColor: COLORS[(index + 3) % COLORS.length] }}></div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.name}</p>
                                        <p className="text-2xl font-black text-gray-800 leading-none">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Terceiro Gráfico (Apenas para e-SIC: Grau de Sigilo) */}
                {type === "esic" && (
                    <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-white lg:col-span-2">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10 flex items-center gap-2">
                           <FaShieldAlt className="text-purple-500" /> Distribuição por Grau de Sigilo
                        </h3>
                        <div className="h-[300px] w-full">
                            {sigiloData && sigiloData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={sigiloData} barGap={40}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false}
                                            tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 700 }}
                                        />
                                        <YAxis hide />
                                        <Tooltip 
                                            cursor={{ fill: "transparent" }}
                                            contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                                        />
                                        <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={80}>
                                            {sigiloData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : COLORS[(index + 4) % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-300 italic text-sm border-2 border-dashed border-gray-50 rounded-2xl">
                                    Aguardando classificação de pedidos
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
