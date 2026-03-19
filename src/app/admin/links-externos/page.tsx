"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaLink, FaExternalLinkAlt, FaEdit, FaTrash, FaPlus, FaGlobe } from "react-icons/fa";
import toast from "react-hot-toast";

type LinkExterno = {
    id: string;
    titulo: string;
    url: string;
    descricao: string | null;
    categoria: string;
    ativo: boolean;
    ordem: number;
    moduloAlvo: string | null;
};

const categoriaLabel: Record<string, string> = {
    relatorios: "Relatórios",
    transparencia: "Transparência",
    legislacao: "Legislação",
    geral: "Geral",
};

const categoriaCor: Record<string, string> = {
    relatorios: "bg-red-100 text-red-700",
    transparencia: "bg-blue-100 text-blue-700",
    legislacao: "bg-purple-100 text-purple-700",
    geral: "bg-gray-100 text-gray-700",
};

export default function LinksExternosPage() {
    const [links, setLinks] = useState<LinkExterno[]>([]);
    const [loading, setLoading] = useState(true);
    const [excluindo, setExcluindo] = useState<string | null>(null);

    const fetchLinks = async () => {
        setLoading(true);
        const res = await fetch("/api/admin/links-externos");
        const data = await res.json();
        setLinks(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => { fetchLinks(); }, []);

    const handleExcluir = async (id: string) => {
        if (!confirm("Excluir este link externo?")) return;
        setExcluindo(id);
        const res = await fetch(`/api/admin/links-externos/${id}`, { method: "DELETE" });
        if (res.ok) {
            toast.success("Link excluído!");
            setLinks((prev) => prev.filter((l) => l.id !== id));
        } else {
            toast.error("Erro ao excluir.");
        }
        setExcluindo(null);
    };

    const handleToggle = async (link: LinkExterno) => {
        const res = await fetch(`/api/admin/links-externos/${link.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...link, ativo: !link.ativo }),
        });
        if (res.ok) {
            toast.success(link.ativo ? "Link desativado." : "Link ativado!");
            setLinks((prev) => prev.map((l) => l.id === link.id ? { ...l, ativo: !l.ativo } : l));
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Links Externos</h1>
                    <p className="text-sm text-gray-500 mt-1">Gerencie links para sites externos que aparecem nas páginas do portal.</p>
                </div>
                <Link href="/admin/links-externos/novo" className="flex items-center gap-2 bg-[#01b0ef] hover:bg-[#0088b9] text-white font-bold text-sm px-5 py-3 rounded-xl shadow transition-all">
                    <FaPlus /> Novo Link
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Carregando...</div>
            ) : links.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <FaGlobe className="mx-auto text-5xl text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Nenhum link externo cadastrado ainda.</p>
                    <Link href="/admin/links-externos/novo" className="mt-4 inline-block text-[#01b0ef] font-bold hover:underline text-sm">
                        + Adicionar o primeiro link
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {links.map((link) => (
                        <div key={link.id} className={`flex items-center gap-4 bg-white rounded-2xl border p-5 shadow-sm transition-all ${link.ativo ? "border-gray-100" : "border-gray-200 opacity-60"}`}>
                            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                                <FaLink />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="font-bold text-gray-800 text-sm">{link.titulo}</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${categoriaCor[link.categoria] || "bg-gray-100 text-gray-600"}`}>
                                        {categoriaLabel[link.categoria] || link.categoria}
                                    </span>
                                    {link.moduloAlvo && (
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg bg-primary-100 text-primary-700 flex items-center gap-1">
                                            Vínculo: {link.moduloAlvo}
                                        </span>
                                    )}
                                    {!link.ativo && <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Desativado</span>}
                                </div>
                                {link.descricao && <p className="text-xs text-gray-400 mt-0.5 truncate">{link.descricao}</p>}
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#01b0ef] hover:underline flex items-center gap-1 mt-1 truncate">
                                    <FaExternalLinkAlt size={10} /> {link.url}
                                </a>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => handleToggle(link)}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${link.ativo ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700" : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700"}`}
                                >
                                    {link.ativo ? "Ativo" : "Inativo"}
                                </button>
                                <Link href={`/admin/links-externos/editar/${link.id}`} className="p-2 text-gray-400 hover:text-[#01b0ef] hover:bg-blue-50 rounded-lg transition-colors">
                                    <FaEdit size={14} />
                                </Link>
                                <button
                                    onClick={() => handleExcluir(link.id)}
                                    disabled={excluindo === link.id}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
