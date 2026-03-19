"use client";
import { useState, useEffect } from "react";
import { FaMoneyBillWave, FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaCalendarAlt, FaHandHoldingUsd } from "react-icons/fa";
import toast from "react-hot-toast";

type Emenda = {
    id: string;
    autor: string;
    valor: number;
    ano: number;
    tipo: string;
    objeto: string;
    status: string;
};

export default function AdminEmendasPage() {
    const [items, setItems] = useState<Emenda[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({
        autor: "",
        valor: 0,
        ano: new Date().getFullYear(),
        tipo: "Estadual",
        objeto: "",
        status: "Em Execução"
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/emendas");
            const data = await res.json();
            setItems(data || []);
        } catch {
            toast.error("Erro ao carregar emendas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (item?: Emenda) => {
        if (item) {
            setEditingId(item.id);
            setForm({
                autor: item.autor,
                valor: item.valor,
                ano: item.ano,
                tipo: item.tipo,
                objeto: item.objeto,
                status: item.status
            });
        } else {
            setEditingId(null);
            setForm({ autor: "", valor: 0, ano: new Date().getFullYear(), tipo: "Estadual", objeto: "", status: "Em Execução" });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/admin/emendas/${editingId}` : "/api/admin/emendas";
            const method = editingId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, valor: Number(form.valor) })
            });

            if (res.ok) {
                toast.success(editingId ? "Emenda atualizada" : "Emenda cadastrada");
                setShowModal(false);
                fetchData();
            } else {
                toast.error("Erro ao salvar");
            }
        } catch {
            toast.error("Erro na conexão");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir esta emenda?")) return;
        try {
            const res = await fetch(`/api/admin/emendas/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Removida");
                fetchData();
            }
        } catch {
            toast.error("Erro ao remover");
        }
    };

    const filteredItems = items.filter(i => 
        i.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.objeto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaMoneyBillWave className="text-emerald-500" /> Emendas Parlamentares
                    </h1>
                    <p className="text-gray-500 text-sm">Registro de recursos recebidos via parlamentares.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all"
                >
                    <FaPlus /> Nova Emenda
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input 
                            type="text" 
                            placeholder="Buscar por autor ou objeto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                <th className="px-6 py-4">Autor / Objeto</th>
                                <th className="px-6 py-4">Valor / Ano</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <FaSpinner className="animate-spin inline-block text-emerald-500 text-2xl" />
                                    </td>
                                </tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhuma emenda encontrada.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((i) => (
                                    <tr key={i.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-700 uppercase text-xs">{i.autor}</div>
                                            <div className="text-[10px] text-gray-400 line-clamp-1">{i.objeto}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-emerald-600 text-xs">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(i.valor)}
                                            </div>
                                            <div className="text-[10px] text-gray-400">{i.ano} - {i.tipo}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[9px] font-black uppercase px-2 py-1 bg-gray-100 text-gray-500 rounded">
                                                {i.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleOpenModal(i)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDelete(i.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl">
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-6">
                            {editingId ? "Editar Emenda" : "Nova Emenda"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Autor (Deputado/Senador)</label>
                                <input required value={form.autor} onChange={(e) => setForm({ ...form, autor: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valor</label>
                                    <input type="number" step="0.01" required value={form.valor} onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ano</label>
                                    <input type="number" required value={form.ano} onChange={(e) => setForm({ ...form, ano: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo</label>
                                    <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold">
                                        <option value="Federal">Federal</option>
                                        <option value="Estadual">Estadual</option>
                                        <option value="Especial">Especial</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                                    <input required value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold" placeholder="Ex: Em Execução" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Objeto (Finalidade)</label>
                                <textarea required value={form.objeto} onChange={(e) => setForm({ ...form, objeto: e.target.value })} rows={2} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium" />
                            </div>
                            <div className="flex gap-3 pt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] text-gray-400">Cancelar</button>
                                <button type="submit" className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-200">Salvar Dados</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
