"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner, FaQuestionCircle } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

type FAQ = {
    id: string;
    pergunta: string;
    resposta: string;
    categoria: string;
    ordem: number;
};

export default function AdminFAQPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/faq");
            const data = await res.json();
            setFaqs(data || []);
        } catch (error) {
            toast.error("Erro ao carregar FAQs");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta FAQ?")) return;
        try {
            const res = await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("FAQ excluída com sucesso");
                fetchFaqs();
            } else {
                toast.error("Erro ao excluir FAQ");
            }
        } catch (error) {
            toast.error("Erro de conexão");
        }
    };

    const filtered = faqs.filter(f =>
        f.pergunta.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Perguntas Frequentes (FAQ)</h1>
                    <p className="text-gray-500 text-sm">Gerencie as dúvidas mais comuns dos cidadãos</p>
                </div>
                <Link href="/admin/faq/nova" className="btn-primary flex items-center gap-2">
                    <FaPlus /> Nova FAQ
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar pergunta..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                <th className="px-6 py-4">Ordem</th>
                                <th className="px-6 py-4">Pergunta</th>
                                <th className="px-6 py-4">Categoria</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <FaSpinner className="animate-spin inline-block text-primary-500 text-2xl" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic font-medium">
                                        Nenhuma FAQ cadastrada.
                                    </td>
                                </tr>
                            ) : filtered.map((f) => (
                                <tr key={f.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{f.ordem}</td>
                                    <td className="px-6 py-4 font-bold text-gray-800">{f.pergunta}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {f.categoria || "Geral"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/faq/editar/${f.id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(f.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
