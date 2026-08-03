"use client";

import { useState, useEffect } from "react";
import { 
    FaHeartbeat, 
    FaFileDownload, 
    FaSearch, 
    FaFilter, 
    FaCheckCircle, 
    FaCalendarAlt, 
    FaNotesMedical, 
    FaFileContract, 
    FaBuilding,
    FaShieldAlt
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
    criadoEm: string;
};

export default function PlanoSaudeClientPage() {
    const [documentos, setDocumentos] = useState<DocumentoSaude[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoriaFiltro, setCategoriaFiltro] = useState("todos");
    const [anoFiltro, setAnoFiltro] = useState("todos");
    const [busca, setBusca] = useState("");

    useEffect(() => {
        const fetchDocumentos = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/transparencia/saude");
                if (res.ok) {
                    const data = await res.json();
                    setDocumentos(data);
                }
            } catch (error) {
                console.error("Erro ao buscar documentos da transparência da saúde:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDocumentos();
    }, []);

    // Anos disponíveis para filtro
    const anosDisponiveis = Array.from(
        new Set(documentos.map(d => d.anoExercicio))
    ).sort((a, b) => b - a);

    const documentosFiltrados = documentos.filter(doc => {
        const matchCat = categoriaFiltro === "todos" || doc.categoria === categoriaFiltro;
        const matchAno = anoFiltro === "todos" || doc.anoExercicio.toString() === anoFiltro;
        const matchBusca = 
            doc.titulo.toLowerCase().includes(busca.toLowerCase()) ||
            (doc.descricao && doc.descricao.toLowerCase().includes(busca.toLowerCase())) ||
            (doc.numeroResolucao && doc.numeroResolucao.toLowerCase().includes(busca.toLowerCase()));
        return matchCat && matchAno && matchBusca;
    });

    const getCategoriaBadge = (cat: string) => {
        switch (cat) {
            case "pms":
                return <span className="px-3 py-1 bg-blue-100 text-blue-800 font-black rounded-full text-[10px] uppercase tracking-wider">Plano Municipal (PMS)</span>;
            case "pas":
                return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-black rounded-full text-[10px] uppercase tracking-wider">Programação Anual (PAS)</span>;
            case "rag":
                return <span className="px-3 py-1 bg-purple-100 text-purple-800 font-black rounded-full text-[10px] uppercase tracking-wider">Relatório Anual (RAG)</span>;
            case "rdqa":
                return <span className="px-3 py-1 bg-amber-100 text-amber-800 font-black rounded-full text-[10px] uppercase tracking-wider">Relatório Quadrimestral (RDQA)</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-800 font-black rounded-full text-[10px] uppercase tracking-wider">{cat}</span>;
        }
    };

    return (
        <div className="max-w-[1240px] mx-auto px-6 py-12 space-y-10 font-['Montserrat',sans-serif]">
            {/* Banner Informativo PNTP 2026 */}
            <div className="bg-gradient-to-r from-[#002241] via-[#003366] to-[#01b0ef] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="relative z-10 max-w-3xl space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-200">
                        <FaShieldAlt className="text-emerald-400" /> PNTP 2026 • Item Saúde Pública
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight">
                        Instrumentos de Planejamento e Gestão da Saúde
                    </h2>
                    <p className="text-blue-100 text-xs md:text-sm leading-relaxed font-medium">
                        Transparência total dos planos estratégicos quadrienais (PMS), programações anuais de metas (PAS), relatórios anuais de prestação de contas (RAG) e relatórios quadrimestrais detalhados (RDQA) apreciados pelo Conselho Municipal de Saúde (CMS).
                    </p>
                </div>
            </div>

            {/* Painel de Filtros e Pesquisa */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Categorias Tabs */}
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        {[
                            { id: "todos", label: "Todos os Documentos" },
                            { id: "pms", label: "PMS (Plano Municipal)" },
                            { id: "pas", label: "PAS (Programação Anual)" },
                            { id: "rag", label: "RAG (Relatório Anual)" },
                            { id: "rdqa", label: "RDQA (Quadrimestral)" }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setCategoriaFiltro(tab.id)}
                                className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
                                    categoriaFiltro === tab.id
                                        ? "bg-[#003366] text-white shadow-lg shadow-blue-900/20 scale-105"
                                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Filtro por Ano */}
                    {anosDisponiveis.length > 0 && (
                        <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Exercício:</span>
                            <select
                                value={anoFiltro}
                                onChange={(e) => setAnoFiltro(e.target.value)}
                                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-[#003366]"
                            >
                                <option value="todos">Todos os Anos</option>
                                {anosDisponiveis.map(ano => (
                                    <option key={ano} value={ano.toString()}>{ano}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Input de Busca */}
                <div className="relative">
                    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Pesquisar por título, objetivo, metas ou número da resolução do CMS..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="w-full pl-12 pr-6 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl text-xs font-medium text-gray-800 focus:outline-none focus:border-[#003366] focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Listagem em Cards Interativos */}
            {loading ? (
                <div className="py-20 text-center text-gray-400 space-y-3">
                    <div className="w-10 h-10 border-4 border-[#01b0ef] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="font-bold text-xs">Carregando documentos da gestão da saúde...</p>
                </div>
            ) : documentosFiltrados.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-gray-200 space-y-4">
                    <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto">
                        <FaNotesMedical size={32} />
                    </div>
                    <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Nenhum documento encontrado</h3>
                    <p className="text-xs text-gray-400 font-medium">Tente ajustar os filtros acima para visualizar outros exercícios ou categorias.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {documentosFiltrados.map((doc) => (
                        <div 
                            key={doc.id}
                            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 p-8 flex flex-col justify-between hover:border-blue-200 hover:shadow-2xl transition-all duration-300 group"
                        >
                            <div className="space-y-5">
                                {/* Header do Card */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="w-14 h-14 bg-blue-50 text-[#003366] rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 border border-blue-100 group-hover:bg-[#003366] group-hover:text-white transition-colors">
                                        <FaHeartbeat />
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {getCategoriaBadge(doc.categoria)}
                                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                            Exercício {doc.anoExercicio}
                                        </span>
                                    </div>
                                </div>

                                {/* Título & Período */}
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight leading-snug group-hover:text-[#003366] transition-colors">
                                        {doc.titulo}
                                    </h3>
                                    {doc.periodoVigencia && (
                                        <p className="text-xs font-bold text-[#01b0ef] uppercase tracking-wider mt-1">
                                            Vigência: {doc.periodoVigencia}
                                        </p>
                                    )}
                                </div>

                                {/* Detalhes do CMS (Conselho Municipal de Saúde) */}
                                <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 space-y-2 text-xs">
                                    {doc.statusConselho && (
                                        <div className="flex items-center gap-2 text-emerald-700 font-bold">
                                            <FaCheckCircle className="shrink-0" />
                                            <span>{doc.statusConselho}</span>
                                        </div>
                                    )}
                                    {doc.numeroResolucao && (
                                        <div className="text-gray-600 font-semibold pl-6">
                                            {doc.numeroResolucao}
                                        </div>
                                    )}
                                </div>

                                {/* Descrição */}
                                {doc.descricao && (
                                    <p className="text-gray-600 text-xs leading-relaxed font-medium">
                                        {doc.descricao}
                                    </p>
                                )}
                            </div>

                            {/* Botão de Download PDF */}
                            <div className="pt-6 border-t border-gray-100 mt-6">
                                {doc.linkDocumento ? (
                                    <a
                                        href={doc.linkDocumento}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 bg-[#003366] hover:bg-[#01b0ef] text-white font-black rounded-2xl transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-blue-900/10 active:scale-95"
                                    >
                                        <FaFileDownload className="text-sm" /> BAIXAR DOCUMENTO OFICIAL (PDF)
                                    </a>
                                ) : (
                                    <div className="py-3 text-center text-xs text-gray-400 font-bold uppercase tracking-wider bg-gray-50 rounded-2xl border border-gray-100">
                                        Documento em fase de digitação / arquivamento
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
