"use client";

import { useState, useEffect } from "react";
import { 
    FaHeartbeat, 
    FaPlus, 
    FaFileAlt, 
    FaEdit, 
    FaTrash, 
    FaDownload, 
    FaCheckCircle, 
    FaExclamationTriangle, 
    FaSearch,
    FaFilter,
    FaCalendarAlt,
    FaFileContract,
    FaRegHospital,
    FaUpload,
    FaLink,
    FaSpinner
} from "react-icons/fa";

type DocumentoSaude = {
    id: string;
    titulo: string;
    categoria: string; // "pms", "pas", "rag", "rdqa"
    anoExercicio: number;
    periodoVigencia: string | null;
    statusConselho: string | null;
    numeroResolucao: string | null;
    descricao: string | null;
    linkDocumento: string | null;
    ativo: boolean;
    criadoEm: string;
};

export default function AdminSaudePage() {
    const [documentos, setDocumentos] = useState<DocumentoSaude[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoriaFiltro, setCategoriaFiltro] = useState("todos");
    const [busca, setBusca] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<DocumentoSaude | null>(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ tipo: "sucesso" | "erro"; mensagem: string } | null>(null);

    // Upload state
    const [uploadModo, setUploadModo] = useState<"upload" | "url">("upload");
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Form fields
    const [formData, setFormData] = useState({
        titulo: "",
        categoria: "pms",
        anoExercicio: new Date().getFullYear(),
        periodoVigencia: "",
        statusConselho: "Aprovado pelo Conselho Municipal de Saúde (CMS)",
        numeroResolucao: "",
        descricao: "",
        linkDocumento: "",
        ativo: true
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 20 * 1024 * 1024) {
            setUploadError("Arquivo muito grande (máximo 20MB).");
            return;
        }

        setUploading(true);
        setUploadError(null);

        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: uploadData
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, linkDocumento: data.url }));
            } else {
                const err = await res.json();
                setUploadError(err.error || "Erro ao realizar upload do arquivo.");
            }
        } catch (err: any) {
            setUploadError("Falha de conexão com o servidor de uploads.");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        fetchDocumentos();
    }, [categoriaFiltro]);

    const fetchDocumentos = async () => {
        setLoading(true);
        try {
            const url = categoriaFiltro === "todos" 
                ? "/api/admin/saude" 
                : `/api/admin/saude?categoria=${categoriaFiltro}`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setDocumentos(data);
            }
        } catch (error) {
            console.error("Erro ao buscar documentos da saúde:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (doc?: DocumentoSaude) => {
        if (doc) {
            setEditingDoc(doc);
            setFormData({
                titulo: doc.titulo,
                categoria: doc.categoria,
                anoExercicio: doc.anoExercicio,
                periodoVigencia: doc.periodoVigencia || "",
                statusConselho: doc.statusConselho || "Aprovado pelo Conselho Municipal de Saúde (CMS)",
                numeroResolucao: doc.numeroResolucao || "",
                descricao: doc.descricao || "",
                linkDocumento: doc.linkDocumento || "",
                ativo: doc.ativo
            });
        } else {
            setEditingDoc(null);
            setFormData({
                titulo: "",
                categoria: "pms",
                anoExercicio: new Date().getFullYear(),
                periodoVigencia: "2026 - 2029",
                statusConselho: "Aprovado pelo Conselho Municipal de Saúde (CMS)",
                numeroResolucao: "Resolução CMS nº 001/2026",
                descricao: "",
                linkDocumento: "/files/documento_saude.pdf",
                ativo: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setFeedback(null);

        try {
            const method = editingDoc ? "PUT" : "POST";
            const url = editingDoc ? `/api/admin/saude/${editingDoc.id}` : "/api/admin/saude";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setFeedback({
                    tipo: "sucesso",
                    mensagem: editingDoc ? "Documento atualizado com sucesso!" : "Documento cadastrado com sucesso!"
                });
                setIsModalOpen(false);
                fetchDocumentos();
            } else {
                const err = await res.json();
                setFeedback({ tipo: "erro", mensagem: err.error || "Erro ao salvar documento" });
            }
        } catch (error) {
            setFeedback({ tipo: "erro", mensagem: "Falha de conexão ao salvar." });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este documento da gestão da saúde?")) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/saude/${id}`, { method: "DELETE" });
            if (res.ok) {
                setFeedback({ tipo: "sucesso", mensagem: "Documento removido com sucesso." });
                fetchDocumentos();
            } else {
                setFeedback({ tipo: "erro", mensagem: "Erro ao excluir documento." });
            }
        } catch (error) {
            setFeedback({ tipo: "erro", mensagem: "Falha na requisição de exclusão." });
        } finally {
            setDeletingId(null);
        }
    };

    const getCategoriaBadge = (cat: string) => {
        switch (cat) {
            case "pms":
                return <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded-full text-xs uppercase tracking-wider">Plano Municipal (PMS)</span>;
            case "pas":
                return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-full text-xs uppercase tracking-wider">Programação Anual (PAS)</span>;
            case "rag":
                return <span className="px-3 py-1 bg-purple-100 text-purple-700 font-bold rounded-full text-xs uppercase tracking-wider">Relatório Anual (RAG)</span>;
            case "rdqa":
                return <span className="px-3 py-1 bg-amber-100 text-amber-700 font-bold rounded-full text-xs uppercase tracking-wider">Relatório Quadrimestral (RDQA)</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-700 font-bold rounded-full text-xs uppercase tracking-wider">{cat}</span>;
        }
    };

    const documentosFiltrados = documentos.filter(doc => 
        doc.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        (doc.numeroResolucao && doc.numeroResolucao.toLowerCase().includes(busca.toLowerCase())) ||
        (doc.descricao && doc.descricao.toLowerCase().includes(busca.toLowerCase()))
    );

    return (
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-8 font-['Montserrat',sans-serif]">
            {/* Header com Ações PNTP */}
            <div className="bg-gradient-to-r from-[#003366] via-[#004080] to-[#01b0ef] rounded-[2rem] p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest uppercase text-blue-100 border border-white/20">
                            PNTP 2026 • Critério Obrigatório
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                        <FaHeartbeat className="text-[#01b0ef] bg-white/10 p-2 rounded-xl text-4xl" />
                        Gestão da Saúde Municipal
                    </h1>
                    <p className="text-blue-100 text-sm md:text-base max-w-2xl font-medium leading-relaxed opacity-90">
                        Inclusão e gerenciamento de Planos Municipais de Saúde (PMS), Programações Anuais (PAS), Relatórios Anuais de Gestão (RAG) e Quadrimestrais (RDQA).
                    </p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="px-6 py-4 bg-[#50B749] hover:bg-[#439c3d] text-white font-black rounded-2xl shadow-lg transition-all flex items-center gap-3 uppercase text-xs tracking-wider shrink-0 active:scale-95 z-10"
                >
                    <FaPlus className="text-sm" /> NOVO DOCUMENTO DA SAÚDE
                </button>
            </div>

            {/* Alerta Feedback */}
            {feedback && (
                <div className={`p-5 rounded-2xl border flex items-center gap-4 ${
                    feedback.tipo === "sucesso" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
                }`}>
                    {feedback.tipo === "sucesso" ? <FaCheckCircle className="text-xl shrink-0" /> : <FaExclamationTriangle className="text-xl shrink-0" />}
                    <span className="font-bold text-sm">{feedback.mensagem}</span>
                </div>
            )}

            {/* Cards de Métricas PNTP 2026 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0">
                        <FaFileContract />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Geral</span>
                        <h3 className="text-2xl font-black text-gray-800">{documentos.length}</h3>
                        <span className="text-[11px] text-emerald-600 font-bold">Publicados no Portal</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0">
                        <FaRegHospital />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Plano Municipal (PMS)</span>
                        <h3 className="text-2xl font-black text-gray-800">
                            {documentos.filter(d => d.categoria === "pms").length}
                        </h3>
                        <span className="text-[11px] text-gray-500 font-medium">Metas Quadrienais</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0">
                        <FaCalendarAlt />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Programação Anual (PAS)</span>
                        <h3 className="text-2xl font-black text-gray-800">
                            {documentos.filter(d => d.categoria === "pas").length}
                        </h3>
                        <span className="text-[11px] text-gray-500 font-medium">Ações do Exercício</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0">
                        <FaFileAlt />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Relatórios (RAG / RDQA)</span>
                        <h3 className="text-2xl font-black text-gray-800">
                            {documentos.filter(d => d.categoria === "rag" || d.categoria === "rdqa").length}
                        </h3>
                        <span className="text-[11px] text-amber-600 font-bold">Prestação de Contas CMS</span>
                    </div>
                </div>
            </div>

            {/* Painel de Filtros e Busca */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <span className="text-xs font-black uppercase text-gray-400 mr-2 flex items-center gap-2">
                        <FaFilter /> Filtrar por:
                    </span>
                    {[
                        { id: "todos", label: "Todos" },
                        { id: "pms", label: "PMS (Plano Municipal)" },
                        { id: "pas", label: "PAS (Programação Anual)" },
                        { id: "rag", label: "RAG (Relatório Anual)" },
                        { id: "rdqa", label: "RDQA (Quadrimestral)" }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setCategoriaFiltro(tab.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                categoriaFiltro === tab.id 
                                    ? "bg-[#003366] text-white shadow-md" 
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-72">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Buscar por título ou resolução..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#003366]"
                    />
                </div>
            </div>

            {/* Tabela de Listagem */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-16 text-center text-gray-400 flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-[#01b0ef] border-t-transparent rounded-full animate-spin" />
                        <span className="font-bold text-xs">Carregando documentos da saúde...</span>
                    </div>
                ) : documentosFiltrados.length === 0 ? (
                    <div className="p-16 text-center text-gray-400 space-y-3">
                        <FaFileAlt className="text-4xl mx-auto text-gray-300" />
                        <h4 className="text-base font-bold text-gray-700">Nenhum documento encontrado</h4>
                        <p className="text-xs text-gray-400">Cadastre um novo item de planejamento ou prestação de contas da saúde.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-500">
                                    <th className="p-4 pl-6">Documento da Saúde</th>
                                    <th className="p-4">Categoria</th>
                                    <th className="p-4">Ano / Vigência</th>
                                    <th className="p-4">Aprovação / Resolução CMS</th>
                                    <th className="p-4">Arquivo</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 pr-6 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                                {documentosFiltrados.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="font-bold text-gray-900 text-sm mb-1">{doc.titulo}</div>
                                            {doc.descricao && (
                                                <p className="text-gray-500 text-xs line-clamp-1 max-w-md">{doc.descricao}</p>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {getCategoriaBadge(doc.categoria)}
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">
                                            <div>{doc.anoExercicio}</div>
                                            {doc.periodoVigencia && (
                                                <span className="text-[11px] text-gray-400 font-normal">{doc.periodoVigencia}</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-emerald-700 text-xs">{doc.statusConselho}</div>
                                            {doc.numeroResolucao && (
                                                <span className="text-[11px] text-gray-500">{doc.numeroResolucao}</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {doc.linkDocumento ? (
                                                <a 
                                                    href={doc.linkDocumento} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-bold text-[11px] transition-colors"
                                                >
                                                    <FaDownload /> PDF
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 italic">Sem arquivo</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            {doc.ativo ? (
                                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full uppercase">Ativo</span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-gray-100 text-gray-500 font-bold text-[10px] rounded-full uppercase">Inativo</span>
                                            )}
                                        </td>
                                        <td className="p-4 pr-6 text-right space-x-2">
                                            <button
                                                onClick={() => handleOpenModal(doc)}
                                                className="p-2 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-xl transition-all active:scale-95"
                                                title="Editar documento"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(doc.id)}
                                                disabled={deletingId === doc.id}
                                                className="p-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                                                title="Excluir documento"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Formulário PNTP 2026 */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 my-8 border border-gray-100 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#01b0ef]">
                                    Cartilha PNTP 2026 • Item Saúde
                                </span>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                    {editingDoc ? "Editar Documento da Saúde" : "Novo Documento da Saúde"}
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 flex items-center justify-center"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Título do Documento <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Plano Municipal de Saúde (PMS 2026-2029)"
                                    value={formData.titulo}
                                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#003366]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Categoria da Saúde (PNTP) <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.categoria}
                                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#003366]"
                                    >
                                        <option value="pms">PMS - Plano Municipal de Saúde</option>
                                        <option value="pas">PAS - Programação Anual de Saúde</option>
                                        <option value="rag">RAG - Relatório Anual de Gestão</option>
                                        <option value="rdqa">RDQA - Relatório Quadrimestral</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Ano / Exercício <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.anoExercicio}
                                        onChange={(e) => setFormData({ ...formData, anoExercicio: parseInt(e.target.value) || new Date().getFullYear() })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#003366]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Período de Vigência / Quadrimestre
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ex: 2026 - 2029 ou 1º Quadrimestre 2026"
                                        value={formData.periodoVigencia}
                                        onChange={(e) => setFormData({ ...formData, periodoVigencia: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#003366]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Resolução / Parecer do CMS
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Resolução CMS nº 001/2026"
                                        value={formData.numeroResolucao}
                                        onChange={(e) => setFormData({ ...formData, numeroResolucao: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#003366]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Status de Apreciação pelo Conselho Municipal de Saúde (CMS)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Aprovado pelo Conselho Municipal de Saúde (CMS)"
                                    value={formData.statusConselho}
                                    onChange={(e) => setFormData({ ...formData, statusConselho: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#003366]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Descrição e Resumo das Metas / Indicadores
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Resumo dos objetivos estratégicos, indicadores de saúde ou parecer de aprovação..."
                                    value={formData.descricao}
                                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#003366]"
                                />
                            </div>

                            {/* Seleção de Origem do Documento: Upload de Arquivo ou URL Externa */}
                            <div className="space-y-3 pt-2 border-t border-gray-100">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Documento / Arquivo Oficial (PDF) <span className="text-red-500">*</span>
                                </label>

                                <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1.5 rounded-2xl">
                                    <button
                                        type="button"
                                        onClick={() => setUploadModo("upload")}
                                        className={`py-2 px-4 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${
                                            uploadModo === "upload" 
                                                ? "bg-[#003366] text-white shadow-md" 
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        <FaUpload className="text-xs" /> Fazer Upload (PDF)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUploadModo("url")}
                                        className={`py-2 px-4 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${
                                            uploadModo === "url" 
                                                ? "bg-[#003366] text-white shadow-md" 
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        <FaLink className="text-xs" /> Digitar URL Externa
                                    </button>
                                </div>

                                {uploadModo === "upload" ? (
                                    <div className="space-y-3">
                                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-[#01b0ef] transition-colors bg-gray-50/50">
                                            <input
                                                type="file"
                                                id="fileInputSaude"
                                                accept=".pdf,.doc,.docx,.xlsx,.csv"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                disabled={uploading}
                                            />
                                            <label htmlFor="fileInputSaude" className="cursor-pointer space-y-2 block">
                                                <div className="w-12 h-12 bg-blue-50 text-[#003366] rounded-2xl flex items-center justify-center mx-auto text-xl">
                                                    {uploading ? <FaSpinner className="animate-spin text-blue-600" /> : <FaUpload className="text-blue-600" />}
                                                </div>
                                                <div className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                                                    {uploading ? "Enviando arquivo PDF para o servidor..." : "Clique aqui para selecionar o arquivo PDF do computador"}
                                                </div>
                                                <p className="text-[11px] text-gray-400">Suporta arquivos PDF, DOCX, XLSX (Tamanho máximo 20MB)</p>
                                            </label>
                                        </div>

                                        {uploadError && (
                                            <div className="text-xs text-red-600 font-bold bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2">
                                                <FaExclamationTriangle /> {uploadError}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Cole a URL ou caminho: Ex: https://... ou /files/pms_2026.pdf"
                                            value={formData.linkDocumento}
                                            onChange={(e) => setFormData({ ...formData, linkDocumento: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#003366]"
                                        />
                                    </div>
                                )}

                                {/* Exibição do Link Atual / Confirmado */}
                                {formData.linkDocumento && (
                                    <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-2 text-emerald-800 font-bold overflow-hidden">
                                            <FaCheckCircle className="shrink-0 text-emerald-600" />
                                            <span className="truncate">Arquivo Vinculado: {formData.linkDocumento}</span>
                                        </div>
                                        <a
                                            href={formData.linkDocumento}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] hover:bg-emerald-700 transition-colors shrink-0"
                                        >
                                            Testar Link PDF
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="ativoCheck"
                                    checked={formData.ativo}
                                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                                    className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]"
                                />
                                <label htmlFor="ativoCheck" className="text-xs font-bold text-gray-700 uppercase cursor-pointer">
                                    Documento Ativo e Visível no Portal da Transparência
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-wider"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-8 py-3 bg-[#003366] hover:bg-[#002244] text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? "Salvando..." : editingDoc ? "Salvar Alterações" : "Cadastrar Documento"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
