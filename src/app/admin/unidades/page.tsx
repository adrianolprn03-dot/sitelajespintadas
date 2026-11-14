"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    FaClock,
    FaClinicMedical,
    FaEdit,
    FaMapMarkerAlt,
    FaPhone,
    FaPlus,
    FaSearch,
    FaSpinner,
    FaSyncAlt,
    FaTrash,
    FaUserMd,
} from "react-icons/fa";
import { isEducacaoTipo, isSaudeTipo, normalizeText, UnidadeComDetalhes } from "@/lib/unidades";

export default function AdminUnidadesPage() {
    const [unidades, setUnidades] = useState<UnidadeComDetalhes[]>([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [filtroTipo, setFiltroTipo] = useState<"todos" | "saude" | "educacao" | "social" | "cultura">("todos");
    const [busca, setBusca] = useState("");

    const fetchUnidades = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/unidades?all=true", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setUnidades(Array.isArray(data) ? data : []);
            }
        } catch {
            toast.error("Erro ao carregar unidades.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnidades();
    }, []);

    const handleDelete = async (id: string, nome: string) => {
        if (!confirm(`Tem certeza que deseja excluir a unidade "${nome}"? Ela será removida imediatamente do portal público.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/unidades/${id}`, { method: "DELETE", cache: "no-store" });
            if (res.ok) {
                toast.success("Unidade excluída com sucesso!");
                setUnidades((prev) => prev.filter((u) => u.id !== id));
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(err.error || "Erro ao excluir unidade.");
            }
        } catch {
            toast.error("Erro de conexão.");
        }
    };

    const handleRestaurarEquipesSaude = async () => {
        setSeeding(true);
        try {
            const res = await fetch("/api/admin/unidades/seed", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ createMissing: false, forceOverwrite: false }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(
                    data.updated > 0 || data.created > 0
                        ? `Dados restaurados: ${data.updated} atualizada(s), ${data.created} criada(s).`
                        : "Todas as unidades de saúde já possuem serviços e equipes preenchidos."
                );
                fetchUnidades();
            } else {
                toast.error(data.error || "Erro ao restaurar equipes.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setSeeding(false);
        }
    };

    const filtradas = unidades.filter((u) => {
        if (filtroTipo === "saude" && !isSaudeTipo(u.tipo)) return false;
        if (filtroTipo === "educacao" && !isEducacaoTipo(u.tipo)) return false;
        if (filtroTipo === "social" && !normalizeText(u.tipo).includes("social") && !normalizeText(u.tipo).includes("socio")) return false;
        if (filtroTipo === "cultura" && !normalizeText(u.tipo).includes("cultura")) return false;

        if (!busca.trim()) return true;
        const q = normalizeText(busca);
        const matchTexto =
            normalizeText(u.nome).includes(q) ||
            normalizeText(u.endereco).includes(q) ||
            normalizeText(u.servicos).includes(q) ||
            u.especialidades.some((e) => normalizeText(e).includes(q)) ||
            u.equipe.some(
                (p) =>
                    normalizeText(p.nome).includes(q) ||
                    normalizeText(p.cargo).includes(q) ||
                    normalizeText(p.especialidade).includes(q)
            );
        return matchTexto;
    });

    const getTipoBadgeColor = (tipo: string) => {
        if (isSaudeTipo(tipo)) return "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (isEducacaoTipo(tipo)) return "bg-blue-50 text-blue-700 border-blue-200";
        if (normalizeText(tipo).includes("social") || normalizeText(tipo).includes("socio")) {
            return "bg-purple-50 text-purple-700 border-purple-200";
        }
        return "bg-amber-50 text-amber-700 border-amber-200";
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#1E293B] flex items-center gap-2">
                        <FaClinicMedical className="text-[#0188B9]" />
                        Unidades de Atendimento, Serviços e Equipes
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Gerencie UBS, hospitais, médicos, enfermeiros, serviços de saúde, escolas e equipamentos sociais (PNTP 18.2 / 19.2).
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={handleRestaurarEquipesSaude}
                        disabled={seeding}
                        className="px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                    >
                        {seeding ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
                        Completar Equipes/Serviços de Saúde Vazios
                    </button>
                    <Link
                        href="/admin/unidades/new"
                        className="px-5 py-2.5 bg-[#0188B9] hover:bg-[#026A91] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-sm"
                    >
                        <FaPlus /> Nova Unidade
                    </Link>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: "todos", label: `Todas (${unidades.length})` },
                        { id: "saude", label: `Saúde (${unidades.filter((u) => isSaudeTipo(u.tipo)).length})` },
                        { id: "educacao", label: `Educação (${unidades.filter((u) => isEducacaoTipo(u.tipo)).length})` },
                        { id: "social", label: "Assistência Social" },
                        { id: "cultura", label: "Cultura" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFiltroTipo(tab.id as any)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                                filtroTipo === tab.id
                                    ? "bg-[#1254A3] text-white shadow-sm"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full lg:w-80">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                        type="text"
                        placeholder="Buscar unidade, médico, serviço..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#0188B9]"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <FaSpinner className="animate-spin text-4xl mb-4 text-[#0188B9]" />
                    <p>Carregando unidades...</p>
                </div>
            ) : filtradas.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
                    <FaClinicMedical className="text-4xl text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-700 mb-1">Nenhuma unidade encontrada</h3>
                    <p className="text-sm mb-4">Ajuste o filtro acima ou cadastre uma nova unidade.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtradas.map((unidade) => (
                        <div
                            key={unidade.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between gap-4"
                        >
                            <div>
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getTipoBadgeColor(unidade.tipo)}`}>
                                        {unidade.subtipo || unidade.tipo}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        {unidade.cnes && (
                                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">
                                                {isEducacaoTipo(unidade.tipo) ? "INEP" : "CNES"} {unidade.cnes}
                                            </span>
                                        )}
                                        {!unidade.ativa && (
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700">
                                                Inativa
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <h3 className="font-bold text-[#1E293B] text-lg mb-1">{unidade.nome}</h3>
                                <p className="text-gray-500 text-xs line-clamp-2 mb-3">{unidade.descricao}</p>

                                {/* Resumo de Serviços e Equipe PNTP */}
                                <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                                            <FaUserMd className="text-[#0188B9]" /> Profissionais/Escala:
                                        </span>
                                        <span
                                            className={`font-black px-2 py-0.5 rounded-full ${
                                                unidade.equipe.length > 0
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : "bg-amber-100 text-amber-800"
                                            }`}
                                        >
                                            {unidade.equipe.length} cadastrado(s)
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="font-semibold text-slate-600">Especialidades / Etapas:</span>
                                        <span className="font-bold text-slate-800">{unidade.especialidades.length}</span>
                                    </div>
                                    {unidade.servicos && (
                                        <p className="text-[11px] text-slate-500 line-clamp-2 pt-1 border-t border-slate-200/70">
                                            <strong>Serviços:</strong> {unidade.servicos}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5 text-xs text-gray-600">
                                    <div className="flex items-start gap-2">
                                        <FaMapMarkerAlt className="text-[#0188B9] shrink-0 mt-0.5" />
                                        <span className="line-clamp-2">{unidade.endereco}</span>
                                    </div>
                                    {unidade.telefone && (
                                        <div className="flex items-center gap-2">
                                            <FaPhone className="text-[#0188B9] shrink-0" />
                                            <span className="truncate">{unidade.telefone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-2">
                                        <FaClock className="text-[#0188B9] shrink-0 mt-0.5" />
                                        <span>{unidade.horario}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                                <Link
                                    href={`/admin/unidades/editar/${unidade.id}`}
                                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition"
                                >
                                    <FaEdit /> Editar Dados, Serviços e Equipe
                                </Link>
                                <button
                                    onClick={() => handleDelete(unidade.id, unidade.nome)}
                                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                                    title="Excluir unidade"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
