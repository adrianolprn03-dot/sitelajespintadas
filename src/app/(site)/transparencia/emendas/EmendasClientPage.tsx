"use client";
import { useState, useMemo } from "react";
import { 
    FaSearch, FaFilter, FaTimes, FaDownload, 
    FaExternalLinkAlt, FaChevronRight, FaFileInvoiceDollar, 
    FaCalendar, FaUserTie, FaTags, FaSyncAlt, FaCheckCircle,
    FaLandmark, FaExchangeAlt
} from "react-icons/fa";
import { FaBuildingColumns } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

type Emenda = {
    id: string;
    codigoEmenda: string;
    numeroEmenda: string | null;
    anoEmenda: number;
    autorNome: string;
    esfera: string | null;
    formaRepasse: string | null;
    tipoEmenda: string | null;
    objeto: string | null;
    funcaoGoverno: string | null;
    subfuncaoGoverno: string | null;
    valorPrevisto: number | null;
    valorRecebido: number | null;
    valorEmpenhado: number | null;
    valorLiquidado: number | null;
    valorPago: number | null;
    situacaoExecucao: string | null;
    urlFonteOficial: string | null;
    favorecidoNome: string | null;
    orgaoConcedente: string | null;
};

const fmt = (v: number | null) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

export default function EmendasClientPage({ initialData }: { initialData: Emenda[] }) {
    const [busca, setBusca] = useState("");
    const [filtroAno, setFiltroAno] = useState("");
    const [filtroEsfera, setFiltroEsfera] = useState("");
    const [filtroFormaRepasse, setFiltroFormaRepasse] = useState("");
    const [filtroAutor, setFiltroAutor] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroFuncao, setFiltroFuncao] = useState("");
    const [filtroSituacao, setFiltroSituacao] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [detalheId, setDetalheId] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

    const handleSync = async () => {
        setIsSyncing(true);
        setSyncFeedback(null);
        try {
            const res = await fetch("/api/transparencia/emendas-parlamentares/sincronizar", { method: "POST" });
            const json = await res.json();
            if (json.success) {
                setSyncFeedback(json.mensagem);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setSyncFeedback("Erro ao consultar dados automaticamente.");
            }
        } catch {
            setSyncFeedback("Erro de conexão ao realizar consulta automática.");
        } finally {
            setIsSyncing(false);
        }
    };

    const anos = useMemo(() => Array.from(new Set(initialData.map(i => i.anoEmenda))).sort((a, b) => b - a), [initialData]);
    const esferas = useMemo(() => Array.from(new Set(initialData.map(i => i.esfera || "Federal"))).sort(), [initialData]);
    const formasRepasse = useMemo(() => Array.from(new Set(initialData.map(i => i.formaRepasse).filter(Boolean))).sort(), [initialData]);
    const autores = useMemo(() => Array.from(new Set(initialData.map(i => i.autorNome))).sort(), [initialData]);
    const tipos = useMemo(() => Array.from(new Set(initialData.map(i => i.tipoEmenda).filter(Boolean))).sort(), [initialData]);
    const funcoes = useMemo(() => Array.from(new Set(initialData.map(i => i.funcaoGoverno).filter(Boolean))).sort(), [initialData]);
    const situacoes = useMemo(() => Array.from(new Set(initialData.map(i => i.situacaoExecucao).filter(Boolean))).sort(), [initialData]);

    const filtered = useMemo(() => {
        return initialData.filter(i => {
            if (filtroAno && i.anoEmenda !== parseInt(filtroAno)) return false;
            if (filtroEsfera && (i.esfera || "Federal") !== filtroEsfera) return false;
            if (filtroFormaRepasse && i.formaRepasse !== filtroFormaRepasse) return false;
            if (filtroAutor && i.autorNome !== filtroAutor) return false;
            if (filtroTipo && i.tipoEmenda !== filtroTipo) return false;
            if (filtroFuncao && i.funcaoGoverno !== filtroFuncao) return false;
            if (filtroSituacao && i.situacaoExecucao !== filtroSituacao) return false;
            if (busca) {
                const term = busca.toLowerCase();
                return (
                    i.autorNome.toLowerCase().includes(term) ||
                    (i.objeto || "").toLowerCase().includes(term) ||
                    i.codigoEmenda.toLowerCase().includes(term) ||
                    (i.numeroEmenda || "").toLowerCase().includes(term)
                );
            }
            return true;
        });
    }, [initialData, filtroAno, filtroEsfera, filtroFormaRepasse, filtroAutor, filtroTipo, filtroFuncao, filtroSituacao, busca]);

    const hasFilters = filtroAno || filtroEsfera || filtroFormaRepasse || filtroAutor || filtroTipo || filtroFuncao || filtroSituacao || busca;
    const clearFilters = () => {
        setFiltroAno(""); setFiltroEsfera(""); setFiltroFormaRepasse(""); setFiltroAutor(""); setFiltroTipo(""); setFiltroFuncao(""); setFiltroSituacao(""); setBusca("");
    };

    const detalhe = detalheId ? initialData.find(e => e.id === detalheId) : null;

    const tableVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const rowVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <>
            {/* Modal Detalhe Premium */}
            <AnimatePresence>
                {detalhe && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md" 
                        onClick={() => setDetalheId(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 sm:p-10 shadow-2xl max-h-[92vh] overflow-y-auto border border-[#DDE3EA] relative" 
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1254A3] via-blue-500 to-[#F39A32]" />
                            
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-3 py-1 bg-blue-50 text-[#1254A3] rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-200 flex items-center gap-1.5">
                                            <FaFileInvoiceDollar /> PNTP Critérios 17.1 a 17.3
                                        </span>
                                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold uppercase">
                                            {detalhe.esfera || "Federal"}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-black text-[#12304A] tracking-tight leading-none">
                                        Detalhamento da Emenda
                                    </h2>
                                </div>
                                <button onClick={() => setDetalheId(null)} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all cursor-pointer">
                                    <FaTimes className="text-slate-500" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Informações Primárias (Critério 17.1) */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Autor da Emenda</span>
                                        <div className="flex items-center gap-2 text-[#12304A] font-bold text-xs">
                                            <FaUserTie className="text-[#1254A3] shrink-0" /> {detalhe.autorNome}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Ano / Esfera</span>
                                        <div className="flex items-center gap-2 text-[#12304A] font-bold text-xs">
                                            <FaCalendar className="text-[#1254A3] shrink-0" /> {detalhe.anoEmenda} • {detalhe.esfera || "Federal"}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Código / Número</span>
                                        <div className="text-slate-700 font-mono text-[11px] font-bold truncate">
                                            {detalhe.codigoEmenda} {detalhe.numeroEmenda ? `(${detalhe.numeroEmenda})` : ""}
                                        </div>
                                    </div>
                                </div>

                                {/* Objeto da Emenda */}
                                <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200/70">
                                    <span className="text-[10px] font-bold text-[#1254A3] uppercase tracking-wider block mb-1">Objeto e Finalidade Pública</span>
                                    <p className="text-sm font-semibold text-[#12304A] leading-relaxed">
                                        {detalhe.objeto || "Não informado na base oficial."}
                                    </p>
                                </div>

                                {/* Execução Orçamentária e Financeira (Critério 17.2) */}
                                <div className="space-y-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                        Execução Orçamentária e Financeira (Critério 17.2)
                                    </span>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                            <span className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Previsto</span>
                                            <span className="block text-sm font-black text-slate-700">{fmt(detalhe.valorPrevisto)}</span>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                            <span className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Empenhado</span>
                                            <span className="block text-sm font-black text-blue-700">{fmt(detalhe.valorEmpenhado || detalhe.valorPago)}</span>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                            <span className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Liquidado</span>
                                            <span className="block text-sm font-black text-indigo-700">{fmt(detalhe.valorLiquidado || detalhe.valorPago)}</span>
                                        </div>
                                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                                            <span className="block text-[9px] font-bold text-emerald-800 uppercase mb-1">Pago / Concluído</span>
                                            <span className="block text-sm font-black text-emerald-700">{fmt(detalhe.valorPago)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Classificação Adicional */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Forma de Repasse (17.1)</span>
                                        <span className="font-bold text-slate-800">{detalhe.formaRepasse || "Transferência Especial (PIX)"}</span>
                                    </div>
                                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Função de Governo</span>
                                        <span className="font-bold text-slate-800">{detalhe.funcaoGoverno || "Saúde"}</span>
                                    </div>
                                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Situação Oficial</span>
                                        <span className="font-bold text-emerald-700">{detalhe.situacaoExecucao || "Pago"}</span>
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                                    {detalhe.urlFonteOficial && (
                                        <a
                                            href={detalhe.urlFonteOficial}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1254A3] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#0d4282] transition-all"
                                        >
                                            <FaExternalLinkAlt size={11} /> Fonte Oficial Transferegov
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setDetalheId(null)}
                                        className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-all cursor-pointer"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Painel Principal */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-sm border border-[#DDE3EA] overflow-hidden"
            >
                {/* Header e Ações */}
                <div className="p-6 sm:p-8 space-y-6 border-b border-[#DDE3EA]">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[10px] font-black uppercase tracking-wider text-[#1254A3] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                    PNTP Critérios 17.1 a 17.3
                                </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-[#12304A] tracking-tight">
                                Consulta de Emendas Parlamentares
                            </h3>
                            <p className="text-xs text-[#5B738B] font-medium mt-1">
                                Total no recorte ativo: <strong className="text-[#12304A]">{filtered.length} registro(s)</strong>
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2.5 items-center">
                            <div className="relative flex-1 sm:w-72">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Autor, objeto ou código..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-medium text-[#12304A] focus:border-[#1254A3] focus:bg-white outline-none transition-all"
                                />
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    showFilters || hasFilters
                                        ? "bg-[#1254A3] text-white shadow-sm"
                                        : "bg-white border border-[#DDE3EA] text-[#12304A] hover:border-[#1254A3]"
                                }`}
                            >
                                <FaFilter size={10} /> Filtros {hasFilters && `(Ativos)`}
                            </button>

                            <button
                                onClick={handleSync}
                                disabled={isSyncing}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-50 text-[#1254A3] border border-blue-200 hover:bg-blue-100 transition-all cursor-pointer disabled:opacity-50"
                            >
                                <FaSyncAlt className={isSyncing ? "animate-spin" : ""} size={10} />
                                {isSyncing ? "Consultando..." : "Sincronizar"}
                            </button>

                            <a
                                href={`/api/transparencia/emendas-parlamentares/export-csv?${new URLSearchParams({
                                    ...(filtroAno && { ano: filtroAno }),
                                    ...(filtroEsfera && { esfera: filtroEsfera }),
                                    ...(filtroAutor && { autor: filtroAutor }),
                                    ...(filtroTipo && { tipo: filtroTipo }),
                                    ...(filtroFuncao && { funcao: filtroFuncao }),
                                    ...(filtroSituacao && { situacao: filtroSituacao }),
                                    ...(busca && { busca: busca })
                                }).toString()}`}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all"
                            >
                                <FaDownload size={10} /> Exportar CSV
                            </a>
                        </div>
                    </div>

                    {/* Feedback da Consulta Automática */}
                    {syncFeedback && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2.5 text-blue-900 text-xs font-bold">
                            <FaCheckCircle className="text-blue-600 shrink-0" />
                            <span>{syncFeedback}</span>
                        </div>
                    )}

                    {/* Filtros Container */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden pt-4 border-t border-slate-100"
                            >
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Ano</label>
                                        <select 
                                            value={filtroAno} 
                                            onChange={e => setFiltroAno(e.target.value)} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                                        >
                                            <option value="">Todos</option>
                                            {anos.map(a => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Esfera (17.1)</label>
                                        <select 
                                            value={filtroEsfera} 
                                            onChange={e => setFiltroEsfera(e.target.value)} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                                        >
                                            <option value="">Todas</option>
                                            {esferas.map(e => <option key={e} value={e}>{e}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Repasse (17.1)</label>
                                        <select 
                                            value={filtroFormaRepasse} 
                                            onChange={e => setFiltroFormaRepasse(e.target.value)} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                                        >
                                            <option value="">Todos</option>
                                            {formasRepasse.map(f => <option key={f} value={f!}>{f}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tipo</label>
                                        <select 
                                            value={filtroTipo} 
                                            onChange={e => setFiltroTipo(e.target.value)} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                                        >
                                            <option value="">Todos</option>
                                            {tipos.map(t => <option key={t} value={t!}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Função (17.1)</label>
                                        <select 
                                            value={filtroFuncao} 
                                            onChange={e => setFiltroFuncao(e.target.value)} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                                        >
                                            <option value="">Todas</option>
                                            {funcoes.map(f => <option key={f} value={f!}>{f}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Situação</label>
                                        <select 
                                            value={filtroSituacao} 
                                            onChange={e => setFiltroSituacao(e.target.value)} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                                        >
                                            <option value="">Todas</option>
                                            {situacoes.map(si => <option key={si} value={si!}>{si}</option>)}
                                        </select>
                                    </div>
                                </div>
                                {hasFilters && (
                                    <div className="flex justify-end pt-3">
                                        <button onClick={clearFilters} className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer">
                                            <FaTimes size={10} /> Limpar filtros aplicados
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Tabela de Resultados */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#F5F7FA] text-slate-600 uppercase text-[10px] font-bold">
                            <tr>
                                <th className="px-6 py-4">Parlamentar / Identificador (17.1)</th>
                                <th className="px-4 py-4 text-center">Esfera & Ano (17.1)</th>
                                <th className="px-6 py-4">Objeto & Finalidade</th>
                                <th className="px-6 py-4">Previsto / Repasse</th>
                                <th className="px-6 py-4">Execução Paga (17.2)</th>
                                <th className="px-4 py-4 text-center">Situação</th>
                                <th className="px-6 py-4 text-right">Ação</th>
                            </tr>
                        </thead>
                        <motion.tbody 
                            variants={tableVariants}
                            initial="hidden"
                            animate="visible"
                            className="divide-y divide-[#DDE3EA]"
                        >
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center text-slate-400">
                                        Nenhuma emenda parlamentar encontrada para os filtros selecionados.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((e) => (
                                    <motion.tr 
                                        key={e.id}
                                        variants={rowVariants}
                                        className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                                        onClick={() => setDetalheId(e.id)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-[#12304A] text-xs group-hover:text-[#1254A3] transition-colors">{e.autorNome}</div>
                                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                                {e.codigoEmenda} {e.numeroEmenda ? `• Nº ${e.numeroEmenda}` : ""}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                                e.esfera === "Estadual"
                                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                                    : e.esfera === "Municipal"
                                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                            }`}>
                                                {e.esfera || "Federal"} • {e.anoEmenda}
                                            </span>
                                            <span className="block text-[9px] text-slate-400 mt-0.5">
                                                {e.formaRepasse || e.tipoEmenda || "Transferência"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <p className="text-xs text-slate-700 font-medium line-clamp-2">
                                                {e.objeto || "Não especificado"}
                                            </p>
                                            <span className="text-[10px] font-bold text-emerald-700 block mt-0.5 uppercase">
                                                {e.funcaoGoverno || "Saúde / Geral"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-slate-900 block">{fmt(e.valorPrevisto)}</span>
                                            <span className="text-[10px] text-slate-400">Rec.: {fmt(e.valorRecebido || e.valorPrevisto)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-emerald-700 block">{fmt(e.valorPago)}</span>
                                            <span className="text-[10px] text-blue-600">Emp.: {fmt(e.valorEmpenhado || e.valorPago)}</span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                {e.situacaoExecucao || "Pago"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={(evt) => { evt.stopPropagation(); setDetalheId(e.id); }}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#1254A3] hover:bg-[#1254A3] hover:text-white transition-all text-xs font-bold cursor-pointer"
                                            >
                                                Detalhes <FaChevronRight size={9} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </motion.tbody>
                    </table>
                </div>

                {/* Resumo Final Dinâmico refletindo o recorte ativo */}
                {filtered.length > 0 && (
                    <div className="p-6 bg-[#12304A] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-8">
                            <div>
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">Total Previsto / Indicado</span>
                                <span className="text-xl font-black text-white">
                                    {fmt(filtered.reduce((s, e) => s + (e.valorPrevisto || 0), 0))}
                                </span>
                            </div>
                            <div className="h-8 w-px bg-white/20 hidden sm:block" />
                            <div>
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-300">Total Executado / Pago</span>
                                <span className="text-xl font-black text-emerald-400">
                                    {fmt(filtered.reduce((s, e) => s + (e.valorPago || 0), 0))}
                                </span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-300 italic text-center sm:text-right max-w-sm">
                            * Recorte dinâmico conforme critérios 17.1 e 17.2 da Matriz PNTP 2026.
                        </p>
                    </div>
                )}
            </motion.div>
        </>
    );
}
