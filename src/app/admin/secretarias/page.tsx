"use client";
import { useState, useEffect } from "react";
import { FaBuilding, FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaImage, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";

type Secretaria = {
    id: string;
    nome: string;
    secretario: string;
    email: string;
    telefone: string;
    endereco: string;
    horarioFuncionamento: string;
    descricao: string;
    imagem: string;
    ativa: boolean;
    ordem: number;
};

export default function AdminSecretariasPage() {
    const [items, setItems] = useState<Secretaria[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({
        nome: "",
        secretario: "",
        email: "",
        telefone: "",
        endereco: "",
        horarioFuncionamento: "08:00 às 14:00",
        descricao: "",
        imagem: "",
        ativa: true,
        ordem: 0
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/secretarias");
            const data = await res.json();
            setItems(data || []);
        } catch {
            toast.error("Erro ao carregar secretarias");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (item?: Secretaria) => {
        if (item) {
            setEditingId(item.id);
            setForm({
                nome: item.nome,
                secretario: item.secretario || "",
                email: item.email || "",
                telefone: item.telefone || "",
                endereco: item.endereco || "",
                horarioFuncionamento: item.horarioFuncionamento || "08:00 às 14:00",
                descricao: item.descricao || "",
                imagem: item.imagem || "",
                ativa: item.ativa,
                ordem: item.ordem || 0
            });
        } else {
            setEditingId(null);
            setForm({
                nome: "",
                secretario: "",
                email: "",
                telefone: "",
                endereco: "",
                horarioFuncionamento: "08:00 às 14:00",
                descricao: "",
                imagem: "",
                ativa: true,
                ordem: 0
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/secretarias/${editingId}` : "/api/secretarias";
            const method = editingId ? "PATCH" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                toast.success(editingId ? "Secretaria atualizada" : "Secretaria criada");
                setShowModal(false);
                fetchData();
            } else {
                const err = await res.json();
                toast.error(err.error || "Erro ao salvar");
            }
        } catch {
            toast.error("Erro na conexão");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta secretaria? Isso pode afetar notícias vinculadas.")) return;
        try {
            const res = await fetch(`/api/secretarias/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Secretaria removida");
                fetchData();
            }
        } catch {
            toast.error("Erro ao excluir");
        }
    };

    const filteredItems = items.filter(i => 
        i.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (i.secretario && i.secretario.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 tracking-tight">
                        <FaBuilding className="text-blue-600" /> Gestão de Secretarias
                    </h1>
                    <p className="text-gray-500 text-sm">Gerencie a estrutura administrativa e os responsáveis pelas pastas.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                >
                    <FaPlus /> Nova Secretaria
                </button>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative max-w-md w-full">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input 
                            type="text" 
                            placeholder="Buscar por nome ou secretário..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                    </div>
                    <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        Total: {items.length} pastas
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                <th className="px-6 py-4">Secretaria</th>
                                <th className="px-6 py-4">Secretário(a)</th>
                                <th className="px-6 py-4">Contatos</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-blue-600">
                                        <FaSpinner className="animate-spin inline-block text-2xl" />
                                    </td>
                                </tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhuma secretaria encontrada.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((i) => (
                                    <tr key={i.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
                                                    {i.imagem ? (
                                                        <img src={i.imagem} alt={i.nome} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FaBuilding className="text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-700 text-sm tracking-tight">{i.nome}</div>
                                                    <div className="text-[10px] text-gray-400 font-mono">ID: {i.id.substring(0,8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-600">{i.secretario || "A definir"}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="text-[10px] text-gray-400 flex items-center gap-1 font-bold italic"><FaEnvelope /> {i.email || "-"}</div>
                                                <div className="text-[10px] text-gray-400 flex items-center gap-1 font-bold italic"><FaPhone /> {i.telefone || "-"}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {i.ativa ? (
                                                <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                                    <FaCheckCircle /> Ativa
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-rose-400 text-[10px] font-black uppercase tracking-widest">
                                                    <FaTimesCircle /> Inativa
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleOpenModal(i)}
                                                    className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(i.id)}
                                                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <FaTrash size={16} />
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

            {/* Modal de Formulário */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-3xl p-8 shadow-2xl shadow-black/20 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter">
                                {editingId ? "Editar Secretaria" : "Cadastrar Nova Pasta"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-2">
                                <FaTimesCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nome da Secretaria</label>
                                    <input 
                                        required
                                        value={form.nome}
                                        onChange={(e) => setForm({...form, nome: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                        placeholder="Ex: Secretaria Mun. de Saúde"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nome do Secretário(a)</label>
                                    <input 
                                        required
                                        value={form.secretario}
                                        onChange={(e) => setForm({...form, secretario: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                        placeholder="Nome Completo"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">E-mail Oficial</label>
                                    <input 
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({...form, email: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                        placeholder="saude@lajespintadas.rn.gov.br"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Telefone / WhatsApp</label>
                                    <input 
                                        value={form.telefone}
                                        onChange={(e) => setForm({...form, telefone: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                        placeholder="(84) 0000-0000"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Endereço Completo</label>
                                    <input 
                                        value={form.endereco}
                                        onChange={(e) => setForm({...form, endereco: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                        placeholder="Rua, Número, Bairro - Centro"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Horário de Funcionamento</label>
                                    <input 
                                        value={form.horarioFuncionamento}
                                        onChange={(e) => setForm({...form, horarioFuncionamento: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                        placeholder="Segunda a Sexta, 08h às 14h"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <ImageUpload 
                                        label="Imagem da Secretaria"
                                        value={form.imagem}
                                        onChange={(url) => setForm({...form, imagem: url})}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Descrição / Competências</label>
                                    <textarea 
                                        rows={4}
                                        value={form.descricao}
                                        onChange={(e) => setForm({...form, descricao: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                        placeholder="Descreva as funções desta secretaria..."
                                    />
                                </div>
                                <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl">
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="ativa"
                                            checked={form.ativa}
                                            onChange={(e) => setForm({...form, ativa: e.target.checked})}
                                            className="w-5 h-5 rounded-lg border-gray-200 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="ativa" className="text-xs font-black uppercase text-gray-500">Documento Ativo</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs font-black uppercase text-gray-500">Ordem:</label>
                                        <input 
                                            type="number"
                                            value={form.ordem}
                                            onChange={(e) => setForm({...form, ordem: Number(e.target.value)})}
                                            className="w-16 bg-white border border-gray-100 rounded-lg px-2 py-1 text-xs font-bold outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:bg-gray-50 transition-all border border-gray-100"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                                >
                                    Salvar Secretaria
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
