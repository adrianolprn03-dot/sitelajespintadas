"use client";

import { useState, useEffect } from "react";
import { 
    FaScaleBalanced, FaMagnifyingGlass, 
    FaCalendarDays, FaCircleInfo, FaCircleCheck, 
    FaFileLines
} from "react-icons/fa6";
import { 
    FaDownload, FaSpinner, FaFileContract, 
    FaChevronRight, FaArrowRight, FaFilter, FaChartPie 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";

type Documento = {
    id: string;
    titulo: string;
    tipo: string;
    arquivo: string;
    ano: number;
    tamanho: number;
};

const TIPO_DESCRICOES = {
    "PPA": "O Plano Plurianual define as diretrizes e metas da administração pública para um período de 4 anos.",
    "LDO": "A Lei de Diretrizes Orçamentárias orienta a elaboração da Lei Orçamentária Anual (LOA) do exercício seguinte.",
    "LOA": "A Lei Orçamentária Anual estima as receitas e fixa as despesas do governo para o ano seguinte."
};

const tipoCores: Record<string, string> = {
    "PPA": "bg-purple-50 text-purple-600 border-purple-100",
    "LDO": "bg-amber-50 text-amber-600 border-amber-100",
    "LOA": "bg-blue-50 text-blue-600 border-blue-100",
};

export default function OrcamentoPage() {
    const [docs, setDocs] = useState<Documento[]>([]);
    const [loading, setLoading] = useState(true);
    const [tipo, setTipo] = useState("");
    const [categoria, setCategoria] = useState("");
    const [ano, setAno] = useState("");
    const [busca, setBusca] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const legQuery = new URLSearchParams();
            if (ano) legQuery.append("ano", ano);
            if (tipo) legQuery.append("tipo", tipo.toUpperCase()); else legQuery.append("tipo", "LOA,LDO,PPA");
            if (categoria) legQuery.append("categoria", categoria);
            if (busca) legQuery.append("busca", busca);
            legQuery.append("limit", "100");

            const docQuery = new URLSearchParams();
            if (ano) docQuery.append("ano", ano);
            if (tipo) docQuery.append("tipo", tipo.toLowerCase()); else docQuery.append("tipo", "loa,ldo,ppa");

            const [legRes, docRes] = await Promise.all([
                fetch(`/api/legislacao?${legQuery.toString()}`),
                fetch(`/api/documentos?${docQuery.toString()}`)
            ]);
            
            const legData = legRes.ok ? await legRes.json() : { items: [] };
            const docData = docRes.ok ? await docRes.json() : [];

            let mappedDocs: Documento[] = [];

            if (legData && legData.items) {
                const mapped = legData.items.map((item: any) => ({
                    id: item.id,
                    titulo: item.ementa,
                    tipo: item.tipo.toUpperCase(),
                    arquivo: item.arquivo,
                    ano: item.ano,
                    tamanho: 0
                }));
                mappedDocs = [...mappedDocs, ...mapped];
            }

            if (Array.isArray(docData)) {
                const filteredDocs = busca
                    ? docData.filter((item: any) => 
                        item.titulo?.toLowerCase().includes(busca.toLowerCase()) || 
                        item.tipo?.toLowerCase().includes(busca.toLowerCase()))
                    : docData;

                const mappedDoc = filteredDocs.map((item: any) => ({
                    id: item.id,
                    titulo: item.titulo,
                    tipo: item.tipo.toUpperCase(),
                    arquivo: item.arquivo,
                    ano: item.ano || new Date(item.criadoEm).getFullYear(),
                    tamanho: item.tamanho || 0
                }));
                mappedDocs = [...mappedDocs, ...mappedDoc];
            }
            
            // Sort combined results by ano desc
            mappedDocs.sort((a, b) => b.ano - a.ano);
            
            setDocs(mappedDocs);
        } catch (error) {
            console.error("Erro ao buscar documentos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timer);
    }, [ano, tipo, categoria, busca]);

    const handleClearFilters = () => {
        setBusca("");
        setAno("");
        setTipo("");
        setCategoria("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = docs.map(d => ({
            "Instrumento": d.tipo,
            "Ano": d.ano,
            "Título": d.titulo
        }));
        const filename = `planejamento_orcamentario_lajes_pintadas`;
        const title = `Relatório de Planejamento e Orçamento – Lajes Pintadas/RN`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Planejamento e Orçamento"
                subtitle="Instrumentos que definem as prioridades e a aplicação dos recursos públicos municipais (LOA, LDO e PPA)."
                variant="premium"
                icon={<FaScaleBalanced />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Planejamento e Orçamento" }
                ]}
            />

            <main className="max-w-[1240px] mx-auto px-6 py-12 -mt-16 relative z-30">
                {/* Intro Bento Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-blue-500/5 border border-blue-100/50 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-4 uppercase">
                                Transparência <span className="text-blue-600">Fiscal</span>
                            </h2>
                            <p className="text-gray-500 leading-relaxed font-medium text-lg max-w-2xl mb-8">
                                Acesse os documentos oficiais que regem a vida financeira do nosso município, 
                                garantindo o controle social e a conformidade com a Lei de Responsabilidade Fiscal.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                    <FaCircleCheck /> LRF Compliant
                                </div>
                                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                    <FaCircleCheck /> PNTP Gold 2025
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group"
                    >
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -mr-16 blur-2xl" />
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <FaChartPie size={32} className="mb-6 text-blue-400 opacity-80" />
                                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Ciclo Orçamentário</h3>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                    Acompanhe o planejamento plurianual, as diretrizes e a execução anual do orçamento.
                                </p>
                            </div>
                            <Link 
                                href="/servicos/esic"
                                className="mt-8 flex items-center justify-between bg-white text-slate-900 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-blue-50 transition-all group/btn"
                            >
                                Solicitar LAI <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Filters Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-2 mb-12"
                >
                    <TransparencyFilters
                        searchValue={busca}
                        onSearch={setBusca}
                        currentYear={ano}
                        onYearChange={setAno}
                        currentMonth=""
                        onMonthChange={() => {}}
                        onClear={handleClearFilters}
                        onExport={handleExport}
                        placeholder="Pesquisar por lei, ano ou termos da ementa..."
                        hideMonthFilter
                    >
                        <div className="flex flex-wrap gap-3">
                            <select 
                                value={tipo} 
                                onChange={(e) => setTipo(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none hover:border-blue-400 transition-all cursor-pointer"
                            >
                                <option value="">TODOS OS INSTRUMENTOS</option>
                                <option value="loa">LOA - EXCECUÇÃO ANUAL</option>
                                <option value="ldo">LDO - DIRETRIZES</option>
                                <option value="ppa">PPA - PLURIANUAL</option>
                            </select>
                        </div>
                    </TransparencyFilters>
                </motion.div>

                {/* Grid de Documentos */}
                <div className="space-y-6 min-h-[400px]">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col justify-center items-center py-40 gap-6"
                            >
                                <FaSpinner className="animate-spin text-blue-600 text-5xl" />
                                <p className="font-black text-slate-300 text-[10px] uppercase tracking-[0.4em]">Sincronizando Base Orçamentária...</p>
                            </motion.div>
                        ) : docs.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[3.5rem] border-4 border-dashed border-slate-100 p-24 text-center group"
                            >
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-slate-50 text-slate-200 mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                    <FaMagnifyingGlass size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-3">Nenhum registro localizado</h3>
                                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest opacity-60 italic">Tente ajustar os filtros para uma nova consulta.</p>
                                <button 
                                    onClick={handleClearFilters}
                                    className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                                >
                                    Resetar Filtros
                                </button>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {docs.map((d, idx) => {
                                    const corEstilo = tipoCores[d.tipo] || "bg-slate-50 text-slate-600 border-slate-100";
                                    return (
                                        <motion.div 
                                            key={d.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.04, duration: 0.5 }}
                                            className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 overflow-hidden"
                                        >
                                            {/* Left Icon Area */}
                                            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shrink-0 border-2 transition-all duration-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 shadow-sm ${corEstilo}`}>
                                                <FaFileContract size={36} className="group-hover:scale-110 transition-transform duration-700" />
                                            </div>

                                            {/* Central Content */}
                                            <div className="flex-1 text-center md:text-left">
                                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-4">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${corEstilo}`}>
                                                        {d.tipo}
                                                    </span>
                                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest shadow-inner group-hover:bg-white transition-colors">
                                                        <FaCalendarDays size={12} className="text-blue-500/50" /> Exercício {d.ano}
                                                    </div>
                                                </div>
                                                <h3 className="font-black text-slate-900 text-2xl uppercase tracking-tighter group-hover:text-blue-600 transition-colors mb-4 leading-none">
                                                    {d.titulo}
                                                </h3>
                                                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 group-hover:bg-blue-50/30 group-hover:border-blue-100 transition-all duration-500">
                                                    <p className="text-slate-500 text-sm leading-relaxed font-bold italic opacity-90 group-hover:opacity-100 transition-opacity">
                                                        {TIPO_DESCRICOES[d.tipo as keyof typeof TIPO_DESCRICOES] || "Instrumento de planejamento orçamentário municipal."}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Actions Area */}
                                            <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto">
                                                <a 
                                                    href={d.arquivo} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-3 bg-slate-900 text-white hover:bg-blue-600 px-8 py-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:shadow-blue-600/30 active:scale-95"
                                                >
                                                    <FaDownload size={14} /> Arquivo Integral
                                                </a>
                                                <button className="flex items-center justify-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:translate-x-2 transition-all p-2 group/btn">
                                                    Ver Detalhes <FaArrowRight className="group-hover/btn:translate-x-1" size={10} />
                                                </button>
                                            </div>

                                            {/* Decorative Elements */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors duration-700 -z-10" />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Info Guide Section */}
                <div className="mt-32 pt-20 border-t border-slate-100">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Guia Informativo</span>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">Ciclo de <span className="text-blue-600">Planejamento</span></h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {Object.entries(TIPO_DESCRICOES).map(([key, desc], idx) => (
                            <div key={key} className="bg-white rounded-[3rem] p-10 border border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors" />
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-8 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-blue-500/20 transition-all duration-500">
                                        <FaFileLines size={24} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-3">
                                        <span className="text-blue-600">{idx + 1}.</span> {key}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed italic">"{desc}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Banner PNTP */}
                <div className="mt-32">
                    <BannerPNTP />
                    
                    <div className="mt-20 space-y-6 text-center max-w-2xl mx-auto">
                        <div className="flex justify-center gap-2 mb-4">
                            {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-600/20" />)}
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] leading-relaxed">
                            LEI DE RESPONSABILIDADE FISCAL • LC 101/2000 <br/>
                            <span className="opacity-40">Lajes Pintadas/RN • Planejamento e Gestão de Resultados</span>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

import Link from "next/link";
