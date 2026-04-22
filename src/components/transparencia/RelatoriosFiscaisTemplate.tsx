"use client";

import { useState, useEffect } from "react";
import { FaFilePdf, FaSearch, FaCalendarAlt, FaChartLine, FaDownload, FaFilter, FaFileExcel, FaFileCsv, FaFileCode, FaTimes } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { motion, AnimatePresence } from "framer-motion";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";

type RelatorioFiscal = {
    id: string;
    titulo: string;
    tipo: string;
    periodo: string;
    ano: number;
    arquivo: string;
    dataPublicacao: string;
};

interface Props {
    title: string;
    subtitle: string;
    tipo: string;
    icon: React.ReactNode;
    breadcrumbLabel: string;
    showTabs?: string[];
}

export default function RelatoriosFiscaisTemplate({ title, subtitle, tipo, icon, breadcrumbLabel, showTabs }: Props) {
    const [relatorios, setRelatorios] = useState<RelatorioFiscal[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [tabAtiva, setTabAtiva] = useState(showTabs ? "TODOS" : tipo);
    const [anoFiltro, setAnoFiltro] = useState<number | null>(null);

    useEffect(() => {
        const fetchRelatorios = async () => {
            try {
                setLoading(true);
                const urls = [
                    showTabs ? "/api/admin/relatorios-fiscais" : `/api/admin/relatorios-fiscais?tipo=${tipo}`
                ];

                const hasBudget = showTabs?.some(t => ["LOA", "LDO", "PPA"].includes(t));
                if (hasBudget) {
                    urls.push("/api/legislacao?tipo=LOA,LDO,PPA&limit=200");
                }
                
                const docTypes = showTabs ? showTabs.map(t => t.toLowerCase()).join(",") : tipo.toLowerCase();
                urls.push(`/api/documentos?tipo=${docTypes}`);

                const responses = await Promise.all(urls.map(url => fetch(url)));
                const dataSets = await Promise.all(responses.map(res => res.ok ? res.json() : []));

                let combinedRecords: RelatorioFiscal[] = [];

                if (dataSets[0]) {
                    combinedRecords = [...(Array.isArray(dataSets[0]) ? dataSets[0] : [])];
                }

                if (hasBudget && dataSets[1] && dataSets[1].items) {
                    const mappedBudget: RelatorioFiscal[] = dataSets[1].items.map((item: any) => ({
                        id: item.id,
                        titulo: item.ementa,
                        tipo: item.tipo,
                        periodo: "Instrumento de Planejamento",
                        ano: item.ano,
                        arquivo: item.arquivo || "",
                        dataPublicacao: item.criadoEm
                    }));
                    combinedRecords = [...combinedRecords, ...mappedBudget];
                }

                const docIndex = hasBudget ? 2 : 1;
                if (dataSets[docIndex]) {
                    const mappedDocs: RelatorioFiscal[] = (Array.isArray(dataSets[docIndex]) ? dataSets[docIndex] : []).map((item: any) => ({
                        id: item.id,
                        titulo: item.titulo,
                        tipo: item.tipo.toUpperCase(),
                        periodo: "Documento",
                        ano: item.ano || new Date(item.criadoEm).getFullYear(),
                        arquivo: item.arquivo || "",
                        dataPublicacao: item.criadoEm
                    }));
                    combinedRecords = [...combinedRecords, ...mappedDocs];
                }

                // Remove duplicates if any (based on ID or exact title if needed), but for now we just append
                setRelatorios(combinedRecords);
            } catch (error) {
                console.error("Erro ao buscar relatórios:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRelatorios();
    }, [tipo, showTabs]);

    const filtered = relatorios.filter(r => {
        const matchesSearch = r.titulo.toLowerCase().includes(search.toLowerCase()) || 
                             r.periodo.toLowerCase().includes(search.toLowerCase());
        const matchesTab = !showTabs || tabAtiva === "TODOS" || r.tipo === tabAtiva;
        const matchesAno = anoFiltro === null || r.ano === anoFiltro;
        return matchesSearch && matchesTab && matchesAno && (showTabs ? true : r.tipo === tipo);
    });

    const todosOsAnos = Array.from(
        new Set(
            relatorios
                .filter(r => {
                    const matchesTab = !showTabs || tabAtiva === "TODOS" || r.tipo === tabAtiva;
                    return matchesTab && (showTabs ? true : r.tipo === tipo);
                })
                .map(r => r.ano)
        )
    ).sort((a, b) => b - a);

    const anosDisponiveis = Array.from(new Set(filtered.map(r => r.ano))).sort((a, b) => b - a);

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = filtered.map(r => ({
            "Título": r.titulo,
            "Tipo": r.tipo,
            "Período": r.periodo,
            "Ano": r.ano,
            "Data de Publicação": new Date(r.dataPublicacao).toLocaleDateString("pt-BR"),
            "Link": r.arquivo
        }));

        const filename = `relatorios_${tipo.toLowerCase()}${anoFiltro ? `_${anoFiltro}` : ""}`;
        const exportTitle = `Relatórios de Transparência Fiscal - ${title}${anoFiltro ? ` (${anoFiltro})` : ""} – Lajes Pintadas/RN`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, exportTitle);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 font-['Montserrat',sans-serif]">
            <PageHeader
                title={title}
                subtitle={subtitle}
                variant="premium"
                icon={icon}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: breadcrumbLabel }
                ]}
            />

            <div className="w-full px-4 md:px-10 lg:px-20 py-10">
                
                {/* Dashboard Header - Mobile Responsive Wrapper */}
                <div className="flex flex-col lg:flex-row gap-6 mb-10 items-stretch">
                    
                    {/* Primary Filter Box */}
                    <div className="flex-1 bg-white/70 backdrop-blur-3xl rounded-[2.5rem] p-8 shadow-xl shadow-primary-900/5 border border-white/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl opacity-30 -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-700" />
                        
                        <div className="relative flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 bg-primary-100/50 rounded-xl flex items-center justify-center">
                                        <FaFilter className="text-primary-600" size={12} />
                                    </div>
                                    <h2 className="text-sm font-black text-primary-900 uppercase tracking-widest">Controles de Busca</h2>
                                </div>
                                <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-xl border border-gray-100">
                                    {[
                                        { id: 'pdf', icon: <FaFilePdf />, color: 'text-red-500', hover: 'hover:bg-red-500' },
                                        { id: 'xlsx', icon: <FaFileExcel />, color: 'text-emerald-500', hover: 'hover:bg-emerald-500' },
                                        { id: 'csv', icon: <FaFileCsv />, color: 'text-blue-500', hover: 'hover:bg-blue-500' }
                                    ].map(tool => (
                                        <button 
                                            key={tool.id}
                                            onClick={() => handleExport(tool.id as any)}
                                            className={`p-2.5 ${tool.color} rounded-lg transition-all border border-transparent hover:border-current hover:text-white ${tool.hover} shadow-sm active:scale-95`}
                                        >
                                            {tool.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1 group">
                                    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-300 group-focus-within:text-primary-600 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Filtrar por título ou período..."
                                        className="w-full pl-12 pr-6 py-4.5 bg-slate-50/50 border border-transparent rounded-[1.5rem] text-[12px] font-bold text-slate-700 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-primary-600/5 focus:border-primary-200 transition-all outline-none"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>

                                <div className="relative w-full md:w-48">
                                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300 pointer-events-none" />
                                    <select
                                        value={anoFiltro ?? ""}
                                        onChange={(e) => setAnoFiltro(e.target.value ? Number(e.target.value) : null)}
                                        className="w-full pl-10 pr-10 py-4.5 bg-slate-50/50 border border-transparent rounded-[1.5rem] text-[11px] font-black text-slate-600 focus:bg-white focus:ring-4 focus:ring-primary-600/5 transition-all outline-none cursor-pointer appearance-none"
                                    >
                                        <option value="">Exibir Tudo</option>
                                        {todosOsAnos.map(ano => (
                                            <option key={ano} value={ano}>Exercício {ano}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary-300">
                                        <ChevronDown />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Filter: Quick Stats / Active Filter Info */}
                    <div className="lg:w-80 bg-primary-900 rounded-[2.5rem] p-8 shadow-2xl shadow-primary-900/20 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mb-20 -mr-20" />
                        
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Documentos Base</span>
                            <div className="text-4xl font-black tracking-tight mt-1 mb-8">{filtered.length}</div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Status: Integrado Siconfi</span>
                            </div>
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-[8px] font-bold text-white/40 leading-relaxed uppercase tracking-wider">
                                    Base de dados atualizada conforme normativas da STN e PNTP 2025.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories Tabs */}
                {showTabs && (
                    <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
                        {["TODOS", ...showTabs].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setTabAtiva(tab)}
                                className={`px-8 py-3.5 rounded-2xl text-[9.5px] font-black uppercase tracking-widest transition-all border shrink-0 ${
                                    tabAtiva === tab
                                    ? "bg-primary-600 text-white border-primary-600 shadow-xl shadow-primary-600/20 active:scale-95"
                                    : "bg-white text-slate-400 border-slate-100 hover:border-primary-200 hover:text-primary-600 hover:shadow-lg"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                )}

                {/* Listagem Grid */}
                <div className="space-y-16">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <FaSpinner className="animate-spin text-primary-200" size={24} />
                            </div>
                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Sincronizando Dados</div>
                        </div>
                    ) : anosDisponiveis.length === 0 ? (
                        <div className="text-center py-24 bg-white/50 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-slate-200 relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent pointer-events-none" />
                           <div className="relative z-10">
                               <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary-900/5">
                                  <FaChartLine className="text-primary-200" size={40} />
                               </div>
                               <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Nenhuma Publicação</h4>
                               <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-sm mx-auto opacity-70">
                                  Não localizamos documentos para os critérios definidos neste período.
                               </p>
                               {(search || anoFiltro) && (
                                   <button
                                       onClick={() => { setSearch(""); setAnoFiltro(null); }}
                                       className="mt-8 px-10 py-4 bg-primary-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 active:scale-95"
                                   >
                                       Resetar Busca
                                   </button>
                               )}
                           </div>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {anosDisponiveis.map(ano => {
                                const relatoriosDoAno = filtered.filter(r => r.ano === ano);
                                return (
                                    <motion.div
                                        key={ano}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="relative"
                                    >
                                        <div className="flex items-center gap-6 mb-10">
                                            <div className="flex flex-col">
                                                <h3 className="text-4xl font-black text-primary-900 tracking-tighter italic leading-none">{ano}</h3>
                                                <div className="w-full h-1.5 bg-primary-600 rounded-full mt-2" />
                                            </div>
                                            <div className="flex-1 h-px bg-slate-200/50" />
                                            <div className="text-[9px] font-black text-primary-500 bg-primary-50 px-5 py-2 rounded-full border border-primary-100 uppercase tracking-[0.2em] shadow-sm">
                                                {relatoriosDoAno.length} Documentos
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                            {relatoriosDoAno.map((r, idx) => (
                                                <motion.a
                                                    key={r.id}
                                                    href={r.arquivo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="group relative bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary-600/10 transition-all duration-700 flex flex-col h-full active:scale-[0.98]"
                                                >
                                                    {/* Card Glow Effect */}
                                                    <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/[0.02] rounded-[2.5rem] transition-colors duration-700 pointer-events-none" />
                                                    
                                                    <div className="flex justify-between items-start mb-6 relative">
                                                        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-lg group-hover:shadow-red-500/20 group-hover:-rotate-6">
                                                            <FaFilePdf size={24} />
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            <span className="text-[8px] font-black text-primary-500 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-100 uppercase tracking-widest">{r.tipo}</span>
                                                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em]">Ref. Interna</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 relative">
                                                        <h4 className="font-black text-primary-950 text-[13px] leading-snug uppercase tracking-tight group-hover:text-primary-600 transition-colors mb-4 line-clamp-3">
                                                            {r.titulo}
                                                        </h4>
                                                        
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-all">
                                                                <FaCalendarAlt className="text-secondary-500 opacity-60" size={10} />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">Vigência / Período</span>
                                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight mt-1">{r.periodo}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-black text-slate-400 group-hover:text-primary-600 transition-all relative">
                                                        <span className="uppercase tracking-[0.2em]">Acessar Relatório</span>
                                                        <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all">
                                                            <FaArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                                                        </div>
                                                    </div>
                                                </motion.a>
                                            ))}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>

                <div className="mt-20">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}

const ChevronDown = () => (
    <svg width="10" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="inline ml-1.5 opacity-60">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const FaArrowRight = ({ size, className }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
        <path d="M5 12h14m-7-7 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const FaSpinner = ({ size, className }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

