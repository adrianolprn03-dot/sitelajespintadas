"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
    FaCalendarAlt,
    FaFilePdf,
    FaFileExcel,
    FaFileCsv,
    FaCode,
    FaSpinner,
    FaBalanceScale,
    FaTable,
    FaBuilding,
    FaMapMarkerAlt,
    FaGraduationCap,
    FaLock,
    FaLockOpen,
    FaEnvelopeOpenText,
} from "react-icons/fa";

type DistribuicaoItem = {
    label: string;
    quantidade: number;
    percentual: number;
};

type MesStats = {
    mes: number;
    nomeMes: string;
    recebidos: number;
    atendidos: number;
    indeferidos: number;
    emTramitacao: number;
};

type ExercicioStats = {
    exercicio: number;
    totalRecebidos: number;
    atendidos: number;
    indeferidos: number;
    emTramitacao: number;
    tempoMedioDias: number;
    taxaAtendimento: number;
    taxaResolucao?: number;
    perfilSolicitantes: {
        pessoaFisica: number;
        pessoaJuridica: number;
        anonimoNaoIdentificado?: number;
        detalhamento?: {
            porTipoPessoa?: DistribuicaoItem[];
            porEscolaridade?: DistribuicaoItem[];
            porGenero?: DistribuicaoItem[];
            porOcupacao?: DistribuicaoItem[];
            porLocalidade?: DistribuicaoItem[];
            porFormaRetorno?: DistribuicaoItem[];
            porOrgao?: DistribuicaoItem[];
        };
    };
    recursos: {
        interpostos: number;
        primeiraInstancia?: number;
        segundaInstancia?: number;
        respondidos?: number;
        pendentes?: number;
        deferidos?: number;
    };
    porMes?: MesStats[];
};

const CHART_COLORS = {
    recebidos: "#1254A3",
    atendidos: "#10B981",
    indeferidos: "#F43F5E",
    tramitacao: "#F59E0B",
    pessoaFisica: "#1254A3",
    pessoaJuridica: "#F39A32",
    anonimo: "#64748B",
};

interface RelatorioAnualEsicClientProps {
    breadcrumbs: Array<{ label: string; href?: string }>;
    titulo?: string;
    subtitulo?: string;
}

