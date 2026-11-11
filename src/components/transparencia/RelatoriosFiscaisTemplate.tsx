"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { 
    FaFilePdf, FaMagnifyingGlass, FaCalendarDays, FaChartLine, 
    FaDownload, FaFileExcel, FaFileCsv, FaXmark, FaEye, 
    FaArrowDownShortWide, FaArrowUpWideShort, FaFileSignature, 
    FaBuildingColumns, FaShieldHalved, FaChartPie, FaTable
} from "react-icons/fa6";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
    PieChart,
    Pie,
    Legend
} from "recharts";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { motion, AnimatePresence } from "framer-motion";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import PDFViewer from "@/components/transparencia/PDFViewer";

const CHART_COLORS = ["#1254A3", "#F39A32", "#10B981", "#0284C7", "#8B5CF6", "#F59E0B"];

type RelatorioFiscal = {
    id: string;
    titulo: string;
    tipo: string;
    periodo: string;
    ano: number;
    arquivo: string;
    dataPublicacao: string;
};

export type DeclaracaoInfo = {
    exercicios: string;
    textoInicial?: string;
    declaracao: string;
    dataAtualizacao: string;
};

interface Props {
    title: string;
    subtitle: string;
    tipo: string;
    icon: React.ReactNode;
    breadcrumbLabel: string;
    showTabs?: string[];
    declaracao?: DeclaracaoInfo | React.ReactNode;
}

// Prioridade dos tipos principais na LRF
const getTipoPriority = (tipo: string): number => {
    const t = (tipo || "").toUpperCase();
    if (t === "RREO") return 1;
    if (t === "RGF") return 2;
    if (t === "LOA") return 3;
    if (t === "LDO") return 4;
    if (t === "PPA") return 5;
    return 6;
};

// Extrator rigoroso da posição ordinal do período (1º ao 6º Bimestre, 1º ao 3º Quadrimestre)
const getPeriodoWeight = (periodoStr: string, tituloStr: string): number => {
    const pStr = (periodoStr || "").toLowerCase();
    const tStr = (tituloStr || "").toLowerCase();

    // 1. Verificar menção explícita no título primeiro (ex: "RREO 1º BI", "RREO 2º BI", "RREO 3º BI", "4º BI", "5º BI", "6º BI")
    for (let i = 1; i <= 6; i++) {
        if (
            tStr.includes(`${i}º bi`) || 
            tStr.includes(`${i}.º bi`) || 
            tStr.includes(`${i}o bi`) || 
            tStr.includes(`${i}º bim`) || 
            tStr.includes(`${i} bimestre`)
        ) {
            return i * 1.0;
        }
    }

    // 2. Verificar menção explícita no período em seguida
    for (let i = 1; i <= 6; i++) {
        if (
            pStr.includes(`${i}º bi`) || 
            pStr.includes(`${i}.º bi`) || 
            pStr.includes(`${i}o bi`) || 
            pStr.includes(`${i}º bim`) || 
            pStr.includes(`${i} bimestre`)
        ) {
            return i * 1.0;
        }
    }

    // 3. Quadrimestres (1º, 2º e 3º Quadrimestre / Semestre)
    for (let i = 1; i <= 3; i++) {
        if (
            tStr.includes(`${i}º quad`) || 
            tStr.includes(`${i}º sem`) || 
            pStr.includes(`${i}º quad`) || 
            pStr.includes(`${i}º sem`) ||
            tStr.includes(`${i} quadrimestre`) ||
            pStr.includes(`${i} quadrimestre`)
        ) {
            return i + 0.5;
        }
    }

    // 4. Referências aos meses do bimestre
    if (tStr.includes("jan") || pStr.includes("jan")) return 1.0;
    if (tStr.includes("mar") || pStr.includes("mar")) return 2.0;
    if (tStr.includes("mai") || pStr.includes("mai")) return 3.0;
    if (tStr.includes("jul") || pStr.includes("jul")) return 4.0;
    if (tStr.includes("set") || pStr.includes("set")) return 5.0;
    if (tStr.includes("nov") || pStr.includes("nov")) return 6.0;

    const match = `${pStr} ${tStr}`.match(/(\d+)\s*º?\s*(bimestre|quadrimestre|semestre)/);
    if (match) return parseFloat(match[1]);

    if (tStr.includes("anual") || pStr.includes("anual") || tStr.includes("balanço") || pStr.includes("balanço")) return 10.0;

    return 99.0;
};

