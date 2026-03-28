"use client";

import { useState, useEffect } from "react";
import { FaFilePdf, FaSearch, FaCalendarAlt, FaChartLine, FaFilter } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { motion, AnimatePresence } from "framer-motion";

type RelatorioFiscal = {
    id: string;
    titulo: string;
    tipo: string;
    periodo: string;
    ano: number;
    arquivo: string;
    dataPublicacao: string;
};

export default function LRFPage() {
    const [relatorios, setRelatorios] = useState<RelatorioFiscal[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [tabAtiva, setTabAtiva] = useState("TODOS");

    useEffect(() => {
        const fetchRelatorios = async () => {
            try {
                const res = await fetch("/api/admin/relatorios-fiscais");
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
    }, []);

    const filtered = relatorios.filter(r => {
        const matchesSearch = r.titulo.toLowerCase().includes(search.toLowerCase());
        const matchesTab = tabAtiva === "TODOS" || r.tipo === tabAtiva;
        return matchesSearch && matchesTab;
    });

    const anosDisponiveis = Array.from(new Set(relatorios.map(r => r.ano))).sort((a, b) => b - a);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Transparência Fiscal (LRF)"
                subtitle="Acesse os Relatórios Resumidos da Execução Orçamentária (RREO) e os Relatórios de Gestão Fiscal (RGF)."
                variant="premium"
                icon={<FaChartLine />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "LRF" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-6 py-12">
                
                {/* Intro e Filtros */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 mb-12 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Filtros de Pesquisa</h2>
                            <div className="relative group">
                                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Ex: RREO 1º Bimestre..."
                                    className="w-full pl-14 pr-8 py-5 bg-gray-50 border border-transparent rounded-[2rem] text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            {["TODOS", "RREO", "RGF", "OUTROS"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setTabAtiva(tab)}
                                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        tabAtiva === tab 
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105" 
                                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Listagem por Anos */}
                <div className="space-y-16">
                    {loading ? (
                        <div className="text-center py-20 font-bold text-gray-400">Carregando relatórios...</div>
                    ) : anosDisponiveis.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                           <p className="font-bold text-gray-400">Nenhum relatório publicado até o momento.</p>
                        </div>
                    ) : anosDisponiveis.map(ano => {
                        const relatoriosDoAno = filtered.filter(r => r.ano === ano);
                        if (relatoriosDoAno.length === 0) return null;

                        return (
                            <div key={ano} className="relative">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                                    <h3 className="text-3xl font-black text-gray-800 tracking-tighter italic">Exercício {ano}</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {relatoriosDoAno.map((r, idx) => (
                                        <motion.a
                                            key={r.id}
                                            href={r.arquivo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group bg-white p-8 rounded-[2rem] border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-2"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all shadow-inner">
                                                    <FaFilePdf size={24} />
                                                </div>
                                                <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-widest">{r.tipo}</span>
                                            </div>

                                            <div className="flex-1">
                                                <h4 className="font-black text-gray-800 text-base leading-tight uppercase tracking-tight group-hover:text-blue-600 transition-colors mb-2">
                                                    {r.titulo}
                                                </h4>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    <FaCalendarAlt className="text-amber-500" />
                                                    {r.periodo}
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                                                <span>Baixar Documento</span>
                                                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5 5 5-5M12 18V6"/></svg>
                                                </div>
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-24">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
