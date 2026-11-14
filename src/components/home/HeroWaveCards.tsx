"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MUNICIPIO } from "@/config/municipio";
import { HiMagnifyingGlass } from "react-icons/hi2";
import {
    FaShieldHalved,
    FaBullhorn,
    FaIdCard,
    FaReceipt,
    FaArrowRight,
    FaLandmark,
    FaCheck
} from "react-icons/fa6";

interface HeroWaveCardsProps {
    linksExternos?: Array<{ moduloAlvo: string | null; url: string }>;
}

export default function HeroWaveCards({ linksExternos = [] }: HeroWaveCardsProps) {
    const [busca, setBusca] = useState("");

    const getLink = (identifiers: string[], fallbackHref: string) => {
        const found = linksExternos.find((l) =>
            l.moduloAlvo && identifiers.some((id) => id.toLowerCase() === l.moduloAlvo?.toLowerCase())
        );
        return {
            href: found ? found.url : fallbackHref,
            isExternal: !!found,
        };
    };

    const linkTransparencia = getLink(["home-transparencia", "transparencia"], "/transparencia");
    const linkOuvidoria = getLink(["home-ouvidoria", "ouvidoria", "esic"], "/servicos/ouvidoria");
    const linkServidor = getLink(["home-contracheque", "contracheque", "servidor"], "/servicos/contracheque");
    const linkTributacao = getLink(["home-tributario", "tributario", "tributacao", "iptu"], "/servicos/tributario");

    // 4 Cards Flutuantes Solicitados: Transparência, Ouvidoria, Servidor, Tributação
    // Paleta Alinhada: Amarelo Ouro (Primário) & Azul Safira (Secundário)
    const profileCards = [
        {
            id: "perfil-transparencia",
            titulo: "Transparência",
            descricao: "Prestação de contas, receitas, despesas, licitações PNCP e contratos públicos.",
            href: linkTransparencia.href,
            isExternal: linkTransparencia.isExternal,
            icon: FaShieldHalved,
            corTexto: "text-[#854D0E]",
            corBorda: "border-[#EAB308]",
            corIconeBg: "bg-amber-50 text-[#CA8A04] border-amber-300",
            corHoverBg: "group-hover:border-[#EAB308]",
            botaoCor: "bg-amber-100 text-[#78350F] group-hover:bg-[#EAB308] group-hover:text-[#002B5C]",
            tag: "Destaque Cívico",
        },
        {
            id: "perfil-ouvidoria",
            titulo: "Ouvidoria",
            descricao: "Canal direto de manifestação: elogios, sugestões, denúncias e e-SIC.",
            href: linkOuvidoria.href,
            isExternal: linkOuvidoria.isExternal,
            icon: FaBullhorn,
            corTexto: "text-[#003B73]",
            corBorda: "border-[#0072CE]",
            corIconeBg: "bg-blue-50 text-[#0072CE] border-blue-200",
            corHoverBg: "group-hover:border-[#0072CE]",
            botaoCor: "bg-blue-100 text-[#003B73] group-hover:bg-[#003B73] group-hover:text-white",
            tag: "Fale Conosco",
        },
        {
            id: "perfil-servidor",
            titulo: "Servidor",
            descricao: "Contracheque online, informe de rendimentos, margem consignável e previdência.",
            href: linkServidor.href,
            isExternal: linkServidor.isExternal,
            icon: FaIdCard,
            corTexto: "text-[#92400E]",
            corBorda: "border-[#F59E0B]",
            corIconeBg: "bg-amber-50 text-[#D97706] border-amber-200",
            corHoverBg: "group-hover:border-[#F59E0B]",
            botaoCor: "bg-amber-100 text-[#92400E] group-hover:bg-[#F59E0B] group-hover:text-[#002B5C]",
            tag: "Portal do Servidor",
        },
        {
            id: "perfil-tributacao",
            titulo: "Tributação",
            descricao: "2ª via do IPTU, emissão de certidões, taxas municipais, DAM e Nota Fiscal.",
            href: linkTributacao.href,
            isExternal: linkTributacao.isExternal,
            icon: FaReceipt,
            corTexto: "text-[#002B5C]",
            corBorda: "border-[#003B73]",
            corIconeBg: "bg-sky-50 text-[#003B73] border-sky-200",
            corHoverBg: "group-hover:border-[#003B73]",
            botaoCor: "bg-sky-100 text-[#002B5C] group-hover:bg-[#002B5C] group-hover:text-white",
            tag: "IPTU & Tributos",
        },
    ];

    return (
        <div className="relative w-full">
            {/* ========================================================= */}
            {/* HERO PANORÂMICO COM VÍDEO LUMINOSO E OVERLAY LEVE         */}
            {/* ========================================================= */}
            <div className="relative w-full min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] bg-slate-900 flex flex-col justify-between overflow-hidden">
                {/* Vídeo de Fundo Oficial em Alta Resolução e Luminoso */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <video
                        src="/video_lajes_pintadas.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster="/images/historia-panoramica.jpg"
                        className="w-full h-full object-cover scale-105"
                    />
                </div>

                {/* Camada Suave de Proteção (Deixa o Vídeo Totalmente Visível e Mantém a Legibilidade) */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#001D3D]/60 via-[#002B5C]/35 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001D3D]/70 via-transparent to-black/20" />

                {/* Conteúdo Central do Hero */}
                <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-28 lg:pb-36 w-full text-white">
                    <div className="max-w-3xl space-y-5 sm:space-y-6">
                        {/* Selo Municipal */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-bold tracking-wide text-white shadow-sm">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Governo Municipal de Lajes Pintadas • Gestão Participativa</span>
                        </div>

                        {/* Título de Boas-Vindas */}
                        <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black font-heading tracking-tight leading-[1.12] text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
                            Lajes Pintadas mais perto de você.
                        </h1>

                        <p className="text-base sm:text-lg text-white font-medium leading-relaxed max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                            Acesse com facilidade todos os serviços do cidadão, notícias oficiais e acompanhe as contas públicas no Portal da Transparência.
                        </p>

                        {/* Barra de Pesquisa Rápida (Amarelo Primário com Azul Secundário) */}
                        <div className="pt-2">
                            <form
                                action="/transparencia"
                                method="GET"
                                className="bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl sm:rounded-full border border-white/40 shadow-2xl flex flex-col sm:flex-row items-center gap-2 focus-within:ring-4 focus-within:ring-[#EAB308]/40 transition-all max-w-2xl"
                            >
                                <div className="flex items-center gap-3 w-full px-4 text-[#12304A]">
                                    <HiMagnifyingGlass className="text-[#CA8A04] text-2xl shrink-0" />
                                    <input
                                        type="text"
                                        name="q"
                                        value={busca}
                                        onChange={(e) => setBusca(e.target.value)}
                                        placeholder="O que você procura hoje em Lajes Pintadas?"
                                        className="w-full bg-transparent text-sm sm:text-base text-[#12304A] placeholder-slate-500 font-medium focus:outline-none py-2"
                                        aria-label="Campo de busca de serviços e documentos públicos"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto bg-[#EAB308] hover:bg-[#CA8A04] active:bg-[#A16207] text-[#002B5C] font-black text-sm px-7 py-3 rounded-xl sm:rounded-full transition-colors flex items-center justify-center gap-2 shadow-md shrink-0 focus:outline-none focus:ring-2 focus:ring-[#003B73]"
                                >
                                    <span>Buscar</span>
                                    <FaArrowRight size={12} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* ========================================================= */}
                {/* DIVISOR EM CURVA ORGÂNICA (AMARELO OURO & AZUL SAFIRA)    */}
                {/* ========================================================= */}
                <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
                    <svg
                        viewBox="0 0 1440 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="relative block w-full h-14 sm:h-20 lg:h-24 text-white preserve-3d"
                    >
                        {/* Onda de fundo translúcida em tom amarelo ouro primário */}
                        <path
                            d="M0,32L60,42.7C120,53,240,75,360,80C480,85,600,75,720,58.7C840,43,960,21,1080,21.3C1200,21,1320,43,1380,53.3L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
                            fill="#FACC15"
                            fillOpacity="0.45"
                        />
                        {/* Onda intermediária em tom azul secundário institucional */}
                        <path
                            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                            fill="#003B73"
                            fillOpacity="0.35"
                        />
                        {/* Onda principal sólida que fecha com a cor de fundo do site */}
                        <path
                            d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,53.3C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
                            fill="#FFFFFF"
                        />
                    </svg>
                </div>
            </div>

            {/* ========================================================= */}
            {/* 4 CARDS VERTICAIS FLUTUANTES (TRANSPARÊNCIA, OUVIDORIA...) */}
            {/* ========================================================= */}
            <div className="relative z-20 max-w-[1280px] mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 lg:-mt-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {profileCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Link
                                key={card.id}
                                href={card.href}
                                target={card.isExternal ? "_blank" : undefined}
                                rel={card.isExternal ? "noopener noreferrer" : undefined}
                                className={`group bg-white rounded-2xl sm:rounded-[22px] p-6 sm:p-7 border-2 border-slate-100 ${card.corHoverBg} shadow-[0_12px_32px_rgba(0,38,84,0.08)] hover:shadow-[0_20px_45px_rgba(0,38,84,0.16)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 focus:outline-none focus:ring-4 focus:ring-[#1254A3]/20 relative overflow-hidden`}
                            >
                                {/* Faixa colorida no topo do card */}
                                <div className={`absolute top-0 left-0 right-0 h-1.5 ${card.corBorda.replace("border-", "bg-")}`} />

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div
                                            className={`w-14 h-14 rounded-2xl ${card.corIconeBg} border flex items-center justify-center text-2xl transition-transform group-hover:scale-110 shadow-sm`}
                                        >
                                            <Icon />
                                        </div>
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                                            {card.tag}
                                        </span>
                                    </div>

                                    <div>
                                        <h2 className={`text-xl font-black font-heading text-[#12304A] group-hover:${card.corTexto} transition-colors tracking-tight`}>
                                            {card.titulo}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-[#5B738B] leading-relaxed mt-1.5 font-medium line-clamp-3">
                                            {card.descricao}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-extrabold text-[#12304A] group-hover:text-[#1254A3] transition-colors">
                                        Acessar serviço
                                    </span>
                                    <div
                                        className={`w-9 h-9 rounded-full ${card.botaoCor} flex items-center justify-center transition-all group-hover:translate-x-1`}
                                    >
                                        <FaArrowRight size={13} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
