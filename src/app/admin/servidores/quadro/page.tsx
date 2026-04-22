"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaTable } from "react-icons/fa";
import toast from "react-hot-toast";

type QuadroServidor = {
    id: string;
    cargo: string;
    vinculo: string;
    vagasLei: number;
    vagasOcupadas: number;
    vagasLivres: number;
    ativo: boolean;
};

export default function AdminQuadroServidoresPage() {
    const [items, setItems] = useState<QuadroServidor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/quadro-servidores");
            const data = await res.json();
            setItems(data.items || []);
        } catch {
            toast.error("Erro ao carregar quadro de servidores");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este cargo do quadro?")) return;
        try {
            const res = await fetch(`/api/quadro-servidores/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Registro removido");
                fetchData();
            } else {
                toast.error("Erro ao excluir registro");
            }
        } catch {
            toast.error("Erro ao excluir");
        }
    };

    const filtered = items.filter(i => 
        i.cargo.toLowerCase().includes(search.toLowerCase()) ||
        i.vinculo.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaTable className="text-primary-500" /> Quadro de Servidores (PNTP)
                    </h1>
                    <p className="text-gray-500">Gerencie as vagas e cargos do município.</p>
                </div>
                <Link
                    href="/admin/servidores/quadro/novo"
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition w-full md:w-auto justify-center"
                >
                    <FaPlus /> Novo Cargo
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Buscar por cargo ou vínculo..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <FaSpinner className="animate-spin text-primary-500 text-3xl" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Nenhum registro encontrado.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm">
                                    <th className="p-4 border-b">Cargo / Vínculo</th>
                                    <th className="p-4 border-b text-center">Vagas Lei</th>
                                    <th className="p-4 border-b text-center">Ocupadas</th>
                                    <th className="p-4 border-b text-center">Livres</th>
                                    <th className="p-4 border-b text-center">Status</th>
                                    <th className="p-4 border-b text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 border-b">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-800">{item.cargo}</div>
                                            <div className="text-xs text-gray-500 uppercase">{item.vinculo}</div>
                                        </td>
                                        <td className="p-4 text-center font-semibold text-gray-700">{item.vagasLei}</td>
                                        <td className="p-4 text-center text-blue-600 font-semibold">{item.vagasOcupadas}</td>
                                        <td className="p-4 text-center text-green-600 font-semibold">{item.vagasLivres}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                {item.ativo ? "Ativo" : "Inativo"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/servidores/quadro/${item.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Editar"
                                                >
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Excluir"
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
                )}
            </div>
        </div>
    );
}
