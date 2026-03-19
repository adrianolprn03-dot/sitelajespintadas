"use client";
import { useState, useEffect } from "react";
import { FaFileAlt, FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import toast from "react-hot-toast";

type Servico = {
    id: string;
    nome: string;
    categoria: string;
    descricao: string;
    local: string;
    prazo: string;
    requisitos: string;
    ativo: boolean;
};

export default function AdminCartaServicosPage() {
    const [items, setItems] = useState<Servico[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({
        nome: "",
        categoria: "Saúde",
        descricao: "",
        local: "Secretaria de Saúde",
        prazo: "7 dias",
        requisitos: "RG, CPF e Comprovante de Residência",
        ativo: true
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/carta-servicos");
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/admin/carta-servicos/${editingId}` : "/api/admin/carta-servicos";
            const method = editingId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                toast.success("Serviço salvo");
                setShowModal(false);
                fetchData();
            }
        } catch {
            toast.error("Erro técnico");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este serviço?")) return;
        try {
            const res = await fetch(`/api/admin/carta-servicos/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Serviço excluído");
                fetchData();
            }
        } catch {
            toast.error("Erro ao excluir");
        }
    };

    const handleOpenModal = (item?: Servico) => {
        if (item) {
            setEditingId(item.id);
            setForm({ ...item });
        } else {
            setEditingId(null);
            setForm({ nome: "", categoria: "Saúde", descricao: "", local: "Secretaria de Saúde", prazo: "7 dias", requisitos: "RG, CPF e Comprovante de Residência", ativo: true });
        }
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaFileAlt className="text-orange-500" /> Carta de Serviços
                    </h1>
                    <p className="text-gray-500 text-sm">Guia de serviços prestados ao cidadão.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg shadow-orange-200">
                    <FaPlus /> Novo Serviço
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(s => (
                    <div key={s.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 group hover:shadow-xl hover:-translate-y-1 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[9px] font-black uppercase px-2 py-1 bg-orange-50 text-orange-600 rounded">{s.categoria}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FaEdit size={12} /></button>
                                <button onClick={() => handleDelete(s.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><FaTrash size={12} /></button>
                            </div>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">{s.nome}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-4">{s.descricao}</p>
                        <div className="space-y-2 pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold"><FaMapMarkerAlt /> {s.local}</div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold"><FaClock /> {s.prazo}</div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-6">Cadastro de Serviço</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input required placeholder="Nome do Serviço" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                            <input required placeholder="Categoria" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                            <textarea placeholder="Descrição curta" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none" rows={2} />
                            <input placeholder="Local de Atendimento" value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                            <input placeholder="Prazo Médio" value={form.prazo} onChange={(e) => setForm({ ...form, prazo: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                            <textarea placeholder="Documentos/Requisitos" value={form.requisitos} onChange={(e) => setForm({ ...form, requisitos: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none" rows={2} />
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-gray-400 font-black uppercase text-[10px]">Cancelar</button>
                                <button type="submit" className="flex-1 bg-orange-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-orange-100">Salvar na Carta</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
