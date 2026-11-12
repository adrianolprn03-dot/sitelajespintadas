"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
    FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner,
    FaHandshake, FaFileAlt, FaDownload, FaFilter,
    FaCheckCircle, FaExclamationCircle, FaExternalLinkAlt
} from "react-icons/fa";
import toast from "react-hot-toast";

type Convenio = {
    id: string;
    numero: string;
    ano: number | null;
    tipoConvenio: string; // "recebido" ou "concedido"
    objeto: string;
    concedente: string;
    beneficiario: string | null;
    cnpjParticipe: string | null;
    valor: number;
    contrapartida: number;
    valorLiberado: number | null;
    dataInicio: string;
    dataFim: string;
    secretaria: string;
    status: string;
    arquivoInteiroTeor: string | null;
};

const fmt = (v: number | null) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

export default function AdminConveniosPage() {
    const [items, setItems] = useState<Convenio[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filtroTipo, setFiltroTipo] = useState<"todos" | "recebido" | "concedido">("todos");
    const [filtroAno, setFiltroAno] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/convenios");
            const data = await res.json();
            setItems(data.items || []);
        } catch {
            toast.error("Erro ao carregar convênios e transferências");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir este instrumento de convênio/transferência?")) return;
        try {
            const res = await fetch(`/api/convenios/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Excluído com sucesso!");
                fetchData();
            } else {
                toast.error("Erro ao excluir.");
            }
        } catch {
            toast.error("Erro de conexão ao excluir.");
        }
    };

    const anosDisponiveis = useMemo(() => {
        const set = new Set<number>();
        items.forEach(i => {
            if (i.ano) set.add(i.ano);
            else if (i.dataInicio) set.add(new Date(i.dataInicio).getFullYear());
        });
        return Array.from(set).sort((a, b) => b - a);
    }, [items]);

    const filtered = useMemo(() => {
        return items.filter(i => {
            if (filtroTipo !== "todos") {
                if (filtroTipo === "concedido" && i.tipoConvenio !== "concedido" && i.tipoConvenio !== "realizado") return false;
                if (filtroTipo === "recebido" && i.tipoConvenio !== "recebido") return false;
            }
            if (filtroAno) {
                const itemAno = i.ano || (i.dataInicio ? new Date(i.dataInicio).getFullYear() : null);
                if (itemAno !== parseInt(filtroAno)) return false;
            }
            if (search) {
                const s = search.toLowerCase();
                return (
                    i.numero.toLowerCase().includes(s) ||
                    i.objeto.toLowerCase().includes(s) ||
                    i.concedente.toLowerCase().includes(s) ||
                    (i.beneficiario || "").toLowerCase().includes(s)
                );
            }
            return true;
        });
    }, [items, filtroTipo, filtroAno, search]);

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                            PNTP Critério 5.2 (Transferências Concedidas e Recebidas)
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaHandshake className="text-pink-600" /> Convênios e Parcerias
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Gerencie transferências recebidas (União/Estado) e transferências concedidas (município para OSCs e parceiros).
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/convenios/novo"
                        className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
                    >
                        <FaPlus size={11} /> Novo Instrumento
                    </Link>
                </div>
            </div>

            {/* Painel de Filtros e Abas de Operação */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 space-y-4">
                    {/* Abas Tipo de Operação */}
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                        <button
                            onClick={() => setFiltroTipo("todos")}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                filtroTipo === "todos"
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Todas as Operações ({items.length})
                        </button>
                        <button
                            onClick={() => setFiltroTipo("concedido")}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                filtroTipo === "concedido"
                                    ? "bg-pink-600 text-white shadow-sm"
                                    : "bg-pink-50 text-pink-700 hover:bg-pink-100"
                            }`}
                        >
                            Transferências Concedidas (Critério 5.2)
                        </button>
                        <button
                            onClick={() => setFiltroTipo("recebido")}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                filtroTipo === "recebido"
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            }`}
                        >
                            Transferências Recebidas (União / Estado)
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="relative flex-1 max-w-md w-full">
                            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por número, objeto, beneficiário ou concedente..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-pink-500 outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {anosDisponiveis.length > 0 && (
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Ano:</label>
                                <select
                                    value={filtroAno}
                                    onChange={(e) => setFiltroAno(e.target.value)}
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none"
                                >
                                    <option value="">Todos os anos</option>
                                    {anosDisponiveis.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabela de Instrumentos */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                <th className="px-6 py-4">Operação (5.2)</th>
                                <th className="px-6 py-4">Instrumento / Ano</th>
                                <th className="px-6 py-4">Partícipe (Concedente / Beneficiário)</th>
                                <th className="px-6 py-4">Objeto e Finalidade</th>
                                <th className="px-6 py-4">Valores (Previsto / Liberado)</th>
                                <th className="px-6 py-4">Vigência</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center">
                                        <FaSpinner className="animate-spin inline-block text-pink-500 text-2xl" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhum convênio ou termo de transferência localizado.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((c) => {
                                    const isConcedido = c.tipoConvenio === "concedido" || c.tipoConvenio === "realizado";
                                    return (
                                        <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className={`inline-block text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                                                    isConcedido
                                                        ? "bg-pink-50 text-pink-700 border-pink-200"
                                                        : "bg-blue-50 text-blue-700 border-blue-200"
                                                }`}>
                                                    {isConcedido ? "Concedida (5.2)" : "Recebida"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-800 text-xs">{c.numero}</div>
                                                <div className="text-[10px] text-gray-400">{c.ano || "—"}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-800">
                                                    {isConcedido ? c.beneficiario || "Beneficiário não informado" : c.concedente}
                                                </div>
                                                {c.cnpjParticipe && (
                                                    <div className="text-[10px] font-mono text-gray-400">{c.cnpjParticipe}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <p className="line-clamp-2 text-gray-600 font-medium">{c.objeto}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{fmt(c.valor)}</div>
                                                {isConcedido && c.valorLiberado !== null && c.valorLiberado !== undefined && (
                                                    <div className="text-[10px] font-bold text-emerald-700">Lib.: {fmt(c.valorLiberado)}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-[11px] text-gray-500 font-medium">
                                                {c.dataInicio ? new Date(c.dataInicio).toLocaleDateString("pt-BR") : "-"} a{" "}
                                                {c.dataFim ? new Date(c.dataFim).toLocaleDateString("pt-BR") : "-"}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {c.arquivoInteiroTeor && (
                                                        <a
                                                            href={c.arquivoInteiroTeor}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            title="Inteiro Teor (5.2)"
                                                        >
                                                            <FaFileAlt />
                                                        </a>
                                                    )}
                                                    <Link
                                                        href={`/admin/convenios/editar/${c.id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <FaEdit />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(c.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                        title="Excluir"
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
