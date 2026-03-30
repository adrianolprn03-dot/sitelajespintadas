"use client";
import { FaSearch, FaFilter, FaTimes, FaDownload, FaFilePdf, FaFileCsv, FaFileCode } from "react-icons/fa";
import { useState } from "react";

interface TransparencyFiltersProps {
    onSearch: (query: string) => void;
    onYearChange: (year: string) => void;
    onMonthChange: (month: string) => void;
    onClear: () => void;
    onExport: (format: "pdf" | "csv" | "json") => void;
    availableYears?: string[];
    currentYear: string;
    currentMonth: string;
    searchValue: string;
    placeholder?: string;
    children?: React.ReactNode;
}

export default function TransparencyFilters({
    onSearch,
    onYearChange,
    onMonthChange,
    onClear,
    onExport,
    availableYears = ["2024", "2023", "2022", "2021"],
    currentYear,
    currentMonth,
    searchValue,
    placeholder = "Pesquisar nos resultados...",
    children
}: TransparencyFiltersProps) {
    const [showExport, setShowExport] = useState(false);

    const meses = [
        { v: "", l: "Todos os Meses" },
        { v: "1", l: "Janeiro" }, { v: "2", l: "Fevereiro" }, { v: "3", l: "Março" },
        { v: "4", l: "Abril" }, { v: "5", l: "Maio" }, { v: "6", l: "Junho" },
        { v: "7", l: "Julho" }, { v: "8", l: "Agosto" }, { v: "9", l: "Setembro" },
        { v: "10", l: "Outubro" }, { v: "11", l: "Novembro" }, { v: "12", l: "Dezembro" },
    ];

    return (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-10 relative z-40">
            <div className="flex flex-wrap items-end gap-6">
                {/* Busca Textual */}
                <div className="flex-1 min-w-[300px]">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Busca Textual</label>
                    <div className="relative group">
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearch(e.target.value)}
                            placeholder={placeholder}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-100 transition-all font-bold text-slate-700 placeholder:text-slate-300 outline-none"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-end gap-4 w-full lg:w-auto">
                    {/* Filtro de Ano */}
                    <div className="w-full sm:w-32">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Exercício</label>
                        <select
                            value={currentYear}
                            onChange={(e) => onYearChange(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-100 transition-all font-black text-slate-700 outline-none appearance-none cursor-pointer"
                        >
                            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>

                    {/* Filtro de Mês */}
                    <div className="w-full sm:w-48">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Período</label>
                        <select
                            value={currentMonth}
                            onChange={(e) => onMonthChange(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-100 transition-all font-black text-slate-700 outline-none appearance-none cursor-pointer"
                        >
                            {meses.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
                        </select>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClear}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-400 p-4.5 rounded-2xl transition-all border border-slate-100 flex items-center justify-center min-w-[56px] min-h-[56px]"
                            title="Limpar Filtros"
                        >
                            <FaTimes size={18} />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowExport(!showExport)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest px-8 py-4.5 rounded-2xl transition-all shadow-lg shadow-indigo-100 flex items-center gap-3 active:scale-95"
                            >
                                <FaDownload /> Exportar
                            </button>

                            {showExport && (
                                <div className="absolute right-0 mt-3 w-56 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/40 border border-slate-100 p-3 z-50 animate-in fade-in zoom-in duration-200">
                                    <button
                                        onClick={() => { onExport("pdf"); setShowExport(false); }}
                                        className="w-full text-left px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center"><FaFilePdf /></div>
                                        PDF
                                    </button>
                                    <button
                                        onClick={() => { onExport("csv"); setShowExport(false); }}
                                        className="w-full text-left px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center"><FaFileCsv /></div>
                                        CSV
                                    </button>
                                    <button
                                        onClick={() => { onExport("json"); setShowExport(false); }}
                                        className="w-full text-left px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center"><FaFileCode /></div>
                                        JSON
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filtros Extras (Children) */}
                {children && (
                    <div className="w-full flex flex-wrap items-center gap-4 pt-6 border-t border-slate-50 mt-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 border-r border-slate-100 hidden sm:block italic">Filtros Avançados</span>
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
