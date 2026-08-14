"use client";
import { useState } from "react";
import Link from "next/link";
import { 
    HiOutlineClipboardDocumentCheck, 
    HiOutlineMagnifyingGlassCircle, 
    HiOutlineIdentification, 
    HiOutlineBuildingOffice2
} from "react-icons/hi2";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MUNICIPIO } from "@/config/municipio";

interface HeroSectionProps {
    linksExternos?: Array<{ moduloAlvo?: string; url?: string }>;
}

export default function HeroSection({ linksExternos = [] }: HeroSectionProps) {
    const [videoError, setVideoError] = useState(false);

    const getFinalUrl = (defaultHref: string, identifier: string) => {
        const override = linksExternos.find(
            (l) => l.moduloAlvo?.toLowerCase() === identifier.toLowerCase()
        );
        return {
            href: override?.url || defaultHref,
            isExternal: !!override?.url,
        };
    };

    const cards = [
        {
            label: "Portal da Transparência",
            desc: "Acompanhe as contas públicas e atos oficiais.",
            href: "/transparencia",
            identifier: "home-transparencia",
            icon: HiOutlineClipboardDocumentCheck,
        },
        {
            label: "E-SIC",
            desc: "Solicite informações públicas eletronicamente.",
            href: "/servicos/esic",
            identifier: "home-esic",
            icon: HiOutlineMagnifyingGlassCircle,
        },
        {
            label: "Ouvidoria",
            desc: "Envie sugestões, reclamações ou elogios.",
            href: "/servicos/ouvidoria",
            identifier: "home-ouvidoria",
            icon: HiOutlineIdentification,
        },
        {
            label: "Secretarias",
            desc: "Conheça os órgãos e gestores municipais.",
            href: "/secretarias",
            identifier: "home-secretarias",
            icon: HiOutlineBuildingOffice2,
        },
    ];

    return (
        <section className="relative w-full min-h-[90vh] md:min-h-[95vh] flex items-center justify-center overflow-hidden">
            {/* Background Video com fallback para imagem */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {!videoError ? (
                    <video
                        src={MUNICIPIO.heroVideo || MUNICIPIO.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        onError={() => setVideoError(true)}
                        className="w-full h-full object-cover brightness-[1.05] contrast-[1.05] scale-105 transition-all duration-700"
                    />
                ) : (
                    <img
                        src="/images/hero-bg.jpg"
                        alt={`Vista de ${MUNICIPIO.nome}`}
                        className="w-full h-full object-cover scale-105"
                    />
                )}
                {/* Overlay gradiente escuro suave */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/65" />
            </div>

            {/* Elementos decorativos de iluminação */}
            <div className="absolute top-1/4 left-[-6rem] w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-1/4 right-[-4rem] w-80 h-80 rounded-full bg-amber-400/10 blur-[100px] pointer-events-none z-0" />

            {/* Conteúdo Principal */}
            <div className="relative z-10 w-full max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col items-center text-center pt-36 md:pt-44 pb-20 md:pb-28 animate-fade-in-up">
                
                {/* Título em amarelo transparente e tamanho ajustado */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-amber-400/85 leading-tight tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)] max-w-3xl mb-4">
                    {MUNICIPIO.nome}
                </h1>

                <p className="text-base sm:text-xl text-white/90 max-w-xl mb-12 font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] leading-relaxed tracking-wide">
                    Cuidando da nossa gente e Construindo o nosso futuro.
                </p>

                {/* Grid dos 4 Cards Escuros Transparentes (Modelo Solicitado) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl">
                    {cards.map((item, idx) => {
                        const Icon = item.icon;
                        const { href, isExternal } = getFinalUrl(item.href, item.identifier);

                        return (
                            <Link
                                key={idx}
                                href={href}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className="group flex flex-col items-center text-center p-6 sm:p-7 rounded-[2rem] bg-[#0b132b]/75 hover:bg-[#0b132b]/90 backdrop-blur-xl border border-white/15 hover:border-amber-400/50 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-amber-500/10 relative"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white mb-5 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300 shadow-inner">
                                    <Icon className="text-2xl" />
                                </div>

                                <h3 className="font-bold text-white text-lg sm:text-xl mb-2.5 group-hover:text-amber-300 transition-colors leading-snug">
                                    {item.label}
                                </h3>

                                <p className="text-white/70 text-xs sm:text-sm font-normal leading-relaxed">
                                    {item.desc}
                                </p>

                                {isExternal && (
                                    <div className="absolute top-4 right-4 text-amber-400 text-xs opacity-75">
                                        <FaExternalLinkAlt />
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>

            </div>

            {/* Bottom Fade suave transição */}
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/40 to-transparent z-10 pointer-events-none" />
        </section>
    );
}