// Metadados visuais de cada categoria de relatório
const getTipoMeta = (tipo: string) => {
    const t = (tipo || "").toUpperCase();
    if (t === "RREO") {
        return {
            title: "RREO - Relatórios Resumidos da Execução Orçamentária",
            subtitle: "Publicações Bimestrais (1º ao 6º Bimestre)",
            badgeStyle: "bg-indigo-50 text-indigo-700 border-indigo-200",
            icon: <FaChartLine className="text-indigo-600" size={16} />
        };
    }
    if (t === "RGF") {
        return {
            title: "RGF - Relatórios de Gestão Fiscal",
            subtitle: "Publicações Quadrimestrais e Semestrais (1º ao 3º Quadrimestre)",
            badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200",
            icon: <FaFileSignature className="text-emerald-600" size={16} />
        };
    }
    if (["LOA", "LDO", "PPA"].includes(t)) {
        return {
            title: `Instrumento de Planejamento (${t})`,
            subtitle: "Leis e Diretrizes Orçamentárias",
            badgeStyle: "bg-purple-50 text-purple-700 border-purple-200",
            icon: <FaBuildingColumns className="text-purple-600" size={16} />
        };
    }
    return {
        title: tipo || "Documentos Fiscais",
        subtitle: "Relatórios e Documentações Oficiais",
        badgeStyle: "bg-slate-100 text-slate-700 border-slate-200",
        icon: <FaFilePdf className="text-slate-600" size={16} />
    };
};

