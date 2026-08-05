"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { 
    FaHeartbeat, 
    FaPlus, 
    FaEdit, 
    FaTrash, 
    FaUserMd, 
    FaFlask, 
    FaStethoscope, 
    FaAmbulance, 
    FaPhone, 
    FaClock, 
    FaMapMarkerAlt, 
    FaExternalLinkAlt, 
    FaSpinner, 
    FaSave,
    FaInfoCircle,
    FaSlidersH,
    FaList
} from "react-icons/fa";

type ItemFila = {
    id: string;
    tipo: string;
    totalPacientes: number;
    tempoEspera: string;
    procedimentos: string | null;
    icone: string;
    cor: string;
    ordem: number;
    ativo: boolean;
};

type ConfigRegulacao = {
    titulo: string;
    subtitulo: string;
    comoFunciona: string;
    telefone: string;
    horarioFuncionamento: string;
    endereco: string;
    linkSistemaExterno: string;
    documentoRegulamento: string;
};

const ICON_OPTIONS = [
    { label: "Médico / Especialidade", value: "FaUserMd", icon: FaUserMd },
    { label: "Exames / Laboratório", value: "FaFlask", icon: FaFlask },
    { label: "Cirurgias / Estetoscópio", value: "FaStethoscope", icon: FaStethoscope },
    { label: "Urgências / Ambulância", value: "FaAmbulance", icon: FaAmbulance },
    { label: "Saúde Geral / Coração", value: "FaHeartbeat", icon: FaHeartbeat },
];

const COLOR_OPTIONS = [
    { label: "Azul (Consultas)", value: "from-blue-500 to-indigo-600" },
    { label: "Verde (Exames)", value: "from-teal-500 to-emerald-600" },
    { label: "Roxo (Cirurgias)", value: "from-purple-500 to-violet-600" },
    { label: "Vermelho (Urgências)", value: "from-rose-500 to-red-600" },
    { label: "Laranja (Atendimento)", value: "from-amber-500 to-orange-600" },
];

