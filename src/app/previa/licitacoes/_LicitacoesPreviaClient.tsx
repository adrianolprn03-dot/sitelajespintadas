"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
    FaGavel, 
    FaFileLines, 
    FaFilePdf, 
    FaDownload, 
    FaFilter, 
    FaRotateLeft, 
    FaBuildingColumns, 
    FaClock, 
    FaCheck, 
    FaArrowRight, 
    FaFileContract, 
    FaShieldHalved,
    FaArrowUpRightFromSquare
} from "react-icons/fa6";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { exportToCSV, exportToJSON, exportToXLSX } from "@/lib/exportUtils";
import { toast } from "react-hot-toast";

type LicitacaoItem = {
    id: string;
    numero: string;
    numeroProcesso?: string | null;
    ano: number;
    modalidade: string;
    objeto: string;
    valorEstimado?: number | null;
    valorHomologado?: number | null;
    status: string;
    dataAbertura?: string | null;
    dataHomologacao?: string | null;
    secretaria: string;
    amparoLegal?: string | null;
    editalUrl?: string | null;
    ataRegistroPreco?: boolean;
    fonteOrigem?: string | null;
};

function fmtMoeda(val?: number | null): string {
    if (val === null || val === undefined) return "Não informado";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
}

function fmtData(str?: string | null): string {
    if (!str) return "–";
    const d = new Date(str);
    if (isNaN(d.getTime())) return "–";
    return d.toLocaleDateString("pt-BR");
}

