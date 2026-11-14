"use client";

import { useMemo, useState } from "react";
import {
    FaAmbulance,
    FaCalendarAlt,
    FaCheckCircle,
    FaClock,
    FaExternalLinkAlt,
    FaFileAlt,
    FaFlask,
    FaHeartbeat,
    FaInfoCircle,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaStethoscope,
    FaUserMd,
} from "react-icons/fa";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import { normalizeText } from "@/lib/unidades";

export interface ProtocoloRegulacaoPublico {
    protocolo: string;
    iniciais: string;
    dataSolicitacao: string;
    especialidade: string;
    unidadeSolicitante?: string;
    prioridade: string;
    status: string;
}

export interface CentralRegulacaoItemPublico {
    id: string;
    tipo: string;
    totalPacientes: number;
    tempoEspera: string;
    procedimentos: string | null;
    competencia: string | null;
    protocolosLista: ProtocoloRegulacaoPublico[];
    icone: string;
    cor: string;
    atualizadoEm: string;
}

export interface CentralRegulacaoConfigPublico {
    titulo: string;
    subtitulo: string | null;
    comoFunciona: string | null;
    telefone: string | null;
    horarioFuncionamento: string | null;
    endereco: string | null;
    linkSistemaExterno: string | null;
    documentoRegulamento: string | null;
    atualizadoEm?: string;
}

function renderIcon(name: string) {
    switch (name) {
        case "FaFlask":
            return <FaFlask size={22} />;
        case "FaStethoscope":
            return <FaStethoscope size={22} />;
        case "FaAmbulance":
            return <FaAmbulance size={22} />;
        case "FaHeartbeat":
            return <FaHeartbeat size={22} />;
        default:
            return <FaUserMd size={22} />;
    }
}

