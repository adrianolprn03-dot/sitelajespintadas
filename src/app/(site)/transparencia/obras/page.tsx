"use client";

import { useState, useEffect, useMemo } from "react";
import { 
    FaHammer, FaMapMarker, FaCalendar, FaBuilding, 
    FaSpinner, FaArrowRight, FaImage,
    FaCheckCircle, FaExclamationTriangle, FaHardHat, FaInfoCircle,
    FaTable, FaDownload, FaExternalLinkAlt, FaSearch,
    FaClock, FaCoins, FaBriefcase, FaChartPie
} from "react-icons/fa";
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
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import Image from "next/image";

const CHART_COLORS = ["#1254A3", "#F39A32", "#10B981", "#0284C7", "#8B5CF6", "#F59E0B"];

type Obra = {
    id: string;
    titulo: string;
    descricao: string;
    local: string;
    valor: number;
    status: string;
    dataInicio: string | null;
    previsaoTermino: string | null;
    empresa: string | null;
    percentual: number;
    imagem: string | null;
    documentos: string;
    criadoEm: string;
};

const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
        case "concluida": return { label: "Concluída", color: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500", icon: <FaCheckCircle /> };
        case "em-andamento": return { label: "Em Andamento", color: "text-[#1254A3] bg-blue-50 border-blue-200", dot: "bg-[#1254A3]", icon: <FaHardHat /> };
        case "paralisada": return { label: "Paralisada", color: "text-rose-700 bg-rose-50 border-rose-200", dot: "bg-rose-500", icon: <FaExclamationTriangle /> };
        case "licitacao": return { label: "Licitação", color: "text-amber-700 bg-amber-50 border-amber-200", dot: "bg-amber-500", icon: <FaSpinner className="animate-spin" /> };
        default: return { label: status, color: "text-slate-600 bg-slate-50 border-slate-200", dot: "bg-slate-400", icon: <FaInfoCircle /> };
    }
};

