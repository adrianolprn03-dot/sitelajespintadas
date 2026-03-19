"use client";
import { useState, useEffect } from "react";
import { FaInbox, FaSpinner, FaSearch, FaEye, FaTrash, FaCheckCircle, FaClock } from "react-icons/fa";
import toast from "react-hot-toast";

type Contato = {
    id: string;
    nome: string;
    email: string;
    assunto: string;
    mensagem: string;
    respondido: boolean;
    criadoEm: string;
};

export default function AdminContatosPage() {
    const [items, setItems] = useState<Contato[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Contato | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/contatos");
            const data = await res.json();
            setItems(data || []);
        } catch {
            toast.error("Erro ao carregar mensagens");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const markAsRead = async (id: string, current: boolean) => {
        try {
            await fetch(`/api/contatos/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ respondido: !current }),
            });
            fetchData();
        } catch {
            toast.error("Erro ao atualizar status");
        }
    };

    const deleteMsg = async (id: string) => {
        if (!confirm("Excluir esta mensagem?")) return;
        try {
            await fetch(`/api/contatos/${id}`, { method: "DELETE" });
            toast.success("Mensagem removida");
            setSelected(null);
            fetchData();
        } catch {
            toast.error("Erro ao excluir");
        }
    };

    const filtered = items.filter(i =>
        i.nome.toLowerCase().includes(search.toLowerCase()) ||
        i.assunto.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaInbox className="text-secondary-500" /> Fale Conosco
                </h1>
                <p className="text-gray-500 text-sm">Gerencie as mensagens recebidas através do formulário de contato do site.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de Mensagens */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Filtrar mensagens..."
                                className="input-field pl-10 h-10 text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
                        {loading ? (
                            <div className="p-10 text-center"><FaSpinner className="animate-spin inline-block text-primary-500" /></div>
                        ) : filtered.length === 0 ? (
                            <div className="p-10 text-center text-gray-400 italic text-sm">Nenhuma mensagem.</div>
                        ) : (
                            filtered.map((i) => (
                                <button
                                    key={i.id}
                                    onClick={() => setSelected(i)}
                                    className={`w-full text-left p-4 border-b border-gray-50 transition-colors ${selected?.id === i.id ? "bg-primary-50" : "hover:bg-gray-50"} ${!i.respondido ? "border-l-4 border-l-primary-500" : ""}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-gray-800 text-sm truncate">{i.nome}</span>
                                        <span className="text-[10px] text-gray-400 shrink-0">{new Date(i.criadoEm).toLocaleDateString("pt-BR")}</span>
                                    </div>
                                    <div className="text-xs text-primary-600 font-medium mb-1 truncate">{i.assunto}</div>
                                    <div className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{i.mensagem}</div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Detalhes da Mensagem */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
                    {selected ? (
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/20">
                                <div>
                                    <h2 className="font-bold text-gray-800">{selected.assunto}</h2>
                                    <p className="text-xs text-gray-400">De: {selected.nome} ({selected.email})</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => markAsRead(selected.id, selected.respondido)}
                                        className={`p-2 rounded-lg transition-colors ${selected.respondido ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-50 hover:text-primary-600"}`}
                                        title={selected.respondido ? "Marcada como respondida" : "Marcar como respondida"}
                                    >
                                        <FaCheckCircle />
                                    </button>
                                    <button
                                        onClick={() => deleteMsg(selected.id)}
                                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                        title="Excluir mensagem"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            <div className="p-8 flex-1 overflow-y-auto whitespace-pre-wrap text-gray-600 leading-relaxed">
                                {selected.mensagem}
                            </div>
                            <div className="p-6 border-t border-gray-100 bg-gray-50/10">
                                <a
                                    href={`mailto:${selected.email}?subject=RES: ${selected.assunto}`}
                                    className="btn-primary inline-flex items-center gap-2 px-8"
                                >
                                    Responder por E-mail
                                </a>
                                <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                                    <FaClock size={8} /> Recebida em {new Date(selected.criadoEm).toLocaleString("pt-BR")}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 p-10 text-center">
                            <FaInbox size={48} className="mb-4 opacity-20" />
                            <p className="text-lg">Selecione uma mensagem para ler os detalhes.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
