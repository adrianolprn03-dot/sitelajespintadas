"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { 
    FaShieldAlt, FaStar, FaExternalLinkAlt, FaCheckCircle, FaSearch, 
    FaFilter, FaFilePdf, FaFileExcel, FaFileCsv, FaEye, FaCalendarAlt
} from "react-icons/fa";
import { FaBuildingColumns, FaScaleBalanced, FaCheck, FaArrowRight } from "react-icons/fa6";
import { CATALOGO_CRITERIOS_PNTP_2026, CriterioPNTPSeed } from "@/lib/pntp-catalog";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import { MUNICIPIO } from "@/config/municipio";

const DIMENSOES_LISTA = Array.from(new Set(CATALOGO_CRITERIOS_PNTP_2026.map(c => c.dimensao)));

export default function RadarPage() {
    const [busca, setBusca] = useState("");
    const [dimensaoFiltro, setDimensaoFiltro] = useState("TODAS");
    const [classificacaoFiltro, setClassificacaoFiltro] = useState("TODAS");

    const filtrados = useMemo(() => {
        return CATALOGO_CRITERIOS_PNTP_2026.filter((c) => {
            const b = busca.toLowerCase();
            const matchBusca = !busca || 
                c.codigo.toLowerCase().includes(b) || 
                c.titulo.toLowerCase().includes(b) || 
                c.textoIntegral.toLowerCase().includes(b) ||
                c.dimensao.toLowerCase().includes(b);

            const matchDimensao = dimensaoFiltro === "TODAS" || c.dimensao === dimensaoFiltro;
            const matchClassificacao = classificacaoFiltro === "TODAS" || c.classificacao === classificacaoFiltro;

            return matchBusca && matchDimensao && matchClassificacao;
        });
    }, [busca, dimensaoFiltro, classificacaoFiltro]);

    const stats = useMemo(() => {
        const total = CATALOGO_CRITERIOS_PNTP_2026.length;
        const essenciais = CATALOGO_CRITERIOS_PNTP_2026.filter(c => c.classificacao === "ESSENCIAL").length;
        const obrigatorios = CATALOGO_CRITERIOS_PNTP_2026.filter(c => c.classificacao === "OBRIGATORIO").length;
        const recomendados = CATALOGO_CRITERIOS_PNTP_2026.filter(c => c.classificacao === "RECOMENDADO").length;
        return { total, essenciais, obrigatorios, recomendados };
    }, []);

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = filtrados.map(c => ({
            "Código": c.codigo,
            "Dimensão": c.dimensao,
            "Classificação": c.classificacao,
            "Critério / Requisito": c.textoIntegral,
            "Secretaria Responsável": c.secretariaResponsavel,
            "Página Pública no Portal": `https://sitelajespintadas.vercel.app${c.paginaPublica}`,
            "Situação": "Atendido / Conforme"
        }));

        const filename = `matriz_criterios_pntp_2026_${MUNICIPIO.nome.toLowerCase()}`;
        const title = `Matriz Oficial de Critérios PNTP 2026 – Executivo Municipal – ${MUNICIPIO.nome}/${MUNICIPIO.uf}`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Radar Nacional de Transparência Pública"
                subtitle="Matriz completa de conformidade do Executivo Municipal conforme a Cartilha PNTP 2026 e Ficha Oficial da ATRICON / Tribunais de Contas."
                icon={<FaShieldAlt />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Radar PNTP 2026" }
                ]}
            />

            {/* Banner Institucional de Meta */}
            <div className="bg-white border-b border-[#DDE3EA] py-3.5 px-4 sm:px-6 shadow-xs">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 font-bold text-[#12304A]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F39A32] animate-pulse" />
                        <span>Ciclo de Avaliação PNTP 2026 · ATRICON / TCE-RN / TCU</span>
                        <span className="hidden sm:inline text-[#5B738B]">· Todos os 96 Critérios da Cartilha Mapeados</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="https://radardatransparencia.atricon.org.br"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1254A3] text-white hover:bg-[#0d4282] rounded-lg font-bold transition-colors"
                        >
                            <span>Acessar Radar ATRICON</span>
                            <FaExternalLinkAlt size={10} />
                        </Link>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                
                {/* 1. CARDS DE RESUMO DA MATRIZ */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-[#DDE3EA] p-5 shadow-sm">
                        <div className="text-[10px] font-extrabold text-[#5B738B] uppercase tracking-wider mb-1">
                            Total de Critérios
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-[#12304A]">
                            {stats.total}
                        </div>
                        <div className="text-[11px] text-[#5B738B] mt-0.5 font-medium">
                            19 Dimensões Avaliadas
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#DDE3EA] p-5 shadow-sm">
                        <div className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider mb-1">
                            Critérios Essenciais
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-rose-700">
                            {stats.essenciais}
                        </div>
                        <div className="text-[11px] text-[#5B738B] mt-0.5 font-medium">
                            Itens de Cumprimento Crítico
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#DDE3EA] p-5 shadow-sm">
                        <div className="text-[10px] font-extrabold text-[#1254A3] uppercase tracking-wider mb-1">
                            Critérios Obrigatórios
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-[#1254A3]">
                            {stats.obrigatorios}
                        </div>
                        <div className="text-[11px] text-[#5B738B] mt-0.5 font-medium">
                            Obrigações Legais Específicas
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#DDE3EA] p-5 shadow-sm">
                        <div className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider mb-1">
                            Critérios Recomendados
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-amber-700">
                            {stats.recomendados}
                        </div>
                        <div className="text-[11px] text-[#5B738B] mt-0.5 font-medium">
                            Boas Práticas de Governança
                        </div>
                    </div>
                </div>

                {/* 2. BARRA DE FILTROS E PESQUISA */}
                <div className="bg-white rounded-2xl border border-[#DDE3EA] p-5 shadow-sm space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Campo de Busca */}
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder="Buscar por código (ex: 1.1, 7.2, 18.5), título ou palavras-chave..."
                                className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-medium text-[#12304A] outline-none focus:border-[#1254A3] focus:bg-white transition-all"
                            />
                        </div>

                        {/* Filtro de Dimensões */}
                        <div className="w-full lg:w-72">
                            <select
                                value={dimensaoFiltro}
                                onChange={(e) => setDimensaoFiltro(e.target.value)}
                                className="w-full bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#12304A] outline-none cursor-pointer focus:border-[#1254A3]"
                            >
                                <option value="TODAS">Todas as 19 Dimensões</option>
                                {DIMENSOES_LISTA.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro de Classificação */}
                        <div className="w-full lg:w-56">
                            <select
                                value={classificacaoFiltro}
                                onChange={(e) => setClassificacaoFiltro(e.target.value)}
                                className="w-full bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#12304A] outline-none cursor-pointer focus:border-[#1254A3]"
                            >
                                <option value="TODAS">Todas as Classificações</option>
                                <option value="ESSENCIAL">Apenas Essenciais</option>
                                <option value="OBRIGATORIO">Apenas Obrigatórios</option>
                                <option value="RECOMENDADO">Apenas Recomendados</option>
                            </select>
                        </div>

                        {/* Botões de Exportação */}
                        <div className="flex items-center gap-1.5 shrink-0">
                            <button
                                onClick={() => handleExport("pdf")}
                                className="p-2.5 bg-white hover:bg-red-50 text-red-600 border border-[#DDE3EA] rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                                title="Exportar PDF"
                            >
                                <FaFilePdf size={13} />
                                <span className="hidden sm:inline">PDF</span>
                            </button>
                            <button
                                onClick={() => handleExport("xlsx")}
                                className="p-2.5 bg-white hover:bg-emerald-50 text-emerald-600 border border-[#DDE3EA] rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                                title="Exportar Excel"
                            >
                                <FaFileExcel size={13} />
                                <span className="hidden sm:inline">Excel</span>
                            </button>
                            <button
                                onClick={() => handleExport("csv")}
                                className="p-2.5 bg-white hover:bg-blue-50 text-blue-600 border border-[#DDE3EA] rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                                title="Exportar CSV"
                            >
                                <FaFileCsv size={13} />
                                <span className="hidden sm:inline">CSV</span>
                            </button>
                        </div>
                    </div>

                    {/* Resumo dos Filtros Ativos */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#5B738B]">
                        <div>
                            Exibindo <strong>{filtrados.length}</strong> de <strong>{CATALOGO_CRITERIOS_PNTP_2026.length}</strong> critérios
                        </div>
                        {(busca || dimensaoFiltro !== "TODAS" || classificacaoFiltro !== "TODAS") && (
                            <button
                                onClick={() => {
                                    setBusca("");
                                    setDimensaoFiltro("TODAS");
                                    setClassificacaoFiltro("TODAS");
                                }}
                                className="text-[#1254A3] font-bold hover:underline cursor-pointer"
                            >
                                Limpar filtros
                            </button>
                        )}
                    </div>
                </div>

                {/* 3. GRADE DE CARDS DOS CRITÉRIOS (DESIGN PRINCIPAL) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtrados.map((c) => {
                        const isEssencial = c.classificacao === "ESSENCIAL";
                        const isObrigatorio = c.classificacao === "OBRIGATORIO";

                        return (
                            <div
                                key={c.codigo}
                                className="bg-white rounded-2xl border border-[#DDE3EA] hover:border-[#1254A3] shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group"
                            >
                                <div>
                                    {/* Topo do Card: Código e Badges */}
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#1254A3] font-black text-xs flex items-center justify-center border border-blue-100 group-hover:bg-[#1254A3] group-hover:text-white transition-colors">
                                                {c.codigo}
                                            </span>
                                            <span className="text-[10px] font-bold text-[#5B738B] truncate max-w-[150px]">
                                                {c.dimensao}
                                            </span>
                                        </div>

                                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                            isEssencial 
                                                ? "bg-rose-100 text-rose-800 border border-rose-200" 
                                                : isObrigatorio 
                                                ? "bg-blue-100 text-[#1254A3] border border-blue-200" 
                                                : "bg-amber-100 text-amber-800 border border-amber-200"
                                        }`}>
                                            {c.classificacao}
                                        </span>
                                    </div>

                                    {/* Título e Texto do Requisito */}
                                    <h3 className="text-sm font-extrabold text-[#12304A] group-hover:text-[#1254A3] transition-colors leading-snug mb-2">
                                        {c.titulo}
                                    </h3>

                                    <p className="text-xs text-[#5B738B] leading-relaxed mb-4">
                                        {c.textoIntegral}
                                    </p>

                                    {/* Pilares Exigidos */}
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {c.exigenciasCartilha.map((ex) => (
                                            <span 
                                                key={ex} 
                                                className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#F5F7FA] text-[#5B738B] border border-[#DDE3EA]"
                                            >
                                                ✓ {ex}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Rodapé do Card com Link Direto para a Página */}
                                <div className="pt-3 border-t border-[#DDE3EA] flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700">
                                        <FaCheckCircle size={11} className="text-emerald-500" />
                                        <span>Conforme</span>
                                    </div>

                                    <Link
                                        href={c.paginaPublica}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1254A3] hover:text-[#0d4282] transition-colors"
                                    >
                                        <span>Acessar no Portal</span>
                                        <FaArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <BannerPNTP />
            </main>
        </div>
    );
}
