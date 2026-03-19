"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaUsers } from "react-icons/fa";
import toast from "react-hot-toast";

type Servidor = {
    id: string;
    nome: string;
    cargo: string;
    vinculo: string;
    lotacao: string;
    salarioBase: number;
    ano: number;
    mes: number;
};

export default function AdminServidoresPage() {
    const [items, setItems] = useState<Servidor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/servidores");
            const data = await res.json();
            setItems(data.items || []);
        } catch {
            toast.error("Erro ao carregar servidores");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este servidor?")) return;
        try {
            const res = await fetch(`/api/servidores/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Servidor removido");
                fetchData();
            }
        } catch {
            toast.error("Erro ao excluir");
        }
    };

    const filtered = items.filter(i => i.nome.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaUsers className="text-primary-500" /> Servidores
                    </h1>
                    <p className="text-gray-500 text-sm">Gerencie a relação de servidores e folha de pagamento.</p>
                </div>
                <Link href="/admin/servidores/novo" className="btn-primary flex items-center gap-2">
                    <FaPlus /> Novo Servidor
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome..."
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
                                <th className="px-6 py-4">Nome</th>
                                <th className="px-6 py-4">Cargo / Vínculo</th>
                                <th className="px-6 py-4">Ref. (Mês/Ano)</th>
                                <th className="px-6 py-4">Salário Base</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <FaSpinner className="animate-spin inline-block text-primary-500 text-2xl" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhum servidor encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((i) => (
                                    <tr key={i.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-gray-700">{i.nome}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div>{i.cargo}</div>
                                            <div className="text-[10px] font-bold text-primary-600 uppercase">{i.vinculo}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{i.mes}/{i.ano}</td>
                                        <td className="px-6 py-4 text-sm font-mono font-bold text-gray-700">
                                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(i.salarioBase)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/servidores/editar/${i.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
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