export default function CentralRegulacaoClient({
    itens,
    config,
}: {
    itens: CentralRegulacaoItemPublico[];
    config: CentralRegulacaoConfigPublico;
}) {
    const [busca, setBusca] = useState("");
    const [tipoFiltro, setTipoFiltro] = useState("todos");

    const categorias = useMemo(
        () => Array.from(new Set(itens.map((i) => i.tipo))).filter(Boolean),
        [itens]
    );

    const itensFiltrados = useMemo(() => {
        return itens.filter((item) => {
            if (tipoFiltro !== "todos" && item.tipo !== tipoFiltro) return false;
            if (!busca.trim()) return true;
            const q = normalizeText(busca);
            return (
                normalizeText(item.tipo).includes(q) ||
                normalizeText(item.procedimentos).includes(q) ||
                normalizeText(item.competencia).includes(q) ||
                normalizeText(item.tempoEspera).includes(q) ||
                item.protocolosLista.some(
                    (p) =>
                        normalizeText(p.protocolo).includes(q) ||
                        normalizeText(p.iniciais).includes(q) ||
                        normalizeText(p.especialidade).includes(q)
                )
            );
        });
    }, [itens, busca, tipoFiltro]);

    const todosProtocolos = useMemo(() => {
        const list: Array<ProtocoloRegulacaoPublico & { categoria: string; competencia?: string | null }> = [];
        itensFiltrados.forEach((item) => {
            item.protocolosLista.forEach((p) => {
                if (
                    !busca.trim() ||
                    normalizeText(p.protocolo).includes(normalizeText(busca)) ||
                    normalizeText(p.iniciais).includes(normalizeText(busca)) ||
                    normalizeText(p.especialidade).includes(normalizeText(busca)) ||
                    normalizeText(item.tipo).includes(normalizeText(busca))
                ) {
                    list.push({
                        ...p,
                        categoria: item.tipo,
                        competencia: item.competencia,
                    });
                }
            });
        });
        return list;
    }, [itensFiltrados, busca]);

    const totalPacientesGeral = useMemo(
        () => itensFiltrados.reduce((acc, item) => acc + item.totalPacientes, 0),
        [itensFiltrados]
    );

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const rows =
            todosProtocolos.length > 0
                ? todosProtocolos.map((p, idx) => ({
                      Posicao: idx + 1,
                      Protocolo_LGPD: p.protocolo,
                      Iniciais: p.iniciais || "-",
                      Categoria: p.categoria,
                      Especialidade_Exame: p.especialidade,
                      Data_Solicitacao: p.dataSolicitacao,
                      Prioridade: p.prioridade,
                      Status: p.status,
                      Competencia: p.competencia || "-",
                  }))
                : itensFiltrados.length > 0
                ? itensFiltrados.map((item) => ({
                      Categoria_Fila: item.tipo,
                      Pacientes_Aguardando: item.totalPacientes,
                      Tempo_Medio_Espera: item.tempoEspera,
                      Procedimentos_Abrangidos: item.procedimentos || "-",
                      Competencia: item.competencia || "-",
                      Atualizado_Em: new Date(item.atualizadoEm).toLocaleDateString("pt-BR"),
                  }))
                : [
                      {
                          Situacao: "Nenhuma fila de espera reprimida cadastrada na competência atual",
                          Orgao: config.endereco || "Secretaria Municipal de Saúde",
                          Contato: config.telefone || "-",
                      },
                  ];

        const filename = "central_regulacao_lista_espera_pntp_18_3";
        const meta = {
            titulo: "Central de Regulação em Saúde - Lista de Espera (PNTP 18.3)",
            fonte: "Secretaria Municipal de Saúde",
            filtros: `Categoria=${tipoFiltro}${busca ? `, Busca=${busca}` : ""}`,
        };

        if (format === "csv") exportToCSV(rows, filename, meta);
        else if (format === "xlsx") exportToXLSX(rows, filename, meta);
        else if (format === "json") exportToJSON(rows, filename, meta);
        else exportToPDF(rows, filename, meta.titulo, meta);
    };

    return (
        <div className="space-y-8">
            {/* Resumo Situacional */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Categorias / Especialidades Monitoradas
                    </span>
                    <span className="text-2xl font-black text-[#1254A3]">{itens.length}</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Pacientes em Acompanhamento (Filtrado)
                    </span>
                    <span className="text-2xl font-black text-rose-600">{totalPacientesGeral}</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Privacidade e Ordem Cronológica
                    </span>
                    <span className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 mt-1">
                        <FaCheckCircle /> Anonimização LGPD Ativa
                    </span>
                </div>
            </div>

            {/* Filtros de Pesquisa e Exportação PNTP 18.3 */}
            <TransparencyFilters
                hideYearFilter
                hideMonthFilter
                searchValue={busca}
                onSearch={setBusca}
                onClear={() => {
                    setBusca("");
                    setTipoFiltro("todos");
                }}
                onExport={handleExport}
                placeholder="Pesquisar por especialidade, exame, cirurgia, protocolo ou iniciais..."
            >
                {categorias.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 w-full">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                            Filtrar Fila:
                        </span>
                        <button
                            type="button"
                            onClick={() => setTipoFiltro("todos")}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                                tipoFiltro === "todos"
                                    ? "bg-rose-600 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            Todas ({itens.length})
                        </button>
                        {categorias.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setTipoFiltro(cat)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                                    tipoFiltro === cat
                                        ? "bg-rose-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </TransparencyFilters>

            {/* Cards das Filas ou Aviso Oficial */}
            {itensFiltrados.length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 md:p-10 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                        <FaCheckCircle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-950">
                        {itens.length === 0
                            ? "Sem Fila Reprimida Cadastrada no Painel no Momento"
                            : "Nenhum procedimento encontrado com o filtro selecionado"}
                    </h3>
                    <p className="text-sm text-emerald-900 max-w-2xl mx-auto leading-relaxed">
                        {itens.length === 0
                            ? "Os encaminhamentos médicos para consultas especializadas, exames diagnósticos e procedimentos eletivos estão sendo regulados continuamente junto às unidades de referência e sistemas oficiais (SISREG / Regula RN)."
                            : "Limpe o termo de busca ou selecione 'Todas' para visualizar as demais filas."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {itensFiltrados.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
                        >
                            <div className={`h-2.5 bg-gradient-to-r ${item.cor || "from-blue-500 to-indigo-600"}`} />
                            <div className="p-6 md:p-7 space-y-5 flex-1">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3.5">
                                        <div
                                            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
                                                item.cor || "from-blue-500 to-indigo-600"
                                            } text-white flex items-center justify-center shrink-0 shadow-md`}
                                        >
                                            {renderIcon(item.icone)}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 text-lg leading-snug">
                                                {item.tipo}
                                            </h3>
                                            {item.competencia && (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                                                    <FaCalendarAlt size={10} /> Referência: {item.competencia}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-400">
                                        Atualizado {new Date(item.atualizadoEm).toLocaleDateString("pt-BR")}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                                            Pacientes em Fila
                                        </span>
                                        <span className="text-3xl font-black text-slate-900">
                                            {item.totalPacientes}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                                            Tempo Médio de Espera
                                        </span>
                                        <span className="text-sm font-bold text-[#1254A3] block mt-1.5">
                                            {item.tempoEspera}
                                        </span>
                                    </div>
                                </div>

                                {item.procedimentos && (
                                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed">
                                        <strong className="text-[#1254A3] uppercase tracking-wider block mb-1">
                                            Especialidades / Procedimentos Abrangidos:
                                        </strong>
                                        {item.procedimentos}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tabela Individual Anonimizada de Protocolos (quando cadastrados) */}
            {todosProtocolos.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Lista Nominal Anonimizada de Espera na Regulação (LGPD)
                            </h3>
                            <p className="text-xs text-slate-500">
                                Identificação por número de protocolo e iniciais em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
                            </p>
                        </div>
                        <span className="text-xs font-bold bg-rose-50 text-rose-700 px-3 py-1 rounded-full">
                            {todosProtocolos.length} protocolo(s)
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs md:text-sm">
                            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Ordem</th>
                                    <th className="py-3 px-4">Protocolo</th>
                                    <th className="py-3 px-4">Iniciais</th>
                                    <th className="py-3 px-4">Tipo de Fila</th>
                                    <th className="py-3 px-4">Especialidade / Exame</th>
                                    <th className="py-3 px-4">Data Solicitação</th>
                                    <th className="py-3 px-4">Prioridade</th>
                                    <th className="py-3 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {todosProtocolos.map((p, idx) => (
                                    <tr key={`${p.protocolo}-${idx}`} className="hover:bg-slate-50">
                                        <td className="py-3 px-4 font-bold text-slate-700">#{idx + 1}</td>
                                        <td className="py-3 px-4 font-mono font-bold text-rose-700">
                                            {p.protocolo}
                                        </td>
                                        <td className="py-3 px-4 font-semibold">{p.iniciais || "-"}</td>
                                        <td className="py-3 px-4 text-slate-600">{p.categoria}</td>
                                        <td className="py-3 px-4 font-medium text-slate-900">
                                            {p.especialidade}
                                        </td>
                                        <td className="py-3 px-4 text-slate-600">{p.dataSolicitacao}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                                                {p.prioridade}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800">
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Bloco Informativo e Contatos da Regulação */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-3">
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <FaInfoCircle className="text-rose-600" /> Como Funciona a Regulação Municipal
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {config.comoFunciona ||
                            "A Central de Regulação de Saúde organiza o encaminhamento equânime dos pacientes da atenção primária para consultas especializadas, exames de média e alta complexidade e procedimentos eletivos."}
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        {config.linkSistemaExterno && (
                            <a
                                href={config.linkSistemaExterno}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition"
                            >
                                Acessar Portal Oficial de Regulação <FaExternalLinkAlt size={10} />
                            </a>
                        )}
                        {config.documentoRegulamento && (
                            <a
                                href={config.documentoRegulamento}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                            >
                                <FaFileAlt /> Norma / Fluxo de Regulação
                            </a>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
                    <h3 className="text-base font-black uppercase tracking-tight">
                        Atendimento ao Cidadão na Regulação
                    </h3>
                    <div className="space-y-3 text-sm text-slate-200">
                        <div className="flex items-start gap-3">
                            <FaMapMarkerAlt className="text-rose-400 mt-1 shrink-0" />
                            <span>{config.endereco || "Secretaria Municipal de Saúde"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaClock className="text-rose-400 shrink-0" />
                            <span>{config.horarioFuncionamento || "Segunda a Sexta, 07h às 13h"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaPhoneAlt className="text-rose-400 shrink-0" />
                            <span>{config.telefone || "(84) 98796-9881"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
