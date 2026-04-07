"use client";

import { useState, useEffect } from "react";
import { 
    FaChartBar, FaSpinner, FaExternalLinkAlt, FaBuilding, 
    FaGavel, FaMagnifyingGlass, FaRegCalendarAlt, FaBriefcase,
    FaArrowRight, FaRotateH, FaCheckCircle, FaClock, FaBan,
    FaCircleExclamation, FaFileContract, FaBuildingColumns,
    FaShieldHalved, FaArrowTrendUp, FaBolt, FaFileLines
} from "react-icons/fa6";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import ListaPNCP from "@/components/transparencia/integracao/ListaPNCP";
import { motion, AnimatePresence } from "framer-motion";

type Licitacao = {
    id: string; numero: string; objeto: string; modalidade: string;
    valor: number | null; status: string; secretaria: string; ano: number; dataAbertura?: string;
};

const modalidadeLabel: Record<string, string> = {
    pregao: "Pregão Eletrônico", concorrencia: "Concorrência", "tomada-precos": "Tomada de Preços",
    convite: "Convite", dispensa: "Dispensa de Licitação", inexigibilidade: "Inexigibilidade",
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
    const [tab, setTab] = useState<"municipal" | "federal">("federal");

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

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
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
                                <FaRotateH className={tab === "federal" ? "animate-spin-slow" : ""} /> PNCP Federal
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
                            {/* Highlight Section - Diamond Standard Bento */}
                            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch">
                                
                                {/* Primary Highlight Card - Estimativa Total */}
                                <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden group border border-slate-800">
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-40 -mt-40 group-hover:bg-blue-600/20 transition-all duration-700" />
                                    <div className="relative z-10 flex flex-col justify-between h-full">
                                        <div>
                                            <div className="flex items-center gap-4 mb-10">
                                                <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Fiscalização Pública</span>
                                                    </div>
                                                </div>
                                                <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                                    <div className="flex items-center gap-2">
                                                        <FaShieldHalved className="text-emerald-400" size={12} />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Base Transparente</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 mb-3 ml-1">Volume Estimado (Exercício)</h3>
                                            <div className="flex items-baseline gap-4">
                                                <span className="text-7xl font-black tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
                                                    {loading ? <FaSpinner className="animate-spin text-4xl" /> : formatarMoeda(totalEstimado).split(',')[0]}
                                                </span>
                                                <span className="text-2xl font-black text-white/20">,{formatarMoeda(totalEstimado).split(',')[1]}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-16 flex flex-wrap gap-12 items-center border-t border-white/5 pt-10">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Ano Base</span>
                                                <span className="text-2xl font-black tracking-tight tracking-tighter italic">{anoFiltro}</span>
                                            </div>
                                            <div className="w-px h-12 bg-white/5 hidden md:block" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Processos Localizados</span>
                                                <span className="text-2xl font-black tracking-tight uppercase italic text-blue-400">{filtrados.length} <span className="text-white/40 font-bold tracking-tighter">Editais</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Secondary Context Card */}
                                <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100/50 flex flex-col justify-between relative overflow-hidden group">
                                     <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                     <div className="relative">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-inner group-hover:shadow-blue-600/40">
                                            <FaGavel className="text-blue-400 group-hover:text-white transition-colors" size={36} />
                                        </div>
                                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-4 uppercase">
                                            Licitações <br/> <span className="text-blue-600">Municipais</span>
                                        </h4>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed opacity-80">
                                            Controle social das aquisições e editais.
                                        </p>
                                     </div>
                                     <div className="pt-10 border-t border-slate-50">
                                         <div className="flex items-center justify-between">
                                             <div className="flex items-center gap-2">
                                                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base de Dados</span>
                                             </div>
                                             <FaCheckCircle className="text-emerald-500" />
                                         </div>
                                     </div>
                                </div>
                            </motion.div>

                            {/* Filters Section */}
                            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-2 mb-12">
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
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-blue-600 transition-colors z-10">
                                                <FaBolt size={14} />
                                            </div>
                                            <select 
                                                value={modalidadeFiltro} 
                                                onChange={(e) => setModalidadeFiltro(e.target.value)}
                                                className="pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all appearance-none cursor-pointer hover:border-blue-400 min-w-[200px] shadow-inner"
                                            >
                                                <option value="">TODAS AS MODALIDADES</option>
                                                {Object.entries(modalidadeLabel).map(([v, l]) => <option key={v} value={v}>{l.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-blue-600 transition-colors z-10">
                                                <FaInfoCircle size={14} />
                                            </div>
                                            <select 
                                                value={statusFiltro} 
                                                onChange={(e) => setStatusFiltro(e.target.value)}
                                                className="pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all appearance-none cursor-pointer hover:border-blue-400 min-w-[200px] shadow-inner"
                                            >
                                                <option value="">TODOS OS STATUS</option>
                                                {Object.entries(statusConfig).map(([v, c]) => <option key={v} value={v}>{c.label.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </TransparencyFilters>
                            </motion.div>

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
                                        <motion.div variants={containerVariants} className="grid grid-cols-1 gap-10">
                                            {filtrados.map((l, i) => (
                                                <motion.div 
                                                    key={l.id} 
                                                    variants={itemVariants}
                                                    className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden group hover:shadow-blue-500/10 transition-all duration-700 hover:border-blue-200 relative p-1 lg:p-1.5"
                                                >
                                                    <div className="absolute top-10 right-10 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
                                                        <FaGavel size={200} />
                                                    </div>

                                                    <div className="p-10 lg:p-14">
                                                        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">
                                                            {/* Licitacao Info */}
                                                            <div className="flex items-center gap-8">
                                                                <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-[2.25rem] flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 group-hover:scale-110 transition-all duration-700 shadow-inner">
                                                                    <FaFileContract size={36} />
                                                                </div>
                                                                <div>
                                                                    <div className="flex flex-wrap items-center gap-4 mb-3">
                                                                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-blue-700 transition-colors leading-none">{l.numero}</h3>
                                                                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-sm ${statusConfig[l.status]?.cor || "bg-slate-50 text-slate-400"}`}>
                                                                            {statusConfig[l.status] && <statusConfig.l.status.icon size={12} className={l.status === 'aberta' ? 'animate-pulse' : ''} />}
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
                                                                        <FaRegCalendarAlt size={48} />
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-3">Data de Abertura</p>
                                                                        <div className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">
                                                                            {l.dataAbertura ? new Date(l.dataAbertura).toLocaleDateString("pt-BR") : "—"—"}
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
                                                            <button className="h-14 flex items-center gap-4 px-8 bg-white text-slate-500 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                                                                Acompanhar Sessão
                                                            </button>
                                                            <button className="h-14 flex items-center gap-4 px-10 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/20 group/btn active:scale-95">
                                                                <FaFileLines size={14} className="opacity-50 group-hover:opacity-100 group-hover:rotate-12 transition-all" />
                                                                Visualizar Edital 
                                                                <FaArrowRight size={10} className="group-hover/btn:translate-x-2 transition-transform" />
                                                            </button>
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
                                        <FaRotateH size={48} className="text-blue-500 animate-spin-slow" />
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
                                    <ListaPNCP />
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
            </motion.main>
        </div>
    );
}
