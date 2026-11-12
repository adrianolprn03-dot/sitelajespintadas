"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
    FaMoneyBillWave, FaEdit, FaTrash, FaSpinner, FaSearch,
    FaUpload, FaDownload, FaFilter, FaTimes, FaSyncAlt, FaPlus, FaCheckCircle, FaExclamationCircle
} from "react-icons/fa";
import toast from "react-hot-toast";

type Emenda = {
    id: string;
    codigoEmenda: string;
    anoEmenda: number;
    autorNome: string;
    numeroEmenda: string | null;
    esfera: string | null;
    formaRepasse: string | null;
    tipoEmenda: string | null;
    objeto: string | null;
    funcaoGoverno: string | null;
    valorPrevisto: number | null;
    valorRecebido: number | null;
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
    const [filtroEsfera, setFiltroEsfera] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroFuncao, setFiltroFuncao] = useState("");
    const [filtroSituacao, setFiltroSituacao] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch("/api/transparencia/emendas-parlamentares/sincronizar", { method: "POST" });
            const json = await res.json();
            if (json.success) {
                toast.success(`Consulta automática concluída: ${json.mensagem}`);
                fetchData();
            } else {
                toast.error("Erro ao executar consulta automática.");
            }
        } catch {
            toast.error("Erro ao conectar à API de sincronização.");
        } finally {
            setIsSyncing(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/emendas");
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
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
            if (res.ok) { toast.success("Removida com sucesso"); fetchData(); }
            else { toast.error("Erro ao remover emenda"); }
        } catch { toast.error("Erro ao remover"); }
    };

    // Valores únicos para filtros
    const anos = useMemo(() => Array.from(new Set(items.map(i => i.anoEmenda))).sort((a, b) => b - a), [items]);
    const esferas = useMemo(() => Array.from(new Set(items.map(i => i.esfera || "Federal"))).sort(), [items]);
    const tipos = useMemo(() => Array.from(new Set(items.map(i => i.tipoEmenda).filter(Boolean))).sort(), [items]);
    const funcoes = useMemo(() => Array.from(new Set(items.map(i => i.funcaoGoverno).filter(Boolean))).sort(), [items]);
    const situacoes = useMemo(() => Array.from(new Set(items.map(i => i.situacaoExecucao).filter(Boolean))).sort(), [items]);

    const filtered = useMemo(() => {
        return items.filter(i => {
            if (filtroAno && i.anoEmenda !== parseInt(filtroAno)) return false;
            if (filtroEsfera && (i.esfera || "Federal") !== filtroEsfera) return false;
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
    }, [items, filtroAno, filtroEsfera, filtroTipo, filtroFuncao, filtroSituacao, busca]);

    const hasFilters = filtroAno || filtroEsfera || filtroTipo || filtroFuncao || filtroSituacao;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            PNTP Critérios 17.1, 17.2 e 17.3
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaMoneyBillWave className="text-emerald-500" /> Emendas Parlamentares
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {items.length} emenda{items.length !== 1 ? "s" : ""} oficial{items.length !== 1 ? "is" : ""} cadastrada{items.length !== 1 ? "s" : ""} no sistema (Federal, Estadual e Municipal).
                    </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                    <Link
                        href="/admin/emendas/novo"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
                    >
                        <FaPlus size={11} /> Nova Emenda
                    </Link>
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                    >
                        <FaSyncAlt className={isSyncing ? "animate-spin" : ""} size={11} />
                        {isSyncing ? "Consultando..." : "Sincronizar"}
                    </button>
                    <a
                        href="/api/transparencia/emendas-parlamentares/export-csv"
                        className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-gray-200 transition-colors"
                    >
                        <FaDownload size={11} /> Exportar
                    </a>
                    <Link
                        href="/admin/emendas/importar"
                        className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                    >
                        <FaUpload size={11} /> Importar CSV
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
                                placeholder="Buscar por autor, objeto, código ou número..."
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
                            <FaFilter /> Filtros {hasFilters && `(${[filtroAno, filtroEsfera, filtroTipo, filtroFuncao, filtroSituacao].filter(Boolean).length})`}
                        </button>
                        {hasFilters && (
                            <button
                                onClick={() => { setFiltroAno(""); setFiltroEsfera(""); setFiltroTipo(""); setFiltroFuncao(""); setFiltroSituacao(""); }}
                                className="flex items-center gap-1 px-3 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <FaTimes /> Limpar
                            </button>
                        )}
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                            <select value={filtroAno} onChange={e => setFiltroAno(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold">
                                <option value="">Todos os anos</option>
                                {anos.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            <select value={filtroEsfera} onChange={e => setFiltroEsfera(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold">
                                <option value="">Todas as esferas</option>
                                {esferas.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                            <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold">
                                <option value="">Todos os tipos</option>
                                {tipos.map(t => <option key={t} value={t!}>{t}</option>)}
                            </select>
                            <select value={filtroFuncao} onChange={e => setFiltroFuncao(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold">
                                <option value="">Todas as funções</option>
                                {funcoes.map(f => <option key={f} value={f!}>{f}</option>)}
                            </select>
                            <select value={filtroSituacao} onChange={e => setFiltroSituacao(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold">
                                <option value="">Todas as situações</option>
                                {situacoes.map(s => <option key={s} value={s!}>{s}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                {/* Tabela de Emendas com Critérios 17.1, 17.2 e 17.3 */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                <th className="px-6 py-4">Autor / Código (17.1)</th>
                                <th className="px-6 py-4">Esfera & Repasse (17.1)</th>
                                <th className="px-6 py-4">Objeto & Função</th>
                                <th className="px-6 py-4">Previsto / Recebido</th>
                                <th className="px-6 py-4">Execução (17.2)</th>
                                <th className="px-6 py-4">Conciliação (17.3)</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <FaSpinner className="animate-spin inline-block text-emerald-500 text-2xl" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhuma emenda parlamentar encontrada.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((i) => {
                                    const conciliada = (i.valorPago || 0) > 0 || (i.valorEmpenhado || 0) > 0;
                                    return (
                                        <tr key={i.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-800 text-xs">{i.autorNome}</div>
                                                <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
                                                    <span>{i.codigoEmenda}</span>
                                                    {i.numeroEmenda && <span className="bg-gray-100 px-1.5 py-0.2 rounded font-bold">{i.numeroEmenda}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                                        i.esfera === "Estadual"
                                                            ? "bg-purple-50 text-purple-700 border-purple-200"
                                                            : i.esfera === "Municipal"
                                                            ? "bg-amber-50 text-amber-700 border-amber-200"
                                                            : "bg-blue-50 text-blue-700 border-blue-200"
                                                    }`}>
                                                        {i.esfera || "Federal"} • {i.anoEmenda}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 font-medium">
                                                        {i.formaRepasse || i.tipoEmenda || "Transferência"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-[240px]">
                                                <div className="text-xs text-gray-700 font-medium line-clamp-2">{i.objeto || "—"}</div>
                                                <div className="text-[10px] font-bold text-emerald-700 mt-1 uppercase">
                                                    {i.funcaoGoverno || "Saúde / Geral"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{fmt(i.valorPrevisto)}</div>
                                                <div className="text-[10px] text-gray-400">Rec.: {fmt(i.valorRecebido || i.valorPrevisto)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-emerald-700">{fmt(i.valorPago)}</div>
                                                <div className="text-[10px] text-blue-600">Emp.: {fmt(i.valorEmpenhado || i.valorPago)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {conciliada ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                                        <FaCheckCircle size={10} /> Conciliado
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                                        <FaExclamationCircle size={10} /> A Conciliar
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center gap-1">
                                                    <Link
                                                        href={`/admin/emendas/editar/${i.id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Editar Emenda"
                                                    >
                                                        <FaEdit />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(i.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                        title="Excluir Emenda"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
