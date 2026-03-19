"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner, FaFileContract } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

type Contrato = {
    id: string;
    numero: string;
    objeto: string;
    fornecedor: string;
    valor: number;
    status: string;
};

export default function AdminContratosPage() {
    const [items, setItems] = useState<Contrato[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/contratos");
            const data = await res.json();
            setItems(data.items || []);
        } catch {
            toast.error("Erro ao carregar contratos");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Deseja excluir este contrato?")) return;
        try {
            const res = await fetch(`/api/contratos/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Contrato removido");
                fetchData();
            }
        } catch {
            toast.error("Falha ao excluir");
        }
    };

    const filtered = items.filter(i =>
        i.objeto.toLowerCase().includes(search.toLowerCase()) ||
        i.numero.toLowerCase().includes(search.toLowerCase()) ||
        i.fornecedor.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Contratos</h1>
                    <p className="text-gray-500 text-sm">Gestão de contratos e parcerias</p>
                </div>
                <Link href="/admin/contratos/novo" className="btn-primary flex items-center gap-2">
                    <FaPlus /> Novo Contrato
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 relative">
                    <FaSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por número, objeto ou fornecedor..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-xs uppercase font-bold border-b border-gray-100">
                                <th className="px-6 py-4">Contrato</th>
                                <th className="px-6 py-4">Fornecedor</th>
                                <th className="px-6 py-4">Valor</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan={5} className="py-12 text-center"><FaSpinner className="animate-spin inline-block text-primary-500 text-2xl" /></td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={5} className="py-12 text-center text-gray-400 italic">Nenhum contrato encontrado.</td></tr>
                            ) : filtered.map((i) => (
                                <tr key={i.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800">{i.numero}</div>
                                        <div className="text-xs text-gray-500 line-clamp-1">{i.objeto}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{i.fornecedor}</td>
                                    <td className="px-6 py-4 font-bold text-gray-800">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(i.valor)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${i.status === "vigente" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                            }`}>
                                            {i.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/admin/contratos/editar/${i.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FaEdit /></Link>
                                            <button onClick={() => handleDelete(i.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FaTrash /></button>
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
