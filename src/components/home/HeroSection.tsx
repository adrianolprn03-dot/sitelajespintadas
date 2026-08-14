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
        <section className="relative w-full min-h-[92vh] md:min-h-[98vh] flex items-center justify-center overflow-hidden">
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
                {/* Overlay gradiente para excelente leitura e contraste dos textos */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/60" />
            </div>

            {/* Elementos decorativos de iluminação */}
            <div className="absolute top-1/4 left-[-6rem] w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-1/4 right-[-4rem] w-80 h-80 rounded-full bg-amber-400/10 blur-[100px] pointer-events-none z-0" />

            {/* Conteúdo Principal */}
            <div className="relative z-10 w-full max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col items-center text-center pt-36 md:pt-48 pb-12 md:pb-20 animate-fade-in-up">
                
                {/* Título em amarelo transparente e tamanho ajustado */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-amber-400/85 leading-tight tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)] max-w-3xl mb-3">
                    {MUNICIPIO.nome}
                </h1>

                <p className="text-base sm:text-xl text-white max-w-xl font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] leading-relaxed tracking-wide">
                    Cuidando da nossa gente e Construindo o nosso futuro.
                </p>

                {/* Grid dos 4 Cards de Alto Contraste Posicionados Mais Abaixo no Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl mt-12 md:mt-20">
                    {cards.map((item, idx) => {
                        const Icon = item.icon;
                        const { href, isExternal } = getFinalUrl(item.href, item.identifier);

                        return (
                            <Link
                                key={idx}
                                href={href}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className="group flex flex-col items-center text-center p-4 sm:p-5 rounded-[1.6rem] bg-[#0b132b]/80 hover:bg-[#0b132b]/95 backdrop-blur-xl border border-white/20 hover:border-amber-400/60 shadow-2xl shadow-black/50 transition-all duration-300 hover:-translate-y-1 relative"
                            >
                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-300 mb-3 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300 shadow-sm">
                                    <Icon className="text-xl" />
                                </div>

                                <h3 className="font-bold text-white text-base sm:text-lg mb-1.5 group-hover:text-amber-300 transition-colors leading-snug drop-shadow-sm">
                                    {item.label}
                                </h3>

                                <p className="text-slate-200 text-[11px] sm:text-xs font-medium leading-relaxed">
                                    {item.desc}
                                </p>

                                {isExternal && (
                                    <div className="absolute top-3 right-3 text-amber-300 text-[10px] opacity-80">
                                        <FaExternalLinkAlt />
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>

            </div>

            {/* Bottom Fade suave transição */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/40 to-transparent z-10 pointer-events-none" />
        </section>
    );
}






