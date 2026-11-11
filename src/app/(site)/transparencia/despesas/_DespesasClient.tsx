"use client";

import { useState, useEffect, useMemo } from "react";
import {
    FaMoneyBillWave,
    FaSpinner,
    FaBuilding,
    FaTag,
    FaFileInvoiceDollar,
    FaArrowRight,
    FaFilter,
    FaTable,
    FaChartPie,
    FaChartBar,
} from "react-icons/fa";
import { FaMagnifyingGlass, FaCircleCheck, FaCircleInfo, FaChartLine } from "react-icons/fa6";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import DataAtualizacao from "@/components/transparencia/DataAtualizacao";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { MUNICIPIO } from "@/config/municipio";

const CHART_COLORS = ["#1254A3", "#F39A32", "#10B981", "#0284C7", "#8B5CF6", "#EC4899", "#F59E0B", "#64748B"];

type Despesa = {
    id: string;
    numeroEmpenho?: string | null;
    dataEmpenho?: string | null;
    descricao: string;
    categoria: string;
    secretaria: string;
    fornecedor: string | null;
    credorCpfCnpj?: string | null;
    classificacaoOrcamentaria?: string | null;
    fonteRecurso?: string | null;
    valor: number;
    valorEmpenhado?: number | null;
    valorLiquidado?: number | null;
    valorPago?: number | null;
    mes: number;
    ano: number;
    criadoEm: string;
};

