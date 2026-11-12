"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { 
    FaFilePdf, FaMagnifyingGlass, FaCalendarDays, FaDownload, 
    FaEye, FaXmark, FaGavel, FaFileSignature, FaScroll, FaFileLines, FaScaleBalanced,
    FaFileExcel, FaFileCsv, FaArrowDownShortWide, FaArrowUpWideShort
} from "react-icons/fa6";
import { FaRegFileLines } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import PDFViewer from "@/components/transparencia/PDFViewer";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { MUNICIPIO } from "@/config/municipio";

export type Legislacao = {
    id: string;
    tipo: string;
    numero: string;
    ano: number;
    dataAto?: string | null;
    ementa: string;
    arquivo: string | null;
    documentUrl?: string | null;
    criadoEm: string;
};

const parseNumero = (numStr: string): number => {
    if (!numStr) return 0;
    // Captura o primeiro número principal na string do número do ato (ex: "542/2024" -> 542, "Nº 012" -> 12, "001" -> 1)
    const match = numStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
};

const safeDecode = (str: string): string => {
    try {
        return decodeURIComponent(str);
    } catch {
        return str;
    }
};

const MONTH_MAP: Record<string, number> = {
    janeiro: 1, jan: 1,
    fevereiro: 2, fev: 2,
    marco: 3, março: 3, mar: 3,
    abril: 4, abr: 4,
    maio: 5, mai: 5,
    junho: 6, jun: 6,
    julho: 7, jul: 7,
    agosto: 8, ago: 8, setembro: 9, set: 9,
    outubro: 10, out: 10,
    novembro: 11, nov: 11,
    dezembro: 12, dez: 12,
};

