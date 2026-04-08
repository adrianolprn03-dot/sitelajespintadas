"use client";
import { useState, useMemo } from "react";
import { 
    FaSearch, FaFilter, FaTimes, FaDownload, 
    FaExternalLinkAlt, FaChevronRight, FaFileInvoiceDollar, 
    FaCalendarAlt, FaUserTie, FaTags
} from "react-icons/fa";
import { FaBuildingColumns } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

type Emenda = {
    id: string;
    codigoEmenda: string;
    anoEmenda: number;
    autorNome: string;
    tipoEmenda: string | null;
    objeto: string | null;
    funcaoGoverno: string | null;
    valorPrevisto: number | null;
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
    const [filtroAutor, setFiltroAutor] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroFuncao, setFiltroFuncao] = useState("");
    const [filtroSituacao, setFiltroSituacao] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [detalheId, setDetalheId] = useState<string | null>(null);

    const anos = useMemo(() => Array.from(new Set(initialData.map(i => i.anoEmenda))).sort((a, b) => b - a), [initialData]);
    const autores = useMemo(() => Array.from(new Set(initialData.map(i => i.autorNome))).sort(), [initialData]);
    const tipos = useMemo(() => Array.from(new Set(initialData.map(i => i.tipoEmenda).filter(Boolean))).sort(), [initialData]);
    const funcoes = useMemo(() => Array.from(new Set(initialData.map(i => i.funcaoGoverno).filter(Boolean))).sort(), [initialData]);
    const situacoes = useMemo(() => Array.from(new Set(initialData.map(i => i.situacaoExecucao).filter(Boolean))).sort(), [initialData]);

    const filtered = useMemo(() => {
        return initialData.filter(i => {
            if (filtroAno && i.anoEmenda !== parseInt(filtroAno)) return false;
            if (filtroAutor && i.autorNome !== filtroAutor) return false;
            if (filtroTipo && i.tipoEmenda !== filtroTipo) return false;
            if (filtroFuncao && i.funcaoGoverno !== filtroFuncao) return false;
            if (filtroSituacao && i.situacaoExecucao !== filtroSituacao) return false;
            if (busca) {
                const term = busca.toLowerCase();
                return (
                    i.autorNome.toLowerCase().includes(term) ||
                    (i.objeto || "").toLowerCase().includes(term) ||
                    i.codigoEmenda.toLowerCase().includes(term)
                );
            }
            return true;
        });
    }, [initialData, filtroAno, filtroAutor, filtroTipo, filtroFuncao, filtroSituacao, busca]);

    const hasFilters = filtroAno || filtroAutor || filtroTipo || filtroFuncao || filtroSituacao || busca;
    const clearFilters = () => {
        setFiltroAno(""); setFiltroAutor(""); setFiltroTipo(""); setFiltroFuncao(""); setFiltroSituacao(""); setBusca("");
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
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md" 
                        onClick={() => setDetalheId(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="bg-white rounded-[3rem] w-full max-w-2xl p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] max-h-[92vh] overflow-y-auto border border-white relative overflow-hidden" 
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Accent Decoration */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                            
                            <div className="flex items-start justify-between mb-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-1">
                                            <FaFileInvoiceDollar /> Detalhamento Técnico
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none">
                                        Emenda Parlamentar
                                    </h2>
                                </div>
                                <button onClick={() => setDetalheId(null)} className="p-4 bg-slate-100 hover:bg-slate-200 rounded-[1.5rem] transition-all group">
                                    <FaTimes className="text-slate-400 group-hover:rotate-90 transition-transform duration-500" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* Informações Primárias (Bento Style) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Autor</span>
                                        <div className="flex items-center gap-2 text-slate-900 font-black text-sm tracking-tight uppercase">
                                            <FaUserTie className="text-blue-500" /> {detalhe.autorNome}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Ano / Exercício</span>
                                        <div className="flex items-center gap-2 text-slate-900 font-black text-sm tracking-tight uppercase">
                                            <FaCalendarAlt className="text-blue-500" /> {detalhe.anoEmenda}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Código</span>
                                        <div className="text-slate-400 font-mono text-[10px] uppercase tracking-widest font-black truncate">{detalhe.codigoEmenda}</div>
                                    </div>
                                </div>

                                {/* Objeto em destaque */}
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500 rounded-full" />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-2">Finalidade do Recurso</span>
                                    <p className="text-lg font-bold text-slate-700 leading-snug tracking-tight">
                                        {detalhe.objeto || "Não informado na base oficial."}
                                    </p>
                                </div>

                                {/* Valores (Bento Grid) */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: "Previsto", val: detalhe.valorPrevisto, clr: "text-slate-600", bg: "bg-slate-50" },
                                        { label: "Empenhado", val: detalhe.valorEmpenhado, clr: "text-emerald-600", bg: "bg-emerald-50/50" },
                                        { label: "Liquidado", val: detalhe.valorLiquidado, clr: "text-blue-600", bg: "bg-blue-50/50" },
                                        { label: "Pago", val: detalhe.valorPago, clr: "text-indigo-600", bg: "bg-indigo-50/50" },
                                    ].map((v, i) => (
                                        <div key={i} className={`${v.bg} rounded-2xl p-5 border border-white shadow-sm flex flex-col justify-between`}>
                                            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{v.label}</span>
                                            <span className={`block text-xs font-black tracking-tighter ${v.clr}`}>{fmt(v.val as number)}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Detalhes Técnicos Secundários */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="p-2 bg-white rounded-xl shadow-sm"><FaBuildingColumns className="text-slate-400" /></div>
                                        <div>
                                            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Órgão Concedente</span>
                                            <span className="text-[10px] font-bold text-slate-700 uppercase">{detalhe.orgaoConcedente || "Poder Executivo"}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="p-2 bg-white rounded-xl shadow-sm"><FaTags className="text-slate-400" /></div>
                                        <div>
                                            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Função</span>
                                            <span className="text-[10px] font-bold text-slate-700 uppercase">{detalhe.funcaoGoverno || "Geral"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 flex flex-col sm:flex-row gap-4">
                                    {detalhe.urlFonteOficial && (
                                        <a
                                            href={detalhe.urlFonteOficial}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                                        >
                                            <FaExternalLinkAlt /> Ver na fonte oficial
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setDetalheId(null)}
                                        className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-600 px-8 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all font-inter"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Layout Tabela Bento */}
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(15,23,42,0.08)] border border-slate-100 overflow-hidden"
            >
                {/* Header Dinâmico */}
                <div className="p-10 lg:p-12 space-y-8 bg-gradient-to-b from-white to-slate-50/50">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Emendas Parlamentares</h3>
                            </div>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Total consolidado: <span className="text-slate-800">{filtered.length} registro(s)</span></p>
                        </div>

                        <div className="flex flex-wrap gap-4 items-center">
                            {/* Buscar */}
                            <div className="relative group w-full sm:w-80">
                                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 group-focus-within:scale-110 transition-all" />
                                <input
                                    type="text"
                                    placeholder="Autor ou objeto da emenda..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="w-full pl-14 pr-8 py-5 bg-white border border-slate-200 rounded-[1.75rem] text-sm font-bold text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm outline-none placeholder:text-slate-300 font-inter"
                                />
                            </div>

                            {/* Filtrar Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-3 h-[60px] px-8 rounded-[1.75rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                                    showFilters || hasFilters ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400" : "bg-white border border-slate-100 text-slate-500 shadow-sm hover:border-slate-300"
                                }`}
                            >
                                <FaFilter className={showFilters ? "rotate-180 transition-transform duration-500" : ""} /> Filtros
                            </button>

                            {/* Exportar */}
                            <a
                                href={`/api/transparencia/emendas-parlamentares/export-csv?${new URLSearchParams({
                                    ...(filtroAno && { ano: filtroAno }),
                                    ...(filtroAutor && { autor: filtroAutor }),
                                    ...(filtroTipo && { tipo: filtroTipo }),
                                    ...(filtroFuncao && { funcao: filtroFuncao }),
                                    ...(filtroSituacao && { situacao: filtroSituacao }),
                                    ...(busca && { busca: busca })
                                }).toString()}`}
                                className="flex items-center gap-3 h-[60px] px-8 rounded-[1.75rem] text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-transparent hover:border-emerald-200 hover:bg-emerald-100/50 transition-all shadow-sm"
                            >
                                <FaDownload /> Exportar Dados
                            </a>
                        </div>
                    </div>

                    {/* Filtros Container */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pt-10 border-t border-slate-100">
                                    {[
                                        { l: "Ano", v: filtroAno, s: setFiltroAno, ops: anos.map(a => ({v: a, t: a})) },
                                        { l: "Autor", v: filtroAutor, s: setFiltroAutor, ops: autores.map(a => ({v: a, t: a})) },
                                        { l: "Tipo", v: filtroTipo, s: setFiltroTipo, ops: tipos.map(t => ({v: t!, t: t!})) },
                                        { l: "Função", v: filtroFuncao, s: setFiltroFuncao, ops: funcoes.map(f => ({v: f!, t: f!})) },
                                        { l: "Situação", v: filtroSituacao, s: setFiltroSituacao, ops: situacoes.map(si => ({v: si!, t: si!})) },
                                    ].map((f, i) => (
                                        <div key={i} className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{f.l}</label>
                                            <select 
                                                value={f.v} 
                                                onChange={e => f.s(e.target.value)} 
                                                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                            >
                                                <option value="">Todos</option>
                                                {f.ops.map(o => <option key={o.v} value={o.v}>{o.t}</option>)}
                                            </select>
                                        </div>
                                    ))}
                                    <div className="lg:col-span-5 flex justify-end pt-4">
                                        <button onClick={clearFilters} className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase text-red-500 hover:bg-red-50 transition-all">
                                            <FaTimes /> Limpar todos os filtros
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Tabela de Resultados */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-12 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Parlamentar / Código</th>
                                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-center">Ano</th>
                                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Objeto da Emenda</th>
                                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Repasse Pago</th>
                                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-center">Status</th>
                                <th className="px-12 py-7 border-b border-slate-100"></th>
                            </tr>
                        </thead>
                        <motion.tbody 
                            variants={tableVariants}
                            initial="hidden"
                            animate="visible"
                            className="divide-y divide-slate-50/50"
                        >
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-12 py-32 text-center">
                                        <div className="max-w-sm mx-auto flex flex-col items-center">
                                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner">
                                                <FaSearch className="text-slate-200 text-4xl" />
                                            </div>
                                            <p className="text-slate-400 font-bold text-lg leading-tight uppercase tracking-widest">Nenhuma emenda encontrada</p>
                                            <p className="text-slate-300 text-sm mt-2 font-inter">Tente ajustar seus critérios de busca ou filtros.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((e, idx) => (
                                    <motion.tr 
                                        key={e.id}
                                        variants={rowVariants}
                                        className="hover:bg-blue-50/10 transition-all duration-300 group cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500"
                                        onClick={() => setDetalheId(e.id)}
                                    >
                                        <td className="px-12 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors leading-none mb-2">{e.autorNome}</span>
                                                <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                                                    <span className="w-8 h-px bg-slate-100 group-hover:w-12 transition-all" /> {e.codigoEmenda}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-center">
                                            <span className="inline-block bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest leading-none font-inter">
                                                {e.anoEmenda}
                                            </span>
                                        </td>
                                        <td className="px-8 py-8 max-w-md">
                                            <p className="text-xs font-bold text-slate-600 leading-relaxed line-clamp-2 tracking-tight">
                                                {e.objeto || "Não especificado"}
                                            </p>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-base font-black text-blue-600 tracking-tighter leading-none mb-1">{fmt(e.valorPago)}</span>
                                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Valor Liquidado em base</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-center">
                                            <span className="inline-block text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100/50 shadow-sm group-hover:translate-y-[-2px] transition-transform">
                                                {e.situacaoExecucao || "Processada"}
                                            </span>
                                        </td>
                                        <td className="px-12 py-8 text-right">
                                            <div className="inline-flex items-center gap-3 text-[10px] font-black text-slate-200 group-hover:text-blue-600 transition-all uppercase tracking-widest">
                                                Visualizar
                                                <div className="w-10 h-10 rounded-2xl bg-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center transform group-hover:rotate-[-5deg]">
                                                    <FaChevronRight className="translate-x-[1px]" />
                                                </div>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </motion.tbody>
                    </table>
                </div>

                {/* Resumo Final Bento */}
                {filtered.length > 0 && (
                    <div className="px-12 py-10 bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                        <div className="flex flex-col sm:flex-row gap-12">
                            <div>
                                <span className="block text-[9px] font-black text-indigo-400 uppercase tracking-[0.25em] mb-4">Total Empenhado</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black tracking-tighter text-white">
                                        {fmt(filtered.reduce((s, e) => s + (e.valorEmpenhado || 0), 0))}
                                    </span>
                                </div>
                            </div>
                            <div className="hidden sm:block w-px h-16 bg-white/10" />
                            <div>
                                <span className="block text-[9px] font-black text-indigo-400 uppercase tracking-[0.25em] mb-4">Total Pago</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black tracking-tighter text-blue-400">
                                        {fmt(filtered.reduce((s, e) => s + (e.valorPago || 0), 0))}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 max-w-sm">
                            <p className="text-[10px] font-medium leading-relaxed italic text-indigo-100 opacity-70">
                                * Valores sujeitos a variação conforme atualização das bases governamentais. Os dados aqui exibidos correspondem à última importação bem-sucedida.
                            </p>
                        </div>
                    </div>
                )}
            </motion.div>
        </>
    );
}
