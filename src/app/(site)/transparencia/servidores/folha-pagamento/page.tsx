"use client";

import { useState, useEffect } from "react";
import { 
    FaSpinner, FaMoneyCheckAlt, FaBuilding, FaUserTie, 
    FaCheckCircle, FaWallet, FaSearch, FaArrowRight,
    FaArrowTrendUp, FaShieldHalved, FaClockRotateLeft,
    FaFilter, FaDownload, FaCircleCheck, FaMagnifyingGlass,
    FaBuildingColumns, FaUserGroup, FaCoins
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

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

    const totalBrutoValue = servidores.reduce((acc, curr) => acc + curr.totalBruto, 0);
    const totalLiquidoValue = servidores.reduce((acc, curr) => acc + curr.totalLiquido, 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Folha de Pagamento"
                subtitle="Consulta pública de remunerações, proventos e descontos dos agentes públicos municipais."
                variant="premium"
                icon={<FaMoneyCheckAlt />}
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
                className="max-width-[1240px] mx-auto px-6 py-12 -mt-16 relative z-30"
            >
                {/* Metrics Highlight - Diamond Standard Bento */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16 items-stretch">
                    
                    {/* Primary Highlight Card - Total Bruto */}
                    <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden group border border-slate-800">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-40 -mt-40 group-hover:bg-blue-600/20 transition-all duration-700" />
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Folha Auditada</span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <div className="flex items-center gap-2">
                                            <FaCircleCheck className="text-emerald-400" size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">LAI 12.527</span>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 mb-3 ml-1 text-balance">Volume Bruto Consolidado</h3>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-6xl font-black tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
                                        {loading ? <FaSpinner className="animate-spin text-4xl" /> : fmt(totalBrutoValue).split(',')[0]}
                                    </span>
                                    <span className="text-2xl font-black text-white/20">,{fmt(totalBrutoValue).split(',')[1]}</span>
                                </div>
                            </div>
                            
                            <div className="mt-16 flex flex-wrap gap-12 items-center border-t border-white/5 pt-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Exercício</span>
                                    <span className="text-2xl font-black tracking-tight">{mesesAbrev[Number(mes)-1]} / {ano}</span>
                                </div>
                                <div className="w-px h-12 bg-white/5 hidden md:block" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Servidores Na Base</span>
                                    <span className="text-2xl font-black tracking-tight text-white italic">{servidores.length} <span className="text-white/20 font-bold uppercase">Agentes</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Metrics - Liquido */}
                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100/50 flex flex-col justify-between relative overflow-hidden group">
                         <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                         <div className="relative">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-inner group-hover:shadow-emerald-600/40">
                                <FaCoins className="text-emerald-400 group-hover:text-white transition-colors" size={36} />
                            </div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed opacity-80 mb-2">
                                Total Líquido Pago
                            </h4>
                            <div className="text-3xl font-black text-slate-900 tracking-tighter mb-4 italic text-balance">
                                {fmt(totalLiquidoValue)}
                            </div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                Recursos efetivamente creditados <br/> aos servidores municipais.
                            </p>
                         </div>
                         <div className="pt-8 border-t border-slate-50">
                             <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                 <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">Folha Liquidada</span>
                             </div>
                         </div>
                    </div>

                    {/* Secondary Metrics - Context */}
                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100/50 flex flex-col justify-between relative overflow-hidden group">
                         <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                         <div className="relative">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-inner group-hover:shadow-blue-600/40">
                                <FaBuildingColumns className="text-blue-300 group-hover:text-white transition-colors" size={36} />
                            </div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed opacity-80 mb-2">
                                Transparência RH
                            </h4>
                            <div className="text-2xl font-black text-slate-900 tracking-tighter mb-4 uppercase leading-none">
                                Consulta <br/> Direta
                            </div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                Acesso individualizado <br/> e nominal dos vencimentos.
                            </p>
                         </div>
                         <div className="pt-8 border-t border-slate-50">
                             <div className="flex items-center gap-2">
                                 <FaShieldHalved className="text-blue-200" size={14} />
                                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Dados Auditados</span>
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
                        currentMonth={mes}
                        onMonthChange={setMes}
                        onClear={handleClearFilters}
                        onExport={handleExport}
                        placeholder="Pesquisar servidor por nome ou cargo funcional..."
                    >
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-blue-600 transition-colors z-10">
                                    <FaFilter size={14} />
                                </div>
                                <select 
                                    value={vinculoFiltro} 
                                    onChange={(e) => setVinculoFiltro(e.target.value)}
                                    className="pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all appearance-none cursor-pointer hover:border-blue-400 min-w-[200px] shadow-inner"
                                >
                                    <option value="">TODOS OS VÍNCULOS</option>
                                    <option value="efetivo">EFETIVO</option>
                                    <option value="comissionado">COMISSIONADO</option>
                                    <option value="contratado">CONTRATADO</option>
                                    <option value="estagiario">ESTAGIÁRIO</option>
                                    <option value="agente politico">AGENTE POLÍTICO</option>
                                </select>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-indigo-600 transition-colors z-10">
                                    <FaBuilding size={14} />
                                </div>
                                <select 
                                    value={secretariaFiltro} 
                                    onChange={(e) => setSecretariaFiltro(e.target.value)}
                                    className="pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white transition-all appearance-none cursor-pointer hover:border-indigo-400 min-w-[240px] shadow-inner"
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

                {/* Table Section */}
                <motion.div variants={itemVariants} className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden mb-12 relative min-h-[500px]">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-900 to-slate-900" />
                    
                    <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/50">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4">
                                <span className="w-1.5 h-8 bg-blue-600 rounded-full" />
                                Relação Nomimal de Vencimentos
                            </h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 ml-6">
                                Folha Atualizada • {mesesLabels[Number(mes)-1]} de {ano}
                            </p>
                        </div>
                        <div className="flex bg-white/80 backdrop-blur p-2 rounded-2xl border border-slate-200/50 shadow-sm">
                            <div className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Exibindo {servidores.length} Agentes</div>
                            <div className="px-6 py-3 text-[10px] font-black text-emerald-600 uppercase tracking-widest">Base Consolidada</div>
                        </div>
                    </div>

                    <div className="overflow-x-auto scrollbar-thin">
                        <AnimatePresence>
                            {loading && (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
                                >
                                    <div className="relative mb-8">
                                        <div className="w-24 h-24 border-8 border-slate-100 rounded-full" />
                                        <div className="absolute inset-0 border-8 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                        <FaUserTie className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-100" size={40} />
                                    </div>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Sincronizando Dados Funcionais</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Agente Público / Cargo</th>
                                    <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Secretaria / Lotação</th>
                                    <th className="px-10 py-8 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Vínculo</th>
                                    <th className="px-10 py-8 text-right text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Bruto</th>
                                    <th className="px-10 py-8 text-right text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Líquido (Base)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50/50">
                                {servidores.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-32 text-center">
                                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-all">
                                                <FaMagnifyingGlass className="text-slate-200 text-4xl" />
                                            </div>
                                            <h4 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-4">Nenhum registro localizado</h4>
                                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest opacity-60 italic mb-10 text-balance">Verifique o período consultado ou refine os critérios de filtragem.</p>
                                            <button onClick={handleClearFilters} className="px-10 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl active:scale-95">Resetar Filtros</button>
                                        </td>
                                    </tr>
                                ) : (
                                    servidores.map((s, idx) => (
                                        <motion.tr 
                                            key={s.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="group hover:bg-blue-50/30 transition-all duration-300 pointer-events-auto"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-600/30 transition-all duration-500">
                                                        <FaUserTie size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[14px] font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-700 transition-colors leading-none mb-1.5">{s.nome}</p>
                                                        <span className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest">{s.cargo}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-slate-100/50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                                                        <FaBuilding size={12} />
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.secretaria}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${vinculoCores[s.vinculo.toLowerCase()] || "bg-slate-50 text-slate-400 border-slate-100"}`}>
                                                    {s.vinculo}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <span className="text-[12px] font-black text-slate-400 line-through opacity-40 italic tracking-tighter">
                                                    {fmt(s.totalBruto)}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex flex-col items-end">
                                                    <p className="text-2xl font-black text-slate-950 tracking-tighter tabular-nums group-hover:text-emerald-600 transition-all duration-300 group-hover:scale-105">{fmt(s.totalLiquido)}</p>
                                                    <div className="flex items-center gap-2 mt-1 px-3 py-0.5 bg-emerald-50 rounded-lg border border-emerald-100 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                                        <FaCircleCheck className="text-emerald-500" size={10} />
                                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Quitado</span>
                                                    </div>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                            {!loading && servidores.length > 0 && (
                                <tfoot>
                                    <tr className="bg-slate-900 border-t border-slate-800 text-white">
                                        <td colSpan={3} className="px-10 py-10 text-[12px] font-black uppercase tracking-[0.4em] text-white/40 italic">Consolidado Mensal de Folha</td>
                                        <td className="px-10 py-10 text-right opacity-30 text-[11px] font-black line-through italic">{fmt(totalBrutoValue)}</td>
                                        <td className="px-10 py-10 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-4xl font-black text-emerald-400 tracking-tighter tabular-nums mb-1">{fmt(totalLiquidoValue)}</span>
                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Lajes Pintadas • Recursos Próprios</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </motion.div>

                {/* Footer Guide Section */}
                <motion.div variants={itemVariants} className="mt-20 flex flex-col md:flex-row justify-between items-center bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 gap-8">
                    <div className="flex items-center gap-6 text-center md:text-left">
                         <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center shadow-inner group transition-all hover:bg-blue-600 relative overflow-hidden shrink-0">
                            <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <FaClockRotateLeft className="text-slate-300 group-hover:text-white relative z-10 transition-colors" size={32} />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Ciclo de Atualização Mensal</span>
                            <span className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">Folha de Pagamento</span>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                         </div>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Relatórios Analíticos de Vencimentos</span>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                            <button onClick={() => handleExport("pdf")} className="group flex items-center gap-4 px-8 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-blue-600 shadow-lg shadow-slate-950/20 active:scale-95">
                                Exportar PDF <FaDownload size={12} className="group-hover:translate-y-1 transition-transform" />
                            </button>
                            <button onClick={() => handleExport("xlsx")} className="group flex items-center gap-4 px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-blue-50 hover:border-blue-200 shadow-sm active:scale-95">
                                Tabela Excel <FaDownload size={12} className="group-hover:translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-24">
                    <BannerPNTP />
                    <div className="mt-20 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-[2] max-w-2xl mx-auto">
                            GESTÃO DE RECURSOS HUMANOS • PREFEITURA DE LAJES PINTADAS/RN <br/>
                            <span className="opacity-40 font-bold italic">Base de dados sincronizada conforme as diretrizes do Tribunal de Contas do Estado.</span>
                        </p>
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
}
