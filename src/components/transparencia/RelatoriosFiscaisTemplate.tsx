"use client";

import { useState, useEffect } from "react";
import { FaFilePdf, FaSearch, FaCalendarAlt, FaChartLine, FaDownload, FaFilter, FaFileExcel, FaFileCsv, FaFileCode } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { motion } from "framer-motion";
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
    tipo: string; // O tipo principal para o fetch inicial
    icon: React.ReactNode;
    breadcrumbLabel: string;
    showTabs?: string[]; // Se houver sub-categorias (ex: RREO, RGF)
}

export default function RelatoriosFiscaisTemplate({ title, subtitle, tipo, icon, breadcrumbLabel, showTabs }: Props) {
    const [relatorios, setRelatorios] = useState<RelatorioFiscal[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [tabAtiva, setTabAtiva] = useState(showTabs ? "TODOS" : tipo);

    useEffect(() => {
        const fetchRelatorios = async () => {
            try {
                // Se houver abas, buscamos todos os relatórios fiscais e filtramos no front
                // Caso contrário, buscamos apenas o tipo específico
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
        const matchesType = !showTabs || showTabs.includes(r.tipo) || r.tipo === tipo;
        return matchesSearch && matchesTab && (showTabs ? true : r.tipo === tipo);
    });

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

        const filename = `relatorios_${tipo.toLowerCase()}`;
        const exportTitle = `Relatórios de Transparência Fiscal - ${title} – Lajes Pintadas/RN`;

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
                
                {/* Intro e Filtros - Tela Toda */}
                <div className="bg-white rounded-[3rem] p-10 md:p-14 mb-14 shadow-2xl shadow-primary-900/5 border border-primary-50/50">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                        <div className="flex-1 space-y-5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-primary-900 uppercase tracking-tighter">Filtros & Exportação</h2>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleExport("pdf")} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"><FaFilePdf size={14}/></button>
                                    <button onClick={() => handleExport("xlsx")} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100"><FaFileExcel size={14}/></button>
                                    <button onClick={() => handleExport("csv")} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100"><FaFileCsv size={14}/></button>
                                    <button onClick={() => handleExport("json")} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-600 hover:text-white transition-all shadow-sm border border-gray-100"><FaFileCode size={14}/></button>
                                </div>
                            </div>
                            <div className="relative group">
                                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Pesquisar por título, ano ou período..."
                                    className="w-full pl-14 pr-8 py-4 bg-gray-50 border border-transparent rounded-2xl text-[11px] font-bold focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        {showTabs && (
                            <div className="flex flex-wrap gap-2">
                                {["TODOS", ...showTabs].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setTabAtiva(tab)}
                                        className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                            tabAtiva === tab 
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                                            : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

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
                        </div>
                    ) : anosDisponiveis.map(ano => {
                        const relatoriosDoAno = filtered.filter(r => r.ano === ano);
                        if (relatoriosDoAno.length === 0) return null;

                        return (
                            <div key={ano} className="relative">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-1 bg-blue-600 rounded-full"></div>
                                    <h3 className="text-2xl font-black text-gray-800 tracking-tighter italic">Exercício {ano}</h3>
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
                                            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col border-b-2 border-b-transparent hover:border-b-blue-600"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all shadow-inner">
                                                    <FaFilePdf size={18} />
                                                </div>
                                                <span className="text-[8px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 uppercase tracking-widest">{r.tipo}</span>
                                            </div>

                                            <div className="flex-1">
                                                <h4 className="font-black text-gray-800 text-[11px] leading-tight uppercase tracking-tight group-hover:text-blue-600 transition-colors mb-2 line-clamp-3">
                                                    {r.titulo}
                                                </h4>
                                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                    <FaCalendarAlt className="text-amber-500" />
                                                    {r.periodo}
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                                                <span>Visualizar</span>
                                                <FaDownload size={10} className="group-hover:translate-y-0.5 transition-transform" />
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-20">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