export default function AdminCentralRegulacaoPage() {
    const [activeTab, setActiveTab] = useState<"filas" | "config">("filas");
    const [itens, setItens] = useState<ItemFila[]>([]);
    const [config, setConfig] = useState<ConfigRegulacao>({
        titulo: "Central de Regulação em Saúde",
        subtitulo: "Acompanhe as filas de espera para consultas especializadas, exames e cirurgias eletivas no SUS municipal.",
        comoFunciona: "A Central de Regulação de Saúde é responsável por organizar e garantir o acesso equânime dos cidadãos aos serviços de saúde de média e alta complexidade, respeitando critérios clínicos de prioridade e a ordem de chegada dos pedidos.",
        telefone: "(84) 3400-0000",
        horarioFuncionamento: "Segunda a Sexta, 07h às 13h",
        endereco: "Secretaria Municipal de Saúde de Lajes Pintadas",
        linkSistemaExterno: "",
        documentoRegulamento: ""
    });

    const [loading, setLoading] = useState(true);
    const [savingConfig, setSavingConfig] = useState(false);

    // Modal state for items
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ItemFila | null>(null);
    const [savingItem, setSavingItem] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Form fields for item
    const [itemFormData, setItemFormData] = useState({
        tipo: "",
        totalPacientes: 0,
        tempoEspera: "",
        procedimentos: "",
        icone: "FaUserMd",
        cor: "from-blue-500 to-indigo-600",
        ordem: 0,
        ativo: true
    });

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/central-regulacao");
            const data = await res.json();
            if (data.itens) setItens(data.itens);
            if (data.config) setConfig(data.config);
        } catch {
            toast.error("Erro ao carregar dados da regulação.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (item?: ItemFila) => {
        if (item) {
            setEditingItem(item);
            setItemFormData({
                tipo: item.tipo,
                totalPacientes: item.totalPacientes,
                tempoEspera: item.tempoEspera,
                procedimentos: item.procedimentos || "",
                icone: item.icone || "FaUserMd",
                cor: item.cor || "from-blue-500 to-indigo-600",
                ordem: item.ordem || 0,
                ativo: item.ativo
            });
        } else {
            setEditingItem(null);
            setItemFormData({
                tipo: "",
                totalPacientes: 0,
                tempoEspera: "",
                procedimentos: "",
                icone: "FaUserMd",
                cor: "from-blue-500 to-indigo-600",
                ordem: itens.length + 1,
                ativo: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSaveItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemFormData.tipo || !itemFormData.tempoEspera) {
            toast.error("Preencha o tipo de procedimento e o tempo de espera.");
            return;
        }

        setSavingItem(true);
        try {
            const url = editingItem
                ? `/api/admin/central-regulacao/${editingItem.id}`
                : "/api/admin/central-regulacao";
            
            const method = editingItem ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(itemFormData)
            });

            if (res.ok) {
                toast.success(editingItem ? "Fila atualizada com sucesso!" : "Fila cadastrada com sucesso!");
                setIsModalOpen(false);
                fetchData();
            } else {
                toast.error("Erro ao salvar dados da fila.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setSavingItem(false);
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta fila de regulação?")) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/central-regulacao/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Fila removida com sucesso!");
                fetchData();
            } else {
                toast.error("Erro ao remover fila.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleSaveConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingConfig(true);
        try {
            const res = await fetch("/api/admin/central-regulacao", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "config",
                    ...config
                })
            });

            if (res.ok) {
                toast.success("Configurações salvas com sucesso!");
            } else {
                toast.error("Erro ao salvar configurações.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setSavingConfig(false);
        }
    };

    const renderIcon = (iconName: string) => {
        const found = ICON_OPTIONS.find(i => i.value === iconName);
        const IconComp = found ? found.icon : FaUserMd;
        return <IconComp size={20} />;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <FaSpinner className="animate-spin text-4xl text-rose-600 mb-4" />
                <p className="text-gray-500 font-medium">Carregando dados da Central de Regulação...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto pb-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
                        <FaHeartbeat size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Central de Regulação em Saúde</h1>
                        <p className="text-gray-500 text-sm font-medium">Gerencie as filas de espera, procedimentos, estimativas e contatos da regulação municipal.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all hover:scale-105"
                    >
                        <FaPlus size={14} /> Adicionar Fila / Procedimento
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
                <button
                    onClick={() => setActiveTab("filas")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                        activeTab === "filas"
                            ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                    }`}
                >
                    <FaList size={14} /> Filas de Espera ({itens.length})
                </button>
                <button
                    onClick={() => setActiveTab("config")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                        activeTab === "config"
                            ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                    }`}
                >
                    <FaSlidersH size={14} /> Informações & Contatos da Regulação
                </button>
            </div>

            {/* TAB 1: FILAS DE ESPERA */}
            {activeTab === "filas" && (
                <div className="space-y-6">
                    {itens.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 border border-dashed border-gray-300 text-center">
                            <FaHeartbeat className="mx-auto text-4xl text-gray-300 mb-3" />
                            <h3 className="text-lg font-bold text-gray-700 mb-1">Nenhuma fila cadastrada ainda</h3>
                            <p className="text-gray-400 text-sm mb-6">Clique no botão abaixo para adicionar a primeira fila ou tipo de procedimento da regulação.</p>
                            <button
                                onClick={() => handleOpenModal()}
                                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-md inline-flex items-center gap-2 transition"
                            >
                                <FaPlus size={14} /> Adicionar Fila
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {itens.map((item) => (
                                <div 
                                    key={item.id} 
                                    className={`bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden transition-all duration-300 ${
                                        !item.ativo ? "opacity-60 bg-gray-50" : ""
                                    }`}
                                >
                                    <div className={`h-3 bg-gradient-to-r ${item.cor}`} />
                                    <div className="p-6">
                                        <div className="flex items-start justify-between gap-4 mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 bg-gradient-to-br ${item.cor} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md`}>
                                                    {renderIcon(item.icone)}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-gray-800 text-base uppercase tracking-tight">{item.tipo}</h3>
                                                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                                        item.ativo ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-700"
                                                    }`}>
                                                        {item.ativo ? "Ativo no Portal" : "Inativo"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(item)}
                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                                                    title="Editar Fila"
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    disabled={deletingId === item.id}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition disabled:opacity-50"
                                                    title="Excluir Fila"
                                                >
                                                    {deletingId === item.id ? <FaSpinner className="animate-spin" size={16} /> : <FaTrash size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Pacientes na Fila</span>
                                                <span className="text-3xl font-black text-gray-800">{item.totalPacientes}</span>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Tempo de Espera</span>
                                                <span className="text-xs font-black text-gray-700 leading-tight block mt-2">{item.tempoEspera}</span>
                                            </div>
                                        </div>

                                        {item.procedimentos && (
                                            <div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Exemplos / Procedimentos</span>
                                                <p className="text-xs text-gray-600 italic font-medium bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                                                    {item.procedimentos}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: CONFIGURAÇÕES GERAIS */}
            {activeTab === "config" && (
                <form onSubmit={handleSaveConfig} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                    <div className="border-b border-gray-100 pb-4 mb-6">
                        <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                            <FaInfoCircle className="text-rose-600" /> Informações exibidas no Portal Público
                        </h2>
                        <p className="text-xs text-gray-500">Ajuste os textos, avisos e dados de contato que os cidadãos veem ao acessar a Central de Regulação.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Título Principal da Página</label>
                            <input
                                value={config.titulo}
                                onChange={(e) => setConfig({ ...config, titulo: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium"
                                placeholder="Ex: Central de Regulação em Saúde"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subtítulo / Descrição Inicial</label>
                            <input
                                value={config.subtitulo}
                                onChange={(e) => setConfig({ ...config, subtitulo: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium"
                                placeholder="Ex: Acompanhe as filas de espera para consultas especializadas..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Texto Explicativo "Como Funciona a Regulação"</label>
                            <textarea
                                value={config.comoFunciona}
                                onChange={(e) => setConfig({ ...config, comoFunciona: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium resize-none"
                                placeholder="Explique o fluxo desde o atendimento na UBS até o agendamento..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                <FaPhone className="text-rose-500" /> Telefone / WhatsApp de Contato
                            </label>
                            <input
                                value={config.telefone}
                                onChange={(e) => setConfig({ ...config, telefone: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium"
                                placeholder="Ex: (84) 3400-0000"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                <FaClock className="text-rose-500" /> Horário de Atendimento
                            </label>
                            <input
                                value={config.horarioFuncionamento}
                                onChange={(e) => setConfig({ ...config, horarioFuncionamento: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium"
                                placeholder="Ex: Segunda a Sexta, 07h às 13h"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-rose-500" /> Endereço / Local de Atendimento
                            </label>
                            <input
                                value={config.endereco}
                                onChange={(e) => setConfig({ ...config, endereco: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium"
                                placeholder="Ex: Secretaria Municipal de Saúde de Lajes Pintadas"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                <FaExternalLinkAlt className="text-rose-500" /> Link do Sistema Externo (ex: SISREG / Regula RN)
                            </label>
                            <input
                                value={config.linkSistemaExterno}
                                onChange={(e) => setConfig({ ...config, linkSistemaExterno: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={savingConfig}
                            className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition disabled:opacity-50"
                        >
                            {savingConfig ? <FaSpinner className="animate-spin" /> : <FaSave />}
                            Salvar Configurações
                        </button>
                    </div>
                </form>
            )}

            {/* MODAL DE CADASTRO / EDIÇÃO DE FILA */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                                <FaHeartbeat className="text-rose-600" />
                                {editingItem ? "Editar Fila de Regulação" : "Nova Fila de Regulação"}
                            </h2>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSaveItem} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome / Tipo da Fila *</label>
                                <input
                                    value={itemFormData.tipo}
                                    onChange={(e) => setItemFormData({ ...itemFormData, tipo: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                                    placeholder="Ex: Consultas Especializadas, Exames de Imagem..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pacientes na Fila</label>
                                    <input
                                        type="number"
                                        value={itemFormData.totalPacientes}
                                        onChange={(e) => setItemFormData({ ...itemFormData, totalPacientes: Number(e.target.value) })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                                        placeholder="Ex: 143"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tempo de Espera *</label>
                                    <input
                                        value={itemFormData.tempoEspera}
                                        onChange={(e) => setItemFormData({ ...itemFormData, tempoEspera: e.target.value })}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                                        placeholder="Ex: 15 a 60 dias úteis"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Exemplos de Procedimentos / Especialidades</label>
                                <textarea
                                    value={itemFormData.procedimentos}
                                    onChange={(e) => setItemFormData({ ...itemFormData, procedimentos: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm resize-none"
                                    placeholder="Ex: Cardiologia, Ortopedia, Neurologia..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ícone</label>
                                    <select
                                        value={itemFormData.icone}
                                        onChange={(e) => setItemFormData({ ...itemFormData, icone: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                                    >
                                        {ICON_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estilo de Cor</label>
                                    <select
                                        value={itemFormData.cor}
                                        onChange={(e) => setItemFormData({ ...itemFormData, cor: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                                    >
                                        {COLOR_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="itemAtivo"
                                    checked={itemFormData.ativo}
                                    onChange={(e) => setItemFormData({ ...itemFormData, ativo: e.target.checked })}
                                    className="w-5 h-5 accent-rose-600"
                                />
                                <label htmlFor="itemAtivo" className="text-sm font-bold text-gray-700">
                                    Ativo (Exibir publicamente no portal)
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingItem}
                                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md text-sm flex items-center gap-2 disabled:opacity-50"
                                >
                                    {savingItem ? <FaSpinner className="animate-spin" /> : "Salvar Fila"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
