"use client";
import { useState, useEffect } from "react";
import { FaCapsules, FaPlus, FaEdit, FaTrash, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

type Medicamento = {
    id: string;
    nome: string;
    categoria: string;
    status: string;
    observacao: string | null;
    ativo: boolean;
};

export default function AdminMedicamentosPage() {
    const [items, setItems] = useState<Medicamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({
        nome: "",
        categoria: "Básico",
        status: "disponivel",
        observacao: "",
        ativo: true
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/medicamentos");
            const data = await res.json();
            setItems(data || []);
        } catch {
            toast.error("Erro ao carregar medicamentos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (item?: Medicamento) => {
        if (item) {
            setEditingId(item.id);
            setForm({
                nome: item.nome,
                categoria: item.categoria,
                status: item.status,
                observacao: item.observacao || "",
                ativo: item.ativo
            });
        } else {
            setEditingId(null);
            setForm({ nome: "", categoria: "Básico", status: "disponivel", observacao: "", ativo: true });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/admin/medicamentos/${editingId}` : "/api/admin/medicamentos";
            const method = editingId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                toast.success(editingId ? "Medicamento atualizado" : "Medicamento criado");
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
        if (!confirm("Deseja excluir este medicamento?")) return;
        try {
            const res = await fetch(`/api/admin/medicamentos/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Removido com sucesso");
                fetchData();
            }
        } catch {
            toast.error("Erro ao remover");
        }
    };

    const filteredItems = items.filter(i => 
        i.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaCapsules className="text-rose-500" /> Gerenciar Medicamentos (REMUME)
                    </h1>
                    <p className="text-gray-500 text-sm">Controle a disponibilidade de remédios na rede municipal.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-rose-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg shadow-rose-200 hover:bg-rose-700 hover:-translate-y-1 transition-all"
                >
                    <FaPlus /> Novo Medicamento
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input 
                            type="text" 
                            placeholder="Buscar por nome ou categoria..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-rose-500/20 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                <th className="px-6 py-4">Medicamento</th>
                                <th className="px-6 py-4">Categoria</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <FaSpinner className="animate-spin inline-block text-rose-500 text-2xl" />
                                    </td>
                                </tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhum medicamento encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((i) => (
                                    <tr key={i.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-700 uppercase text-xs tracking-tight">{i.nome}</div>
                                            <div className="text-[10px] text-gray-400 italic">{i.observacao || "Sem observações"}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black uppercase px-3 py-1 bg-gray-100 rounded-full text-gray-500 tracking-wider">
                                                {i.categoria}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {i.status === 'disponivel' ? (
                                                <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                                    <FaCheckCircle /> Disponível
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-rose-500 text-[10px] font-black uppercase tracking-widest">
                                                    <FaExclamationTriangle /> Em Falta
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleOpenModal(i)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDelete(i.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

            {/* Modal de Cadastro/Edição */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-6">
                            {editingId ? "Editar Medicamento" : "Novo Medicamento"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome do Medicamento</label>
                                <input 
                                    required
                                    value={form.nome}
                                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-rose-500/20 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoria</label>
                                    <select 
                                        value={form.categoria}
                                        onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-rose-500/20 outline-none"
                                    >
                                        <option value="Básico">Básico</option>
                                        <option value="Hiperdia">Hiperdia</option>
                                        <option value="Respira Mais">Respira Mais</option>
                                        <option value="Analgésico">Analgésico</option>
                                        <option value="Antibiótico">Antibiótico</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                                    <select 
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-rose-500/20 outline-none"
                                    >
                                        <option value="disponivel">Disponível</option>
                                        <option value="em-falta">Em Falta</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Observações</label>
                                <textarea 
                                    value={form.observacao}
                                    onChange={(e) => setForm({ ...form, observacao: e.target.value })}
                                    rows={2}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-rose-500/20 outline-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:bg-gray-50 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 bg-rose-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all"
                                >
                                    Salvar Dados
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
