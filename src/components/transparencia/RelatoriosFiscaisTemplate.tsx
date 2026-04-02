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
                const url = showTabs ? "/api/admin/relatorios-fiscais" : `/api/admin/relatorios-fiscais?tipo=${tipo}`;
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setRelatorios(data);
                }
            } catch (error) {
                console.error("Erro ao buscar relatórios:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRelatorios();
    }, [tipo, showTabs]);

    const filtered = relatorios.filter(r => {
        const matchesSearch = r.titulo.toLowerCase().includes(search.toLowerCase());
        const matchesTab = !showTabs || tabAtiva === "TODOS" || r.tipo === tabAtiva;
        const matchesAno = anoFiltro === null || r.ano === anoFiltro;
        return matchesSearch && matchesTab && matchesAno && (showTabs ? true : r.tipo === tipo);
    });

    // Anos disponíveis na base completa (antes do filtro de ano), para renderizar os botões
    const todosOsAnos = Array.from(
        new Set(
            relatorios
                .filter(r => {
                    const matchesSearch = r.titulo.toLowerCase().includes(search.toLowerCase());
                    const matchesTab = !showTabs || tabAtiva === "TODOS" || r.tipo === tabAtiva;
                    return matchesSearch && matchesTab && (showTabs ? true : r.tipo === tipo);
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
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
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

            <div className="w-full px-6 md:px-12 lg:px-20 py-12">

                {/* Painel de Filtros */}
                <div className="bg-white rounded-[3rem] p-10 md:p-14 mb-10 shadow-2xl shadow-primary-900/5 border border-primary-50/50">
                    <div className="flex flex-col gap-8">

                        {/* Linha 1: Título + Exportação */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FaFilter className="text-primary-500" size={14} />
                                <h2 className="text-xl font-black text-primary-900 uppercase tracking-tighter">Filtros & Exportação</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleExport("pdf")} title="Exportar PDF" className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"><FaFilePdf size={14}/></button>
                                <button onClick={() => handleExport("xlsx")} title="Exportar Excel" className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100"><FaFileExcel size={14}/></button>
                                <button onClick={() => handleExport("csv")} title="Exportar CSV" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100"><FaFileCsv size={14}/></button>
                                <button onClick={() => handleExport("json")} title="Exportar JSON" className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-600 hover:text-white transition-all shadow-sm border border-gray-100"><FaFileCode size={14}/></button>
                            </div>
                        </div>

                        {/* Linha 2: Busca Textual + Filtro Ano (Dropdown) */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Busca textual */}
                            <div className="relative group flex-1">
                                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Pesquisar por título, período..."
                                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-[11px] font-bold focus:bg-white focus:ring-4 focus:ring-primary-100 focus:border-primary-200 transition-all outline-none"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                                        <FaTimes size={12} />
                                    </button>
                                )}
                            </div>

                            {/* Dropdown de Ano */}
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                                <select
                                    value={anoFiltro ?? ""}
                                    onChange={(e) => setAnoFiltro(e.target.value ? Number(e.target.value) : null)}
                                    className="pl-10 pr-10 py-4 bg-gray-50 border border-transparent rounded-2xl text-[11px] font-black text-gray-700 focus:bg-white focus:ring-4 focus:ring-primary-100 focus:border-primary-200 transition-all outline-none cursor-pointer appearance-none min-w-[160px]"
                                >
                                    <option value="">Todos os Anos</option>
                                    {todosOsAnos.map(ano => (
                                        <option key={ano} value={ano}>{ano}</option>
                                    ))}
                                </select>
                                <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" width="10" height="6" viewBox="0 0 10 6" fill="none">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>

                        {/* Linha 3: Botões de Ano (Pills rápidas) */}
                        {!loading && todosOsAnos.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mr-2">Exercício:</span>
                                <button
                                    onClick={() => setAnoFiltro(null)}
                                    className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-200 border ${
                                        anoFiltro === null
                                            ? "bg-primary-900 text-white border-primary-900 shadow-lg shadow-primary-900/20"
                                            : "bg-white text-gray-400 border-gray-200 hover:border-primary-300 hover:text-primary-600"
                                    }`}
                                >
                                    Todos
                                </button>
                                {todosOsAnos.map(ano => (
                                    <button
                                        key={ano}
                                        onClick={() => setAnoFiltro(anoFiltro === ano ? null : ano)}
                                        className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-200 border ${
                                            anoFiltro === ano
                                                ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/30"
                                                : "bg-white text-gray-500 border-gray-200 hover:border-primary-300 hover:text-primary-600"
                                        }`}
                                    >
                                        {ano}
                                    </button>
                                ))}
                                {anoFiltro !== null && (
                                    <button
                                        onClick={() => setAnoFiltro(null)}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[9px] font-black text-red-400 bg-red-50 border border-red-100 hover:bg-red-100 transition-all"
                                    >
                                        <FaTimes size={8} /> Limpar
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Linha 4: Tabs de Sub-categoria (RREO, RGF, etc.) */}
                        {showTabs && (
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mr-2 self-center">Tipo:</span>
                                {["TODOS", ...showTabs].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setTabAtiva(tab)}
                                        className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                                            tabAtiva === tab
                                            ? "bg-primary-900 text-white border-primary-900 shadow-lg shadow-primary-900/20"
                                            : "bg-white text-gray-400 border-gray-200 hover:border-primary-300 hover:text-primary-600"
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Contador de resultados */}
                {!loading && (
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                {filtered.length} documento{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
                                {anoFiltro ? ` · Exercício ${anoFiltro}` : ""}
                            </span>
                        </div>
                        {(search || anoFiltro) && (
                            <button
                                onClick={() => { setSearch(""); setAnoFiltro(null); }}
                                className="flex items-center gap-2 text-[9px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                            >
                                <FaTimes size={10} /> Limpar filtros
                            </button>
                        )}
                    </div>
                )}

                {/* Listagem por Anos */}
                <div className="space-y-12">
                    {loading ? (
                        <div className="text-center py-20 font-black text-gray-400 uppercase tracking-widest text-[10px]">Carregando bases de dados...</div>
                    ) : anosDisponiveis.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                              <FaChartLine className="text-gray-200" size={32} />
                           </div>
                           <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-2">Nenhum registro encontrado</h4>
                           <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest italic leading-relaxed max-w-xs mx-auto">
                              Não existem publicações disponíveis para os critérios selecionados.
                           </p>
                           {(search || anoFiltro) && (
                               <button
                                   onClick={() => { setSearch(""); setAnoFiltro(null); }}
                                   className="mt-6 px-6 py-3 bg-primary-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all"
                               >
                                   Limpar Filtros
                               </button>
                           )}
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {anosDisponiveis.map(ano => {
                                const relatoriosDoAno = filtered.filter(r => r.ano === ano);
                                if (relatoriosDoAno.length === 0) return null;

                                return (
                                    <motion.div
                                        key={ano}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative"
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-10 h-1 bg-primary-600 rounded-full"></div>
                                            <h3 className="text-2xl font-black text-primary-900 tracking-tighter italic">Exercício {ano}</h3>
                                            <span className="text-[9px] font-black text-primary-500 bg-primary-50 px-3 py-1 rounded-full border border-primary-100 uppercase tracking-widest">
                                                {relatoriosDoAno.length} doc{relatoriosDoAno.length !== 1 ? "s" : ""}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {relatoriosDoAno.map((r, idx) => (
                                                <motion.a
                                                    key={r.id}
                                                    href={r.arquivo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col border-b-2 border-b-transparent hover:border-b-primary-600"
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all shadow-inner">
                                                            <FaFilePdf size={18} />
                                                        </div>
                                                        <span className="text-[8px] font-black text-primary-500 bg-primary-50 px-2 py-1 rounded-md border border-primary-100 uppercase tracking-widest">{r.tipo}</span>
                                                    </div>

                                                    <div className="flex-1">
                                                        <h4 className="font-black text-primary-900 text-[11px] leading-tight uppercase tracking-tight group-hover:text-primary-500 transition-colors mb-2 line-clamp-3">
                                                            {r.titulo}
                                                        </h4>
                                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                            <FaCalendarAlt className="text-secondary-500" />
                                                            {r.periodo}
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-primary-600 transition-colors">
                                                        <span>Visualizar</span>
                                                        <FaDownload size={10} className="group-hover:translate-y-0.5 transition-transform" />
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
