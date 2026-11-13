"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import {
    FaGraduationCap,
    FaCalendarAlt,
    FaShieldAlt,
    FaCheckCircle,
    FaFilePdf,
    FaSchool,
    FaMapMarkerAlt,
    FaClock,
    FaPhone,
    FaInfoCircle,
    FaSearch,
    FaUserCheck,
    FaListOl,
    FaSpinner,
    FaExclamationCircle
} from "react-icons/fa";

type FilaItem = {
    id: string;
    protocoloAnonimizado: string;
    iniciaisCrianca: string;
    dataNascimentoMesAno: string;
    unidadeEscolar: string;
    turmaEtapa: string;
    criterioPrioridade: string;
    posicaoFila: number;
    dataInscricao: string;
    status: string;
    ano: number;
};

type Unidade = {
    id: string;
    nome: string;
    tipo: string;
    descricao: string;
    endereco: string;
    telefone: string | null;
    horario: string;
};

type CriterioPrioridade = {
    ordem: number;
    titulo: string;
    fundamento: string;
    descricao: string;
};

type Declaracao = {
    id: string;
    modulo: string;
    criterioPntp?: string;
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

export default function FilaCrechesPage() {
    const [loading, setLoading] = useState(true);
    const [declaracao, setDeclaracao] = useState<Declaracao | null>(null);
    const [criterios, setCriterios] = useState<CriterioPrioridade[]>([]);
    const [unidades, setUnidades] = useState<Unidade[]>([]);
    const [fila, setFila] = useState<FilaItem[]>([]);
    const [ano, setAno] = useState("2026");
    const [busca, setBusca] = useState("");
    const [abaAtiva, setAbaAtiva] = useState<"declaracao" | "criterios" | "fila" | "unidades">("declaracao");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/transparencia/fila-creches?ano=${ano}`);
            const data = await res.json();
            if (data.sucesso) {
                setDeclaracao(data.declaracao);
                setCriterios(data.criteriosPrioridade || []);
                setUnidades(data.unidades || []);
                setFila(data.fila || []);
            }
        } catch (error) {
            console.error("Erro ao carregar fila de creches:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [ano]);

    const itensFiltrados = fila.filter((item) => {
        const termo = busca.toLowerCase();
        return (
            !busca ||
            item.protocoloAnonimizado.toLowerCase().includes(termo) ||
            item.iniciaisCrianca.toLowerCase().includes(termo) ||
            item.unidadeEscolar.toLowerCase().includes(termo) ||
            item.turmaEtapa.toLowerCase().includes(termo)
        );
    });

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = itensFiltrados.length > 0
            ? itensFiltrados.map((i) => ({
                "Posição": i.posicaoFila,
                "Protocolo": i.protocoloAnonimizado,
                "Iniciais": i.iniciaisCrianca,
                "Unidade Escolar": i.unidadeEscolar,
                "Etapa/Turma": i.turmaEtapa,
                "Critério": i.criterioPrioridade,
                "Data Inscrição": new Date(i.dataInscricao).toLocaleDateString("pt-BR"),
                "Situação": i.status
            }))
            : [{
                "Situação": "Sem Fila Reprimida",
                "Município": "Lajes Pintadas/RN",
                "Exercício": ano,
                "Mensagem": "Demanda 100% atendida pela rede pública de educação infantil. Inexistência de fila de espera."
            }];

        const filename = `fila_creches_lajes_pintadas_${ano}`;
        const title = `Fila de Espera em Creches e Educação Infantil – Lajes Pintadas/RN (${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <PageHeader
                title="Fila de Creches e Educação Infantil"
                subtitle="Critérios de prioridade, unidades de ensino, acompanhamento de demanda e declaração oficial de atendimento integral."
                icon={<FaGraduationCap className="w-8 h-8 text-[#1254A3]" />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Fila de Creches" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Banner de Conformidade PNTP */}
                <BannerPNTP
                    criterio="19.2"
                    requisito="Divulga a lista de espera para vagas nas creches públicas, contendo a data da solicitação, critérios de priorização de acesso e data da última atualização?"
                    status="Atende com Declaração Oficial de Inexistência"
                />

                {/* Abas de Navegação */}
                <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
                    <button
                        onClick={() => setAbaAtiva("declaracao")}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                            abaAtiva === "declaracao"
                                ? "bg-[#1254A3] text-white shadow-md shadow-blue-900/10"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                    >
                        <FaShieldAlt className="w-4 h-4" />
                        Declaração Oficial (Demanda 100% Atendida)
                    </button>
                    <button
                        onClick={() => setAbaAtiva("criterios")}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                            abaAtiva === "criterios"
                                ? "bg-[#1254A3] text-white shadow-md shadow-blue-900/10"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                    >
                        <FaListOl className="w-4 h-4" />
                        Critérios Oficiais de Prioridade
                    </button>
                    <button
                        onClick={() => setAbaAtiva("fila")}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                            abaAtiva === "fila"
                                ? "bg-[#1254A3] text-white shadow-md shadow-blue-900/10"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                    >
                        <FaSearch className="w-4 h-4" />
                        Consulta Pública da Demanda
                    </button>
                    <button
                        onClick={() => setAbaAtiva("unidades")}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                            abaAtiva === "unidades"
                                ? "bg-[#1254A3] text-white shadow-md shadow-blue-900/10"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                    >
                        <FaSchool className="w-4 h-4" />
                        Unidades de Ensino Infantil
                    </button>
                </div>

                {/* ABA 1: DECLARAÇÃO OFICIAL */}
                {abaAtiva === "declaracao" && (
                    <div className="space-y-6">
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
                                                Programa Nacional de Transparência Pública • Critério PNTP
                                            </span>
                                            <h2 className="text-xl sm:text-2xl font-black text-white">
                                                Declaração Oficial de Inexistência de Fila de Espera
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs font-semibold text-white">
                                        <FaCalendarAlt className="text-amber-300" />
                                        <span>Atualização Oficial: <strong>{declaracao?.dataConferencia ? new Date(declaracao.dataConferencia).toLocaleDateString("pt-BR") : "01/06/2026"}</strong></span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">
                                        {declaracao?.orgaoResponsavel || "Secretaria Municipal de Educação, Cultura e Desportos de Lajes Pintadas/RN"}
                                    </p>

                                    <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl border-l-4 border-amber-400 border border-white/15 text-white shadow-inner">
                                        <p className="text-base sm:text-lg leading-relaxed font-medium">
                                            “{declaracao?.textoDeclaracao || "A Prefeitura Municipal de Lajes Pintadas/RN declara que não dispôs de fila de espera para matrícula em creches públicas no âmbito municipal nos exercícios de 2023, 2024, 2025 e 2026 (até a presente data). Todas as vagas demandadas na educação infantil foram 100% atendidas."}”
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-100 pt-2">
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                            <strong className="text-amber-300 block mb-1">Fundamentação Legal:</strong>
                                            <span>{declaracao?.fundamentoLegal || "Lei nº 9.394/96 (LDB), Lei nº 11.700/08 e Lei de Acesso à Informação nº 12.527/11."}</span>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                            <strong className="text-amber-300 block mb-1">Autoridade Certificadora:</strong>
                                            <span>{declaracao?.responsavelNome || "Secretaria Municipal de Educação"} ({declaracao?.responsavelCargo || "Secretário(a) Municipal"})</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-wrap gap-4">
                                    <button
                                        onClick={() => {
                                            const payload = [{
                                                "Documento": "Declaração Oficial de Inexistência de Fila em Creches",
                                                "Órgão": declaracao?.orgaoResponsavel,
                                                "Exercícios": "2023, 2024, 2025 e 2026",
                                                "Situação": "Demanda 100% Atendida - Sem Fila de Espera",
                                                "Fundamento": declaracao?.fundamentoLegal,
                                                "Data": new Date().toLocaleDateString("pt-BR")
                                            }];
                                            exportToPDF(payload, "declaracao_oficial_fila_creches_lajes_pintadas", "Declaração Oficial de Inexistência de Fila de Espera em Creches - Lajes Pintadas/RN");
                                        }}
                                        className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20 text-sm cursor-pointer"
                                    >
                                        <FaFilePdf className="w-4 h-4 text-slate-950" />
                                        Baixar Declaração Oficial em PDF
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card explicativo sobre a garantia de vagas */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1254A3] flex items-center justify-center font-bold">
                                    100%
                                </div>
                                <h3 className="font-bold text-gray-900 text-base">Atendimento Imediato</h3>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Todas as crianças de 0 a 5 anos residentes no município contam com vaga assegurada nas creches e escolas municipais.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
                                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold">
                                    <FaCalendarAlt />
                                </div>
                                <h3 className="font-bold text-gray-900 text-base">Matrícula Contínua</h3>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    A solicitação de matrícula pode ser realizada durante todo o ano letivo na sede da Secretaria ou diretamente na unidade escolar.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                                    <FaShieldAlt />
                                </div>
                                <h3 className="font-bold text-gray-900 text-base">Controle e Auditoria</h3>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    A conformidade é monitorada em tempo real pela Controladoria Geral do Município e auditada pelo PNTP (Atricon / TCE-RN).
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ABA 2: CRITÉRIOS DE PRIORIDADE */}
                {abaAtiva === "criterios" && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <FaListOl className="text-[#1254A3]" />
                                Critérios Legais de Priorização de Acesso
                            </h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Conforme determinação do art. 53 do ECA, da Lei de Diretrizes e Bases da Educação Nacional (Lei Federal nº 9.394/1996) e da Resolução do Conselho Municipal de Educação, caso ocorra pontual sobreposição de demanda em determinada unidade, a ordem de prioridade para concessão e alocação de vagas observará estritamente os seguintes critérios:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {criterios.map((c) => (
                                    <div key={c.ordem} className="p-6 rounded-2xl border border-gray-200 bg-[#FAFBFD] space-y-3 hover:border-blue-300 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-[#1254A3] text-white flex items-center justify-center font-bold text-sm shrink-0">
                                                {c.ordem}º
                                            </span>
                                            <h3 className="font-bold text-gray-900 text-base">{c.titulo}</h3>
                                        </div>
                                        <p className="text-xs font-semibold text-[#1254A3] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 inline-block">
                                            {c.fundamento}
                                        </p>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                            {c.descricao}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ABA 3: CONSULTA PÚBLICA DA DEMANDA / FILA */}
                {abaAtiva === "fila" && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Consulta de Inscrições e Fila por Exercício</h2>
                                <p className="text-sm text-gray-500">
                                    Pesquise o protocolo anônimo do requerimento de matrícula ou filtre por exercício.
                                </p>
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
                                    <span>Consultando base oficial de matrículas...</span>
                                </div>
                            ) : itensFiltrados.length === 0 ? (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                                        <FaCheckCircle />
                                    </div>
                                    <div className="max-w-xl mx-auto space-y-2">
                                        <h3 className="text-lg font-bold text-emerald-900">
                                            Nenhuma Criança Aguardando em Fila de Espera no Exercício de {ano}
                                        </h3>
                                        <p className="text-sm text-emerald-800 leading-relaxed">
                                            A rede municipal de educação de Lajes Pintadas/RN atendeu a 100% das solicitações registradas para o ano de {ano}. Todas as matrículas foram efetivadas diretamente nas creches e escolas municipais sem formação de lista de espera.
                                        </p>
                                    </div>
                                    <div className="pt-2">
                                        <button
                                            onClick={() => setAbaAtiva("unidades")}
                                            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-900 bg-white border border-emerald-300 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors"
                                        >
                                            <FaSchool />
                                            Ver Unidades com Vagas Disponíveis
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                                                <th className="py-4 px-4">Posição</th>
                                                <th className="py-4 px-4">Protocolo</th>
                                                <th className="py-4 px-4">Iniciais</th>
                                                <th className="py-4 px-4">Unidade Solicitada</th>
                                                <th className="py-4 px-4">Etapa/Turma</th>
                                                <th className="py-4 px-4">Critério Prioridade</th>
                                                <th className="py-4 px-4">Data Inscrição</th>
                                                <th className="py-4 px-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {itensFiltrados.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-4 font-black text-[#1254A3]">#{item.posicaoFila}</td>
                                                    <td className="py-4 px-4 font-mono font-bold text-gray-800">{item.protocoloAnonimizado}</td>
                                                    <td className="py-4 px-4 font-semibold text-gray-700">{item.iniciaisCrianca}</td>
                                                    <td className="py-4 px-4 text-gray-700">{item.unidadeEscolar}</td>
                                                    <td className="py-4 px-4 text-gray-700">{item.turmaEtapa}</td>
                                                    <td className="py-4 px-4 text-xs text-gray-600">{item.criterioPrioridade}</td>
                                                    <td className="py-4 px-4 text-xs text-gray-600">
                                                        {new Date(item.dataInscricao).toLocaleDateString("pt-BR")}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                            item.status === "matriculado"
                                                                ? "bg-green-100 text-green-800"
                                                                : item.status === "convocado"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : "bg-amber-100 text-amber-800"
                                                        }`}>
                                                            {item.status === "matriculado" ? "Matriculado" : item.status === "convocado" ? "Convocado" : "Aguardando"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ABA 4: UNIDADES ESCOLARES / CRECHES */}
                {abaAtiva === "unidades" && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <FaSchool className="text-[#1254A3]" />
                                Creches e Escolas Municipais da Rede Básica
                            </h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Relação completa de unidades onde os pais ou responsáveis podem comparecer para realização da matrícula e acompanhamento do ano letivo.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {unidades.map((u) => (
                                    <div key={u.id} className="p-6 rounded-2xl border border-gray-200 bg-[#FAFBFD] space-y-4 flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1254A3] flex items-center justify-center font-bold text-xl">
                                                <FaSchool />
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-base leading-snug">{u.nome}</h3>
                                            <p className="text-xs text-gray-500 italic">{u.descricao || "Unidade de Ensino Municipal"}</p>
                                        </div>

                                        <div className="space-y-2 text-xs text-gray-600 border-t border-gray-200 pt-3">
                                            <div className="flex items-start gap-2">
                                                <FaMapMarkerAlt className="text-[#1254A3] shrink-0 mt-0.5" />
                                                <span>{u.endereco}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaClock className="text-[#1254A3] shrink-0" />
                                                <span>{u.horario}</span>
                                            </div>
                                            {u.telefone && (
                                                <div className="flex items-center gap-2">
                                                    <FaPhone className="text-[#1254A3] shrink-0" />
                                                    <span>{u.telefone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