export default function RelatoriosFiscaisTemplate({ title, subtitle, tipo, icon, breadcrumbLabel, showTabs, declaracao }: Props) {
    const [relatorios, setRelatorios] = useState<RelatorioFiscal[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [tabAtiva, setTabAtiva] = useState(showTabs ? "TODOS" : tipo);
    const [anoFiltro, setAnoFiltro] = useState<number | null>(null);
    const [ordemPeriodo, setOrdemPeriodo] = useState<"asc" | "desc">("asc");
    const [pdfViewer, setPdfViewer] = useState<{ url: string; titulo: string } | null>(null);
    const [abaVisual, setAbaVisual] = useState<"lista" | "graficos">("lista");

    useEffect(() => {
        const fetchRelatorios = async () => {
            try {
                setLoading(true);
                const urls = [
                    showTabs ? "/api/admin/relatorios-fiscais" : `/api/admin/relatorios-fiscais?tipo=${tipo}`
                ];

                const hasBudget = showTabs?.some(t => ["LOA", "LDO", "PPA"].includes(t));
                if (hasBudget) {
                    urls.push("/api/legislacao?tipo=LOA,LDO,PPA&limit=200");
                }
                
                const docTypes = showTabs ? showTabs.map(t => t.toLowerCase()).join(",") : tipo.toLowerCase();
                urls.push(`/api/documentos?tipo=${docTypes}`);

                const responses = await Promise.all(urls.map(url => fetch(url)));
                const dataSets = await Promise.all(responses.map(res => res.ok ? res.json() : []));

                let combinedRecords: RelatorioFiscal[] = [];

                if (dataSets[0]) {
                    combinedRecords = [...(Array.isArray(dataSets[0]) ? dataSets[0] : [])];
                }

                if (hasBudget && dataSets[1] && dataSets[1].items) {
                    const mappedBudget: RelatorioFiscal[] = dataSets[1].items.map((item: any) => ({
                        id: item.id,
                        titulo: item.ementa,
                        tipo: item.tipo,
                        periodo: "Instrumento de Planejamento",
                        ano: item.ano,
                        arquivo: item.arquivo || "",
                        dataPublicacao: item.criadoEm
                    }));
                    combinedRecords = [...combinedRecords, ...mappedBudget];
                }

                const docIndex = hasBudget ? 2 : 1;
                if (dataSets[docIndex]) {
                    const mappedDocs: RelatorioFiscal[] = (Array.isArray(dataSets[docIndex]) ? dataSets[docIndex] : []).map((item: any) => ({
                        id: item.id,
                        titulo: item.titulo,
                        tipo: item.tipo.toUpperCase(),
                        periodo: "Documento",
                        ano: item.ano || new Date(item.criadoEm).getFullYear(),
                        arquivo: item.arquivo || "",
                        dataPublicacao: item.criadoEm
                    }));
                    combinedRecords = [...combinedRecords, ...mappedDocs];
                }

                // Deduplicação inteligente de registros por id e por título/arquivo
                const seen = new Set<string>();
                const uniqueRecords: RelatorioFiscal[] = [];
                for (const r of combinedRecords) {
                    const key = r.id || `${r.ano}-${r.tipo}-${r.titulo}`.toLowerCase().trim();
                    const urlKey = r.arquivo ? r.arquivo.toLowerCase().trim() : "";
                    if (!seen.has(key) && (!urlKey || !seen.has(urlKey))) {
                        seen.add(key);
                        if (urlKey) seen.add(urlKey);
                        uniqueRecords.push(r);
                    }
                }

                setRelatorios(uniqueRecords);
            } catch (error) {
                console.error("Erro ao buscar relatórios:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRelatorios();
    }, [tipo, showTabs]);

    const filtered = relatorios.filter(r => {
        const matchesSearch = r.titulo.toLowerCase().includes(search.toLowerCase()) || 
                             r.periodo.toLowerCase().includes(search.toLowerCase());
        const matchesTab = !showTabs || tabAtiva === "TODOS" || r.tipo === tabAtiva;
        const matchesAno = anoFiltro === null || r.ano === anoFiltro;
        return matchesSearch && matchesTab && matchesAno && (showTabs ? true : r.tipo === tipo);
    });

    const todosOsAnos = Array.from(
        new Set(
            relatorios
                .filter(r => {
                    const matchesTab = !showTabs || tabAtiva === "TODOS" || r.tipo === tabAtiva;
                    return matchesTab && (showTabs ? true : r.tipo === tipo);
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

    const closePdfViewer = useCallback(() => setPdfViewer(null), []);

    const hasActiveFilters = search || anoFiltro || (showTabs && tabAtiva !== "TODOS");

    // Dados agregados por Ano para os gráficos
    const dadosPorAno = useMemo(() => {
        const map: Record<number, number> = {};
        relatorios.forEach(r => {
            if (r.ano) {
                map[r.ano] = (map[r.ano] || 0) + 1;
            }
        });
        return Object.entries(map)
            .map(([ano, count]) => ({ ano: Number(ano), count }))
            .sort((a, b) => a.ano - b.ano);
    }, [relatorios]);

    // Dados agregados por Categoria/Tipo para os gráficos
    const dadosPorTipo = useMemo(() => {
        const map: Record<string, number> = {};
        filtered.forEach(r => {
            const t = r.tipo || "Outros";
            map[t] = (map[t] || 0) + 1;
        });
        return Object.entries(map)
            .map(([tipo, count]) => ({ tipo, count }))
            .sort((a, b) => b.count - a.count);
    }, [filtered]);

    return (
        <div className="min-h-screen bg-[#F5F7FA]">
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

            <div className="w-full px-4 md:px-10 lg:px-20 py-10">
                
                {/* ═══════ DECLARAÇÃO OFICIAL PNTP / NOTA DE TRANSPARÊNCIA ═══════ */}
                {declaracao && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-6 md:p-8 border border-amber-200/80 shadow-xl shadow-amber-500/5 mb-10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                        
                        {/* Status / Header */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-amber-100/80">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md shadow-amber-500/20">
                                    <FaShieldHalved size={22} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-0.5">
                                        Declaração de Transparência Pública (PNTP)
                                    </span>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">
                                        {typeof declaracao === "object" && "exercicios" in declaracao 
                                            ? declaracao.exercicios 
                                            : "Declaração Oficial"}
                                    </h3>
                                </div>
                            </div>
                            {typeof declaracao === "object" && "dataAtualizacao" in declaracao && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-900 rounded-full border border-amber-200 text-xs font-bold shadow-sm">
                                    <FaCalendarDays size={13} className="text-amber-600" />
                                    <span>Data de Atualização: <strong className="text-amber-950 font-black">{declaracao.dataAtualizacao}</strong></span>
                                </div>
                            )}
                        </div>

                        {/* Text Content */}
                        {typeof declaracao === "object" && "declaracao" in declaracao ? (
                            <div className="space-y-4 text-slate-700 text-sm md:text-base leading-relaxed">
                                {declaracao.textoInicial && (
                                    <p className="text-slate-600 font-medium">
                                        {declaracao.textoInicial}
                                    </p>
                                )}
                                <div className="p-6 bg-amber-50/70 rounded-2xl border-l-4 border-amber-500 border border-amber-200/50 shadow-inner">
                                    <p className="font-semibold text-slate-800 leading-relaxed">
                                        {declaracao.declaracao}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            declaracao
                        )}
                    </motion.div>
                )}
                
                {/* Stats Cards - Padrão Novo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#DDE3EA] flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-1">Total de Documentos</p>
                            <p className="text-3xl font-black text-[#12304A] tracking-tight">{filtered.length}</p>
                            <p className="text-xs text-[#5B738B] mt-1">Registros catalogados</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 text-[#1254A3] rounded-xl flex items-center justify-center">
                            <FaChartLine size={20} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#DDE3EA] flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-1">Exercício {new Date().getFullYear()}</p>
                            <p className="text-3xl font-black text-emerald-600 tracking-tight">
                                {relatorios.filter(r => r.ano === new Date().getFullYear()).length}
                            </p>
                            <p className="text-xs text-[#5B738B] mt-1">Publicações no ano vigente</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <FaCalendarDays size={20} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#DDE3EA] flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-1">Arquivos em PDF</p>
                            <p className="text-3xl font-black text-[#F39A32] tracking-tight">
                                {relatorios.filter(r => r.arquivo.toLowerCase().endsWith('.pdf')).length}
                            </p>
                            <p className="text-xs text-[#5B738B] mt-1">Inteiro teor disponível</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-50 text-[#F39A32] rounded-xl flex items-center justify-center">
                            <FaFilePdf size={20} />
                        </div>
                    </div>
                </div>

                {/* Visual Switcher */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#DDE3EA] shadow-sm">
                        <button
                            onClick={() => setAbaVisual("lista")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                abaVisual === "lista"
                                    ? "bg-[#1254A3] text-white shadow-sm"
                                    : "text-[#5B738B] hover:text-[#12304A]"
                            }`}
                        >
                            <FaTable size={13} /> Documentos Oficiais
                        </button>
                        <button
                            onClick={() => setAbaVisual("graficos")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                abaVisual === "graficos"
                                    ? "bg-[#1254A3] text-white shadow-sm"
                                    : "text-[#5B738B] hover:text-[#12304A]"
                            }`}
                        >
                            <FaChartPie size={13} /> Gráficos nos Resultados
                        </button>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                        <span className="text-xs text-[#5B738B] font-semibold">Exibindo {filtered.length} de {relatorios.length} itens</span>
                    </div>
                </div>

                {/* Dashboard Gráfico nos Resultados */}
                {abaVisual === "graficos" && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
                    >
                        {/* Gráfico 1: Publicações por Exercício */}
                        <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-base font-bold text-[#12304A]">Publicações por Exercício Fiscal</h3>
                                    <p className="text-xs text-[#5B738B]">Volume de demonstrativos e relatórios ao longo dos anos</p>
                                </div>
                                <span className="p-2 bg-blue-50 text-[#1254A3] rounded-xl text-xs font-bold">
                                    {dadosPorAno.length} Exercícios
                                </span>
                            </div>
                            <div className="h-[280px] w-full">
                                {dadosPorAno.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={dadosPorAno} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                            <XAxis dataKey="ano" tick={{ fontSize: 11, fill: '#12304A', fontWeight: 600 }} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5B738B' }} />
                                            <Tooltip formatter={(value: number) => [`${value} publicações`, "Total"]} />
                                            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                                {dadosPorAno.map((_, index) => (
                                                    <Cell key={`cell-ano-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-sm text-[#5B738B]">
                                        Nenhum dado disponível
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Gráfico 2: Distribuição por Categoria Fiscal */}
                        <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-base font-bold text-[#12304A]">Composição por Tipo de Relatório</h3>
                                    <p className="text-xs text-[#5B738B]">Proporção dos instrumentos fiscais catalogados</p>
                                </div>
                                <span className="p-2 bg-amber-50 text-[#F39A32] rounded-xl text-xs font-bold">
                                    {dadosPorTipo.length} Categorias
                                </span>
                            </div>
                            <div className="h-[280px] w-full">
                                {dadosPorTipo.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={dadosPorTipo}
                                                dataKey="count"
                                                nameKey="tipo"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={95}
                                                innerRadius={50}
                                                paddingAngle={4}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {dadosPorTipo.map((_, index) => (
                                                    <Cell key={`cell-tipo-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(val: number) => [`${val} documentos`, "Quantidade"]} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-sm text-[#5B738B]">
                                        Nenhum dado disponível
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ═══════ FILTROS E CONTROLES ═══════ */}
                <div className="bg-white rounded-2xl border border-[#DDE3EA] shadow-sm mb-8">
                    
                    {/* Categoria / Abas (se houver) */}
                    {showTabs && (
                        <div className="px-5 pt-5 pb-0">
                            <label className="text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-2.5 block">Tipo de Relatório</label>
                            <div className="flex flex-wrap gap-2">
                                {["TODOS", ...showTabs].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setTabAtiva(tab)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                            tabAtiva === tab
                                            ? "bg-[#1254A3] text-white shadow-sm"
                                            : "bg-[#F5F7FA] text-[#5B738B] hover:bg-slate-200 hover:text-[#12304A]"
                                        }`}
                                    >
                                        {tab === "TODOS" ? "Todos" : tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Barra de busca + Ano + Ordem + Exportação */}
                    <div className="p-5 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                        
                        {/* Busca */}
                        <div className="relative flex-1">
                            <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={13} />
                            <input
                                type="text"
                                placeholder="Pesquisar documento..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Filtro de Ano */}
                        <div className="relative w-full md:w-48">
                            <FaCalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={13} />
                            <select
                                value={anoFiltro ?? ""}
                                onChange={(e) => setAnoFiltro(e.target.value ? Number(e.target.value) : null)}
                                className="w-full pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all outline-none cursor-pointer appearance-none"
                            >
                                <option value="">Todos os anos</option>
                                {todosOsAnos.map(ano => (
                                    <option key={ano} value={ano}>{ano}</option>
                                ))}
                            </select>
                            <ChevronDown />
                        </div>

                        {/* Alternar Ordem dos Períodos (123 vs 654) */}
                        <button
                            onClick={() => setOrdemPeriodo(prev => prev === "asc" ? "desc" : "asc")}
                            title="Alternar ordem de exibição dos períodos (1º ao 6º ou 6º ao 1º)"
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer shadow-sm"
                        >
                            {ordemPeriodo === "asc" ? (
                                <>
                                    <FaArrowDownShortWide className="text-primary-600" size={14} />
                                    <span>Ordem: 1º ao 6º Bimestre</span>
                                </>
                            ) : (
                                <>
                                    <FaArrowUpWideShort className="text-primary-600" size={14} />
                                    <span>Ordem: 6º ao 1º Bimestre</span>
                                </>
                            )}
                        </button>

                        {/* Separador vertical */}
                        <div className="hidden md:block w-px h-8 bg-slate-200" />

                        {/* Exportar */}
                        <div className="flex items-center gap-1.5 justify-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden lg:block">Exportar:</span>
                            {[
                                { id: 'pdf' as const, icon: <FaFilePdf size={13} />, label: 'PDF', color: 'text-red-500 hover:bg-red-50' },
                                { id: 'xlsx' as const, icon: <FaFileExcel size={13} />, label: 'Excel', color: 'text-emerald-500 hover:bg-emerald-50' },
                                { id: 'csv' as const, icon: <FaFileCsv size={13} />, label: 'CSV', color: 'text-blue-500 hover:bg-blue-50' }
                            ].map(tool => (
                                <button
                                    key={tool.id}
                                    onClick={() => handleExport(tool.id)}
                                    title={`Exportar como ${tool.label}`}
                                    className={`p-2.5 rounded-lg transition-all ${tool.color} border border-transparent hover:border-current/10`}
                                >
                                    {tool.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Resumo dos filtros ativos */}
                    {hasActiveFilters && (
                        <div className="px-5 pb-4 flex items-center gap-2 flex-wrap border-t border-slate-100 pt-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Filtros Ativos:</span>
                            {showTabs && tabAtiva !== "TODOS" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 rounded-md text-[11px] font-semibold border border-primary-100">
                                    {tabAtiva}
                                    <button onClick={() => setTabAtiva("TODOS")} className="ml-0.5 hover:text-primary-900"><FaXmark size={8} /></button>
                                </span>
                            )}
                            {anoFiltro && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-[11px] font-semibold border border-amber-100">
                                    Ano: {anoFiltro}
                                    <button onClick={() => setAnoFiltro(null)} className="ml-0.5 hover:text-amber-900"><FaXmark size={8} /></button>
                                </span>
                            )}
                            {search && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-sky-700 rounded-md text-[11px] font-semibold border border-sky-100">
                                    &quot;{search}&quot;
                                    <button onClick={() => setSearch("")} className="ml-0.5 hover:text-sky-900"><FaXmark size={8} /></button>
                                </span>
                            )}
                            <button
                                onClick={() => { setSearch(""); setAnoFiltro(null); if (showTabs) setTabAtiva("TODOS"); }}
                                className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase transition-colors ml-1"
                            >
                                Limpar tudo
                            </button>
                        </div>
                    )}
                </div>

                {/* ═══════ CONTADOR ═══════ */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-slate-500">
                        <span className="font-bold text-slate-800">{filtered.length}</span> documento{filtered.length !== 1 ? "s" : ""} organizado{filtered.length !== 1 ? "s" : ""} em sequência cronológica (1º ao 6º Bimestre / 1º ao 3º Quadrimestre)
                    </p>
                </div>

                {/* ═══════ LISTAGEM ESTRUTURADA (123 456) ═══════ */}
                <div className="space-y-12">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
                            <p className="text-sm text-slate-400 font-medium">Carregando relatórios fiscais...</p>
                        </div>
                    ) : anosDisponiveis.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaChartLine className="text-slate-300" size={28} />
                            </div>
                            <h4 className="text-lg font-bold text-slate-700 mb-2">Nenhum documento encontrado</h4>
                            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
                                Não há relatórios para os filtros selecionados. Tente alterar os critérios de busca.
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={() => { setSearch(""); setAnoFiltro(null); if (showTabs) setTabAtiva("TODOS"); }}
                                    className="px-6 py-3 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors"
                                >
                                    Limpar filtros
                                </button>
                            )}
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {anosDisponiveis.map(ano => {
                                const relatoriosDoAno = filtered.filter(r => r.ano === ano);

                                // Identificar os tipos presentes no ano e ordenar pela hierarquia oficial da LRF
                                const tiposDoAno = Array.from(new Set(relatoriosDoAno.map(r => r.tipo))).sort(
                                    (a, b) => getTipoPriority(a) - getTipoPriority(b)
                                );

                                return (
                                    <motion.div
                                        key={ano}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                        className="bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm"
                                    >
                                        {/* Cabeçalho Principal do Ano Fiscal */}
                                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#DDE3EA]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#1254A3] text-white rounded-xl flex items-center justify-center font-black text-sm shadow-sm">
                                                    <FaCalendarDays size={16} />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-[#12304A] tracking-tight">Exercício {ano}</h3>
                                                    <p className="text-xs font-bold text-[#5B738B] uppercase tracking-wider">Demonstrativos da LRF</p>
                                                </div>
                                            </div>
                                            <div className="flex-1 h-px bg-[#DDE3EA]" />
                                            <span className="text-xs font-bold text-[#5B738B] bg-[#F5F7FA] border border-[#DDE3EA] px-3 py-1 rounded-lg">
                                                {relatoriosDoAno.length} {relatoriosDoAno.length === 1 ? "documento" : "documentos"}
                                            </span>
                                        </div>

                                        {/* Grupos organizados por Categoria (RREO / RGF / etc) */}
                                        <div className="space-y-6">
                                            {tiposDoAno.map(tipoKey => {
                                                const meta = getTipoMeta(tipoKey);

                                                // Ordenar itens dentro da categoria de forma estrita: 1º, 2º, 3º, 4º, 5º, 6º Bimestre
                                                const itensDoTipo = relatoriosDoAno
                                                    .filter(r => r.tipo === tipoKey)
                                                    .sort((a, b) => {
                                                        const dir = ordemPeriodo === "asc" ? 1 : -1;
                                                        const wA = getPeriodoWeight(a.periodo, a.titulo);
                                                        const wB = getPeriodoWeight(b.periodo, b.titulo);
                                                        if (wA !== wB) return (wA - wB) * dir;
                                                        return a.titulo.localeCompare(b.titulo, "pt-BR");
                                                    });

                                                return (
                                                    <div key={tipoKey} className="bg-[#F5F7FA] rounded-xl p-5 border border-[#DDE3EA]">
                                                        {/* Cabeçalho da Categoria */}
                                                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DDE3EA]">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 rounded-lg bg-white shadow-sm border border-[#DDE3EA]">
                                                                    {meta.icon}
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-black text-[#12304A] tracking-tight">{meta.title}</h4>
                                                                    <p className="text-[11px] font-semibold text-[#5B738B]">{meta.subtitle}</p>
                                                                </div>
                                                            </div>
                                                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm ${meta.badgeStyle}`}>
                                                                {itensDoTipo.length} {itensDoTipo.length === 1 ? "relatório" : "relatórios"}
                                                            </span>
                                                        </div>

                                                        {/* Grid de Cards Ordenados estritamente 1 -> 6 */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                                            {itensDoTipo.map((r, idx) => (
                                                                <motion.div
                                                                    key={r.id}
                                                                    initial={{ opacity: 0, y: 14 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: idx * 0.03 }}
                                                                    className="group bg-white rounded-xl border border-[#DDE3EA] hover:border-[#1254A3]/50 shadow-sm transition-all duration-200 flex flex-col justify-between overflow-hidden"
                                                                >
                                                                    {/* Card Content */}
                                                                    <div className="p-4">
                                                                        <div className="flex items-start gap-3">
                                                                            <div className="w-9 h-9 bg-red-50 text-red-500 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                                                                                <FaFilePdf size={16} />
                                                                            </div>
                                                                            <div className="min-w-0 flex-1">
                                                                                <h5 className="font-bold text-[#12304A] text-xs leading-snug mb-1.5 line-clamp-2">
                                                                                    {r.titulo.replace(/\.pdf$/i, "")}
                                                                                </h5>
                                                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${meta.badgeStyle}`}>
                                                                                        {r.tipo}
                                                                                    </span>
                                                                                    {r.periodo && (
                                                                                        <span className="text-[10px] font-medium text-[#5B738B] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#DDE3EA]">
                                                                                            {r.periodo}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Card Footer */}
                                                                    <div className="px-4 py-2.5 bg-[#F5F7FA] border-t border-[#DDE3EA] flex items-center gap-2">
                                                                        <button
                                                                            onClick={() => setPdfViewer({ url: r.arquivo, titulo: r.titulo.replace(/\.pdf$/i, "") })}
                                                                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white text-[#1254A3] border border-[#DDE3EA] rounded-lg text-xs font-bold hover:bg-[#1254A3] hover:text-white hover:border-[#1254A3] transition-all duration-150 shadow-sm cursor-pointer"
                                                                        >
                                                                            <FaEye size={12} />
                                                                            Visualizar
                                                                        </button>
                                                                        <a
                                                                            href={r.arquivo}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white text-[#12304A] border border-[#DDE3EA] rounded-lg text-xs font-bold hover:bg-[#12304A] hover:text-white transition-all duration-150 cursor-pointer"
                                                                        >
                                                                            <FaDownload size={11} />
                                                                            Baixar
                                                                        </a>
                                                                    </div>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>

                <div className="mt-16">
                    <BannerPNTP />
                </div>
            </div>

            {/* ═══════ MODAL PDF VIEWER ═══════ */}
            <AnimatePresence>
                {pdfViewer && (
                    <PDFViewer
                        url={pdfViewer.url}
                        titulo={pdfViewer.titulo}
                        onClose={closePdfViewer}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

const ChevronDown = () => (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    </div>
);
