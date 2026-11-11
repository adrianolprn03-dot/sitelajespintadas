"use client";

import { useState, useEffect, useCallback } from "react";
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

type Legislacao = {
    id: string;
    tipo: string;
    numero: string;
    ano: number;
    ementa: string;
    arquivo: string | null;
    criadoEm: string;
};

const parseNumero = (numStr: string): number => {
    if (!numStr) return 0;
    // Captura o primeiro número principal na string do número do ato (ex: "542/2024" -> 542, "Nº 012" -> 12, "001" -> 1)
    const match = numStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
};

const tipoInfo: Record<string, { label: string; icon: any }> = {
    "lei-organica": { label: "Lei Orgânica", icon: FaScroll },
    "lei": { label: "Lei Municipal", icon: FaScaleBalanced },
    "decreto": { label: "Decreto", icon: FaGavel },
    "portaria": { label: "Portaria", icon: FaFileSignature },
    "portaria_diaria": { label: "Portaria de Diária", icon: FaRegFileLines },
    "resolucao": { label: "Resolução", icon: FaFileLines },
};

const MESES = [
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

export default function LegislacaoClient({ initialTipo = "", hideTipoFilter = false }: { initialTipo?: string, hideTipoFilter?: boolean }) {
    const [leis, setLeis] = useState<Legislacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [tipoFiltro, setTipoFiltro] = useState(initialTipo || "TODOS");
    const [anoFiltro, setAnoFiltro] = useState<number | null>(null);
    const [mesFiltro, setMesFiltro] = useState<number | null>(null);
    const [buscaFiltro, setBuscaFiltro] = useState("");
    const [ordemNumero, setOrdemNumero] = useState<"desc" | "asc">("desc");
    const [pdfViewer, setPdfViewer] = useState<{ url: string; titulo: string } | null>(null);

    const fetchLeis = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({ 
                limit: "1000"
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
    };

    useEffect(() => {
        fetchLeis();
    }, [tipoFiltro]);

    const filtered = leis.filter(l => {
        const matchesSearch = l.ementa.toLowerCase().includes(buscaFiltro.toLowerCase()) || 
                             l.numero.toLowerCase().includes(buscaFiltro.toLowerCase());
        const matchesAno = anoFiltro === null || l.ano === anoFiltro;
        const matchesMes = mesFiltro === null || (l.criadoEm && (new Date(l.criadoEm).getMonth() + 1) === mesFiltro);
        return matchesSearch && matchesAno && matchesMes;
    });

    const todosOsAnos = Array.from(new Set(leis.map(l => l.ano))).sort((a, b) => b - a);
    const anosDisponiveis = Array.from(new Set(filtered.map(l => l.ano))).sort((a, b) => b - a);

    const handleClearFilters = () => {
        setBuscaFiltro("");
        setAnoFiltro(null);
        setMesFiltro(null);
        setTipoFiltro(initialTipo || "TODOS");
        setOrdemNumero("desc");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = filtered.map(l => ({
            "Tipo": tipoInfo[l.tipo]?.label || l.tipo,
            "Número": l.numero,
            "Ano": l.ano,
            "Ementa": l.ementa,
            "Data": new Date(l.criadoEm).toLocaleDateString("pt-BR")
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
        esteAno: leis.filter(l => l.ano === new Date().getFullYear()).length,
        comArquivo: filtered.filter(l => !!l.arquivo).length,
    };

    const hasActiveFilters = buscaFiltro || anoFiltro || mesFiltro !== null || (tipoFiltro !== "TODOS" && !hideTipoFilter);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-20 font-['Montserrat',sans-serif]">
            
            {/* Stats Cards - Padrão Novo */}
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

            {/* ═══════ FILTROS ═══════ */}
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

                {/* Busca + Ano + Mês + Alternar Ordem + Exportação */}
                <div className="p-5 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <div className="relative flex-1">
                        <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={13} />
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
                        <FaCalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={13} />
                        <select
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
                    <div className="relative w-full md:w-40">
                        <FaCalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={13} />
                        <select
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

                    {/* Botão de Alternar Ordem Numérica */}
                    <button
                        onClick={() => setOrdemNumero(prev => prev === "desc" ? "asc" : "desc")}
                        title="Alternar ordem de exibição pelo número do ato"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] hover:bg-slate-200 transition-all cursor-pointer shadow-sm"
                    >
                        {ordemNumero === "desc" ? (
                            <>
                                <FaArrowDownShortWide className="text-[#1254A3]" size={14} />
                                <span className="hidden sm:inline">Nº Maior para Menor</span>
                            </>
                        ) : (
                            <>
                                <FaArrowUpWideShort className="text-[#1254A3]" size={14} />
                                <span className="hidden sm:inline">Nº Menor para Maior</span>
                            </>
                        )}
                    </button>

                    <div className="hidden md:block w-px h-8 bg-[#DDE3EA]" />

                    <div className="flex items-center gap-1.5">
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

                {/* Filtros ativos */}
                {hasActiveFilters && (
                    <div className="px-5 pb-4 flex items-center gap-2 flex-wrap border-t border-[#DDE3EA] pt-3">
                        <span className="text-[10px] font-bold text-[#5B738B] uppercase">Filtros:</span>
                        {tipoFiltro !== "TODOS" && !hideTipoFilter && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#1254A3] rounded-md text-[11px] font-semibold border border-blue-200">
                                {tipoInfo[tipoFiltro]?.label || tipoFiltro}
                                <button onClick={() => setTipoFiltro("TODOS")} className="ml-0.5 hover:text-blue-900"><FaXmark size={8} /></button>
                            </span>
                        )}
                        {anoFiltro && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md text-[11px] font-semibold border border-amber-200">
                                Ano: {anoFiltro}
                                <button onClick={() => setAnoFiltro(null)} className="ml-0.5 hover:text-amber-900"><FaXmark size={8} /></button>
                            </span>
                        )}
                        {mesFiltro && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md text-[11px] font-semibold border border-emerald-200">
                                Mês: {MESES.find(m => m.v === mesFiltro.toString())?.l}
                                <button onClick={() => setMesFiltro(null)} className="ml-0.5 hover:text-emerald-900"><FaXmark size={8} /></button>
                            </span>
                        )}
                        {buscaFiltro && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-sky-800 rounded-md text-[11px] font-semibold border border-sky-200">
                                &quot;{buscaFiltro}&quot;
                                <button onClick={() => setBuscaFiltro("")} className="ml-0.5 hover:text-sky-900"><FaXmark size={8} /></button>
                            </span>
                        )}
                        <button
                            onClick={handleClearFilters}
                            className="text-[10px] font-bold text-[#5B738B] hover:text-red-600 uppercase transition-colors ml-1 cursor-pointer"
                        >
                            Limpar tudo
                        </button>
                    </div>
                )}
            </div>

            {/* ═══════ LISTAGEM ESTRUTURADA ═══════ */}
            <div className="space-y-12 min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
                        <p className="text-sm text-slate-400 font-medium tracking-widest uppercase text-[10px] font-black">Carregando legislação...</p>
                    </div>
                ) : anosDisponiveis.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaMagnifyingGlass className="text-slate-300" size={28} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-700 mb-2">Nenhum ato encontrado</h4>
                        <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
                            Não localizamos registros para os critérios selecionados.
                        </p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {anosDisponiveis.map(ano => {
                            // Ordenação estrita pelo NÚMERO DO ATO (Maior para o Menor por padrão)
                            const itensDoAno = filtered
                                .filter(l => l.ano === ano)
                                .sort((a, b) => {
                                    const numA = parseNumero(a.numero);
                                    const numB = parseNumero(b.numero);

                                    // 1. Número principal do ato (ex: Nº 542 antes de Nº 12)
                                    if (numA !== numB) {
                                        return ordemNumero === "desc" ? numB - numA : numA - numB;
                                    }

                                    // 2. Data de publicação/criação mais recente
                                    const timeA = new Date(a.criadoEm).getTime();
                                    const timeB = new Date(b.criadoEm).getTime();
                                    if (timeA !== timeB && !isNaN(timeA) && !isNaN(timeB)) {
                                        return timeB - timeA;
                                    }

                                    // 3. Fallback alfabético/numérico de string
                                    return ordemNumero === "desc" 
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
                                    {/* Divisor de Ano */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#1254A3] text-white rounded-xl flex items-center justify-center font-black text-sm shadow-sm">
                                                <FaCalendarDays size={14} />
                                            </div>
                                            <h3 className="text-2xl font-black text-[#12304A]">Exercício {ano}</h3>
                                        </div>
                                        <div className="flex-1 h-px bg-[#DDE3EA]" />
                                        <span className="text-xs font-bold text-[#5B738B] bg-[#F5F7FA] border border-[#DDE3EA] px-3 py-1.5 rounded-lg">
                                            {itensDoAno.length} {itensDoAno.length === 1 ? "Ato" : "Atos"} (Nº {ordemNumero === "desc" ? "Maior ao Menor" : "Menor ao Maior"})
                                        </span>
                                    </div>

                                    {/* Grid de Atos em Ordem Numérica Decrescente */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {itensDoAno.map((l, idx) => {
                                            const info = tipoInfo[l.tipo] || { label: l.tipo, icon: FaFileLines };
                                            return (
                                                <motion.div
                                                    key={l.id}
                                                    initial={{ opacity: 0, y: 16 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.03 }}
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

                                                        <div className="flex items-center gap-2 mt-auto pt-2">
                                                            <FaCalendarDays size={12} className="text-slate-400" />
                                                            <span className="text-xs font-semibold text-[#5B738B]">
                                                                Publicado em {new Date(l.criadoEm).toLocaleDateString("pt-BR")}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Card footer com ações */}
                                                    <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
                                                        {l.arquivo ? (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        const exibirNumero = l.numero.endsWith(`/${l.ano}`) ? l.numero : `${l.numero}/${l.ano}`;
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
