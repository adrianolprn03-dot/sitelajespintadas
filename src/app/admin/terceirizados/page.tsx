"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaUserTie } from "react-icons/fa";
import toast from "react-hot-toast";

type Terceirizado = {
    id: string;
    nome: string;
    empresa: string;
    funcao: string;
    unidadeLotacao: string;
    dataInicio: string;
    dataFim: string | null;
    status: string;
};

export default function AdminTerceirizadosPage() {
    const [items, setItems] = useState<Terceirizado[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/terceirizados");
            const data = await res.json();
            setItems(data || []);
        } catch {
            toast.error("Erro ao carregar terceirizados");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este registro?")) return;
        try {
            const res = await fetch(`/api/admin/terceirizados/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Registro removido");
                fetchData();
            }
        } catch {
            toast.error("Erro ao excluir");
        }
    };

    const filtered = items.filter(i => i.nome.toLowerCase().includes(search.toLowerCase()) || i.empresa.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaUserTie className="text-primary-500" /> Terceirizados
                    </h1>
                    <p className="text-gray-500 text-sm">Gerencie a relação de pessoal terceirizado do município.</p>
                </div>
                <Link href="/admin/terceirizados/novo" className="btn-primary flex items-center gap-2">
                    <FaPlus /> Novo Terceirizado
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou empresa..."
                            className="input-field pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                <th className="px-6 py-4">Nome / Função</th>
                                <th className="px-6 py-4">Empresa / Lotação</th>
                                <th className="px-6 py-4">Período</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <FaSpinner className="animate-spin inline-block text-primary-500 text-2xl" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhum registro encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((i) => (
                                    <tr key={i.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-700">{i.nome}</div>
                                            <div className="text-[10px] text-gray-400 uppercase font-black">{i.funcao}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="font-semibold">{i.empresa}</div>
                                            <div className="text-[10px] font-bold text-primary-600 uppercase">{i.unidadeLotacao}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(i.dataInicio).toLocaleDateString()} {i.dataFim ? `- ${new Date(i.dataFim).toLocaleDateString()}` : "(Vigente)"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/terceirizados/editar/${i.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                                    <FaEdit />
                                                </Link>
                                                <button onClick={() => handleDelete(i.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
