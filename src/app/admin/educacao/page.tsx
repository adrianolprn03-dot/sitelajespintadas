"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    FaBookOpen,
    FaChartLine,
    FaCheckCircle,
    FaEdit,
    FaExternalLinkAlt,
    FaFilePdf,
    FaGraduationCap,
    FaPlus,
    FaSpinner,
    FaTrash,
    FaUpload,
} from "react-icons/fa";
import AdminModal from "@/components/admin/AdminModal";

interface DocumentoEducacao {
    id: string;
    titulo: string;
    descricao: string | null;
    tipo: string;
    orgaoResponsavel: string | null;
    arquivo: string | null;
    documentUrl: string | null;
    arquivoEditavelUrl: string | null;
    ano: number | null;
    competencia: string | null;
    ativo: boolean;
    criadoEm: string;
}

const CATEGORIAS_PME = [
    {
        value: "plano-educacao",
        label: "PME - Plano Municipal de Educação",
        badge: "Plano Decenal (PME)",
        color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
        value: "relatorio-plano-educacao",
        label: "Relatório de Resultados / Monitoramento do PME",
        badge: "Relatório de Resultados (19.1)",
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
];

export default function AdminEducacaoPage() {
    const [documentos, setDocumentos] = useState<DocumentoEducacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroTipo, setFiltroTipo] = useState("todos");
    const [filtroAno, setFiltroAno] = useState("todos");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<DocumentoEducacao | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadModo, setUploadModo] = useState<"upload" | "url">("upload");

    const [formData, setFormData] = useState({
        titulo: "",
        tipo: "relatorio-plano-educacao",
        ano: new Date().getFullYear(),
        competencia: "",
        orgaoResponsavel: "Secretaria Municipal de Educação, Cultura e Desporto",
        descricao: "",
        arquivo: "",
        documentUrl: "",
        arquivoEditavelUrl: "",
        ativo: true,
    });

    const fetchDocumentos = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                "/api/documentos?tipo=plano-educacao,relatorio-plano-educacao",
                { cache: "no-store" }
            );
            if (res.ok) {
                const data = await res.json();
                setDocumentos(Array.isArray(data) ? data : []);
            }
        } catch {
            toast.error("Erro ao carregar documentos da educação.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocumentos();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 20 * 1024 * 1024) {
            toast.error("Arquivo muito grande (máximo 20MB).");
            return;
        }
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", file);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: uploadData });
            const data = await res.json();
            if (res.ok && data.url) {
                setFormData((prev) => ({ ...prev, arquivo: data.url }));
                toast.success("Documento enviado com sucesso!");
            } else {
                toast.error(data.error || "Erro ao enviar arquivo.");
            }
        } catch {
            toast.error("Erro de conexão ao enviar arquivo.");
        } finally {
            setUploading(false);
        }
    };

    const abrirModal = (doc?: DocumentoEducacao) => {
        if (doc) {
            setEditingDoc(doc);
            setFormData({
                titulo: doc.titulo,
                tipo: doc.tipo,
                ano: doc.ano || new Date().getFullYear(),
                competencia: doc.competencia || "",
                orgaoResponsavel:
                    doc.orgaoResponsavel || "Secretaria Municipal de Educação, Cultura e Desporto",
                descricao: doc.descricao || "",
                arquivo: doc.arquivo || "",
                documentUrl: doc.documentUrl || "",
                arquivoEditavelUrl: doc.arquivoEditavelUrl || "",
                ativo: doc.ativo,
            });
            setUploadModo(doc.documentUrl && !doc.arquivo ? "url" : "upload");
        } else {
            setEditingDoc(null);
            setFormData({
                titulo: "",
                tipo: "relatorio-plano-educacao",
                ano: new Date().getFullYear(),
                competencia: `Monitoramento ${new Date().getFullYear()}`,
                orgaoResponsavel: "Secretaria Municipal de Educação, Cultura e Desporto",
                descricao: "",
                arquivo: "",
                documentUrl: "",
                arquivoEditavelUrl: "",
                ativo: true,
            });
            setUploadModo("upload");
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.titulo.trim()) {
            toast.error("Informe o título do documento.");
            return;
        }
        if (!formData.arquivo.trim() && !formData.documentUrl.trim()) {
            toast.error("Envie um arquivo PDF ou informe um link externo.");
            return;
        }

        setSaving(true);
        try {
            const url = editingDoc ? `/api/documentos/${editingDoc.id}` : "/api/documentos";
            const method = editingDoc ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    secretaria: "Educação",
                    criterioPntp: "19.1",
                    situacaoPublicacao: "publicado",
                }),
            });

            if (res.ok) {
                toast.success(
                    editingDoc
                        ? "Documento da Educação atualizado!"
                        : "Documento publicado no Portal da Educação!"
                );
                setIsModalOpen(false);
                fetchDocumentos();
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(err.error || "Erro ao salvar documento.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, titulo: string) => {
        if (!confirm(`Deseja excluir "${titulo}" permanentemente?`)) return;
        try {
            const res = await fetch(`/api/documentos/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Documento excluído!");
                setDocumentos((prev) => prev.filter((d) => d.id !== id));
            } else {
                toast.error("Erro ao excluir documento.");
            }
        } catch {
            toast.error("Erro de conexão.");
        }
    };

    const pmes = documentos.filter((d) => d.tipo === "plano-educacao");
    const relatorios = documentos.filter((d) => d.tipo === "relatorio-plano-educacao");
    const anosDisponiveis = Array.from(
        new Set(documentos.map((d) => d.ano).filter((a): a is number => Boolean(a)))
    ).sort((a, b) => b - a);

    const filtrados = documentos.filter((doc) => {
        if (filtroTipo !== "todos" && doc.tipo !== filtroTipo) return false;
        if (filtroAno !== "todos" && String(doc.ano || "") !== filtroAno) return false;
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#1254A3] text-white flex items-center justify-center shrink-0">
                        <FaGraduationCap size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Plano Municipal de Educação (PME) e Relatórios de Resultados (PNTP 19.1)
                        </h1>
                        <p className="text-xs text-gray-500">
                            Publique o Plano Municipal de Educação e os respectivos Relatórios de Monitoramento/Resultados para atendimento integral à Cartilha PNTP 2026.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => abrirModal()}
                    className="px-5 py-2.5 bg-[#1254A3] hover:bg-blue-800 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-sm cursor-pointer shrink-0"
                >
                    <FaPlus /> Publicar Documento PME / Relatório
                </button>
            </div>

            {/* Cards PNTP 19.1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1.5">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FaBookOpen className="text-blue-600" /> Planos de Educação (PME)
                    </span>
                    <div className="text-2xl font-black text-[#1254A3]">{pmes.length}</div>
                    <p className="text-xs text-gray-500">Documentos do Plano Municipal vigentes ou históricos.</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1.5">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FaChartLine className="text-emerald-600" /> Relatórios de Resultados do PME
                    </span>
                    <div
                        className={`text-2xl font-black ${
                            relatorios.length > 0 ? "text-emerald-600" : "text-amber-600"
                        }`}
                    >
                        {relatorios.length}
                    </div>
                    <p className="text-xs text-gray-500">
                        {relatorios.length > 0
                            ? "Relatórios de acompanhamento de metas publicados."
                            : "Pendente publicar relatório de resultados/avaliação do PME (19.1)."}
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1.5">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FaCheckCircle className="text-indigo-600" /> Série Histórica
                    </span>
                    <div className="text-2xl font-black text-indigo-700">{anosDisponiveis.length}</div>
                    <p className="text-xs text-gray-500">Exercício(s) com publicação disponível para consulta.</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: "todos", label: `Todos (${documentos.length})` },
                        { id: "plano-educacao", label: `PME - Planos (${pmes.length})` },
                        {
                            id: "relatorio-plano-educacao",
                            label: `Relatórios de Resultados (${relatorios.length})`,
                        },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFiltroTipo(tab.id)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                                filtroTipo === tab.id
                                    ? "bg-[#1254A3] text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <select
                    value={filtroAno}
                    onChange={(e) => setFiltroAno(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white outline-none"
                >
                    <option value="todos">Todos os Exercícios</option>
                    {anosDisponiveis.map((a) => (
                        <option key={a} value={String(a)}>
                            Exercício {a}
                        </option>
                    ))}
                </select>
            </div>

            {/* Listagem */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-16 text-center text-gray-400">
                        <FaSpinner className="animate-spin inline-block text-2xl mb-2 text-[#1254A3]" />
                        <p className="text-sm">Carregando documentos da Educação...</p>
                    </div>
                ) : filtrados.length === 0 ? (
                    <div className="p-16 text-center text-gray-500 space-y-2">
                        <FaBookOpen className="mx-auto text-3xl text-gray-300" />
                        <p className="font-bold">Nenhum documento encontrado com este filtro.</p>
                        <p className="text-xs text-gray-400">
                            Publique o Plano Municipal de Educação e o Relatório de Resultados do PME clicando no botão acima.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filtrados.map((doc) => {
                            const catInfo = CATEGORIAS_PME.find((c) => c.value === doc.tipo);
                            const linkHref = doc.arquivo || doc.documentUrl || "#";
                            return (
                                <div
                                    key={doc.id}
                                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/70 transition"
                                >
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                                    catInfo?.color || "bg-slate-100 text-slate-700 border-slate-200"
                                                }`}
                                            >
                                                {catInfo?.badge || doc.tipo}
                                            </span>
                                            {doc.ano && (
                                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                                                    Exercício {doc.ano}
                                                </span>
                                            )}
                                            {doc.competencia && (
                                                <span className="text-[11px] font-semibold text-gray-500">
                                                    • {doc.competencia}
                                                </span>
                                            )}
                                            {!doc.ativo && (
                                                <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">
                                                    Oculto
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-base">{doc.titulo}</h3>
                                        {doc.descricao && (
                                            <p className="text-xs text-gray-600 line-clamp-2">{doc.descricao}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <a
                                            href={linkHref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                                        >
                                            <FaFilePdf className="text-red-500" /> Visualizar
                                            <FaExternalLinkAlt size={10} />
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => abrirModal(doc)}
                                            className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer"
                                            title="Editar documento"
                                        >
                                            <FaEdit size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(doc.id, doc.titulo)}
                                            className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                                            title="Excluir documento"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal Publicar / Editar Documento PME / Relatório */}
            <AdminModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDoc ? "Editar Documento da Educação" : "Publicar PME ou Relatório de Resultados (19.1)"}
                icon={<FaGraduationCap className="text-[#1254A3] text-lg" />}
                maxWidth="xl"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="form-doc-educacao"
                            disabled={saving || uploading}
                            className="px-5 py-2 bg-[#1254A3] text-white rounded-xl text-sm font-bold hover:bg-blue-800 disabled:opacity-50 cursor-pointer"
                        >
                            {saving ? "Salvando..." : editingDoc ? "Salvar Alterações" : "Publicar Documento"}
                        </button>
                    </>
                }
            >
                <form id="form-doc-educacao" onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                            Título do Documento *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Ex: Relatório Bienal de Avaliação e Monitoramento das Metas do PME 2025/2026"
                            value={formData.titulo}
                            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#1254A3]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                                Classificação PNTP 19.1 *
                            </label>
                            <select
                                value={formData.tipo}
                                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white outline-none"
                            >
                                {CATEGORIAS_PME.map((c) => (
                                    <option key={c.value} value={c.value}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Exercício *</label>
                            <input
                                type="number"
                                required
                                value={formData.ano}
                                onChange={(e) =>
                                    setFormData({ ...formData, ano: parseInt(e.target.value, 10) || 2026 })
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                                Período / Vigência / Competência
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: Vigência 2015-2025 / Ciclo 2025-2026"
                                value={formData.competencia}
                                onChange={(e) => setFormData({ ...formData, competencia: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                                Órgão / Conselho Responsável
                            </label>
                            <input
                                type="text"
                                value={formData.orgaoResponsavel}
                                onChange={(e) => setFormData({ ...formData, orgaoResponsavel: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                            Resumo dos Resultados, Metas e Indicadores Avaliados
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Descreva os principais indicadores de aprendizagem, taxa de atendimento em creches/ensino fundamental e cumprimento das metas..."
                            value={formData.descricao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"
                        />
                    </div>

                    {/* Upload ou URL */}
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-600 uppercase">Arquivo Oficial (PDF)</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setUploadModo("upload")}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                                    uploadModo === "upload"
                                        ? "bg-[#1254A3] text-white border-[#1254A3]"
                                        : "bg-gray-50 text-gray-600 border-gray-200"
                                }`}
                            >
                                <FaUpload className="inline mr-1" /> Fazer Upload do Computador
                            </button>
                            <button
                                type="button"
                                onClick={() => setUploadModo("url")}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                                    uploadModo === "url"
                                        ? "bg-[#1254A3] text-white border-[#1254A3]"
                                        : "bg-gray-50 text-gray-600 border-gray-200"
                                }`}
                            >
                                Informar Link Externo (URL)
                            </button>
                        </div>

                        {uploadModo === "upload" ? (
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xlsx,.csv"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                    className="text-xs"
                                />
                                {uploading && (
                                    <p className="text-xs text-blue-600 font-bold mt-2">
                                        <FaSpinner className="animate-spin inline mr-1" /> Enviando arquivo...
                                    </p>
                                )}
                                {formData.arquivo && (
                                    <p className="text-xs text-emerald-700 font-semibold mt-2 truncate">
                                        Arquivo anexado: {formData.arquivo}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <input
                                type="url"
                                placeholder="https://..."
                                value={formData.documentUrl || formData.arquivo}
                                onChange={(e) =>
                                    setFormData({ ...formData, documentUrl: e.target.value, arquivo: "" })
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"
                            />
                        )}
                    </div>

                    <label className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.ativo}
                            onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                            className="w-4 h-4 accent-[#1254A3]"
                        />
                        Publicar imediatamente no Portal da Transparência
                    </label>
                </form>
            </AdminModal>
        </div>
    );
}
