"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    FaArrowRight,
    FaCapsules,
    FaCheckCircle,
    FaClock,
    FaFileMedical,
    FaHeartbeat,
    FaHospitalAlt,
    FaMapMarkerAlt,
    FaPhone,
    FaStethoscope,
    FaUserMd,
    FaUsers,
} from "react-icons/fa";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import { normalizeText, UnidadeComDetalhes } from "@/lib/unidades";

interface UnidadesSaudeCatalogProps {
    initialUnidades?: UnidadeComDetalhes[];
    compactNavigation?: boolean;
}

export default function UnidadesSaudeCatalog({
    initialUnidades,
    compactNavigation = false,
}: UnidadesSaudeCatalogProps) {
    const [unidades, setUnidades] = useState<UnidadeComDetalhes[]>(initialUnidades || []);
    const [loading, setLoading] = useState(!initialUnidades);
    const [busca, setBusca] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState<"todas" | "ubs" | "urgencia">("todas");

    useEffect(() => {
        if (initialUnidades) {
            setUnidades(initialUnidades);
            setLoading(false);
            return;
        }

        async function load() {
            setLoading(true);
            try {
                const res = await fetch("/api/unidades?tipo=saude", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    setUnidades(Array.isArray(data) ? data.filter((u) => u.ativa !== false) : []);
                }
            } catch {
                // fallback silencioso mantém lista vazia
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [initialUnidades]);

    const unidadesFiltradas = useMemo(() => {
        return unidades.filter((u) => {
            const subNorm = normalizeText(u.subtipo || u.descricao || u.nome);
            if (categoriaFiltro === "ubs" && (subNorm.includes("24h") || subNorm.includes("hospital") || subNorm.includes("mista"))) {
                return false;
            }
            if (
                categoriaFiltro === "urgencia" &&
                !subNorm.includes("24h") &&
                !subNorm.includes("hospital") &&
                !subNorm.includes("mista") &&
                !subNorm.includes("ums")
            ) {
                return false;
            }

            if (!busca.trim()) return true;
            const q = normalizeText(busca);
            return (
                normalizeText(u.nome).includes(q) ||
                normalizeText(u.subtipo).includes(q) ||
                normalizeText(u.endereco).includes(q) ||
                normalizeText(u.descricao).includes(q) ||
                normalizeText(u.servicos).includes(q) ||
                normalizeText(u.horario).includes(q) ||
                u.especialidades.some((e) => normalizeText(e).includes(q)) ||
                u.equipe.some(
                    (p) =>
                        normalizeText(p.nome).includes(q) ||
                        normalizeText(p.cargo).includes(q) ||
                        normalizeText(p.especialidade).includes(q) ||
                        normalizeText(p.registroProfissional).includes(q) ||
                        normalizeText(p.diasHorarios).includes(q)
                )
            );
        });
    }, [unidades, busca, categoriaFiltro]);

    const totalProfissionais = useMemo(
        () => unidades.reduce((acc, u) => acc + u.equipe.length, 0),
        [unidades]
    );

    const totalEspecialidadesDistintas = useMemo(() => {
        const set = new Set<string>();
        unidades.forEach((u) => u.especialidades.forEach((e) => set.add(e)));
        return set.size;
    }, [unidades]);

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const rows: Record<string, string | number>[] = [];

        unidadesFiltradas.forEach((u) => {
            if (u.equipe.length > 0) {
                u.equipe.forEach((prof) => {
                    rows.push({
                        Unidade: u.nome,
                        Categoria: u.subtipo || u.tipo,
                        CNES: u.cnes || "-",
                        Endereco: u.endereco,
                        Horario_Unidade: u.horario,
                        Telefone: u.telefone || "-",
                        Servicos_Disponiveis: u.servicos || "-",
                        Especialidades: u.especialidades.join(", ") || "-",
                        Profissional: prof.nome,
                        Cargo: prof.cargo,
                        Especialidade_Profissional: prof.especialidade || "-",
                        Registro_Conselho: prof.registroProfissional || "-",
                        Dias_Horarios_Atendimento: prof.diasHorarios || u.horario,
                    });
                });
            } else {
                rows.push({
                    Unidade: u.nome,
                    Categoria: u.subtipo || u.tipo,
                    CNES: u.cnes || "-",
                    Endereco: u.endereco,
                    Horario_Unidade: u.horario,
                    Telefone: u.telefone || "-",
                    Servicos_Disponiveis: u.servicos || "-",
                    Especialidades: u.especialidades.join(", ") || "-",
                    Profissional: "Escala em atualização",
                    Cargo: "-",
                    Especialidade_Profissional: "-",
                    Registro_Conselho: "-",
                    Dias_Horarios_Atendimento: u.horario,
                });
            }
        });

        const filename = "unidades_saude_servicos_profissionais_pntp_18_2";
        const meta = {
            titulo: "Relação de Unidades de Saúde, Serviços, Especialidades e Profissionais (PNTP 18.2)",
            fonte: "Secretaria Municipal de Saúde",
            filtros: `Categoria=${categoriaFiltro}${busca ? `, Busca=${busca}` : ""}`,
        };

        if (format === "csv") exportToCSV(rows, filename, meta);
        else if (format === "xlsx") exportToXLSX(rows, filename, meta);
        else if (format === "json") exportToJSON(rows, filename, meta);
        else exportToPDF(rows, filename, meta.titulo, meta);
    };

    return (
        <div className="space-y-8">
            {/* Indicadores Rápidos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <FaHospitalAlt size={20} />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                            Unidades Ativas
                        </span>
                        <span className="text-2xl font-black text-slate-900">{unidades.length}</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1254A3] flex items-center justify-center shrink-0">
                        <FaUserMd size={20} />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                            Profissionais em Escala
                        </span>
                        <span className="text-2xl font-black text-slate-900">{totalProfissionais}</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                        <FaStethoscope size={20} />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                            Especialidades & Áreas
                        </span>
                        <span className="text-2xl font-black text-slate-900">{totalEspecialidadesDistintas}</span>
                    </div>
                </div>
            </div>

            {/* Filtros de Pesquisa e Exportação PNTP */}
            <div>
                <TransparencyFilters
                    hideYearFilter
                    hideMonthFilter
                    searchValue={busca}
                    onSearch={setBusca}
                    onClear={() => {
                        setBusca("");
                        setCategoriaFiltro("todas");
                    }}
                    onExport={handleExport}
                    placeholder="Pesquisar por unidade, médico, enfermeiro, dentista, CRM/COREN, especialidade ou bairro..."
                >
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 w-full">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                            Tipo de Unidade:
                        </span>
                        {[
                            { id: "todas", label: "Todas as Unidades" },
                            { id: "ubs", label: "UBS / Atenção Básica (ESF)" },
                            { id: "urgencia", label: "UMS / Urgência 24h / Hospital" },
                        ].map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setCategoriaFiltro(cat.id as any)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                                    categoriaFiltro === cat.id
                                        ? "bg-[#1254A3] text-white shadow-sm"
                                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </TransparencyFilters>
            </div>

            {/* Lista de Unidades */}
            {loading ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-500">
                    Carregando unidades de saúde, serviços e escalas de profissionais...
                </div>
            ) : unidadesFiltradas.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-16 text-center space-y-2">
                    <FaHospitalAlt className="mx-auto text-4xl text-slate-300" />
                    <h3 className="text-lg font-bold text-slate-800">
                        Nenhuma unidade de saúde encontrada
                    </h3>
                    <p className="text-sm text-slate-500">
                        {unidades.length === 0
                            ? "Não há unidades de saúde ativas cadastradas no momento."
                            : "Tente limpar ou ajustar o termo pesquisado acima."}
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {unidadesFiltradas.map((u) => (
                        <article
                            key={u.id}
                            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden"
                        >
                            {/* Barra superior da unidade */}
                            <div className="bg-gradient-to-r from-[#0F2942] to-[#1254A3] text-white p-6 md:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[11px] font-bold uppercase tracking-wider">
                                            {u.subtipo || u.tipo}
                                        </span>
                                        {u.cnes && (
                                            <span className="px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-100 text-[11px] font-mono font-bold">
                                                CNES {u.cnes}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold">
                                            <FaCheckCircle size={10} /> Unidade Ativa
                                        </span>
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-black tracking-tight">{u.nome}</h2>
                                    <p className="text-sm text-blue-100 max-w-3xl">{u.descricao}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 shrink-0 text-xs text-blue-100">
                                    <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl font-semibold">
                                        <FaUsers /> {u.equipe.length}{" "}
                                        {u.equipe.length === 1 ? "profissional listado" : "profissionais listados"}
                                    </span>
                                    {u.atualizadoEm && (
                                        <span className="text-[11px] opacity-80">
                                            Atualizado em{" "}
                                            {new Date(u.atualizadoEm).toLocaleDateString("pt-BR")}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Corpo do card */}
                            <div className="p-6 md:p-8 space-y-6">
                                {/* Endereço, Horário, Contatos */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                                        <FaMapMarkerAlt className="text-[#1254A3] mt-1 shrink-0" />
                                        <div className="text-xs">
                                            <span className="font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                                                Localização
                                            </span>
                                            <p className="font-semibold text-slate-800">{u.endereco}</p>
                                            {u.mapa && (
                                                <a
                                                    href={u.mapa}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[#1254A3] font-bold hover:underline mt-1"
                                                >
                                                    Ver no Mapa <FaArrowRight size={9} />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                                        <FaClock className="text-emerald-600 mt-1 shrink-0" />
                                        <div className="text-xs">
                                            <span className="font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                                                Horário de Atendimento
                                            </span>
                                            <p className="font-semibold text-slate-800">{u.horario}</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                                        <FaPhone className="text-cyan-600 mt-1 shrink-0" />
                                        <div className="text-xs">
                                            <span className="font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                                                Telefone / E-mail
                                            </span>
                                            <p className="font-semibold text-slate-800 break-words">
                                                {u.telefone || "Secretaria Municipal de Saúde"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Serviços e Especialidades */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                                    <div className="lg:col-span-7 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                                        <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                                            <FaHeartbeat className="text-emerald-600" /> Serviços Disponíveis na Unidade
                                        </h3>
                                        <p className="text-sm text-slate-700 leading-relaxed">
                                            {u.servicos ||
                                                "Atendimento ambulatorial de Atenção Primária à Saúde, consultas, acolhimento de enfermagem e procedimentos básicos do SUS."}
                                        </p>
                                    </div>

                                    <div className="lg:col-span-5 p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2.5">
                                        <h3 className="text-xs font-black uppercase tracking-wider text-[#1254A3] flex items-center gap-2">
                                            <FaStethoscope /> Especialidades Ofertadas
                                        </h3>
                                        {u.especialidades.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {u.especialidades.map((esp, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 rounded-xl bg-white border border-blue-200 text-xs font-bold text-[#1254A3]"
                                                    >
                                                        {esp}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-500 italic">
                                                Clínica Geral / Atenção Básica.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Tabela de Profissionais e Escalas (PNTP 18.2) */}
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                                            <FaUserMd className="text-[#1254A3]" /> Profissionais Prestadores de Serviços, Especialidades e Escalas de Atendimento
                                        </h3>
                                        <span className="text-[11px] font-bold text-slate-500">
                                            Critério PNTP 2026 - Item 18.2
                                        </span>
                                    </div>

                                    {u.equipe.length === 0 ? (
                                        <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500">
                                            Escala detalhada em atualização junto à Secretaria Municipal de Saúde.
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto rounded-2xl border border-slate-200">
                                            <table className="w-full text-left text-xs md:text-sm">
                                                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-200">
                                                    <tr>
                                                        <th className="py-3 px-4">Profissional</th>
                                                        <th className="py-3 px-4">Cargo / Função</th>
                                                        <th className="py-3 px-4">Especialidade</th>
                                                        <th className="py-3 px-4">Registro Conselho</th>
                                                        <th className="py-3 px-4">Dias e Horários</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {u.equipe.map((prof, idx) => (
                                                        <tr key={idx} className="hover:bg-blue-50/30 transition">
                                                            <td className="py-3 px-4 font-bold text-slate-900">
                                                                {prof.nome}
                                                            </td>
                                                            <td className="py-3 px-4 text-slate-700 font-medium">
                                                                {prof.cargo}
                                                            </td>
                                                            <td className="py-3 px-4 text-slate-600">
                                                                {prof.especialidade || "-"}
                                                            </td>
                                                            <td className="py-3 px-4 font-mono text-xs text-slate-700">
                                                                {prof.registroProfissional || "-"}
                                                            </td>
                                                            <td className="py-3 px-4 font-semibold text-[#1254A3]">
                                                                {prof.diasHorarios || u.horario}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Links Relacionados da Saúde PNTP 18.1 - 18.6 */}
            {!compactNavigation && (
                <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-sky-400 block mb-1">
                            Transparência Integral da Saúde (PNTP Dimensão 18)
                        </span>
                        <h3 className="text-lg font-bold">
                            Consulte também Medicamentos SUS, Regulação, Planos de Saúde e Conselho
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/transparencia/medicamentos-sus"
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition"
                        >
                            <FaCapsules /> Medicamentos SUS (18.4 / 18.5)
                        </Link>
                        <Link
                            href="/transparencia/central-regulacao"
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition"
                        >
                            <FaHeartbeat /> Regulação (18.3)
                        </Link>
                        <Link
                            href="/transparencia/plano-saude"
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition"
                        >
                            <FaFileMedical /> PMS / PAS / RAG (18.1)
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
