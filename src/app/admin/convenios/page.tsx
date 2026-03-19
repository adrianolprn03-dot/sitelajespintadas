"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner, FaHandshake } from "react-icons/fa";
import toast from "react-hot-toast";

type Convenio = {
    id: string;
    numero: string;
    objeto: string;
    concedente: string;
    valor: number;
    status: string;
};

export default function AdminConveniosPage() {
    const [items, setItems] = useState<Convenio[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/convenios");
            const data = await res.json();
            setItems(data.items || []);
        } catch {
            toast.error("Erro ao carregar convênios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir este convênio?")) return;
        try {
            const res = await fetch(`/api/convenios/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Excluído com sucesso");
                fetchData();
            }
        } catch {
            toast.error("Erro ao excluir");
        }
    };

    const filtered = items.filter(i =>
        i.numero.toLowerCase().includes(search.toLowerCase()) ||
        i.objeto.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaHandshake className="text-pink-600" /> Convênios
                    </h1>
                    <p className="text-gray-500 text-sm">Gerencie os convênios e parcerias institucionais.</p>
                </div>
                <Link href="/admin/convenios/novo" className="btn-primary flex items-center gap-2 bg-pink-600 hover:bg-pink-700 border-none">
                    <FaPlus /> Novo Convênio
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por número ou objeto..."
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
                                <th className="px-6 py-4">Convênio</th>
                                <th className="px-6 py-4">Concedente</th>
                                <th className="px-6 py-4">Valor</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <FaSpinner className="animate-spin inline-block text-pink-500 text-2xl" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhum convênio encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((i) => (
                                    <tr key={i.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-800">{i.numero}</div>
                                            <div className="text-xs text-gray-500 line-clamp-1">{i.objeto}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{i.concedente}</td>
                                        <td className="px-6 py-4 text-sm font-mono font-bold text-gray-800">
                                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(i.valor)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-pink-100 text-pink-700">
                                                {i.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/convenios/editar/${i.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FaEdit /></Link>
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
