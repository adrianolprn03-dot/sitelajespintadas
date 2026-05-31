"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FaPlus, FaEdit, FaTrash, FaSpinner, FaExchangeAlt,
    FaHospital, FaBook, FaHandsHelping, FaFilter, FaCheckCircle,
    FaExclamationTriangle, FaClock, FaFileAlt
} from "react-icons/fa";
import toast from "react-hot-toast";

type Transferencia = {
    id: string;
    tipoConselho: string;
    nomeConselho: string;
    mes: number;
    ano: number;
    valorRepasse: number;
    natureza: string;
    fonteRecurso: string;
    descricaoAplicacao: string;
    numeroEmpenho?: string;
    numeroPagamento?: string;
    statusPrestacao: string;
    observacoes?: string;
    criadoEm: string;
};

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const ANO_ATUAL = new Date().getFullYear();

const TIPO_INFO: Record<string, { label: string; cor: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
    saude: { label: "Conselho de Saúde", cor: "text-blue-600 bg-blue-50 border-blue-200", Icon: FaHospital },
    fundeb: { label: "Conselho do FUNDEB", cor: "text-amber-600 bg-amber-50 border-amber-200", Icon: FaBook },
    assistencia_social: { label: "Assist. Social", cor: "text-violet-600 bg-violet-50 border-violet-200", Icon: FaHandsHelping },
};

const STATUS_INFO: Record<string, { label: string; classe: string; Icon: React.ComponentType<{ size?: number }> }> = {
    regular: { label: "Regular", classe: "text-emerald-700 bg-emerald-50 border-emerald-200", Icon: FaCheckCircle },
    pendente: { label: "Pendente", classe: "text-amber-700 bg-amber-50 border-amber-200", Icon: FaClock },
    irregular: { label: "Irregular", classe: "text-red-700 bg-red-50 border-red-200", Icon: FaExclamationTriangle },
};

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AdminTransferenciaConselhosPage() {
    const [items, setItems] = useState<Transferencia[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroAno, setFiltroAno] = useState(String(ANO_ATUAL));

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filtroTipo) params.set("tipo", filtroTipo);
            if (filtroAno) params.set("ano", filtroAno);
            const res = await fetch(`/api/transferencias-conselhos?${params}`);
            const data = await res.json();
            setItems(data.items || []);
        } catch {
            toast.error("Erro ao carregar transferências");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [filtroTipo, filtroAno]);

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir este registro de transferência?")) return;
        try {
            const res = await fetch(`/api/transferencias-conselhos/${id}`, { method: "DELETE" });
            if (res.ok) { toast.success("Registro removido"); fetchData(); }
        } catch { toast.error("Erro ao excluir"); }
    };

    const totalRepasses = items.reduce((s, i) => s + i.valorRepasse, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaExchangeAlt className="text-blue-600" />
                        Transferências aos Conselhos
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Repasses conforme PNTP 2026 · Saúde, FUNDEB e Assistência Social
                    </p>
                </div>
                <Link
                    href="/admin/transferencias-conselhos/novo"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors shadow-sm"
                >
                    <FaPlus /> Novo Repasse
                </Link>
            </div>

            {/* Cards de Totais */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(["saude", "fundeb", "assistencia_social"] as const).map((tipo) => {
                    const info = TIPO_INFO[tipo];
                    const subtotal = items.filter(i => i.tipoConselho === tipo).reduce((s, i) => s + i.valorRepasse, 0);
                    return (
                        <div key={tipo} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-xl border ${info.cor}`}>
                                    <info.Icon size={16} />
                                </div>
                                <span className="text-xs font-bold text-gray-600">{info.label}</span>
                            </div>
                            <div className="text-xl font-black text-gray-800">{fmt(subtotal)}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                {filtroAno || ANO_ATUAL} · {items.filter(i => i.tipoConselho === tipo).length} registros
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex flex-wrap gap-4 items-center">
                    <FaFilter className="text-gray-400" size={14} />
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Conselho</label>
                        <select
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value)}
                            className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos</option>
                            <option value="saude">Conselho de Saúde</option>
                            <option value="fundeb">Conselho do FUNDEB</option>
                            <option value="assistencia_social">Assistência Social</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ano</label>
                        <select
                            value={filtroAno}
                            onChange={(e) => setFiltroAno(e.target.value)}
                            className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {[ANO_ATUAL, ANO_ATUAL - 1, ANO_ATUAL - 2].map(a => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                            <option value="">Todos os anos</option>
                        </select>
                    </div>
                    <div className="ml-auto text-sm font-black text-gray-700">
                        Total filtrado: <span className="text-blue-600">{fmt(totalRepasses)}</span>
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                <th className="px-6 py-4">Conselho</th>
                                <th className="px-6 py-4">Período</th>
                                <th className="px-6 py-4">Natureza</th>
                                <th className="px-6 py-4">Fonte</th>
                                <th className="px-6 py-4 text-right">Valor</th>
                                <th className="px-6 py-4 text-center">Prestação</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center">
                                    <FaSpinner className="animate-spin inline-block text-blue-500 text-2xl" />
                                </td></tr>
                            ) : items.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic">
                                    Nenhum registro encontrado. Clique em <strong>"Novo Repasse"</strong> para adicionar.
                                </td></tr>
                            ) : items.map((item) => {
                                const tipoInfo = TIPO_INFO[item.tipoConselho];
                                const statusInfo = STATUS_INFO[item.statusPrestacao] || STATUS_INFO.pendente;
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {tipoInfo && (
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase ${tipoInfo.cor}`}>
                                                        <tipoInfo.Icon size={10} /> {tipoInfo.label}
                                                    </span>
                                                )}
                                            </div>
                                            {item.numeroEmpenho && (
                                                <div className="text-[9px] text-gray-400 mt-1 flex items-center gap-1">
                                                    <FaFileAlt size={9} /> Empenho: {item.numeroEmpenho}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-600">
                                            {MESES[(item.mes - 1)]} / {item.ano}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold text-gray-500 capitalize">{item.natureza}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold text-gray-500 capitalize">{item.fonteRecurso}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-black text-gray-800">
                                            {fmt(item.valorRepasse)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase ${statusInfo.classe}`}>
                                                <statusInfo.Icon size={9} /> {statusInfo.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/admin/transferencias-conselhos/editar/${item.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {items.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                        <span className="text-xs text-gray-400 font-bold">{items.length} registro(s) encontrado(s)</span>
                        <span className="text-sm font-black text-gray-700">
                            Total: <span className="text-blue-600">{fmt(totalRepasses)}</span>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