export const MESES = [
    { v: "", l: "Todos os meses" },
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

export function getAtoMetadata(l: Legislacao) {
    let rawAno = typeof l.ano === "number" ? l.ano : parseInt(String(l.ano), 10) || 0;
    // Corrige erro de digitação comum (ex: 2923 -> 2023)
    let year = rawAno === 2923 ? 2023 : (rawAno > 2050 || rawAno < 1900 ? 2024 : rawAno);
    let month: number | null = null;
    let day: number | null = null;
    let hasExactDate = false;

    // 1. dataAto oficial se preenchido
    if (l.dataAto) {
        const d = new Date(l.dataAto);
        if (!isNaN(d.getTime())) {
            return {
                year: d.getFullYear(),
                month: d.getMonth() + 1,
                day: d.getDate(),
                hasExactDate: true,
                date: d,
                displayDate: d.toLocaleDateString("pt-BR")
            };
        }
    }

    // 2. Extração de datas escritas em português no nome do arquivo, ementa ou número
    const textToSearch = safeDecode((l.arquivo || "") + " " + (l.ementa || "") + " " + (l.numero || ""));

    // Ex: "30 de marco de 2026", "05-de-marco-de-2026", "25 DE FEVEREIRO DE 2026"
    const writtenMatch = textToSearch.match(
        /(?:de[\s\-_]+)?(\d{1,2})[\s\-_]+de[\s\-_]+(janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?:[\s\-_]+de[\s\-_]+(\d{4}))?/i
    );
    if (writtenMatch) {
        day = parseInt(writtenMatch[1], 10);
        const mesNome = writtenMatch[2].toLowerCase();
        month = MONTH_MAP[mesNome] || null;
        if (writtenMatch[3]) {
            const parsedYear = parseInt(writtenMatch[3], 10);
            if (parsedYear >= 1990 && parsedYear <= 2050) year = parsedYear;
        }
        if (month && day) {
            hasExactDate = true;
            const d = new Date(year, month - 1, day);
            return {
                year,
                month,
                day,
                hasExactDate: true,
                date: d,
                displayDate: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`
            };
        }
    }

    // Ex: "31/03/2026" ou "31-03-2026"
    const numericMatch = textToSearch.match(/(?:em|data:?[\s\-_]*)?(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})/i);
    if (numericMatch) {
        day = parseInt(numericMatch[1], 10);
        month = parseInt(numericMatch[2], 10);
        const parsedYear = parseInt(numericMatch[3], 10);
        if (parsedYear >= 1990 && parsedYear <= 2050) year = parsedYear;
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            const d = new Date(year, month - 1, day);
            return {
                year,
                month,
                day,
                hasExactDate: true,
                date: d,
                displayDate: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`
            };
        }
    }

    // 3. Caminho de upload do WordPress: "/uploads/YYYY/MM/"
    const wpMatch = (l.arquivo || "").match(/\/(\d{4})\/(\d{2})\//);
    if (wpMatch) {
        const wpYear = parseInt(wpMatch[1], 10);
        const wpMonth = parseInt(wpMatch[2], 10);
        const targetYear = (year && year >= 1990 && year <= 2050) ? year : wpYear;
        if (wpMonth >= 1 && wpMonth <= 12) {
            const d = new Date(targetYear, wpMonth - 1, 1);
            const nomeMes = MESES.find(m => m.v === String(wpMonth))?.l || `Mês ${wpMonth}`;
            return {
                year: targetYear,
                month: wpMonth,
                day: 1,
                hasExactDate: false,
                date: d,
                displayDate: `${nomeMes} de ${targetYear}`
            };
        }
    }

    // 4. Se a data de criação no banco for do mesmo ano do ato
    if (l.criadoEm) {
        const d = new Date(l.criadoEm);
        if (!isNaN(d.getTime()) && d.getFullYear() === year) {
            return {
                year,
                month: d.getMonth() + 1,
                day: d.getDate(),
                hasExactDate: false,
                date: d,
                displayDate: d.toLocaleDateString("pt-BR")
            };
        }
    }

    // 5. Fallback para apenas o exercício/ano
    return {
        year,
        month: null,
        day: null,
        hasExactDate: false,
        date: new Date(year, 0, 1),
        displayDate: `Exercício ${year}`
    };
}

const tipoInfo: Record<string, { label: string; icon: any }> = {
    "lei-organica": { label: "Lei Orgânica", icon: FaScroll },
    "lei": { label: "Lei Municipal", icon: FaScaleBalanced },
    "LEI": { label: "Lei Municipal", icon: FaScaleBalanced },
    "decreto": { label: "Decreto", icon: FaGavel },
    "DECRETO": { label: "Decreto", icon: FaGavel },
    "portaria": { label: "Portaria", icon: FaFileSignature },
    "PORTARIA": { label: "Portaria", icon: FaFileSignature },
    "portaria_diaria": { label: "Portaria de Diária", icon: FaRegFileLines },
    "resolucao": { label: "Resolução", icon: FaFileLines },
    "RESOLUCAO": { label: "Resolução", icon: FaFileLines },
    "LDO": { label: "LDO", icon: FaFileLines },
    "LOA": { label: "LOA", icon: FaFileLines },
    "PPA": { label: "PPA", icon: FaFileLines },
};

export default function LegislacaoClient({ 
    initialTipo = "", 
    hideTipoFilter = false 
}: { 
    initialTipo?: string; 
    hideTipoFilter?: boolean; 
}) {
    const [leis, setLeis] = useState<Legislacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [tipoFiltro, setTipoFiltro] = useState(initialTipo || "TODOS");
    const [anoFiltro, setAnoFiltro] = useState<number | null>(null);
    const [mesFiltro, setMesFiltro] = useState<number | null>(null);
    const [buscaFiltro, setBuscaFiltro] = useState("");
    // Padrão: do atual para o mais antigo ("desc")
    const [ordem, setOrdem] = useState<"desc" | "asc">("desc");
    const [pdfViewer, setPdfViewer] = useState<{ url: string; titulo: string } | null>(null);

    const fetchLeis = useCallback(async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({ 
                limit: "5000"
            });
            if (tipoFiltro && tipoFiltro !== "TODOS") query.append("tipo", tipoFiltro);
            
            const res = await fetch(`/api/legislacao?${query.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setLeis(data.items || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [tipoFiltro]);

    useEffect(() => {
        fetchLeis();
    }, [fetchLeis]);

    // Anota cada ato com seus metadados de data e cronologia
    const processedLeis = useMemo(() => {
        return leis.map(l => ({
            ...l,
            meta: getAtoMetadata(l)
        }));
    }, [leis]);

    // Filtragem por busca textual, ano e mês real
    const filtered = useMemo(() => {
        const buscaLower = buscaFiltro.toLowerCase().trim();
        return processedLeis.filter(item => {
            const matchesSearch = !buscaLower ||
                item.ementa.toLowerCase().includes(buscaLower) || 
                item.numero.toLowerCase().includes(buscaLower);
            const matchesAno = anoFiltro === null || item.meta.year === anoFiltro;
            const matchesMes = mesFiltro === null || item.meta.month === mesFiltro;
            return matchesSearch && matchesAno && matchesMes;
        });
    }, [processedLeis, buscaFiltro, anoFiltro, mesFiltro]);

    // Lista de todos os anos cadastrados (mais atual para mais antigo)
    const todosOsAnos = useMemo(() => {
        const set = new Set<number>();
        for (const item of processedLeis) {
            if (item.meta.year >= 1990 && item.meta.year <= 2050) {
                set.add(item.meta.year);
            }
        }
        return Array.from(set).sort((a, b) => b - a);
    }, [processedLeis]);

    // Anos disponíveis nos itens atualmente filtrados (respeitando a ordem selecionada)
    const anosDisponiveis = useMemo(() => {
        const set = new Set<number>();
        for (const item of filtered) {
            if (item.meta.year >= 1990 && item.meta.year <= 2050) {
                set.add(item.meta.year);
            }
        }
        return Array.from(set).sort((a, b) => (ordem === "desc" ? b - a : a - b));
    }, [filtered, ordem]);

    const handleClearFilters = () => {
        setBuscaFiltro("");
        setAnoFiltro(null);
        setMesFiltro(null);
        setTipoFiltro(initialTipo || "TODOS");
        setOrdem("desc");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = filtered.map(l => ({
            "Tipo": tipoInfo[l.tipo]?.label || l.tipo,
            "Número": l.numero,
            "Ano": l.meta.year,
            "Ementa": l.ementa,
            "Data de Publicação": l.meta.displayDate,
            "Arquivo": l.arquivo || "Não disponível"
        }));

        const filename = `legislacao_${tipoFiltro.toLowerCase()}_${anoFiltro || 'geral'}`;
        const title = `Relatório de Legislação Municipal – ${MUNICIPIO.nome}/${MUNICIPIO.uf}`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const stats = {
        total: filtered.length,
        esteAno: processedLeis.filter(l => l.meta.year === new Date().getFullYear()).length,
        comArquivo: filtered.filter(l => !!l.arquivo).length,
    };

    const hasActiveFilters = Boolean(buscaFiltro || anoFiltro || mesFiltro !== null || (tipoFiltro !== "TODOS" && !hideTipoFilter));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-20 font-['Montserrat',sans-serif]">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#DDE3EA] flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-1">Total de Atos Registrados</p>
                        <p className="text-3xl font-black text-[#12304A] tracking-tight">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-[#1254A3] rounded-xl flex items-center justify-center">
                        <FaScaleBalanced size={20} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#DDE3EA] flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-1">Publicados em {new Date().getFullYear()}</p>
                        <p className="text-3xl font-black text-emerald-600 tracking-tight">{stats.esteAno}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <FaCalendarDays size={20} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#DDE3EA] flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-1">Arquivos Disponíveis</p>
                        <p className="text-3xl font-black text-[#F39A32] tracking-tight">{stats.comArquivo}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-[#F39A32] rounded-xl flex items-center justify-center">
                        <FaFilePdf size={20} />
                    </div>
                </div>
            </div>

            {/* ═══════ PAINEL DE FILTROS (MÊS, ANO, BUSCA, ORDENAÇÃO) ═══════ */}
            <div className="bg-white rounded-2xl border border-[#DDE3EA] shadow-sm mb-8">
                
                {/* Abas de Tipo (se não estiver escondido) */}
                {!hideTipoFilter && (
                    <div className="px-5 pt-5 pb-0">
                        <label className="text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-2.5 block">Tipo de Ato / Legislação</label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: "TODOS", label: "Todos" },
                                { id: "lei", label: "Leis" },
                                { id: "decreto", label: "Decretos" },
                                { id: "portaria", label: "Portarias" },
                                { id: "resolucao", label: "Resoluções" },
                                { id: "lei-organica", label: "Lei Orgânica" }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setTipoFiltro(tab.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        tipoFiltro === tab.id
                                        ? "bg-[#1254A3] text-white shadow-sm"
                                        : "bg-[#F5F7FA] text-[#5B738B] hover:bg-slate-200 hover:text-[#12304A]"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Linha com Busca + Filtro de Ano + Filtro de Mês + Alternar Ordem + Exportação */}
                <div className="p-5 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    
                    {/* Campo de Busca */}
                    <div className="relative flex-1">
                        <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                        <input
                            type="text"
                            placeholder="Pesquisar por número ou ementa..."
                            className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-medium text-[#12304A] placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#1254A3]/20 focus:border-[#1254A3] transition-all outline-none"
                            value={buscaFiltro}
                            onChange={(e) => setBuscaFiltro(e.target.value)}
                        />
                    </div>

                    {/* Filtro de Ano */}
                    <div className="relative w-full md:w-36">
                        <FaCalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={13} />
                        <select
                            aria-label="Filtrar por ano"
                            value={anoFiltro ?? ""}
                            onChange={(e) => setAnoFiltro(e.target.value ? Number(e.target.value) : null)}
                            className="w-full pl-10 pr-8 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] focus:bg-white focus:ring-2 focus:ring-[#1254A3]/20 focus:border-[#1254A3] transition-all outline-none cursor-pointer appearance-none"
                        >
                            <option value="">Todos os anos</option>
                            {todosOsAnos.map(ano => (
                                <option key={ano} value={ano}>{ano}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Filtro de Mês */}
                    <div className="relative w-full md:w-44">
                        <FaCalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={13} />
                        <select
                            aria-label="Filtrar por mês"
                            value={mesFiltro ?? ""}
                            onChange={(e) => setMesFiltro(e.target.value ? Number(e.target.value) : null)}
                            className="w-full pl-10 pr-8 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] focus:bg-white focus:ring-2 focus:ring-[#1254A3]/20 focus:border-[#1254A3] transition-all outline-none cursor-pointer appearance-none"
                        >
                            {MESES.map(m => (
                                <option key={m.v} value={m.v}>{m.l}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Botão de Alternar Ordem Cronológica (Do atual para o mais antigo por padrão) */}
                    <button
                        onClick={() => setOrdem(prev => prev === "desc" ? "asc" : "desc")}
                        title="Alternar ordem de exibição (atual/antigo)"
                        className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] hover:bg-slate-200 transition-all cursor-pointer shadow-sm shrink-0"
                    >
                        {ordem === "desc" ? (
                            <>
                                <FaArrowDownShortWide className="text-[#1254A3]" size={14} />
                                <span className="hidden sm:inline">Mais atuais primeiro</span>
                            </>
                        ) : (
                            <>
                                <FaArrowUpWideShort className="text-[#1254A3]" size={14} />
                                <span className="hidden sm:inline">Mais antigos primeiro</span>
                            </>
                        )}
                    </button>

                    <div className="hidden md:block w-px h-8 bg-[#DDE3EA]" />

                    {/* Ferramentas de Exportação */}
                    <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-[10px] font-bold text-[#5B738B] uppercase tracking-wider mr-1 hidden lg:block">Exportar:</span>
                        {[
                            { id: 'pdf' as const, icon: <FaFilePdf size={13} />, label: 'PDF', color: 'text-red-500 hover:bg-red-50' },
                            { id: 'xlsx' as const, icon: <FaFileExcel size={13} />, label: 'Excel', color: 'text-emerald-500 hover:bg-emerald-50' },
                            { id: 'csv' as const, icon: <FaFileCsv size={13} />, label: 'CSV', color: 'text-blue-500 hover:bg-blue-50' }
                        ].map(tool => (
                            <button
                                key={tool.id}
                                onClick={() => handleExport(tool.id)}
                                title={`Exportar como ${tool.label}`}
                                className={`p-2 rounded-lg transition-all ${tool.color} border border-transparent hover:border-current/10 cursor-pointer`}
                            >
                                {tool.icon}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Badges de Filtros Ativos */}
                {hasActiveFilters && (
                    <div className="px-5 pb-4 flex items-center gap-2 flex-wrap border-t border-[#DDE3EA] pt-3">
                        <span className="text-[10px] font-bold text-[#5B738B] uppercase">Filtros Ativos:</span>
                        {tipoFiltro !== "TODOS" && !hideTipoFilter && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#1254A3] rounded-md text-[11px] font-semibold border border-blue-200">
                                {tipoInfo[tipoFiltro]?.label || tipoFiltro}
                                <button onClick={() => setTipoFiltro("TODOS")} className="ml-0.5 hover:text-blue-900 cursor-pointer"><FaXmark size={8} /></button>
                            </span>
                        )}
                        {anoFiltro && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md text-[11px] font-semibold border border-amber-200">
                                Ano: {anoFiltro}
                                <button onClick={() => setAnoFiltro(null)} className="ml-0.5 hover:text-amber-900 cursor-pointer"><FaXmark size={8} /></button>
                            </span>
                        )}
                        {mesFiltro && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md text-[11px] font-semibold border border-emerald-200">
                                Mês: {MESES.find(m => m.v === mesFiltro.toString())?.l}
                                <button onClick={() => setMesFiltro(null)} className="ml-0.5 hover:text-emerald-900 cursor-pointer"><FaXmark size={8} /></button>
                            </span>
                        )}
                        {buscaFiltro && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-sky-800 rounded-md text-[11px] font-semibold border border-sky-200">
                                &quot;{buscaFiltro}&quot;
                                <button onClick={() => setBuscaFiltro("")} className="ml-0.5 hover:text-sky-900 cursor-pointer"><FaXmark size={8} /></button>
                            </span>
                        )}
                        <button
                            onClick={handleClearFilters}
                            className="text-[10px] font-bold text-[#5B738B] hover:text-red-600 uppercase transition-colors ml-1 cursor-pointer"
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}
            </div>

            {/* ═══════ LISTAGEM ESTRUTURADA (DO ATUAL PARA O MAIS ANTIGO) ═══════ */}
            <div className="space-y-12 min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-12 h-12 border-4 border-[#1254A3]/20 border-t-[#1254A3] rounded-full animate-spin mb-4" />
                        <p className="text-sm text-slate-400 font-black tracking-widest uppercase text-[10px]">Carregando legislação...</p>
                    </div>
                ) : anosDisponiveis.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaMagnifyingGlass className="text-slate-300" size={28} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-700 mb-2">Nenhum ato encontrado</h4>
                        <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
                            Não localizamos registros para os critérios selecionados (Mês / Ano / Termo de busca).
                        </p>
                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 bg-[#1254A3] text-white rounded-xl text-xs font-bold hover:bg-[#0d4282] transition-colors cursor-pointer"
                        >
                            Limpar filtros
                        </button>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {anosDisponiveis.map(ano => {
                            // Ordenação cronológica rigorosa: do atual para o mais antigo (ou vice-versa se alternado)
                            const itensDoAno = filtered
                                .filter(item => item.meta.year === ano)
                                .sort((a, b) => {
                                    // 1. Data real do ato (timestamp)
                                    const timeA = a.meta.date.getTime();
                                    const timeB = b.meta.date.getTime();
                                    if (timeA !== timeB && !isNaN(timeA) && !isNaN(timeB)) {
                                        return ordem === "desc" ? timeB - timeA : timeA - timeB;
                                    }

                                    // 2. Se as datas forem idênticas, comparar pelo número do ato
                                    const numA = parseNumero(a.numero);
                                    const numB = parseNumero(b.numero);
                                    if (numA !== numB) {
                                        return ordem === "desc" ? numB - numA : numA - numB;
                                    }

                                    // 3. Fallback alfabético de string
                                    return ordem === "desc" 
                                        ? b.numero.localeCompare(a.numero, undefined, { numeric: true, sensitivity: 'base' })
                                        : a.numero.localeCompare(b.numero, undefined, { numeric: true, sensitivity: 'base' });
                                });

                            return (
                                <motion.div
                                    key={ano}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Cabeçalho do Exercício / Ano */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#1254A3] text-white rounded-xl flex items-center justify-center font-black text-sm shadow-sm">
                                                <FaCalendarDays size={14} />
                                            </div>
                                            <h3 className="text-2xl font-black text-[#12304A]">Exercício {ano}</h3>
                                        </div>
                                        <div className="flex-1 h-px bg-[#DDE3EA]" />
                                        <span className="text-xs font-bold text-[#5B738B] bg-[#F5F7FA] border border-[#DDE3EA] px-3 py-1.5 rounded-lg">
                                            {itensDoAno.length} {itensDoAno.length === 1 ? "Ato" : "Atos"} ({ordem === "desc" ? "Mais atual ao mais antigo" : "Mais antigo ao mais atual"})
                                        </span>
                                    </div>

                                    {/* Grid de Cards de Legislação */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {itensDoAno.map((l, idx) => {
                                            const info = tipoInfo[l.tipo] || { label: l.tipo, icon: FaFileLines };
                                            return (
                                                <motion.div
                                                    key={l.id}
                                                    initial={{ opacity: 0, y: 16 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.02 }}
                                                    className="group bg-white rounded-2xl border border-[#DDE3EA] hover:border-[#1254A3]/50 shadow-sm transition-all duration-200 flex flex-col justify-between overflow-hidden"
                                                >
                                                    {/* Card body */}
                                                    <div className="p-6 flex-1">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-bold text-[#1254A3] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 uppercase tracking-wider mb-2 w-fit">
                                                                    {info.label}
                                                                </span>
                                                                <h4 className="text-xl font-black text-[#12304A] group-hover:text-[#1254A3] transition-colors duration-200">
                                                                    Nº {l.numero}
                                                                </h4>
                                                            </div>
                                                            <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:text-white transition-all duration-200 shadow-sm">
                                                                <FaFilePdf size={16} />
                                                            </div>
                                                        </div>
                                                        
                                                        <p className="text-xs font-medium text-[#5B738B] leading-relaxed mb-4 line-clamp-4 group-hover:text-[#12304A] transition-colors" title={l.ementa}>
                                                            {l.ementa}
                                                        </p>

                                                        {/* Data Real da Legislação */}
                                                        <div className="flex items-center gap-2 mt-auto pt-2">
                                                            <FaCalendarDays size={12} className="text-slate-400 shrink-0" />
                                                            <span className="text-xs font-semibold text-[#5B738B]">
                                                                {l.meta.displayDate.startsWith("Exercício") 
                                                                    ? l.meta.displayDate 
                                                                    : `Publicado em ${l.meta.displayDate}`
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Card footer com ações */}
                                                    <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
                                                        {l.arquivo ? (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        const exibirNumero = l.numero.endsWith(`/${l.meta.year}`) ? l.numero : `${l.numero}/${l.meta.year}`;
                                                                        setPdfViewer({ url: l.arquivo!, titulo: `${info.label} Nº ${exibirNumero}` });
                                                                    }}
                                                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-white text-[#1254A3] border border-[#DDE3EA] rounded-xl text-xs font-bold hover:bg-[#1254A3] hover:text-white hover:border-[#1254A3] transition-all duration-150 shadow-sm cursor-pointer"
                                                                >
                                                                    <FaEye size={12} />
                                                                    Visualizar
                                                                </button>
                                                                <a
                                                                    href={l.arquivo}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center justify-center gap-2 py-2 px-3.5 bg-white text-[#12304A] border border-[#DDE3EA] rounded-xl text-xs font-bold hover:bg-[#12304A] hover:text-white transition-all duration-150 cursor-pointer"
                                                                >
                                                                    <FaDownload size={11} />
                                                                    Baixar
                                                                </a>
                                                            </>
                                                        ) : (
                                                            <div className="w-full py-2 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold text-center border border-dashed border-slate-200">
                                                                Arquivo Indisponível
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
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

            {/* ═══════ MODAL PDF VIEWER ═══════ */}
            <AnimatePresence>
                {pdfViewer && (
                    <PDFViewer
                        url={pdfViewer.url}
                        titulo={pdfViewer.titulo}
                        onClose={() => setPdfViewer(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
