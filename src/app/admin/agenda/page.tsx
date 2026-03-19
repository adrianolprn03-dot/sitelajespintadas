"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";

type Evento = {
    id: string;
    titulo: string;
    dataInicio: string;
    local: string | null;
    publico: boolean;
};

export default function AdminAgendaPage() {
    const [items, setItems] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/agenda");
            const data = await res.json();
            setItems(data || []);
        } catch {
            toast.error("Erro ao carregar agenda");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir este evento da agenda?")) return;
        try {
            const res = await fetch(`/api/agenda/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Evento removido!");
                fetchData();
            }
        } catch {
            toast.error("Erro ao excluir");
        }
    };

    const filtered = items.filter(i =>
        i.titulo.toLowerCase().includes(search.toLowerCase()) ||
        (i.local && i.local.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaCalendarAlt className="text-primary-500" /> Agenda Municipal
                    </h1>
                    <p className="text-gray-500 text-sm">Gerencie o calendário de eventos e compromissos oficiais.</p>
                </div>
                <Link href="/admin/agenda/nova" className="btn-primary flex items-center gap-2">
                    <FaPlus /> Novo Evento
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por título ou local..."
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
                                <th className="px-6 py-4">Evento</th>
                                <th className="px-6 py-4">Data/Hora</th>
                                <th className="px-6 py-4">Local</th>
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
                                        Nenhum evento registrado.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((i) => (
                                    <tr key={i.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-gray-700">{i.titulo}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-2"><FaCalendarAlt className="text-primary-400" /> {new Date(i.dataInicio).toLocaleDateString("pt-BR")}</div>
                                            <div className="flex items-center gap-2 mt-1"><FaClock className="text-primary-300" /> {new Date(i.dataInicio).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /> {i.local || "Não informado"}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/agenda/editar/${i.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
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
