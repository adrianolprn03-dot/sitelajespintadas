"use client";

import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid
} from "recharts";
import { FaChartLine } from "react-icons/fa";

interface RelatoriosGraficosProps {
    esic: {
        total: number;
        respondidos: number;
        percentualNoPrazo: number;
        tempoMedio: string;
    };
    ouvidoria: {
        total: number;
        respondidos: number;
        percentualNoPrazo: number;
        tempoMedio: string;
    };
}

export default function RelatoriosGraficosClient({ esic, ouvidoria }: RelatoriosGraficosProps) {
    const dadosVolume = [
        {
            canal: "e-SIC (LAI)",
            "Total de Solicitações": esic.total,
            "Atendidos no Prazo (%)": esic.percentualNoPrazo,
            "Tempo Médio (Dias)": parseFloat(esic.tempoMedio) || 0,
        },
        {
            canal: "Ouvidoria Geral",
            "Total de Solicitações": ouvidoria.total,
            "Atendidos no Prazo (%)": ouvidoria.percentualNoPrazo,
            "Tempo Médio (Dias)": parseFloat(ouvidoria.tempoMedio) || 0,
        },
    ];

    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-slate-100 mb-12 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-base font-black text-[#12304A] uppercase tracking-tight flex items-center gap-2">
                        <FaChartLine className="text-[#1254A3]" /> Gráficos nos Resultados • Comparativo e-SIC vs Ouvidoria
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Eficiência dos canais oficiais de transparência passiva e escuta ao cidadão
                    </p>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1254A3] bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 w-fit">
                    Transparência Passiva
                </span>
            </div>

            <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosVolume} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="canal" tick={{ fontSize: 12, fill: "#1e293b", fontWeight: 700 }} />
                        <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1e293b",
                                borderRadius: "12px",
                                border: "none",
                                color: "#fff",
                                fontSize: "12px",
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                        <Bar dataKey="Total de Solicitações" fill="#1254A3" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Atendidos no Prazo (%)" fill="#10B981" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Tempo Médio (Dias)" fill="#F39A32" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