function BlocoDistribuicao({
    titulo,
    icon,
    itens,
    totalBase,
}: {
    titulo: string;
    icon: React.ReactNode;
    itens?: DistribuicaoItem[];
    totalBase: number;
}) {
    const lista = itens || [];
    return (
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span className="text-[#1254A3]">{icon}</span>
                {titulo}
            </h4>
            {totalBase === 0 || lista.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                    Nenhum pedido registrado neste exercício para agregação.
                </p>
            ) : (
                <div className="space-y-2.5">
                    {lista.map((item) => (
                        <div key={item.label}>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1 gap-2">
                                <span className="truncate" title={item.label}>
                                    {item.label}
                                </span>
                                <span className="whitespace-nowrap font-bold text-slate-900">
                                    {item.quantidade} ({item.percentual}%)
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-[#1254A3] h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, item.percentual)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function RelatorioAnualEsicClient({
    breadcrumbs,
    titulo = "Relatório Estatístico Anual do e-SIC",
    subtitulo = "Consolidado anual de pedidos de acesso recebidos, atendidos, indeferidos e informações genéricas sobre os solicitantes (Lei nº 12.527/2011 - Art. 30, III).",
}: RelatorioAnualEsicClientProps) {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ExercicioStats[]>([]);
    const [consolidado, setConsolidado] = useState<ExercicioStats | null>(null);
    const [exercicioSelecionado, setExercicioSelecionado] = useState<number>(2026);
    const [abaVisualizacao, setAbaVisualizacao] = useState<"graficos" | "tabela">("graficos");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/transparencia/esic-relatorios?tipo=estatisticas");
                const data = await res.json();
                const lista: ExercicioStats[] = data.stats || [];
                setStats(lista);
                if (data.consolidadoHistorico) {
                    setConsolidado(data.consolidadoHistorico);
                }
                if (data.resumoExecutivo?.exercicioAtual) {
                    setExercicioSelecionado(data.resumoExecutivo.exercicioAtual);
                } else if (lista.length > 0) {
                    setExercicioSelecionado(lista[lista.length - 1].exercicio);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const anosDisponiveis =
        stats.length > 0 ? stats.map((s) => s.exercicio) : [2021, 2022, 2023, 2024, 2025, 2026];

    const atual: ExercicioStats = stats.find((s) => s.exercicio === exercicioSelecionado) || {
        exercicio: exercicioSelecionado,
        totalRecebidos: 0,
        atendidos: 0,
        indeferidos: 0,
        emTramitacao: 0,
        tempoMedioDias: 0,
        taxaAtendimento: 0,
        taxaResolucao: 0,
        perfilSolicitantes: {
            pessoaFisica: 0,
            pessoaJuridica: 0,
            anonimoNaoIdentificado: 0,
        },
        recursos: { interpostos: 0, primeiraInstancia: 0, segundaInstancia: 0, respondidos: 0, pendentes: 0 },
        porMes: [],
    };

    const exportarDados = (format: "csv" | "json" | "pdf" | "xlsx") => {
        const payload = stats.map((s) => ({
            "Exercício": s.exercicio,
            "Pedidos Recebidos": s.totalRecebidos,
            "Pedidos Atendidos": s.atendidos,
            "Pedidos Indeferidos": s.indeferidos,
            "Em Tramitação": s.emTramitacao,
            "Taxa Atendimento (%)": `${s.taxaAtendimento}%`,
            "Tempo Médio (Dias)": s.tempoMedioDias,
            "Pessoa Física": s.perfilSolicitantes.pessoaFisica,
            "Pessoa Jurídica": s.perfilSolicitantes.pessoaJuridica,
            "Anônimo / Simplificado": s.perfilSolicitantes.anonimoNaoIdentificado || 0,
            "Recursos Interpostos": s.recursos.interpostos,
            "Recursos Respondidos": s.recursos.respondidos ?? s.recursos.deferidos ?? 0,
        }));

        const filename = `relatorio_estatistico_anual_esic_lajes_pintadas`;
        const title = `Relatório Estatístico Anual do e-SIC (LAI) – Lajes Pintadas/RN`;
        const meta = {
            titulo: title,
            fonte: "e-SIC / Transparência Passiva",
            periodo: `Série Histórica (2021–${anosDisponiveis[anosDisponiveis.length - 1]})`,
        };

        if (format === "csv") exportToCSV(payload, filename, meta);
        else if (format === "json") exportToJSON(payload, filename, meta);
        else if (format === "xlsx") exportToXLSX(payload, filename, meta);
        else exportToPDF(payload, filename, title, meta);
    };

    const anonimoQtd = atual.perfilSolicitantes.anonimoNaoIdentificado || 0;
    const totalSolicitantes = atual.totalRecebidos;

    const pctPF =
        totalSolicitantes > 0
            ? Math.round((atual.perfilSolicitantes.pessoaFisica / totalSolicitantes) * 100)
            : 0;
    const pctPJ =
        totalSolicitantes > 0
            ? Math.round((atual.perfilSolicitantes.pessoaJuridica / totalSolicitantes) * 100)
            : 0;
    const pctAnon =
        totalSolicitantes > 0 ? Math.round((anonimoQtd / totalSolicitantes) * 100) : 0;

    const statusPieData = [
        { name: "Atendidos / Deferidos", value: atual.atendidos, color: CHART_COLORS.atendidos },
        { name: "Indeferidos", value: atual.indeferidos, color: CHART_COLORS.indeferidos },
        { name: "Em Tramitação", value: atual.emTramitacao, color: CHART_COLORS.tramitacao },
    ].filter((item) => item.value > 0);

    const perfilPieData = [
        {
            name: "Pessoa Física (Cidadão)",
            value: atual.perfilSolicitantes.pessoaFisica,
            color: CHART_COLORS.pessoaFisica,
        },
        {
            name: "Pessoa Jurídica (Empresas/OSC)",
            value: atual.perfilSolicitantes.pessoaJuridica,
            color: CHART_COLORS.pessoaJuridica,
        },
        {
            name: "Anônimo / Simplificado",
            value: anonimoQtd,
            color: CHART_COLORS.anonimo,
        },
    ].filter((item) => item.value > 0);

    const evolucaoBarData = stats.map((s) => ({
        exercicio: s.exercicio.toString(),
        Recebidos: s.totalRecebidos,
        Atendidos: s.atendidos,
        Indeferidos: s.indeferidos,
    }));

    const mensalBarData = (atual.porMes || []).map((m) => ({
        mes: m.nomeMes,
        Recebidos: m.recebidos,
        Atendidos: m.atendidos,
        Indeferidos: m.indeferidos,
    }));

    const tempoMedioData = stats.map((s) => ({
        exercicio: s.exercicio.toString(),
        "Tempo Médio (Dias)": s.tempoMedioDias,
        "Limite Legal LAI": 20,
    }));

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <PageHeader
                title={titulo}
                subtitle={subtitulo}
                icon={<FaChartBar className="w-8 h-8 text-[#1254A3]" />}
                breadcrumbs={breadcrumbs}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <BannerPNTP
                    criterio="Art. 30, Inciso III da LAI"
                    requisito="Divulgação anual de relatório estatístico contendo pedidos recebidos, atendidos, indeferidos e informações genéricas sobre os solicitantes"
                    status="REGULAR"
                />

                {loading ? (
                    <div className="bg-white rounded-3xl p-20 flex flex-col items-center justify-center border border-gray-200">
                        <FaSpinner className="animate-spin text-4xl text-[#1254A3] mb-3" />
                        <p className="text-sm font-semibold text-gray-500">
                            Consolidando estatísticas oficiais do e-SIC...
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Seletor de Exercício, Modo de Visão e Exportação Completa */}
                        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mr-2">
                                    <FaCalendarAlt className="text-[#1254A3]" /> Exercício:
                                </span>
                                {anosDisponiveis.map((ano) => (
                                    <button
                                        key={ano}
                                        onClick={() => setExercicioSelecionado(ano)}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                            exercicioSelecionado === ano
                                                ? "bg-[#1254A3] text-white shadow-sm"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        {ano}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <div className="bg-gray-100 p-1 rounded-xl flex items-center">
                                    <button
                                        onClick={() => setAbaVisualizacao("graficos")}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                            abaVisualizacao === "graficos"
                                                ? "bg-white text-[#1254A3] shadow-sm"
                                                : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        <FaChartPie /> Gráficos e Perfis
                                    </button>
                                    <button
                                        onClick={() => setAbaVisualizacao("tabela")}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                            abaVisualizacao === "tabela"
                                                ? "bg-white text-[#1254A3] shadow-sm"
                                                : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        <FaTable /> Tabela Anual
                                    </button>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => exportarDados("pdf")}
                                        title="Exportar em PDF"
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-700 font-bold text-xs hover:bg-red-100 border border-red-100 transition-colors"
                                    >
                                        <FaFilePdf /> PDF
                                    </button>
                                    <button
                                        onClick={() => exportarDados("xlsx")}
                                        title="Exportar em Excel"
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs hover:bg-emerald-100 border border-emerald-100 transition-colors"
                                    >
                                        <FaFileExcel /> XLSX
                                    </button>
                                    <button
                                        onClick={() => exportarDados("csv")}
                                        title="Exportar em CSV"
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 border border-blue-100 transition-colors"
                                    >
                                        <FaFileCsv /> CSV
                                    </button>
                                    <button
                                        onClick={() => exportarDados("json")}
                                        title="Exportar Dados Abertos JSON"
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 border border-slate-200 transition-colors"
                                    >
                                        <FaCode /> JSON
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Cards de Métricas do Exercício */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-2">
                                <div className="flex items-center justify-between text-gray-500">
                                    <span className="text-xs font-bold uppercase tracking-wider">Pedidos Recebidos</span>
                                    <FaFileAlt className="text-[#1254A3]" />
                                </div>
                                <div className="text-3xl font-black text-gray-900">{atual.totalRecebidos}</div>
                                <p className="text-xs text-gray-400 font-medium">
                                    Protocolados no exercício {atual.exercicio}
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-2">
                                <div className="flex items-center justify-between text-emerald-700">
                                    <span className="text-xs font-bold uppercase tracking-wider">Atendidos / Deferidos</span>
                                    <FaCheckCircle />
                                </div>
                                <div className="text-3xl font-black text-emerald-700">{atual.atendidos}</div>
                                <p className="text-xs text-emerald-600 font-semibold">
                                    Taxa de atendimento: {atual.taxaAtendimento}%
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-2">
                                <div className="flex items-center justify-between text-rose-700">
                                    <span className="text-xs font-bold uppercase tracking-wider">Pedidos Indeferidos</span>
                                    <FaTimesCircle />
                                </div>
                                <div className="text-3xl font-black text-rose-700">{atual.indeferidos}</div>
                                <p className="text-xs text-gray-400 font-medium">
                                    Negativas fundamentadas conforme a LAI
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-2">
                                <div className="flex items-center justify-between text-amber-600">
                                    <span className="text-xs font-bold uppercase tracking-wider">Em Tramitação</span>
                                    <FaClock />
                                </div>
                                <div className="text-3xl font-black text-amber-600">{atual.emTramitacao}</div>
                                <p className="text-xs text-gray-500 font-medium">
                                    Tempo médio de resposta:{" "}
                                    <strong>
                                        {atual.tempoMedioDias > 0 ? `${atual.tempoMedioDias} dias` : "—"}
                                    </strong>{" "}
                                    (limite legal: 20 dias)
                                </p>
                            </div>
                        </div>

                        {abaVisualizacao === "graficos" && (
                            <div className="space-y-6">
                                {/* Evolução Histórica e Distribuição de Status */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                                        <div className="mb-6">
                                            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                                                <FaChartBar className="text-[#1254A3]" /> Evolução Anual Comparada ({anosDisponiveis[0]}–{anosDisponiveis[anosDisponiveis.length - 1]})
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Comparativo histórico de pedidos recebidos, atendidos e indeferidos por exercício.
                                            </p>
                                        </div>
                                        <div className="h-[290px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={evolucaoBarData}
                                                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis
                                                        dataKey="exercicio"
                                                        tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }}
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />
                                                    <YAxis
                                                        allowDecimals={false}
                                                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: "#1e293b",
                                                            borderRadius: "12px",
                                                            border: "none",
                                                            color: "#fff",
                                                            fontSize: "12px",
                                                        }}
                                                    />
                                                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                                                    <Bar
                                                        dataKey="Recebidos"
                                                        fill={CHART_COLORS.recebidos}
                                                        radius={[6, 6, 0, 0]}
                                                        maxBarSize={36}
                                                    />
                                                    <Bar
                                                        dataKey="Atendidos"
                                                        fill={CHART_COLORS.atendidos}
                                                        radius={[6, 6, 0, 0]}
                                                        maxBarSize={36}
                                                    />
                                                    <Bar
                                                        dataKey="Indeferidos"
                                                        fill={CHART_COLORS.indeferidos}
                                                        radius={[6, 6, 0, 0]}
                                                        maxBarSize={36}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col">
                                        <div className="mb-4">
                                            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                                                <FaChartPie className="text-[#F39A32]" /> Desfecho ({atual.exercicio})
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Proporção de resolutividade do exercício selecionado.
                                            </p>
                                        </div>
                                        <div className="flex-1 min-h-[240px] flex items-center justify-center">
                                            {statusPieData.length > 0 ? (
                                                <ResponsiveContainer width="100%" height={240}>
                                                    <PieChart>
                                                        <Pie
                                                            data={statusPieData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={52}
                                                            outerRadius={84}
                                                            paddingAngle={4}
                                                            dataKey="value"
                                                        >
                                                            {statusPieData.map((entry, idx) => (
                                                                <Cell key={`cell-${idx}`} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: "#1e293b",
                                                                borderRadius: "12px",
                                                                border: "none",
                                                                color: "#fff",
                                                                fontSize: "12px",
                                                            }}
                                                        />
                                                        <Legend wrapperStyle={{ fontSize: "11px" }} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <div className="text-center text-gray-400 text-xs py-10">
                                                    Nenhuma solicitação registrada no exercício {atual.exercicio}.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Evolução Mensal no Exercício & Tempo Médio de Resposta */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                                        <div className="mb-4">
                                            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                                                <FaCalendarAlt className="text-[#1254A3]" /> Movimento Mensal em {atual.exercicio}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Distribuição mês a mês dos pedidos recebidos, atendidos e indeferidos.
                                            </p>
                                        </div>
                                        <div className="h-[220px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={mensalBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis
                                                        dataKey="mes"
                                                        tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }}
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />
                                                    <YAxis
                                                        allowDecimals={false}
                                                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />
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
                                                    <Bar dataKey="Recebidos" fill={CHART_COLORS.recebidos} radius={[4, 4, 0, 0]} />
                                                    <Bar dataKey="Atendidos" fill={CHART_COLORS.atendidos} radius={[4, 4, 0, 0]} />
                                                    <Bar dataKey="Indeferidos" fill={CHART_COLORS.indeferidos} radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                                        <div className="mb-4">
                                            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                                                <FaChartLine className="text-emerald-600" /> Tempo Médio de Resposta (Dias)
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Comparação com o prazo legal máximo de 20 dias (Lei nº 12.527/2011, Art. 11).
                                            </p>
                                        </div>
                                        <div className="h-[220px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={tempoMedioData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorTempoEsic" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#1254A3" stopOpacity={0.25} />
                                                            <stop offset="95%" stopColor="#1254A3" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis
                                                        dataKey="exercicio"
                                                        tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }}
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />
                                                    <YAxis
                                                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />
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
                                                    <Area
                                                        type="monotone"
                                                        dataKey="Tempo Médio (Dias)"
                                                        stroke="#1254A3"
                                                        strokeWidth={2}
                                                        fillOpacity={1}
                                                        fill="url(#colorTempoEsic)"
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

                        {/* Informações Genéricas sobre os Solicitantes (LAI Art. 30, III) */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                        <FaUsers className="text-[#1254A3]" /> Informações Genéricas sobre os Solicitantes ({atual.exercicio})
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 max-w-3xl leading-relaxed">
                                        Divulgação estatística, consolidada e anonimizada (em conformidade com a LGPD e o art. 30, III da Lei nº 12.527/2011), sem exposição de nomes, documentos ou dados pessoais identificáveis.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 bg-blue-50/70 px-4 py-2.5 rounded-2xl border border-blue-100 text-xs font-bold text-[#1254A3] shrink-0">
                                    <span>Total analisado em {atual.exercicio}:</span>
                                    <span className="text-lg font-black">{atual.totalRecebidos}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                                {/* Natureza Jurídica */}
                                <div className="lg:col-span-2 space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                                            <span>Pessoa Física (Cidadãos)</span>
                                            <span>
                                                {atual.perfilSolicitantes.pessoaFisica} ({pctPF}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                            <div
                                                className="bg-[#1254A3] h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${pctPF}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                                            <span>Pessoa Jurídica (Empresas, Entidades e OSCs)</span>
                                            <span>
                                                {atual.perfilSolicitantes.pessoaJuridica} ({pctPJ}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                            <div
                                                className="bg-[#F39A32] h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${pctPJ}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                                            <span>Identificação Simplificada / Anônimo</span>
                                            <span>
                                                {anonimoQtd} ({pctAnon}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                            <div
                                                className="bg-slate-500 h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${pctAnon}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Gráfico Pizza Tipo Solicitante */}
                                <div className="h-[190px] flex items-center justify-center">
                                    {perfilPieData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={190}>
                                            <PieChart>
                                                <Pie
                                                    data={perfilPieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={42}
                                                    outerRadius={70}
                                                    paddingAngle={4}
                                                    dataKey="value"
                                                >
                                                    {perfilPieData.map((entry, idx) => (
                                                        <Cell key={`cell-p-${idx}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: "#1e293b",
                                                        borderRadius: "12px",
                                                        border: "none",
                                                        color: "#fff",
                                                        fontSize: "12px",
                                                    }}
                                                />
                                                <Legend wrapperStyle={{ fontSize: "11px" }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p className="text-xs text-gray-400 text-center">
                                            Sem solicitações no exercício {atual.exercicio}.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Detalhamento Demográfico e Setorial Anonimizado */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                                <BlocoDistribuicao
                                    titulo="Escolaridade Declarada"
                                    icon={<FaGraduationCap />}
                                    itens={atual.perfilSolicitantes.detalhamento?.porEscolaridade}
                                    totalBase={atual.totalRecebidos}
                                />
                                <BlocoDistribuicao
                                    titulo="Gênero Declarado"
                                    icon={<FaUsers />}
                                    itens={atual.perfilSolicitantes.detalhamento?.porGenero}
                                    totalBase={atual.totalRecebidos}
                                />
                                <BlocoDistribuicao
                                    titulo="Localidade / Município de Origem"
                                    icon={<FaMapMarkerAlt />}
                                    itens={atual.perfilSolicitantes.detalhamento?.porLocalidade}
                                    totalBase={atual.totalRecebidos}
                                />
                                <BlocoDistribuicao
                                    titulo="Ocupação / Área de Atuação"
                                    icon={<FaFileAlt />}
                                    itens={atual.perfilSolicitantes.detalhamento?.porOcupacao}
                                    totalBase={atual.totalRecebidos}
                                />
                                <BlocoDistribuicao
                                    titulo="Forma de Retorno Solicitada"
                                    icon={<FaEnvelopeOpenText />}
                                    itens={atual.perfilSolicitantes.detalhamento?.porFormaRetorno}
                                    totalBase={atual.totalRecebidos}
                                />
                                <BlocoDistribuicao
                                    titulo="Órgãos / Secretarias Demandadas"
                                    icon={<FaBuilding />}
                                    itens={atual.perfilSolicitantes.detalhamento?.porOrgao}
                                    totalBase={atual.totalRecebidos}
                                />
                            </div>
                        </div>

                        {/* Recursos Administrativos */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                                        <FaBalanceScale className="text-[#F39A32]" /> Recursos Administrativos Interpostos ({atual.exercicio})
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Pedidos de revisão protocolados em 1ª e 2ª instâncias administrativas nos termos da LAI (Arts. 15 a 18).
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                                    <span className="block text-2xl font-black text-gray-900">{atual.recursos.interpostos}</span>
                                    <span className="text-[11px] font-bold text-gray-500 uppercase">Total Interpostos</span>
                                </div>
                                <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 text-center">
                                    <span className="block text-2xl font-black text-[#1254A3]">
                                        {atual.recursos.primeiraInstancia ?? atual.recursos.interpostos}
                                    </span>
                                    <span className="text-[11px] font-bold text-[#1254A3] uppercase">1ª Instância</span>
                                </div>
                                <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 text-center">
                                    <span className="block text-2xl font-black text-indigo-700">
                                        {atual.recursos.segundaInstancia ?? 0}
                                    </span>
                                    <span className="text-[11px] font-bold text-indigo-700 uppercase">2ª Instância</span>
                                </div>
                                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                                    <span className="block text-2xl font-black text-emerald-700">
                                        {atual.recursos.respondidos ?? atual.recursos.deferidos ?? 0}
                                    </span>
                                    <span className="text-[11px] font-bold text-emerald-700 uppercase">Julgados</span>
                                </div>
                            </div>
                        </div>

                        {/* Quadro Histórico Completo */}
                        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-black text-gray-900">
                                        Série Histórica Anual Consolidada (e-SIC)
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Totais por exercício: pedidos recebidos, atendidos, indeferidos e perfil resumido de solicitantes.
                                    </p>
                                </div>
                                {consolidado && (
                                    <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl">
                                        Acumulado geral: {consolidado.totalRecebidos} pedido(s)
                                    </span>
                                )}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead className="bg-gray-50 text-[11px] font-black uppercase text-gray-500 border-b border-gray-200">
                                        <tr>
                                            <th className="py-3.5 px-5">Exercício</th>
                                            <th className="py-3.5 px-5 text-center">Recebidos</th>
                                            <th className="py-3.5 px-5 text-center">Atendidos</th>
                                            <th className="py-3.5 px-5 text-center">Indeferidos</th>
                                            <th className="py-3.5 px-5 text-center">Em Tramitação</th>
                                            <th className="py-3.5 px-5 text-center">Pessoa Física</th>
                                            <th className="py-3.5 px-5 text-center">Pessoa Jurídica</th>
                                            <th className="py-3.5 px-5 text-center">Anônimos</th>
                                            <th className="py-3.5 px-5 text-center">Recursos</th>
                                            <th className="py-3.5 px-5 text-center">Tempo Médio</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {stats.map((s) => (
                                            <tr
                                                key={s.exercicio}
                                                onClick={() => setExercicioSelecionado(s.exercicio)}
                                                className={`cursor-pointer transition-colors ${
                                                    s.exercicio === exercicioSelecionado
                                                        ? "bg-blue-50/60 font-semibold"
                                                        : "hover:bg-gray-50"
                                                }`}
                                            >
                                                <td className="py-3.5 px-5 font-black text-[#1254A3]">{s.exercicio}</td>
                                                <td className="py-3.5 px-5 text-center font-bold">{s.totalRecebidos}</td>
                                                <td className="py-3.5 px-5 text-center text-emerald-700 font-bold">{s.atendidos}</td>
                                                <td className="py-3.5 px-5 text-center text-rose-700 font-bold">{s.indeferidos}</td>
                                                <td className="py-3.5 px-5 text-center text-amber-600 font-bold">{s.emTramitacao}</td>
                                                <td className="py-3.5 px-5 text-center">{s.perfilSolicitantes.pessoaFisica}</td>
                                                <td className="py-3.5 px-5 text-center">{s.perfilSolicitantes.pessoaJuridica}</td>
                                                <td className="py-3.5 px-5 text-center">
                                                    {s.perfilSolicitantes.anonimoNaoIdentificado || 0}
                                                </td>
                                                <td className="py-3.5 px-5 text-center">{s.recursos.interpostos}</td>
                                                <td className="py-3.5 px-5 text-center">
                                                    {s.tempoMedioDias > 0 ? `${s.tempoMedioDias} dias` : "—"}
                                                </td>
                                            </tr>
                                        ))}
                                        {consolidado && (
                                            <tr className="bg-slate-900 text-white font-bold">
                                                <td className="py-3.5 px-5">TOTAL</td>
                                                <td className="py-3.5 px-5 text-center">{consolidado.totalRecebidos}</td>
                                                <td className="py-3.5 px-5 text-center text-emerald-300">{consolidado.atendidos}</td>
                                                <td className="py-3.5 px-5 text-center text-rose-300">{consolidado.indeferidos}</td>
                                                <td className="py-3.5 px-5 text-center text-amber-300">{consolidado.emTramitacao}</td>
                                                <td className="py-3.5 px-5 text-center">{consolidado.perfilSolicitantes.pessoaFisica}</td>
                                                <td className="py-3.5 px-5 text-center">{consolidado.perfilSolicitantes.pessoaJuridica}</td>
                                                <td className="py-3.5 px-5 text-center">
                                                    {consolidado.perfilSolicitantes.anonimoNaoIdentificado || 0}
                                                </td>
                                                <td className="py-3.5 px-5 text-center">{consolidado.recursos.interpostos}</td>
                                                <td className="py-3.5 px-5 text-center">
                                                    {consolidado.tempoMedioDias > 0 ? `${consolidado.tempoMedioDias} dias` : "—"}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Acesso Rápido aos Demais Relatórios Obrigatórios do e-SIC */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link
                                href="/transparencia/passiva/relatorios/com-sigilo"
                                className="bg-white hover:border-[#1254A3] border border-gray-200 rounded-2xl p-5 flex items-center justify-between gap-4 transition-all group shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                                        <FaLock />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm text-gray-900 group-hover:text-[#1254A3]">
                                            Rol de Documentos Classificados (Sigilo)
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                            Assunto, categoria, grau de sigilo, dispositivo legal e prazo.
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-[#1254A3]">Acessar →</span>
                            </Link>

                            <Link
                                href="/transparencia/passiva/relatorios/sem-sigilo"
                                className="bg-white hover:border-emerald-600 border border-gray-200 rounded-2xl p-5 flex items-center justify-between gap-4 transition-all group shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <FaLockOpen />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm text-gray-900 group-hover:text-emerald-700">
                                            Informações Desclassificadas (Últimos 12 Meses)
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                            Relação de informações que perderam restrição nos últimos 12 meses.
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-emerald-700">Acessar →</span>
                            </Link>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
