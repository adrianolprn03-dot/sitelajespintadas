"use client";

import { useState, useEffect, useMemo } from "react";
import { 
    FaChartBar, FaSpinner, FaExternalLinkAlt, FaBuilding, 
    FaGavel, FaRegCalendar, FaBriefcase,
    FaArrowRight, FaCheckCircle, FaClock, FaBan,
    FaFileContract, FaBolt, FaInfoCircle, FaTable
} from "react-icons/fa";
import { 
    FaMagnifyingGlass, FaRotate,
    FaCircleExclamation, FaBuildingColumns,
    FaShieldHalved, FaArrowTrendUp, FaFileLines, FaChartLine, FaChartPie
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
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import ListaPNCP from "@/components/transparencia/integracao/ListaPNCP";
import { motion, AnimatePresence } from "framer-motion";

const CHART_COLORS = ["#1254A3", "#F39A32", "#10B981", "#0284C7", "#8B5CF6", "#EC4899", "#F59E0B", "#64748B"];

type Licitacao = {
    id: string;
    numero: string;
    numeroProcesso?: string | null;
    objeto: string;
    modalidade: string;
    valor: number | null;
    valorEstimado?: number | null;
    valorHomologado?: number | null;
    status: string;
    secretaria: string;
    ano: number;
    dataAbertura?: string;
    editalUrl?: string | null;
    arquivo?: string | null;
    ataRegistroPreco?: boolean;
    adesaoArp?: boolean;
    fasesDocumentos?: Array<{ fase?: string; tipo?: string; titulo?: string; url?: string }> | string | null;
};

const modalidadeLabel: Record<string, string> = {
    pregao: "Pregão Eletrônico",
    concorrencia: "Concorrência",
    "tomada-precos": "Tomada de Preços",
    convite: "Convite",
    dispensa: "Dispensa de Licitação (8.4)",
    inexigibilidade: "Inexigibilidade (8.4)",
    adesao: "Adesão a Registro de Preços - Carona (8.5)",
    leilao: "Leilão Eletrônico",
    credenciamento: "Credenciamento"
};

const statusConfig: Record<string, { label: string; cor: string; icon: any }> = {
    aberta: { label: "Aberta", cor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: FaCheckCircle },
    "em-andamento": { label: "Em Execução", cor: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: FaClock },
    concluida: { label: "Concluída", cor: "bg-slate-500/10 text-slate-400 border-slate-500/20", icon: FaCheckCircle },
    cancelada: { label: "Cancelada", cor: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: FaBan },
    deserta: { label: "Deserta", cor: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: FaCircleExclamation },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

export default function LicitacoesClient() {
    const [licitacoes, setLicitacoes] = useState<Licitacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [statusFiltro, setStatusFiltro] = useState("");
    const [modalidadeFiltro, setModalidadeFiltro] = useState("");
    const [anoFiltro, setAnoFiltro] = useState(new Date().getFullYear().toString());
    const [tab, setTab] = useState<"municipal" | "federal">("municipal");
    const [abaVisual, setAbaVisual] = useState<"processos" | "graficos">("processos");
    const [selectedLicitacao, setSelectedLicitacao] = useState<Licitacao | null>(null);

    useEffect(() => {
        const fetchLicitacoes = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams();
                if (statusFiltro) query.append("status", statusFiltro);
                if (modalidadeFiltro) query.append("modalidade", modalidadeFiltro);
                if (anoFiltro) query.append("ano", anoFiltro);

                const res = await fetch(`/api/licitacoes?${query.toString()}`);
                const data = await res.json();
                setLicitacoes(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar licitações:", error);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchLicitacoes, 300);
        return () => clearTimeout(timer);
    }, [statusFiltro, modalidadeFiltro, anoFiltro]);

    const formatarMoeda = (valor: number | null) => {
        if (!valor) return "Valor sob consulta";
        return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    const handleClearFilters = () => {
        setBusca("");
        setStatusFiltro("");
        setModalidadeFiltro("");
        setAnoFiltro(new Date().getFullYear().toString());
    };

    const filtrados = licitacoes.filter((l) => {
        const b = busca.toLowerCase();
        return !busca || 
            l.objeto.toLowerCase().includes(b) || 
            l.numero.toLowerCase().includes(b) ||
            l.secretaria.toLowerCase().includes(b);
    });

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = filtrados.map(l => ({
            "Número": l.numero,
            "Modalidade": modalidadeLabel[l.modalidade] || l.modalidade,
            "Objeto": l.objeto,
            "Secretaria": l.secretaria,
            "Valor Estimado": formatarMoeda(l.valor),
            "Status": statusConfig[l.status]?.label || l.status,
            "Ano": l.ano
        }));

        const filename = `licitacoes_municipais_${anoFiltro}`;
        const title = `Relatório de Licitações e Processos – Lajes Pintadas/RN (${anoFiltro})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const totalEstimado = filtrados.reduce((acc, curr) => acc + (curr.valor || 0), 0);

    // Agrupamento para gráficos
    const dadosPorModalidade = useMemo(() => {
        const map: Record<string, { count: number; valor: number }> = {};
        filtrados.forEach((l) => {
            const m = modalidadeLabel[l.modalidade] || l.modalidade || "Outras";
            if (!map[m]) map[m] = { count: 0, valor: 0 };
            map[m].count += 1;
            map[m].valor += l.valor || 0;
        });
        return Object.entries(map).map(([name, data]) => ({
            name,
            quantidade: data.count,
            valor: data.valor,
        })).sort((a, b) => b.quantidade - a.quantidade);
    }, [filtrados]);

    const dadosPorStatus = useMemo(() => {
        const map: Record<string, number> = {};
        filtrados.forEach((l) => {
            const st = statusConfig[l.status]?.label || l.status || "Outros";
            map[st] = (map[st] || 0) + 1;
        });
        return Object.entries(map).map(([name, valor]) => ({
            name,
            valor,
        }));
    }, [filtrados]);

    return (
        <div className="min-h-screen bg-[#F5F7FA] text-[#12304A]">
            <PageHeader 
                title="Compras & Licitações"
                subtitle="Portal de transparência para processos de aquisição, alienação e contratação de serviços."
                variant="premium"
                icon={<FaGavel />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Licitações" }
                ]}
            />

            <motion.main 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-width-[1240px] mx-auto px-6 py-12 -mt-16 relative z-30"
            >
                {/* Tab Switcher - Premium High Interaction */}
                <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-12">
                    <div className="flex items-center gap-1.5 p-1.5 bg-white/80 backdrop-blur-xl rounded-[1.75rem] border border-slate-100 shadow-2xl shadow-slate-200/50 w-fit">
                        <button 
                            onClick={() => setTab("federal")}
                            className={`relative px-12 py-3.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 ${tab === "federal" ? "text-white" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            {tab === "federal" && (
                                <motion.div layoutId="activeTabLicit" className="absolute inset-0 bg-blue-600 rounded-[1.25rem] shadow-xl shadow-blue-600/30" />
                            )}
                            <span className="relative z-10 flex items-center gap-3">
                                <FaRotate className={tab === "federal" ? "animate-spin-slow" : ""} /> PNCP Federal
                            </span>
                        </button>
                        <button 
                            onClick={() => setTab("municipal")}
                            className={`relative px-12 py-3.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 ${tab === "municipal" ? "text-white" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            {tab === "municipal" && (
                                <motion.div layoutId="activeTabLicit" className="absolute inset-0 bg-slate-900 rounded-[1.25rem] shadow-xl shadow-slate-900/40" />
                            )}
                            <span className="relative z-10 flex items-center gap-3">
                                <FaBuildingColumns /> Base Municipal
                            </span>
                        </button>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {tab === "municipal" ? (
                        <motion.div
                            key="municipal"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Highlight Section - Padrão Novo Modelo */}
                            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 items-stretch">
                                
                                {/* Primary Highlight Card */}
                                <div className="lg:col-span-2 bg-white rounded-2xl p-7 sm:p-8 shadow-sm border border-[#DDE3EA] relative overflow-hidden flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-6">
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#EEF4FB] text-[#1254A3] rounded-lg text-[11px] font-black uppercase tracking-wider border border-[#DDE3EA]">
                                                <div className="w-2 h-2 rounded-full bg-[#1254A3] animate-pulse" />
                                                Fiscalização Pública
                                            </span>
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-black uppercase tracking-wider border border-emerald-100">
                                                <FaShieldHalved size={11} /> Base Transparente
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-[#5B738B] mb-1">
                                            Volume Estimado no Exercício
                                        </p>
                                        <div className="text-4xl sm:text-5xl font-black text-[#12304A] tracking-tight">
                                            {loading ? <FaSpinner className="animate-spin text-3xl text-[#1254A3]" /> : formatarMoeda(totalEstimado)}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 flex flex-wrap gap-8 items-center border-t border-[#DDE3EA] pt-6">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold uppercase text-[#5B738B] mb-0.5">Ano Base</span>
                                            <span className="text-xl font-black text-[#12304A]">{anoFiltro}</span>
                                        </div>
                                        <div className="w-px h-8 bg-[#DDE3EA] hidden md:block" />
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold uppercase text-[#5B738B] mb-0.5">Processos Localizados</span>
                                            <span className="text-xl font-black text-[#1254A3]">{filtrados.length} <span className="text-sm font-bold text-[#5B738B]">editais</span></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Secondary Context Card */}
                                <div className="bg-white rounded-2xl p-7 sm:p-8 shadow-sm border border-[#DDE3EA] flex flex-col justify-between">
                                     <div>
                                        <div className="w-14 h-14 bg-[#EEF4FB] text-[#1254A3] rounded-xl flex items-center justify-center text-2xl mb-5 border border-[#DDE3EA]">
                                            <FaGavel />
                                        </div>
                                        <h4 className="text-lg font-black text-[#12304A] tracking-tight mb-2">
                                            Licitações Municipais
                                        </h4>
                                        <p className="text-xs text-[#5B738B] leading-relaxed">
                                            Controle social das aquisições, editais públicos, compras diretas e dispensas com transparência integral.
                                        </p>
                                     </div>
                                     <div className="pt-5 border-t border-[#DDE3EA] flex items-center justify-between text-xs font-bold text-[#5B738B]">
                                         <div className="flex items-center gap-2">
                                             <div className="w-2 h-2 rounded-full bg-[#1254A3] animate-pulse" />
                                             <span>Lei 14.133/2021</span>
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
                                    currentYear={anoFiltro}
                                    onYearChange={setAnoFiltro}
                                    currentMonth=""
                                    onMonthChange={() => {}}
                                    onClear={handleClearFilters}
                                    onExport={handleExport}
                                    placeholder="Pesquisar por número do processo, objeto ou secretaria responsável..."
                                >
                                    <div className="flex flex-wrap gap-3 items-center">
                                        <div className="relative">
                                            <select 
                                                value={modalidadeFiltro} 
                                                onChange={(e) => setModalidadeFiltro(e.target.value)}
                                                className="px-4 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] outline-none focus:border-[#1254A3]"
                                            >
                                                <option value="">Todas as Modalidades</option>
                                                {Object.entries(modalidadeLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                            </select>
                                        </div>
                                        <div className="relative">
                                            <select 
                                                value={statusFiltro} 
                                                onChange={(e) => setStatusFiltro(e.target.value)}
                                                className="px-4 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] outline-none focus:border-[#1254A3]"
                                            >
                                                <option value="">Todos os Status</option>
                                                {Object.entries(statusConfig).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </TransparencyFilters>
                            </motion.div>

                            {/* View Mode Switcher: Editais vs Gráficos */}
                            <div className="flex bg-white p-1 rounded-xl border border-[#DDE3EA] w-fit mb-8 shadow-sm">
                                <button
                                    onClick={() => setAbaVisual("processos")}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                                        abaVisual === "processos"
                                            ? "bg-[#1254A3] text-white shadow-sm"
                                            : "text-[#5B738B] hover:text-[#1254A3]"
                                    }`}
                                >
                                    <FaFileLines size={13} /> Lista de Editais ({filtrados.length})
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
                                            Processos por Modalidade de Contratação
                                        </h3>
                                        <p className="text-xs text-[#5B738B] mb-4">
                                            Quantidade de licitações e dispensas registradas em {anoFiltro}.
                                        </p>
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={dadosPorModalidade}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#5B738B" }} />
                                                    <YAxis tick={{ fontSize: 11, fill: "#5B738B" }} allowDecimals={false} />
                                                    <Tooltip formatter={(v: number) => [`${v} editais`, "Quantidade"]} />
                                                    <Bar dataKey="quantidade" fill="#1254A3" radius={[6, 6, 0, 0]}>
                                                        {dadosPorModalidade.map((_, i) => (
                                                            <Cell key={`cell-lic-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE3EA] shadow-sm">
                                        <h3 className="text-base font-black text-[#12304A] mb-1">
                                            Situação / Status dos Processos
                                        </h3>
                                        <p className="text-xs text-[#5B738B] mb-4">
                                            Distribuição de processos abertos, em execução e concluídos.
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
                                                            <Cell key={`cell-st-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(v: number) => [`${v} processos`, "Total"]} />
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
                                                <div className="absolute inset-0 border-8 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                                <FaGavel className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-100" size={40} />
                                            </div>
                                            <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.5em] animate-pulse">Consultando Editais & Atos</p>
                                        </motion.div>
                                    ) : filtrados.length === 0 ? (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-white rounded-[3rem] p-32 text-center border-4 border-dashed border-slate-50 group hover:border-slate-100 transition-colors"
                                        >
                                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-all duration-500">
                                                <FaMagnifyingGlass className="text-slate-200 text-4xl" />
                                            </div>
                                            <h4 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-4">Nenhum processo localizado</h4>
                                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest opacity-60 italic mb-10 text-balance">Verifique os filtros aplicados ou consulte outro exercício financeiro.</p>
                                            <button onClick={handleClearFilters} className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl active:scale-95">Resetar Filtros</button>
                                        </motion.div>
                                    ) : (
                                        <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6">
                                            {filtrados.map((l, i) => (
                                                <motion.div 
                                                    key={l.id} 
                                                    variants={itemVariants}
                                                    className="bg-white rounded-2xl border border-[#DDE3EA] shadow-sm hover:shadow-md transition-all overflow-hidden relative p-1"
                                                >
                                                    <div className="p-6 lg:p-8">
                                                        <div className="flex flex-col lg:flex-row justify-between gap-8 mb-6">
                                                            {/* Licitacao Info */}
                                                            <div className="flex items-center gap-5">
                                                                <div className="w-16 h-16 bg-[#EEF4FB] text-[#1254A3] rounded-2xl flex items-center justify-center shrink-0 border border-[#DDE3EA] shadow-sm">
                                                                    <FaFileContract size={26} />
                                                                </div>
                                                                <div>
                                                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                                                        <h3 className="text-2xl font-black text-[#12304A] tracking-tight">{l.numero}</h3>
                                                                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-sm ${statusConfig[l.status]?.cor || "bg-slate-50 text-slate-400"}`}>
                                                                            {statusConfig[l.status]?.icon && (
                                                                                <div className={l.status === 'aberta' ? 'animate-pulse' : ''}>
                                                                                    {(() => {
                                                                                        const StatusIcon = statusConfig[l.status].icon;
                                                                                        return <StatusIcon size={12} />;
                                                                                    })()}
                                                                                </div>
                                                                            )}
                                                                            {statusConfig[l.status]?.label || l.status}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-4">
                                                                        <span className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                                                            <FaBuildingColumns size={12} className="text-blue-300" /> {l.secretaria}
                                                                        </span>
                                                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-5 py-2.5 rounded-xl border border-blue-100 flex items-center gap-2.5 shadow-sm">
                                                                            <FaBolt size={14} /> {modalidadeLabel[l.modalidade] || l.modalidade}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Valor Bento */}
                                                            <div className="lg:text-right flex flex-col justify-center">
                                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 block font-mono">VALOR ESTIMADO</span>
                                                                <div className="text-5xl font-black text-slate-900 tracking-tighter bg-slate-50 px-10 py-4 rounded-[2rem] border border-slate-100 inline-block lg:self-end shadow-sm group-hover:scale-105 transition-transform duration-500 tabular-nums">
                                                                    {formatarMoeda(l.valor)}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Details Bento */}
                                                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 bg-slate-50/50 rounded-[3rem] p-10 border border-slate-100 group-hover:bg-white transition-colors duration-700">
                                                            <div className="lg:col-span-3 flex flex-col justify-center">
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                                    <span className="w-1.5 h-4 bg-blue-500 rounded-full" /> Objeto do Certame
                                                                </p>
                                                                <div className="flex items-start gap-6">
                                                                    <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
                                                                        <FaBriefcase size={22} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-lg font-bold text-slate-600 italic leading-relaxed bg-white/50 p-6 rounded-2xl border border-dashed border-slate-200 group-hover:border-blue-100 transition-colors">
                                                                            "{l.objeto}"
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="lg:col-span-2 flex flex-col justify-center">
                                                                <div className="bg-white px-8 py-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col items-center justify-center gap-6 group-hover:border-blue-200 hover:scale-[1.02] transition-all duration-500 relative overflow-hidden group/date">
                                                                    <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover/date:rotate-12 transition-transform">
                                                                        <FaRegCalendar size={48} />
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-3">Data de Abertura</p>
                                                                        <div className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">
                                                                            {l.dataAbertura ? new Date(l.dataAbertura).toLocaleDateString("pt-BR") : "—"}
                                                                        </div>
                                                                        <div className="mt-4 flex items-center justify-center gap-3">
                                                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black">{l.ano}</span>
                                                                            <span className="text-[10px] font-black text-blue-400">EXERCÍCIO ATIVO</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action Bar */}
                                                        <div className="mt-10 flex flex-wrap justify-end gap-5">
                                                            <button
                                                                type="button"
                                                                onClick={() => setSelectedLicitacao(l)}
                                                                className="h-14 flex items-center gap-4 px-8 bg-white text-slate-700 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                                                            >
                                                                Detalhes e Fases do Processo
                                                            </button>
                                                            {(l.editalUrl || l.arquivo) ? (
                                                                <a
                                                                    href={l.editalUrl || l.arquivo || "#"}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="h-14 flex items-center gap-4 px-10 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/20 group/btn active:scale-95"
                                                                >
                                                                    <FaFileLines size={14} />
                                                                    Baixar Edital Oficial
                                                                    <FaExternalLinkAlt size={10} />
                                                                </a>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setSelectedLicitacao(l)}
                                                                    className="h-14 flex items-center gap-4 px-10 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/20 group/btn active:scale-95"
                                                                >
                                                                    <FaFileLines size={14} />
                                                                    Visualizar Edital e Anexos
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
                        </motion.div>
                    ) : (
                        <motion.div
                            key="federal"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-16 mb-8 relative overflow-hidden border border-slate-800 shadow-2xl shadow-blue-500/10 group">
                                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/30 to-transparent rounded-full -mr-60 -mt-60 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 text-white">
                                    <div className="w-28 h-28 bg-blue-600/20 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-2xl group-hover:rotate-12 transition-transform duration-700 shrink-0">
                                        <FaRotate size={48} className="text-blue-500 animate-spin-slow" />
                                    </div>
                                    <div className="text-center md:text-left flex-1">
                                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-xl shadow-blue-500/40">
                                            <FaShieldHalved size={12} /> Sincronização PNCP
                                        </div>
                                        <h3 className="text-5xl font-black tracking-tighter mb-6 leading-none italic">Integração <span className="text-blue-400 not-italic">Nacional</span></h3>
                                        <p className="text-slate-400 text-lg font-bold italic leading-relaxed max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                                            Acompanhe em tempo real todos os processos públicos de Lajes Pintadas registrados no Portal Nacional de Contratações Públicas. Conformidade total com a Nova Lei de Licitações (14.133/2021).
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-[3rem] p-2 border border-slate-100 shadow-2xl shadow-slate-200/50">
                                <div className="p-8 lg:p-12">
                                    <ListaPNCP onSwitchToMunicipal={() => setTab("municipal")} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div variants={itemVariants} className="mt-24">
                     <BannerPNTP />
                     <div className="mt-20 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-[2] max-w-2xl mx-auto">
                            PORTAL DE LICITAÇÕES • PREFEITURA DE LAJES PINTADAS/RN <br/>
                            <span className="opacity-40 font-bold italic">Processamento eletrônico em conformidade com as diretrizes do PNCP e PNTP.</span>
                        </p>
                    </div>
                </motion.div>

                {selectedLicitacao && (
                    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block mb-1">
                                        Processo Licitatório • Lei 14.133/2021
                                    </span>
                                    <h3 className="text-2xl font-black text-slate-900">
                                        {selectedLicitacao.numero} ({modalidadeLabel[selectedLicitacao.modalidade] || selectedLicitacao.modalidade})
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedLicitacao(null)}
                                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                                >
                                    Fechar
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div className="p-4 rounded-2xl bg-slate-50">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Nº Processo Administrativo</span>
                                    <span className="font-black text-slate-800">{selectedLicitacao.numeroProcesso || selectedLicitacao.numero}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Órgão / Secretaria</span>
                                    <span className="font-black text-slate-800">{selectedLicitacao.secretaria}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Valor Estimado</span>
                                    <span className="font-black text-slate-800">{formatarMoeda(selectedLicitacao.valorEstimado ?? selectedLicitacao.valor)}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Valor Homologado</span>
                                    <span className="font-black text-emerald-700">
                                        {selectedLicitacao.valorHomologado ? formatarMoeda(selectedLicitacao.valorHomologado) : "Em apuração / Não homologado"}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-black text-slate-500 uppercase mb-2">Objeto Detalhado</h4>
                                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    {selectedLicitacao.objeto}
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-xs font-black text-slate-700 uppercase">
                                        Peças e Documentos Integrais do Processo
                                    </h4>
                                    {selectedLicitacao.adesaoArp ? (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                            Ata de Adesão / Carona (PNTP 8.5)
                                        </span>
                                    ) : selectedLicitacao.ataRegistroPreco ? (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                            Ata Própria de Registro de Preços
                                        </span>
                                    ) : null}
                                </div>

                                {/* Edital Integral (Critério 8.2) */}
                                {(selectedLicitacao.editalUrl || selectedLicitacao.arquivo) && (
                                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 mb-4 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider block">
                                                Critério PNTP 8.2 • Instrumento Convocatório
                                            </span>
                                            <span className="font-bold text-slate-800 text-xs">Íntegra do Edital de Licitação / Termo Convocatório</span>
                                        </div>
                                        <a
                                            href={selectedLicitacao.editalUrl || selectedLicitacao.arquivo || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1254A3] text-white text-xs font-bold hover:bg-blue-800 transition-colors shadow-sm"
                                        >
                                            <FaFileLines /> Abrir Edital Integral <FaExternalLinkAlt size={10} />
                                        </a>
                                    </div>
                                )}

                                {/* Relação de Documentos das Fases Interna e Externa (8.3 e 8.4) */}
                                {(() => {
                                    let docs: any[] = [];
                                    if (Array.isArray(selectedLicitacao.fasesDocumentos)) {
                                        docs = selectedLicitacao.fasesDocumentos;
                                    } else if (typeof selectedLicitacao.fasesDocumentos === "string") {
                                        try { docs = JSON.parse(selectedLicitacao.fasesDocumentos); } catch {}
                                    }

                                    if (docs.length === 0) {
                                        return (
                                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic space-y-1">
                                                <p>Os documentos das fases preparatória e externa encontram-se arquivados nos autos do processo nº {selectedLicitacao.numeroProcesso || selectedLicitacao.numero} e sincronizados perante o PNCP Federal.</p>
                                            </div>
                                        );
                                    }

                                    const interna = docs.filter(d => d.fase === "interna");
                                    const externa = docs.filter(d => d.fase !== "interna");

                                    return (
                                        <div className="space-y-4">
                                            {interna.length > 0 && (
                                                <div className="space-y-2">
                                                    <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider block">
                                                        Fase Interna / Preparatória (ETP, Termo de Referência, Pareceres)
                                                    </span>
                                                    {interna.map((doc, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs">
                                                            <div>
                                                                <span className="font-bold text-slate-800">{doc.tipo || "Documento"}: </span>
                                                                <span className="text-slate-600">{doc.titulo}</span>
                                                            </div>
                                                            {doc.url && (
                                                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-purple-700 font-bold hover:underline">
                                                                    Ver PDF
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {externa.length > 0 && (
                                                <div className="space-y-2">
                                                    <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider block">
                                                        Fase Externa (Habilitação, Atas, Recursos, Homologação)
                                                    </span>
                                                    {externa.map((doc, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs">
                                                            <div>
                                                                <span className="font-bold text-slate-800">{doc.tipo || "Documento"}: </span>
                                                                <span className="text-slate-600">{doc.titulo}</span>
                                                            </div>
                                                            {doc.url && (
                                                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 font-bold hover:underline">
                                                                    Ver PDF
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}
            </motion.main>
        </div>
    );
}
