"use client";
import { useState, useEffect } from "react";
import { FaUsers, FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaBriefcase, FaLock, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

type Concurso = {
    id: string;
    titulo: string;
    edital: string;
    tipo: string;
    vagas: number;
    dataPublicacao: string;
    status: string;
    ativo: boolean;
};

export default function AdminConcursosPage() {
    const [items, setItems] = useState<Concurso[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({
        titulo: "",
        edital: "",
        tipo: "Concurso Público",
        vagas: 0,
        dataPublicacao: new Date().toISOString().split('T')[0],
        status: "aberto",
        ativo: true
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/concursos");
            const data = await res.json();
            setItems(data || []);
        } catch {
            toast.error("Erro ao carregar");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (item?: Concurso) => {
        if (item) {
            setEditingId(item.id);
            setForm({
                titulo: item.titulo,
                edital: item.edital,
                tipo: item.tipo,
                vagas: item.vagas,
                dataPublicacao: new Date(item.dataPublicacao).toISOString().split('T')[0],
                status: item.status,
                ativo: item.ativo
            });
        } else {
            setEditingId(null);
            setForm({ titulo: "", edital: "", tipo: "Concurso Público", vagas: 0, dataPublicacao: new Date().toISOString().split('T')[0], status: "aberto", ativo: true });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/admin/concursos/${editingId}` : "/api/admin/concursos";
            const method = editingId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, vagas: Number(form.vagas), dataPublicacao: new Date(form.dataPublicacao) })
            });

            if (res.ok) {
                toast.success("Salvo com sucesso");
                setShowModal(false);
                fetchData();
            }
        } catch {
            toast.error("Erro");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaUsers className="text-blue-500" /> Concursos e Seleções
                    </h1>
                    <p className="text-gray-500 text-sm">Gerencie editais e processos seletivos do município.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg">
                    <FaPlus /> Novo Edital
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm" />
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                            <th className="px-6 py-4">Título / Edital</th>
                            <th className="px-6 py-4">Vagas</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map(i => (
                            <tr key={i.id} className="hover:bg-gray-50 group transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-700">{i.titulo}</div>
                                    <div className="text-[10px] text-gray-400">{i.edital}</div>
                                </td>
                                <td className="px-6 py-4 text-xs font-bold text-gray-500">{i.vagas}</td>
                                <td className="px-6 py-4">
                                    {i.status === 'aberto' ? <span className="text-emerald-500 text-[10px] font-black uppercase"><FaCheckCircle className="inline mr-1" /> Aberto</span> : <span className="text-gray-400 text-[10px] font-black uppercase"><FaLock className="inline mr-1" /> Encerrado</span>}
                                </td>
                                <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenModal(i)} className="text-blue-600 p-2"><FaEdit /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
                        <h2 className="text-xl font-black text-gray-800 uppercase mb-6">Edital</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input required placeholder="Título" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                            <input required placeholder="Edital" value={form.edital} onChange={(e) => setForm({ ...form, edital: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Vagas" value={form.vagas} onChange={(e) => setForm({ ...form, vagas: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                                <input type="date" value={form.dataPublicacao} onChange={(e) => setForm({ ...form, dataPublicacao: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                            </div>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                                <option value="aberto">Aberto</option>
                                <option value="encerrado">Encerrado</option>
                            </select>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-gray-400 font-black uppercase text-[10px]">Cancelar</button>
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black uppercase text-[10px]">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
