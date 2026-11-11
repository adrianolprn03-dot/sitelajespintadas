"use client";
import { FaSearch, FaTimes, FaFilePdf, FaFileCsv, FaFileCode } from "react-icons/fa";
import { useEffect } from "react";
import { MUNICIPIO } from "@/config/municipio";

interface TransparencyFiltersProps {
    onSearch: (query: string) => void;
    onYearChange?: (year: string) => void;
    onMonthChange?: (month: string) => void;
    onClear: () => void;
    onExport: (format: "pdf" | "csv" | "json" | "xlsx") => void;
    availableYears?: string[];
    currentYear?: string;
    currentMonth?: string;
    searchValue: string;
    placeholder?: string;
    hideYearFilter?: boolean;
    hideMonthFilter?: boolean;
    children?: React.ReactNode;
}

export default function TransparencyFilters({
    onSearch,
    onYearChange = () => {},
    onMonthChange = () => {},
    onClear,
    onExport,
    availableYears = MUNICIPIO.cicloAvaliacaoAnos || ["2026", "2025", "2024", "2023", "2022"],
    currentYear = "",
    currentMonth = "",
    searchValue,
    placeholder = "Pesquisar nos resultados...",
    hideYearFilter = false,
    hideMonthFilter = false,
    children,
}: TransparencyFiltersProps) {
    const meses = [
        { v: "", l: "Todos os Meses" },
        { v: "1", l: "Janeiro" },
        { v: "2", l: "Fevereiro" },
        { v: "3", l: "Março" },
        { v: "4", l: "Abril" },
        { v: "5", l: "Maio" },
        { v: "6", l: "Junho" },
        { v: "7", l: "Julho" },
        { v: "8", l: "Agosto" },
        { v: "9", l: "Setembro" },
        { v: "10", l: "Outubro" },
        { v: "11", l: "Novembro" },
        { v: "12", l: "Dezembro" },
    ];

    // Inicializar filtros a partir da URL na primeira montagem
    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        const urlAno = params.get("ano");
        const urlMes = params.get("mes");
        const urlQ = params.get("q");

        if (urlAno && !hideYearFilter && urlAno !== currentYear) onYearChange(urlAno);
        if (urlMes !== null && !hideMonthFilter && urlMes !== currentMonth) onMonthChange(urlMes);
        if (urlQ && urlQ !== searchValue) onSearch(urlQ);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sincronizar alterações de filtro de volta na URL sem recarregar a página
    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        if (!hideYearFilter && currentYear) params.set("ano", currentYear);
        else if (!hideYearFilter && !currentYear) params.delete("ano");

        if (!hideMonthFilter && currentMonth) params.set("mes", currentMonth);
        else if (!hideMonthFilter && !currentMonth) params.delete("mes");

        if (searchValue) params.set("q", searchValue);
        else params.delete("q");

        const qs = params.toString();
        const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
        window.history.replaceState(null, "", newUrl);
    }, [currentYear, currentMonth, searchValue, hideYearFilter, hideMonthFilter]);

    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 p-6 mb-8 relative z-40">
            <div className="flex flex-wrap items-end gap-4">
                {/* Busca Textual */}
                <div className="flex-1 min-w-[280px]">
                    <label
                        htmlFor="transparencia-busca-textual"
                        className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1"
                    >
                        Busca Textual
                    </label>
                    <div className="relative group">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            id="transparencia-busca-textual"
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearch(e.target.value)}
                            placeholder={placeholder}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-xs focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-400 outline-none"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-end gap-3 w-full lg:w-auto">
                    {!hideYearFilter && (
                        <div className="w-full sm:w-28">
                            <label
                                htmlFor="transparencia-filtro-ano"
                                className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1"
                            >
                                Exercício
                            </label>
                            <select
                                id="transparencia-filtro-ano"
                                value={currentYear}
                                onChange={(e) => onYearChange(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all font-black text-slate-700 outline-none cursor-pointer"
                            >
                                {availableYears.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {!hideMonthFilter && (
                        <div className="w-full sm:w-40">
                            <label
                                htmlFor="transparencia-filtro-mes"
                                className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1"
                            >
                                Período
                            </label>
                            <select
                                id="transparencia-filtro-mes"
                                value={currentMonth}
                                onChange={(e) => onMonthChange(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all font-black text-slate-700 outline-none cursor-pointer"
                            >
                                {meses.map((m) => (
                                    <option key={m.v} value={m.v}>
                                        {m.l}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Ações e Exportação */}
                    <div className="flex flex-wrap items-center gap-2 lg:ml-2">
                        <button
                            type="button"
                            onClick={onClear}
                            aria-label="Limpar filtros"
                            className="bg-slate-50 hover:bg-slate-100 text-slate-500 w-10 h-10 rounded-xl transition-all border border-slate-200 flex items-center justify-center shrink-0 focus:ring-2 focus:ring-blue-500"
                            title="Limpar Filtros"
                        >
                            <FaTimes size={16} />
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => onExport("pdf")}
                                className="bg-red-50 hover:bg-red-100 text-red-700 p-2.5 rounded-xl transition-all border border-red-200 flex items-center gap-2 font-black text-[9px] uppercase tracking-tighter focus:ring-2 focus:ring-red-500"
                                title="Exportar resultados filtrados em PDF"
                            >
                                <FaFilePdf size={14} /> <span className="hidden sm:inline">PDF</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => onExport("csv")}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-2.5 rounded-xl transition-all border border-emerald-200 flex items-center gap-2 font-black text-[9px] uppercase tracking-tighter focus:ring-2 focus:ring-emerald-500"
                                title="Exportar resultados filtrados em CSV"
                            >
                                <FaFileCsv size={14} /> <span className="hidden sm:inline">CSV</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => onExport("xlsx")}
                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-2.5 rounded-xl transition-all border border-blue-200 flex items-center gap-2 font-black text-[9px] uppercase tracking-tighter focus:ring-2 focus:ring-blue-500"
                                title="Exportar resultados filtrados em Planilha Excel (XLSX)"
                            >
                                <FaFileCode size={14} /> <span className="hidden sm:inline">XLSX</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => onExport("json")}
                                className="bg-slate-50 hover:bg-slate-100 text-slate-700 p-2.5 rounded-xl transition-all border border-slate-200 flex items-center gap-2 font-black text-[9px] uppercase tracking-tighter focus:ring-2 focus:ring-slate-500"
                                title="Exportar resultados filtrados em JSON"
                            >
                                <FaFileCode size={14} /> <span className="hidden sm:inline">JSON</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filtros Extras (Children) */}
                {children && (
                    <div className="w-full flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 mt-1">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
