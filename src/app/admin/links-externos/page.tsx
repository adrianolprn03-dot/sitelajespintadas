"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    FaPlus,
    FaGlobe,
    FaMagnifyingGlass,
    FaLink,
    FaPenToSquare,
    FaTrashCan,
    FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import toast from "react-hot-toast";
import {
    CATEGORIAS_LINKS_EXTERNOS,
    getIconComponent,
    getModuloAlvoLabel,
} from "@/lib/links-externos-config";

type LinkExterno = {
    id: string;
    titulo: string;
    url: string;
    descricao: string | null;
    categoria: string;
    icone: string | null;
    ativo: boolean;
    ordem: number;
    moduloAlvo: string | null;
};

const categoriaLabelMap: Record<string, string> = {
    transparencia: "Transparência",
    relatorios: "Relatórios LRF",
    legislacao: "Legislação",
    servicos: "Serviços",
    geral: "Geral",
};

export default function LinksExternosPage() {
    const [links, setLinks] = useState<LinkExterno[]>([]);
    const [loading, setLoading] = useState(true);
    const [excluindo, setExcluindo] = useState<string | null>(null);
    const [filtroCategoria, setFiltroCategoria] = useState<string>("TODAS");
    const [busca, setBusca] = useState<string>("");

    const fetchLinks = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/links-externos");
            const data = await res.json();
            setLinks(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Erro ao carregar links externos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const handleExcluir = async (id: string, titulo: string) => {
        if (!confirm(`Tem certeza que deseja excluir o link "${titulo}"?`)) return;
        setExcluindo(id);
        try {
            const res = await fetch(`/api/admin/links-externos/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Link excluído com sucesso!");
                setLinks((prev) => prev.filter((l) => l.id !== id));
            } else {
                toast.error("Erro ao excluir link.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setExcluindo(null);
        }
    };

    const handleToggle = async (link: LinkExterno) => {
        try {
            const res = await fetch(`/api/admin/links-externos/${link.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...link, ativo: !link.ativo }),
            });
            if (res.ok) {
                toast.success(link.ativo ? "Link desativado." : "Link ativado!");
                setLinks((prev) =>
                    prev.map((l) => (l.id === link.id ? { ...l, ativo: !l.ativo } : l))
                );
            }
        } catch {
            toast.error("Erro ao atualizar status do link.");
        }
    };

    const linksFiltrados = links.filter((l) => {
        const matchesCat = filtroCategoria === "TODAS" || l.categoria === filtroCategoria;
        const matchesBusca =
            !busca.trim() ||
            l.titulo.toLowerCase().includes(busca.toLowerCase()) ||
            (l.descricao && l.descricao.toLowerCase().includes(busca.toLowerCase())) ||
            (l.moduloAlvo && l.moduloAlvo.toLowerCase().includes(busca.toLowerCase())) ||
            l.url.toLowerCase().includes(busca.toLowerCase());
        return matchesCat && matchesBusca;
    });

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* CABEÇALHO */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1254A3] text-[10px] font-bold uppercase tracking-wider mb-1">
                        Portal Institucional • Gestão de Links & Atalhos
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#12304A] font-heading tracking-tight">
                        Links Externos & Módulos
                    </h1>
                    <p className="text-xs text-[#5B738B] mt-0.5">
                        Gerencie links para sistemas externos (PNCP, TCE, Betha, etc.) e vincule redirecionamentos aos cards da página inicial e do Portal da Transparência.
                    </p>
                </div>

                <Link
                    href="/admin/links-externos/novo"
                    className="flex items-center gap-2 bg-[#1254A3] hover:bg-[#0d4282] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm transition-all shrink-0 self-start sm:self-auto"
                >
                    <FaPlus />
                    <span>Adicionar Novo Link</span>
                </Link>
            </div>

            {/* FILTROS E BUSCA */}
            <div className="bg-white rounded-2xl border border-[#DDE3EA] p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                        type="text"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar por título, URL ou card vinculado..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs text-[#12304A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1254A3] focus:border-transparent transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button
                        onClick={() => setFiltroCategoria("TODAS")}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                            filtroCategoria === "TODAS"
                                ? "bg-[#1254A3] text-white shadow-sm"
                                : "bg-gray-100 text-[#5B738B] hover:bg-gray-200"
                        }`}
                    >
                        Todas as Categorias ({links.length})
                    </button>
                    {CATEGORIAS_LINKS_EXTERNOS.map((c) => {
                        const count = links.filter((l) => l.categoria === c.value).length;
                        return (
                            <button
                                key={c.value}
                                onClick={() => setFiltroCategoria(c.value)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                                    filtroCategoria === c.value
                                        ? "bg-[#1254A3] text-white shadow-sm"
                                        : "bg-gray-100 text-[#5B738B] hover:bg-gray-200"
                                }`}
                            >
                                {c.label.split(" ")[0]} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* LISTAGEM */}
            {loading ? (
                <div className="text-center py-20 text-xs font-bold text-[#5B738B] bg-white rounded-2xl border border-[#DDE3EA]">
                    Carregando links externos cadastrados...
                </div>
            ) : linksFiltrados.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#DDE3EA] p-6 space-y-3">
                    <FaGlobe className="mx-auto text-4xl text-gray-300" />
                    <h3 className="text-sm font-bold text-[#12304A]">Nenhum link externo encontrado</h3>
                    <p className="text-xs text-[#5B738B] max-w-md mx-auto">
                        Não encontramos links para o filtro aplicado. Você pode cadastrar novos links externos e vinculá-los a qualquer card do portal.
                    </p>
                    <Link
                        href="/admin/links-externos/novo"
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#1254A3] hover:underline pt-2"
                    >
                        <FaPlus size={11} />
                        <span>Cadastrar o primeiro link externo agora</span>
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {linksFiltrados.map((link) => {
                        const IconComponent = getIconComponent(link.icone);
                        const targetLabel = getModuloAlvoLabel(link.moduloAlvo);

                        return (
                            <div
                                key={link.id}
                                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                    link.ativo
                                        ? "border-[#DDE3EA] hover:border-[#1254A3]"
                                        : "border-gray-200 bg-gray-50/60 opacity-60"
                                }`}
                            >
                                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1254A3] border border-blue-200/70 flex items-center justify-center text-lg shrink-0">
                                        <IconComponent />
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-extrabold text-[#12304A] text-sm">
                                                {link.titulo}
                                            </h3>

                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-[#1254A3]">
                                                {categoriaLabelMap[link.categoria] || link.categoria}
                                            </span>

                                            {link.moduloAlvo ? (
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                                    <span>🎯 Vínculo:</span>
                                                    <span>{targetLabel}</span>
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-medium text-gray-400">
                                                    Sem vínculo de card
                                                </span>
                                            )}

                                            {!link.ativo && (
                                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                                                    Inativo
                                                </span>
                                            )}
                                        </div>

                                        {link.descricao && (
                                            <p className="text-xs text-[#5B738B] line-clamp-1">
                                                {link.descricao}
                                            </p>
                                        )}

                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-[#1254A3] hover:underline inline-flex items-center gap-1.5 font-medium truncate max-w-full"
                                        >
                                            <FaArrowUpRightFromSquare size={10} />
                                            <span className="truncate">{link.url}</span>
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 w-full sm:w-auto justify-end">
                                    <button
                                        onClick={() => handleToggle(link)}
                                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${
                                            link.ativo
                                                ? "bg-emerald-50 text-emerald-700 hover:bg-amber-50 hover:text-amber-700 border border-emerald-200"
                                                : "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200"
                                        }`}
                                    >
                                        {link.ativo ? "Ativo" : "Inativo"}
                                    </button>

                                    <Link
                                        href={`/admin/links-externos/editar/${link.id}`}
                                        className="p-2 text-gray-400 hover:text-[#1254A3] hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-200"
                                        title="Editar Link"
                                    >
                                        <FaPenToSquare size={14} />
                                    </Link>

                                    <button
                                        onClick={() => handleExcluir(link.id, link.titulo)}
                                        disabled={excluindo === link.id}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-200 disabled:opacity-50"
                                        title="Excluir Link"
                                    >
                                        <FaTrashCan size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