export default function LicitacoesPreviaClient({ licitacoes }: { licitacoes: LicitacaoItem[] }) {
    const [busca, setBusca] = useState("");
    const [modalidadeFiltro, setModalidadeFiltro] = useState("Todas");
    const [anoFiltro, setAnoFiltro] = useState("Todos");
    const [statusFiltro, setStatusFiltro] = useState("Todos");

    // Modalidades únicas
    const modalidades = useMemo(() => {
        const set = new Set(licitacoes.map((l) => l.modalidade).filter(Boolean));
        return ["Todas", ...Array.from(set).sort()];
    }, [licitacoes]);

    // Anos únicos
    const anos = useMemo(() => {
        const set = new Set(licitacoes.map((l) => String(l.ano)).filter(Boolean));
        return ["Todos", ...Array.from(set).sort().reverse()];
    }, [licitacoes]);

    // Status únicos
    const statuses = useMemo(() => {
        const set = new Set(licitacoes.map((l) => l.status).filter(Boolean));
        return ["Todas", ...Array.from(set).sort()];
    }, [licitacoes]);

    // Filtragem
    const filtradas = useMemo(() => {
        return licitacoes.filter((item) => {
            const matchBusca =
                busca.trim() === "" ||
                item.objeto.toLowerCase().includes(busca.toLowerCase()) ||
                item.numero.toLowerCase().includes(busca.toLowerCase()) ||
                (item.numeroProcesso && item.numeroProcesso.toLowerCase().includes(busca.toLowerCase())) ||
                item.secretaria.toLowerCase().includes(busca.toLowerCase());

            const matchModalidade = modalidadeFiltro === "Todas" || item.modalidade === modalidadeFiltro;
            const matchAno = anoFiltro === "Todos" || String(item.ano) === anoFiltro;
            const matchStatus = statusFiltro === "Todas" || item.status === statusFiltro;

            return matchBusca && matchModalidade && matchAno && matchStatus;
        });
    }, [licitacoes, busca, modalidadeFiltro, anoFiltro, statusFiltro]);

    const totalEstimado = filtradas.reduce((acc, curr) => acc + (curr.valorEstimado || 0), 0);
    const totalHomologado = filtradas.reduce((acc, curr) => acc + (curr.valorHomologado || 0), 0);

    const handleClear = () => {
        setBusca("");
        setModalidadeFiltro("Todas");
        setAnoFiltro("Todos");
        setStatusFiltro("Todas");
    };

    const handleExport = (formato: "csv" | "json" | "xlsx") => {
        const payload = filtradas.map((l) => ({
            "Número/Processo": `${l.numero} (${l.numeroProcesso || "-"})`,
            "Ano": l.ano,
            "Modalidade": l.modalidade,
            "Objeto": l.objeto,
            "Órgão Responsável": l.secretaria,
            "Valor Estimado (R$)": l.valorEstimado ?? 0,
            "Valor Homologado (R$)": l.valorHomologado ?? 0,
            "Situação": l.status,
            "Data Abertura": fmtData(l.dataAbertura),
            "Data Homologação": fmtData(l.dataHomologacao),
            "Amparo Legal": l.amparoLegal || "Lei nº 14.133/2021",
        }));

        const filename = `licitacoes_lajes_pintadas_${anoFiltro !== "Todos" ? anoFiltro : "geral"}`;
        const meta = {
            titulo: "Relatório de Licitações Públicas – Prefeitura Municipal de Lajes Pintadas/RN",
            fonte: "Portal Nacional de Contratações Públicas (PNCP) / Setor de Compras",
            filtros: `Busca: ${busca || "-"} | Modalidade: ${modalidadeFiltro} | Ano: ${anoFiltro} | Status: ${statusFiltro}`,
        };

        if (formato === "csv") exportToCSV(payload, filename, meta);
        if (formato === "json") exportToJSON(payload, filename, meta);
        if (formato === "xlsx") exportToXLSX(payload, filename, meta);
        toast.success(`Exportação em ${formato.toUpperCase()} gerada com sucesso!`);
    };

    const getStatusBadge = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes("homolog") || s.includes("conclu")) {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>{status}</span>
                </span>
            );
        }
        if (s.includes("abert") || s.includes("andamento")) {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1254A3] animate-pulse" />
                    <span>{status}</span>
                </span>
            );
        }
        if (s.includes("suspens") || s.includes("anál") || s.includes("revis")) {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F39A32]" />
                    <span>{status}</span>
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>{status}</span>
            </span>
        );
    };

    return (
        <div className="space-y-10 pb-20">
            {/* CABEÇALHO DA PÁGINA */}
            <div className="bg-white border-b border-[#DDE3EA] py-8">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                    <nav className="text-xs text-[#5B738B] mb-4 flex items-center gap-2" aria-label="Navegação estrutural">
                        <Link href="/previa" className="hover:text-[#1254A3] transition-colors">
                            Início
                        </Link>
                        <span>/</span>
                        <Link href="/previa/transparencia" className="hover:text-[#1254A3] transition-colors">
                            Transparência
                        </Link>
                        <span>/</span>
                        <span className="text-[#12304A] font-bold">Licitações Públicas</span>
                    </nav>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-full text-[11px] font-bold text-[#1254A3] uppercase tracking-wider mb-2">
                                <FaGavel size={11} className="text-[#F39A32]" />
                                <span>Contratações Públicas · Lei nº 14.133/2021 · Critério PNTP 8.1</span>
                            </div>
                            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#12304A] font-heading tracking-tight">
                                Licitações e Editais Oficiais
                            </h1>
                            <div className="h-1 w-16 bg-[#F39A32] rounded-full mt-2 mb-3" />
                            <p className="text-sm sm:text-base text-[#5B738B] max-w-3xl leading-relaxed">
                                Acompanhe editais na íntegra, atas de registro de preços, fases internas e externas, propostas homologadas e documentos técnicos das compras públicas de Lajes Pintadas/RN.
                            </p>
                        </div>

                        {/* Exportações Rápidas */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-[#5B738B] mr-1 hidden sm:inline">Exportar:</span>
                            <button
                                onClick={() => handleExport("csv")}
                                className="px-3 py-2 bg-white hover:bg-slate-50 text-[#12304A] border border-[#DDE3EA] rounded-[8px] text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                                title="Exportar dados para CSV"
                            >
                                <FaDownload size={11} className="text-[#1254A3]" /> CSV
                            </button>
                            <button
                                onClick={() => handleExport("xlsx")}
                                className="px-3 py-2 bg-white hover:bg-slate-50 text-[#12304A] border border-[#DDE3EA] rounded-[8px] text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                                title="Exportar dados para Excel"
                            >
                                <FaDownload size={11} className="text-emerald-700" /> XLSX
                            </button>
                            <button
                                onClick={() => handleExport("json")}
                                className="px-3 py-2 bg-white hover:bg-slate-50 text-[#12304A] border border-[#DDE3EA] rounded-[8px] text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                                title="Exportar dados para JSON"
                            >
                                <FaDownload size={11} className="text-amber-600" /> JSON
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CARDS DE RESUMO DE MÉTRICAS */}
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-[10px] border border-[#DDE3EA] previa-shadow">
                        <span className="block text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-1">
                            Processos Filtrados
                        </span>
                        <div className="text-2xl sm:text-3xl font-black text-[#12304A] font-heading tabular-num">
                            {filtradas.length} <span className="text-xs font-medium text-[#5B738B]">de {licitacoes.length}</span>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-[10px] border border-[#DDE3EA] previa-shadow">
                        <span className="block text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-1">
                            Total Estimado
                        </span>
                        <div className="text-xl sm:text-2xl font-black text-[#12304A] font-heading tabular-num text-blue-900">
                            {fmtMoeda(totalEstimado)}
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-[10px] border border-[#DDE3EA] previa-shadow">
                        <span className="block text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-1">
                            Total Homologado
                        </span>
                        <div className="text-xl sm:text-2xl font-black text-emerald-800 font-heading tabular-num">
                            {fmtMoeda(totalHomologado)}
                        </div>
                    </div>
                </div>
            </div>

            {/* PAINEL DE BUSCA E FILTROS */}
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="bg-white p-5 rounded-[10px] border border-[#DDE3EA] previa-shadow space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        {/* Campo de Busca */}
                        <div className="md:col-span-5 relative">
                            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B738B] text-lg" />
                            <input
                                type="text"
                                placeholder="Buscar por objeto, número, processo ou secretaria..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-[8px] text-xs font-medium text-[#12304A] placeholder-[#5B738B] focus:outline-none focus:border-[#1254A3] focus:ring-2 focus:ring-[#1254A3]/20 transition-all"
                            />
                        </div>

                        {/* Filtro Modalidade */}
                        <div className="md:col-span-3">
                            <select
                                value={modalidadeFiltro}
                                onChange={(e) => setModalidadeFiltro(e.target.value)}
                                className="w-full px-3 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-[8px] text-xs font-medium text-[#12304A] focus:outline-none focus:border-[#1254A3] focus:ring-2 focus:ring-[#1254A3]/20 transition-all"
                            >
                                <option value="Todas">Todas as Modalidades</option>
                                {modalidades.filter((m) => m !== "Todas").map((mod) => (
                                    <option key={mod} value={mod}>{mod}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro Ano */}
                        <div className="md:col-span-2">
                            <select
                                value={anoFiltro}
                                onChange={(e) => setAnoFiltro(e.target.value)}
                                className="w-full px-3 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-[8px] text-xs font-medium text-[#12304A] focus:outline-none focus:border-[#1254A3] focus:ring-2 focus:ring-[#1254A3]/20 transition-all"
                            >
                                <option value="Todos">Todos os Anos</option>
                                {anos.filter((a) => a !== "Todos").map((ano) => (
                                    <option key={ano} value={ano}>{ano}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro Status */}
                        <div className="md:col-span-2 flex items-center gap-2">
                            <select
                                value={statusFiltro}
                                onChange={(e) => setStatusFiltro(e.target.value)}
                                className="w-full px-3 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-[8px] text-xs font-medium text-[#12304A] focus:outline-none focus:border-[#1254A3] focus:ring-2 focus:ring-[#1254A3]/20 transition-all"
                            >
                                <option value="Todas">Todas Situações</option>
                                {statuses.filter((s) => s !== "Todas").map((st) => (
                                    <option key={st} value={st}>{st}</option>
                                ))}
                            </select>

                            {(busca || modalidadeFiltro !== "Todas" || anoFiltro !== "Todos" || statusFiltro !== "Todas") && (
                                <button
                                    onClick={handleClear}
                                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-[#5B738B] hover:text-[#12304A] rounded-[8px] transition-colors shrink-0"
                                    title="Limpar filtros"
                                >
                                    <FaRotateLeft size={13} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* TABELA DE RESULTADOS */}
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="bg-white rounded-[10px] border border-[#DDE3EA] previa-shadow overflow-hidden">
                    {filtradas.length === 0 ? (
                        <div className="p-12 text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-slate-100 text-[#5B738B] mx-auto flex items-center justify-center text-xl">
                                <FaGavel />
                            </div>
                            <h3 className="text-base font-bold text-[#12304A] font-heading">
                                Nenhuma licitação encontrada
                            </h3>
                            <p className="text-xs text-[#5B738B] max-w-md mx-auto">
                                Tente alterar os termos de busca ou redefinir os filtros de modalidade e ano para ver mais registros.
                            </p>
                            <button
                                onClick={handleClear}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1254A3] text-white text-xs font-bold rounded-[8px] hover:bg-[#0d4282] transition-colors mt-2"
                            >
                                <FaRotateLeft size={11} />
                                <span>Limpar todos os filtros</span>
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#F8FAFC] border-b border-[#DDE3EA] text-[11px] font-bold text-[#12304A] uppercase tracking-wider">
                                        <th className="py-3.5 px-4">Processo / Número</th>
                                        <th className="py-3.5 px-4">Modalidade</th>
                                        <th className="py-3.5 px-4 min-w-[280px]">Objeto</th>
                                        <th className="py-3.5 px-4 text-right">Valores (R$)</th>
                                        <th className="py-3.5 px-4">Abertura</th>
                                        <th className="py-3.5 px-4">Situação</th>
                                        <th className="py-3.5 px-4 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#DDE3EA] text-xs">
                                    {filtradas.map((item) => (
                                        <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                            {/* Número / Processo */}
                                            <td className="py-4 px-4 align-top">
                                                <span className="font-extrabold text-[#12304A] block">
                                                    {item.numero}
                                                </span>
                                                {item.numeroProcesso && (
                                                    <span className="text-[10px] text-[#5B738B] block mt-0.5">
                                                        {item.numeroProcesso}
                                                    </span>
                                                )}
                                                {item.ataRegistroPreco && (
                                                    <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded">
                                                        ARP
                                                    </span>
                                                )}
                                            </td>

                                            {/* Modalidade */}
                                            <td className="py-4 px-4 align-top">
                                                <span className="font-bold text-[#12304A] block">
                                                    {item.modalidade}
                                                </span>
                                                <span className="text-[10px] text-[#5B738B] block mt-0.5">
                                                    {item.secretaria}
                                                </span>
                                            </td>

                                            {/* Objeto */}
                                            <td className="py-4 px-4 align-top">
                                                <p className="text-xs text-[#12304A] leading-relaxed line-clamp-3">
                                                    {item.objeto}
                                                </p>
                                                {item.amparoLegal && (
                                                    <span className="text-[10px] text-[#5B738B] italic block mt-1">
                                                        Amparo: {item.amparoLegal}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Valores */}
                                            <td className="py-4 px-4 align-top text-right tabular-num whitespace-nowrap">
                                                <div>
                                                    <span className="text-[10px] text-[#5B738B] block">Estimado:</span>
                                                    <span className="font-bold text-[#12304A]">
                                                        {fmtMoeda(item.valorEstimado)}
                                                    </span>
                                                </div>
                                                {item.valorHomologado !== null && item.valorHomologado !== undefined && (
                                                    <div className="mt-1">
                                                        <span className="text-[10px] text-[#5B738B] block">Homologado:</span>
                                                        <span className="font-extrabold text-emerald-800">
                                                            {fmtMoeda(item.valorHomologado)}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Data Abertura */}
                                            <td className="py-4 px-4 align-top whitespace-nowrap">
                                                <span className="text-[#12304A] font-medium block">
                                                    {fmtData(item.dataAbertura)}
                                                </span>
                                                {item.dataHomologacao && (
                                                    <span className="text-[10px] text-[#5B738B] block mt-0.5">
                                                        Homol: {fmtData(item.dataHomologacao)}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Situação */}
                                            <td className="py-4 px-4 align-top">
                                                {getStatusBadge(item.status)}
                                            </td>

                                            {/* Ações / Documentos */}
                                            <td className="py-4 px-4 align-top text-center">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <a
                                                        href={item.editalUrl || "#"}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1254A3] hover:bg-[#0d4282] text-white text-[11px] font-bold rounded-[6px] shadow-sm transition-colors whitespace-nowrap"
                                                        title="Baixar Edital Oficial"
                                                    >
                                                        <FaFilePdf size={11} />
                                                        <span>Edital</span>
                                                    </a>
                                                    <Link
                                                        href={`/transparencia/licitacoes`}
                                                        className="text-[10px] text-[#1254A3] hover:underline font-semibold"
                                                    >
                                                        Detalhes
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* RODA-PÉ DE INFORMAÇÕES TÉCNICAS E INTEGRAÇÃO PNCP */}
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="bg-white p-4 rounded-[10px] border border-[#DDE3EA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#5B738B]">
                    <div className="flex items-center gap-2">
                        <FaShieldHalved className="text-[#1254A3]" />
                        <span>
                            Processos em conformidade com o <strong>Portal Nacional de Contratações Públicas (PNCP)</strong> e <strong>Tribunal de Contas do Estado do Rio Grande do Norte (TCE-RN)</strong>.
                        </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <FaCheck size={11} /> Critério PNTP 8.1 Atendido
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

