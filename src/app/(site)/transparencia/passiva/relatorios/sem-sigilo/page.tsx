"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import {
    FaLockOpen,
    FaLock,
    FaChartBar,
    FaShieldAlt,
    FaFilePdf,
    FaFileAlt,
    FaExternalLinkAlt,
    FaSpinner,
    FaCheckCircle,
    FaCalendarCheck,
} from "react-icons/fa";

type DesclassificadaItem = {
    id: string;
    protocolo: string;
    codigoIdentificacao: string;
    isDocumentoInterno?: boolean;
    assunto: string;
    assuntoPublicavel: string;
    categoria: string;
    orgao: string;
    categoriaOrgao: string;
    grauSigiloOriginal: string;
    dispositivoLegal: string;
    autoridadeClassificadora: string;
    dataClassificacaoOriginal: string;
    dataDesclassificacao: string;
    atoDesclassificacao: string;
    documentoUrl?: string | null;
};

type DeclaracaoOficial = {
    situacao: string;
    texto: string;
    fundamentoLegal: string;
    responsavel: string;
    dataEmissao: string;
    arquivoAssinadoUrl?: string | null;
};

export default function SICRelatoriosDesclassificadosPage() {
    const [loading, setLoading] = useState(true);
    const [itens, setItens] = useState<DesclassificadaItem[]>([]);
    const [total12Meses, setTotal12Meses] = useState(0);
    const [periodoInicio, setPeriodoInicio] = useState<string | null>(null);
    const [periodoFim, setPeriodoFim] = useState<string | null>(null);
    const [declaracao, setDeclaracao] = useState<DeclaracaoOficial | null>(null);
    const [search, setSearch] = useState("");
    const [ano, setAno] = useState("TODOS");
    const [anosDisponiveis, setAnosDisponiveis] = useState<string[]>(["2026", "2025"]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/transparencia/esic-relatorios?tipo=desclassificadas&ano=${ano}`
            );
            const data = await res.json();
            setItens(data.itens || []);
            setTotal12Meses(data.totalUltimos12Meses ?? data.total ?? 0);
            setPeriodoInicio(data.periodoInicio || null);
            setPeriodoFim(data.periodoFim || null);
            if (Array.isArray(data.anosDisponiveis) && data.anosDisponiveis.length > 0) {
                setAnosDisponiveis(data.anosDisponiveis.map((y: number) => String(y)));
            }
            setDeclaracao(data.declaracaoOficial || null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [ano]);

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
            (i.atoDesclassificacao || "").toLowerCase().includes(q)
        );
    });

    const handleExport = (format: "csv" | "json" | "pdf" | "xlsx") => {
        const payload =
            filtered.length > 0
                ? filtered.map((i) => ({
                      "Código / Protocolo": i.codigoIdentificacao || i.protocolo,
                      "Assunto": i.assunto || i.assuntoPublicavel,
                      "Categoria": i.categoria,
                      "Órgão": i.orgao,
                      "Grau Anterior": i.grauSigiloOriginal,
                      "Classificação Original": new Date(
                          i.dataClassificacaoOriginal
                      ).toLocaleDateString("pt-BR"),
                      "Data Desclassificação": new Date(i.dataDesclassificacao).toLocaleDateString(
                          "pt-BR"
                      ),
                      "Dispositivo Legal": i.dispositivoLegal,
                      "Ato / Justificativa": i.atoDesclassificacao,
                  }))
                : [
                      {
                          "Órgão": "Prefeitura Municipal de Lajes Pintadas/RN",
                          "Período Verificado":
                              periodoInicio && periodoFim
                                  ? `${new Date(periodoInicio).toLocaleDateString("pt-BR")} a ${new Date(periodoFim).toLocaleDateString("pt-BR")} (Últimos 12 meses)`
                                  : "Últimos 12 meses",
                          "Declaração": declaracao?.texto || "",
                          "Fundamento Legal":
                              declaracao?.fundamentoLegal || "Art. 30, I da Lei nº 12.527/2011",
                          "Responsável": declaracao?.responsavel || "Controladoria Geral do Município",
                      },
                  ];

        const filename = `rol_informacoes_desclassificadas_12meses_lajes_pintadas`;
        const title = `Informações Desclassificadas nos Últimos 12 Meses (Art. 30, I da LAI) – Lajes Pintadas/RN`;
        const meta = {
            titulo: title,
            fonte: "e-SIC / Transparência Passiva",
            periodo: "Últimos 12 meses",
        };

        if (format === "csv") exportToCSV(payload, filename, meta);
        else if (format === "json") exportToJSON(payload, filename, meta);
        else if (format === "xlsx") exportToXLSX(payload, filename, meta);
        else exportToPDF(payload, filename, title, meta);
    };

    const baixarDeclaracaoPdf = () => {
        const texto =
            declaracao?.texto ||
            "Declaramos que não houve documentos ou informações desclassificadas nos últimos 12 meses no município de Lajes Pintadas/RN.";
        const payload = [
            {
                "Órgão": "Prefeitura Municipal de Lajes Pintadas / RN",
                "Objeto": "Rol de Informações Desclassificadas (Últimos 12 Meses)",
                "Período de Referência":
                    periodoInicio && periodoFim
                        ? `${new Date(periodoInicio).toLocaleDateString("pt-BR")} a ${new Date(periodoFim).toLocaleDateString("pt-BR")}`
                        : "Últimos 12 meses",
                "Fundamento Legal": declaracao?.fundamentoLegal || "Lei nº 12.527/2011, Art. 30, inciso I",
                "Declaração Oficial": texto,
                "Autoridade Emitente": declaracao?.responsavel || "Controladoria Geral / e-SIC",
                "Data de Emissão": declaracao?.dataEmissao
                    ? new Date(declaracao.dataEmissao).toLocaleDateString("pt-BR")
                    : new Date().toLocaleDateString("pt-BR"),
            },
        ];
        exportToPDF(
            payload,
            "declaracao_desclassificadas_12meses_lajes_pintadas",
            "Declaração Oficial - Informações Desclassificadas (Últimos 12 Meses)",
            {
                titulo:
                    "Declaração Oficial de Informações Desclassificadas nos Últimos 12 Meses",
                fonte: "Controladoria Geral / e-SIC",
                periodo: "Últimos 12 meses",
            }
        );
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <PageHeader
                title="Rol de Informações Desclassificadas (Últimos 12 Meses)"
                subtitle="Lista das informações e documentos cujo sigilo expirou ou foi extinto por reavaliação nos últimos 12 (doze) meses (Lei nº 12.527/2011 - Art. 30, I)."
                icon={<FaLockOpen className="w-8 h-8 text-[#1254A3]" />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva", href: "/transparencia/passiva" },
                    { label: "Relatórios e-SIC", href: "/transparencia/passiva/relatorios" },
                    { label: "Desclassificadas (12 Meses)" },
                ]}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
                <BannerPNTP
                    criterio="Art. 30, Inciso I da LAI"
                    requisito="Divulgação da lista de informações desclassificadas nos últimos 12 meses"
                    status="REGULAR"
                />

                {/* Faixa de Período dos Últimos 12 Meses */}
                {periodoInicio && periodoFim && (
                    <div className="bg-white rounded-2xl border border-gray-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-gray-700 font-semibold">
                            <FaCalendarCheck className="text-[#1254A3] text-base" />
                            <span>
                                Período legal de apuração (últimos 12 meses):{" "}
                                <strong className="text-gray-900">
                                    {new Date(periodoInicio).toLocaleDateString("pt-BR")} a{" "}
                                    {new Date(periodoFim).toLocaleDateString("pt-BR")}
                                </strong>
                            </span>
                        </div>
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                            {total12Meses} desclassificação(ões) no período
                        </span>
                    </div>
                )}

                {/* Declaração Oficial */}
                <div className="bg-gradient-to-br from-[#0F172A] via-[#1254A3] to-[#002855] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                        <FaShieldAlt className="w-64 h-64 -mr-10 -mt-10" />
                    </div>
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-3 max-w-3xl">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center shrink-0">
                                    <FaCheckCircle className="text-amber-300 text-xl" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-black uppercase tracking-widest text-amber-300 block">
                                        Lei de Acesso à Informação • Art. 30, Inciso I
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-black text-white">
                                        {total12Meses === 0
                                            ? "Declaração Oficial: Sem Desclassificações nos Últimos 12 Meses"
                                            : "Registro Oficial: Informações Desclassificadas nos Últimos 12 Meses"}
                                    </h2>
                                </div>
                            </div>

                            <p className="text-sm text-blue-100 leading-relaxed font-medium bg-white/5 p-4 rounded-2xl border border-white/10">
                                “
                                {declaracao?.texto ||
                                    "Declaramos a inexistência de documentos ou informações desclassificadas no Município de Lajes Pintadas/RN nos últimos 12 meses."}
                                ”
                            </p>

                            <div className="flex flex-wrap gap-4 text-xs text-blue-200">
                                <span>
                                    <strong className="text-white">Fundamento Legal:</strong>{" "}
                                    {declaracao?.fundamentoLegal || "Art. 30, inciso I da Lei nº 12.527/2011"}
                                </span>
                                <span>•</span>
                                <span>
                                    <strong className="text-white">Responsável:</strong>{" "}
                                    {declaracao?.responsavel || "Controladoria Geral do Município"}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 shrink-0">
                            <button
                                onClick={baixarDeclaracaoPdf}
                                className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 px-5 py-3.5 rounded-2xl font-black text-xs shadow-lg transition-all"
                            >
                                <FaFilePdf className="text-base" /> Baixar Declaração Oficial (PDF)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <TransparencyFilters
                    onSearch={setSearch}
                    onYearChange={(y) => setAno(y)}
                    onMonthChange={() => {}}
                    onClear={() => {
                        setSearch("");
                        setAno("TODOS");
                    }}
                    onExport={handleExport}
                    availableYears={["TODOS", ...anosDisponiveis]}
                    currentYear={ano}
                    searchValue={search}
                    hideMonthFilter={true}
                    placeholder="Buscar por código, assunto, categoria, órgão ou ato de desclassificação..."
                />

                {/* Tabela de Desclassificadas */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-base font-black text-gray-900">
                            Lista de Informações Desclassificadas nos Últimos 12 Meses ({filtered.length})
                        </h3>
                    </div>

                    {loading ? (
                        <div className="p-16 text-center">
                            <FaSpinner className="animate-spin text-3xl text-[#1254A3] mx-auto mb-2" />
                            <p className="text-xs text-gray-500 font-semibold">
                                Verificando base de informações desclassificadas...
                            </p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="p-12 text-center space-y-2">
                            <p className="text-sm font-bold text-gray-700">
                                {total12Meses === 0
                                    ? "Nenhuma informação desclassificada nos últimos 12 meses."
                                    : "Nenhum registro encontrado para os filtros aplicados."}
                            </p>
                            <p className="text-xs text-gray-500 max-w-lg mx-auto">
                                Quando houver extinção de prazo de sigilo ou ato de desclassificação publicado nos últimos 12 meses, todos os detalhes constarão automaticamente nesta tabela pública.
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
                                        <th className="py-3.5 px-5">Grau Anterior</th>
                                        <th className="py-3.5 px-5">Classificação / Desclassificação</th>
                                        <th className="py-3.5 px-5">Ato / Dispositivo Legal</th>
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
                                            <td className="py-4 px-5 text-xs font-bold text-gray-700 whitespace-nowrap">
                                                {item.grauSigiloOriginal}
                                            </td>
                                            <td className="py-4 px-5 text-xs whitespace-nowrap">
                                                <span className="block font-bold text-emerald-700">
                                                    Desclassificado:{" "}
                                                    {new Date(item.dataDesclassificacao).toLocaleDateString("pt-BR")}
                                                </span>
                                                <span className="block text-[11px] text-gray-400">
                                                    Classificado em:{" "}
                                                    {new Date(item.dataClassificacaoOriginal).toLocaleDateString(
                                                        "pt-BR"
                                                    )}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5 text-xs text-gray-700 max-w-xs">
                                                <span className="block font-medium text-gray-800">
                                                    {item.atoDesclassificacao}
                                                </span>
                                                <span className="block text-[11px] text-gray-400 mt-0.5">
                                                    {item.dispositivoLegal}
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
                        href="/transparencia/passiva/relatorios/com-sigilo"
                        className="bg-white hover:border-rose-600 border border-gray-200 rounded-2xl p-5 flex items-center justify-between gap-4 transition-all group shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                                <FaLock />
                            </div>
                            <div>
                                <h4 className="font-black text-sm text-gray-900 group-hover:text-rose-700">
                                    Rol de Documentos Classificados (Sigilo)
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Assunto, categoria, grau de sigilo, dispositivo legal e prazo.
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-rose-700">Acessar →</span>
                    </Link>
                </div>
            </main>
        </div>
    );
}
