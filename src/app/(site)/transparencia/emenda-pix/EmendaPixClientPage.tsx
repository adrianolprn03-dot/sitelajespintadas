"use client";
import { useState, useMemo } from "react";
import { FaSearch, FaFilter, FaTimes, FaDownload, FaExternalLinkAlt, FaChevronRight } from "react-icons/fa";
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

export default function EmendaPixClientPage({ initialData }: { initialData: Emenda[] }) {
    const [busca, setBusca] = useState("");
    const [filtroAno, setFiltroAno] = useState("");
    const [filtroAutor, setFiltroAutor] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [detalheId, setDetalheId] = useState<string | null>(null);

    const anos = useMemo(() => Array.from(new Set(initialData.map(i => i.anoEmenda))).sort((a, b) => b - a), [initialData]);
    const autores = useMemo(() => Array.from(new Set(initialData.map(i => i.autorNome))).sort(), [initialData]);

    const filtered = useMemo(() => {
        return initialData.filter(i => {
            if (filtroAno && i.anoEmenda !== parseInt(filtroAno)) return false;
            if (filtroAutor && i.autorNome !== filtroAutor) return false;
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
    }, [initialData, filtroAno, filtroAutor, busca]);

    const hasFilters = filtroAno || filtroAutor || busca;
    const clearFilters = () => {
        setFiltroAno(""); setFiltroAutor(""); setBusca("");
    };

    const detalhe = detalheId ? initialData.find(e => e.id === detalheId) : null;

    return (
        <>
            {/* Modal Detalhe com Animação */}
            <AnimatePresence>
                {detalhe && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" 
                        onClick={() => setDetalheId(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl max-h-[90vh] overflow-y-auto border border-white" 
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.2em] mb-1 block">Detalhamento</span>
                                    <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
                                        Emenda PIX
                                    </h2>
                                </div>
                                <button onClick={() => setDetalheId(null)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors">
                                    <FaTimes className="text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                                    {[
                                        ["Autor da Emenda", detalhe.autorNome, "text-gray-900 font-black"],
                                        ["Código da Emenda", detalhe.codigoEmenda, "font-mono text-gray-500 text-xs text-uppercase"],
                                        ["Ano de Referência", detalhe.anoEmenda, "font-bold"],
                                        ["Modalidade", detalhe.tipoEmenda, "font-bold text-teal-600"],
                                    ].map(([label, value, extra]) => (
                                        <div key={label as string}>
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">{label as string}</span>
                                            <span className={`text-sm ${extra}`}>{value || "—"}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Objeto / Finalidade</span>
                                        <p className="text-sm font-bold text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            {detalhe.objeto || "Não informado na base oficial. Recursos de transferência especial podem ser aplicados em diversas áreas."}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            ["Recebido", detalhe.valorPago, "text-teal-600"],
                                            ["Ano", detalhe.anoEmenda, "text-gray-800"],
                                        ].map(([label, value, color], idx) => (
                                            <div key={idx} className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100/50">
                                                <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{label as string}</span>
                                                <span className={`block text-xs font-black ${color}`}>{typeof value === 'number' ? fmt(value) : value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 flex flex-col md:flex-row gap-4">
                                    {detalhe.urlFonteOficial && (
                                        <a
                                            href={detalhe.urlFonteOficial}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                        >
                                            <FaExternalLinkAlt /> Ver no Portal da Transparência Federal
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setDetalheId(null)}
                                        className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-600 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                                    >
                                        Fechar Detalhes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Container Tabela */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200/50 border border-white"
            >
                {/* Header Tabela + Filtros */}
                <div className="p-10 border-b border-gray-100 space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-1">Listagem de Transferências</h3>
                            <p className="text-xs text-gray-400 font-bold">Total de {filtered.length} emenda(s) encontrada(s)</p>
                        </div>
                        <div className="flex flex-wrap gap-3 items-center">
                            <div className="relative group">
                                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-teal-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Buscar autor ou objeto..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] text-xs font-bold w-full md:w-72 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-6 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${
                                    showFilters || filtroAno || filtroAutor ? "bg-teal-50 text-teal-700 ring-2 ring-teal-500/20" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                }`}
                            >
                                <FaFilter /> Filtros
                            </button>
                            {/* Exportar com filtros aplicados, forçando tipo=Transferência Especial */}
                            <a
                                href={`/api/transparencia/emendas-parlamentares/export-csv?tipo=Transferência Especial${filtroAno ? `&ano=${filtroAno}` : ""}${filtroAutor ? `&autor=${filtroAutor}` : ""}${busca ? `&busca=${busca}` : ""}`}
                                className="flex items-center gap-2 px-6 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all"
                            >
                                <FaDownload /> Exportar
                            </a>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Ano</label>
                                        <select 
                                            value={filtroAno} 
                                            onChange={e => setFiltroAno(e.target.value)} 
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-teal-500/20"
                                        >
                                            <option value="">Todos os anos</option>
                                            {anos.map(a => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Autor</label>
                                        <select 
                                            value={filtroAutor} 
                                            onChange={e => setFiltroAutor(e.target.value)} 
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-teal-500/20"
                                        >
                                            <option value="">Todos os autores</option>
                                            {autores.map(a => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        {(filtroAno || filtroAutor) && (
                                            <button 
                                                onClick={clearFilters} 
                                                className="mb-1 flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                            >
                                                <FaTimes /> Limpar Filtros
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Tabela com scroll horizontal suave */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Autor / Origem</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Ano</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Objeto / Finalidade</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Valor Recebido</th>
                                <th className="px-10 py-6 text-right border-b border-gray-100"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center">
                                        <div className="max-w-xs mx-auto space-y-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto">
                                                <FaSearch className="text-gray-200 text-3xl" />
                                            </div>
                                            <p className="text-gray-400 font-bold text-sm leading-relaxed">
                                                Nenhuma transferência PIX encontrada para os filtros selecionados.
                                            </p>
                                            {hasFilters && (
                                                <button onClick={clearFilters} className="text-xs font-black text-teal-600 uppercase tracking-widest hover:underline">
                                                    Limpar busca
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((e, idx) => (
                                    <motion.tr 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.02 }}
                                        key={e.id} 
                                        className="hover:bg-blue-50/20 transition-all duration-300 group cursor-pointer"
                                        onClick={() => setDetalheId(e.id)}
                                    >
                                        <td className="px-10 py-7">
                                            <span className="text-sm font-black text-gray-800 uppercase tracking-tight block mb-1 group-hover:text-teal-600 transition-colors">{e.autorNome}</span>
                                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{e.codigoEmenda}</span>
                                        </td>
                                        <td className="px-8 py-7">
                                            <span className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">{e.anoEmenda}</span>
                                        </td>
                                        <td className="px-8 py-7 max-w-sm">
                                            <p className="text-xs font-bold text-gray-600 leading-relaxed line-clamp-2">
                                                {e.objeto || "Transferência Especial de Recursos para aplicação livre conforme regulamentação."}
                                            </p>
                                        </td>
                                        <td className="px-8 py-7">
                                            <span className="text-sm font-black text-teal-600 tracking-tighter">{fmt(e.valorPago)}</span>
                                            <span className="block text-[9px] font-black text-gray-300 uppercase tracking-widest mt-0.5">Disponível em caixa</span>
                                        </td>
                                        <td className="px-10 py-7 text-right">
                                            <div className="inline-flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover:text-teal-500 transition-all">
                                                Detalhes
                                                <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Sumário */}
                {filtered.length > 0 && (
                    <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex gap-8">
                            <div>
                                <span className="block text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total de Recursos</span>
                                <span className="text-lg font-black text-teal-600 tracking-tighter">
                                    {fmt(filtered.reduce((s, e) => s + (e.valorPago || 0), 0))}
                                </span>
                            </div>
                            <div className="w-px h-10 bg-gray-200 hidden md:block" />
                            <div>
                                <span className="block text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total de Repasses</span>
                                <span className="text-lg font-black text-gray-800 tracking-tighter">
                                    {filtered.length}
                                </span>
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 italic">
                            * Dados obtidos via API do Portal da Transparência Federal
                        </p>
                    </div>
                )}
            </motion.div>
        </>
    );
}
