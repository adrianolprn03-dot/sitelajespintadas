"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import {
    FaChartBar,
    FaFileAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaUsers,
    FaBuilding,
    FaCalendarAlt,
    FaFilePdf,
    FaSpinner,
    FaBalanceScale
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

export default function SICEstatisticasPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ExercicioStats[]>([]);
    const [exercicioSelecionado, setExercicioSelecionado] = useState(2026);

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
        const title = `Relatório Estatístico Anual de Atendimento à LAI (PNTP 12.7) – Lajes Pintadas/RN`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <PageHeader
                title="Relatório Estatístico Anual do e-SIC (12.7)"
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
                    criterio="12.7"
                    requisito="Divulga relatório estatístico contendo a quantidade de pedidos de informação recebidos, atendidos e indeferidos, bem como informações genéricas sobre os solicitantes?"
                    status="Atende com Série Histórica e Indicadores Oficiais"
                />

                {/* Seletor de Exercício e Exportação */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Exercício de Referência:</span>
                        <div className="flex flex-wrap gap-2">
                            {[2021, 2022, 2023, 2024, 2025, 2026].map((ano) => (
                                <button
                                    key={ano}
                                    onClick={() => setExercicioSelecionado(ano)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
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
                        <button
                            onClick={() => handleExport("pdf")}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                        >
                            <FaFilePdf /> Baixar Relatório Anual (PDF)
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

                        {/* Detalhamento de Perfil dos Solicitantes & Recursos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                    <FaUsers className="text-[#1254A3]" /> Perfil Genérico dos Solicitantes ({atual.exercicio})
                                </h3>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Conforme exigência do Critério 12.7 do PNTP, divulgação agregada e anonimizada da natureza jurídica e demografia dos requerentes de informação pública.
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