const fmt = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export default function ObrasPublicasPage() {
    const [obras, setObras] = useState<Obra[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [status, setStatus] = useState("");
    const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
    const [abaVisual, setAbaVisual] = useState<"lista" | "graficos">("lista");

    useEffect(() => {
        const fetchObras = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({ 
                    query: busca,
                    status 
                });
                const res = await fetch(`/api/obras?${query.toString()}`);
                const data = await res.json();
                setObras(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar obras:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchObras();
    }, [busca, status]);

    const handleClearFilters = () => {
        setBusca("");
        setStatus("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = obras.map(o => ({
            "Título": o.titulo,
            "Local": o.local,
            "Valor": fmt(o.valor),
            "Empresa": o.empresa || "Não informada",
            "Progresso": `${o.percentual}%`,
            "Status": o.status
        }));

        const filename = `obras_publicas_lajes_pintadas`;
        const title = `Relatório de Acompanhamento de Obras Públicas – Lajes Pintadas/RN`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const totalInvestimento = useMemo(() => obras.reduce((acc, curr) => acc + (curr.valor || 0), 0), [obras]);
    const obrasConcluidas = useMemo(() => obras.filter(o => o.status?.toLowerCase() === "concluida").length, [obras]);
    const obrasEmAndamento = useMemo(() => obras.filter(o => o.status?.toLowerCase() === "em-andamento").length, [obras]);

    // Dados agregados por Status para gráficos
    const dadosPorStatus = useMemo(() => {
        const map: Record<string, { status: string; label: string; quantidade: number; valor: number }> = {};
        obras.forEach((o) => {
            const st = o.status?.toLowerCase() || "outros";
            const label = getStatusInfo(st).label;
            if (!map[st]) {
                map[st] = { status: st, label, quantidade: 0, valor: 0 };
            }
            map[st].quantidade += 1;
            map[st].valor += o.valor || 0;
        });
        return Object.values(map);
    }, [obras]);

    // Top Obras por Valor
    const dadosTopObras = useMemo(() => {
        return [...obras]
            .sort((a, b) => (b.valor || 0) - (a.valor || 0))
            .slice(0, 6)
            .map(o => ({
                titulo: o.titulo.length > 25 ? o.titulo.substring(0, 25) + "..." : o.titulo,
                valor: o.valor || 0,
                percentual: o.percentual || 0
            }));
    }, [obras]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA]">
            <PageHeader
                title="Acompanhamento de Obras"
                subtitle="Painel público de transparência sobre obras públicas, investimentos de infraestrutura e medições fiscais."
                icon={<FaHammer />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Obras" }
                ]}
            />

            <motion.div 
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
                            <FaTable size={13} /> Lista de Obras
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

                {/* Dashboard Stats - Padrão Novo */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div className="bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider">Investimento Total</span>
                            <span className="p-2 bg-blue-50 text-[#1254A3] rounded-xl">
                                <FaCoins size={16} />
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-[#12304A] tracking-tight">{loading ? "..." : fmt(totalInvestimento)}</h3>
                        <p className="text-xs text-[#5B738B] mt-2 pt-2 border-t border-[#DDE3EA]">Contratos e convênios</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider">Obras Concluídas</span>
                            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <FaCheckCircle size={16} />
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-emerald-600 tracking-tight">{loading ? "..." : obrasConcluidas}</h3>
                        <p className="text-xs text-[#5B738B] mt-2 pt-2 border-t border-[#DDE3EA]">Entregues à população</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider">Canteiros Ativos</span>
                            <span className="p-2 bg-amber-50 text-[#F39A32] rounded-xl">
                                <FaHardHat size={16} />
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-[#F39A32] tracking-tight">{loading ? "..." : obrasEmAndamento}</h3>
                        <p className="text-xs text-[#5B738B] mt-2 pt-2 border-t border-[#DDE3EA]">Em execução física</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider">Total de Registros</span>
                            <span className="p-2 bg-slate-50 text-slate-600 rounded-xl">
                                <FaTable size={16} />
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-[#12304A] tracking-tight">{loading ? "..." : obras.length}</h3>
                        <p className="text-xs text-[#5B738B] mt-2 pt-2 border-t border-[#DDE3EA]">Cadastros mapeados</p>
                    </div>
                </motion.div>

                {/* Filtros */}
                <motion.div variants={itemVariants} className="mb-8 bg-white p-5 rounded-2xl border border-[#DDE3EA] shadow-sm">
                    <TransparencyFilters
                        searchValue={busca}
                        onSearch={setBusca}
                        onClear={handleClearFilters}
                        onExport={handleExport}
                        currentYear=""
                        onYearChange={() => {}}
                        currentMonth=""
                        onMonthChange={() => {}}
                        placeholder="Buscar por nome da obra, local ou empresa contratada..."
                    >
                        <div className="flex items-center gap-3">
                            <select 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)}
                                className="bg-[#F5F7FA] border border-[#DDE3EA] px-4 py-2.5 rounded-xl text-xs font-bold text-[#12304A] outline-none hover:border-[#1254A3] focus:ring-2 focus:ring-[#1254A3] transition-all cursor-pointer min-w-[180px]"
                            >
                                <option value="">Todos os Status</option>
                                <option value="concluida">Concluída</option>
                                <option value="em-andamento">Em Andamento</option>
                                <option value="paralisada">Paralisada</option>
                                <option value="licitacao">Licitação</option>
                            </select>
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
                        {/* Gráfico 1: Investimento por Situação */}
                        <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-base font-bold text-[#12304A]">Volume de Investimento por Status</h3>
                                    <p className="text-xs text-[#5B738B]">Total orçado e contratado por situação da obra</p>
                                </div>
                                <span className="p-2 bg-blue-50 text-[#1254A3] rounded-xl text-xs font-bold">
                                    {dadosPorStatus.length} Status
                                </span>
                            </div>
                            <div className="h-[300px] w-full">
                                {dadosPorStatus.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={dadosPorStatus} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#12304A', fontWeight: 600 }} />
                                            <YAxis tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#5B738B' }} />
                                            <Tooltip formatter={(value: number) => [fmt(value), "Investimento"]} />
                                            <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                                                {dadosPorStatus.map((_, index) => (
                                                    <Cell key={`cell-status-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-sm text-[#5B738B]">
                                        Nenhum dado disponível
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Gráfico 2: Quantidade de Obras por Status */}
                        <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-base font-bold text-[#12304A]">Proporção de Obras</h3>
                                    <p className="text-xs text-[#5B738B]">Distribuição quantitativa por fase de execução</p>
                                </div>
                                <span className="p-2 bg-amber-50 text-[#F39A32] rounded-xl text-xs font-bold">
                                    {obras.length} Obras
                                </span>
                            </div>
                            <div className="h-[300px] w-full">
                                {dadosPorStatus.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={dadosPorStatus}
                                                dataKey="quantidade"
                                                nameKey="label"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={95}
                                                innerRadius={50}
                                                paddingAngle={4}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {dadosPorStatus.map((_, index) => (
                                                    <Cell key={`cell-pie-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(val: number) => [`${val} obras`, "Quantidade"]} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-sm text-[#5B738B]">
                                        Nenhum dado disponível
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Main Content Area - Lista */}
                {abaVisual === "lista" && (
                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-6 bg-[#1254A3] rounded-full" />
                                <h2 className="text-base font-bold text-[#12304A]">Projetos e Intervenções Mapeadas</h2>
                            </div>
                            <div className="text-xs text-[#5B738B] font-medium flex items-center gap-4">
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#1254A3]" /> Em Execução</span>
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Finalizada</span>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div 
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white rounded-2xl p-16 text-center border border-[#DDE3EA] shadow-sm"
                                >
                                    <FaSpinner className="animate-spin text-3xl text-[#1254A3] mx-auto mb-3" />
                                    <p className="text-xs font-bold text-[#5B738B] uppercase tracking-wider">Sincronizando banco de obras...</p>
                                </motion.div>
                            ) : obras.length === 0 ? (
                                <motion.div 
                                    key="empty"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-2xl p-16 text-center border border-[#DDE3EA] shadow-sm"
                                >
                                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <FaSearch size={28} />
                                    </div>
                                    <h4 className="text-lg font-bold text-[#12304A] mb-1">Sem resultados para a busca</h4>
                                    <p className="text-xs text-[#5B738B] mb-4">Não encontramos nenhuma obra com os filtros selecionados.</p>
                                    <button onClick={handleClearFilters} className="px-5 py-2.5 bg-[#1254A3] text-white rounded-xl text-xs font-bold hover:bg-[#0d3f7c] transition-all shadow-sm">Ver Todas as Obras</button>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {obras.map((o) => {
                                        const statusInfo = getStatusInfo(o.status);
                                        return (
                                            <div 
                                                key={o.id}
                                                className="bg-white rounded-2xl border border-[#DDE3EA] shadow-sm hover:border-[#1254A3]/40 transition-all p-5 flex flex-col lg:flex-row items-center gap-6"
                                            >
                                                {/* Preview / Thumbnail */}
                                                <div className="w-full lg:w-36 h-28 bg-[#F5F7FA] rounded-xl shrink-0 overflow-hidden relative border border-[#DDE3EA]">
                                                    {o.imagem ? (
                                                        <Image 
                                                            src={o.imagem} 
                                                            alt={o.titulo} 
                                                            fill 
                                                            className="object-cover" 
                                                        />
                                                    ) : (
                                                        <div className="h-full flex items-center justify-center text-slate-300">
                                                            <FaImage size={28} />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Main Info */}
                                                <div className="flex-1 min-w-0 w-full lg:w-auto">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusInfo.color}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                                                            {statusInfo.label}
                                                        </span>
                                                        <span className="text-xs text-[#5B738B] font-medium flex items-center gap-1">
                                                            <FaMapMarker className="text-[#1254A3]" size={11} /> {o.local}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-base font-bold text-[#12304A] mb-1 leading-snug">
                                                        {o.titulo}
                                                    </h3>
                                                    <p className="text-xs text-[#5B738B] flex items-center gap-2 truncate">
                                                        <FaBriefcase className="text-slate-400" size={11} /> {o.empresa || "Licitação / Contratação em Aberto"}
                                                    </p>
                                                </div>

                                                {/* Investment & Timeline */}
                                                <div className="flex flex-row items-center gap-6 w-full lg:w-auto shrink-0 justify-between lg:justify-start">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-[#5B738B] uppercase tracking-wider">Investimento</p>
                                                        <p className="text-base font-black text-[#12304A]">{fmt(o.valor)}</p>
                                                    </div>

                                                    <div className="flex items-center gap-3 bg-[#F5F7FA] px-3 py-2 rounded-xl border border-[#DDE3EA]">
                                                        <div>
                                                            <span className="text-[9px] font-semibold text-[#5B738B] block">Início</span>
                                                            <span className="text-xs font-bold text-[#12304A]">
                                                                {o.dataInicio ? new Date(o.dataInicio).toLocaleDateString("pt-BR") : "N/I"}
                                                            </span>
                                                        </div>
                                                        <div className="w-[1px] h-6 bg-[#DDE3EA]" />
                                                        <div>
                                                            <span className="text-[9px] font-semibold text-[#5B738B] block">Previsão</span>
                                                            <span className="text-xs font-bold text-[#1254A3]">
                                                                {o.previsaoTermino ? new Date(o.previsaoTermino).toLocaleDateString("pt-BR") : "N/I"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Progress & Action */}
                                                <div className="w-full lg:w-56 flex flex-col gap-2 shrink-0">
                                                    <div className="flex justify-between items-center text-xs font-bold">
                                                        <span className="text-[#5B738B]">Execução Física</span>
                                                        <span className="text-[#1254A3]">{o.percentual}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-[#DDE3EA] rounded-full overflow-hidden">
                                                        <div 
                                                            style={{ width: `${o.percentual}%` }}
                                                            className="h-full bg-[#1254A3] rounded-full transition-all duration-500"
                                                        />
                                                    </div>
                                                    <button 
                                                        onClick={() => setSelectedObra(o)}
                                                        className="mt-2 h-9 bg-[#1254A3] text-white rounded-xl text-xs font-bold hover:bg-[#0d3f7c] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                                                    >
                                                        Visualizar Detalhes
                                                        <FaArrowRight size={10} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* PNTP Compliance Footer */}
                <motion.div variants={itemVariants} className="mt-12 space-y-8">
                    <BannerPNTP />
                    <div className="bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1254A3] flex items-center justify-center shrink-0">
                                <FaInfoCircle size={22} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#12304A]">Informação ao Cidadão</h4>
                                <p className="text-xs text-[#5B738B] leading-relaxed max-w-md">As informações de obras são atualizadas periodicamente pela Secretaria Municipal de Infraestrutura e Serviços Públicos.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => handleExport('pdf')} className="px-4 py-2 bg-[#F5F7FA] border border-[#DDE3EA] text-[#12304A] rounded-xl text-xs font-bold hover:border-[#1254A3] transition-all flex items-center gap-2">
                                <FaDownload size={11} /> Exportar PDF
                            </button>
                            <button onClick={() => handleExport('xlsx')} className="px-4 py-2 bg-[#F5F7FA] border border-[#DDE3EA] text-[#12304A] rounded-xl text-xs font-bold hover:border-[#1254A3] transition-all flex items-center gap-2">
                                <FaDownload size={11} /> Planilha Excel
                            </button>
                        </div>
                    </div>

                    <div className="text-center pt-4">
                        <p className="text-xs text-[#5B738B]">
                            PORTAL DA TRANSPARÊNCIA • PREFEITURA DE LAJES PINTADAS/RN <br/>
                            <span className="italic">Processamento de dados em conformidade com a Lei de Acesso à Informação (Lei 12.527/11) e Cartilha PNTP.</span>
                        </p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Modal de Detalhes */}
            <AnimatePresence>
                {selectedObra && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedObra(null)}
                            className="absolute inset-0 bg-[#12304A]/60 backdrop-blur-sm"
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] border border-[#DDE3EA]"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-[#DDE3EA] flex items-start justify-between bg-[#F5F7FA]">
                                <div className="flex-1 pr-4">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusInfo(selectedObra.status).color}`}>
                                            <span className={`w-2 h-2 rounded-full ${getStatusInfo(selectedObra.status).dot}`} />
                                            {getStatusInfo(selectedObra.status).label}
                                        </span>
                                        <span className="text-xs text-[#5B738B] bg-white px-3 py-1 rounded-lg border border-[#DDE3EA] flex items-center gap-1.5">
                                            <FaClock className="text-[#1254A3]" size={11} /> Cadastrado em {new Date(selectedObra.criadoEm).toLocaleDateString("pt-BR")}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-black text-[#12304A]">
                                        {selectedObra.titulo}
                                    </h2>
                                </div>
                                <button 
                                    onClick={() => setSelectedObra(null)}
                                    className="w-9 h-9 bg-white border border-[#DDE3EA] rounded-xl flex items-center justify-center text-[#5B738B] hover:text-[#12304A] hover:bg-slate-100 transition-all"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="aspect-video relative rounded-xl overflow-hidden border border-[#DDE3EA] bg-slate-100">
                                        {selectedObra.imagem ? (
                                            <Image src={selectedObra.imagem} alt={selectedObra.titulo} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <FaImage size={48} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-[#F5F7FA] rounded-xl p-5 border border-[#DDE3EA] flex flex-col justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-1">Medição Física</p>
                                            <p className="text-3xl font-black text-[#1254A3] mb-3">{selectedObra.percentual}% concluído</p>
                                            <div className="h-3 w-full bg-[#DDE3EA] rounded-full overflow-hidden">
                                                <div 
                                                    style={{ width: `${selectedObra.percentual}%` }}
                                                    className="h-full bg-[#1254A3] rounded-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-[#DDE3EA] grid grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <span className="text-[#5B738B] block">Data de Início:</span>
                                                <span className="font-bold text-[#12304A]">{selectedObra.dataInicio ? new Date(selectedObra.dataInicio).toLocaleDateString("pt-BR") : "N/I"}</span>
                                            </div>
                                            <div>
                                                <span className="text-[#5B738B] block">Previsão Conclusão:</span>
                                                <span className="font-bold text-[#1254A3]">{selectedObra.previsaoTermino ? new Date(selectedObra.previsaoTermino).toLocaleDateString("pt-BR") : "N/I"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-2">Descrição da Obra</h3>
                                    <p className="text-sm text-[#12304A] bg-[#F5F7FA] p-4 rounded-xl border border-[#DDE3EA] leading-relaxed">
                                        {selectedObra.descricao}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-[#DDE3EA]">
                                        <span className="text-[10px] font-bold text-[#5B738B] uppercase tracking-wider block mb-1">Investimento Orçado</span>
                                        <p className="text-lg font-black text-[#12304A]">{fmt(selectedObra.valor)}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-[#DDE3EA]">
                                        <span className="text-[10px] font-bold text-[#5B738B] uppercase tracking-wider block mb-1">Empresa Contratada</span>
                                        <p className="text-sm font-bold text-[#12304A]">{selectedObra.empresa || "Licitação em Aberto"}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-[#DDE3EA]">
                                        <span className="text-[10px] font-bold text-[#5B738B] uppercase tracking-wider block mb-1">Localização</span>
                                        <p className="text-sm font-bold text-[#12304A]">{selectedObra.local}</p>
                                    </div>
                                </div>

                                {selectedObra.documentos && (
                                    <div>
                                        <h3 className="text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-2">Documentos e Projetos Técnicos</h3>
                                        <div className="flex items-center justify-between bg-[#F5F7FA] p-4 rounded-xl border border-[#DDE3EA]">
                                            <div className="flex items-center gap-3">
                                                <FaDownload className="text-[#1254A3]" size={14} />
                                                <span className="text-xs font-bold text-[#12304A]">{selectedObra.documentos}</span>
                                            </div>
                                            <span className="text-xs font-bold text-[#1254A3]">Baixar Anexo</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 bg-[#F5F7FA] border-t border-[#DDE3EA] flex items-center justify-end">
                                <button 
                                    onClick={() => setSelectedObra(null)}
                                    className="px-5 py-2 bg-[#1254A3] text-white rounded-xl text-xs font-bold hover:bg-[#0d3f7c] transition-all shadow-sm"
                                >
                                    Fechar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}