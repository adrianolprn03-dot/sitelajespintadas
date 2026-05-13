"use client";

import { useState, useEffect } from "react";
import { 
    FaBriefcase, FaCalendarCheck, FaUserEdit, 
    FaCheckCircle, FaLock, FaArrowRight, FaSpinner,
    FaInfoCircle, FaFileContract, FaUserTie
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToPDF, exportToCSV, exportToJSON, exportToXLSX } from "@/lib/exportUtils";

interface Concurso {
    id: string;
    titulo: string;
    tipo: string;
    status: string;
    vagas: string | null;
    dataPublicacao: string;
    linkEdital: string | null;
    descricao: string | null;
}

export default function ConcursosClient({ 
    initialData, 
    typeFilter = "concurso",
    title = "Concursos e Seleções",
    subtitle = "Acompanhe os editais, convocações e resultados dos processos seletivos municipais.",
    specialBannerText
}: { 
    initialData: Concurso[], 
    typeFilter?: string,
    title?: string,
    subtitle?: string,
    specialBannerText?: string
}) {
    const [items, setItems] = useState<Concurso[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [year, setYear] = useState("TODOS");
    const [month, setMonth] = useState("");
    const [status, setStatus] = useState("TODOS");

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                q: search,
                year: year,
                month: month,
                type: typeFilter,
                status: status
            });
            const res = await fetch(`/api/concursos?${params.toString()}`);
            const data = await res.json();
            setItems(data.items || []);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [search, year, month, status]);

    const handleClear = () => {
        setSearch("");
        setYear("TODOS");
        setMonth("");
        setStatus("TODOS");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const dataToExport = items.map(i => ({
            "Título": i.titulo,
            "Tipo": i.tipo.toUpperCase(),
            "Status": i.status === 'aberto' ? 'Aberto' : 'Encerrado',
            "Vagas": i.vagas || 'N/A',
            "Data de Publicação": new Date(i.dataPublicacao).toLocaleDateString('pt-BR'),
        }));

        const filename = `${typeFilter}_${year}`;
        const exportTitle = `Portal da Transparência - ${title} (${year})`;

        if (format === "pdf") exportToPDF(dataToExport, filename, exportTitle);
        else if (format === "csv") exportToCSV(dataToExport, filename);
        else if (format === "json") exportToJSON(dataToExport, filename);
        else if (format === "xlsx") exportToXLSX(dataToExport, filename);
    };

    // Estatísticas para Bento Cards
    const stats = {
        total: items.length,
        abertos: items.filter(i => i.status === 'aberto').length,
        encerrados: items.filter(i => i.status !== 'aberto').length,
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title={title}
                subtitle={subtitle}
                variant="premium"
                icon={<FaBriefcase />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: title }
                ]}
            />

            <BannerPNTP />

            {specialBannerText && items.length === 0 && (
                <div className="max-w-[1240px] mx-auto px-6 pt-12">
                    <div className="bg-red-50 border-l-8 border-red-500 rounded-r-3xl p-8 flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 shadow-xl shadow-red-500/10 transition-all hover:bg-red-100">
                        <FaInfoCircle className="text-red-500 text-5xl shrink-0 drop-shadow-md" />
                        <div className="text-center md:text-left">
                            <h3 className="text-red-900 font-black text-xl uppercase tracking-tight mb-2">Comunicação Oficial</h3>
                            <p className="text-red-700 font-bold text-lg md:text-xl tracking-tight">
                                {specialBannerText}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                {/* Bento Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white flex items-center gap-6 group hover:border-blue-100 transition-all"
                    >
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FaBriefcase size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total de Editais</p>
                            <h3 className="text-3xl font-black text-gray-800 tracking-tighter">{stats.total}</h3>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white flex items-center gap-6 group hover:border-emerald-100 transition-all"
                    >
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FaCheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Inscrições Abertas</p>
                            <h3 className="text-3xl font-black text-gray-800 tracking-tighter">{stats.abertos}</h3>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white flex items-center gap-6 group hover:border-orange-100 transition-all"
                    >
                        <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FaLock size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Finalizados</p>
                            <h3 className="text-3xl font-black text-gray-800 tracking-tighter">{stats.encerrados}</h3>
                        </div>
                    </motion.div>
                </div>

                {/* Filtros */}
                <TransparencyFilters
                    searchValue={search}
                    onSearch={setSearch}
                    availableYears={["TODOS", "2026", "2025", "2024", "2023", "2022", "2021"]}
                    currentYear={year}
                    onYearChange={setYear}
                    currentMonth={month}
                    onMonthChange={setMonth}
                    hideMonthFilter={false}
                    onClear={handleClear}
                    onExport={handleExport}
                    placeholder="Buscar por título ou descrição..."
                >
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Situação:</span>
                        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                            {['TODOS', 'aberto', 'encerrado'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatus(s)}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                        status === s 
                                        ? "bg-white text-blue-600 shadow-sm" 
                                        : "text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    {s === 'TODOS' ? 'Todos' : s === 'aberto' ? 'Aberto' : 'Encerrado'}
                                </button>
                            ))}
                        </div>
                    </div>
                </TransparencyFilters>

                {/* Listagem */}
                <div className="grid grid-cols-1 gap-6 min-h-[400px] relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-[3rem]">
                            <div className="flex flex-col items-center gap-4">
                                <FaSpinner className="animate-spin text-blue-500" size={40} />
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Atualizando Dados...</p>
                            </div>
                        </div>
                    )}

                    {items.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200"
                        >
                           <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                               <FaBriefcase size={32} />
                           </div>
                           <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-2">Nenhum registro encontrado</h4>
                           <p className="text-gray-400 font-bold text-sm tracking-tight">Tente ajustar seus filtros ou buscar por outro termo.</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item, idx) => (
                                <motion.div 
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/40 border border-white hover:border-blue-100 transition-all group overflow-hidden relative"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                                        <div className="flex items-start gap-8">
                                            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center shadow-inner group-hover:bg-blue-100 transition-colors">
                                                <FaBriefcase size={28} className="text-blue-400 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                                        {item.tipo.toUpperCase()}
                                                    </span>
                                                    {item.status === 'aberto' ? (
                                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 animate-pulse shadow-sm">
                                                            Inscrições Abertas
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                                                            Finalizado
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {item.titulo}
                                                </h4>
                                                {item.descricao && (
                                                    <p className="text-sm font-medium text-gray-500 mb-4 line-clamp-3 leading-relaxed">
                                                        {item.descricao}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                        <FaCalendarCheck className="text-blue-500 text-sm" /> 
                                                        <span>Publicação: <span className="text-gray-800">{new Date(item.dataPublicacao).toLocaleDateString('pt-BR')}</span></span>
                                                    </div>
                                                    {item.vagas && (
                                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                            <FaUserEdit className="text-blue-500 text-sm" /> 
                                                            <span>Vagas: <span className="text-gray-800">{item.vagas}</span></span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 lg:shrink-0">
                                            {item.linkEdital ? (
                                                <a 
                                                    href={item.linkEdital} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 group/btn"
                                                >
                                                    Acessar Documentos
                                                    <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                                </a>
                                            ) : (
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100">
                                                    Edital Indisponível
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Decorative background element */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50/50 to-transparent -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
