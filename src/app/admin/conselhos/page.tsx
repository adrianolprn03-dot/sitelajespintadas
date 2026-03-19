"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaUsers } from "react-icons/fa";
import toast from "react-hot-toast";

type Conselho = {
    id: string;
    nome: string;
    sigla: string;
    tipo: string;
    presidente: string;
    ativo: boolean;
    atas: { id: string }[];
};

export default function AdminConselhosPage() {
    const [items, setItems] = useState<Conselho[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/conselhos");
            const data = await res.json();
            setItems(data.items || []);
        } catch {
            toast.error("Erro ao carregar conselhos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir este conselho e todas as suas atas?")) return;
        try {
            const res = await fetch(`/api/conselhos/${id}`, { method: "DELETE" });
            if (res.ok) { toast.success("Conselho removido"); fetchData(); }
        } catch { toast.error("Erro ao excluir"); }
    };

    const tipoLabel: Record<string, string> = {
        saude: "Saúde", educacao: "Educação", social: "Assistência Social",
        fundeb: "FUNDEB", outros: "Outros"
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaUsers className="text-blue-600" /> Conselhos Municipais
                    </h1>
                    <p className="text-gray-500 text-sm">Gerencie os conselhos e suas atas de reunião.</p>
                </div>
                <Link href="/admin/conselhos/novo" className="btn-primary flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                    <FaPlus /> Novo Conselho
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                <th className="px-6 py-4">Nome do Conselho</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Presidente</th>
                                <th className="px-6 py-4 text-center">Atas</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center">
                                    <FaSpinner className="animate-spin inline-block text-blue-500 text-2xl" />
                                </td></tr>
                            ) : items.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                                    Nenhum conselho cadastrado.
                                </td></tr>
                            ) : items.map((i) => (
                                <tr key={i.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-700">{i.nome}</div>
                                        {i.sigla && <div className="text-[10px] font-black text-blue-600 uppercase">{i.sigla}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-500">{tipoLabel[i.tipo] || i.tipo}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{i.presidente || "—"}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                                            {i.atas?.length || 0} atas
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${i.ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                            {i.ativo ? "Ativo" : "Inativo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/admin/conselhos/editar/${i.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <FaEdit />
                                            </Link>
                                            <button onClick={() => handleDelete(i.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
