"use client";
import { useState, useEffect } from "react";
import { FaBullhorn, FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaBriefcase, FaLock, FaCheckCircle, FaFileUpload, FaLink, FaExternalLinkAlt, FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";

type Concurso = {
    id: string;
    titulo: string;
    linkEdital: string;
    tipo: string;
    vagas: string;
    descricao: string;
    dataPublicacao: string;
    status: string;
    ativo: boolean;
};

export default function AdminEditaisPage() {
    const [items, setItems] = useState<Concurso[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMode, setUploadMode] = useState<"url" | "file">("url");
    const [form, setForm] = useState({
        titulo: "",
        linkEdital: "",
        tipo: "Edital",
        vagas: "",
        descricao: "",
        dataPublicacao: new Date().toISOString().split('T')[0],
        status: "aberto",
        ativo: true
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            // Using the same endpoint but we will filter locally or via endpoint if supported.
            // The /api/admin/concursos currently fetches all, let's filter by type.
            const res = await fetch("/api/admin/concursos", { cache: "no-store" });
            const data = await res.json();
            const editais = data.filter((item: any) => item.tipo.toLowerCase() === "edital");
            setItems(editais || []);
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
                linkEdital: item.linkEdital || "",
                tipo: item.tipo,
                vagas: item.vagas || "",
                descricao: item.descricao || "",
                dataPublicacao: item.dataPublicacao ? new Date(item.dataPublicacao).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                status: item.status,
                ativo: item.ativo
            });
            setUploadMode(item.linkEdital?.startsWith('http') ? "url" : "file");
        } else {
            setEditingId(null);
            setForm({ titulo: "", linkEdital: "", tipo: "Edital", vagas: "", descricao: "", dataPublicacao: new Date().toISOString().split('T')[0], status: "aberto", ativo: true });
            setUploadMode("url");
        }
        setShowModal(true);
    };

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                setForm({ ...form, linkEdital: data.url });
                toast.success("Arquivo enviado com sucesso!");
            } else {
                toast.error("Erro no upload");
            }
        } catch (error) {
            toast.error("Erro ao enviar arquivo");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/admin/concursos/${editingId}` : "/api/admin/concursos";
            const method = editingId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                toast.success("Salvo com sucesso");
                setShowModal(false);
                fetchData();
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || "Erro ao salvar");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro de conexão");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este edital? Esta ação não pode ser desfeita.")) return;

        try {
            const res = await fetch(`/api/admin/concursos/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Excluído com sucesso");
                fetchData();
            } else {
                toast.error("Erro ao excluir");
            }
        } catch {
            toast.error("Erro de conexão");
        }
    };

    const filteredItems = items.filter(i => i.titulo.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaBullhorn className="text-blue-500" /> Editais Diversos
                    </h1>
                    <p className="text-gray-500 text-sm">Gerencie editais, chamamentos públicos e notificações.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-colors">
                    <FaPlus /> Novo Edital
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <input type="text" placeholder="Buscar edital..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm w-full md:w-auto" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                <th className="px-6 py-4">Título / Documento</th>
                                <th className="px-6 py-4">Informações</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredItems.map(i => (
                                <tr key={i.id} className="hover:bg-gray-50 group transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-700">{i.titulo}</div>
                                        {i.descricao && (
                                            <div className="text-[10px] text-gray-500 line-clamp-1 italic mb-1">
                                                {i.descricao}
                                            </div>
                                        )}
                                        <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                            <FaLink className="text-[8px]" /> {i.linkEdital ? (i.linkEdital.length > 40 ? i.linkEdital.substring(0, 40) + "..." : i.linkEdital) : 'Sem documento'}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-xs font-bold text-gray-500">
                                        {i.dataPublicacao ? new Date(i.dataPublicacao).toLocaleDateString('pt-BR') : '-'}
                                        {i.vagas && <span className="block mt-1 text-[10px] bg-gray-200 px-2 py-0.5 rounded-full w-max">{i.vagas} Vagas</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {i.status === 'aberto' ? <span className="text-emerald-500 text-[10px] font-black uppercase"><FaCheckCircle className="inline mr-1" /> Aberto</span> : <span className="text-gray-400 text-[10px] font-black uppercase"><FaLock className="inline mr-1" /> Finalizado</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenModal(i)} className="text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Editar"><FaEdit /></button>
                                        <button onClick={() => handleDelete(i.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors" title="Excluir"><FaTrash /></button>
                                    </td>

                                </tr>
                            ))}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">
                                        Nenhum edital encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-black text-gray-800 uppercase mb-6">Cadastro de Edital</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Título do Edital / Chamamento</label>
                                <input required placeholder="Ex: Edital de Chamamento 001/2026" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Edital / Documento PDF</label>
                                <div className="flex bg-gray-100 p-1 rounded-xl">
                                    <button 
                                        type="button"
                                        onClick={() => setUploadMode("url")}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${uploadMode === 'url' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <FaLink /> Link Externo
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setUploadMode("file")}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${uploadMode === 'file' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <FaFileUpload /> Upload PDF
                                    </button>
                                </div>

                                {uploadMode === 'url' ? (
                                    <input 
                                        required 
                                        placeholder="https://..." 
                                        value={form.linkEdital} 
                                        onChange={(e) => setForm({ ...form, linkEdital: e.target.value })} 
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                                    />
                                ) : (
                                    <div className="space-y-2">
                                        {!form.linkEdital ? (
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-blue-400 transition-all cursor-pointer group">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    {uploading ? (
                                                        <FaSpinner className="text-2xl text-blue-500 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <FaFileUpload className="text-2xl text-gray-300 group-hover:text-blue-500 mb-2 transition-colors" />
                                                            <p className="text-[10px] font-black uppercase text-gray-400 group-hover:text-blue-600 transition-colors">Selecionar PDF</p>
                                                        </>
                                                    )}
                                                </div>
                                                <input type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} disabled={uploading} />
                                            </label>
                                        ) : (
                                            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                                                        <FaFileUpload />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-[10px] font-black uppercase text-blue-600 truncate">Arquivo Carregado</p>
                                                        <p className="text-xs font-bold text-gray-600 truncate">{form.linkEdital.split('/').pop()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <a href={form.linkEdital} target="_blank" className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                                                        <FaExternalLinkAlt size={12} />
                                                    </a>
                                                    <button type="button" onClick={() => setForm({ ...form, linkEdital: "" })} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                        <FaTrashAlt size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Descrição / Resumo</label>
                                <textarea 
                                    placeholder="Breve descrição sobre o objeto do edital..." 
                                    value={form.descricao} 
                                    onChange={(e) => setForm({ ...form, descricao: e.target.value })} 
                                    rows={3}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Informação Adicional (Ex: Vagas)</label>
                                    <input placeholder="Ex: N/A" value={form.vagas} onChange={(e) => setForm({ ...form, vagas: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Data Publicação</label>
                                    <input 
                                        type="date" 
                                        required
                                        min="2000-01-01"
                                        max="2099-12-31"
                                        value={form.dataPublicacao} 
                                        onChange={(e) => setForm({ ...form, dataPublicacao: e.target.value })} 
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" 
                                    />
                                </div>

                            </div>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                                <option value="aberto">Em Andamento</option>
                                <option value="encerrado">Finalizado</option>
                            </select>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-gray-400 font-black uppercase text-[10px] py-3 hover:bg-gray-100 rounded-xl transition-colors">Cancelar</button>
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black uppercase text-[10px] hover:bg-blue-700 transition-colors shadow-md">Salvar Edital</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
