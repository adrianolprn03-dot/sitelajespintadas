"use client";

import { useState } from "react";
import type { Metadata } from "next";
import {
    FaMusic,
    FaRunning,
    FaTheaterMasks,
    FaFileAlt,
    FaDownload,
    FaEye,
    FaInfoCircle,
    FaCalendarAlt,
    FaCheckCircle,
    FaShieldAlt,
    FaBalanceScale,
    FaExclamationTriangle,
} from "react-icons/fa";
import { Star, AlertCircle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import PDFViewer from "@/components/transparencia/PDFViewer";
import { AnimatePresence } from "framer-motion";

const BASE_LEGAL = [
    {
        lei: "Lei Federal nº 12.527/2011",
        descricao: "Lei de Acesso à Informação (LAI) – obriga a divulgação ativa de atos administrativos de incentivo",
        cor: "blue",
    },
    {
        lei: "Lei Complementar nº 101/2000",
        descricao: "Lei de Responsabilidade Fiscal – art. 48 determina publicidade das renúncias de receitas",
        cor: "emerald",
    },
    {
        lei: "Lei Federal nº 13.709/2018",
        descricao: "Lei Geral de Proteção de Dados (LGPD) – proteção dos dados dos beneficiários",
        cor: "violet",
    },
    {
        lei: "Lei Federal nº 14.129/2021",
        descricao: "Governo Digital – transparência ativa e dados abertos em plataformas digitais",
        cor: "amber",
    },
    {
        lei: "Decreto Federal nº 9.203/2017",
        descricao: "Política de Governança Pública – princípios de integridade e transparência",
        cor: "rose",
    },
    {
        lei: "Portaria SECOM/PR – PNTP",
        descricao: "Política Nacional de Transparência Pública – padrões mínimos de divulgação de incentivos culturais e esportivos",
        cor: "cyan",
    },
];

const CATEGORIAS = [
    {
        icone: FaTheaterMasks,
        titulo: "Incentivos à Cultura",
        descricao: "Incentivos fiscais, subvenções e auxílios para projetos artísticos, culturais e manifestações folclóricas locais.",
        cor: "from-purple-500 to-violet-600",
        corBorda: "border-l-purple-500",
        status: "Nenhum projeto aprovado",
    },
    {
        icone: FaRunning,
        titulo: "Incentivos ao Esporte",
        descricao: "Patrocínios, bolsas e fomento a competições esportivas, escolinhas e atletas representativos do município.",
        cor: "from-blue-500 to-cyan-600",
        corBorda: "border-l-blue-500",
        status: "Nenhum projeto aprovado",
    },
    {
        icone: FaMusic,
        titulo: "Incentivos ao Lazer",
        descricao: "Apoio a festividades municipais, eventos de lazer comunitário e atividades de integração social.",
        cor: "from-amber-500 to-orange-600",
        corBorda: "border-l-amber-500",
        status: "Nenhum projeto aprovado",
    },
];

export default function IncentivosCulturaisPage() {
    const [pdfViewer, setPdfViewer] = useState<{ url: string; titulo: string } | null>(null);

    const declaracaoPDF = {
        url: "/docs/incentivos/declaracao-inexistencia-incentivos-2026.pdf",
        titulo: "Declaração de Inexistência de Projetos Aprovados – Incentivos Culturais e Esportivos 2026",
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Incentivos Culturais e Esportivos"
                subtitle="Divulgação dos programas de fomento à cultura, ao esporte e ao lazer, conforme determinação da PNTP e da Lei de Acesso à Informação."
                variant="premium"
                icon={<Star />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Incentivos Culturais e Esportivos" },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12">

                {/* === DECLARAÇÃO DE INEXISTÊNCIA === */}
                <div className="mb-14">
                    {/* Aviso de Destaque */}
                    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl border border-slate-700/50 mb-8">
                        {/* Efeito de fundo */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-blue-500/5" />
                        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />

                        <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
                            {/* Ícone e status */}
                            <div className="flex-shrink-0 flex flex-col items-center gap-3">
                                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/30">
                                    <FaExclamationTriangle size={36} className="text-white" />
                                </div>
                                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 border border-amber-400/30 px-3 py-1.5 rounded-full whitespace-nowrap">
                                    Declaração Oficial
                                </span>
                            </div>

                            {/* Conteúdo da declaração */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-0.5 bg-amber-400 rounded-full" />
                                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">
                                        Transparência Ativa – PNTP
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-4">
                                    Declaração de Inexistência de<br />
                                    <span className="text-amber-400">Projetos Aprovados</span>
                                </h2>
                                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-6 max-w-2xl">
                                    A Prefeitura Municipal de Lajes Pintadas declara formalmente, com data-base de{" "}
                                    <strong className="text-white">01 de janeiro de 2026</strong>, que{" "}
                                    <strong className="text-amber-300">NÃO EXISTEM projetos aprovados</strong>{" "}
                                    no âmbito dos programas de incentivo à cultura, ao esporte e ao lazer neste município,
                                    em cumprimento às diretrizes da Política Nacional de Transparência Pública (PNTP)
                                    e da Lei Federal nº 12.527/2011 (Lei de Acesso à Informação).
                                </p>

                                {/* Data e assinatura */}
                                <div className="flex flex-wrap items-center gap-4 mb-8">
                                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5">
                                        <FaCalendarAlt size={13} className="text-amber-400" />
                                        <div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Data de Referência</div>
                                            <div className="text-xs font-black text-white">01/01/2026</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5">
                                        <FaCheckCircle size={13} className="text-emerald-400" />
                                        <div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status da Declaração</div>
                                            <div className="text-xs font-black text-emerald-300">Vigente</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5">
                                        <FaShieldAlt size={13} className="text-blue-400" />
                                        <div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Conformidade</div>
                                            <div className="text-xs font-black text-blue-300">PNTP / LAI</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Botões de ação */}
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => setPdfViewer(declaracaoPDF)}
                                        className="group flex items-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
                                    >
                                        <FaEye size={13} />
                                        Visualizar Declaração (PDF)
                                    </button>
                                    <a
                                        href="/docs/incentivos/declaracao-inexistencia-incentivos-2026.pdf"
                                        download
                                        className="group flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
                                    >
                                        <FaDownload size={13} />
                                        Baixar Declaração
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detalhamento da Declaração */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-lg p-8 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-1 bg-amber-500 rounded-full" />
                            <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter">
                                O que esta declaração abrange?
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Incentivos fiscais – isenções, reduções ou diferimentos de tributos municipais;",
                                "Subvenções, auxílios e contribuições financeiras a entidades culturais e esportivas;",
                                "Patrocínios, prêmios e bolsas vinculadas a projetos esportivos ou artísticos;",
                                "Contratos, convênios ou acordos de cooperação para fomento cultural e esportivo;",
                                "Títulos de utilidade pública com efeito financeiro em atividades culturais;",
                                "Qualquer outro benefício de natureza econômica a projetos de cultura, esporte e lazer.",
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-[9px] font-black text-amber-700">{i + 1}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm font-medium leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Compromisso de Publicação Futura */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-[2rem] p-7 flex items-start gap-4">
                        <FaInfoCircle size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-black text-emerald-800 text-sm mb-1">Compromisso de Publicação</p>
                            <p className="text-emerald-700 text-sm font-medium leading-relaxed">
                                Caso haja aprovação futura de qualquer projeto de incentivo, a Prefeitura de Lajes Pintadas
                                publicará imediatamente nesta página as informações completas: identificação do beneficiário,
                                natureza e valor do incentivo, prazo de vigência, contrapartidas exigidas e critérios de seleção.
                            </p>
                        </div>
                    </div>
                </div>

                {/* === CATEGORIAS DE INCENTIVOS === */}
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <div className="w-8 h-1 bg-purple-600 rounded-full" /> Categorias de Incentivos Monitoradas
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
                    {CATEGORIAS.map((cat, i) => (
                        <div
                            key={i}
                            className={`group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 overflow-hidden hover:shadow-2xl transition-all duration-500`}
                        >
                            <div className={`h-2 bg-gradient-to-r ${cat.cor}`} />
                            <div className="p-8">
                                <div className={`w-14 h-14 bg-gradient-to-br ${cat.cor} text-white rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <cat.icone size={24} />
                                </div>
                                <h3 className="font-black text-gray-800 text-base uppercase tracking-tighter mb-2 group-hover:text-purple-600 transition-colors">
                                    {cat.titulo}
                                </h3>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-5">{cat.descricao}</p>
                                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                                    <AlertCircle size={14} className="text-red-500 shrink-0" />
                                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                                        {cat.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* === BASE LEGAL === */}
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <div className="w-8 h-1 bg-blue-600 rounded-full" /> Base Legal
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
                    {BASE_LEGAL.map((item, i) => {
                        const cores: Record<string, string> = {
                            blue: "bg-blue-50 border-blue-200 text-blue-600",
                            emerald: "bg-emerald-50 border-emerald-200 text-emerald-600",
                            violet: "bg-violet-50 border-violet-200 text-violet-600",
                            amber: "bg-amber-50 border-amber-200 text-amber-600",
                            rose: "bg-rose-50 border-rose-200 text-rose-600",
                            cyan: "bg-cyan-50 border-cyan-200 text-cyan-600",
                        };
                        const estilo = cores[item.cor] || cores.blue;
                        return (
                            <div key={i} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 flex items-start gap-4">
                                <div className={`${estilo} border rounded-xl p-2.5 shrink-0`}>
                                    <FaBalanceScale size={16} />
                                </div>
                                <div>
                                    <div className="font-black text-gray-800 text-sm mb-1">{item.lei}</div>
                                    <div className="text-gray-500 text-xs font-medium leading-relaxed">{item.descricao}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* === DOCUMENTO DISPONÍVEL === */}
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <div className="w-8 h-1 bg-slate-600 rounded-full" /> Documento Disponível
                </h2>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden mb-14">
                    <div className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                            <FaFileAlt size={28} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Documento Oficial</div>
                            <h3 className="font-black text-gray-800 text-lg mb-1">
                                Declaração de Inexistência de Projetos Aprovados
                            </h3>
                            <p className="text-gray-500 text-sm font-medium">
                                Incentivos Culturais, Esportivos e de Lazer · Data de referência: 01/01/2026 · Formato: PDF
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                            <button
                                onClick={() => setPdfViewer(declaracaoPDF)}
                                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <FaEye size={13} /> Visualizar
                            </button>
                            <a
                                href="/docs/incentivos/declaracao-inexistencia-incentivos-2026.pdf"
                                download
                                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <FaDownload size={13} /> Baixar PDF
                            </a>
                        </div>
                    </div>
                </div>

                <BannerPNTP />
            </div>

            {/* PDF Viewer Modal */}
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
