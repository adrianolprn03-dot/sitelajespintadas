"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner, FaPlane } from "react-icons/fa";
import toast from "react-hot-toast";

type Diaria = {
    id: string;
    servidor: string;
    cargo: string;
    destino: string;
    valor: number;
    mes: number;
    ano: number;
};

export default function AdminDiariasPage() {
    const [items, setItems] = useState<Diaria[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/diarias");
            const data = await res.json();
            setItems(data.items || []);
        } catch {
            toast.error("Erro ao carregar diárias");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir esta diária?")) return;
        try {
            const res = await fetch(`/api/diarias/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Excluída com sucesso");
                fetchData();
            }
        } catch {
            toast.error("Erro ao excluir");
        }
    };

    const filtered = items.filter(i =>
        i.servidor.toLowerCase().includes(search.toLowerCase()) ||
        i.destino.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaPlane className="text-sky-600" /> Diárias
                    </h1>
                    <p className="text-gray-500 text-sm">Gerencie a concessão de diárias aos servidores.</p>
                </div>
                <Link href="/admin/diarias/novo" className="btn-primary flex items-center gap-2 bg-sky-600 hover:bg-sky-700 border-none">
                    <FaPlus /> Nova Diária
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por servidor ou destino..."
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
                                <th className="px-6 py-4">Servidor / Cargo</th>
                                <th className="px-6 py-4">Destino</th>
                                <th className="px-6 py-4">Ref.</th>
                                <th className="px-6 py-4 text-right">Valor</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <FaSpinner className="animate-spin inline-block text-sky-500 text-2xl" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhuma diária registrada.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((i) => (
                                    <tr key={i.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-800">{i.servidor}</div>
                                            <div className="text-xs text-gray-500">{i.cargo}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{i.destino}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{i.mes}/{i.ano}</td>
                                        <td className="px-6 py-4 text-right font-mono font-bold text-sky-600 text-lg">
                                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(i.valor)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/diarias/editar/${i.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FaEdit /></Link>
                                                <button onClick={() => handleDelete(i.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FaTrash /></button>
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
