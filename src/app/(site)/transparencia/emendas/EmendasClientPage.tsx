"use client";
import { useState, useMemo } from "react";
import { FaSearch, FaFilter, FaTimes, FaDownload, FaExternalLinkAlt } from "react-icons/fa";

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

    const hasFilters = filtroAno || filtroAutor || filtroTipo || filtroFuncao || filtroSituacao;
    const clearFilters = () => {
        setFiltroAno(""); setFiltroAutor(""); setFiltroTipo(""); setFiltroFuncao(""); setFiltroSituacao(""); setBusca("");
    };

    const detalhe = detalheId ? initialData.find(e => e.id === detalheId) : null;

    // Montar query string para export
    const exportParams = new URLSearchParams();
    if (filtroAno) exportParams.set("ano", filtroAno);
    if (filtroAutor) exportParams.set("autor", filtroAutor);
    if (filtroTipo) exportParams.set("tipo", filtroTipo);
    if (filtroFuncao) exportParams.set("funcao", filtroFuncao);
    if (filtroSituacao) exportParams.set("situacao", filtroSituacao);
    if (busca) exportParams.set("busca", busca);
    const exportUrl = `/api/transparencia/emendas-parlamentares/export-csv${exportParams.toString() ? "?" + exportParams.toString() : ""}`;

    return (
        <>
            {/* Modal Detalhe */}
            {detalhe && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setDetalheId(null)}>
                    <div className="bg-white rounded-[2rem] w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tighter">
                                Detalhe da Emenda
                            </h2>
                            <button onClick={() => setDetalheId(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <FaTimes className="text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {[
                                ["Código", detalhe.codigoEmenda],
                                ["Autor", detalhe.autorNome],
                                ["Ano", detalhe.anoEmenda],
                                ["Tipo", detalhe.tipoEmenda],
                                ["Objeto", detalhe.objeto],
                                ["Função de Governo", detalhe.funcaoGoverno],
                                ["Favorecido", detalhe.favorecidoNome],
                                ["Órgão Concedente", detalhe.orgaoConcedente],
                                ["Situação", detalhe.situacaoExecucao],
                            ].map(([label, value]) => (
                                <div key={label as string} className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
                                    <span className="text-sm font-bold text-gray-700">{value || "Não informado na base oficial"}</span>
                                </div>
                            ))}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
                                {[
                                    ["Previsto", detalhe.valorPrevisto, "text-gray-700"],
                                    ["Empenhado", detalhe.valorEmpenhado, "text-emerald-600"],
                                    ["Liquidado", detalhe.valorLiquidado, "text-blue-600"],
                                    ["Pago", detalhe.valorPago, "text-indigo-600"],
                                ].map(([label, value, color]) => (
                                    <div key={label as string} className="bg-gray-50 rounded-xl p-3 text-center">
                                        <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label as string}</span>
                                        <span className={`block text-sm font-black ${color}`}>{fmt(value as number)}</span>
                                    </div>
                                ))}
                            </div>

                            {detalhe.urlFonteOficial && (
                                <a
                                    href={detalhe.urlFonteOficial}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 mt-4"
                                >
                                    <FaExternalLinkAlt /> Ver na fonte oficial
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Bloco Filtros + Tabela */}
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/40 border border-white">
                <div className="p-8 border-b border-gray-100 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Detalhamento de Emendas</h3>
                        <div className="flex gap-3 items-center">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input
                                    type="text"
                                    placeholder="Buscar autor ou objeto..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold w-64 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                                    showFilters || hasFilters ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                }`}
                            >
                                <FaFilter /> Filtros
                            </button>
                            <a
                                href={exportUrl}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            >
                                <FaDownload /> CSV
                            </a>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="flex flex-wrap gap-3 pt-2">
                            <select value={filtroAno} onChange={e => setFiltroAno(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold">
                                <option value="">Todos os anos</option>
                                {anos.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            <select value={filtroAutor} onChange={e => setFiltroAutor(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold">
                                <option value="">Todos os autores</option>
                                {autores.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold">
                                <option value="">Todos os tipos</option>
                                {tipos.map(t => <option key={t} value={t!}>{t}</option>)}
                            </select>
                            <select value={filtroFuncao} onChange={e => setFiltroFuncao(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold">
                                <option value="">Todas as funções</option>
                                {funcoes.map(f => <option key={f} value={f!}>{f}</option>)}
                            </select>
                            <select value={filtroSituacao} onChange={e => setFiltroSituacao(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold">
                                <option value="">Todas as situações</option>
                                {situacoes.map(s => <option key={s} value={s!}>{s}</option>)}
                            </select>
                            {hasFilters && (
                                <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors">
                                    <FaTimes /> Limpar
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Tabela */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Autor</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Ano</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Tipo</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Objeto</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Função</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Empenhado</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Liquidado</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Pago</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Situação</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Fonte</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="px-8 py-16 text-center">
                                        <p className="text-gray-400 font-bold text-sm">Nenhuma emenda parlamentar encontrada.</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((e) => (
                                    <tr key={e.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-black text-gray-800 uppercase tracking-tighter">{e.autorNome}</span>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-bold text-gray-600">{e.anoEmenda}</td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-black text-gray-500 uppercase bg-gray-100 px-2 py-1 rounded">{e.tipoEmenda || "—"}</span>
                                        </td>
                                        <td className="px-6 py-5 max-w-[200px]">
                                            <p className="text-xs font-bold text-gray-700 leading-relaxed line-clamp-2">{e.objeto || "—"}</p>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-bold text-gray-500">{e.funcaoGoverno || "—"}</td>
                                        <td className="px-6 py-5 text-xs font-black text-emerald-600">{fmt(e.valorEmpenhado)}</td>
                                        <td className="px-6 py-5 text-xs font-black text-blue-600">{fmt(e.valorLiquidado)}</td>
                                        <td className="px-6 py-5 text-xs font-black text-indigo-600">{fmt(e.valorPago)}</td>
                                        <td className="px-6 py-5">
                                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{e.situacaoExecucao || "—"}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {e.urlFonteOficial ? (
                                                <a href={e.urlFonteOficial} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                                                    <FaExternalLinkAlt size={12} />
                                                </a>
                                            ) : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <button
                                                onClick={() => setDetalheId(e.id)}
                                                className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                Detalhar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Rodapé */}
                {filtered.length > 0 && (
                    <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 font-bold flex flex-wrap gap-4">
                        <span>Exibindo {filtered.length} emenda{filtered.length !== 1 ? "s" : ""}</span>
                        <span>·</span>
                        <span>Empenhado: {fmt(filtered.reduce((s, e) => s + (e.valorEmpenhado || 0), 0))}</span>
                        <span>·</span>
                        <span>Pago: {fmt(filtered.reduce((s, e) => s + (e.valorPago || 0), 0))}</span>
                    </div>
                )}
            </div>
        </>
    );
}
