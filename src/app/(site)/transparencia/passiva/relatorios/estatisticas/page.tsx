"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from "recharts";
import {
    FaChartBar,
    FaChartPie,
    FaChartLine,
    FaFileAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaUsers,
    FaBuilding,
    FaCalendarAlt,
    FaFilePdf,
    FaSpinner,
    FaBalanceScale,
    FaTable
} from "react-icons/fa";

type ExercicioStats = {
    exercicio: number;
    totalRecebidos: number;
    atendidos: number;
    indeferidos: number;
    emTramitacao: number;
    taxaAtendimento: number;
    tempoMedioDias: number;
    perfilSolicitantes: {
        pessoaFisica: number;
        pessoaJuridica: number;
        generoNaoInformado: number;
    };
    recursos: {
        primeiraInstancia: number;
        segundaInstancia: number;
        providos: number;
        negados: number;
    };
};

const CHART_COLORS = {
    recebidos: "#1254A3",
    atendidos: "#10B981",
    indeferidos: "#F43F5E",
    tramitacao: "#F59E0B",
    pessoaFisica: "#1254A3",
    pessoaJuridica: "#F39A32",
};

export default function SICEstatisticasPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ExercicioStats[]>([]);
    const [exercicioSelecionado, setExercicioSelecionado] = useState(2026);
    const [abaVisualizacao, setAbaVisualizacao] = useState<"graficos" | "tabela">("graficos");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/transparencia/esic-relatorios?tipo=estatisticas");
                const data = await res.json();
                if (data.sucesso) {
                    setStats(data.statsPorExercicio || []);
                }
            } catch (error) {
                console.error("Erro ao carregar estatísticas do e-SIC:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const atual = stats.find((s) => s.exercicio === exercicioSelecionado) || {
        exercicio: exercicioSelecionado,
        totalRecebidos: 0,
        atendidos: 0,
        indeferidos: 0,
        emTramitacao: 0,
        taxaAtendimento: 100,
        tempoMedioDias: 0,
        perfilSolicitantes: { pessoaFisica: 0, pessoaJuridica: 0, generoNaoInformado: 0 },
        recursos: { primeiraInstancia: 0, segundaInstancia: 0, providos: 0, negados: 0 }
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = stats.map((s) => ({
            "Exercício": s.exercicio,
            "Pedidos Recebidos": s.totalRecebidos,
            "Pedidos Atendidos": s.atendidos,
            "Pedidos Indeferidos": s.indeferidos,
            "Em Tramitação": s.emTramitacao,
            "Taxa de Atendimento (%)": `${s.taxaAtendimento}%`,
            "Tempo Médio (Dias)": s.tempoMedioDias,
            "Solicitantes Pessoa Física": s.perfilSolicitantes.pessoaFisica,
            "Solicitantes Pessoa Jurídica": s.perfilSolicitantes.pessoaJuridica
        }));

        const filename = `relatorio_estatistico_anual_esic_lajes_pintadas`;
        const title = `Relatório Estatístico Anual de Atendimento à LAI – Lajes Pintadas/RN`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    // Dados para os gráficos
    const statusPieData = [
        { name: "Atendidos / Deferidos", value: atual.atendidos, color: CHART_COLORS.atendidos },
        { name: "Indeferidos", value: atual.indeferidos, color: CHART_COLORS.indeferidos },
        { name: "Em Tramitação", value: atual.emTramitacao, color: CHART_COLORS.tramitacao },
    ].filter(item => item.value > 0);

    const perfilPieData = [
        { name: "Pessoa Física (Cidadão)", value: atual.perfilSolicitantes.pessoaFisica, color: CHART_COLORS.pessoaFisica },
        { name: "Pessoa Jurídica (Empresas/OSC)", value: atual.perfilSolicitantes.pessoaJuridica, color: CHART_COLORS.pessoaJuridica },
    ].filter(item => item.value > 0);

    const evolucaoBarData = stats.map(s => ({
        exercicio: s.exercicio.toString(),
        Recebidos: s.totalRecebidos,
        Atendidos: s.atendidos,
        Indeferidos: s.indeferidos,
    }));

    const tempoMedioData = stats.map(s => ({
        exercicio: s.exercicio.toString(),
        "Tempo Médio (Dias)": s.tempoMedioDias,
        "Limite Legal LAI": 20,
    }));

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <PageHeader
                title="Relatório Estatístico Anual do e-SIC"
                subtitle="Consolidado anual de pedidos recebidos, atendidos, indeferidos, perfil dos solicitantes e tempo de resposta (Lei nº 12.527/2011)."
                icon={<FaChartBar className="w-8 h-8 text-[#1254A3]" />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva", href: "/transparencia/passiva" },
                    { label: "Relatórios", href: "/transparencia/passiva/relatorios" },
                    { label: "Estatísticas Anuais" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Banner de Conformidade PNTP */}
                <BannerPNTP
                    requisito="Divulga relatório estatístico contendo a quantidade de pedidos de informação recebidos, atendidos e indeferidos, bem como informações genéricas sobre os solicitantes?"
                    status="Atende com Série Histórica e Indicadores Oficiais"
                />

                {/* Seletor de Exercício, Modo de Visualização e Exportação */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Exercício de Referência:</span>
                        <div className="flex flex-wrap gap-2">
                            {[2021, 2022, 2023, 2024, 2025, 2026].map((ano) => (
                                <button
                                    key={ano}
                                    onClick={() => setExercicioSelecionado(ano)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        exercicioSelecionado === ano
                                            ? "bg-[#1254A3] text-white shadow-md shadow-blue-900/10"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {ano}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Alternador de Visualização */}
                        <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                            <button
                                onClick={() => setAbaVisualizacao("graficos")}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    abaVisualizacao === "graficos"
                                        ? "bg-white text-[#1254A3] shadow-xs"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <FaChartLine size={13} /> Gráficos nos Resultados
                            </button>
                            <button
                                onClick={() => setAbaVisualizacao("tabela")}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    abaVisualizacao === "tabela"
                                        ? "bg-white text-[#1254A3] shadow-xs"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <FaTable size={13} /> Tabela
                            </button>
                        </div>

                        <button
                            onClick={() => handleExport("pdf")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                        >
                            <FaFilePdf /> Baixar Relatório (PDF)
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
                        <FaSpinner className="animate-spin text-3xl text-[#1254A3]" />
                        <span>Calculando indicadores anuais da base oficial...</span>
                    </div>
                ) : (
                    <>
                        {/* 4 Cards Principais do Exercício */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2 border-l-4 border-l-[#1254A3]">
                                <div className="flex items-center justify-between">
                                    <FaFileAlt className="text-[#1254A3] text-xl" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Exercício {atual.exercicio}</span>
                                </div>
                                <p className="text-3xl font-black text-gray-900">{atual.totalRecebidos}</p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pedidos Recebidos</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2 border-l-4 border-l-emerald-500">
                                <div className="flex items-center justify-between">
                                    <FaCheckCircle className="text-emerald-500 text-xl" />
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                                        {atual.taxaAtendimento}% Atendidos
                                    </span>
                                </div>
                                <p className="text-3xl font-black text-gray-900">{atual.atendidos}</p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Atendidos / Deferidos</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2 border-l-4 border-l-rose-500">
                                <div className="flex items-center justify-between">
                                    <FaTimesCircle className="text-rose-500 text-xl" />
                                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                                        Indeferimentos
                                    </span>
                                </div>
                                <p className="text-3xl font-black text-gray-900">{atual.indeferidos}</p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pedidos Indeferidos</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2 border-l-4 border-l-amber-500">
                                <div className="flex items-center justify-between">
                                    <FaClock className="text-amber-500 text-xl" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Meta LAI: 20 dias</span>
                                </div>
                                <p className="text-3xl font-black text-gray-900">
                                    {atual.tempoMedioDias > 0 ? `${atual.tempoMedioDias} dias` : "Atendimento imediato"}
                                </p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tempo Médio de Resposta</p>
                            </div>
                        </div>

                        {/* SEÇÃO DE GRÁFICOS NOS RESULTADOS */}
                        {abaVisualizacao === "graficos" && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Gráfico 1: Evolução Histórica (BarChart) */}
                                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                                    <FaChartBar className="text-[#1254A3]" /> Evolução Anual de Solicitações (2021-2026)
                                                </h3>
                                                <p className="text-xs text-gray-500">Comparativo de pedidos recebidos, atendidos e indeferidos</p>
                                            </div>
                                        </div>
                                        <div className="h-72 w-full pt-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={evolucaoBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                    <XAxis dataKey="exercicio" tick={{ fontSize: 11, fill: "#64748b" }} />
                                                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: "#1e293b",
                                                            borderRadius: "12px",
                                                            border: "none",
                                                            color: "#fff",
                                                            fontSize: "12px"
                                                        }}
                                                    />
                                                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                                                    <Bar dataKey="Recebidos" fill={CHART_COLORS.recebidos} radius={[4, 4, 0, 0]} />
                                                    <Bar dataKey="Atendidos" fill={CHART_COLORS.atendidos} radius={[4, 4, 0, 0]} />
                                                    <Bar dataKey="Indeferidos" fill={CHART_COLORS.indeferidos} radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Gráfico 2: Desfecho das Solicitações no Exercício (PieChart) */}
                                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                                <FaChartPie className="text-[#10B981]" /> Situação das Solicitações ({atual.exercicio})
                                            </h3>
                                            <p className="text-xs text-gray-500">Percentual de resolutividade no exercício selecionado</p>
                                        </div>
                                        <div className="h-72 w-full flex items-center justify-center">
                                            {statusPieData.length > 0 ? (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={statusPieData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={85}
                                                            paddingAngle={4}
                                                            dataKey="value"
                                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                            labelLine={false}
                                                        >
                                                            {statusPieData.map((entry, index) => (
                                                                <Cell key={`cell-status-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: "#1e293b",
                                                                borderRadius: "12px",
                                                                border: "none",
                                                                color: "#fff",
                                                                fontSize: "12px"
                                                            }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <p className="text-xs text-gray-400 italic">Sem solicitações registradas no ano.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Gráfico 3: Perfil dos Solicitantes (PieChart / Donut) */}
                                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                                <FaUsers className="text-[#1254A3]" /> Perfil dos Solicitantes ({atual.exercicio})
                                            </h3>
                                            <p className="text-xs text-gray-500">Distribuição entre Pessoa Física e Pessoa Jurídica</p>
                                        </div>
                                        <div className="h-64 w-full flex items-center justify-center">
                                            {perfilPieData.length > 0 ? (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={perfilPieData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={50}
                                                            outerRadius={75}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                        >
                                                            {perfilPieData.map((entry, index) => (
                                                                <Cell key={`cell-perfil-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: "#1e293b",
                                                                borderRadius: "12px",
                                                                border: "none",
                                                                color: "#fff",
                                                                fontSize: "12px"
                                                            }}
                                                        />
                                                        <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <p className="text-xs text-gray-400 italic">Sem solicitações registradas.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Gráfico 4: Tempo Médio de Resposta (AreaChart) */}
                                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                                <FaClock className="text-amber-500" /> Tempo Médio de Resposta (Dias)
                                            </h3>
                                            <p className="text-xs text-gray-500">Histórico de agilidade em relação ao prazo legal da LAI (20 dias)</p>
                                        </div>
                                        <div className="h-64 w-full pt-2">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={tempoMedioData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorTempo" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#1254A3" stopOpacity={0.4} />
                                                            <stop offset="95%" stopColor="#1254A3" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                    <XAxis dataKey="exercicio" tick={{ fontSize: 11, fill: "#64748b" }} />
                                                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: "#1e293b",
                                                            borderRadius: "12px",
                                                            border: "none",
                                                            color: "#fff",
                                                            fontSize: "12px"
                                                        }}
                                                    />
                                                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="Tempo Médio (Dias)"
                                                        stroke="#1254A3"
                                                        strokeWidth={2}
                                                        fillOpacity={1}
                                                        fill="url(#colorTempo)"
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="Limite Legal LAI"
                                                        stroke="#ef4444"
                                                        strokeWidth={1.5}
                                                        strokeDasharray="4 4"
                                                        fill="none"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Detalhamento de Perfil dos Solicitantes & Recursos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                    <FaUsers className="text-[#1254A3]" /> Perfil Genérico dos Solicitantes ({atual.exercicio})
                                </h3>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Conforme exigência do Critério PNTP, divulgação agregada e anonimizada da natureza jurídica e demografia dos requerentes de informação pública.
                                </p>

                                <div className="space-y-4 pt-2">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                                            <span>Pessoa Física (Cidadão)</span>
                                            <span>{atual.perfilSolicitantes.pessoaFisica} pedidos</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-[#1254A3] h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${
                                                        atual.totalRecebidos > 0
                                                            ? Math.round((atual.perfilSolicitantes.pessoaFisica / atual.totalRecebidos) * 100)
                                                            : 100
                                                    }%`
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                                            <span>Pessoa Jurídica (Empresas / Entidades)</span>
                                            <span>{atual.perfilSolicitantes.pessoaJuridica} pedidos</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${
                                                        atual.totalRecebidos > 0
                                                            ? Math.round((atual.perfilSolicitantes.pessoaJuridica / atual.totalRecebidos) * 100)
                                                            : 0
                                                    }%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                    <FaBalanceScale className="text-[#1254A3]" /> Recursos e Instâncias Recursais
                                </h3>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Monitoramento de recursos interpostos por solicitantes perante a autoridade hierárquica e autoridade de reavaliação.
                                </p>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
                                        <span className="text-[11px] font-bold text-gray-500 uppercase">1ª Instância</span>
                                        <p className="text-2xl font-black text-gray-800">{atual.recursos.primeiraInstancia}</p>
                                        <span className="text-[10px] text-gray-400">Recursos ao Secretário</span>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
                                        <span className="text-[11px] font-bold text-gray-500 uppercase">2ª Instância</span>
                                        <p className="text-2xl font-black text-gray-800">{atual.recursos.segundaInstancia}</p>
                                        <span className="text-[10px] text-gray-400">Recursos ao Prefeito</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Série Histórica Consolidada (2021 a 2026) */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Série Histórica Oficial de Atendimento à LAI</h3>
                                    <p className="text-xs text-gray-500">Comparativo anual dos exercícios de 2021 a 2026.</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                                            <th className="py-4 px-4">Exercício</th>
                                            <th className="py-4 px-4 text-center">Recebidos</th>
                                            <th className="py-4 px-4 text-center">Atendidos</th>
                                            <th className="py-4 px-4 text-center">Indeferidos</th>
                                            <th className="py-4 px-4 text-center">Em Tramitação</th>
                                            <th className="py-4 px-4 text-center">Taxa (%)</th>
                                            <th className="py-4 px-4 text-center">Tempo Médio</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {stats.map((s) => (
                                            <tr
                                                key={s.exercicio}
                                                className={`hover:bg-blue-50/40 transition-colors ${
                                                    s.exercicio === exercicioSelecionado ? "bg-blue-50/60 font-semibold" : ""
                                                }`}
                                            >
                                                <td className="py-4 px-4 font-bold text-[#1254A3]">{s.exercicio}</td>
                                                <td className="py-4 px-4 text-center font-bold text-gray-800">{s.totalRecebidos}</td>
                                                <td className="py-4 px-4 text-center text-emerald-700 font-bold">{s.atendidos}</td>
                                                <td className="py-4 px-4 text-center text-rose-700 font-bold">{s.indeferidos}</td>
                                                <td className="py-4 px-4 text-center text-amber-700 font-bold">{s.emTramitacao}</td>
                                                <td className="py-4 px-4 text-center font-bold text-emerald-700">{s.taxaAtendimento}%</td>
                                                <td className="py-4 px-4 text-center text-gray-600">
                                                    {s.tempoMedioDias > 0 ? `${s.tempoMedioDias} dias` : "Imediato"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
