"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner, FaBook } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

type Glossario = {
    id: string;
    termo: string;
    definicao: string;
};

export default function AdminGlossarioPage() {
    const [termos, setTermos] = useState<Glossario[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchTermos();
    }, []);

    const fetchTermos = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/glossario");
            const data = await res.json();
            setTermos(data || []);
        } catch (error) {
            toast.error("Erro ao carregar glossário");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este termo?")) return;
        try {
            const res = await fetch(`/api/admin/glossario/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Termo excluído com sucesso");
                fetchTermos();
            } else {
                toast.error("Erro ao excluir termo");
            }
        } catch (error) {
            toast.error("Erro de conexão");
        }
    };

    const filtered = termos.filter(t =>
        t.termo.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tighter font-black uppercase">Glossário PNTP</h1>
                    <p className="text-gray-500 text-sm">Gerencie o dicionário de termos técnicos do portal</p>
                </div>
                <Link href="/admin/glossario/novo" className="btn-primary flex items-center gap-2">
                    <FaPlus /> Novo Termo
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar termo..."
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
                                <th className="px-6 py-4">Termo</th>
                                <th className="px-6 py-4">Definição</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center">
                                        <FaSpinner className="animate-spin inline-block text-primary-500 text-2xl" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhum termo cadastrado.
                                    </td>
                                </tr>
                            ) : filtered.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 font-black text-[#0088b9] uppercase text-xs tracking-widest">{t.termo}</td>
                                    <td className="px-6 py-4 text-gray-500 line-clamp-2 max-w-md">{t.definicao}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/glossario/editar/${t.id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(t.id)}
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
