"use client";

import Link from "next/link";
import { MUNICIPIO } from "@/config/municipio";
import {
    HiMagnifyingGlass,
    HiOutlineDocumentText,
    HiOutlineUser,
    HiOutlineCreditCard,
    HiOutlineShieldCheck,
    HiOutlineInformationCircle,
    HiOutlineSparkles,
} from "react-icons/hi2";
import { FaComments } from "react-icons/fa6";

const quickLinks = [
    {
        label: "Transparência",
        href: "/transparencia",
        icon: HiOutlineShieldCheck,
    },
    {
        label: "Licitações",
        href: "/transparencia/licitacoes",
        icon: HiOutlineDocumentText,
    },
    {
        label: "Contracheque",
        href: "/servicos/contracheque",
        icon: HiOutlineCreditCard,
    },
    {
        label: "Ouvidoria / e-SIC",
        href: "/servicos/ouvidoria",
        icon: FaComments,
    },
];

const atalhosPrincipais = [
    {
        title: "Transparência",
        subtitle: "Receitas e Despesas",
        href: "/transparencia",
        icon: HiMagnifyingGlass,
    },
    {
        title: "e-SIC",
        subtitle: "Acesso à Informação",
        href: "/servicos/esic",
        icon: HiOutlineInformationCircle,
    },
    {
        title: "Ouvidoria",
        subtitle: "Voz do Cidadão",
        href: "/servicos/ouvidoria",
        icon: FaComments,
    },
    {
        title: "Diário Oficial",
        subtitle: "Atos e Decretos",
        href: "/transparencia/legislacao",
        icon: HiOutlineDocumentText,
    },
    {
        title: "Contribuinte",
        subtitle: "IPTU e Certidões",
        href: "/servicos/tributario",
        icon: HiOutlineUser,
    },
    {
        title: "Contracheque",
        subtitle: "Holerite Online",
        href: "/servicos/contracheque",
        icon: HiOutlineCreditCard,
    },
];

export default function HeroPanoramicoModelo3() {
    return (
        <section className="relative pt-3 sm:pt-5 pb-2">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
                {/* =====================================================================
                    1. BANNER PANORÂMICO COM VÍDEO OFICIAL (ALTA LEGIBILIDADE E CONTRASTE)
                   ===================================================================== */}
                <div className="relative rounded-[26px] sm:rounded-[30px] overflow-hidden shadow-[0_20px_50px_rgba(0,43,92,0.16)] border border-white/60 min-h-[380px] sm:min-h-[430px] flex items-center">
                    {/* Vídeo Oficial Existente no Portal */}
                    <video
                        src="/video_lajes_pintadas.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster="/images/historia-panoramica.jpg"
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Overlay Institucional Gradiente - Mantém o vídeo visível com contraste impecável para leitura */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(105deg, rgba(0, 32, 70, 0.88) 0%, rgba(0, 59, 115, 0.65) 55%, rgba(0, 38, 84, 0.30) 100%)",
                        }}
                    />

                    {/* Filete Superior Heráldico Azul & Amarelo */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 heraldic-stripe z-20" />

                    {/* Conteúdo Institucional Focado na Busca e Acesso Rápido */}
                    <div className="relative z-10 w-full p-6 sm:p-10 lg:p-12">
                        <div className="max-w-2xl space-y-5 text-left">
                            {/* Tag do Município */}
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-[#FACC15]/60 text-[11px] font-extrabold uppercase tracking-wider text-[#FACC15] shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-pulse" />
                                <span>{MUNICIPIO.nomeCompleto} • {MUNICIPIO.uf}</span>
                            </span>

                            {/* Título Principal e Subtítulo com Alto Contraste e Linha de Apoio */}
                            <div className="space-y-3">
                                <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-white font-heading tracking-tight leading-[1.14] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                                    Serviços Públicos e Transparência ao Alcance do Cidadão
                                </h1>
                                <div className="flex items-start gap-3 max-w-xl">
                                    <div className="w-1.5 h-11 rounded-full bg-[#FACC15] shrink-0 mt-0.5 shadow-sm hidden sm:block" />
                                    <p className="text-sm sm:text-base text-white/95 font-medium leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                                        Encontre rapidamente informações oficiais, serviços online e prestação de contas do município.
                                    </p>
                                </div>
                            </div>

                            {/* Barra de Busca Principal */}
                            <form
                                id="busca"
                                action="/transparencia"
                                method="GET"
                                className="bg-white/95 backdrop-blur-xl p-1.5 rounded-full border-2 border-white focus-within:border-[#FACC15] focus-within:ring-2 focus-within:ring-[#FACC15]/30 flex items-center shadow-[0_10px_30px_rgba(0,0,0,0.25)] max-w-xl transition-all duration-200"
                            >
                                <div className="flex-1 flex items-center pl-4 pr-2 gap-2.5">
                                    <HiMagnifyingGlass className="text-[#0072CE] text-lg shrink-0" />
                                    <input
                                        type="text"
                                        name="q"
                                        placeholder="O que você procura? Ex: IPTU, Licitações, Contracheque, Ouvidoria..."
                                        className="w-full bg-transparent text-xs sm:text-sm text-[#0F2942] placeholder-slate-400 font-medium focus:outline-none py-2"
                                        aria-label="Buscar serviços ou dados no portal"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-[#0072CE] hover:bg-[#005bb5] text-white text-xs font-extrabold px-5 sm:px-6 py-2.5 rounded-full transition-all shrink-0 shadow-sm border border-[#FACC15] flex items-center gap-1.5"
                                >
                                    <span>Buscar</span>
                                </button>
                            </form>

                            {/* Acesso Direto com Ícones nos Chips ("Mais Buscados") */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#FACC15] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] mr-1">
                                    <HiOutlineSparkles className="text-sm text-[#FACC15]" />
                                    Mais buscados:
                                </span>
                                {quickLinks.map((chip, idx) => {
                                    const ChipIcon = chip.icon;
                                    return (
                                        <Link
                                            key={idx}
                                            href={chip.href}
                                            className="group inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/20 hover:bg-[#FACC15] hover:text-[#0F2942] hover:border-[#FACC15] backdrop-blur-md border border-white/35 px-3.5 py-1.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                                        >
                                            <ChipIcon className="text-sm text-[#FACC15] group-hover:text-[#0F2942] transition-colors shrink-0" />
                                            <span>{chip.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* =====================================================================
                    2. ACESSO RÁPIDO AOS SERVIÇOS (6 ATALHOS EM DOCK ELEVADO - CONFORME DESIGN SYSTEM)
                   ===================================================================== */}
                <div className="mt-5 sm:-mt-8 relative z-20 px-1 sm:px-2">
                    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#DCE4EE] shadow-[0_12px_40px_rgba(0,43,92,0.10)] p-3 sm:p-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-0 lg:divide-x lg:divide-slate-100">
                            {atalhosPrincipais.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className="group flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl hover:bg-[#F0F7FF] transition-all duration-300 text-center"
                                    >
                                        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#EBF3FB] group-hover:bg-[#0072CE] text-[#0072CE] group-hover:text-white flex items-center justify-center text-xl sm:text-2xl transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-110 mb-2.5">
                                            <Icon />
                                        </div>

                                        <span className="text-xs sm:text-sm font-extrabold text-[#0F2942] group-hover:text-[#0072CE] transition-colors leading-tight">
                                            {item.title}
                                        </span>
                                        <span className="text-[11px] text-[#526B84] font-medium truncate mt-1 max-w-[130px] hidden sm:block">
                                            {item.subtitle}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
