"use client";
import { useState, useEffect } from "react";
import { FaFile, FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaMapMarker, FaClock } from "react-icons/fa";
import toast from "react-hot-toast";

type Servico = {
    id: string;
    nome: string;
    categoria: string;
    descricao: string;
    local: string;
    prazo: string;
    requisitos: string;
    etapas: string;
    formasAcesso: string;
    prioridades: string;
    previsaoEspera: string;
    statusServico: string;
    linkAcesso: string;
    linkAvaliacao: string;
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
        requisitos: "",
        etapas: "",
        formasAcesso: "",
        prioridades: "Atendimento preferencial por lei",
        previsaoEspera: "15-30 minutos",
        statusServico: "Consulta presencial ou via telefone",
        linkAcesso: "",
        linkAvaliacao: "/transparencia/carta-servicos/avaliar",
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
                toast.success("Serviço salvo com sucesso");
                setShowModal(false);
                fetchData();
            }
        } catch {
            toast.error("Erro ao processar requisição");
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
            setForm({ 
                nome: "", 
                categoria: "Geral", 
                descricao: "", 
                local: "Sede da Prefeitura", 
                prazo: "Imediato", 
                requisitos: "RG, CPF", 
                etapas: "Solicitação no balcão de atendimento",
                formasAcesso: "Presencial",
                prioridades: "Prioridade legal (idosos, gestantes, PCD)",
                previsaoEspera: "15 minutos",
                statusServico: "Protocolo físico",
                linkAcesso: "",
                linkAvaliacao: "/transparencia/carta-servicos/avaliar",
                ativo: true 
            });
        }
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaFile className="text-orange-500" /> Carta de Serviços - PNTP 2026
                    </h1>
                    <p className="text-gray-500 text-sm">Gerencie o guia de serviços públicos com campos de conformidade legal.</p>
                </div>
                <div className="flex gap-3">
                    <a href="/admin/carta-servicos/avaliacoes" className="bg-white text-gray-700 px-6 py-3 rounded-2xl font-bold transition-all border border-gray-100 hover:bg-gray-50 flex items-center gap-2 shadow-sm">
                        Ver Avaliações
                    </a>
                    <button onClick={() => handleOpenModal()} className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg shadow-orange-200 hover:scale-105 transition-all">
                        <FaPlus /> Novo Serviço
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center"><FaSpinner className="animate-spin text-orange-500" size={30} /></div>
            ) : (
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
                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold"><FaMapMarker /> {s.local}</div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold"><FaClock /> {s.prazo}</div>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && <div className="col-span-full py-20 text-center text-gray-400 font-medium">Nenhum serviço cadastrado.</div>}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Cadastro de Serviço PNTP</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-300 hover:text-gray-500">✕</button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Nome do Serviço</label>
                                    <input required placeholder="Ex: e-SIC" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-200" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Categoria</label>
                                    <input required placeholder="Ex: Transparência" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-200" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Descrição Completa</label>
                                <textarea required placeholder="Descreva o que é o serviço..." value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-orange-200" rows={2} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Canais de Acesso (Presencial, Online...)</label>
                                    <input required value={form.formasAcesso} onChange={(e) => setForm({ ...form, formasAcesso: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Local/Secretaria Responsável</label>
                                    <input required value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Prazo de Conclusão</label>
                                    <input required value={form.prazo} onChange={(e) => setForm({ ...form, prazo: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Tempo de Espera (Atendimento)</label>
                                    <input required value={form.previsaoEspera} onChange={(e) => setForm({ ...form, previsaoEspera: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Requisitos e Documentos Necessários</label>
                                <textarea placeholder="RG, CPF, Comprovante..." value={form.requisitos} onChange={(e) => setForm({ ...form, requisitos: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none" rows={2} />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Etapas do Processo</label>
                                <textarea placeholder="1. Solicitação; 2. Análise; 3. Resposta" value={form.etapas} onChange={(e) => setForm({ ...form, etapas: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none" rows={2} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Atendimento Prioritário</label>
                                    <input value={form.prioridades} onChange={(e) => setForm({ ...form, prioridades: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Como consultar status/resultado</label>
                                    <input value={form.statusServico} onChange={(e) => setForm({ ...form, statusServico: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Link de Acesso Direto (URL)</label>
                                    <input placeholder="https://..." value={form.linkAcesso || ""} onChange={(e) => setForm({ ...form, linkAcesso: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-gray-50">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-gray-400 font-black uppercase text-[10px] hover:text-gray-600 transition-colors">Voltar</button>
                                <button type="submit" className="flex-[2] bg-orange-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all">Salvar na Carta de Serviços</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
