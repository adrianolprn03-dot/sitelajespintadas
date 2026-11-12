"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import {
    FaEye,
    FaLockOpen,
    FaShieldAlt,
    FaCalendarAlt,
    FaCheckCircle,
    FaFilePdf,
    FaSpinner,
    FaInfoCircle,
    FaHistory,
    FaExternalLinkAlt
} from "react-icons/fa";

type DesclassificadoItem = {
    id: string;
    protocolo: string;
    assunto: string;
    grauSigiloOriginal: string;
    dataClassificacaoOriginal: string;
    dataDesclassificacao: string;
    atoDesclassificacao: string;
    documentoUrl: string;
};

type Declaracao = {
    id: string;
    orgaoResponsavel: string;
    exercicio: number;
    competencia?: string;
    tipoSituacao: string;
    textoDeclaracao: string;
    fundamentoLegal?: string;
    responsavelNome: string;
    responsavelCargo?: string;
    arquivoAssinadoUrl?: string;
    dataEmissao: string;
    dataConferencia: string;
};

export default function SICRelatoriosDesclassificadosPage() {
    const [itens, setItens] = useState<DesclassificadoItem[]>([]);
    const [declaracao, setDeclaracao] = useState<Declaracao | null>(null);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState("2026");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/transparencia/esic-relatorios?tipo=desclassificadas&ano=${ano}`);
                const data = await res.json();
                if (data.sucesso) {
                    setItens(data.itens || []);
                    setDeclaracao(data.declaracaoOficial || null);
                }
            } catch (error) {
                console.error("Erro ao carregar desclassificações:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ano]);

    const itensFiltrados = itens.filter((i) => {
        const termo = busca.toLowerCase();
        return (
            !busca ||
            i.protocolo.toLowerCase().includes(termo) ||
            i.assunto.toLowerCase().includes(termo) ||
            i.grauSigiloOriginal.toLowerCase().includes(termo)
        );
    });

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = itensFiltrados.length > 0
            ? itensFiltrados.map((i) => ({
                "Protocolo": i.protocolo,
                "Assunto": i.assunto,
                "Grau de Sigilo Original": i.grauSigiloOriginal,
                "Data Classificação Original": new Date(i.dataClassificacaoOriginal).toLocaleDateString("pt-BR"),
                "Data Desclassificação": new Date(i.dataDesclassificacao).toLocaleDateString("pt-BR"),
                "Ato Legal de Desclassificação": i.atoDesclassificacao
            }))
            : [{
                "Situação": "Sem Documentos Desclassificados nos Últimos 12 Meses",
                "Município": "Lajes Pintadas/RN",
                "Exercício": ano,
                "Fundamento": "Art. 30, inciso I da Lei Federal nº 12.527/2011 (LAI)"
            }];

        const filename = `rol_informacoes_desclassificadas_${ano}`;
        const title = `Rol de Informações Desclassificadas (Últimos 12 Meses) – Lajes Pintadas/RN (${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <PageHeader
                title="Rol de Informações Desclassificadas (12.9)"
                subtitle="Relação de documentos e informações cujo prazo de sigilo expirou ou foram reavaliados e desclassificados nos últimos 12 meses."
                icon={<FaLockOpen className="w-8 h-8 text-[#1254A3]" />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva", href: "/transparencia/passiva" },
                    { label: "Relatórios", href: "/transparencia/passiva/relatorios" },
                    { label: "Informações Desclassificadas" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Banner de Conformidade PNTP */}
                <BannerPNTP
                    criterio="12.9"
                    requisito="Divulga rol das informações desclassificadas nos últimos 12 meses ou declaração de inexistência?"
                    status="Atende com Rol / Declaração Oficial de Inexistência"
                />

                {/* Bloco de Destaque: Declaração Oficial de Inexistência de Desclassificações nos Últimos 12 Meses */}
                {declaracao && (
                    <div className="bg-gradient-to-br from-[#0B2545] via-[#1254A3] to-[#1E3A8A] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/15">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-2xl shadow-lg">
                                        <FaCheckCircle className="w-8 h-8 text-[#0B2545]" />
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-black uppercase tracking-widest text-amber-300 block">
                                            Lei de Acesso à Informação • Art. 30, Inciso I • Critério PNTP 12.9
                                        </span>
                                        <h2 className="text-xl sm:text-2xl font-black text-white">
                                            Declaração Oficial: Rol de Informações Desclassificadas
                                        </h2>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs font-semibold text-white">
                                    <FaCalendarAlt className="text-amber-300" />
                                    <span>Atualização Oficial: <strong>{new Date(declaracao.dataConferencia).toLocaleDateString("pt-BR")}</strong></span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">
                                    {declaracao.orgaoResponsavel}
                                </p>

                                <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl border-l-4 border-amber-400 border border-white/15 text-white shadow-inner">
                                    <p className="text-base sm:text-lg leading-relaxed font-medium">
                                        “{declaracao.textoDeclaracao}”
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-100 pt-2">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <strong className="text-amber-300 block mb-1">Fundamentação Legal:</strong>
                                        <span>{declaracao.fundamentoLegal}</span>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <strong className="text-amber-300 block mb-1">Autoridade Certificadora:</strong>
                                        <span>{declaracao.responsavelNome} ({declaracao.responsavelCargo})</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={() => {
                                        const payload = [{
                                            "Documento": "Declaração de Inexistência de Informações Desclassificadas nos Últimos 12 Meses",
                                            "Município": "Prefeitura Municipal de Lajes Pintadas/RN",
                                            "Órgão": declaracao.orgaoResponsavel,
                                            "Fundamento Legal": declaracao.fundamentoLegal,
                                            "Declaração": declaracao.textoDeclaracao,
                                            "Data": new Date().toLocaleDateString("pt-BR")
                                        }];
                                        exportToPDF(payload, "declaracao_oficial_desclassificadas_12_meses", "Declaração Oficial de Informações Desclassificadas - Lajes Pintadas/RN");
                                    }}
                                    className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20 text-sm cursor-pointer"
                                >
                                    <FaFilePdf className="w-4 h-4 text-slate-950" />
                                    Baixar Certidão / Declaração Oficial em PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filtros e Relação de Itens Desclassificados */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Consulta ao Acervo de Desclassificações</h2>
                            <p className="text-sm text-gray-500">
                                Registros de documentos que perderam a restrição de sigilo e passaram a ter acesso irrestrito ao público.
                            </p>
                        </div>
                    </div>

                    <TransparencyFilters
                        searchValue={busca}
                        onSearch={setBusca}
                        currentYear={ano}
                        onYearChange={setAno}
                        onClear={() => { setBusca(""); setAno("2026"); }}
                        onExport={handleExport}
                    />

                    {loading ? (
                        <div className="py-16 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
                            <FaSpinner className="animate-spin text-3xl text-[#1254A3]" />
                            <span>Consultando rol de desclassificações...</span>
                        </div>
                    ) : itensFiltrados.length === 0 ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center space-y-3">
                            <FaInfoCircle className="w-12 h-12 text-[#1254A3] mx-auto" />
                            <h3 className="text-base font-bold text-blue-900">
                                Inexistência de Documentos Desclassificados no Período
                            </h3>
                            <p className="text-xs text-blue-800 max-w-xl mx-auto leading-relaxed">
                                Nenhum documento municipal teve prazo de sigilo expirado ou desclassificação realizada nos últimos 12 meses, conforme atestado formalmente na declaração da Controladoria Geral acima.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                                        <th className="py-4 px-4">Protocolo / CIDIC</th>
                                        <th className="py-4 px-4">Assunto</th>
                                        <th className="py-4 px-4">Grau Original</th>
                                        <th className="py-4 px-4">Data Classificação</th>
                                        <th className="py-4 px-4">Data Desclassificação</th>
                                        <th className="py-4 px-4">Ato Legal</th>
                                        <th className="py-4 px-4 text-right">Acesso</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {itensFiltrados.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 font-mono font-bold text-gray-800">{item.protocolo}</td>
                                            <td className="py-4 px-4 text-gray-700 max-w-md">{item.assunto}</td>
                                            <td className="py-4 px-4">
                                                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold">
                                                    {item.grauSigiloOriginal}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-xs text-gray-600">
                                                {new Date(item.dataClassificacaoOriginal).toLocaleDateString("pt-BR")}
                                            </td>
                                            <td className="py-4 px-4 text-xs font-bold text-emerald-700">
                                                {new Date(item.dataDesclassificacao).toLocaleDateString("pt-BR")}
                                            </td>
                                            <td className="py-4 px-4 text-xs text-gray-600">{item.atoDesclassificacao}</td>
                                            <td className="py-4 px-4 text-right">
                                                <a
                                                    href={item.documentoUrl}
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1254A3] hover:underline"
                                                >
                                                    <FaExternalLinkAlt className="w-3 h-3" /> Ver Íntegra
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
