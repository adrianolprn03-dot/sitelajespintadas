"use client";
import { useState, useEffect } from "react";
import { 
    FaHammer, FaMapMarkerAlt, FaCalendarAlt, FaBuilding, 
    FaChartLine, FaSpinner, FaArrowRight, FaImage,
    FaCheckCircle, FaExclamationTriangle, FaHardHat, FaInfoCircle,
    FaTable, FaDownload, FaExternalLinkAlt, FaMagnifyingGlass,
    FaClock, FaCoins, FaBriefcase
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import Image from "next/image";

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
        case "concluida": return { label: "Concluída", color: "text-emerald-700 bg-emerald-50 border-emerald-100", dot: "bg-emerald-500", icon: <FaCheckCircle /> };
        case "em-andamento": return { label: "Em Andamento", color: "text-blue-700 bg-blue-50 border-blue-100", dot: "bg-blue-500", icon: <FaHardHat className="animate-pulse" /> };
        case "paralisada": return { label: "Paralisada", color: "text-rose-700 bg-rose-50 border-rose-100", dot: "bg-rose-500", icon: <FaExclamationTriangle className="animate-bounce" /> };
        case "licitacao": return { label: "Licitação", color: "text-amber-700 bg-amber-50 border-amber-100", dot: "bg-amber-500", icon: <FaSpinner className="animate-spin" /> };
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

    const totalInvestimento = obras.reduce((acc, curr) => acc + curr.valor, 0);
    const obrasEmAndamento = obras.filter(o => o.status.toLowerCase() === "em-andamento").length;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Acompanhamento de Obras"
                subtitle="Painel interativo de transparência sobre o desenvolvimento urbano e rural de Lajes Pintadas."
                variant="premium"
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
                className="max-w-[1400px] mx-auto px-6 py-12 -mt-16 relative z-30"
            >
                {/* Dashboard Stats */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-6 group hover:border-blue-500/30 transition-all duration-500">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-lg shadow-blue-200/20">
                            <FaCoins />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Investimento Total</p>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{loading ? "..." : fmt(totalInvestimento)}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-6 group hover:border-emerald-500/30 transition-all duration-500">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-lg shadow-emerald-200/20">
                            <FaCheckCircle />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Obras Concluídas</p>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{loading ? "..." : obras.filter(o => o.status === 'concluida').length}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-6 group hover:border-orange-500/30 transition-all duration-500">
                        <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-3xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 shadow-lg shadow-orange-200/20">
                            <FaHardHat />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Canteiros Ativos</p>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{loading ? "..." : obrasEmAndamento}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-6 group hover:border-purple-500/30 transition-all duration-500">
                        <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-3xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-lg shadow-purple-200/20">
                            <FaTable />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Registrado</p>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{loading ? "..." : obras.length}</h3>
                        </div>
                    </div>
                </motion.div>

                {/* Filtros Premium */}
                <motion.div variants={itemVariants} className="mb-12 bg-white/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl">
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
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-[1px] bg-slate-200 hidden md:block" />
                            <select 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)}
                                className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[11px] font-bold text-slate-700 outline-none hover:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm min-w-[200px]"
                            >
                                <option value="">Filtrar por Status</option>
                                <option value="concluida">Concluída</option>
                                <option value="em-andamento">Em Andamento</option>
                                <option value="paralisada">Paralisada</option>
                                <option value="licitacao">Licitação</option>
                            </select>
                        </div>
                    </TransparencyFilters>
                </motion.div>

                {/* Main Content Area */}
                <motion.div variants={itemVariants} className="space-y-6">
                    <div className="flex items-center justify-between px-10 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Listagem de Projetos Ativos</h2>
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-4">
                            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> Em Execução</span>
                            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Finalizado</span>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white rounded-[3rem] p-32 text-center shadow-xl border border-slate-50"
                            >
                                <div className="relative inline-block mb-8">
                                    <div className="w-24 h-24 border-8 border-slate-100 rounded-full" />
                                    <div className="absolute inset-0 border-8 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    <FaHammer className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-100" size={40} />
                                </div>
                                <p className="text-sm font-bold text-slate-400 animate-pulse tracking-[0.2em] uppercase">Sincronizando banco de obras...</p>
                            </motion.div>
                        ) : obras.length === 0 ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[3rem] p-32 text-center shadow-xl border border-slate-50 group"
                            >
                                <div className="w-28 h-28 bg-slate-50 text-slate-200 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-all duration-500">
                                    <FaMagnifyingGlass size={48} />
                                </div>
                                <h4 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-4">Sem resultados para a busca</h4>
                                <p className="text-slate-400 text-sm font-medium italic mb-10">Não encontramos nenhuma obra com os critérios selecionados.</p>
                                <button onClick={handleClearFilters} className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-2xl active:scale-95">Ver Todas as Obras</button>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {obras.map((o, idx) => {
                                    const statusInfo = getStatusInfo(o.status);
                                    return (
                                        <motion.div 
                                            key={o.id}
                                            variants={itemVariants}
                                            layout
                                            className="group bg-white rounded-[2rem] border border-slate-100 shadow-lg hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 overflow-hidden relative"
                                        >
                                            {/* Hover Accent */}
                                            <div className="absolute top-0 left-0 w-[6px] h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            
                                            <div className="p-4 sm:p-8 flex flex-col lg:flex-row items-center gap-10">
                                                {/* Preview / Thumbnail */}
                                                <div className="w-full lg:w-48 h-48 lg:h-32 bg-slate-50 rounded-2xl shrink-0 overflow-hidden relative border border-slate-100 shadow-inner group-hover:border-blue-100 transition-colors">
                                                    {o.imagem ? (
                                                        <Image 
                                                            src={o.imagem} 
                                                            alt={o.titulo} 
                                                            fill 
                                                            className="object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out" 
                                                        />
                                                    ) : (
                                                        <div className="h-full flex items-center justify-center text-slate-200 group-hover:text-blue-100 transition-colors">
                                                            <FaImage size={40} />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>

                                                {/* Main Info */}
                                                <div className="flex-1 min-w-0 w-full lg:w-auto">
                                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusInfo.color}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot} shadow-[0_0_8px_currentColor]`} />
                                                            {statusInfo.label}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1.5">
                                                            <FaMapMarkerAlt className="text-blue-400" /> {o.local}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors mb-2 truncate">
                                                        {o.titulo}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-slate-500">
                                                        <span className="text-[11px] font-bold flex items-center gap-2 truncate">
                                                            <FaBriefcase className="text-slate-300" /> {o.empresa || "Licitação em Aberto"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Investment & Timeline */}
                                                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-8 lg:gap-4 xl:gap-12 w-full lg:w-auto shrink-0 px-4 lg:px-0">
                                                    <div className="text-center sm:text-left lg:text-center xl:text-left min-w-[140px]">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Investimento</p>
                                                        <p className="text-xl font-black text-slate-900 tabular-nums tracking-tighter">{fmt(o.valor)}</p>
                                                    </div>

                                                    <div className="flex items-center gap-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-all">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[8px] font-black text-slate-400 uppercase">Início</span>
                                                            <span className="text-[10px] font-black text-slate-700 tabular-nums">
                                                                {o.dataInicio ? new Date(o.dataInicio).toLocaleDateString("pt-BR") : "N/I"}
                                                            </span>
                                                        </div>
                                                        <div className="w-[1px] h-6 bg-slate-200" />
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[8px] font-black text-slate-400 uppercase">Entrega</span>
                                                            <span className="text-[10px] font-black text-blue-600 tabular-nums">
                                                                {o.previsaoTermino ? new Date(o.previsaoTermino).toLocaleDateString("pt-BR") : "N/I"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Progress & Action */}
                                                <div className="w-full lg:w-64 flex flex-col gap-4 shrink-0">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Execução Física</span>
                                                        <span className="text-lg font-black text-blue-600 tabular-nums">{o.percentual}%</span>
                                                    </div>
                                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-[2px] shadow-inner relative group/bar">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${o.percentual}%` }}
                                                            transition={{ duration: 1.5, ease: "circOut" }}
                                                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.3)] relative"
                                                        >
                                                            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:16px_16px] animate-[progress-stripe_2s_linear_infinite]" />
                                                        </motion.div>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <button 
                                                            onClick={() => setSelectedObra(o)}
                                                            className="flex-1 h-12 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 active:scale-95 group/btn"
                                                        >
                                                            Visualizar Detalhes
                                                            <FaArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                                                        </button>
                                                        <button className="w-12 h-12 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center">
                                                            <FaImage size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* PNTP Compliance Footer */}
                <motion.div variants={itemVariants} className="mt-24 space-y-12">
                    <BannerPNTP />
                    <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl">
                                <FaInfoCircle />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Informação ao Cidadão</h4>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md">As informações acima são atualizadas semanalmente pela Secretaria de Infraestrutura. Dados sincronizados com o Sistema de Auditoria Interna.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => handleExport('pdf')} className="px-6 py-3 bg-slate-50 text-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                                <FaDownload size={10} /> Exportar PDF
                            </button>
                            <button onClick={() => handleExport('xlsx')} className="px-6 py-3 bg-slate-50 text-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                                <FaDownload size={10} /> Excel (Planilha)
                            </button>
                        </div>
                    </div>

                    <div className="text-center pt-8">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-[2] max-w-2xl mx-auto">
                            PORTAL DA TRANSPARÊNCIA • PREFEITURA DE LAJES PINTADAS/RN <br/>
                            <span className="opacity-40 font-bold italic">Processamento de dados em tempo real conforme Lei de Acesso à Informação (Lei 12.527/11).</span>
                        </p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Modal de Detalhes - Full Information */}
            <AnimatePresence>
                {selectedObra && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedObra(null)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-8 lg:p-12 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-4 mb-4">
                                        <div className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusInfo(selectedObra.status).color}`}>
                                            <span className={`w-2 h-2 rounded-full ${getStatusInfo(selectedObra.status).dot} animate-pulse`} />
                                            {getStatusInfo(selectedObra.status).label}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2 shadow-sm">
                                            <FaClock className="text-blue-400" /> Cadastrado em {new Date(selectedObra.criadoEm).toLocaleDateString("pt-BR")}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
                                        {selectedObra.titulo}
                                    </h2>
                                </div>
                                <button 
                                    onClick={() => setSelectedObra(null)}
                                    className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all shadow-sm"
                                >
                                    <FaArrowRight className="rotate-45" size={20} />
                                </button>
                            </div>

                            {/* Modal Body - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-8 lg:p-12 scrollbar-thin">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                    {/* Left Column: Image & Progress */}
                                    <div className="lg:col-span-5 space-y-10">
                                        <div className="aspect-video relative rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-2xl">
                                            {selectedObra.imagem ? (
                                                <Image src={selectedObra.imagem} alt={selectedObra.titulo} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                                    <FaImage size={64} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100">
                                            <div className="flex justify-between items-end mb-6">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status de Execução</p>
                                                    <p className="text-4xl font-black text-slate-900 tracking-tighter">Medição Física</p>
                                                </div>
                                                <span className="text-5xl font-black text-blue-600 tabular-nums">{selectedObra.percentual}%</span>
                                            </div>
                                            <div className="h-6 w-full bg-white rounded-full overflow-hidden p-1 shadow-inner border border-slate-200">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${selectedObra.percentual}%` }}
                                                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full relative"
                                                >
                                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:24px_24px] animate-[progress-stripe_2s_linear_infinite]" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Full Data */}
                                    <div className="lg:col-span-7 space-y-12">
                                        <section>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                                    <FaInfoCircle size={18} />
                                                </div>
                                                <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em]">Descrição Detalhada</h3>
                                            </div>
                                            <p className="text-lg font-bold text-slate-600 leading-relaxed bg-slate-50 p-8 rounded-[2rem] border border-slate-100 italic">
                                                "{selectedObra.descricao}"
                                            </p>
                                        </section>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-blue-200 transition-all">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Investimento</p>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                                        <FaCoins size={20} />
                                                    </div>
                                                    <p className="text-2xl font-black text-slate-900 tabular-nums tracking-tighter">{fmt(selectedObra.valor)}</p>
                                                </div>
                                            </div>

                                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-blue-200 transition-all">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Empresa Executora</p>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                                        <FaBriefcase size={20} />
                                                    </div>
                                                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">{selectedObra.empresa || "Licitação em Aberto"}</p>
                                                </div>
                                            </div>

                                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-blue-200 transition-all">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Localização</p>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                                        <FaMapMarkerAlt size={20} />
                                                    </div>
                                                    <p className="text-lg font-bold text-slate-700 uppercase tracking-tight">{selectedObra.local}</p>
                                                </div>
                                            </div>

                                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-blue-200 transition-all">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Cronograma Estimado</p>
                                                <div className="flex items-center gap-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black text-slate-300 uppercase">Início</span>
                                                        <span className="text-[12px] font-black text-slate-900">{selectedObra.dataInicio ? new Date(selectedObra.dataInicio).toLocaleDateString("pt-BR") : "N/I"}</span>
                                                    </div>
                                                    <div className="w-px h-8 bg-slate-100" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black text-slate-300 uppercase">Entrega</span>
                                                        <span className="text-[12px] font-black text-blue-600">{selectedObra.previsaoTermino ? new Date(selectedObra.previsaoTermino).toLocaleDateString("pt-BR") : "N/I"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <section>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                                                    <FaTable size={18} />
                                                </div>
                                                <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em]">Documentação & Transparência</h3>
                                            </div>
                                            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                                    <FaExternalLinkAlt size={80} />
                                                </div>
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6">Arquivos Vinculados ao Processo</p>
                                                <div className="space-y-4">
                                                    {selectedObra.documentos ? (
                                                        <div className="flex items-center justify-between bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group/item">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                                                    <FaDownload size={14} />
                                                                </div>
                                                                <span className="text-[11px] font-black uppercase tracking-widest text-white/80 group-hover/item:text-white">{selectedObra.documentos}</span>
                                                            </div>
                                                            <FaArrowRight className="text-white/20 group-hover/item:text-white group-hover/item:translate-x-2 transition-all" size={12} />
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs font-bold text-white/30 italic">Nenhum documento anexado a este registro.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Modal Footer */}
                            <div className="p-8 lg:p-10 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Dados auditados pelo controle interno municipal
                                </p>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setSelectedObra(null)}
                                        className="px-10 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-2xl active:scale-95"
                                    >
                                        Fechar Painel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                @keyframes progress-stripe {
                    0% { background-position: 0 0; }
                    100% { background-position: 32px 0; }
                }
            `}</style>
        </div>
    );
}
