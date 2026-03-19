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
    placeholder = "Pesquisar nos resultados..."
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-wrap items-end gap-4">
                {/* Busca Textual */}
                <div className="flex-1 min-w-[300px]">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Busca Textual</label>
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearch(e.target.value)}
                            placeholder={placeholder}
                            className="w-full bg-gray-50 border-none rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Filtro de Ano */}
                <div className="w-full sm:w-32">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Exercício</label>
                    <select
                        value={currentYear}
                        onChange={(e) => onYearChange(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-500 transition-all font-bold text-gray-700"
                    >
                        {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>

                {/* Filtro de Mês */}
                <div className="w-full sm:w-48">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Período</label>
                    <select
                        value={currentMonth}
                        onChange={(e) => onMonthChange(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-500 transition-all font-bold text-gray-700"
                    >
                        {meses.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
                    </select>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onClear}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-3.5 rounded-xl transition-all"
                        title="Limpar Filtros"
                    >
                        <FaTimes />
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowExport(!showExport)}
                            className="bg-primary-500 hover:bg-primary-600 text-white font-black text-[10px] uppercase tracking-widest px-6 py-4 rounded-xl transition-all shadow-md flex items-center gap-2"
                        >
                            <FaDownload /> Exportar
                        </button>

                        {showExport && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                                <button
                                    onClick={() => { onExport("pdf"); setShowExport(false); }}
                                    className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                >
                                    <FaFilePdf className="text-red-500" /> Baixar em PDF
                                </button>
                                <button
                                    onClick={() => { onExport("csv"); setShowExport(false); }}
                                    className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                >
                                    <FaFileCsv className="text-green-600" /> Baixar em CSV
                                </button>
                                <button
                                    onClick={() => { onExport("json"); setShowExport(false); }}
                                    className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                >
                                    <FaFileCode className="text-blue-500" /> Baixar em JSON
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
