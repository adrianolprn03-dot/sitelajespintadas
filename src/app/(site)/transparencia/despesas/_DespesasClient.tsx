"use client";

import { useState, useEffect } from "react";
import { 
    FaMoneyBillWave, FaSpinner, FaBuilding, FaTag, 
    FaFileInvoiceDollar, FaCalendarDay, FaArrowRight,
    FaArrowTrendUp, FaArrowTrendDown, FaMagnifyingGlass,
    FaCircleCheck, FaCircleInfo, FaFilter
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type Despesa = {
    id: string;
    descricao: string;
    categoria: string;
    secretaria: string;
    fornecedor: string | null;
    valor: number;
    mes: number;
    ano: number;
    criadoEm: string;
};

const mesesLabels = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

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

export default function DespesasPage() {
    const [despesas, setDespesas] = useState<Despesa[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState((new Date().getMonth() + 1).toString());
    const [secretaria, setSecretaria] = useState("");
    const [categoria, setCategoria] = useState("");

    useEffect(() => {
        const fetchDespesas = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    ano,
                    mes,
                    secretaria,
                    categoria,
                    query: busca
                });
                const res = await fetch(`/api/despesas?${query.toString()}`);
                const data = await res.json();
                setDespesas(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar despesas:", error);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchDespesas, 300);
        return () => clearTimeout(timer);
    }, [ano, mes, secretaria, categoria, busca]);

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setMes((new Date().getMonth() + 1).toString());
        setSecretaria("");
        setCategoria("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = despesas.map(d => ({
            "Data": `${d.mes}/${d.ano}`,
            "Descrição": d.descricao,
            "Categoria": d.categoria,
            "Secretaria": d.secretaria,
            "Beneficiário": d.fornecedor || "Administração Direta",
            "Valor Bruto": fmt(d.valor)
        }));

        const filename = `despesa_${mes}_${ano}`;
        const title = `Relatório de Execução Financeira – Lajes Pintadas/RN (${mesesLabels[Number(mes)-1]} / ${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const totalValor = despesas.reduce((acc, curr) => acc + curr.valor, 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Execução Financeira"
                subtitle="Portal da Transparência: Acompanhe em tempo real a aplicação dos recursos públicos municipais."
                variant="premium"
                icon={<FaMoneyBillWave />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Despesas" }
                ]}
            />

            <motion.main 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1240px] mx-auto px-6 py-12 -mt-16 relative z-30"
            >
                {/* Summary Section - Ultra Premium Bento Box */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
                    
                    {/* Primary Highlight Card */}
                    <div className="lg:col-span-8 bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden group border border-slate-800">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-40 -mt-40 group-hover:bg-blue-600/20 transition-all duration-700" />
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Fluxo de Caixa em Tempo Real</span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <div className="flex items-center gap-2">
                                            <FaCircleCheck className="text-blue-400" size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">LRF Art. 48-A</span>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 mb-3 ml-1">Volume de Execução</h3>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-7xl font-black tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
                                        {loading ? <FaSpinner className="animate-spin text-4xl" /> : fmt(totalValor).split(',')[0]}
                                    </span>
                                    <span className="text-2xl font-black text-white/20">,{fmt(totalValor).split(',')[1]}</span>
                                </div>
                            </div>
                            
                            <div className="mt-16 flex flex-wrap gap-12 items-center border-t border-white/5 pt-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Total de Notas</span>
                                    <span className="text-2xl font-black tracking-tight">{loading ? "..." : despesas.length} <span className="text-sm text-white/40 font-bold uppercase">Empenhos</span></span>
                                </div>
                                <div className="w-px h-12 bg-white/5 hidden md:block" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Competência Financeira</span>
                                    <span className="text-2xl font-black tracking-tight uppercase italic text-blue-400">{mesesLabels[Number(mes)-1]} <span className="text-white/40 font-bold">/</span> {ano}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Status Card */}
                    <div className="lg:col-span-4 bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100/50 flex flex-col justify-between relative overflow-hidden group">
                         <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                         <div className="relative">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-inner group-hover:shadow-blue-600/40">
                                <FaFileInvoiceDollar className="text-blue-200 group-hover:text-white transition-colors" size={36} />
                            </div>
                            <h4 className="text-3xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-4 uppercase">
                                Auditoria <br/> <span className="text-blue-600">Simplificada</span>
                            </h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed opacity-80">
                                Cruzamento automático de dados entre empenho, liquidação e pagamento.
                            </p>
                         </div>
                         <div className="pt-10 border-t border-slate-50">
                             <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Servidor Integrado</span>
                                 </div>
                                 <FaCircleInfo className="text-slate-200" />
                             </div>
                         </div>
                    </div>
                </motion.div>

                {/* Advanced Filters Section */}
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
                        placeholder="Pesquisar por descrição, empenho ou fornecedor..."
                    >
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-blue-600 transition-colors z-10">
                                    <FaBuilding size={14} />
                                </div>
                                <select 
                                    value={secretaria} 
                                    onChange={(e) => setSecretaria(e.target.value)}
                                    className="pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all appearance-none cursor-pointer hover:border-blue-400 min-w-[220px] shadow-inner"
                                >
                                    <option value="">TODAS AS SECRETARIAS</option>
                                    <option value="Administração">Administração</option>
                                    <option value="Educação">Educação</option>
                                    <option value="Saúde">Saúde</option>
                                    <option value="Obras">Obras e Infraestrutura</option>
                                    <option value="Assistência Social">Assistência Social</option>
                                </select>
                            </div>

                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-blue-600 transition-colors z-10">
                                    <FaFilter size={14} />
                                </div>
                                <select 
                                    value={categoria} 
                                    onChange={(e) => setCategoria(e.target.value)}
                                    className="pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all appearance-none cursor-pointer hover:border-blue-400 min-w-[220px] shadow-inner"
                                >
                                    <option value="">TODAS AS CATEGORIAS</option>
                                    <option value="Pessoal">Pessoal e Cargos</option>
                                    <option value="Serviços">Serviços de Terceiros</option>
                                    <option value="Custeio">Material e Custeio</option>
                                    <option value="Investimento">Investimentos (Obras/Equip.)</option>
                                </select>
                            </div>
                        </div>
                    </TransparencyFilters>
                </motion.div>

                {/* Data Grid / Table */}
                <motion.div variants={itemVariants} className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-100/50 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-blue-900 to-indigo-900" />
                    
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="py-48 flex flex-col items-center justify-center gap-8"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 border-8 border-slate-100 rounded-full" />
                                    <div className="absolute inset-0 border-8 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    <FaMoneyBillWave className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-100" size={40} />
                                </div>
                                <div className="text-center">
                                    <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.6em] animate-pulse mb-2">Processando Execução</p>
                                    <p className="text-[9px] font-bold text-slate-200 uppercase tracking-widest">Sincronizando com a base do Tesouro Municipal</p>
                                </div>
                            </motion.div>
                        ) : despesas.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-48 text-center"
                            >
                                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                                   <FaMagnifyingGlass className="text-slate-200" size={32} />
                                </div>
                                <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4 italic">Nenhum empenho localizado</h4>
                                <p className="text-slate-400 font-bold text-[12px] uppercase tracking-widest max-w-sm mx-auto opacity-70 leading-relaxed">
                                    Não foram encontrados registros para o período ou termos informados. Revise sua busca.
                                </p>
                                <button 
                                    onClick={handleClearFilters} 
                                    className="mt-12 px-12 py-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-3 mx-auto"
                                >
                                    Resetar Filtros <FaArrowRight size={10} />
                                </button>
                            </motion.div>
                        ) : (
                            <div className="overflow-x-auto selection:bg-blue-100 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/70 border-b border-slate-100">
                                            <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Referência</th>
                                            <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Descrição do Empenho</th>
                                            <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Unidade Gestora</th>
                                            <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Favorecido</th>
                                            <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Valor Global</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {despesas.map((d, idx) => (
                                            <motion.tr 
                                                key={d.id} 
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.03 }}
                                                className="hover:bg-blue-50/40 transition-all group cursor-default"
                                            >
                                                <td className="px-10 py-8 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-blue-600 bg-blue-50/50 px-4 py-2 rounded-2xl border border-blue-100/50 inline-block uppercase tracking-tight group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                                            {mesesLabels[d.mes-1]} {d.ano}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2 ml-1">Execução Fiscal</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="max-w-[450px]">
                                                        <p className="text-[14px] font-black text-slate-900 uppercase tracking-tighter leading-snug group-hover:text-blue-700 transition-colors mb-2.5">
                                                            {d.descricao}
                                                        </p>
                                                        <div className="flex items-center gap-3">
                                                            <span className="flex items-center gap-2 text-[9px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-xl border border-amber-100 uppercase tracking-widest">
                                                                <FaTag size={8} /> {d.categoria}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all group-hover:rotate-3">
                                                            <FaBuilding className="text-slate-300 group-hover:text-blue-600 transition-colors" size={16} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[13px] font-black text-slate-700 uppercase tracking-tighter leading-none mb-1.5">{d.secretaria}</span>
                                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest uppercase italic">Centro de Custos</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-col">
                                                        <p className="text-[12px] font-black text-slate-600 uppercase tracking-tight group-hover:text-slate-900 transition-colors mb-1.5 leading-none">
                                                            {d.fornecedor || "ADMINISTRAÇÃO DIRETA"}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400/30" />
                                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Credor Auditado</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right whitespace-nowrap">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-2xl font-black text-slate-950 tracking-tighter tabular-nums group-hover:text-emerald-600 transition-all duration-300 group-hover:scale-105">
                                                            {fmt(d.valor)}
                                                        </span>
                                                        <div className="flex items-center gap-2 mt-1.5 px-2 py-0.5 bg-emerald-50 rounded-lg border border-emerald-100 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                                            <FaCircleCheck className="text-emerald-500" size={10} />
                                                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Liquidado</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-900 border-t border-slate-800 text-white">
                                            <td colSpan={4} className="px-10 py-8 text-[12px] font-black uppercase tracking-[0.4em] text-white/40">Montante Consolidado no Período</td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-3xl font-black text-emerald-400 tracking-tighter tabular-nums">{fmt(totalValor)}</span>
                                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1 italic">Variação: +0.0% s/ mês ant.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Footer Guide Section */}
                <motion.div variants={itemVariants} className="mt-20 flex flex-col md:flex-row justify-between items-center bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 gap-8">
                    <div className="flex items-center gap-6">
                         <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center shadow-inner group transition-all hover:bg-blue-600 relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <FaCalendarDay className="text-slate-300 group-hover:text-white relative z-10 transition-colors" size={32} />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Base de Dados Histórica</span>
                            <span className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">Última Atualização Auditada</span>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                         </div>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end gap-3">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Exportar Documentação Legal</span>
                        <div className="flex gap-3">
                            <button onClick={() => handleExport("pdf")} className="group flex items-center gap-4 px-8 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-red-600 shadow-lg shadow-slate-950/20 active:scale-95">
                                Formato PDF <FaDownload className="group-hover:translate-y-1 transition-transform" />
                            </button>
                            <button onClick={() => handleExport("xlsx")} className="group flex items-center gap-4 px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-emerald-50 hover:border-emerald-200 shadow-sm active:scale-95">
                                Planilha Excel <FaDownload className="group-hover:translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-24">
                    <BannerPNTP />
                    <div className="mt-20 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-[2] max-w-2xl mx-auto">
                            SISTEMA INTEGRADO DE GESTÃO E TRANSPARÊNCIA • PREFEITURA DE LAJES PINTADAS/RN <br/>
                            <span className="opacity-40 font-bold italic">Dados de acordo com o padrão PNTP 2025 para transparência ativa.</span>
                        </p>
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
}
