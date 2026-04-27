"use client";

import { useState, useEffect } from "react";
import { 
    FaPlaneDeparture, FaSpinner, FaUserTie, FaMapMarkerAlt, 
    FaCalendarAlt, FaMoneyBillWave, FaBuilding, FaArrowRight, 
    FaInfoCircle, FaDownload
} from "react-icons/fa";
import { 
    FaMagnifyingGlass, FaSuitcaseRolling,
    FaCircleCheck, FaFilter, FaBuildingColumns,
    FaFileSignature
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import LegislacaoClient from "../legislacao/_LegislacaoClient";

type Diaria = {
    id: string;
    servidor: string;
    cargo: string;
    destino: string;
    motivo: string;
    dataInicio: string;
    dataFim: string;
    valor: number;
    valorUnitario: number;
    quantidadeDias: number;
    secretaria: string;
    mes: number;
    ano: number;
    portariaUrl?: string;
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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

const SECRETARIAS = [
    "Assistência Social",
    "Educação",
    "Gabinete do Prefeito",
    "Turismo, Esporte e Cultura",
    "Saúde",
    "Finanças e Controle",
    "Agricultura e Meio Ambiente",
    "Obras e Infraestrutura",
    "Comunicação e Imprensa",
    "Administração",
    "Procuradoria Jurídica",
];

const PER_PAGE = 20;

export default function DiariasPage() {
    const [diarias, setDiarias] = useState<Diaria[]>([]);
    const [total, setTotal] = useState(0);
    const [totalValorAPI, setTotalValorAPI] = useState(0);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState(""); // vazio = todos os meses
    const [secretaria, setSecretaria] = useState("");
    const [pagina, setPagina] = useState(1);

    useEffect(() => {
        setPagina(1); // resetar paginação ao mudar filtros
    }, [ano, mes, secretaria, busca]);

    useEffect(() => {
        const fetchDiarias = async () => {
            setLoading(true);
            try {
                const params: Record<string, string> = { ano, query: busca };
                if (mes) params.mes = mes;
                if (secretaria) params.secretaria = secretaria;
                const res = await fetch(`/api/diarias?${new URLSearchParams(params)}`);
                const data = await res.json();
                setDiarias(data.items || []);
                setTotal(data.total || 0);
                setTotalValorAPI(data.totalValor || 0);
            } catch (error) {
                console.error("Erro ao buscar diárias:", error);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchDiarias, 300);
        return () => clearTimeout(timer);
    }, [ano, mes, secretaria, busca]);

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setMes("");
        setSecretaria("");
        setPagina(1);
    };

    // Paginação client-side
    const totalPaginas = Math.ceil(diarias.length / PER_PAGE);
    const diariasPaginadas = diarias.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE);

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = diarias.map(d => ({
            "Servidor": d.servidor,
            "Cargo": d.cargo,
            "Destino": d.destino,
            "Motivo": d.motivo,
            "Período": `${new Date(d.dataInicio).toLocaleDateString("pt-BR")} a ${new Date(d.dataFim).toLocaleDateString("pt-BR")}`,
            "Qtd": d.quantidadeDias,
            "Valor": fmt(d.valor)
        }));

        const filename = `diarias_lajespintadas_${mes}_${ano}`;
        const title = `Relatório de Concessão de Diárias – Lajes Pintadas/RN (${mesesLabels[Number(mes)-1]} / ${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const totalValor = diarias.reduce((acc, curr) => acc + curr.valor, 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Diárias de Viagem"
                subtitle="Transparência sobre valores pagos para cobertura de despesas em missões oficiais."
                variant="premium"
                icon={<FaPlaneDeparture />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Diárias" }
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
                    
                    {/* Primary Highlight Card - Total Investido */}
                    <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden group border border-slate-800">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-40 -mt-40 group-hover:bg-blue-600/20 transition-all duration-700" />
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Missões Autorizadas</span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <div className="flex items-center gap-2">
                                            <FaCircleCheck className="text-emerald-400" size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Certificado PNTP</span>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 mb-3 ml-1">Volume de Desembolso</h3>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-7xl font-black tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
                                        {loading ? <FaSpinner className="animate-spin text-4xl" /> : fmt(totalValor).split(',')[0]}
                                    </span>
                                    <span className="text-2xl font-black text-white/20">,{fmt(totalValor).split(',')[1]}</span>
                                </div>
                            </div>
                            
                            <div className="mt-16 flex flex-wrap gap-12 items-center border-t border-white/5 pt-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Ano base</span>
                                    <span className="text-2xl font-black tracking-tight">{mes ? `${mesesAbrev[Number(mes)-1]} / ` : ''}{ano}</span>
                                </div>
                                <div className="w-px h-12 bg-white/5 hidden md:block" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Concessões Ativas</span>
                                    <span className="text-2xl font-black tracking-tight uppercase italic text-blue-400">{diarias.length} <span className="text-white/40 font-bold tracking-tighter">Diárias</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Context Card */}
                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100/50 flex flex-col justify-between relative overflow-hidden group">
                         <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                         <div className="relative">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-inner group-hover:shadow-blue-600/40">
                                <FaSuitcaseRolling className="text-blue-300 group-hover:text-white transition-colors" size={36} />
                            </div>
                            <h4 className="text-3xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-4 uppercase">
                                Missões <br/> <span className="text-blue-600">Oficiais</span>
                            </h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed opacity-80">
                                Controle de diárias pagas para serviço público externo.
                            </p>
                         </div>
                         <div className="pt-10 border-t border-slate-50">
                             <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base de Dados</span>
                                 </div>
                                 <FaCircleCheck className="text-emerald-500" />
                             </div>
                         </div>
                    </div>
                </motion.div>
                
                {/* PNTP Requirements Section - Regulation & Values Table */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Regulation Card */}
                    <a 
                        href="/uploads/diarias/regulamentacao.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50" />
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:rotate-6 transition-transform">
                                <FaFileSignature className="text-white text-2xl" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Regulamentação <span className="text-blue-600 not-italic">Municipal</span></h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Normativa e Decretos de Concessão</p>
                            </div>
                        </div>
                        <div className="mt-8 flex items-center justify-between">
                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em]">Acessar Documento</span>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <FaArrowRight size={10} />
                            </div>
                        </div>
                    </a>

                    {/* Values Table Card */}
                    <a 
                        href="/uploads/diarias/tabela-valores.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[5rem] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50" />
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:-rotate-6 transition-transform">
                                <FaMoneyBillWave className="text-white text-2xl" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Tabela de <span className="text-emerald-600 not-italic">Valores</span></h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Valores por Cargo e Destino</p>
                            </div>
                        </div>
                        <div className="mt-8 flex items-center justify-between">
                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.3em]">Acessar Tabela</span>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <FaArrowRight size={10} />
                            </div>
                        </div>
                    </a>
                </motion.div>

                {/* Filters Section */}
                <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-2 mb-12">
                    <TransparencyFilters
                        searchValue={busca}
                        onSearch={setBusca}
                        currentYear={ano}
                        onYearChange={setAno}
                        currentMonth={mes}
                        onMonthChange={setMes}
                        onClear={handleClearFilters}
                        onExport={handleExport}
                        placeholder="Pesquisar por servidor, destino ou motivo da missão..."
                    >
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-blue-600 transition-colors z-10">
                                    <FaFilter size={14} />
                                </div>
                                <select 
                                    value={secretaria} 
                                    onChange={(e) => setSecretaria(e.target.value)}
                                    className="pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all appearance-none cursor-pointer hover:border-blue-400 min-w-[240px] shadow-inner"
                                >
                                    <option value="">TODAS AS SECRETARIAS</option>
                                    {SECRETARIAS.map(s => (
                                        <option key={s} value={s}>{s.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </TransparencyFilters>
                </motion.div>

                {/* Main Content Area */}
                <div className="space-y-12">
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
                                    <FaPlaneDeparture className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-100" size={40} />
                                </div>
                                <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.5em] animate-pulse">Sincronizando Atos de Concessão</p>
                            </motion.div>
                        ) : diarias.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[3rem] p-32 text-center border-4 border-dashed border-slate-50 group hover:border-slate-100 transition-colors"
                            >
                                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-all duration-500">
                                    <FaMagnifyingGlass className="text-slate-200 text-4xl" />
                                </div>
                                <h4 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-4">Nenhuma diária localizada</h4>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest opacity-60 italic mb-10 text-balance">Verifique os filtros aplicados ou consulte outro período fiscal.</p>
                                <button onClick={handleClearFilters} className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl active:scale-95">Resetar Filtros</button>
                            </motion.div>
                        ) : (
                            <motion.div 
                                variants={containerVariants} 
                                className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden"
                            >
                                {/* Cabeçalho da Tabela */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Servidor / Cargo / Unidade</th>
                                                <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Destino / Motivo</th>
                                                <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Período</th>
                                                <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Qtd</th>
                                                <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Vlr. Unitário</th>
                                                <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {diariasPaginadas.map((d, idx) => (
                                                <motion.tr 
                                                    key={d.id}
                                                    variants={itemVariants}
                                                    className="group hover:bg-blue-50/30 transition-all duration-300 border-b border-slate-50 last:border-0"
                                                >
                                                    <td className="px-8 py-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                                                <FaUserTie size={18} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight mb-1">{d.servidor}</p>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.cargo}</span>
                                                                    <span className="inline-flex w-fit px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-blue-100">
                                                                        {d.secretaria}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-8 max-w-[250px]">
                                                        <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight mb-1 truncate">{d.destino}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold italic line-clamp-2 leading-relaxed mb-3">"{d.motivo}"</p>
                                                        <a 
                                                            href={d.portariaUrl || `/transparencia/diarias/portaria-${d.id}.pdf`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-slate-200 hover:border-blue-200"
                                                        >
                                                            <FaFileSignature size={10} /> Ver Portaria
                                                        </a>
                                                    </td>
                                                    <td className="px-8 py-8">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black text-slate-900 tracking-tight">{new Date(d.dataInicio).toLocaleDateString("pt-BR")}</span>
                                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">até {new Date(d.dataFim).toLocaleDateString("pt-BR")}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-8 text-center">
                                                        <span className="inline-flex items-center justify-center px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg">
                                                            {d.quantidadeDias}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-8 text-right">
                                                        <span className="text-[11px] font-bold text-slate-400 tracking-tight">
                                                            {fmt(d.valorUnitario || 0)}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-8 text-right">
                                                        <span className="text-sm font-black text-emerald-600 tracking-tight">
                                                            {fmt(d.valor)}
                                                        </span>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Rodapé da Tabela / Paginação */}
                                <div className="px-8 py-8 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                        Exibindo <span className="text-slate-800">{(pagina - 1) * PER_PAGE + 1}–{Math.min(pagina * PER_PAGE, diarias.length)}</span> de <span className="text-blue-600">{diarias.length}</span> resultados
                                    </p>
                                    
                                    {totalPaginas > 1 && (
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => setPagina(p => Math.max(1, p - 1))} 
                                                disabled={pagina === 1} 
                                                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-30 transition-all shadow-sm"
                                            >
                                                &larr;
                                            </button>
                                            
                                            {/* Paginação Inteligente (Simplificada para o exemplo) */}
                                            {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                                                const p = i + 1;
                                                return (
                                                    <button 
                                                        key={p} 
                                                        onClick={() => setPagina(p)} 
                                                        className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all border ${ p === pagina ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/20 shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400' }`}
                                                    >
                                                        {p}
                                                    </button>
                                                );
                                            })}

                                            <button 
                                                onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} 
                                                disabled={pagina === totalPaginas} 
                                                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-30 transition-all shadow-sm"
                                            >
                                                &rarr;
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Regulation Section */}
                <motion.div variants={itemVariants} className="mt-32 pt-24 border-t border-slate-100">
                    <div className="flex flex-col md:flex-row md:items-center gap-8 mb-16">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-900 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 shrink-0">
                            <FaCalendarAlt size={32} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-slate-950 uppercase tracking-tighter leading-none mb-3 italic">Atos Oficiais <span className="text-blue-600 font-bold not-italic">de Concessão</span></h2>
                            <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.4em] flex items-center gap-3">
                                <span className="w-3 h-1 bg-blue-600 rounded-full" /> Base Legal e Normativas de Missões Oficiais
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[4rem] p-4 lg:p-6 border border-slate-100 shadow-2xl shadow-slate-200/50">
                        <LegislacaoClient initialTipo="portaria_diaria" hideTipoFilter={true} />
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-24">
                    <BannerPNTP />
                    <div className="mt-20 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-[2] max-w-2xl mx-auto">
                            GESTÃO DE DIÁRIAS E PASSAGENS • PREFEITURA DE LAJES PINTADAS/RN <br/>
                            <span className="opacity-40 font-bold italic">Processamento eletrônico em conformidade com as recomendações do Ministério Público Estadual.</span>
                        </p>
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
}
