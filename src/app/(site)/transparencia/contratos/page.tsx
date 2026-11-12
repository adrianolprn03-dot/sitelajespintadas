"use client";

import { useState, useEffect, useMemo } from "react";
import { 
    FaFileContract, FaSpinner, FaHistory, FaCheckCircle, 
    FaExclamationTriangle, FaTimesCircle, FaBuilding, 
    FaWallet, FaArrowRight, FaRegCalendar,
    FaBriefcase, FaExternalLinkAlt
} from "react-icons/fa";
import { 
    FaBuildingColumns, FaShieldHalved, FaMagnifyingGlass,
    FaArrowTrendUp, FaBolt, FaFileLines, FaChartLine
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
    PieChart,
    Pie,
    Legend
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

const CHART_COLORS = ["#1254A3", "#F39A32", "#10B981", "#0284C7", "#8B5CF6", "#EC4899", "#F59E0B", "#64748B"];

type Contrato = {
    id: string;
    numero: string;
    ano?: number | null;
    modalidadeOrigem?: string | null;
    objeto: string;
    valor: number;
    fornecedor: string;
    contratado?: string;
    cnpjCpf?: string | null;
    dataInicio: string;
    dataFim: string;
    status: string;
    secretaria: string;
    instrumentoIntegralUrl?: string | null;
    arquivo?: string | null;
    aditivos?: Array<{ numero?: string; data?: string; valor?: number; objeto?: string; url?: string }> | null;
    fiscais?: Array<{ nome?: string; cargo?: string; portaria?: string; dataDesignacao?: string }> | null;
    justificativaOrdemCronologica?: string | null;
};

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
        case "vigente": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        case "finalizado": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        case "cancelado": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
        default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

export default function ContratosPage() {
    const [contratos, setContratos] = useState<Contrato[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [status, setStatus] = useState("");
    const [abaVisual, setAbaVisual] = useState<"lista" | "graficos">("lista");
    const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null);

    useEffect(() => {
        const fetchContratos = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({ 
                    ano, 
                    status,
                    query: busca 
                });
                const res = await fetch(`/api/contratos?${query.toString()}`);
                const data = await res.json();
                setContratos(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar contratos:", error);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchContratos, 300);
        return () => clearTimeout(timer);
    }, [ano, status, busca]);

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setStatus("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = contratos.map(c => ({
            "Contrato": c.numero,
            "Fornecedor": c.fornecedor,
            "Objeto": c.objeto,
            "Vigência": `${new Date(c.dataInicio).toLocaleDateString("pt-BR")} a ${new Date(c.dataFim).toLocaleDateString("pt-BR")}`,
            "Valor": fmt(c.valor),
            "Status": c.status
        }));

        const filename = `contratos_${ano}`;
        const title = `Relatório de Contratos Administrativos – Lajes Pintadas/RN (${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const totalValor = contratos.reduce((acc, curr) => acc + curr.valor, 0);

    // Agrupamento para gráficos
    const dadosPorStatus = useMemo(() => {
        const map: Record<string, number> = {};
        contratos.forEach((c) => {
            const st = c.status ? (c.status.charAt(0).toUpperCase() + c.status.slice(1).toLowerCase()) : "Outros";
            map[st] = (map[st] || 0) + 1;
        });
        return Object.entries(map).map(([name, valor]) => ({ name, valor }));
    }, [contratos]);

    const dadosPorSecretaria = useMemo(() => {
        const map: Record<string, number> = {};
        contratos.forEach((c) => {
            const sec = c.secretaria || "Administração Geral";
            map[sec] = (map[sec] || 0) + (c.valor || 0);
        });
        return Object.entries(map)
            .map(([name, valor]) => ({ name, valor }))
            .sort((a, b) => b.valor - a.valor)
            .slice(0, 6);
    }, [contratos]);

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Contratos Administrativos"
                subtitle="Transparência sobre a execução contratual, termos aditivos e parcerias celebradas."
                variant="premium"
                icon={<FaFileContract />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Contratos" }
                ]}
            />

            <motion.main 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-width-[1240px] mx-auto px-6 py-12 -mt-16 relative z-30"
            >
                {/* Summary Section - Padrão Novo Modelo */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 items-stretch">
                    
                    {/* Primary Highlight Card */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-7 sm:p-8 shadow-sm border border-[#DDE3EA] relative overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-[#EEF4FB] text-[#1254A3] rounded-lg text-[11px] font-black uppercase tracking-wider border border-[#DDE3EA]">
                                    <div className="w-2 h-2 rounded-full bg-[#F39A32] animate-pulse" />
                                    Comprometimento Orçamentário
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-black uppercase tracking-wider border border-emerald-100">
                                    <FaShieldHalved size={11} /> Fiscalização Ativa
                                </span>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#5B738B] mb-1">
                                Montante Contratual no Exercício
                            </p>
                            <div className="text-4xl sm:text-5xl font-black text-[#12304A] tracking-tight">
                                {loading ? <FaSpinner className="animate-spin text-3xl text-[#1254A3]" /> : fmt(totalValor)}
                            </div>
                        </div>
                        
                        <div className="mt-8 flex flex-wrap gap-8 items-center border-t border-[#DDE3EA] pt-6">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold uppercase text-[#5B738B] mb-0.5">Ano Base</span>
                                <span className="text-xl font-black text-[#12304A]">{ano}</span>
                            </div>
                            <div className="w-px h-8 bg-[#DDE3EA] hidden md:block" />
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold uppercase text-[#5B738B] mb-0.5">Instrumentos Firmados</span>
                                <span className="text-xl font-black text-[#1254A3]">{contratos.length} <span className="text-sm font-bold text-[#5B738B]">contratos</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Context Card */}
                    <div className="bg-white rounded-2xl p-7 sm:p-8 shadow-sm border border-[#DDE3EA] flex flex-col justify-between">
                         <div>
                            <div className="w-14 h-14 bg-[#EEF4FB] text-[#1254A3] rounded-xl flex items-center justify-center text-2xl mb-5 border border-[#DDE3EA]">
                                <FaFileContract />
                            </div>
                            <h4 className="text-lg font-black text-[#12304A] tracking-tight mb-2">
                                Contratos & Aditivos
                            </h4>
                            <p className="text-xs text-[#5B738B] leading-relaxed">
                                Gestão e acompanhamento das contratações públicas, aditivos, vigências e fiscais designados.
                            </p>
                         </div>
                         <div className="pt-5 border-t border-[#DDE3EA] flex items-center justify-between text-xs font-bold text-[#5B738B]">
                             <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-[#1254A3] animate-pulse" />
                                 <span>PNTP Critérios 9.2 e 9.3</span>
                             </div>
                             <FaCheckCircle className="text-emerald-500" />
                         </div>
                    </div>
                </motion.div>

                {/* Filters Section */}
                <motion.div variants={itemVariants} className="mb-8">
                    <TransparencyFilters
                        searchValue={busca}
                        onSearch={setBusca}
                        currentYear={ano}
                        onYearChange={setAno}
                        currentMonth=""
                        onMonthChange={() => {}}
                        onClear={handleClearFilters}
                        onExport={handleExport}
                        placeholder="Pesquisar por objeto, fornecedor ou número do contrato..."
                    >
                        <div className="flex flex-wrap gap-3 items-center">
                            <div className="relative">
                                <select 
                                    value={status} 
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="px-4 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] outline-none focus:border-[#1254A3]"
                                >
                                    <option value="">Todos os Status</option>
                                    <option value="vigente">Vigente</option>
                                    <option value="finalizado">Finalizado</option>
                                    <option value="cancelado">Cancelado</option>
                                </select>
                            </div>
                        </div>
                    </TransparencyFilters>
                </motion.div>

                {/* View Switcher: Lista vs Gráficos */}
                <div className="flex bg-white p-1 rounded-xl border border-[#DDE3EA] w-fit mb-8 shadow-sm">
                    <button
                        onClick={() => setAbaVisual("lista")}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                            abaVisual === "lista"
                                ? "bg-[#1254A3] text-white shadow-sm"
                                : "text-[#5B738B] hover:text-[#1254A3]"
                        }`}
                    >
                        <FaFileLines size={13} /> Lista de Contratos ({contratos.length})
                    </button>
                    <button
                        onClick={() => setAbaVisual("graficos")}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                            abaVisual === "graficos"
                                ? "bg-[#1254A3] text-white shadow-sm"
                                : "text-[#5B738B] hover:text-[#1254A3]"
                        }`}
                    >
                        <FaChartLine size={13} /> Gráficos nos Resultados
                    </button>
                </div>

                {abaVisual === "graficos" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12"
                    >
                        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE3EA] shadow-sm">
                            <h3 className="text-base font-black text-[#12304A] mb-1">
                                Volume Contratado por Secretaria
                            </h3>
                            <p className="text-xs text-[#5B738B] mb-4">
                                Maiores valores em contratos administrativos no exercício de {ano}.
                            </p>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dadosPorSecretaria} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                                        <XAxis type="number" tick={{ fontSize: 10, fill: "#5B738B" }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                                        <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 10, fill: "#12304A" }} />
                                        <Tooltip formatter={(v: number) => [fmt(v), "Total Contratado"]} />
                                        <Bar dataKey="valor" fill="#1254A3" radius={[0, 6, 6, 0]}>
                                            {dadosPorSecretaria.map((_, i) => (
                                                <Cell key={`cell-sec-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE3EA] shadow-sm">
                            <h3 className="text-base font-black text-[#12304A] mb-1">
                                Distribuição de Contratos por Status
                            </h3>
                            <p className="text-xs text-[#5B738B] mb-4">
                                Quantitativo de instrumentos vigentes, finalizados e cancelados.
                            </p>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={dadosPorStatus}
                                            dataKey="valor"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={95}
                                            label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {dadosPorStatus.map((_, i) => (
                                                <Cell key={`cell-cst-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(v: number) => [`${v} contratos`, "Total"]} />
                                        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Main Content Area */}
                <div className="space-y-10">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white rounded-[3rem] p-32 text-center border border-slate-100 shadow-2xl shadow-slate-200/30"
                            >
                                <div className="relative inline-block mb-8">
                                    <div className="w-24 h-24 border-8 border-slate-100 rounded-full" />
                                    <div className="absolute inset-0 border-8 border-orange-600 border-t-transparent rounded-full animate-spin" />
                                    <FaFileContract className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-100" size={40} />
                                </div>
                                <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.5em] animate-pulse">Sincronizando Base Contratual</p>
                            </motion.div>
                        ) : contratos.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[3rem] p-32 text-center border-4 border-dashed border-slate-50 group hover:border-slate-100 transition-colors"
                            >
                                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-all duration-500">
                                    <FaMagnifyingGlass className="text-slate-200 text-4xl" />
                                </div>
                                <h4 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-4">Nenhum contrato localizado</h4>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest opacity-60 italic mb-10 text-balance">Verifique o exercício financeiro ou os termos de busca aplicados.</p>
                                <button onClick={handleClearFilters} className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-orange-600 transition-all shadow-xl active:scale-95">Resetar Filtros</button>
                            </motion.div>
                        ) : (
                            <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6">
                                {contratos.map((c, idx) => (
                                    <motion.div 
                                        key={c.id} 
                                        variants={itemVariants}
                                        className="bg-white rounded-2xl border border-[#DDE3EA] shadow-sm hover:shadow-md transition-all overflow-hidden relative p-1"
                                    >
                                        <div className="p-6 lg:p-8">
                                            <div className="flex flex-col lg:flex-row justify-between gap-8 mb-6">
                                                {/* Contrato Info */}
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 bg-[#EEF4FB] text-[#1254A3] rounded-2xl flex items-center justify-center shrink-0 border border-[#DDE3EA] shadow-sm">
                                                        <FaFileContract size={26} />
                                                    </div>
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                                            <h3 className="text-2xl font-black text-[#12304A] tracking-tight">Contrato Nº {c.numero}</h3>
                                                            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-sm ${getStatusStyles(c.status)}`}>
                                                                {c.status.toLowerCase() === 'vigente' ? <FaCheckCircle size={12} className="animate-pulse" /> : c.status.toLowerCase() === 'finalizado' ? <FaFileContract size={12} /> : <FaTimesCircle size={12} />}
                                                                {c.status}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-4">
                                                            <span className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                                                <FaBuildingColumns size={12} className="text-orange-300" /> {c.secretaria}
                                                            </span>
                                                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-5 py-2.5 rounded-xl border border-orange-100 flex items-center gap-2.5 shadow-sm">
                                                                <FaRegCalendar size={14} /> Vigência: {new Date(c.dataInicio).toLocaleDateString("pt-BR")} — {new Date(c.dataFim).toLocaleDateString("pt-BR")}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Valor Bento */}
                                                <div className="lg:text-right flex flex-col justify-center">
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 block font-mono">VALOR DO INSTRUMENTO</span>
                                                    <div className="text-5xl font-black text-orange-600 tracking-tighter bg-orange-50 px-10 py-4 rounded-[2rem] border border-orange-100 inline-block lg:self-end shadow-sm group-hover:scale-105 transition-transform duration-500 tabular-nums">
                                                        {fmt(c.valor)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Grid Details Bento */}
                                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 bg-slate-50/50 rounded-[3rem] p-10 border border-slate-100 group-hover:bg-white transition-colors duration-700">
                                                <div className="lg:col-span-3 flex flex-col justify-center">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                        <span className="w-1.5 h-4 bg-orange-500 rounded-full" /> Objeto Contratual
                                                    </p>
                                                    <div className="flex items-start gap-6">
                                                        <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-orange-100">
                                                            <FaBriefcase size={22} />
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-bold text-slate-600 italic leading-relaxed bg-white/50 p-6 rounded-2xl border border-dashed border-slate-200 group-hover:border-orange-100 transition-colors">
                                                                "{c.objeto}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="lg:col-span-2 flex flex-col justify-center">
                                                    <div className="bg-white px-8 py-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col items-start gap-6 group-hover:border-orange-200 hover:scale-[1.02] transition-all duration-500 relative overflow-hidden group/forn">
                                                        <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover/forn:rotate-12 transition-transform duration-1000">
                                                            <FaBuilding size={48} />
                                                        </div>
                                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Fornecedor Contratado</p>
                                                        <div className="flex items-center gap-4">
                                                            <div className="shrink-0 w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shadow-inner border border-slate-100 text-slate-400 group-hover/forn:bg-blue-600 group-hover/forn:text-white transition-all">
                                                                <FaBriefcase size={20} />
                                                            </div>
                                                            <p className="text-lg font-black text-slate-800 uppercase tracking-tight leading-tight">{c.fornecedor}</p>
                                                        </div>
                                                        <div className="pt-4 border-t border-slate-50 w-full flex items-center justify-between">
                                                            <span className="text-[10px] font-black text-slate-300 uppercase">Processo Vinculado</span>
                                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">ID: {c.id.substring(0,8).toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Bar */}
                                            <div className="mt-10 flex flex-wrap justify-end gap-5">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedContrato(c)}
                                                    className="h-14 flex items-center gap-4 px-8 bg-white text-slate-700 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                                                >
                                                    Termos Aditivos & Fiscais
                                                </button>
                                                {(c.instrumentoIntegralUrl || c.arquivo) ? (
                                                    <a
                                                        href={c.instrumentoIntegralUrl || c.arquivo || "#"}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="h-14 flex items-center gap-4 px-10 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-2xl shadow-slate-900/20 group/btn active:scale-95"
                                                    >
                                                        <FaFileLines size={14} />
                                                        Íntegra do Contrato (PDF)
                                                        <FaArrowRight size={10} />
                                                    </a>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedContrato(c)}
                                                        className="h-14 flex items-center gap-4 px-10 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-2xl shadow-slate-900/20 group/btn active:scale-95"
                                                    >
                                                        <FaFileLines size={14} />
                                                        Ficha Integral do Contrato
                                                        <FaArrowRight size={10} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <motion.div variants={itemVariants} className="mt-24">
                    <BannerPNTP />
                    <div className="mt-20 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-[2] max-w-2xl mx-auto">
                            GESTÃO CONTRATUAL • PREFEITURA DE LAJES PINTADAS/RN <br/>
                            <span className="opacity-40 font-bold italic">Processamento eletrônico em conformidade com o PNTP e a Lei de Transparência.</span>
                        </p>
                    </div>
                </motion.div>

                {selectedContrato && (
                    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 block mb-1">
                                        Instrumento Contratual • PNTP 9.1 / 9.2 / 9.3
                                    </span>
                                    <h3 className="text-2xl font-black text-slate-900">
                                        Contrato Nº {selectedContrato.numero}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedContrato(null)}
                                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                                >
                                    Fechar
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div className="p-4 rounded-2xl bg-slate-50">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Contratado</span>
                                    <span className="font-black text-slate-800">{selectedContrato.fornecedor || selectedContrato.contratado}</span>
                                    {selectedContrato.cnpjCpf && (
                                        <span className="block font-mono text-[11px] text-slate-500 mt-0.5">{selectedContrato.cnpjCpf}</span>
                                    )}
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Valor Global</span>
                                    <span className="font-black text-orange-600 text-base">{fmt(selectedContrato.valor)}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Vigência</span>
                                    <span className="font-bold text-slate-800">
                                        {new Date(selectedContrato.dataInicio).toLocaleDateString("pt-BR")} a{" "}
                                        {new Date(selectedContrato.dataFim).toLocaleDateString("pt-BR")}
                                    </span>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Unidade Gestora</span>
                                    <span className="font-bold text-slate-800">{selectedContrato.secretaria}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-black text-slate-500 uppercase mb-2">Objeto do Contrato</h4>
                                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    {selectedContrato.objeto}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xs font-black text-slate-500 uppercase mb-2">Fiscais Designados (Critério 9.3)</h4>
                                {Array.isArray(selectedContrato.fiscais) && selectedContrato.fiscais.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedContrato.fiscais.map((f, idx) => (
                                            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between">
                                                <div>
                                                    <span className="font-bold text-slate-800">{f.nome}</span>
                                                    {f.cargo && <span className="text-slate-500 ml-2">({f.cargo})</span>}
                                                </div>
                                                {f.portaria && <span className="font-mono text-slate-600">Portaria: {f.portaria}</span>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500 italic">
                                        Fiscalização acompanhada pela Secretaria de {selectedContrato.secretaria}.
                                    </p>
                                )}
                            </div>

                            <div>
                                <h4 className="text-xs font-black text-slate-500 uppercase mb-2">Termos Aditivos e Apostilamentos (Critério 9.2)</h4>
                                {Array.isArray(selectedContrato.aditivos) && selectedContrato.aditivos.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedContrato.aditivos.map((ad, idx) => (
                                            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                                                <div>
                                                    <span className="font-bold text-slate-800">{ad.numero || `${idx + 1}º Termo Aditivo`}</span>
                                                    {ad.objeto && <p className="text-slate-600 mt-0.5">{ad.objeto}</p>}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {ad.valor !== undefined && <span className="font-bold text-orange-600">{fmt(Number(ad.valor))}</span>}
                                                    {ad.url && (
                                                        <a href={ad.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">
                                                            Ver PDF
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500 italic">
                                        Não constam termos aditivos registrados para este instrumento até a presente data.
                                    </p>
                                )}
                            </div>

                            <div>
                                <h4 className="text-xs font-black text-slate-500 uppercase mb-2">Inteiro Teor do Contrato (Critério 9.2)</h4>
                                {(selectedContrato.instrumentoIntegralUrl || selectedContrato.arquivo) ? (
                                    <a
                                        href={selectedContrato.instrumentoIntegralUrl || selectedContrato.arquivo || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1254A3] text-white text-xs font-bold hover:bg-blue-800 transition-colors shadow-sm"
                                    >
                                        <FaFileLines /> Abrir Contrato Integral Assinado (PDF) <FaExternalLinkAlt size={10} />
                                    </a>
                                ) : (
                                    <p className="text-xs text-slate-500 italic">
                                        O arquivo digitalizado do contrato integral está arquivado nos autos do processo e disponível para consulta presencial no setor de Contratos.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </motion.main>
        </div>
    );
}
