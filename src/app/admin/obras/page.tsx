"use client";

import { useState, useEffect, useMemo } from "react";
import { 
    FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner, FaHammer, 
    FaCheckCircle, FaExclamationTriangle, FaHardHat, FaClock, 
    FaCoins, FaMoneyCheckAlt, FaBuilding, FaExternalLinkAlt, FaListOl
} from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

type Obra = {
    id: string;
    titulo: string;
    descricao?: string;
    local: string;
    secretaria?: string;
    numeroContrato?: string;
    valor: number;
    valorPago?: number | null;
    status: string;
    dataInicio: string | null;
    previsaoTermino: string | null;
    empresa: string | null;
    cnpjEmpresa?: string | null;
    percentual: number;
    motivoParalisacao?: string | null;
    responsavelParalisacao?: string | null;
    previsaoReinicio?: string | null;
    quantitativosContratados?: string | null;
    medicoes?: string | null;
    criadoEm: string;
};

const fmt = (v: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

export default function AdminObrasPage() {
    const [obras, setObras] = useState<Obra[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        fetchObras();
    }, []);

    const fetchObras = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/obras");
            const data = await res.json();
            setObras(Array.isArray(data) ? data : data.items || []);
        } catch {
            toast.error("Erro ao carregar obras públicas");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, titulo: string) => {
        if (!confirm(`Tem certeza que deseja excluir a obra "${titulo}"? Essa ação removerá o registro do portal de transparência.`)) return;
        try {
            const res = await fetch(`/api/admin/obras/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Obra excluída com sucesso");
                fetchObras();
            } else {
                toast.error("Erro ao excluir obra");
            }
        } catch {
            toast.error("Erro de conexão com o servidor");
        }
    };

    const stats = useMemo(() => {
        const total = obras.length;
        const emAndamento = obras.filter(o => o.status === "em-andamento" || o.status === "Em Andamento").length;
        const concluidas = obras.filter(o => o.status === "concluida" || o.status === "Concluída").length;
        const paralisadas = obras.filter(o => o.status === "paralisada" || o.status === "Paralisada").length;
        const valorTotal = obras.reduce((acc, o) => acc + (o.valor || 0), 0);
        const valorPago = obras.reduce((acc, o) => acc + (o.valorPago || 0), 0);
        return { total, emAndamento, concluidas, paralisadas, valorTotal, valorPago };
    }, [obras]);

    const filtered = useMemo(() => {
        return obras.filter(o => {
            const matchesSearch = 
                !search ||
                o.titulo.toLowerCase().includes(search.toLowerCase()) ||
                o.local.toLowerCase().includes(search.toLowerCase()) ||
                (o.empresa && o.empresa.toLowerCase().includes(search.toLowerCase())) ||
                (o.numeroContrato && o.numeroContrato.toLowerCase().includes(search.toLowerCase()));
            
            const normalizedStatus = (o.status || "").toLowerCase().replace("_", "-");
            const filterNorm = statusFilter.toLowerCase();
            const matchesStatus = !statusFilter || normalizedStatus === filterNorm;

            return matchesSearch && matchesStatus;
        });
    }, [obras, search, statusFilter]);

    const getStatusBadge = (status: string) => {
        const s = (status || "").toLowerCase().replace("_", "-");
        switch (s) {
            case "concluida":
                return {
                    label: "Concluída",
                    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    dot: "bg-emerald-500",
                    icon: <FaCheckCircle className="text-emerald-600" />
                };
            case "em-andamento":
                return {
                    label: "Em Andamento",
                    bg: "bg-blue-50 text-blue-700 border-blue-200",
                    dot: "bg-blue-600",
                    icon: <FaHardHat className="text-blue-600" />
                };
            case "paralisada":
                return {
                    label: "Paralisada",
                    bg: "bg-rose-50 text-rose-700 border-rose-300 font-black",
                    dot: "bg-rose-600",
                    icon: <FaExclamationTriangle className="text-rose-600" />
                };
            case "licitacao":
                return {
                    label: "Licitação",
                    bg: "bg-amber-50 text-amber-700 border-amber-200",
                    dot: "bg-amber-500",
                    icon: <FaClock className="text-amber-600" />
                };
            default:
                return {
                    label: status || "Registrado",
                    bg: "bg-slate-50 text-slate-700 border-slate-200",
                    dot: "bg-slate-400",
                    icon: <FaHammer className="text-slate-500" />
                };
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-16 font-['Montserrat',sans-serif]">
            
            {/* Header da Página */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <FaHammer size={18} />
                        </span>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Obras Públicas</h1>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                            Cartilha PNTP 10.1 a 10.4
                        </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                        Gerenciamento de contratos de obras, planilhas orçamentárias (preços unitários/totais), boletins de medição e inexecuções temporárias.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Link 
                        href="/transparencia/obras" 
                        target="_blank"
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
                    >
                        <FaExternalLinkAlt size={11} /> Ver no Portal
                    </Link>
                    <Link 
                        href="/admin/obras/nova" 
                        className="px-5 py-2.5 bg-[#1254A3] hover:bg-[#0e4382] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
                    >
                        <FaPlus /> Cadastrar Nova Obra
                    </Link>
                </div>
            </div>

            {/* Dashboard / Estatísticas ATRICON */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total de Obras Cadastradas</p>
                        <p className="text-2xl font-black text-gray-800">{loading ? "..." : stats.total}</p>
                        <p className="text-[11px] text-gray-500 mt-1">Contratadas ou licitadas</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <FaBuilding size={20} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Em Andamento / Concluídas</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-blue-600">{stats.emAndamento} ativas</span>
                            <span className="text-sm font-bold text-emerald-600">• {stats.concluidas} entregues</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">Critério 10.1 PNTP</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <FaCheckCircle size={20} />
                    </div>
                </div>

                <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${
                    stats.paralisadas > 0 ? "bg-rose-50/50 border-rose-200" : "bg-white border-gray-100"
                }`}>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Obras Paralisadas (10.4)</p>
                        <div className="flex items-center gap-2">
                            <span className={`text-2xl font-black ${stats.paralisadas > 0 ? "text-rose-600" : "text-gray-800"}`}>
                                {loading ? "..." : stats.paralisadas}
                            </span>
                            {stats.paralisadas > 0 && (
                                <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full uppercase">
                                    Atenção
                                </span>
                            )}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">Exigem motivo e responsável</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        stats.paralisadas > 0 ? "bg-rose-100 text-rose-600" : "bg-gray-100 text-gray-400"
                    }`}>
                        <FaExclamationTriangle size={20} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Investimento & Pago</p>
                        <p className="text-sm font-black text-gray-800 leading-tight">Total: {fmt(stats.valorTotal)}</p>
                        <p className="text-xs font-bold text-emerald-600 mt-0.5">Pago: {fmt(stats.valorPago)}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                        <FaCoins size={20} />
                    </div>
                </div>
            </div>

            {/* Painel de Filtros e Busca */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 relative">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                        <input
                            type="text"
                            placeholder="Buscar por objeto da obra, bairro, empresa ou contrato..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none cursor-pointer transition-all"
                        >
                            <option value="">Todas as Situações</option>
                            <option value="em-andamento">Em Andamento</option>
                            <option value="concluida">Concluída (Critério 10.1)</option>
                            <option value="paralisada">Paralisada (Critério 10.4)</option>
                            <option value="licitacao">Em Licitação</option>
                        </select>
                    </div>
                </div>

                {statusFilter === "paralisada" && (
                    <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-semibold">
                        <FaExclamationTriangle className="text-rose-600 shrink-0" />
                        <span>Filtrando apenas obras paralisadas. Cada obra deve conter motivo formal, responsável pela inexecução e previsão de reinício.</span>
                    </div>
                )}
            </div>

            {/* Tabela Estruturada de Obras */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400 text-[10px] uppercase tracking-wider font-black">
                                <th className="px-5 py-3.5">Objeto / Localização</th>
                                <th className="px-5 py-3.5">Empresa / Contrato</th>
                                <th className="px-5 py-3.5">Cronograma (Início / Fim)</th>
                                <th className="px-5 py-3.5">Valores (Contratado / Pago)</th>
                                <th className="px-5 py-3.5 text-center">Progresso</th>
                                <th className="px-5 py-3.5">Situação Atual</th>
                                <th className="px-5 py-3.5 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <FaSpinner className="animate-spin inline-block text-blue-600 text-2xl mb-2" />
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Carregando obras...</p>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center text-gray-400">
                                        <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <FaSearch size={18} />
                                        </div>
                                        <p className="font-bold text-gray-700 text-sm mb-1">Nenhuma obra localizada</p>
                                        <p className="text-xs text-gray-400">Ajuste os filtros de busca ou cadastre uma nova obra pública.</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((o) => {
                                    const badge = getStatusBadge(o.status);
                                    const isParalisada = (o.status || "").toLowerCase().includes("paralisada");
                                    const isConcluida = (o.status || "").toLowerCase().includes("concluida");

                                    return (
                                        <tr 
                                            key={o.id} 
                                            className={`transition-colors hover:bg-blue-50/30 group ${
                                                isParalisada ? "bg-rose-50/20" : ""
                                            }`}
                                        >
                                            {/* Objeto e Local */}
                                            <td className="px-5 py-4 max-w-xs">
                                                <div className="font-bold text-gray-900 line-clamp-2 leading-snug">
                                                    {o.titulo}
                                                </div>
                                                <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1 mt-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                                    {o.local}
                                                </div>
                                            </td>

                                            {/* Empresa e Contrato */}
                                            <td className="px-5 py-4">
                                                <div className="font-semibold text-gray-800 line-clamp-1">
                                                    {o.empresa || "Licitação / Contratação"}
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                                                    {o.cnpjEmpresa ? `CNPJ: ${o.cnpjEmpresa}` : o.numeroContrato ? `Contrato: ${o.numeroContrato}` : "Sem contrato vinculado"}
                                                </div>
                                            </td>

                                            {/* Datas */}
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <div className="text-gray-700">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase mr-1">Início:</span>
                                                    <span className="font-semibold">
                                                        {o.dataInicio ? new Date(o.dataInicio).toLocaleDateString("pt-BR") : "N/I"}
                                                    </span>
                                                </div>
                                                <div className="text-gray-700 mt-0.5">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase mr-1">
                                                        {isConcluida ? "Conclusão:" : isParalisada ? "Prev. Retomada:" : "Previsão:"}
                                                    </span>
                                                    <span className={`font-semibold ${isParalisada ? "text-rose-600" : isConcluida ? "text-emerald-700" : ""}`}>
                                                        {isParalisada && o.previsaoReinicio 
                                                            ? new Date(o.previsaoReinicio).toLocaleDateString("pt-BR")
                                                            : o.previsaoTermino 
                                                            ? new Date(o.previsaoTermino).toLocaleDateString("pt-BR") 
                                                            : "N/I"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Valores */}
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <div className="font-bold text-gray-900 font-mono">
                                                    {fmt(o.valor)}
                                                </div>
                                                <div className="text-[10px] font-bold text-emerald-700 font-mono mt-0.5">
                                                    Pago: {fmt(o.valorPago || 0)}
                                                </div>
                                            </td>

                                            {/* Progresso Físico */}
                                            <td className="px-5 py-4 text-center">
                                                <div className="w-24 mx-auto bg-gray-100 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-700 ${
                                                            isParalisada ? "bg-rose-500" : isConcluida ? "bg-emerald-600" : "bg-blue-600"
                                                        }`}
                                                        style={{ width: `${Math.min(o.percentual || 0, 100)}%` }}
                                                    />
                                                </div>
                                                <div className="text-[10px] font-black text-gray-500 mt-1 uppercase">
                                                    {o.percentual}%
                                                </div>
                                            </td>

                                            {/* Status com Destaque para Paralisada */}
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                                    {badge.label}
                                                </span>
                                                {isParalisada && o.motivoParalisacao && (
                                                    <div className="text-[10px] text-rose-800 line-clamp-1 mt-1 font-medium" title={o.motivoParalisacao}>
                                                        {o.motivoParalisacao}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Ações */}
                                            <td className="px-5 py-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link
                                                        href={`/admin/obras/editar/${o.id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                                                        title="Editar dados da obra e planilhas"
                                                    >
                                                        <FaEdit size={14} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(o.id, o.titulo)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                                        title="Excluir obra"
                                                    >
                                                        <FaTrash size={13} />
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
