"use client";

import { useState, useEffect, useMemo } from "react";
import { 
    FaHandshake, FaSpinner, FaBuilding, FaCalendar, 
    FaMoneyBillWave, FaArrowRight, FaHistory, FaCheckCircle, 
    FaTimesCircle, FaInfoCircle, FaFileSignature, FaLayerGroup,
    FaFileAlt, FaExternalLinkAlt, FaSearch, FaDownload, FaFilePdf
} from "react-icons/fa";
import { 
    FaMagnifyingGlass, FaBuildingColumns, FaShieldHalved,
    FaArrowTrendUp, FaFileLines
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { MUNICIPIO } from "@/config/municipio";

type Convenio = {
    id: string;
    numero: string;
    ano: number | null;
    tipoConvenio: string; // "recebido" ou "concedido"
    objeto: string;
    concedente: string;
    beneficiario: string | null;
    cnpjParticipe: string | null;
    valor: number;
    contrapartida: number;
    valorLiberado: number | null;
    dataInicio: string;
    dataFim: string;
    secretaria: string;
    status: string;
    arquivoInteiroTeor: string | null;
};

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
        case "vigente": return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "concluido": return "bg-blue-50 text-blue-700 border-blue-200";
        case "cancelado": return "bg-rose-50 text-rose-700 border-rose-200";
        default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function ConveniosPage() {
    const [convenios, setConvenios] = useState<Convenio[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [status, setStatus] = useState("");
    const [abaTipo, setAbaTipo] = useState<"todos" | "concedido" | "recebido">("todos");

    useEffect(() => {
        const fetchConvenios = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    ano,
                    status,
                    query: busca,
                    ...(abaTipo !== "todos" && { tipo: abaTipo })
                });
                const res = await fetch(`/api/convenios?${query.toString()}`);
                const data = await res.json();
                setConvenios(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar convênios:", error);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchConvenios, 300);
        return () => clearTimeout(timer);
    }, [ano, status, busca, abaTipo]);

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setStatus("");
        setAbaTipo("todos");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = convenios.map(c => {
            const isConcedido = c.tipoConvenio === "concedido" || c.tipoConvenio === "realizado";
            return {
                "Operação": isConcedido ? "Transferência Concedida (5.2)" : "Transferência Recebida",
                "Número": c.numero,
                "Exercício": c.ano || (c.dataInicio ? new Date(c.dataInicio).getFullYear() : "-"),
                "Partícipe": isConcedido ? (c.beneficiario || "Beneficiário") : c.concedente,
                "CNPJ Partícipe": c.cnpjParticipe || "-",
                "Objeto": c.objeto,
                "Vigência": `${new Date(c.dataInicio).toLocaleDateString("pt-BR")} a ${new Date(c.dataFim).toLocaleDateString("pt-BR")}`,
                "Valor Previsto": fmt(c.valor),
                "Valor Concedido / Liberado": fmt(c.valorLiberado || 0),
                "Contrapartida": fmt(c.contrapartida),
                "Status": c.status?.toUpperCase(),
                "Inteiro Teor": c.arquivoInteiroTeor || "Publicado no Portal"
            };
        });

        const filename = `convenios_transferencias_lajes_pintadas`;
        const title = `Relatório de Convênios e Transferências – Prefeitura de Lajes Pintadas/RN (Critério 5.2)`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const totalValor = useMemo(() => convenios.reduce((acc, curr) => acc + (curr.valor || 0), 0), [convenios]);
    const totalLiberado = useMemo(() => convenios.reduce((acc, curr) => acc + (curr.valorLiberado || 0), 0), [convenios]);
    const totalConcedidas = useMemo(() => convenios.filter(c => c.tipoConvenio === "concedido" || c.tipoConvenio === "realizado").length, [convenios]);
    const totalRecebidas = useMemo(() => convenios.filter(c => c.tipoConvenio === "recebido").length, [convenios]);

    return (
        <div className="min-h-screen bg-[#F5F7FA]">
            <PageHeader
                title="Convênios e Transferências"
                subtitle="Transparência sobre transferências concedidas (município para OSCs e entidades parceiras - Critério 5.2) e transferências recebidas dos governos federal e estadual."
                icon={<FaHandshake />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Convênios e Transferências" }
                ]}
            />

            <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
                {/* Abas e Ações de Exportação */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#DDE3EA] shadow-sm flex-wrap">
                        <button
                            onClick={() => setAbaTipo("todos")}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                abaTipo === "todos"
                                    ? "bg-[#1254A3] text-white shadow-sm"
                                    : "text-[#5B738B] hover:text-[#12304A]"
                            }`}
                        >
                            Todas as Parcerias ({convenios.length})
                        </button>
                        <button
                            onClick={() => setAbaTipo("concedido")}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                abaTipo === "concedido"
                                    ? "bg-pink-600 text-white shadow-sm"
                                    : "text-[#5B738B] hover:text-[#12304A]"
                            }`}
                        >
                            Transferências Concedidas (Critério 5.2)
                        </button>
                        <button
                            onClick={() => setAbaTipo("recebido")}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                abaTipo === "recebido"
                                    ? "bg-[#1254A3] text-white shadow-sm"
                                    : "text-[#5B738B] hover:text-[#12304A]"
                            }`}
                        >
                            Transferências Recebidas
                        </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-[#5B738B] mr-1 hidden md:inline">Exportar Relatório:</span>
                        <button
                            onClick={() => handleExport("pdf")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE3EA] text-[#12304A] rounded-lg text-xs font-bold hover:border-[#1254A3] transition-all shadow-sm cursor-pointer"
                        >
                            <FaDownload size={10} /> PDF
                        </button>
                        <button
                            onClick={() => handleExport("xlsx")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE3EA] text-[#12304A] rounded-lg text-xs font-bold hover:border-[#1254A3] transition-all shadow-sm cursor-pointer"
                        >
                            <FaDownload size={10} /> Excel
                        </button>
                        <button
                            onClick={() => handleExport("csv")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE3EA] text-[#12304A] rounded-lg text-xs font-bold hover:border-[#1254A3] transition-all shadow-sm cursor-pointer"
                        >
                            <FaDownload size={10} /> CSV
                        </button>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div className="bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm">
                        <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider block mb-2">Volume Total Previsto</span>
                        <h3 className="text-2xl font-black text-[#12304A] tracking-tight">{loading ? "..." : fmt(totalValor)}</h3>
                        <p className="text-xs text-[#5B738B] mt-2 pt-2 border-t border-[#DDE3EA]">Exercício {ano}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm">
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Total Efetivamente Repassado</span>
                        <h3 className="text-2xl font-black text-emerald-700 tracking-tight">{loading ? "..." : fmt(totalLiberado)}</h3>
                        <p className="text-xs text-[#5B738B] mt-2 pt-2 border-t border-[#DDE3EA]">Valores liberados/pagos</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm">
                        <span className="text-xs font-bold text-pink-700 uppercase tracking-wider block mb-2">Transferências Concedidas</span>
                        <h3 className="text-2xl font-black text-pink-700 tracking-tight">{loading ? "..." : totalConcedidas}</h3>
                        <p className="text-xs text-[#5B738B] mt-2 pt-2 border-t border-[#DDE3EA]">Critério PNTP 5.2 (OSCs e consórcios)</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm">
                        <span className="text-xs font-bold text-[#1254A3] uppercase tracking-wider block mb-2">Recorte Municipal Oficial</span>
                        <h3 className="text-base font-black text-[#12304A] tracking-tight">Lajes Pintadas • RN</h3>
                        <p className="text-[11px] font-mono text-[#5B738B] mt-2 pt-2 border-t border-[#DDE3EA]">
                            IBGE {MUNICIPIO.ibge} • CNPJ {MUNICIPIO.cnpj}
                        </p>
                    </div>
                </div>

                {/* Filtros de Busca */}
                <div className="bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-2">
                                Buscar por Objeto, Número, Beneficiário ou Concedente
                            </label>
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    placeholder="Ex: Saúde, Associação, Transporte, Termo..."
                                    className="w-full bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl pl-11 pr-4 py-2.5 text-xs font-medium text-[#12304A] focus:border-[#1254A3] focus:bg-white outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-2">Exercício / Ano</label>
                            <select
                                value={ano}
                                onChange={(e) => setAno(e.target.value)}
                                className="w-full bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl px-4 py-2.5 text-xs font-bold text-[#12304A] focus:border-[#1254A3] outline-none"
                            >
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-2">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl px-4 py-2.5 text-xs font-bold text-[#12304A] focus:border-[#1254A3] outline-none"
                            >
                                <option value="">Todos os status</option>
                                <option value="vigente">Vigente</option>
                                <option value="concluido">Concluído</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Conteúdo: Lista de Instrumentos ou Declaração Oficial de Inexistência */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="bg-white rounded-2xl p-16 text-center border border-[#DDE3EA] shadow-sm">
                            <FaSpinner className="animate-spin text-3xl text-[#1254A3] mx-auto mb-3" />
                            <p className="text-xs font-bold text-[#5B738B] uppercase tracking-wider">Consultando base de convênios e transferências...</p>
                        </div>
                    ) : convenios.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-[#DDE3EA] shadow-sm space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#F39A32] flex items-center justify-center mx-auto text-2xl">
                                <FaFileAlt />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                                Declaração Oficial de Inexistência • Critério 5.2
                            </span>
                            <h4 className="text-xl font-black text-[#12304A]">
                                Não Houve Transferências Concedidas no Exercício Selecionado
                            </h4>
                            <p className="text-xs text-[#5B738B] max-w-xl mx-auto leading-relaxed">
                                A Prefeitura Municipal de Lajes Pintadas/RN declara formalmente, para fins de transparência pública ativa e cumprimento do Critério 5.2 do PNTP, que não realizou transferências voluntárias ou termos de fomento concedidos a entidades no período consultado ({ano}).
                            </p>
                            <div className="pt-2 flex justify-center gap-3">
                                <button
                                    onClick={handleClearFilters}
                                    className="px-5 py-2.5 bg-[#1254A3] text-white rounded-xl text-xs font-bold hover:bg-[#0d4282] transition-all cursor-pointer"
                                >
                                    Ver Todos os Exercícios
                                </button>
                                <a
                                    href={`https://portaldatransparencia.gov.br/transferencias/por-municipio?codigoIbge=2406601&anoReferencia=${ano}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                                >
                                    <FaExternalLinkAlt size={11} /> Confirmar no Portal Federal (IBGE 2406601)
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {convenios.map((c) => {
                                const isConcedido = c.tipoConvenio === "concedido" || c.tipoConvenio === "realizado";
                                return (
                                    <motion.div
                                        key={c.id}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="bg-white rounded-3xl border border-[#DDE3EA] shadow-sm hover:border-[#1254A3]/50 transition-all p-6 sm:p-8"
                                    >
                                        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6 pb-6 border-b border-slate-100">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                                                        isConcedido
                                                            ? "bg-pink-50 text-pink-700 border-pink-200"
                                                            : "bg-blue-50 text-blue-700 border-blue-200"
                                                    }`}>
                                                        {isConcedido ? "Transferência Concedida (Critério 5.2)" : "Transferência Recebida"}
                                                    </span>
                                                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${getStatusStyles(c.status)}`}>
                                                        {c.status}
                                                    </span>
                                                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                                                        Vigência: {new Date(c.dataInicio).toLocaleDateString("pt-BR")} a {new Date(c.dataFim).toLocaleDateString("pt-BR")}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg sm:text-xl font-black text-[#12304A]">
                                                    Instrumento Nº {c.numero}
                                                </h3>
                                                <p className="text-xs text-slate-500 font-medium mt-1">
                                                    <strong className="text-slate-800">
                                                        {isConcedido ? "Entidade Beneficiária:" : "Ente Concedente:"}
                                                    </strong>{" "}
                                                    {isConcedido ? (c.beneficiario || "Beneficiário Municipal") : c.concedente}
                                                    {c.cnpjParticipe && ` (CNPJ: ${c.cnpjParticipe})`}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="bg-[#F5F7FA] px-6 py-4 rounded-2xl border border-[#DDE3EA] text-right">
                                                    <span className="text-[10px] font-bold uppercase text-[#5B738B] block mb-0.5">
                                                        {isConcedido ? "Valor Previsto" : "Valor do Repasse"}
                                                    </span>
                                                    <span className="text-xl font-black text-[#12304A]">{fmt(c.valor)}</span>
                                                </div>
                                                {isConcedido && c.valorLiberado !== null && c.valorLiberado !== undefined && (
                                                    <div className="bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-200 text-right">
                                                        <span className="text-[10px] font-bold uppercase text-emerald-800 block mb-0.5">
                                                            Valor Concedido / Pago
                                                        </span>
                                                        <span className="text-xl font-black text-emerald-700">{fmt(c.valorLiberado)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-[10px] font-bold text-[#5B738B] uppercase tracking-wider block mb-1">
                                                    Objeto e Finalidade Pública (Critério 5.2)
                                                </span>
                                                <p className="text-sm text-[#12304A] bg-[#F5F7FA] p-4 rounded-2xl border border-[#DDE3EA] leading-relaxed">
                                                    "{c.objeto}"
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                                                <span className="text-xs text-[#5B738B]">
                                                    Secretaria Gestora: <strong className="text-[#12304A]">{c.secretaria}</strong>
                                                </span>

                                                <div className="flex items-center gap-3">
                                                    {c.arquivoInteiroTeor ? (
                                                        <a
                                                            href={c.arquivoInteiroTeor}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 bg-[#1254A3] hover:bg-[#0d4282] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
                                                        >
                                                            <FaFilePdf size={12} />
                                                            Inteiro Teor do Instrumento (Critério 5.2)
                                                            <FaExternalLinkAlt size={10} />
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">
                                                            Inteiro teor arquivado fisicamente no Setor de Convênios
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </AnimatePresence>

                <div className="mt-12 space-y-6">
                    <BannerPNTP />
                    <div className="text-center pt-2">
                        <p className="text-xs text-[#5B738B]">
                            PORTAL DA TRANSPARÊNCIA • PREFEITURA DE LAJES PINTADAS/RN <br/>
                            <span className="italic">
                                Identificador Municipal Oficial: Código IBGE 2406601 • CNPJ 08.159.394/0001-37 (Distinto de Lajes/RN - IBGE 2406700).
                            </span>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
