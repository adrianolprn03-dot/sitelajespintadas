"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner, FaHammer } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

type Obra = {
    id: string;
    titulo: string;
    local: string;
    valor: number;
    status: string;
    percentual: number;
};

export default function AdminObrasPage() {
    const [obras, setObras] = useState<Obra[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchObras();
    }, []);

    const fetchObras = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/obras");
            const data = await res.json();
            setObras(data || []);
        } catch (error) {
            toast.error("Erro ao carregar obras");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta obra?")) return;
        try {
            const res = await fetch(`/api/admin/obras/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Obra excluída com sucesso");
                fetchObras();
            } else {
                toast.error("Erro ao excluir obra");
            }
        } catch (error) {
            toast.error("Erro de conexão");
        }
    };

    const filtered = obras.filter(o =>
        o.titulo.toLowerCase().includes(search.toLowerCase()) ||
        o.local.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "concluida": return "bg-green-100 text-green-700";
            case "em-andamento": return "bg-blue-100 text-blue-700";
            case "paralisada": return "bg-red-100 text-red-700";
            case "licitacao": return "bg-amber-100 text-amber-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Obras Públicas</h1>
                    <p className="text-gray-500 text-sm">Acompanhamento e transparência de obras e reformas</p>
                </div>
                <Link href="/admin/obras/nova" className="btn-primary flex items-center gap-2">
                    <FaPlus /> Nova Obra
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar obra pelo título ou local..."
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
                                <th className="px-6 py-4">Título / Local</th>
                                <th className="px-6 py-4">Valor</th>
                                <th className="px-6 py-4">Progresso</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <FaSpinner className="animate-spin inline-block text-primary-500 text-2xl" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhuma obra cadastrada.
                                    </td>
                                </tr>
                            ) : filtered.map((o) => (
                                <tr key={o.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800 line-clamp-1">{o.titulo}</div>
                                        <div className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">{o.local}</div>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-bold text-emerald-600">
                                        {o.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary-500 h-full transition-all duration-1000"
                                                style={{ width: `${o.percentual}%` }}
                                            />
                                        </div>
                                        <div className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-widest">{o.percentual}% concluído</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(o.status)}`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/obras/editar/${o.id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(o.id)}
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
