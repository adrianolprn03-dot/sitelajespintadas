"use client";
import { useState, useEffect } from "react";
import { 
    FaHammer, FaMapMarkerAlt, FaCalendarAlt, FaBuilding, 
    FaChartLine, FaSpinner, FaArrowRight, FaImage,
    FaCheckCircle, FaExclamationTriangle, FaHardHat, FaMagnifyingGlass
} from "react-icons/fa6";
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
        case "concluida": return { label: "Concluída", color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: <FaCheckCircle /> };
        case "em-andamento": return { label: "Em Andamento", color: "text-blue-600 bg-blue-50 border-blue-100", icon: <FaHardHat className="animate-pulse" /> };
        case "paralisada": return { label: "Paralisada", color: "text-rose-600 bg-rose-50 border-rose-100", icon: <FaExclamationTriangle className="animate-bounce" /> };
        case "licitacao": return { label: "Licitação", color: "text-amber-600 bg-amber-50 border-amber-100", icon: <FaSpinner className="animate-spin" /> };
        default: return { label: status, color: "text-slate-500 bg-slate-50 border-slate-100", icon: <FaInfoCircle /> };
    }
};

const fmt = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export default function ObrasPublicasPage() {
    const [obras, setObras] = useState<Obra[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [status, setStatus] = useState("");

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
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#fcfdfe] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Acompanhamento de Obras"
                subtitle="Consulte o andamento, valores e prazos das obras públicas em execução no nosso município com transparência total."
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
                className="max-w-[1280px] mx-auto px-6 py-12 -mt-12 relative z-30"
            >
                {/* Filtros Premium */}
                <motion.div variants={itemVariants} className="mb-12">
                    <TransparencyFilters
                        searchValue={busca}
                        onSearch={setBusca}
                        onClear={handleClearFilters}
                        onExport={handleExport}
                        currentYear=""
                        onYearChange={() => {}}
                        currentMonth=""
                        onMonthChange={() => {}}
                        placeholder="Buscar por título, local ou empresa..."
                    >
                        <div className="flex items-center gap-3">
                            <select 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)}
                                className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none hover:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm"
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

                {/* Resumo Bento Box */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {/* Total Investimento */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-900/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700 group-hover:rotate-12">
                            <FaChartLine size={160} />
                        </div>
                        <div className="relative z-10">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4 block">Investimento Consolidado</span>
                            <div className="text-4xl font-black tracking-tighter mb-2">{loading ? "..." : fmt(totalInvestimento)}</div>
                            <div className="flex items-center gap-2 mt-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                <span className="text-xs font-bold text-indigo-100/60 uppercase tracking-widest leading-none">Recursos Aplicados em Infraestrutura</span>
                            </div>
                        </div>
                    </div>

                    {/* Contagem Obras */}
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 group">
                        <div className="flex justify-between items-start mb-8">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total de Projetos</span>
                            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                                <FaHammer size={24} />
                            </div>
                        </div>
                        <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{loading ? "..." : obras.length}</div>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Obras Catalogadas</span>
                    </div>

                    {/* Em Andamento */}
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 group">
                        <div className="flex justify-between items-start mb-8">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Canteiros Ativos</span>
                            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-orange-600 group-hover:bg-orange-50 transition-all">
                                <FaHardHat size={24} />
                            </div>
                        </div>
                        <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{loading ? "..." : obrasEmAndamento}</div>
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Em Execução Direta</span>
                    </div>
                </motion.div>

                {/* Lista de Obras Premium */}
                <div className="space-y-12">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white rounded-[3rem] p-32 text-center border border-slate-100 shadow-inner"
                            >
                                <FaSpinner className="animate-spin text-blue-600 text-5xl mb-6 mx-auto" />
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Sincronizando cronogramas físicos...</h3>
                            </motion.div>
                        ) : obras.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[3rem] p-32 text-center border-2 border-dashed border-slate-100"
                            >
                                <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <FaMagnifyingGlass size={40} />
                                </div>
                                <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">Nenhuma obra localizada</h4>
                                <p className="text-slate-400 font-medium text-sm max-w-sm mx-auto italic">
                                    Tente ajustar os critérios de busca ou selecione outra categoria.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                variants={containerVariants}
                                className="grid grid-cols-1 gap-10"
                            >
                                {obras.map((o) => {
                                    const statusInfo = getStatusInfo(o.status);
                                    return (
                                        <motion.div 
                                            key={o.id} 
                                            variants={itemVariants}
                                            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col lg:flex-row group hover:shadow-blue-500/10 transition-all duration-700 hover:border-blue-100"
                                        >
                                            {/* Imagem / Capa */}
                                            <div className="lg:w-[400px] relative h-64 lg:h-auto overflow-hidden bg-slate-50 shrink-0">
                                                {o.imagem ? (
                                                    <Image 
                                                        src={o.imagem} 
                                                        alt={o.titulo} 
                                                        fill 
                                                        className="object-cover group-hover:scale-110 transition-transform duration-[1500ms] ease-out shadow-2xl" 
                                                    />
                                                ) : (
                                                    <div className="h-full flex items-center justify-center text-slate-200">
                                                        <FaImage size={64} className="opacity-50" />
                                                    </div>
                                                )}
                                                <div className="absolute top-6 left-6">
                                                    <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-xl border flex items-center gap-2 ${statusInfo.color}`}>
                                                        {statusInfo.icon} {statusInfo.label}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Conteúdo Detalhado */}
                                            <div className="p-8 lg:p-12 flex-1 flex flex-col relative">
                                                {/* Badge Overlay */}
                                                <div className="absolute top-4 right-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                                                    <FaHammer size={120} />
                                                </div>

                                                <div className="mb-0">
                                                    <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                                        <FaMapMarkerAlt size={12} /> {o.local}
                                                    </div>
                                                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter group-hover:text-blue-600 transition-colors mb-3 leading-none">{o.titulo}</h3>
                                                    <p className="text-slate-500 leading-relaxed font-bold italic text-sm mb-8 line-clamp-3">
                                                        "{o.descricao}"
                                                    </p>
                                                </div>

                                                {/* Bento Sub-grid para Detalhes */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8 border-y border-slate-50 mb-8">
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Investimento Total</p>
                                                        <p className="font-black text-slate-900 text-lg tracking-tighter leading-none">{fmt(o.valor)}</p>
                                                    </div>
                                                    <div className="lg:col-span-2">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Empresa Responsável</p>
                                                        <p className="font-black text-slate-700 text-xs uppercase tracking-tight flex items-center gap-2">
                                                            <FaBuilding className="text-slate-300" /> {o.empresa || "Licitação em Aberto"}
                                                        </p>
                                                    </div>
                                                    <div className="text-right sm:text-left">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Prazo Final</p>
                                                        <p className="font-black text-blue-600 text-sm tracking-tight flex items-center gap-2 justify-end sm:justify-start leading-none uppercase">
                                                            <FaCalendarAlt className="text-blue-200" /> {o.previsaoTermino ? new Date(o.previsaoTermino).toLocaleDateString("pt-BR") : "N/I"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Barra de Progresso Ultra Premium */}
                                                <div className="space-y-4 mb-8">
                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Evolução Física</span>
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-tighter">Medição técnica via SEINFRA</p>
                                                        </div>
                                                        <span className="text-2xl font-black text-blue-600 tabular-nums tracking-tighter">{o.percentual}%</span>
                                                    </div>
                                                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-[3px] shadow-inner group-hover:bg-slate-50 transition-colors">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${o.percentual}%` }}
                                                            transition={{ delay: 0.5, duration: 2, ease: "easeOut" }}
                                                            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-full shadow-[0_2px_10px_rgba(59,130,246,0.3)] relative"
                                                        >
                                                            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:24px_24px] animate-[progress-stripe_2s_linear_infinite]" />
                                                        </motion.div>
                                                    </div>
                                                </div>

                                                {/* Rodapé do Card */}
                                                <div className="flex flex-wrap items-center justify-between gap-6 mt-auto">
                                                    <div className="flex items-center gap-3">
                                                        <a 
                                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.local + ", Lajes Pintadas - RN")}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="h-12 flex items-center gap-3 px-6 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                                                        >
                                                            <FaMapMarkerAlt /> Localizar
                                                        </a>
                                                        <button className="h-12 flex items-center gap-3 px-6 bg-blue-50 text-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100/50 shadow-sm">
                                                            <FaImage /> Fotos da Obra
                                                        </button>
                                                    </div>
                                                    
                                                    <button className="group/btn text-slate-400 hover:text-blue-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 transition-colors">
                                                        Dashboard Detalhado 
                                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all transform group-hover/btn:translate-x-1">
                                                            <FaArrowRight size={12} />
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Banner de Conformidade */}
                <motion.div variants={itemVariants} className="mt-24">
                    <BannerPNTP />
                </motion.div>
            </motion.div>

            {/* Injeção de Animação CSS */}
            <style jsx global>{`
                @keyframes progress-stripe {
                    0% { background-position: 0 0; }
                    100% { background-position: 48px 0; }
                }
            `}</style>
        </div>
    );
}
