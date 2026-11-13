"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import {
    FaShieldAlt,
    FaLock,
    FaLockOpen,
    FaChartBar,
    FaFileAlt,
    FaExternalLinkAlt,
    FaSpinner,
    FaInfoCircle,
    FaFilePdf,
    FaGavel,
    FaClock,
} from "react-icons/fa";

type ClassificadaItem = {
    id: string;
    protocolo: string;
    codigoIdentificacao: string;
    isDocumentoInterno?: boolean;
    assunto: string;
    assuntoPublicavel: string;
    categoria: string;
    orgao: string;
    categoriaOrgao: string;
    grauSigilo: string;
    dispositivoLegal: string;
    fundamentoLegal: string;
    autoridadeClassificadora: string;
    dataClassificacao: string;
    prazoRestricaoAnos: number;
    prazoTexto: string;
    dataPrevistaDesclassificacao: string;
    documentoUrl?: string | null;
};

type DeclaracaoInfo = {
    situacao: string;
    texto: string;
    fundamentoLegal: string;
    responsavel: string;
    dataEmissao: string;
};

export default function SICRelatoriosClassificadosPage() {
    const [loading, setLoading] = useState(true);
    const [itens, setItens] = useState<ClassificadaItem[]>([]);
    const [search, setSearch] = useState("");
    const [ano, setAno] = useState("TODOS");
    const [grauFiltro, setGrauFiltro] = useState("TODOS");
    const [anosDisponiveis, setAnosDisponiveis] = useState<string[]>([
        "2026",
        "2025",
        "2024",
        "2023",
    ]);
    const [stats, setStats] = useState({ reservado: 0, secreto: 0, ultrassecreto: 0, total: 0 });
    const [statsGlobais, setStatsGlobais] = useState({ reservado: 0, secreto: 0, ultrassecreto: 0, total: 0 });
    const [declaracao, setDeclaracao] = useState<DeclaracaoInfo | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                tipo: "classificadas",
                ano,
                grau: grauFiltro,
            });
            const res = await fetch(`/api/transparencia/esic-relatorios?${params.toString()}`);
            const data = await res.json();
            setItens(data.itens || []);
            if (Array.isArray(data.anosDisponiveis) && data.anosDisponiveis.length > 0) {
                setAnosDisponiveis(data.anosDisponiveis.map((y: number) => String(y)));
            }
            setStats(data.statsPorGrau || { reservado: 0, secreto: 0, ultrassecreto: 0, total: 0 });
            setStatsGlobais(
                data.statsGlobalPorGrau || data.statsPorGrau || { reservado: 0, secreto: 0, ultrassecreto: 0, total: 0 }
            );
            setDeclaracao(data.declaracaoInexistencia || null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [ano, grauFiltro]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filtered = itens.filter((i) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            i.protocolo.toLowerCase().includes(q) ||
            (i.codigoIdentificacao || "").toLowerCase().includes(q) ||
            (i.assunto || "").toLowerCase().includes(q) ||
            (i.categoria || "").toLowerCase().includes(q) ||
            (i.orgao || "").toLowerCase().includes(q) ||
            (i.dispositivoLegal || "").toLowerCase().includes(q) ||
            (i.grauSigilo || "").toLowerCase().includes(q)
        );
    });

    const handleExport = (format: "csv" | "json" | "pdf" | "xlsx") => {
        const payload =
            filtered.length > 0
                ? filtered.map((i) => ({
                      "Código / Protocolo": i.codigoIdentificacao || i.protocolo,
                      "Assunto da Informação": i.assunto || i.assuntoPublicavel,
                      "Categoria": i.categoria,
                      "Órgão / Secretaria": i.orgao,
                      "Grau de Sigilo": i.grauSigilo,
                      "Dispositivo Legal": i.dispositivoLegal || i.fundamentoLegal,
                      "Autoridade Classificadora": i.autoridadeClassificadora,
                      "Data Classificação": new Date(i.dataClassificacao).toLocaleDateString("pt-BR"),
                      "Prazo Legal (Anos)": `${i.prazoRestricaoAnos} anos`,
                      "Previsão Desclassificação": new Date(
                          i.dataPrevistaDesclassificacao
                      ).toLocaleDateString("pt-BR"),
                  }))
                : [
                      {
                          "Situação": "Sem documentos classificados ativos no filtro selecionado",
                          "Declaração Oficial": declaracao?.texto || "",
                          "Fundamento Legal": declaracao?.fundamentoLegal || "Lei nº 12.527/2011 - Art. 30, II",
                          "Data Emissão": declaracao?.dataEmissao
                              ? new Date(declaracao.dataEmissao).toLocaleDateString("pt-BR")
                              : new Date().toLocaleDateString("pt-BR"),
                      },
                  ];

        const filename = `rol_informacoes_classificadas_esic_lajes_pintadas`;
        const title = `Rol de Documentos e Informações Classificadas por Grau de Sigilo – Lajes Pintadas/RN`;
        const meta = {
            titulo: title,
            fonte: "e-SIC / Transparência Passiva",
            periodo: ano === "TODOS" ? "Todos os exercícios" : `Exercício ${ano}`,
        };

        if (format === "csv") exportToCSV(payload, filename, meta);
        else if (format === "json") exportToJSON(payload, filename, meta);
        else if (format === "xlsx") exportToXLSX(payload, filename, meta);
        else exportToPDF(payload, filename, title, meta);
    };

    const grauBadge = (grau: string) => {
        if (grau === "Ultrassecreto") return "bg-rose-100 text-rose-800 border-rose-200";
        if (grau === "Secreto") return "bg-orange-100 text-orange-800 border-orange-200";
        return "bg-amber-100 text-amber-800 border-amber-200";
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <PageHeader
                title="Rol de Informações Classificadas"
                subtitle="Lista de documentos classificados em cada grau de sigilo (Reservado, Secreto e Ultrassecreto), contendo assunto, categoria, dispositivo legal fundamentador e prazo."
                icon={<FaShieldAlt className="w-8 h-8 text-[#1254A3]" />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva", href: "/transparencia/passiva" },
                    { label: "Relatórios e-SIC", href: "/transparencia/passiva/relatorios" },
                    { label: "Rol de Classificados" },
                ]}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
                <BannerPNTP
                    criterio="Art. 30, Inciso II e Art. 24 da LAI"
                    requisito="Rol das informações classificadas em cada grau de sigilo com assunto, categoria, dispositivo legal e respectivo prazo de restrição"
                    status="REGULAR"
                />

                {/* Resumo por Grau de Sigilo (clicável para filtrar cada grau) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <button
                        type="button"
                        onClick={() => setGrauFiltro("TODOS")}
                        className={`text-left p-5 rounded-2xl border shadow-sm transition-all flex items-center justify-between ${
                            grauFiltro === "TODOS"
                                ? "bg-[#1254A3] text-white border-[#1254A3]"
                                : "bg-white text-gray-900 border-gray-200 hover:border-[#1254A3]"
                        }`}
                    >
                        <div>
                            <span
                                className={`text-[10px] font-black uppercase tracking-widest block ${
                                    grauFiltro === "TODOS" ? "text-blue-200" : "text-gray-500"
                                }`}
                            >
                                Todos os Graus
                            </span>
                            <span className="text-2xl font-black">{statsGlobais.total}</span>
                            <span
                                className={`text-[10px] block mt-0.5 ${
                                    grauFiltro === "TODOS" ? "text-blue-100" : "text-gray-400"
                                }`}
                            >
                                {grauFiltro === "TODOS" ? "Filtro ativo" : "Clique para ver todos"}
                            </span>
                        </div>
                        <FaShieldAlt
                            className={`text-2xl ${
                                grauFiltro === "TODOS" ? "text-white" : "text-[#1254A3]"
                            }`}
                        />
                    </button>

                    <button
                        type="button"
                        onClick={() => setGrauFiltro(grauFiltro === "Reservado" ? "TODOS" : "Reservado")}
                        className={`text-left p-5 rounded-2xl border shadow-sm transition-all flex items-center justify-between ${
                            grauFiltro === "Reservado"
                                ? "bg-amber-600 text-white border-amber-700"
                                : "bg-white border-amber-200 hover:border-amber-400"
                        }`}
                    >
                        <div>
                            <span
                                className={`text-[10px] font-black uppercase tracking-widest block ${
                                    grauFiltro === "Reservado" ? "text-amber-100" : "text-amber-700"
                                }`}
                            >
                                Grau Reservado (Até 5 anos)
                            </span>
                            <span
                                className={`text-2xl font-black ${
                                    grauFiltro === "Reservado" ? "text-white" : "text-gray-900"
                                }`}
                            >
                                {statsGlobais.reservado}
                            </span>
                        </div>
                        <FaLock
                            className={`text-2xl ${
                                grauFiltro === "Reservado" ? "text-white" : "text-amber-500"
                            }`}
                        />
                    </button>

                    <button
                        type="button"
                        onClick={() => setGrauFiltro(grauFiltro === "Secreto" ? "TODOS" : "Secreto")}
                        className={`text-left p-5 rounded-2xl border shadow-sm transition-all flex items-center justify-between ${
                            grauFiltro === "Secreto"
                                ? "bg-orange-600 text-white border-orange-700"
                                : "bg-white border-orange-200 hover:border-orange-400"
                        }`}
                    >
                        <div>
                            <span
                                className={`text-[10px] font-black uppercase tracking-widest block ${
                                    grauFiltro === "Secreto" ? "text-orange-100" : "text-orange-700"
                                }`}
                            >
                                Grau Secreto (Até 15 anos)
                            </span>
                            <span
                                className={`text-2xl font-black ${
                                    grauFiltro === "Secreto" ? "text-white" : "text-gray-900"
                                }`}
                            >
                                {statsGlobais.secreto}
                            </span>
                        </div>
                        <FaLock
                            className={`text-2xl ${
                                grauFiltro === "Secreto" ? "text-white" : "text-orange-500"
                            }`}
                        />
                    </button>

                    <button
                        type="button"
                        onClick={() => setGrauFiltro(grauFiltro === "Ultrassecreto" ? "TODOS" : "Ultrassecreto")}
                        className={`text-left p-5 rounded-2xl border shadow-sm transition-all flex items-center justify-between ${
                            grauFiltro === "Ultrassecreto"
                                ? "bg-rose-600 text-white border-rose-700"
                                : "bg-white border-rose-200 hover:border-rose-400"
                        }`}
                    >
                        <div>
                            <span
                                className={`text-[10px] font-black uppercase tracking-widest block ${
                                    grauFiltro === "Ultrassecreto" ? "text-rose-100" : "text-rose-700"
                                }`}
                            >
                                Ultrassecreto (Até 25 anos)
                            </span>
                            <span
                                className={`text-2xl font-black ${
                                    grauFiltro === "Ultrassecreto" ? "text-white" : "text-gray-900"
                                }`}
                            >
                                {statsGlobais.ultrassecreto}
                            </span>
                        </div>
                        <FaLock
                            className={`text-2xl ${
                                grauFiltro === "Ultrassecreto" ? "text-white" : "text-rose-500"
                            }`}
                        />
                    </button>
                </div>

                {/* Declaração Oficial (renderizada sempre que houver documento zero ou aviso legal) */}
                {declaracao && (
                    <div
                        className={`rounded-3xl p-6 sm:p-8 shadow-sm border ${
                            statsGlobais.total === 0
                                ? "bg-gradient-to-br from-slate-900 via-[#1254A3] to-[#002855] text-white border-blue-900"
                                : "bg-blue-50/70 border-blue-200 text-slate-800"
                        }`}
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="space-y-2 max-w-4xl">
                                <span
                                    className={`text-[10px] font-black uppercase tracking-widest block ${
                                        statsGlobais.total === 0 ? "text-amber-300" : "text-[#1254A3]"
                                    }`}
                                >
                                    Nota Oficial • {declaracao.fundamentoLegal}
                                </span>
                                <p
                                    className={`text-sm leading-relaxed ${
                                        statsGlobais.total === 0 ? "text-blue-50 font-medium" : "text-slate-700"
                                    }`}
                                >
                                    {declaracao.texto}
                                </p>
                                <p
                                    className={`text-xs ${
                                        statsGlobais.total === 0 ? "text-blue-200" : "text-slate-500"
                                    }`}
                                >
                                    <strong>Responsável:</strong> {declaracao.responsavel} •{" "}
                                    <strong>Emissão:</strong>{" "}
                                    {new Date(declaracao.dataEmissao).toLocaleDateString("pt-BR")}
                                </p>
                            </div>
                            <button
                                onClick={() => handleExport("pdf")}
                                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                                    statsGlobais.total === 0
                                        ? "bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-lg"
                                        : "bg-[#1254A3] hover:bg-blue-800 text-white"
                                }`}
                            >
                                <FaFilePdf /> Baixar Relatório Oficial (PDF)
                            </button>
                        </div>
                    </div>
                )}

                {/* Barra de Filtros */}
                <TransparencyFilters
                    onSearch={setSearch}
                    onYearChange={(y) => setAno(y)}
                    onMonthChange={() => {}}
                    onClear={() => {
                        setSearch("");
                        setAno("TODOS");
                        setGrauFiltro("TODOS");
                    }}
                    onExport={handleExport}
                    availableYears={["TODOS", ...anosDisponiveis]}
                    currentYear={ano}
                    searchValue={search}
                    hideMonthFilter={true}
                    placeholder="Buscar por código, assunto, categoria, órgão ou dispositivo legal..."
                >
                    <select
                        value={grauFiltro}
                        onChange={(e) => setGrauFiltro(e.target.value)}
                        className="h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="TODOS">Todos os Graus de Sigilo</option>
                        <option value="Reservado">Reservado (até 5 anos)</option>
                        <option value="Secreto">Secreto (até 15 anos)</option>
                        <option value="Ultrassecreto">Ultrassecreto (até 25 anos)</option>
                    </select>
                </TransparencyFilters>

                {/* Tabela de Documentos Classificados */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h2 className="text-base font-black text-gray-900">
                                Lista de Documentos e Informações Classificadas ({filtered.length})
                            </h2>
                            <p className="text-xs text-gray-500">
                                Exibindo assunto, categoria, dispositivo legal que fundamenta a classificação e prazo de restrição.
                            </p>
                        </div>
                        <span className="text-xs font-semibold text-gray-500">
                            No filtro atual: <strong>{stats.reservado}</strong> Reservado •{" "}
                            <strong>{stats.secreto}</strong> Secreto • <strong>{stats.ultrassecreto}</strong> Ultrassecreto
                        </span>
                    </div>

                    {loading ? (
                        <div className="p-16 text-center">
                            <FaSpinner className="animate-spin text-3xl text-[#1254A3] mx-auto mb-2" />
                            <p className="text-xs text-gray-500 font-semibold">Consultando rol de sigilo...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="p-12 text-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                                <FaInfoCircle className="text-3xl" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">
                                Nenhum documento classificado encontrado para os filtros atuais
                            </h3>
                            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                                {statsGlobais.total === 0
                                    ? "Até o momento, não existem documentos administrativos classificados sob sigilo nos graus Reservado, Secreto ou Ultrassecreto na Prefeitura Municipal de Lajes Pintadas/RN."
                                    : "Tente limpar os filtros de busca, ano ou grau de sigilo para visualizar todos os documentos cadastrados."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead className="bg-gray-50 text-[11px] font-black uppercase text-gray-500 border-b border-gray-200">
                                    <tr>
                                        <th className="py-3.5 px-5">Código / Protocolo</th>
                                        <th className="py-3.5 px-5">Assunto da Informação</th>
                                        <th className="py-3.5 px-5">Categoria / Órgão</th>
                                        <th className="py-3.5 px-5 text-center">Grau de Sigilo</th>
                                        <th className="py-3.5 px-5">Dispositivo Legal Fundamentador</th>
                                        <th className="py-3.5 px-5">Prazo da Classificação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filtered.map((item) => (
                                        <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="py-4 px-5 font-mono text-xs font-bold text-[#1254A3] whitespace-nowrap">
                                                {item.documentoUrl ? (
                                                    <Link
                                                        href={item.documentoUrl}
                                                        className="inline-flex items-center gap-1 hover:underline"
                                                    >
                                                        {item.codigoIdentificacao}
                                                        <FaExternalLinkAlt className="text-[10px]" />
                                                    </Link>
                                                ) : (
                                                    <span>{item.codigoIdentificacao}</span>
                                                )}
                                                <span className="block text-[10px] font-sans font-normal text-gray-400 mt-0.5">
                                                    {item.isDocumentoInterno ? "Documento Classificado" : "Pedido e-SIC"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5 text-xs text-gray-800 font-medium max-w-sm">
                                                <div className="flex items-start gap-2">
                                                    <FaFileAlt className="text-gray-400 mt-0.5 shrink-0" />
                                                    <span>{item.assunto}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-5 text-xs">
                                                <span className="font-bold text-gray-900 block">{item.categoria}</span>
                                                {item.orgao !== item.categoria && (
                                                    <span className="text-[11px] text-gray-500">{item.orgao}</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-5 text-center whitespace-nowrap">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border ${grauBadge(
                                                        item.grauSigilo
                                                    )}`}
                                                >
                                                    {item.grauSigilo}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5 text-xs text-gray-700 max-w-xs">
                                                <span className="flex items-start gap-1.5 font-semibold text-gray-800">
                                                    <FaGavel className="text-gray-400 mt-0.5 shrink-0" />
                                                    {item.dispositivoLegal}
                                                </span>
                                                <span className="text-[11px] text-gray-400 block mt-0.5">
                                                    Autoridade: {item.autoridadeClassificadora}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5 text-xs text-gray-700 whitespace-nowrap">
                                                <span className="flex items-center gap-1.5 font-bold text-gray-900">
                                                    <FaClock className="text-[#1254A3]" />
                                                    {item.prazoRestricaoAnos}{" "}
                                                    {item.prazoRestricaoAnos === 1 ? "ano" : "anos"}
                                                </span>
                                                <span className="block text-[11px] text-gray-500 mt-0.5">
                                                    Classificado em:{" "}
                                                    {new Date(item.dataClassificacao).toLocaleDateString("pt-BR")}
                                                </span>
                                                <span className="block text-[11px] text-amber-700 font-semibold">
                                                    Termo final:{" "}
                                                    {new Date(item.dataPrevistaDesclassificacao).toLocaleDateString("pt-BR")}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Acesso Rápido aos Demais Relatórios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        href="/transparencia/passiva/relatorios/estatisticas"
                        className="bg-white hover:border-[#1254A3] border border-gray-200 rounded-2xl p-5 flex items-center justify-between gap-4 transition-all group shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1254A3] flex items-center justify-center shrink-0">
                                <FaChartBar />
                            </div>
                            <div>
                                <h4 className="font-black text-sm text-gray-900 group-hover:text-[#1254A3]">
                                    Relatório Estatístico Anual (e-SIC)
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Pedidos recebidos, atendidos, indeferidos e perfil dos solicitantes.
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
                                    Rol de documentos que perderam restrição nos últimos 12 meses.
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-700">Acessar →</span>
                    </Link>
                </div>
            </main>
        </div>
    );
}
