"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaTrash, FaSpinner, FaSearch, FaChartBar } from "react-icons/fa";
import toast from "react-hot-toast";

type Despesa = {
    id: string;
    descricao: string;
    categoria: string;
    valor: number;
    mes: number;
    ano: number;
};

export default function AdminDespesasPage() {
    const [items, setItems] = useState<Despesa[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/despesas");
            const data = await res.json();
            setItems(data.items || []);
        } catch {
            toast.error("Erro ao carregar despesas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir esta despesa?")) return;
        try {
            const res = await fetch(`/api/despesas/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Despesa removida");
                fetchData();
            }
        } catch {
            toast.error("Erro ao excluir");
        }
    };

    const filtered = items.filter(i => i.descricao.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaChartBar className="text-red-500" /> Despesas
                    </h1>
                    <p className="text-gray-500 text-sm">Gerencie os lançamentos de despesas públicas.</p>
                </div>
                <Link href="/admin/despesas/nova" className="btn-primary flex items-center gap-2 bg-red-600 hover:bg-red-700">
                    <FaPlus /> Nova Despesa
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por descrição..."
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
                                <th className="px-6 py-4">Descrição</th>
                                <th className="px-6 py-4">Categoria</th>
                                <th className="px-6 py-4">Ref.</th>
                                <th className="px-6 py-4 text-right">Valor</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <FaSpinner className="animate-spin inline-block text-red-500 text-2xl" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhuma despesa lançada.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((i) => (
                                    <tr key={i.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-gray-700">{i.descricao}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{i.categoria}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{i.mes}/{i.ano}</td>
                                        <td className="px-6 py-4 text-right font-mono font-bold text-red-600 text-lg">
                                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(i.valor)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDelete(i.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                <FaTrash />
                                            </button>
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
