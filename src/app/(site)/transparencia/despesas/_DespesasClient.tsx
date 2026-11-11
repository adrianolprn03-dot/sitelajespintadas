"use client";

import { useState, useEffect } from "react";
import {
    FaMoneyBillWave,
    FaSpinner,
    FaBuilding,
    FaTag,
    FaFileInvoiceDollar,
    FaArrowRight,
    FaFilter,
} from "react-icons/fa";
import { FaMagnifyingGlass, FaCircleCheck, FaCircleInfo } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import DataAtualizacao from "@/components/transparencia/DataAtualizacao";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { MUNICIPIO } from "@/config/municipio";

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

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
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
                className="max-w-[1240px] mx-auto px-6 py-12 -mt-16 relative z-30"
            >
                <div className="mb-8">
                    <DataAtualizacao
                        dataAtualizacao={ultimaAtualizacao}
                        dataConferencia={ultimaConferencia}
                        fonte="Sistema Contábil e Financeiro (SIAFIC) — Tempo Real (Até 1 dia útil - LC 131/2009)"
                    />
                </div>

                {/* Summary Section */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-stretch">
                    <div className="lg:col-span-8 bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden border border-slate-800">
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                                            Empenho · Liquidação · Pagamento
                                        </span>
                                    </div>
                                    <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                                        <div className="flex items-center gap-2">
                                            <FaCircleCheck className="text-blue-400" size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                                                LC 131/2009 · PNTP 4.1
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/40 mb-2">
                                    Volume Empenhado no Período Filtrado
                                </h3>
                                <div className="text-5xl sm:text-6xl font-black tracking-tighter tabular-nums text-white">
                                    {loading ? <FaSpinner className="animate-spin text-4xl" /> : fmt(totalEmpenhado)}
                                </div>
                            </div>

                            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-1">
                                        Empenhos Listados
                                    </span>
                                    <span className="text-xl font-black">{loading ? "..." : despesas.length}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-1">
                                        Total Liquidado
                                    </span>
                                    <span className="text-xl font-black text-blue-300">{fmt(totalLiquidado)}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-1">
                                        Total Pago
                                    </span>
                                    <span className="text-xl font-black text-emerald-400">{fmt(totalPago)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
                        <div>
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                                <FaFileInvoiceDollar className="text-blue-600" size={28} />
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tighter mb-3 uppercase">
                                Rastreabilidade da Despesa
                            </h4>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                Cada despesa apresenta número de empenho, unidade gestora, favorecido, valores empenhados, liquidados e pagos e vínculo contratual quando aplicável.
                            </p>
                        </div>
                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                            <span>Exercício {ano}</span>
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
                                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
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
                                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
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

                {/* Data Table */}
                <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <div className="py-24 text-center">
                                <FaSpinner className="animate-spin text-3xl text-blue-600 mx-auto mb-3" />
                                <p className="text-xs font-bold text-slate-400 uppercase">Consultando empenhos...</p>
                            </div>
                        ) : despesas.length === 0 ? (
                            <div className="py-20 text-center">
                                <FaMagnifyingGlass className="text-slate-300 text-3xl mx-auto mb-3" />
                                <h4 className="text-lg font-black text-slate-900 uppercase mb-1">
                                    Nenhum empenho localizado para o filtro selecionado
                                </h4>
                                <p className="text-slate-500 text-xs max-w-md mx-auto mb-6">
                                    A ausência de registros na consulta não equivale a declaração automática de não ocorrência. Altere o mês/exercício ou limpe os filtros.
                                </p>
                                <button
                                    onClick={handleClearFilters}
                                    className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase inline-flex items-center gap-2"
                                >
                                    Limpar Filtros <FaArrowRight size={10} />
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
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
                                    <tbody className="divide-y divide-slate-100">
                                        {despesas.map((d) => (
                                            <tr key={d.id} className="hover:bg-blue-50/30">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-black text-blue-700">
                                                        {d.numeroEmpenho ? `Emp. ${d.numeroEmpenho}` : `${mesesLabels[d.mes - 1]} / ${d.ano}`}
                                                    </div>
                                                    <div className="text-[10px] text-slate-500">
                                                        {mesesLabels[d.mes - 1]} / {d.ano}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 max-w-md">
                                                    <div className="font-bold text-slate-900">{d.descricao}</div>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold uppercase">
                                                            {d.categoria}
                                                        </span>
                                                        {d.fonteRecurso && (
                                                            <span className="text-[10px] text-slate-500">
                                                                Fonte: {d.fonteRecurso}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-slate-700">{d.secretaria}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-800">
                                                        {d.fornecedor || "Administração Direta"}
                                                    </div>
                                                    {d.credorCpfCnpj && (
                                                        <div className="text-[10px] font-mono text-slate-500">
                                                            {d.credorCpfCnpj}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-slate-800 whitespace-nowrap">
                                                    {fmt(d.valorEmpenhado ?? d.valor)}
                                                </td>
                                                <td className="px-6 py-4 text-right font-semibold text-blue-700 whitespace-nowrap">
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
                                        <tr className="bg-slate-900 text-white font-bold">
                                            <td colSpan={4} className="px-6 py-5 uppercase text-xs">
                                                Montante Consolidado no Período Filtrado
                                            </td>
                                            <td className="px-6 py-5 text-right">{fmt(totalEmpenhado)}</td>
                                            <td className="px-6 py-5 text-right text-blue-300">{fmt(totalLiquidado)}</td>
                                            <td className="px-6 py-5 text-right text-emerald-400">{fmt(totalPago)}</td>
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
