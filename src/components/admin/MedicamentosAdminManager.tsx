"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    FaCapsules,
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaCheckCircle,
    FaExclamationTriangle,
    FaSpinner,
    FaUpload,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";
import toast from "react-hot-toast";

export type MedicamentoAdmin = {
    id: string;
    nome: string;
    principioAtivo: string | null;
    apresentacao: string | null;
    unidadeMedida: string | null;
    categoria: string;
    tipoComponente: string | null;
    quantidadeEstoque: number | null;
    estoqueMinimo: number | null;
    unidadeSaude: string | null;
    loteValidade: string | null;
    status: string;
    observacao: string | null;
    ativo: boolean;
    atualizadoEm?: string;
};

const EMPTY_FORM = {
    nome: "",
    principioAtivo: "",
    apresentacao: "Comprimido / Frasco",
    unidadeMedida: "Unidade",
    categoria: "Analgésico",
    tipoComponente: "Básico (CBAF)",
    quantidadeEstoque: 0,
    estoqueMinimo: 10,
    unidadeSaude: "CAF / Farmácia Básica Municipal",
    loteValidade: "",
    status: "disponivel",
    observacao: "",
    ativo: true,
};

export default function MedicamentosAdminManager() {
    const [medicamentos, setMedicamentos] = useState<MedicamentoAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MedicamentoAdmin | null>(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchMedicamentos = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/medicamentos", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setMedicamentos(Array.isArray(data) ? data : []);
            } else {
                toast.error("Erro ao carregar medicamentos.");
            }
        } catch {
            toast.error("Falha de conexão ao carregar medicamentos.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMedicamentos();
    }, [fetchMedicamentos]);

    const handleOpenModal = (item?: MedicamentoAdmin) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                nome: item.nome,
                principioAtivo: item.principioAtivo || "",
                apresentacao: item.apresentacao || "Comprimido / Frasco",
                unidadeMedida: item.unidadeMedida || "Unidade",
                categoria: item.categoria || "Outros",
                tipoComponente: item.tipoComponente || "Básico (CBAF)",
                quantidadeEstoque: item.quantidadeEstoque ?? 0,
                estoqueMinimo: item.estoqueMinimo ?? 10,
                unidadeSaude: item.unidadeSaude || "CAF / Farmácia Básica Municipal",
                loteValidade: item.loteValidade || "",
                status: item.status || "disponivel",
                observacao: item.observacao || "",
                ativo: item.ativo,
            });
        } else {
            setEditingItem(null);
            setFormData(EMPTY_FORM);
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editingItem
                ? `/api/admin/medicamentos/${editingItem.id}`
                : "/api/admin/medicamentos";
            const method = editingItem ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                toast.success(
                    editingItem
                        ? "Medicamento atualizado com sucesso!"
                        : "Medicamento cadastrado com sucesso!"
                );
                setIsModalOpen(false);
                fetchMedicamentos();
            } else {
                toast.error(data.error || "Erro ao salvar medicamento.");
            }
        } catch {
            toast.error("Falha na requisição ao salvar medicamento.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, nome: string) => {
        if (!confirm(`Tem certeza que deseja excluir o medicamento "${nome}" do REMUME?`)) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/medicamentos/${id}`, { method: "DELETE" });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setMedicamentos((prev) => prev.filter((m) => m.id !== id));
                toast.success("Medicamento excluído e removido do portal!");
                fetchMedicamentos();
            } else {
                toast.error(data.error || "Erro ao excluir medicamento.");
            }
        } catch {
            toast.error("Falha de comunicação ao excluir medicamento.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggleAtivo = async (item: MedicamentoAdmin) => {
        try {
            const res = await fetch(`/api/admin/medicamentos/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ativo: !item.ativo }),
            });
            if (res.ok) {
                toast.success(!item.ativo ? "Medicamento ativado no portal." : "Medicamento ocultado do portal.");
                fetchMedicamentos();
            } else {
                const data = await res.json().catch(() => ({}));
                toast.error(data.error || "Erro ao alterar visibilidade.");
            }
        } catch {
            toast.error("Falha ao atualizar visibilidade.");
        }
    };

    const filtrados = medicamentos.filter((item) => {
        const matchStatus = filtroStatus === "todos" || item.status === filtroStatus;
        const term = busca.toLowerCase();
        const matchBusca =
            !busca ||
            item.nome.toLowerCase().includes(term) ||
            (item.principioAtivo && item.principioAtivo.toLowerCase().includes(term)) ||
            item.categoria.toLowerCase().includes(term) ||
            (item.unidadeSaude && item.unidadeSaude.toLowerCase().includes(term));
        return matchStatus && matchBusca;
    });

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                        <FaCapsules className="text-emerald-600" /> Relação de Medicamentos SUS e Estoques (REMUME)
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Alterações aqui refletem imediatamente em{" "}
                        <Link href="/transparencia/saude" target="_blank" className="text-[#003366] font-bold underline">
                            /transparencia/saude
                        </Link>{" "}
                        e{" "}
                        <Link href="/transparencia/medicamentos-sus" target="_blank" className="text-[#003366] font-bold underline">
                            /transparencia/medicamentos-sus
                        </Link>
                        .
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href="/admin/importacao"
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                    >
                        <FaUpload /> Importar Lote CSV
                    </Link>
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-5 py-2.5 bg-[#50B749] hover:bg-[#439c3d] text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                        <FaPlus /> Novo Medicamento
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {[
                        { id: "todos", label: `Todos (${medicamentos.length})` },
                        { id: "disponivel", label: "Disponíveis" },
                        { id: "indisponivel", label: "Em Falta / Indisponível" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFiltroStatus(tab.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                filtroStatus === tab.id
                                    ? "bg-[#003366] text-white shadow-sm"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Buscar medicamento, princípio ativo..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#003366]"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400 space-y-2">
                        <FaSpinner className="animate-spin text-2xl text-[#003366] mx-auto" />
                        <p className="text-xs font-bold uppercase tracking-wider">Carregando catálogo REMUME...</p>
                    </div>
                ) : filtrados.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <p className="text-sm font-bold text-gray-600">Nenhum medicamento encontrado.</p>
                        <p className="text-xs mt-1">Cadastre um item acima ou importe via planilha CSV.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <th className="px-6 py-4">Medicamento / Princípio Ativo</th>
                                    <th className="px-6 py-4">Categoria / Componente</th>
                                    <th className="px-6 py-4">Estoque / Unidade</th>
                                    <th className="px-6 py-4">Situação</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs">
                                {filtrados.map((item) => (
                                    <tr key={item.id} className={`hover:bg-blue-50/20 ${!item.ativo ? "opacity-60 bg-gray-50/50" : ""}`}>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{item.nome}</div>
                                            {item.principioAtivo && (
                                                <div className="text-[11px] text-gray-500">{item.principioAtivo}</div>
                                            )}
                                            <div className="text-[10px] text-gray-400 mt-0.5">
                                                {item.apresentacao} • {item.unidadeMedida}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block bg-gray-100 text-gray-700 font-bold px-2.5 py-1 rounded-lg text-[10px] uppercase">
                                                {item.categoria}
                                            </span>
                                            {item.tipoComponente && (
                                                <div className="text-[10px] text-gray-500 mt-1">{item.tipoComponente}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-black text-gray-800">
                                                {item.quantidadeEstoque ?? 0} {item.unidadeMedida || "un"}
                                            </div>
                                            <div className="text-[11px] text-gray-500 truncate max-w-[200px]">
                                                {item.unidadeSaude || "Farmácia Básica"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {item.status === "disponivel" ? (
                                                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                                                        <FaCheckCircle /> Disponível
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 text-amber-600 font-bold text-[11px]">
                                                        <FaExclamationTriangle /> Em Falta
                                                    </span>
                                                )}
                                                <div className="text-[10px] font-bold text-gray-400">
                                                    {item.ativo ? "Visível no Portal" : "Oculto"}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <button
                                                    onClick={() => handleToggleAtivo(item)}
                                                    title={item.ativo ? "Ocultar do portal" : "Exibir no portal"}
                                                    className="p-2 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 rounded-lg transition-colors"
                                                >
                                                    {item.ativo ? <FaEye /> : <FaEyeSlash />}
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal(item)}
                                                    title="Editar medicamento"
                                                    className="p-2 bg-gray-100 hover:bg-amber-100 text-gray-600 hover:text-amber-700 rounded-lg transition-colors"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.nome)}
                                                    disabled={deletingId === item.id}
                                                    title="Excluir medicamento"
                                                    className="p-2 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-700 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {deletingId === item.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-5 my-8 border border-gray-100">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                                {editingItem ? "Editar Medicamento (REMUME)" : "Novo Medicamento (REMUME)"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 flex items-center justify-center"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nome / Denominação *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        placeholder="Ex: Losartana Potássica 50mg"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Princípio Ativo</label>
                                    <input
                                        type="text"
                                        value={formData.principioAtivo}
                                        onChange={(e) => setFormData({ ...formData, principioAtivo: e.target.value })}
                                        placeholder="Ex: Losartana potássica"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Categoria *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.categoria}
                                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                        placeholder="Ex: Anti-hipertensivo"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Apresentação</label>
                                    <input
                                        type="text"
                                        value={formData.apresentacao}
                                        onChange={(e) => setFormData({ ...formData, apresentacao: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Componente SUS</label>
                                    <select
                                        value={formData.tipoComponente}
                                        onChange={(e) => setFormData({ ...formData, tipoComponente: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    >
                                        <option value="Básico (CBAF)">Básico (CBAF)</option>
                                        <option value="Especializado (CEAF)">Especializado (CEAF)</option>
                                        <option value="Estratégico (CESAF)">Estratégico (CESAF)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Qtd. em Estoque</label>
                                    <input
                                        type="number"
                                        value={formData.quantidadeEstoque}
                                        onChange={(e) => setFormData({ ...formData, quantidadeEstoque: parseInt(e.target.value, 10) || 0 })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Unidade de Medida</label>
                                    <input
                                        type="text"
                                        value={formData.unidadeMedida}
                                        onChange={(e) => setFormData({ ...formData, unidadeMedida: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status de Estoque</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    >
                                        <option value="disponivel">Disponível</option>
                                        <option value="indisponivel">Em Falta / Indisponível</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Local / Unidade de Saúde</label>
                                    <input
                                        type="text"
                                        value={formData.unidadeSaude}
                                        onChange={(e) => setFormData({ ...formData, unidadeSaude: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Lote / Validade</label>
                                    <input
                                        type="text"
                                        value={formData.loteValidade}
                                        onChange={(e) => setFormData({ ...formData, loteValidade: e.target.value })}
                                        placeholder="Ex: Lote 1234 • Val. 12/2027"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Observações ao Cidadão</label>
                                <textarea
                                    rows={2}
                                    value={formData.observacao}
                                    onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="medAtivoCheck"
                                    checked={formData.ativo}
                                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                                    className="w-4 h-4 text-[#003366] rounded"
                                />
                                <label htmlFor="medAtivoCheck" className="text-xs font-bold text-gray-700 uppercase cursor-pointer">
                                    Medicamento Ativo e Visível no Portal
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs uppercase"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-black rounded-xl text-xs uppercase disabled:opacity-50"
                                >
                                    {saving ? "Salvando..." : editingItem ? "Salvar Alterações" : "Cadastrar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
