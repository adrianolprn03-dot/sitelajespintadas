"use client";

import Link from "next/link";
import { MUNICIPIO } from "@/config/municipio";
import {
    HiMagnifyingGlass,
    HiOutlineDocumentText,
    HiOutlineUser,
    HiOutlineCreditCard,
    HiOutlineShieldCheck,
    HiArrowRight,
} from "react-icons/hi2";
import { FaComments, FaPills } from "react-icons/fa6";

const quickLinks = [
    { label: "Transparência", href: "/transparencia" },
    { label: "Licitações", href: "/transparencia/licitacoes" },
    { label: "Contracheque", href: "/servicos/contracheque" },
    { label: "Ouvidoria / e-SIC", href: "/servicos/ouvidoria" },
];

const bentoDockCards = [
    {
        title: "Portal da Transparência",
        subtitle: "Receitas, despesas, folha e contratos",
        href: "/transparencia",
        icon: HiOutlineShieldCheck,
    },
    {
        title: "Ouvidoria & e-SIC",
        subtitle: "Manifestações e Acesso à Informação",
        href: "/servicos/ouvidoria",
        icon: FaComments,
    },
    {
        title: "Saúde & Medicamentos SUS",
        subtitle: "Estoque nas UBS e Central de Regulação",
        href: "/transparencia/medicamentos-sus",
        icon: FaPills,
    },
    {
        title: "Portal do Contribuinte",
        subtitle: "2ª via de IPTU, ISS, certidões e alvarás",
        href: "/servicos/tributario",
        icon: HiOutlineUser,
    },
    {
        title: "Servidor & Contracheque",
        subtitle: "Holerite online, diárias e portarias",
        href: "/servicos/contracheque",
        icon: HiOutlineCreditCard,
    },
    {
        title: "Diário Oficial & Leis",
        subtitle: "Licitações, decretos e atos oficiais",
        href: "/transparencia/legislacao",
        icon: HiOutlineDocumentText,
    },
];

export default function HeroPanoramicoModelo3() {
    return (
        <section className="relative pt-3 sm:pt-5 pb-2">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
                {/* =====================================================================
                    1. BANNER PANORÂMICO COM VÍDEO OFICIAL (LIMPO E DIRETO AO PONTO)
                   ===================================================================== */}
                <div className="relative rounded-[26px] sm:rounded-[30px] overflow-hidden shadow-[0_20px_50px_rgba(0,43,92,0.16)] border border-white/60 min-h-[360px] sm:min-h-[410px] flex items-center">
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

                    {/* Overlay Institucional Limpo em Azul (deixando o vídeo visível) */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(105deg, rgba(0, 38, 84, 0.84) 0%, rgba(0, 75, 135, 0.55) 55%, rgba(0, 38, 84, 0.22) 100%)",
                        }}
                    />

                    {/* Filete Superior Azul & Amarelo */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 heraldic-stripe z-20" />

                    {/* Conteúdo Enxuto e Focado na Busca e Acesso Rápido */}
                    <div className="relative z-10 w-full p-6 sm:p-10 lg:p-12">
                        <div className="max-w-2xl space-y-5 text-left">
                            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-[#FACC15]/60 text-[11px] font-extrabold uppercase tracking-wider text-[#FACC15]">
                                <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
                                <span>{MUNICIPIO.nomeCompleto} • {MUNICIPIO.uf}</span>
                            </span>

                            <div className="space-y-2">
                                <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-white font-heading tracking-tight leading-[1.12] drop-shadow-sm">
                                    Serviços Públicos e Transparência ao Alcance do Cidadão
                                </h1>
                                <p className="text-xs sm:text-sm text-sky-100/90 font-medium">
                                    Encontre rapidamente informações oficiais, serviços online e prestação de contas do município.
                                </p>
                            </div>

                            {/* Barra de Busca Principal */}
                            <form
                                id="busca"
                                action="/transparencia"
                                method="GET"
                                className="bg-white/95 backdrop-blur-xl p-1.5 rounded-full border-2 border-white focus-within:border-[#FACC15] flex items-center shadow-xl max-w-xl transition-all duration-200"
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
                                    className="bg-[#0072CE] hover:bg-[#005bb5] text-white text-xs font-extrabold px-5 py-2.5 rounded-full transition-all shrink-0 shadow-sm border border-[#FACC15]"
                                >
                                    Buscar
                                </button>
                            </form>

                            {/* Acesso Direto Conciso */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-bold text-[#FACC15]">
                                    Mais buscados:
                                </span>
                                {quickLinks.map((chip, idx) => (
                                    <Link
                                        key={idx}
                                        href={chip.href}
                                        className="text-xs font-semibold text-white bg-white/15 hover:bg-[#FACC15] hover:text-[#0F2942] backdrop-blur-md border border-white/25 px-3 py-1 rounded-full transition-all"
                                    >
                                        {chip.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* =====================================================================
                    2. ACESSO RÁPIDO AOS SERVIÇOS (ÍCONES UNIFICADOS EM AZUL E AMARELO)
                   ===================================================================== */}
                <div className="mt-6 sm:-mt-7 relative z-20 px-1 sm:px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bentoDockCards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <Link
                                    key={index}
                                    href={card.href}
                                    className="group bg-white rounded-2xl p-4 sm:p-5 border border-[#DCE4EE] border-b-4 border-b-[#0072CE] hover:border-b-[#FACC15] shadow-[0_8px_24px_rgba(0,59,115,0.07)] hover:shadow-[0_14px_32px_rgba(0,59,115,0.13)] transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-[#F0F7FF] text-[#0072CE] border border-[#DCE4EE] group-hover:bg-[#0072CE] group-hover:text-[#FACC15] group-hover:border-[#0072CE] flex items-center justify-center text-xl shrink-0 transition-all duration-200">
                                        <Icon />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-sm sm:text-base font-extrabold text-[#0F2942] font-heading group-hover:text-[#0072CE] transition-colors leading-snug">
                                            {card.title}
                                        </h2>
                                        <p className="text-xs text-[#526B84] font-medium truncate mt-0.5">
                                            {card.subtitle}
                                        </p>
                                    </div>

                                    <div className="text-slate-300 group-hover:text-[#0072CE] group-hover:translate-x-1 transition-all shrink-0">
                                        <HiArrowRight size={17} />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
