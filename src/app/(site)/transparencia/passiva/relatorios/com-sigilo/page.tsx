"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import {
    FaShieldAlt,
    FaLock,
    FaCalendarAlt,
    FaCheckCircle,
    FaFilePdf,
    FaSpinner,
    FaInfoCircle,
    FaBalanceScale,
    FaFilter
} from "react-icons/fa";

type ClassificadoItem = {
    id: string;
    protocolo: string;
    cidic: string;
    categoria: string;
    assuntoPublicavel: string;
    grauSigilo: string;
    fundamentoLegal: string;
    autoridadeClassificadora: string;
    dataClassificacao: string;
    prazoRestricaoAnos: number;
    dataPrevistaDesclassificacao: string;
};

export default function SICRelatoriosClassificadosPage() {
    const [itens, setItens] = useState<ClassificadoItem[]>([]);
    const [declaracao, setDeclaracao] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState("2026");
    const [grauFiltro, setGrauFiltro] = useState("todos");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/transparencia/esic-relatorios?tipo=classificadas&ano=${ano}`);
                const data = await res.json();
                if (data.sucesso) {
                    setItens(data.itens || []);
                    setDeclaracao(data.declaracaoInexistencia || null);
                }
            } catch (error) {
                console.error("Erro ao carregar informações classificadas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ano]);

    const itensFiltrados = itens.filter((i) => {
        const termo = busca.toLowerCase();
        const matchesBusca =
            !busca ||
            i.protocolo.toLowerCase().includes(termo) ||
            i.cidic.toLowerCase().includes(termo) ||
            i.assuntoPublicavel.toLowerCase().includes(termo) ||
            i.categoria.toLowerCase().includes(termo);

        const matchesGrau =
            grauFiltro === "todos" || i.grauSigilo.toLowerCase() === grauFiltro.toLowerCase();

        return matchesBusca && matchesGrau;
    });

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = itensFiltrados.length > 0
            ? itensFiltrados.map((i) => ({
                "CIDIC": i.cidic,
                "Protocolo": i.protocolo,
                "Categoria / Órgão": i.categoria,
                "Assunto Publicável": i.assuntoPublicavel,
                "Grau de Sigilo": i.grauSigilo,
                "Fundamento Legal": i.fundamentoLegal,
                "Data Classificação": new Date(i.dataClassificacao).toLocaleDateString("pt-BR"),
                "Prazo (Anos)": i.prazoRestricaoAnos,
                "Previsão Desclassificação": new Date(i.dataPrevistaDesclassificacao).toLocaleDateString("pt-BR")
            }))
            : [{
                "Situação": "Sem Informações Classificadas",
                "Município": "Lajes Pintadas/RN",
                "Exercício": ano,
                "Fundamento": "Art. 23 e 24 da Lei Federal nº 12.527/2011 (LAI)"
            }];

        const filename = `rol_informacoes_classificadas_${ano}`;
        const title = `Rol de Informações Classificadas em Cada Grau de Sigilo – Lajes Pintadas/RN (${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <PageHeader
                title="Rol de Informações Classificadas"
                subtitle="Relação de documentos com restrição temporária de acesso nos graus Reservado, Secreto ou Ultrassecreto (Lei nº 12.527/2011)."
                icon={<FaShieldAlt className="w-8 h-8 text-[#1254A3]" />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva", href: "/transparencia/passiva" },
                    { label: "Relatórios", href: "/transparencia/passiva/relatorios" },
                    { label: "Informações Classificadas" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Banner de Conformidade PNTP */}
                <BannerPNTP
                    criterio="12.8"
                    requisito="Divulga rol das informações classificadas em cada grau de sigilo ou declaração de inexistência?"
                    status="Atende com Rol / Declaração Oficial de Inexistência"
                />

                {/* Resumo por Graus de Sigilo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500 uppercase">Reservado (Até 5 Anos)</span>
                            <span className="w-3 h-3 rounded-full bg-blue-500" />
                        </div>
                        <p className="text-3xl font-black text-gray-900">
                            {itens.filter((i) => i.grauSigilo === "Reservado").length}
                        </p>
                        <p className="text-xs text-gray-500">Fundamento: Art. 24, § 1º, III da LAI</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500 uppercase">Secreto (Até 15 Anos)</span>
                            <span className="w-3 h-3 rounded-full bg-amber-500" />
                        </div>
                        <p className="text-3xl font-black text-gray-900">
                            {itens.filter((i) => i.grauSigilo === "Secreto").length}
                        </p>
                        <p className="text-xs text-gray-500">Fundamento: Art. 24, § 1º, II da LAI</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500 uppercase">Ultrassecreto (Até 25 Anos)</span>
                            <span className="w-3 h-3 rounded-full bg-rose-500" />
                        </div>
                        <p className="text-3xl font-black text-gray-900">
                            {itens.filter((i) => i.grauSigilo === "Ultrassecreto").length}
                        </p>
                        <p className="text-xs text-gray-500">Fundamento: Art. 24, § 1º, I da LAI</p>
                    </div>
                </div>

                {/* Filtro por Grau e Busca */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Consulta de Informações Classificadas</h2>
                            <p className="text-sm text-gray-500">
                                Exibição dos campos autorizados pela LAI para consulta pública com fundamentação legal.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">Grau:</span>
                            <select
                                value={grauFiltro}
                                onChange={(e) => setGrauFiltro(e.target.value)}
                                className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 font-medium"
                            >
                                <option value="todos">Todos os Graus</option>
                                <option value="Reservado">Reservado</option>
                                <option value="Secreto">Secreto</option>
                                <option value="Ultrassecreto">Ultrassecreto</option>
                            </select>
                        </div>
                    </div>

                    <TransparencyFilters
                        searchValue={busca}
                        onSearch={setBusca}
                        currentYear={ano}
                        onYearChange={setAno}
                        onClear={() => { setBusca(""); setAno("2026"); setGrauFiltro("todos"); }}
                        onExport={handleExport}
                    />

                    {loading ? (
                        <div className="py-16 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
                            <FaSpinner className="animate-spin text-3xl text-[#1254A3]" />
                            <span>Consultando rol de documentos classificados...</span>
                        </div>
                    ) : itensFiltrados.length === 0 ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
                            <FaCheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                            <h3 className="text-base font-bold text-emerald-900">
                                Inexistência de Documentos com Sigilo no Exercício
                            </h3>
                            <p className="text-xs text-emerald-800 max-w-xl mx-auto leading-relaxed">
                                A Prefeitura Municipal de Lajes Pintadas/RN atesta que inexistem documentos ou expedientes ativos sob classificação de sigilo para os parâmetros selecionados.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                                        <th className="py-4 px-4">CIDIC / Protocolo</th>
                                        <th className="py-4 px-4">Categoria / Órgão</th>
                                        <th className="py-4 px-4">Assunto Publicável</th>
                                        <th className="py-4 px-4">Grau Sigilo</th>
                                        <th className="py-4 px-4">Fundamento Legal</th>
                                        <th className="py-4 px-4">Data Classificação</th>
                                        <th className="py-4 px-4">Prazo / Previsão</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {itensFiltrados.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4">
                                                <div className="font-mono font-bold text-gray-900 text-xs">{item.cidic}</div>
                                                <div className="text-[11px] text-gray-500">{item.protocolo}</div>
                                            </td>
                                            <td className="py-4 px-4 font-medium text-gray-800 text-xs">{item.categoria}</td>
                                            <td className="py-4 px-4 text-gray-700 text-xs max-w-xs">{item.assuntoPublicavel}</td>
                                            <td className="py-4 px-4">
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                                                    item.grauSigilo === "Ultrassecreto"
                                                        ? "bg-rose-100 text-rose-800"
                                                        : item.grauSigilo === "Secreto"
                                                        ? "bg-amber-100 text-amber-800"
                                                        : "bg-blue-100 text-blue-800"
                                                }`}>
                                                    {item.grauSigilo}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-xs text-gray-600 max-w-xs">{item.fundamentoLegal}</td>
                                            <td className="py-4 px-4 text-xs text-gray-600">
                                                {new Date(item.dataClassificacao).toLocaleDateString("pt-BR")}
                                            </td>
                                            <td className="py-4 px-4 text-xs font-medium text-gray-700">
                                                <div>{item.prazoRestricaoAnos} anos</div>
                                                <div className="text-[11px] text-gray-500">
                                                    Até {new Date(item.dataPrevistaDesclassificacao).toLocaleDateString("pt-BR")}
                                                </div>
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
