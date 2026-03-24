"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
    FaMoneyBillWave, FaEdit, FaTrash, FaSpinner, FaSearch,
    FaUpload, FaDownload, FaFilter, FaTimes
} from "react-icons/fa";
import toast from "react-hot-toast";

type Emenda = {
    id: string;
    codigoEmenda: string;
    anoEmenda: number;
    autorNome: string;
    numeroEmenda: string | null;
    tipoEmenda: string | null;
    objeto: string | null;
    funcaoGoverno: string | null;
    valorPrevisto: number | null;
    valorEmpenhado: number | null;
    valorLiquidado: number | null;
    valorPago: number | null;
    situacaoExecucao: string | null;
    urlFonteOficial: string | null;
};

const fmt = (v: number | null) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

export default function AdminEmendasPage() {
    const [items, setItems] = useState<Emenda[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [filtroAno, setFiltroAno] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroFuncao, setFiltroFuncao] = useState("");
    const [filtroSituacao, setFiltroSituacao] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/emendas");
            const data = await res.json();
            setItems(data || []);
        } catch {
            toast.error("Erro ao carregar emendas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir esta emenda?")) return;
        try {
            const res = await fetch(`/api/admin/emendas/${id}`, { method: "DELETE" });
            if (res.ok) { toast.success("Removida"); fetchData(); }
        } catch { toast.error("Erro ao remover"); }
    };

    // Valores únicos para filtros
    const anos = useMemo(() => Array.from(new Set(items.map(i => i.anoEmenda))).sort((a, b) => b - a), [items]);
    const tipos = useMemo(() => Array.from(new Set(items.map(i => i.tipoEmenda).filter(Boolean))).sort(), [items]);
    const funcoes = useMemo(() => Array.from(new Set(items.map(i => i.funcaoGoverno).filter(Boolean))).sort(), [items]);
    const situacoes = useMemo(() => Array.from(new Set(items.map(i => i.situacaoExecucao).filter(Boolean))).sort(), [items]);

    const filtered = useMemo(() => {
        return items.filter(i => {
            if (filtroAno && i.anoEmenda !== parseInt(filtroAno)) return false;
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
    }, [items, filtroAno, filtroTipo, filtroFuncao, filtroSituacao, busca]);

    const hasFilters = filtroAno || filtroTipo || filtroFuncao || filtroSituacao;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaMoneyBillWave className="text-emerald-500" /> Emendas Parlamentares
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {items.length} emenda{items.length !== 1 ? "s" : ""} cadastrada{items.length !== 1 ? "s" : ""} no sistema.
                    </p>
                </div>
                <div className="flex gap-3">
                    <a
                        href="/api/transparencia/emendas-parlamentares/export-csv"
                        className="bg-gray-100 text-gray-600 px-5 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-gray-200 transition-colors"
                    >
                        <FaDownload /> Exportar CSV
                    </a>
                    <Link
                        href="/admin/emendas/importar"
                        className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all"
                    >
                        <FaUpload /> Importar CSV
                    </Link>
                </div>
            </div>

            {/* Busca e Filtros */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 space-y-4">
                    <div className="flex gap-3 items-center">
                        <div className="relative flex-1 max-w-md">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                                type="text"
                                placeholder="Buscar por autor, objeto ou código..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                                showFilters || hasFilters ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            <FaFilter /> Filtros {hasFilters && `(${[filtroAno, filtroTipo, filtroFuncao, filtroSituacao].filter(Boolean).length})`}
                        </button>
                        {hasFilters && (
                            <button
                                onClick={() => { setFiltroAno(""); setFiltroTipo(""); setFiltroFuncao(""); setFiltroSituacao(""); }}
                                className="flex items-center gap-1 px-3 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <FaTimes /> Limpar
                            </button>
                        )}
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                            <select value={filtroAno} onChange={e => setFiltroAno(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold">
                                <option value="">Todos os anos</option>
                                {anos.map(a => <option key={a} value={a}>{a}</option>)}
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
                        </div>
                    )}
                </div>

                {/* Tabela */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                <th className="px-6 py-4">Autor / Código</th>
                                <th className="px-6 py-4">Ano / Tipo</th>
                                <th className="px-6 py-4">Objeto</th>
                                <th className="px-6 py-4">Empenhado</th>
                                <th className="px-6 py-4">Pago</th>
                                <th className="px-6 py-4">Situação</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <FaSpinner className="animate-spin inline-block text-emerald-500 text-2xl" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhuma emenda encontrada.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((i) => (
                                    <tr key={i.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-700 uppercase text-xs">{i.autorNome}</div>
                                            <div className="text-[10px] text-gray-400 font-mono">{i.codigoEmenda}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-700 text-xs">{i.anoEmenda}</div>
                                            <div className="text-[10px] text-gray-400">{i.tipoEmenda || "—"}</div>
                                        </td>
                                        <td className="px-6 py-4 max-w-[250px]">
                                            <div className="text-xs text-gray-600 line-clamp-2">{i.objeto || "—"}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-emerald-600 text-xs">{fmt(i.valorEmpenhado)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-blue-600 text-xs">{fmt(i.valorPago)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[9px] font-black uppercase px-2 py-1 bg-gray-100 text-gray-500 rounded">
                                                {i.situacaoExecucao || "—"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleDelete(i.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Rodapé com contagem */}
                {!loading && filtered.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 font-bold">
                        Exibindo {filtered.length} de {items.length} emenda{items.length !== 1 ? "s" : ""}
                        {" · "}
                        Total Empenhado: {fmt(filtered.reduce((s, i) => s + (i.valorEmpenhado || 0), 0))}
                        {" · "}
                        Total Pago: {fmt(filtered.reduce((s, i) => s + (i.valorPago || 0), 0))}
                    </div>
                )}
            </div>
        </div>
    );
}
