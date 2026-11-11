"use client";

import { useState, useEffect } from "react";
import {
    FaSpinner,
    FaCoins,
    FaHistory,
    FaTable,
    FaChartLine,
    FaWallet,
    FaDownload,
    FaFilter,
} from "react-icons/fa";
import {
    FaArrowTrendUp,
    FaBuildingColumns,
    FaMagnifyingGlass,
    FaCircleCheck,
    FaCircleInfo,
} from "react-icons/fa6";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import DataAtualizacao from "@/components/transparencia/DataAtualizacao";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { MUNICIPIO } from "@/config/municipio";

type Receita = {
    id: string;
    naturezaCodigo?: string | null;
    descricao: string;
    categoria: string;
    fonte?: string | null;
    valor: number;
    valorPrevisto?: number | null;
    valorAtualizado?: number | null;
    valorLancado?: number | null;
    valorArrecadado?: number | null;
    mes: number;
    ano: number;
    dataAtualizacaoEfetiva?: string | null;
    dataUltimaConferencia?: string | null;
    criadoEm: string;
};

const mesesLabels = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const mesesAbrev = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function fmt(v: number | null | undefined) {
    if (v === null || v === undefined) return "Não informado";
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const COLORS = ["#3b82f6", "#0ea5e9", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function ReceitasPage() {
    const [receitas, setReceitas] = useState<Receita[]>([]);
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string | null>(null);
    const [ultimaConferencia, setUltimaConferencia] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState("");
    const [categoria, setCategoria] = useState("");
    const [aba, setAba] = useState<"tabela" | "grafico">("tabela");

    useEffect(() => {
        const fetchReceitas = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    ano,
                    mes,
                    categoria,
                    query: busca,
                    exportAll: "true",
                });
                const res = await fetch(`/api/receitas?${query.toString()}`);
                const data = await res.json();
                setReceitas(data.items || []);
                setUltimaAtualizacao(data.ultimaAtualizacao || null);
                setUltimaConferencia(data.ultimaConferencia || null);
            } catch (error) {
                console.error("Erro ao buscar receitas:", error);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchReceitas, 300);
        return () => clearTimeout(timer);
    }, [ano, mes, categoria, busca]);

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setMes("");
        setCategoria("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = receitas.map((r) => ({
            "Código Natureza": r.naturezaCodigo || "-",
            "Descrição da Receita": r.descricao,
            "Categoria Econômica": r.categoria,
            "Fonte de Recurso": r.fonte || "Ordinária",
            "Competência": `${mesesLabels[r.mes - 1] || r.mes}/${r.ano}`,
            "Valor Previsto": r.valorPrevisto !== null && r.valorPrevisto !== undefined ? fmt(r.valorPrevisto) : "Não informado",
            "Valor Lançado": r.valorLancado !== null && r.valorLancado !== undefined ? fmt(r.valorLancado) : "Não informado",
            "Valor Arrecadado": fmt(r.valorArrecadado ?? r.valor),
        }));

        const filename = `receitas_${mes || "anual"}_${ano}`;
        const title = `Relatório de Previsão e Arrecadação de Receitas – ${MUNICIPIO.nome}/${MUNICIPIO.uf} (${ano})`;
        const context = {
            titulo: title,
            fonte: "Sistema Contábil Integrado - Secretaria Municipal de Finanças (Critério PNTP 3.1)",
            periodo: `${mes ? mesesLabels[Number(mes) - 1] + "/" : ""}${ano}`,
            filtros: `Ano: ${ano} | Mês: ${mes || "Todos"} | Categoria: ${categoria || "Todas"} | Busca: ${busca || "-"}`,
        };

        if (format === "csv") exportToCSV(payload, filename, context);
        else if (format === "json") exportToJSON(payload, filename, context);
        else if (format === "xlsx") exportToXLSX(payload, filename, context);
        else exportToPDF(payload, filename, title, context);
    };

    const totalArrecadado = receitas.reduce((acc, curr) => acc + (curr.valorArrecadado ?? curr.valor), 0);
    const totalPrevisto = receitas.reduce((acc, curr) => acc + (curr.valorPrevisto ?? 0), 0);

    const dadosGrafico = Array.from({ length: 12 }, (_, i) => ({
        name: mesesAbrev[i],
        valor: receitas.filter((r) => r.mes === i + 1).reduce((sum, r) => sum + (r.valorArrecadado ?? r.valor), 0),
    })).filter((d) => d.valor > 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Arrecadação de Receitas"
                subtitle="Transparência sobre previsão, lançamento e arrecadação de receitas públicas por natureza e fonte."
                variant="premium"
                icon={<FaCoins />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Receitas" },
                ]}
            />

            <motion.main
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1240px] mx-auto px-6 py-12 -mt-16 relative z-30"
            >
                <div className="mb-8">
                    <DataAtualizacao
                        dataAtualizacao={ultimaAtualizacao}
                        dataConferencia={ultimaConferencia}
                        fonte="Sistema Contábil Municipal (SIAFIC) — Tempo Real (Até 1 dia útil - LC 131/2009)"
                    />
                </div>

                {/* Summary Section */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 items-stretch">
                    <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden group border border-slate-800">
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                                                Fluxo Arrecadatório
                                            </span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <div className="flex items-center gap-2">
                                            <FaCircleCheck className="text-emerald-400" size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                                                LC 131/2009 · PNTP 3.1
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/40 mb-2">
                                    Volume Arrecadado no Período Filtrado
                                </h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl sm:text-6xl font-black tracking-tighter tabular-nums text-white">
                                        {loading ? <FaSpinner className="animate-spin text-4xl" /> : fmt(totalArrecadado)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-10 flex flex-wrap gap-10 items-center border-t border-white/10 pt-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">
                                        Exercício Consultado
                                    </span>
                                    <span className="text-2xl font-black tracking-tight">{ano}</span>
                                </div>
                                <div className="w-px h-10 bg-white/10 hidden md:block" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">
                                        Total Previsto Registrado
                                    </span>
                                    <span className="text-2xl font-black tracking-tight text-emerald-400">
                                        {totalPrevisto > 0 ? fmt(totalPrevisto) : "Conforme LOA"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between relative overflow-hidden">
                        <div>
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                                <FaWallet className="text-emerald-600" size={28} />
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tighter mb-3 uppercase">
                                Natureza e Origem das Receitas
                            </h4>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                Consulta detalhada de receitas correntes, de capital, tributárias e transferências constitucionais, diferenciando valores previstos, lançados e arrecadados.
                            </p>
                        </div>
                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                            <span>Registros localizados: {receitas.length}</span>
                            <FaCircleInfo />
                        </div>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-2 mb-12">
                    <TransparencyFilters
                        searchValue={busca}
                        onSearch={setBusca}
                        currentYear={ano}
                        onYearChange={setAno}
                        currentMonth={mes}
                        onMonthChange={setMes}
                        onClear={handleClearFilters}
                        onExport={handleExport}
                        placeholder="Pesquisar por descrição ou código de natureza (ex: FPM, ICMS, IPTU, 1.1.1)..."
                    >
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="relative">
                                <label htmlFor="select-cat-receita" className="sr-only">
                                    Categoria da Receita
                                </label>
                                <select
                                    id="select-cat-receita"
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                                >
                                    <option value="">Todas as Categorias</option>
                                    <option value="impostos">Impostos, Taxas e Contribuições</option>
                                    <option value="transferencias">Transferências Correntes</option>
                                    <option value="receitas-proprias">Receitas Próprias</option>
                                    <option value="capital">Receitas de Capital</option>
                                </select>
                            </div>
                        </div>
                    </TransparencyFilters>
                </motion.div>

                {/* Main Table / Chart */}
                <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden mb-12">
                    <div className="flex flex-col sm:flex-row bg-slate-50 p-4 items-center justify-between border-b border-slate-100 gap-4">
                        <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 w-full sm:w-auto">
                            <button
                                onClick={() => setAba("tabela")}
                                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase transition-all ${
                                    aba === "tabela" ? "bg-emerald-600 text-white" : "text-slate-500 hover:text-emerald-600"
                                }`}
                            >
                                <FaTable size={13} /> Visão em Tabela
                            </button>
                            <button
                                onClick={() => setAba("grafico")}
                                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase transition-all ${
                                    aba === "grafico" ? "bg-emerald-600 text-white" : "text-slate-500 hover:text-emerald-600"
                                }`}
                            >
                                <FaChartLine size={13} /> Evolução Gráfica
                            </button>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10">
                        <AnimatePresence mode="wait">
                            {aba === "tabela" ? (
                                <motion.div key="tabela" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {loading ? (
                                        <div className="py-24 text-center">
                                            <FaSpinner className="animate-spin text-3xl text-emerald-600 mx-auto mb-3" />
                                            <p className="text-xs font-bold text-slate-400 uppercase">Consultando base de receitas...</p>
                                        </div>
                                    ) : receitas.length === 0 ? (
                                        <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                                            <FaMagnifyingGlass className="text-slate-300 text-3xl mx-auto mb-3" />
                                            <h4 className="text-lg font-black text-slate-800 uppercase mb-1">
                                                Nenhum registro publicado para o filtro selecionado
                                            </h4>
                                            <p className="text-slate-500 text-xs mb-6">
                                                A ausência de registros na consulta não equivale a declaração automática de inexistência de fato. Altere o exercício ou limpe os filtros.
                                            </p>
                                            <button
                                                onClick={handleClearFilters}
                                                className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase"
                                            >
                                                Limpar Filtros
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto rounded-2xl border border-slate-100">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                                                    <tr>
                                                        <th className="px-6 py-4">Natureza / Fonte da Receita</th>
                                                        <th className="px-6 py-4">Categoria / Fonte</th>
                                                        <th className="px-6 py-4 text-center">Competência</th>
                                                        <th className="px-6 py-4 text-right">Previsto</th>
                                                        <th className="px-6 py-4 text-right">Arrecadado</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {receitas.map((r) => (
                                                        <tr key={r.id} className="hover:bg-emerald-50/30">
                                                            <td className="px-6 py-4">
                                                                <div className="font-bold text-slate-900">{r.descricao}</div>
                                                                {r.naturezaCodigo && (
                                                                    <div className="text-[11px] font-mono text-slate-500">
                                                                        Cód. Natureza: {r.naturezaCodigo}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold uppercase">
                                                                    {r.categoria}
                                                                </span>
                                                                {r.fonte && (
                                                                    <div className="text-[10px] text-slate-500 mt-1">
                                                                        Fonte: {r.fonte}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 text-center font-bold text-slate-700">
                                                                {mesesAbrev[r.mes - 1]} / {r.ano}
                                                            </td>
                                                            <td className="px-6 py-4 text-right font-medium text-slate-600">
                                                                {r.valorPrevisto !== null && r.valorPrevisto !== undefined
                                                                    ? fmt(r.valorPrevisto)
                                                                    : "-"}
                                                            </td>
                                                            <td className="px-6 py-4 text-right font-black text-emerald-700 text-sm">
                                                                {fmt(r.valorArrecadado ?? r.valor)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="bg-slate-900 text-white font-bold">
                                                        <td colSpan={3} className="px-6 py-5 uppercase text-xs">
                                                            Consolidado do Período Filtrado
                                                        </td>
                                                        <td className="px-6 py-5 text-right text-slate-300">
                                                            {totalPrevisto > 0 ? fmt(totalPrevisto) : "-"}
                                                        </td>
                                                        <td className="px-6 py-5 text-right text-lg font-black text-emerald-400">
                                                            {fmt(totalArrecadado)}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div key="grafico" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6">
                                    <div className="h-[420px] w-full p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={dadosGrafico}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" />
                                                <YAxis tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                                                <Tooltip formatter={(v: number) => [fmt(v), "Arrecadação"]} />
                                                <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                                                    {dadosGrafico.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-16">
                    <BannerPNTP />
                </motion.div>
            </motion.main>
        </div>
    );
}
