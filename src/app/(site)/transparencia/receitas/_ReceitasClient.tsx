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

const COLORS = ["#1254A3", "#F39A32", "#10B981", "#0284C7", "#8B5CF6", "#F59E0B"];

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
            fonte: "Sistema Contábil Integrado - Secretaria Municipal de Finanças (Critério PNTP)",
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
        <div className="min-h-screen bg-[#F5F7FA] font-['Montserrat',sans-serif]">
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
                className="max-w-[1240px] mx-auto px-6 py-10 relative z-30"
            >
                <div className="mb-8">
                    <DataAtualizacao
                        dataAtualizacao={ultimaAtualizacao}
                        dataConferencia={ultimaConferencia}
                        fonte="Sistema Contábil Municipal (SIAFIC) — Tempo Real (Até 1 dia útil - LC 131/2009)"
                    />
                </div>

                {/* Summary Section - Padrão Novo Modelo */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 items-stretch">
                    <div className="lg:col-span-2 bg-white rounded-2xl p-7 sm:p-8 shadow-sm border border-[#DDE3EA] relative overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-black uppercase tracking-wider border border-emerald-100">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Fluxo Arrecadatório
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-[#EEF4FB] text-[#1254A3] rounded-lg text-[11px] font-black uppercase tracking-wider border border-[#DDE3EA]">
                                    <FaCircleCheck size={11} /> LC 131/2009 · PNTP
                                </span>
                            </div>

                            <p className="text-xs font-bold uppercase tracking-widest text-[#5B738B] mb-1">
                                Volume Arrecadado no Período
                            </p>
                            <div className="text-4xl sm:text-5xl font-black text-[#12304A] tracking-tight">
                                {loading ? <FaSpinner className="animate-spin text-3xl text-[#1254A3]" /> : fmt(totalArrecadado)}
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-8 items-center border-t border-[#DDE3EA] pt-6">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold uppercase text-[#5B738B] mb-0.5">
                                    Exercício Consultado
                                </span>
                                <span className="text-xl font-black text-[#12304A]">{ano}</span>
                            </div>
                            <div className="w-px h-8 bg-[#DDE3EA] hidden md:block" />
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold uppercase text-[#5B738B] mb-0.5">
                                    Total Previsto Registrado
                                </span>
                                <span className="text-xl font-black text-emerald-600">
                                    {totalPrevisto > 0 ? fmt(totalPrevisto) : "Conforme LOA"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-7 sm:p-8 shadow-sm border border-[#DDE3EA] flex flex-col justify-between">
                        <div>
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-5 border border-emerald-100">
                                <FaWallet />
                            </div>
                            <h4 className="text-lg font-black text-[#12304A] tracking-tight mb-2">
                                Natureza e Origem das Receitas
                            </h4>
                            <p className="text-xs text-[#5B738B] leading-relaxed">
                                Consulta detalhada de receitas correntes, de capital, tributárias e transferências constitucionais, diferenciando valores previstos, lançados e arrecadados.
                            </p>
                        </div>
                        <div className="pt-5 border-t border-[#DDE3EA] flex items-center justify-between text-xs font-bold text-[#5B738B]">
                            <span>Registros localizados: {receitas.length}</span>
                            <span className="text-[#1254A3] font-semibold flex items-center gap-1">
                                <FaCircleInfo size={13} /> Siafic Ativo
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div variants={itemVariants} className="mb-8">
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
                                    className="px-4 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] outline-none focus:border-[#1254A3]"
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
                <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-[#DDE3EA] shadow-sm overflow-hidden mb-12">
                    <div className="flex flex-col sm:flex-row bg-[#F8FAFC] p-4 items-center justify-between border-b border-[#DDE3EA] gap-4">
                        <div className="flex bg-white p-1 rounded-xl border border-[#DDE3EA] w-full sm:w-auto">
                            <button
                                onClick={() => setAba("tabela")}
                                className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                                    aba === "tabela" ? "bg-[#1254A3] text-white shadow-sm" : "text-[#5B738B] hover:text-[#1254A3]"
                                }`}
                            >
                                <FaTable size={13} /> Visão em Tabela
                            </button>
                            <button
                                onClick={() => setAba("grafico")}
                                className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                                    aba === "grafico" ? "bg-[#1254A3] text-white shadow-sm" : "text-[#5B738B] hover:text-[#1254A3]"
                                }`}
                            >
                                <FaChartLine size={13} /> Gráficos nos Resultados
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
                                                    <tr className="bg-[#12304A] text-white font-bold">
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
                                <motion.div key="grafico" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2">
                                    <div className="mb-4">
                                        <h3 className="text-base font-black text-[#12304A]">
                                            Evolução Mensal da Arrecadação ({ano})
                                        </h3>
                                        <p className="text-xs text-[#5B738B]">
                                            Valores arrecadados mês a mês conforme lançamentos do SIAFIC.
                                        </p>
                                    </div>
                                    <div className="h-[400px] w-full p-4 bg-[#F8FAFC] rounded-2xl border border-[#DDE3EA]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={dadosGrafico}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5B738B" }} />
                                                <YAxis tick={{ fontSize: 11, fill: "#5B738B" }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                                                <Tooltip formatter={(v: number) => [fmt(v), "Arrecadação"]} />
                                                <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
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
