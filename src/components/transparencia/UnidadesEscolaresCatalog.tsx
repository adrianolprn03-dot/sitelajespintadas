"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    FaArrowRight,
    FaBabyCarriage,
    FaBookOpen,
    FaCheckCircle,
    FaClock,
    FaDownload,
    FaGraduationCap,
    FaListOl,
    FaMapMarkerAlt,
    FaPhone,
    FaSchool,
    FaUserTie,
} from "react-icons/fa";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import { CriterioPrioridadeCreche } from "@/lib/educacao";
import { normalizeText, UnidadeComDetalhes } from "@/lib/unidades";

interface UnidadesEscolaresCatalogProps {
    unidades: UnidadeComDetalhes[];
    declaracao: {
        exercicio: number;
        textoDeclaracao: string;
        fundamentoLegal: string;
        orgaoResponsavel: string;
        responsavelNome: string | null;
        dataAtualizacao: string;
        arquivoAssinadoUrl: string | null;
    } | null;
    criterios: CriterioPrioridadeCreche[];
    filaAguardando: number;
}

export default function UnidadesEscolaresCatalog({
    unidades,
    declaracao,
    criterios,
    filaAguardando,
}: UnidadesEscolaresCatalogProps) {
    const [busca, setBusca] = useState("");
    const [tipoFiltro, setTipoFiltro] = useState<"todas" | "creche" | "escola">("todas");

    const filtradas = useMemo(() => {
        return unidades.filter((u) => {
            const sub = normalizeText(`${u.subtipo || ""} ${u.nome} ${u.descricao}`);
            if (tipoFiltro === "creche" && !sub.includes("creche") && !sub.includes("infantil")) {
                return false;
            }
            if (tipoFiltro === "escola" && (sub.includes("creche") && !sub.includes("escola"))) {
                return false;
            }
            if (!busca.trim()) return true;
            const q = normalizeText(busca);
            return (
                normalizeText(u.nome).includes(q) ||
                normalizeText(u.endereco).includes(q) ||
                normalizeText(u.servicos).includes(q) ||
                normalizeText(u.subtipo).includes(q) ||
                u.especialidades.some((e) => normalizeText(e).includes(q)) ||
                u.equipe.some((p) => normalizeText(p.nome).includes(q) || normalizeText(p.cargo).includes(q))
            );
        });
    }, [unidades, busca, tipoFiltro]);

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const rows = filtradas.map((u) => ({
            Unidade_Escolar: u.nome,
            Tipo: u.subtipo || u.tipo,
            INEP: u.cnes || "-",
            Endereco: u.endereco,
            Horario: u.horario,
            Contato: u.telefone || "-",
            Servicos_e_Turnos: u.servicos || "-",
            Etapas_Ensino: u.especialidades.join(", ") || "Educação Básica",
            Direcao_Coordenacao:
                u.equipe.map((e) => `${e.nome} (${e.cargo})`).join("; ") || "-",
        }));

        const filename = "unidades_escolares_e_creches_lajes_pintadas";
        const meta = {
            titulo: "Relação de Unidades Escolares, Creches, Etapas e Horários (PNTP 19.2)",
            fonte: "Secretaria Municipal de Educação",
            filtros: `Filtro=${tipoFiltro}${busca ? `, Busca=${busca}` : ""}`,
        };

        if (format === "csv") exportToCSV(rows, filename, meta);
        else if (format === "xlsx") exportToXLSX(rows, filename, meta);
        else if (format === "json") exportToJSON(rows, filename, meta);
        else exportToPDF(rows, filename, meta.titulo, meta);
    };

    return (
        <div className="space-y-8">
            {/* Declaração Oficial em Tempo Real (PNTP 19.2) */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <FaBabyCarriage size={22} />
                        </div>
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider">
                                    PNTP 2026 • Critério 19.2
                                </span>
                                {declaracao && (
                                    <span className="text-xs font-bold text-emerald-900">
                                        Exercício {declaracao.exercicio} • Atualizado em {declaracao.dataAtualizacao}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl font-black text-emerald-950">
                                {filaAguardando === 0
                                    ? "Vagas e Fila de Espera em Creches Públicas: Demanda 100% Atendida"
                                    : `Fila de Espera em Creches Públicas (${filaAguardando} inscrição(ões) aguardando)`}
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                        <Link
                            href="/transparencia/fila-creches"
                            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 transition"
                        >
                            Ver Declaração, Critérios e Protocolos <FaArrowRight size={10} />
                        </Link>
                        {declaracao?.arquivoAssinadoUrl && (
                            <a
                                href={declaracao.arquivoAssinadoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 text-xs font-bold flex items-center gap-2 transition"
                            >
                                <FaDownload /> Termo Assinado
                            </a>
                        )}
                    </div>
                </div>

                <p className="text-sm text-emerald-950 bg-white/80 rounded-2xl p-4 border border-emerald-200/70 leading-relaxed italic">
                    “
                    {declaracao?.textoDeclaracao ||
                        "A Secretaria Municipal de Educação declara o acompanhamento contínuo das matrículas nas creches e pré-escolas da rede pública municipal."}
                    ”
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900">
                    <span>
                        <FaListOl className="inline mr-1" />{" "}
                        <strong>{criterios.length} Critérios Legais de Priorização</strong> definidos para eventual sobreposição de demanda.
                    </span>
                    <Link
                        href="/transparencia/plano-educacao"
                        className="font-bold underline hover:text-emerald-700 inline-flex items-center gap-1"
                    >
                        <FaBookOpen size={11} /> Consultar PME e Relatório de Resultados (19.1)
                    </Link>
                </div>
            </div>

            {/* Filtros e Exportação */}
            <TransparencyFilters
                hideYearFilter
                hideMonthFilter
                searchValue={busca}
                onSearch={setBusca}
                onClear={() => {
                    setBusca("");
                    setTipoFiltro("todas");
                }}
                onExport={handleExport}
                placeholder="Pesquisar escola, creche, comunidade, etapa de ensino ou diretor(a)..."
            >
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 w-full">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                        Segmento:
                    </span>
                    {[
                        { id: "todas", label: `Todas (${unidades.length})` },
                        { id: "creche", label: "Creches / Educação Infantil" },
                        { id: "escola", label: "Escolas Municipais" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setTipoFiltro(tab.id as any)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition ${
                                tipoFiltro === tab.id
                                    ? "bg-[#1254A3] text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </TransparencyFilters>

            {/* Grid de Unidades Escolares */}
            {filtradas.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-14 text-center space-y-2">
                    <FaSchool className="mx-auto text-4xl text-slate-300" />
                    <h3 className="text-lg font-bold text-slate-800">Nenhuma unidade escolar encontrada</h3>
                    <p className="text-sm text-slate-500">
                        Ajuste sua pesquisa ou limpe os filtros acima para listar todas as unidades.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtradas.map((u) => (
                        <article
                            key={u.id}
                            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-4"
                        >
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#1254A3] flex items-center justify-center shrink-0">
                                        <FaGraduationCap size={20} />
                                    </div>
                                    <div className="flex flex-wrap justify-end gap-1.5">
                                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1254A3] text-[10px] font-bold">
                                            {u.subtipo || u.tipo}
                                        </span>
                                        {u.cnes && (
                                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                                                INEP {u.cnes}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <h3 className="font-black text-slate-900 text-base leading-snug">{u.nome}</h3>
                                <p className="text-xs text-slate-500">{u.descricao}</p>

                                {u.especialidades.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {u.especialidades.map((etapa, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold"
                                            >
                                                {etapa}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {u.servicos && (
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                                        <strong className="text-slate-800 block mb-0.5">Serviços / Atendimento:</strong>
                                        {u.servicos}
                                    </div>
                                )}

                                {u.equipe.length > 0 && (
                                    <div className="p-3 rounded-xl bg-blue-50/40 border border-blue-100 space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-[#1254A3] flex items-center gap-1">
                                            <FaUserTie /> Direção e Equipe Gestora
                                        </span>
                                        {u.equipe.map((p, idx) => (
                                            <div key={idx} className="text-xs text-slate-700">
                                                <strong>{p.nome}</strong> — {p.cargo}
                                                {p.diasHorarios ? ` (${p.diasHorarios})` : ""}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                                <div className="flex items-start gap-2">
                                    <FaMapMarkerAlt className="text-[#1254A3] shrink-0 mt-0.5" />
                                    <span>{u.endereco}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaClock className="text-emerald-600 shrink-0" />
                                    <span>{u.horario}</span>
                                </div>
                                {u.telefone && (
                                    <div className="flex items-center gap-2">
                                        <FaPhone className="text-cyan-600 shrink-0" />
                                        <span className="break-all">{u.telefone}</span>
                                    </div>
                                )}
                                <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                                    <span className="inline-flex items-center gap-1">
                                        <FaCheckCircle size={10} /> Unidade Ativa
                                    </span>
                                    {u.mapa && (
                                        <a
                                            href={u.mapa}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#1254A3] hover:underline"
                                        >
                                            Ver Mapa →
                                        </a>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