const mesesLabels = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function fmt(v: number | null | undefined) {
    if (v === null || v === undefined) return "Não informado";
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

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

export default function DespesasPage() {
    const [despesas, setDespesas] = useState<Despesa[]>([]);
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string | null>(null);
    const [ultimaConferencia, setUltimaConferencia] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState("");
    const [secretaria, setSecretaria] = useState("");
    const [categoria, setCategoria] = useState("");
    const [aba, setAba] = useState<"tabela" | "grafico">("tabela");
    const [tipoGrafico, setTipoGrafico] = useState<"categoria" | "secretaria" | "mensal">("categoria");

    useEffect(() => {
        const fetchDespesas = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    ano,
                    mes,
                    secretaria,
                    categoria,
                    query: busca,
                    exportAll: "true",
                });
                const res = await fetch(`/api/despesas?${query.toString()}`);
                const data = await res.json();
                setDespesas(data.items || []);
                setUltimaAtualizacao(data.ultimaAtualizacao || null);
                setUltimaConferencia(data.ultimaConferencia || null);
            } catch (error) {
                console.error("Erro ao buscar despesas:", error);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchDespesas, 300);
        return () => clearTimeout(timer);
    }, [ano, mes, secretaria, categoria, busca]);

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setMes("");
        setSecretaria("");
        setCategoria("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = despesas.map((d) => ({
            "Nº Empenho": d.numeroEmpenho || "-",
            "Competência": `${mesesLabels[d.mes - 1] || d.mes}/${d.ano}`,
            "Objeto / Descrição": d.descricao,
            "Categoria": d.categoria,
            "Órgão / Secretaria": d.secretaria,
            "Credor / Favorecido": d.fornecedor || "Administração Direta",
            "CPF/CNPJ Credor": d.credorCpfCnpj || "-",
            "Fonte de Recurso": d.fonteRecurso || "Ordinária",
            "Valor Empenhado": fmt(d.valorEmpenhado ?? d.valor),
            "Valor Liquidado": d.valorLiquidado !== null && d.valorLiquidado !== undefined ? fmt(d.valorLiquidado) : fmt(d.valor),
            "Valor Pago": d.valorPago !== null && d.valorPago !== undefined ? fmt(d.valorPago) : fmt(d.valor),
        }));

        const filename = `despesas_${mes || "anual"}_${ano}`;
        const title = `Relatório de Execução da Despesa Pública – ${MUNICIPIO.nome}/${MUNICIPIO.uf} (${ano})`;
        const context = {
            titulo: title,
            fonte: "Sistema Integrado de Administração Financeira e Controle (SIAFIC) — Critério PNTP 4.1",
            periodo: `${mes ? mesesLabels[Number(mes) - 1] + "/" : ""}${ano}`,
            filtros: `Ano: ${ano} | Mês: ${mes || "Todos"} | Secretaria: ${secretaria || "Todas"} | Categoria: ${categoria || "Todas"} | Busca: ${busca || "-"}`,
        };

        if (format === "csv") exportToCSV(payload, filename, context);
        else if (format === "json") exportToJSON(payload, filename, context);
        else if (format === "xlsx") exportToXLSX(payload, filename, context);
        else exportToPDF(payload, filename, title, context);
    };

    const totalEmpenhado = despesas.reduce((acc, curr) => acc + (curr.valorEmpenhado ?? curr.valor), 0);
    const totalLiquidado = despesas.reduce((acc, curr) => acc + (curr.valorLiquidado ?? curr.valor), 0);
    const totalPago = despesas.reduce((acc, curr) => acc + (curr.valorPago ?? curr.valor), 0);

    // Agrupamento para gráficos interativos
    const dadosPorCategoria = useMemo(() => {
        const map: Record<string, number> = {};
        despesas.forEach((d) => {
            const cat = d.categoria || "Outras";
            const val = d.valorEmpenhado ?? d.valor ?? 0;
            map[cat] = (map[cat] || 0) + val;
        });
        return Object.entries(map)
            .map(([name, valor]) => ({ name, valor }))
            .sort((a, b) => b.valor - a.valor);
    }, [despesas]);

    const dadosPorSecretaria = useMemo(() => {
        const map: Record<string, number> = {};
        despesas.forEach((d) => {
            const sec = d.secretaria || "Geral";
            const val = d.valorEmpenhado ?? d.valor ?? 0;
            map[sec] = (map[sec] || 0) + val;
        });
        return Object.entries(map)
            .map(([name, valor]) => ({ name, valor }))
            .sort((a, b) => b.valor - a.valor)
            .slice(0, 7);
    }, [despesas]);

    const dadosPorMes = useMemo(() => {
        const mesesArr = Array.from({ length: 12 }, (_, i) => ({
            name: mesesLabels[i].substring(0, 3),
            empenhado: 0,
            liquidado: 0,
            pago: 0,
        }));
        despesas.forEach((d) => {
            if (d.mes >= 1 && d.mes <= 12) {
                const idx = d.mes - 1;
                mesesArr[idx].empenhado += d.valorEmpenhado ?? d.valor ?? 0;
                mesesArr[idx].liquidado += d.valorLiquidado ?? d.valor ?? 0;
                mesesArr[idx].pago += d.valorPago ?? d.valor ?? 0;
            }
        });
        return mesesArr;
    }, [despesas]);

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Execução da Despesa Pública"
                subtitle="Detalhamento de empenhos, liquidações, pagamentos, credores, fontes e classificação orçamentária."
                variant="premium"
                icon={<FaMoneyBillWave />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Despesas" },
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
                        fonte="Sistema Contábil e Financeiro (SIAFIC) — Tempo Real (Até 1 dia útil - LC 131/2009)"
                    />
                </div>

                {/* Summary Section - Padrão Novo Modelo */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 items-stretch">
                    <div className="lg:col-span-8 bg-white rounded-2xl p-7 sm:p-8 shadow-sm border border-[#DDE3EA] relative overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="px-3 py-1 bg-[#EEF4FB] text-[#1254A3] rounded-lg text-[11px] font-black uppercase tracking-wider border border-[#DDE3EA]">
                                    Empenho · Liquidação · Pagamento
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-black uppercase tracking-wider border border-emerald-100">
                                    <FaCircleCheck size={11} /> LC 131/2009 · PNTP 4.1
                                </span>
                            </div>

                            <p className="text-xs font-bold uppercase tracking-widest text-[#5B738B] mb-1">
                                Volume Empenhado no Período
                            </p>
                            <div className="text-4xl sm:text-5xl font-black text-[#12304A] tracking-tight">
                                {loading ? <FaSpinner className="animate-spin text-3xl text-[#1254A3]" /> : fmt(totalEmpenhado)}
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#DDE3EA] pt-6">
                            <div>
                                <span className="text-[11px] font-bold uppercase text-[#5B738B] block mb-0.5">
                                    Empenhos Listados
                                </span>
                                <span className="text-xl font-black text-[#12304A]">{loading ? "..." : despesas.length}</span>
                            </div>
                            <div>
                                <span className="text-[11px] font-bold uppercase text-[#5B738B] block mb-0.5">
                                    Total Liquidado
                                </span>
                                <span className="text-xl font-black text-[#1254A3]">{fmt(totalLiquidado)}</span>
                            </div>
                            <div>
                                <span className="text-[11px] font-bold uppercase text-[#5B738B] block mb-0.5">
                                    Total Pago
                                </span>
                                <span className="text-xl font-black text-emerald-600">{fmt(totalPago)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 bg-white rounded-2xl p-7 sm:p-8 shadow-sm border border-[#DDE3EA] flex flex-col justify-between">
                        <div>
                            <div className="w-14 h-14 bg-[#EEF4FB] text-[#1254A3] rounded-xl flex items-center justify-center text-2xl mb-5 border border-[#DDE3EA]">
                                <FaFileInvoiceDollar />
                            </div>
                            <h4 className="text-lg font-black text-[#12304A] tracking-tight mb-2">
                                Rastreabilidade da Despesa
                            </h4>
                            <p className="text-xs text-[#5B738B] leading-relaxed">
                                Cada registro apresenta número de empenho, unidade gestora, favorecido, valores empenhados, liquidados e pagos e vínculo contratual quando aplicável.
                            </p>
                        </div>
                        <div className="pt-5 border-t border-[#DDE3EA] flex items-center justify-between text-xs font-bold text-[#5B738B]">
                            <span>Exercício {ano}</span>
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
                        placeholder="Pesquisar por número de empenho, objeto, favorecido ou CPF/CNPJ..."
                    >
                        <div className="flex flex-wrap gap-3 items-center">
                            <label htmlFor="select-sec-despesa" className="sr-only">
                                Secretaria
                            </label>
                            <select
                                id="select-sec-despesa"
                                value={secretaria}
                                onChange={(e) => setSecretaria(e.target.value)}
                                className="px-4 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] outline-none focus:border-[#1254A3]"
                            >
                                <option value="">Todas as Secretarias</option>
                                <option value="Administração">Administração</option>
                                <option value="Educação">Educação</option>
                                <option value="Saúde">Saúde</option>
                                <option value="Obras">Obras e Infraestrutura</option>
                                <option value="Assistência Social">Assistência Social</option>
                            </select>

                            <label htmlFor="select-cat-despesa" className="sr-only">
                                Categoria
                            </label>
                            <select
                                id="select-cat-despesa"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                className="px-4 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] outline-none focus:border-[#1254A3]"
                            >
                                <option value="">Todas as Categorias</option>
                                <option value="Pessoal">Pessoal e Encargos</option>
                                <option value="Serviços">Serviços de Terceiros</option>
                                <option value="Custeio">Material e Custeio</option>
                                <option value="Investimento">Investimentos e Obras</option>
                            </select>
                        </div>
                    </TransparencyFilters>
                </motion.div>

                {/* Tabs & Results Container */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-[#DDE3EA] overflow-hidden">
                    {/* Visual Tab Switcher */}
                    <div className="flex flex-col sm:flex-row bg-[#F8FAFC] p-4 items-center justify-between border-b border-[#DDE3EA] gap-3">
                        <div className="flex bg-white p-1 rounded-xl border border-[#DDE3EA] w-full sm:w-auto">
                            <button
                                onClick={() => setAba("tabela")}
                                className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                                    aba === "tabela"
                                        ? "bg-[#1254A3] text-white shadow-sm"
                                        : "text-[#5B738B] hover:text-[#1254A3]"
                                }`}
                            >
                                <FaTable size={13} /> Visão em Tabela
                            </button>
                            <button
                                onClick={() => setAba("grafico")}
                                className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                                    aba === "grafico"
                                        ? "bg-[#1254A3] text-white shadow-sm"
                                        : "text-[#5B738B] hover:text-[#1254A3]"
                                }`}
                            >
                                <FaChartLine size={13} /> Gráficos nos Resultados
                            </button>
                        </div>

                        {aba === "grafico" && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-bold text-[#5B738B] uppercase">Tipo de Gráfico:</span>
                                <div className="flex bg-white p-1 rounded-lg border border-[#DDE3EA] text-xs font-bold">
                                    <button
                                        onClick={() => setTipoGrafico("categoria")}
                                        className={`px-3 py-1 rounded transition-colors ${tipoGrafico === "categoria" ? "bg-[#EEF4FB] text-[#1254A3]" : "text-[#5B738B]"}`}
                                    >
                                        Por Categoria
                                    </button>
                                    <button
                                        onClick={() => setTipoGrafico("secretaria")}
                                        className={`px-3 py-1 rounded transition-colors ${tipoGrafico === "secretaria" ? "bg-[#EEF4FB] text-[#1254A3]" : "text-[#5B738B]"}`}
                                    >
                                        Por Secretaria
                                    </button>
                                    <button
                                        onClick={() => setTipoGrafico("mensal")}
                                        className={`px-3 py-1 rounded transition-colors ${tipoGrafico === "mensal" ? "bg-[#EEF4FB] text-[#1254A3]" : "text-[#5B738B]"}`}
                                    >
                                        Evolução Mensal
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <div className="py-24 text-center">
                                <FaSpinner className="animate-spin text-3xl text-[#1254A3] mx-auto mb-3" />
                                <p className="text-xs font-bold text-[#5B738B] uppercase">Consultando empenhos...</p>
                            </div>
                        ) : despesas.length === 0 ? (
                            <div className="py-20 text-center px-4">
                                <FaMagnifyingGlass className="text-slate-300 text-3xl mx-auto mb-3" />
                                <h4 className="text-lg font-black text-[#12304A] mb-1">
                                    Nenhum empenho localizado para o filtro selecionado
                                </h4>
                                <p className="text-[#5B738B] text-xs max-w-md mx-auto mb-6">
                                    A ausência de registros na consulta não equivale a declaração automática de não ocorrência. Altere o mês/exercício ou limpe os filtros.
                                </p>
                                <button
                                    onClick={handleClearFilters}
                                    className="px-6 py-2.5 bg-[#1254A3] text-white rounded-xl text-xs font-bold uppercase inline-flex items-center gap-2 hover:bg-[#0E4282] transition-colors"
                                >
                                    Limpar Filtros <FaArrowRight size={10} />
                                </button>
                            </div>
                        ) : aba === "grafico" ? (
                            /* Gráficos Interativos */
                            <motion.div
                                key="grafico-despesas"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-6 sm:p-8"
                            >
                                <div className="mb-4">
                                    <h3 className="text-base font-black text-[#12304A]">
                                        {tipoGrafico === "categoria" && "Distribuição de Despesas por Categoria Econômica"}
                                        {tipoGrafico === "secretaria" && "Maiores Gastos Empenhados por Secretaria / Unidade"}
                                        {tipoGrafico === "mensal" && `Evolução da Execução da Despesa em ${ano} (Empenhado vs Liquidado vs Pago)`}
                                    </h3>
                                    <p className="text-xs text-[#5B738B]">
                                        Visualização interativa baseada nos dados oficiais do SIAFIC.
                                    </p>
                                </div>

                                <div className="h-[380px] w-full pt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        {tipoGrafico === "categoria" ? (
                                            <BarChart data={dadosPorCategoria}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5B738B" }} />
                                                <YAxis tick={{ fontSize: 11, fill: "#5B738B" }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                                                <Tooltip formatter={(v: number) => [fmt(v), "Empenhado"]} />
                                                <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                                                    {dadosPorCategoria.map((_, index) => (
                                                        <Cell key={`cell-cat-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        ) : tipoGrafico === "secretaria" ? (
                                            <BarChart data={dadosPorSecretaria} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                                                <XAxis type="number" tick={{ fontSize: 11, fill: "#5B738B" }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                                                <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 10, fill: "#12304A" }} />
                                                <Tooltip formatter={(v: number) => [fmt(v), "Total Empenhado"]} />
                                                <Bar dataKey="valor" fill="#1254A3" radius={[0, 6, 6, 0]} />
                                            </BarChart>
                                        ) : (
                                            <BarChart data={dadosPorMes}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5B738B" }} />
                                                <YAxis tick={{ fontSize: 11, fill: "#5B738B" }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                                                <Tooltip formatter={(v: number) => [fmt(v), ""]} />
                                                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                                                <Bar dataKey="empenhado" name="Empenhado" fill="#1254A3" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="liquidado" name="Liquidado" fill="#F39A32" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="pago" name="Pago" fill="#10B981" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        )}
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        ) : (
                            /* Tabela */
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#F8FAFC] text-[#5B738B] uppercase font-bold border-b border-[#DDE3EA]">
                                        <tr>
                                            <th className="px-6 py-4">Empenho / Competência</th>
                                            <th className="px-6 py-4">Objeto / Classificação</th>
                                            <th className="px-6 py-4">Unidade Gestora</th>
                                            <th className="px-6 py-4">Credor / Favorecido</th>
                                            <th className="px-6 py-4 text-right">Empenhado</th>
                                            <th className="px-6 py-4 text-right">Liquidado</th>
                                            <th className="px-6 py-4 text-right">Pago</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#DDE3EA]">
                                        {despesas.map((d) => (
                                            <tr key={d.id} className="hover:bg-[#EEF4FB]/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-black text-[#1254A3]">
                                                        {d.numeroEmpenho ? `Emp. ${d.numeroEmpenho}` : `${mesesLabels[d.mes - 1]} / ${d.ano}`}
                                                    </div>
                                                    <div className="text-[10px] text-[#5B738B]">
                                                        {mesesLabels[d.mes - 1]} / {d.ano}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 max-w-md">
                                                    <div className="font-bold text-[#12304A]">{d.descricao}</div>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold uppercase border border-amber-100">
                                                            {d.categoria}
                                                        </span>
                                                        {d.fonteRecurso && (
                                                            <span className="text-[10px] text-[#5B738B]">
                                                                Fonte: {d.fonteRecurso}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-[#12304A]">{d.secretaria}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-[#12304A]">
                                                        {d.fornecedor || "Administração Direta"}
                                                    </div>
                                                    {d.credorCpfCnpj && (
                                                        <div className="text-[10px] font-mono text-[#5B738B]">
                                                            {d.credorCpfCnpj}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-[#12304A] whitespace-nowrap">
                                                    {fmt(d.valorEmpenhado ?? d.valor)}
                                                </td>
                                                <td className="px-6 py-4 text-right font-semibold text-[#1254A3] whitespace-nowrap">
                                                    {d.valorLiquidado !== null && d.valorLiquidado !== undefined
                                                        ? fmt(d.valorLiquidado)
                                                        : fmt(d.valor)}
                                                </td>
                                                <td className="px-6 py-4 text-right font-black text-emerald-700 whitespace-nowrap">
                                                    {d.valorPago !== null && d.valorPago !== undefined
                                                        ? fmt(d.valorPago)
                                                        : fmt(d.valor)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-[#12304A] text-white font-bold">
                                            <td colSpan={4} className="px-6 py-5 uppercase text-xs">
                                                Montante Consolidado no Período Filtrado
                                            </td>
                                            <td className="px-6 py-5 text-right">{fmt(totalEmpenhado)}</td>
                                            <td className="px-6 py-5 text-right text-blue-200">{fmt(totalLiquidado)}</td>
                                            <td className="px-6 py-5 text-right text-emerald-300">{fmt(totalPago)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-16">
                    <BannerPNTP />
                </motion.div>
            </motion.main>
        </div>
    );
}
