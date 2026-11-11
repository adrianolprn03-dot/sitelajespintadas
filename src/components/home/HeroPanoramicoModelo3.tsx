"use client";

import Link from "next/link";
import { MUNICIPIO } from "@/config/municipio";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { 
    FaArrowRight, 
    FaShieldHalved, 
    FaFileLines, 
    FaBullhorn, 
    FaBookOpen, 
    FaReceipt, 
    FaIdCard 
} from "react-icons/fa6";

const atalhosPrincipais = [
    {
        label: "Portal da Transparência",
        sublabel: "Receitas, despesas e gestão fiscal",
        href: "/transparencia",
        icon: FaShieldHalved,
        destaque: true,
    },
    {
        label: "e-SIC",
        sublabel: "Acesso à Informação e pedidos",
        href: "/servicos/esic",
        icon: FaFileLines,
        destaque: false,
    },
    {
        label: "Ouvidoria",
        sublabel: "Elogios, sugestões e denúncias",
        href: "/servicos/ouvidoria",
        icon: FaBullhorn,
        destaque: false,
    },
    {
        label: "Diário Oficial",
        sublabel: "Atos administrativos e decretos",
        href: "/transparencia/legislacao",
        icon: FaBookOpen,
        destaque: false,
    },
    {
        label: "Contribuinte",
        sublabel: "IPTU, certidões e tributos",
        href: "/servicos/tributario",
        icon: FaReceipt,
        destaque: false,
    },
    {
        label: "Contracheque",
        sublabel: "Portal do Servidor e holerites",
        href: "/servicos/contracheque",
        icon: FaIdCard,
        destaque: false,
    },
];

export default function HeroPanoramicoModelo3() {
    return (
        <div className="space-y-8 sm:space-y-12">
            {/* ========================================================= */}
            {/* 1. SEÇÃO PRINCIPAL (SPLIT HERO LIMPO - CONFORME PRANCHA)  */}
            {/* ========================================================= */}
            <section className="bg-white border-b border-[#DDE3EA] py-8 sm:py-12 lg:py-16 relative overflow-hidden">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        
                        {/* Lado Esquerdo: Identidade Cívica, Título, Linha de Apoio e Busca */}
                        <div className="lg:col-span-6 space-y-6 text-left order-1">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200/70 rounded-full text-[11px] font-extrabold text-[#1254A3] uppercase tracking-wider shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-[#F39A32]" />
                                <span>{MUNICIPIO.nomeCompleto} • {MUNICIPIO.uf}</span>
                            </div>

                            <div className="space-y-3">
                                <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-[#12304A] font-heading tracking-tight leading-[1.08]">
                                    Lajes Pintadas, <br />
                                    <span className="text-[#1254A3]">mais perto de você.</span>
                                </h1>

                                <div className="h-1.5 w-20 bg-[#F39A32] rounded-full" />
                            </div>

                            <p className="text-base sm:text-lg text-[#5B738B] leading-relaxed max-w-xl font-medium">
                                Encontre rapidamente informações oficiais, serviços online e prestação de contas do município com transparência e agilidade.
                            </p>

                            {/* Campo de Busca Principal */}
                            <form
                                id="busca"
                                action="/transparencia"
                                method="GET"
                                className="bg-[#F5F7FA] p-2 rounded-2xl border-2 border-[#DDE3EA] focus-within:border-[#1254A3] focus-within:ring-4 focus-within:ring-[#1254A3]/10 flex flex-col sm:flex-row gap-2 shadow-sm max-w-xl transition-all"
                            >
                                <div className="flex-1 flex items-center px-3 gap-3">
                                    <HiMagnifyingGlass className="text-[#1254A3] text-xl shrink-0" />
                                    <input
                                        type="text"
                                        name="q"
                                        placeholder="O que você procura? Ex: IPTU, Licitações, Contracheque..."
                                        className="w-full bg-transparent text-sm text-[#12304A] placeholder-[#5B738B] font-medium focus:outline-none py-2"
                                        aria-label="Buscar no portal"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-[#1254A3] hover:bg-[#0d4282] text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors shrink-0 shadow-sm flex items-center justify-center gap-2"
                                >
                                    <span>Buscar</span>
                                </button>
                            </form>
                        </div>

                        {/* Lado Direito: Vídeo Oficial Limpo e Amplo */}
                        <div className="lg:col-span-6 relative order-2">
                            <div className="relative rounded-[20px] sm:rounded-[26px] overflow-hidden border border-[#DDE3EA] shadow-[0_16px_40px_rgba(0,43,92,0.12)] group bg-slate-900">
                                <div className="aspect-[16/11] sm:aspect-[16/10] relative w-full">
                                    <video
                                        src="/video_lajes_pintadas.mp4"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        poster="/images/historia-panoramica.jpg"
                                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                                    />
                                </div>

                                {/* Badge Superior no Vídeo */}
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                                        <span className="w-2 h-2 rounded-full bg-[#F39A32] animate-pulse" />
                                        <span>Vídeo Oficial • Lajes Pintadas/RN</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* 2. SEIS ATALHOS PRINCIPAIS (DESIGN SYSTEM DA PRANCHA)     */}
            {/* ========================================================= */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {atalhosPrincipais.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between group shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                                item.destaque
                                    ? "bg-[#1254A3] text-white border-[#1254A3] shadow-md shadow-[#1254A3]/15"
                                    : "bg-white text-[#12304A] border-[#DDE3EA] hover:border-[#1254A3]"
                            }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all ${
                                        item.destaque
                                            ? "bg-white/15 text-amber-300"
                                            : "bg-blue-50 text-[#1254A3] group-hover:bg-[#1254A3] group-hover:text-white"
                                    }`}
                                >
                                    <item.icon />
                                </div>
                                <FaArrowRight
                                    size={10}
                                    className={`opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ${
                                        item.destaque ? "text-amber-300" : "text-[#1254A3]"
                                    }`}
                                />
                            </div>

                            <div>
                                <span
                                    className={`block text-xs sm:text-sm font-extrabold font-heading leading-tight mb-1 ${
                                        item.destaque ? "text-white" : "text-[#12304A]"
                                    }`}
                                >
                                    {item.label}
                                </span>
                                <span
                                    className={`block text-[10px] line-clamp-1 ${
                                        item.destaque ? "text-white/80" : "text-[#5B738B]"
                                    }`}
                                >
                                    {item.sublabel}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
