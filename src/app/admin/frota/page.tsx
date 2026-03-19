"use client";
import { useState, useEffect } from "react";
import { FaCar, FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaCheckCircle, FaTools } from "react-icons/fa";
import toast from "react-hot-toast";

type Veiculo = {
    id: string;
    modelo: string;
    placa: string;
    ano: string;
    secretaria: string;
    tipo: string;
    status: string;
};

export default function AdminFrotaPage() {
    const [items, setItems] = useState<Veiculo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({
        modelo: "",
        placa: "",
        ano: "",
        secretaria: "Gabinete do Prefeito",
        tipo: "Automóvel",
        status: "em-uso"
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/frota");
            const data = await res.json();
            setItems(data || []);
        } catch {
            toast.error("Erro ao carregar frota");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (item?: Veiculo) => {
        if (item) {
            setEditingId(item.id);
            setForm({
                modelo: item.modelo,
                placa: item.placa,
                ano: item.ano,
                secretaria: item.secretaria,
                tipo: item.tipo,
                status: item.status
            });
        } else {
            setEditingId(null);
            setForm({ modelo: "", placa: "", ano: "", secretaria: "Gabinete do Prefeito", tipo: "Automóvel", status: "em-uso" });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/admin/frota/${editingId}` : "/api/admin/frota";
            const method = editingId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                toast.success(editingId ? "Veículo atualizado" : "Veículo cadastrado");
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
        if (!confirm("Deseja excluir este veículo?")) return;
        try {
            const res = await fetch(`/api/admin/frota/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Removido com sucesso");
                fetchData();
            }
        } catch {
            toast.error("Erro ao remover");
        }
    };

    const filteredItems = items.filter(i => 
        i.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.placa.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaCar className="text-blue-600" /> Frota Municipal
                    </h1>
                    <p className="text-gray-500 text-sm">Gerencie o patrimônio de veículos e máquinas do município.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                >
                    <FaPlus /> Novo Veículo
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 text-left">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input 
                            type="text" 
                            placeholder="Buscar por placa ou modelo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                <th className="px-6 py-4">Veículo / Placa</th>
                                <th className="px-6 py-4">Secretaria</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <FaSpinner className="animate-spin inline-block text-blue-500 text-2xl" />
                                    </td>
                                </tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhum veículo encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((i) => (
                                    <tr key={i.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-700 uppercase text-xs tracking-tight">{i.modelo}</div>
                                            <div className="text-[10px] text-gray-400 font-mono tracking-widest">{i.placa} ({i.ano})</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[9px] font-black uppercase px-2 py-1 bg-blue-50 text-blue-600 rounded border border-blue-100">
                                                {i.secretaria}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {i.status === 'em-uso' ? (
                                                <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-widest font-bold">
                                                    <FaCheckCircle size={10} /> Em Uso
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-orange-500 text-[10px] font-black uppercase tracking-widest font-bold">
                                                    <FaTools size={10} /> Manutenção
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
                    <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in duration-200">
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-6">
                            {editingId ? "Editar Veículo" : "Novo Veículo"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Modelo</label>
                                    <input required value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder="Ex: Fiat Cronos" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Placa</label>
                                    <input required value={form.placa} onChange={(e) => setForm({ ...form, placa: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder="QGF-0000" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ano</label>
                                    <input required value={form.ano} onChange={(e) => setForm({ ...form, ano: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder="2024" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo</label>
                                    <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                                        <option value="Automóvel">Automóvel</option>
                                        <option value="Ambulância">Ambulância</option>
                                        <option value="Ônibus Escolar">Ônibus Escolar</option>
                                        <option value="Máquina Pesada">Máquina Pesada</option>
                                        <option value="Caminhão">Caminhão</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secretaria Responsável</label>
                                <input required value={form.secretaria} onChange={(e) => setForm({ ...form, secretaria: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status Atual</label>
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                                    <option value="em-uso">Em Operação</option>
                                    <option value="manutencao">Em Manutenção</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] text-gray-400">Cancelar</button>
                                <button type="submit" className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-200">Salvar Veículo</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
