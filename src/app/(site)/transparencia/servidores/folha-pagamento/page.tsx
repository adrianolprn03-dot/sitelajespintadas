"use client";

import { useState, useEffect, useMemo } from "react";
import { 
    FaSpinner, FaMoneyCheck, FaBuilding, FaUserTie, 
    FaWallet, FaSearch, FaArrowRight,
    FaFilter, FaDownload, FaCheckCircle, FaChartPie, FaTable
} from "react-icons/fa";
import {
    FaArrowTrendUp, FaShieldHalved, FaClockRotateLeft,
    FaCircleCheck, FaBuildingColumns, FaUserGroup, FaCoins, FaMagnifyingGlass
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
    PieChart,
    Pie,
    Legend
} from "recharts";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

const CHART_COLORS = ["#1254A3", "#F39A32", "#10B981", "#0284C7", "#8B5CF6", "#EC4899", "#F59E0B"];

type Servidor = {
    id: string;
    nome: string;
    cargo: string;
    vinculo: string;
    secretaria: string;
    salarioBase: number;
    totalBruto: number;
    totalLiquido: number;
    mes: number;
    ano: number;
};

const vinculoCores: Record<string, string> = {
    efetivo: "bg-emerald-50 text-emerald-700 border-emerald-200",
    comissionado: "bg-blue-50 text-blue-700 border-blue-200",
    contratado: "bg-amber-50 text-amber-700 border-amber-200",
    estagiario: "bg-purple-50 text-purple-700 border-purple-200",
    "agente político": "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const mesesLabels = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const mesesAbrev = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function FolhaPagamentoPage() {
    const [servidores, setServidores] = useState<Servidor[]>([]);
    const [loading, setLoading] = useState(true);
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState((new Date().getMonth() + 1).toString());
    const [busca, setBusca] = useState("");
    const [vinculoFiltro, setVinculoFiltro] = useState("");
    const [secretariaFiltro, setSecretariaFiltro] = useState("");
    const [abaVisual, setAbaVisual] = useState<"lista" | "graficos">("lista");

    useEffect(() => {
        const fetchServidores = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    ano,
                    mes,
                    vinculo: vinculoFiltro,
                    secretaria: secretariaFiltro,
                    query: busca
                });
                const res = await fetch(`/api/servidores?${query.toString()}`);
                const data = await res.json();
                setServidores(data.items || []);
            } catch (error) {
                console.error("Erro ao carregar servidores:", error);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchServidores, 300);
        return () => clearTimeout(timer);
    }, [ano, mes, vinculoFiltro, secretariaFiltro, busca]);

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setMes((new Date().getMonth() + 1).toString());
        setVinculoFiltro("");
        setSecretariaFiltro("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = servidores.map((s: Servidor) => ({
            "Nome": s.nome,
            "Cargo": s.cargo,
            "Vínculo": s.vinculo,
            "Secretaria": s.secretaria,
            "T. Bruto": fmt(s.totalBruto),
            "T. Líquido": fmt(s.totalLiquido)
        }));

        const filename = `folha_lajespintadas_${mes}_${ano}`;
        const title = `Relatório de Servidores e Folha de Pagamento - Lajes Pintadas/RN (${mesesLabels[Number(mes)-1]} / ${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const totalBrutoValue = useMemo(() => servidores.reduce((acc, curr) => acc + (curr.totalBruto || 0), 0), [servidores]);
    const totalLiquidoValue = useMemo(() => servidores.reduce((acc, curr) => acc + (curr.totalLiquido || 0), 0), [servidores]);

    // Dados agregados por Secretaria para os gráficos
    const dadosPorSecretaria = useMemo(() => {
        const map: Record<string, { secretaria: string; bruto: number; liquido: number; count: number }> = {};
        servidores.forEach((s) => {
            const sec = s.secretaria || "Outras";
            if (!map[sec]) {
                map[sec] = { secretaria: sec, bruto: 0, liquido: 0, count: 0 };
            }
            map[sec].bruto += s.totalBruto || 0;
            map[sec].liquido += s.totalLiquido || 0;
            map[sec].count += 1;
        });
        return Object.values(map).sort((a, b) => b.bruto - a.bruto);
    }, [servidores]);

    // Dados agregados por Vínculo
    const dadosPorVinculo = useMemo(() => {
        const map: Record<string, { vinculo: string; quantidade: number; valor: number }> = {};
        servidores.forEach((s) => {
            const v = s.vinculo ? s.vinculo.charAt(0).toUpperCase() + s.vinculo.slice(1).toLowerCase() : "Não informado";
            if (!map[v]) {
                map[v] = { vinculo: v, quantidade: 0, valor: 0 };
            }
            map[v].quantidade += 1;
            map[v].valor += s.totalBruto || 0;
        });
        return Object.values(map);
    }, [servidores]);

    return (
        <div className="min-h-screen bg-[#F5F7FA]">
            <PageHeader
                title="Folha de Pagamento"
                subtitle="Consulta pública de remunerações, proventos e dados funcionais dos agentes públicos municipais."
                icon={<FaMoneyCheck />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Servidores", href: "/transparencia/servidores" },
                    { label: "Folha de Pagamento" }
                ]}
            />

            <motion.main 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
            >
                {/* Visual Switcher */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#DDE3EA] shadow-sm">
                        <button
                            onClick={() => setAbaVisual("lista")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                abaVisual === "lista"
                                    ? "bg-[#1254A3] text-white shadow-sm"
                                    : "text-[#5B738B] hover:text-[#12304A]"
                            }`}
                        >
                            <FaTable size={13} /> Relação Nominal
                        </button>
                        <button
                            onClick={() => setAbaVisual("graficos")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                abaVisual === "graficos"
                                    ? "bg-[#1254A3] text-white shadow-sm"
                                    : "text-[#5B738B] hover:text-[#12304A]"
                            }`}
                        >
                            <FaChartPie size={13} /> Gráficos nos Resultados
                        </button>
                    </div>

                    <div className="hidden sm:flex items-center gap-3">
                        <button
                            onClick={() => handleExport("pdf")}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#DDE3EA] text-[#12304A] rounded-lg text-xs font-semibold hover:border-[#1254A3] hover:text-[#1254A3] transition-all shadow-sm"
                        >
                            <FaDownload size={11} /> PDF
                        </button>
                        <button
                            onClick={() => handleExport("xlsx")}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#DDE3EA] text-[#12304A] rounded-lg text-xs font-semibold hover:border-[#1254A3] hover:text-[#1254A3] transition-all shadow-sm"
                        >
                            <FaDownload size={11} /> Excel
                        </button>
                    </div>
                </div>

                {/* Cards de Métricas Consolidadas - Padrão Novo */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Card Total Bruto */}
                    <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider">Volume Bruto Consolidado</span>
                            <span className="p-2 bg-blue-50 text-[#1254A3] rounded-xl">
                                <FaCoins size={16} />
                            </span>
                        </div>
                        <div className="text-3xl font-black text-[#12304A] tracking-tight">
                            {loading ? <FaSpinner className="animate-spin text-2xl text-[#1254A3]" /> : fmt(totalBrutoValue)}
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-[#5B738B] pt-3 border-t border-[#DDE3EA]">
                            <span>Competência: {mesesAbrev[Number(mes)-1]} / {ano}</span>
                            <span className="text-[#1254A3] font-semibold">{servidores.length} servidores</span>
                        </div>
                    </div>

                    {/* Card Total Líquido */}
                    <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider">Total Líquido Pago</span>
                            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <FaMoneyCheck size={16} />
                            </span>
                        </div>
                        <div className="text-3xl font-black text-emerald-600 tracking-tight">
                            {loading ? <FaSpinner className="animate-spin text-2xl text-emerald-600" /> : fmt(totalLiquidoValue)}
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-[#5B738B] pt-3 border-t border-[#DDE3EA]">
                            <span>Crédito em conta</span>
                            <span className="text-emerald-600 font-semibold">Folha Quitada</span>
                        </div>
                    </div>

                    {/* Card Quadro de Agentes */}
                    <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider">Servidores na Base</span>
                            <span className="p-2 bg-amber-50 text-[#F39A32] rounded-xl">
                                <FaUserGroup size={16} />
                            </span>
                        </div>
                        <div className="text-3xl font-black text-[#12304A] tracking-tight">
                            {loading ? "..." : `${servidores.length} Agentes`}
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-[#5B738B] pt-3 border-t border-[#DDE3EA]">
                            <span>Transparência Ativa</span>
                            <span className="text-[#F39A32] font-semibold">LAI 12.527 / PNTP</span>
                        </div>
                    </div>
                </motion.div>

                {/* Filters Section */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-[#DDE3EA] shadow-sm p-5 mb-8">
                    <TransparencyFilters
                        searchValue={busca}
                        onSearch={setBusca}
                        currentYear={ano}
                        onYearChange={setAno}
                        currentMonth={mes}
                        onMonthChange={setMes}
                        onClear={handleClearFilters}
                        onExport={handleExport}
                        placeholder="Pesquisar servidor por nome ou cargo funcional..."
                    >
                        <div className="flex flex-wrap gap-3 items-center">
                            <div className="relative">
                                <select 
                                    value={vinculoFiltro} 
                                    onChange={(e) => setVinculoFiltro(e.target.value)}
                                    className="pl-4 pr-8 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] outline-none focus:ring-2 focus:ring-[#1254A3] transition-all cursor-pointer min-w-[180px]"
                                >
                                    <option value="">TODOS OS VÍNCULOS</option>
                                    <option value="efetivo">EFETIVO</option>
                                    <option value="comissionado">COMISSIONADO</option>
                                    <option value="contratado">CONTRATADO</option>
                                    <option value="estagiario">ESTAGIÁRIO</option>
                                    <option value="agente politico">AGENTE POLÍTICO</option>
                                </select>
                            </div>
                            <div className="relative">
                                <select 
                                    value={secretariaFiltro} 
                                    onChange={(e) => setSecretariaFiltro(e.target.value)}
                                    className="pl-4 pr-8 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] outline-none focus:ring-2 focus:ring-[#1254A3] transition-all cursor-pointer min-w-[200px]"
                                >
                                    <option value="">TODAS AS SECRETARIAS</option>
                                    <option value="educacao">EDUCAÇÃO</option>
                                    <option value="saude">SAÚDE</option>
                                    <option value="assistencia social">ASSISTÊNCIA SOCIAL</option>
                                    <option value="administracao">ADMINISTRAÇÃO</option>
                                    <option value="obras">OBRAS E SERVIÇOS PÚBLICOS</option>
                                </select>
                            </div>
                        </div>
                    </TransparencyFilters>
                </motion.div>

                {/* Dashboard Gráfico nos Resultados */}
                {abaVisual === "graficos" && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
                    >
                        {/* Gráfico 1: Volume Bruto por Secretaria */}
                        <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-base font-bold text-[#12304A]">Folha por Secretaria / Órgão</h3>
                                    <p className="text-xs text-[#5B738B]">Total bruto acumulado na competência selecionada</p>
                                </div>
                                <span className="p-2 bg-blue-50 text-[#1254A3] rounded-xl text-xs font-bold">
                                    {dadosPorSecretaria.length} Órgãos
                                </span>
                            </div>
                            <div className="h-[320px] w-full">
                                {dadosPorSecretaria.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={dadosPorSecretaria} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                                            <XAxis type="number" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#5B738B' }} />
                                            <YAxis type="category" dataKey="secretaria" tick={{ fontSize: 11, fill: '#12304A', fontWeight: 600 }} width={120} />
                                            <Tooltip formatter={(value: number) => [fmt(value), "Total Bruto"]} />
                                            <Bar dataKey="bruto" radius={[0, 6, 6, 0]}>
                                                {dadosPorSecretaria.map((_, index) => (
                                                    <Cell key={`cell-sec-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-sm text-[#5B738B]">
                                        Nenhum dado para exibir no período
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Gráfico 2: Distribuição por Vínculo */}
                        <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-base font-bold text-[#12304A]">Distribuição por Vínculo Funcional</h3>
                                    <p className="text-xs text-[#5B738B]">Quantidade de agentes por regime de contratação</p>
                                </div>
                                <span className="p-2 bg-amber-50 text-[#F39A32] rounded-xl text-xs font-bold">
                                    {dadosPorVinculo.length} Vínculos
                                </span>
                            </div>
                            <div className="h-[320px] w-full">
                                {dadosPorVinculo.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={dadosPorVinculo}
                                                dataKey="quantidade"
                                                nameKey="vinculo"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                innerRadius={55}
                                                paddingAngle={4}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {dadosPorVinculo.map((_, index) => (
                                                    <Cell key={`cell-vinculo-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(val: number) => [`${val} servidores`, "Quantidade"]} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-sm text-[#5B738B]">
                                        Nenhum dado para exibir no período
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Table Section */}
                {abaVisual === "lista" && (
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-[#DDE3EA] shadow-sm overflow-hidden mb-12 relative min-h-[400px]">
                        <div className="p-6 border-b border-[#DDE3EA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F5F7FA]">
                            <div>
                                <h3 className="text-lg font-bold text-[#12304A] flex items-center gap-2">
                                    <span className="w-2 h-6 bg-[#1254A3] rounded-full" />
                                    Relação Nominal de Vencimentos
                                </h3>
                                <p className="text-xs text-[#5B738B] mt-1 ml-4">
                                    Folha Atualizada • {mesesLabels[Number(mes)-1]} de {ano}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-white border border-[#DDE3EA] rounded-lg text-xs font-semibold text-[#12304A]">
                                    {servidores.length} Agentes listados
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <AnimatePresence>
                                {loading && (
                                    <motion.div 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
                                    >
                                        <FaSpinner className="animate-spin text-4xl text-[#1254A3] mb-3" />
                                        <p className="text-xs font-bold text-[#5B738B] uppercase tracking-wider">Sincronizando Dados Funcionais...</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="bg-[#F5F7FA] border-b border-[#DDE3EA]">
                                        <th className="px-6 py-4 text-xs font-bold text-[#5B738B] uppercase tracking-wider">Agente Público / Cargo</th>
                                        <th className="px-6 py-4 text-xs font-bold text-[#5B738B] uppercase tracking-wider">Secretaria / Lotação</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-[#5B738B] uppercase tracking-wider">Vínculo</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-[#5B738B] uppercase tracking-wider">Bruto</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-[#5B738B] uppercase tracking-wider">Líquido</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {servidores.length === 0 && !loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center">
                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                                    <FaMagnifyingGlass className="text-slate-400 text-2xl" />
                                                </div>
                                                <h4 className="text-lg font-bold text-[#12304A] mb-1">Nenhum registro localizado</h4>
                                                <p className="text-xs text-[#5B738B] mb-4">Verifique o período consultado ou refine os filtros.</p>
                                                <button onClick={handleClearFilters} className="px-5 py-2 bg-[#1254A3] text-white rounded-xl text-xs font-bold hover:bg-[#0d3f7c] transition-all shadow-sm">Resetar Filtros</button>
                                            </td>
                                        </tr>
                                    ) : (
                                        servidores.map((s) => (
                                            <tr 
                                                key={s.id}
                                                className="hover:bg-[#EEF4FB] transition-all duration-150 border-b border-[#DDE3EA] last:border-0"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                                            <FaUserTie size={15} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-[#12304A] leading-tight">{s.nome}</p>
                                                            <span className="text-xs text-[#5B738B]">{s.cargo}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <FaBuilding className="text-slate-400" size={13} />
                                                        <span className="text-xs font-medium text-[#12304A]">{s.secretaria}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${vinculoCores[s.vinculo.toLowerCase()] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
                                                        {s.vinculo}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-xs font-semibold text-[#5B738B]">
                                                        {fmt(s.totalBruto)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-sm font-black text-emerald-600">
                                                        {fmt(s.totalLiquido)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                {!loading && servidores.length > 0 && (
                                    <tfoot>
                                        <tr className="bg-[#12304A] text-white">
                                            <td colSpan={3} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-200">Total Consolidado da Folha</td>
                                            <td className="px-6 py-4 text-right text-xs font-bold text-slate-300">{fmt(totalBrutoValue)}</td>
                                            <td className="px-6 py-4 text-right text-base font-black text-emerald-400">{fmt(totalLiquidoValue)}</td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* Footer Guide Section */}
                <motion.div variants={itemVariants} className="mt-12 flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm gap-6">
                    <div className="flex items-center gap-4 text-center md:text-left">
                         <div className="w-12 h-12 bg-blue-50 text-[#1254A3] rounded-xl flex items-center justify-center shrink-0">
                            <FaClockRotateLeft size={20} />
                         </div>
                         <div>
                            <span className="text-xs font-bold text-[#1254A3] uppercase tracking-wider">Ciclo Mensal de Atualização</span>
                            <h4 className="text-base font-bold text-[#12304A]">Folha de Pagamento Municipal</h4>
                            <p className="text-xs text-[#5B738B]">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                         </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button onClick={() => handleExport("pdf")} className="flex items-center gap-2 px-5 py-2.5 bg-[#1254A3] text-white rounded-xl text-xs font-bold transition-all hover:bg-[#0d3f7c] shadow-sm active:scale-95">
                            <FaDownload size={11} /> Exportar PDF
                        </button>
                        <button onClick={() => handleExport("xlsx")} className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#12304A] border border-[#DDE3EA] rounded-xl text-xs font-bold transition-all hover:bg-slate-50 shadow-sm active:scale-95">
                            <FaDownload size={11} /> Tabela Excel
                        </button>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-12">
                    <BannerPNTP />
                    <div className="mt-8 text-center">
                        <p className="text-xs text-[#5B738B]">
                            GESTÃO DE RECURSOS HUMANOS • PREFEITURA DE LAJES PINTADAS/RN <br/>
                            <span className="italic">Base de dados sincronizada conforme as diretrizes do Tribunal de Contas do Estado e Lei 12.527/2011.</span>
                        </p>
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
}