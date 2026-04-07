"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { 
    FaCarSide, FaMagnifyingGlass, FaClockRotateLeft, 
    FaScrewdriverWrench, FaSquareCheck, FaTruckMonster,
    FaArrowRight, FaGasPump, FaCalendarDays, FaIdCardClip,
    FaFilter, FaFileExport, FaVanShuttle, FaTractor
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";

type Veiculo = {
    id: string;
    modelo: string;
    tipo: string;
    placa: string;
    ano: number;
    secretaria: string;
    status: string;
    ativo: boolean;
};

interface FrotaClientProps {
    initialVeiculos: Veiculo[];
}

export default function FrotaClient({ initialVeiculos }: FrotaClientProps) {
    const [busca, setBusca] = useState("");
    const [statusFiltro, setStatusFiltro] = useState("");
    const [secretariaFiltro, setSecretariaFiltro] = useState("");

    const veiculosFiltrados = initialVeiculos.filter(v => {
        const matchesBusca = v.modelo.toLowerCase().includes(busca.toLowerCase()) || 
                             v.placa.toLowerCase().includes(busca.toLowerCase());
        const matchesStatus = !statusFiltro || v.status === statusFiltro;
        const matchesSecretaria = !secretariaFiltro || v.secretaria === secretariaFiltro;
        return matchesBusca && matchesStatus && matchesSecretaria;
    });

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = veiculosFiltrados.map(v => ({
            "Equipamento": v.modelo,
            "Tipo": v.tipo,
            "Placa": v.placa,
            "Ano": v.ano,
            "Secretaria": v.secretaria,
            "Status": v.status === 'em-uso' ? 'Em Uso' : 'Em Manutenção'
        }));

        const filename = `frota_municipal_lajes_pintadas`;
        const title = `Inventário da Frota Municipal – Lajes Pintadas/RN`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const totalVeiculos = initialVeiculos.length;
    const emOperacao = initialVeiculos.filter(v => v.status === 'em-uso').length;
    const emManutencao = initialVeiculos.filter(v => v.status === 'manutencao').length;

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Frota Municipal"
                subtitle="Gestão e transparência sobre o patrimônio móvel, máquinas pesadas e equipamentos de transporte do município."
                variant="premium"
                icon={<FaCarSide />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Frota Municipal" }
                ]}
            />

            <main className="max-w-[1240px] mx-auto px-6 py-12 -mt-16 relative z-30">
                {/* Dashboard Bento Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {/* Main Stats Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-blue-500/5 border border-blue-100/50 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-600/30">
                                    <FaCarSide size={32} />
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Patrimônio Móvel</h3>
                                    <div className="text-4xl font-black text-gray-900 tracking-tighter mt-1">{totalVeiculos} Equipamentos</div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-auto">
                                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                    <FaSquareCheck /> Frota Ativa
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-slate-700 text-[10px] font-black uppercase tracking-widest border border-slate-100 font-mono">
                                    PNTP 2025 GOLD
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Operational Stats */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-emerald-100/50 hover:border-emerald-200 transition-all group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-30 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Em Operação</span>
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <FaSquareCheck size={20} />
                                </div>
                            </div>
                            <div className="mt-8">
                                <div className="text-4xl font-black text-gray-900 tracking-tighter">{emOperacao}</div>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Disponíveis</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Maintenance Stats */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group"
                    >
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -mr-16 blur-2xl group-hover:bg-white/10 transition-all duration-700" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Manutenção</span>
                                <div className="p-3 bg-white/10 text-white rounded-2xl group-hover:bg-amber-500 transition-all">
                                    <FaScrewdriverWrench size={20} />
                                </div>
                            </div>
                            <div className="mt-8">
                                <div className="text-4xl font-black text-white tracking-tighter">{emManutencao}</div>
                                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-1">Recuperação</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Filters Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-2 mb-12"
                >
                    <TransparencyFilters
                        searchValue={busca}
                        onSearch={setBusca}
                        currentYear=""
                        onYearChange={() => {}}
                        currentMonth=""
                        onMonthChange={() => {}}
                        onClear={() => { setBusca(""); setStatusFiltro(""); setSecretariaFiltro(""); }}
                        onExport={handleExport}
                        placeholder="Pesquisar por placa, modelo ou secretaria..."
                        hideYearFilter
                        hideMonthFilter
                    >
                        <div className="flex flex-wrap gap-3">
                            <select 
                                value={statusFiltro} 
                                onChange={(e) => setStatusFiltro(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none hover:border-blue-400 transition-all cursor-pointer"
                            >
                                <option value="">SITUAÇÃO (TODAS)</option>
                                <option value="em-uso">EM OPERAÇÃO</option>
                                <option value="manutencao">EM MANUTENÇÃO</option>
                            </select>
                        </div>
                    </TransparencyFilters>
                </motion.div>

                {/* Grid de Veículos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {veiculosFiltrados.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full bg-white rounded-[4rem] p-32 text-center border-4 border-dashed border-slate-100 group"
                            >
                                <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                    <FaMagnifyingGlass size={40} />
                                </div>
                                <h4 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-3">Nenhum veículo localizado</h4>
                                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest opacity-60 italic">Ajuste os critérios de busca para uma nova consulta.</p>
                            </motion.div>
                        ) : (
                            veiculosFiltrados.map((v, idx) => {
                                const isMaquina = v.tipo.toLowerCase().includes('maquina') || v.tipo.toLowerCase().includes('trator');
                                const isUtilidade = v.tipo.toLowerCase().includes('ambulancia') || v.tipo.toLowerCase().includes('van');
                                
                                return (
                                    <motion.div
                                        key={v.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05, duration: 0.5 }}
                                        whileHover={{ y: -8 }}
                                        className="group relative bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-100 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 flex flex-col overflow-hidden"
                                    >
                                        {/* Icon Area */}
                                        <div className="flex justify-between items-start mb-10">
                                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-inner transition-all duration-700 group-hover:scale-110 ${
                                                isMaquina ? 'bg-amber-50 text-amber-600' :
                                                isUtilidade ? 'bg-rose-50 text-rose-600' :
                                                'bg-blue-50 text-blue-600'
                                            } group-hover:bg-slate-900 group-hover:text-white`}>
                                                {isMaquina ? <FaTractor /> : isUtilidade ? <FaVanShuttle /> : <FaCarSide />}
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Exercicio</span>
                                                <span className="text-xs font-black text-slate-800 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 font-mono italic">
                                                    {v.ano}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="mb-10">
                                            <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2 group-hover:text-blue-600 transition-colors leading-none">
                                                {v.modelo}
                                            </h4>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                                                {v.tipo} • PLACA: <span className="font-mono text-slate-900">{v.placa}</span>
                                            </p>

                                            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 group-hover:bg-blue-50/30 group-hover:border-blue-100 transition-all duration-500">
                                                <div className="flex items-center gap-3 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                                                    <FaIdCardClip size={14} className="text-blue-500/50" />
                                                    {v.secretaria}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Interaction Footer */}
                                        <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                            {v.status === 'em-uso' ? (
                                                <div className="flex items-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] bg-emerald-50 px-5 py-2.5 rounded-2xl border border-emerald-100 shadow-sm shadow-emerald-500/5">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                    Em Operação
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 text-amber-600 font-black text-[10px] uppercase tracking-[0.2em] bg-amber-50 px-5 py-2.5 rounded-2xl border border-amber-100 shadow-sm shadow-amber-500/5">
                                                    <FaScrewdriverWrench className="animate-bounce" />
                                                    Manutenção
                                                </div>
                                            )}
                                            
                                            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:translate-x-1 transition-all">
                                                <FaArrowRight size={12} />
                                            </button>
                                        </div>

                                        {/* Decorative Background */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/30 rounded-full blur-3xl group-hover:bg-blue-600/5 transition-colors duration-700 -z-10" />
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Transparency Badge */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-32 pt-20 border-t border-slate-100 pb-32"
                >
                    <BannerPNTP />
                    
                    <div className="mt-20 space-y-6 text-center max-w-2xl mx-auto">
                        <div className="flex justify-center gap-2 mb-4">
                            {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-600/20" />)}
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] leading-relaxed">
                            INVENTÁRIO CONSOLIDADO DO PATRIMÔNIO MÓVEL <br/>
                            <span className="opacity-40">Lajes Pintadas/RN • Gestão Pública Transparente • LAI 12.527/2011</span>
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
