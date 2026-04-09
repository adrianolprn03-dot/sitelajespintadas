"use client";

import { useState, useEffect } from "react";
import { 
    FaFileContract, FaSpinner, FaHistory, FaCheckCircle, 
    FaExclamationTriangle, FaTimesCircle, FaBuilding, 
    FaWallet, FaArrowRight, FaRegCalendarAlt,
    FaBriefcase
} from "react-icons/fa";
import { 
    FaBuildingColumns, FaShieldHalved, FaMagnifyingGlass,
    FaArrowTrendUp, FaBolt, FaFileLines
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type Contrato = {
    id: string;
    numero: string;
    objeto: string;
    valor: number;
    fornecedor: string;
    dataInicio: string;
    dataFim: string;
    status: string;
    secretaria: string;
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

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
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
                {/* Highlight Section - Diamond Standard Bento */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch">
                    
                    {/* Primary Highlight Card - Valor Contratado Totals */}
                    <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden group border border-slate-800">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] -mr-40 -mt-40 group-hover:bg-orange-600/20 transition-all duration-700" />
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Comprometimento de Receita</span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <div className="flex items-center gap-2">
                                            <FaShieldHalved className="text-emerald-400" size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Fiscalização Ativa</span>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 mb-3 ml-1">Montante Contratual (Exercício)</h3>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-7xl font-black tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
                                        {loading ? <FaSpinner className="animate-spin text-4xl" /> : fmt(totalValor).split(',')[0]}
                                    </span>
                                    <span className="text-2xl font-black text-white/20">,{fmt(totalValor).split(',')[1]}</span>
                                </div>
                            </div>
                            
                            <div className="mt-16 flex flex-wrap gap-12 items-center border-t border-white/5 pt-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Ano Base</span>
                                    <span className="text-2xl font-black tracking-tight tracking-tighter italic">{ano}</span>
                                </div>
                                <div className="w-px h-12 bg-white/5 hidden md:block" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Instrumentos Firmados</span>
                                    <span className="text-2xl font-black tracking-tight uppercase italic text-orange-400">{contratos.length} <span className="text-white/40 font-bold tracking-tighter">Instrumentos</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Context Card */}
                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100/50 flex flex-col justify-between relative overflow-hidden group">
                         <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-orange-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                         <div className="relative">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-orange-600 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-inner group-hover:shadow-orange-600/40">
                                <FaFileContract className="text-orange-400 group-hover:text-white transition-colors" size={36} />
                            </div>
                            <h4 className="text-3xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-4 uppercase">
                                Contratos <br/> <span className="text-orange-600">& Aditivos</span>
                            </h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed opacity-80">
                                Gestão e acompanhamento das contratações públicas.
                            </p>
                         </div>
                         <div className="pt-10 border-t border-slate-50">
                             <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
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
                        currentYear={ano}
                        onYearChange={setAno}
                        currentMonth=""
                        onMonthChange={() => {}}
                        onClear={handleClearFilters}
                        onExport={handleExport}
                        placeholder="Pesquisar por objeto, fornecedor ou número do contrato..."
                    >
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-orange-600 transition-colors z-10">
                                    <FaBolt size={14} />
                                </div>
                                <select 
                                    value={status} 
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all appearance-none cursor-pointer hover:border-orange-400 min-w-[200px] shadow-inner"
                                >
                                    <option value="">TODOS OS STATUS</option>
                                    <option value="vigente">VIGENTE</option>
                                    <option value="finalizado">FINALIZADO</option>
                                    <option value="cancelado">CANCELADO</option>
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
                            <motion.div variants={containerVariants} className="grid grid-cols-1 gap-10">
                                {contratos.map((c, idx) => (
                                    <motion.div 
                                        key={c.id} 
                                        variants={itemVariants}
                                        className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden group hover:shadow-orange-500/10 transition-all duration-700 hover:border-orange-200 relative p-1 lg:p-1.5"
                                    >
                                        <div className="absolute top-10 right-10 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
                                            <FaFileLines size={200} />
                                        </div>

                                        <div className="p-10 lg:p-14">
                                            <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">
                                                {/* Contrato Info */}
                                                <div className="flex items-center gap-8">
                                                    <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-[2.25rem] flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-orange-600 group-hover:text-white group-hover:rotate-6 group-hover:scale-110 transition-all duration-700 shadow-inner">
                                                        <FaFileContract size={36} />
                                                    </div>
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-4 mb-3">
                                                            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-orange-700 transition-colors leading-none">Contrato Nº {c.numero}</h3>
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
                                                                <FaRegCalendarAlt size={14} /> Vigência: {new Date(c.dataInicio).toLocaleDateString("pt-BR")} — {new Date(c.dataFim).toLocaleDateString("pt-BR")}
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
                                                <button className="h-14 flex items-center gap-4 px-8 bg-white text-slate-500 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                                                    Termos Aditivos
                                                </button>
                                                <button className="h-14 flex items-center gap-4 px-10 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-2xl shadow-slate-900/20 group/btn active:scale-95">
                                                    <FaFileLines size={14} className="opacity-50 group-hover:opacity-100 group-hover:rotate-12 transition-all" />
                                                    Íntegra do Contrato 
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

                <motion.div variants={itemVariants} className="mt-24">
                    <BannerPNTP />
                    <div className="mt-20 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-[2] max-w-2xl mx-auto">
                            GESTÃO CONTRATUAL • PREFEITURA DE LAJES PINTADAS/RN <br/>
                            <span className="opacity-40 font-bold italic">Processamento eletrônico em conformidade com o PNTP e a Lei de Transparência.</span>
                        </p>
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
}
