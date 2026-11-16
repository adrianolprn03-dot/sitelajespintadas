"use client";

import React, { useState, useEffect, useRef } from "react";
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
    FaIdCard,
    FaArrowUpRightFromSquare,
    FaExpand,
    FaPlay,
    FaPause,
    FaVolumeHigh,
    FaVolumeXmark
} from "react-icons/fa6";

const atalhosPrincipais = [
    {
        id: "home-transparencia",
        label: "Portal da Transparência",
        sublabel: "Receitas, despesas e gestão fiscal",
        href: "/transparencia",
        icon: FaShieldHalved,
        destaque: true,
    },
    {
        id: "home-esic",
        label: "e-SIC",
        sublabel: "Acesso à Informação e pedidos",
        href: "/servicos/esic",
        icon: FaFileLines,
        destaque: false,
    },
    {
        id: "home-ouvidoria",
        label: "Ouvidoria",
        sublabel: "Elogios, sugestões e denúncias",
        href: "/servicos/ouvidoria",
        icon: FaBullhorn,
        destaque: false,
    },
    {
        id: "home-diario",
        label: "Diário Oficial",
        sublabel: "Atos administrativos e decretos",
        href: "/transparencia/legislacao",
        icon: FaBookOpen,
        destaque: false,
    },
    {
        id: "home-contribuinte",
        label: "Contribuinte",
        sublabel: "IPTU, certidões e tributos",
        href: "/servicos/tributario",
        icon: FaReceipt,
        destaque: false,
    },
    {
        id: "home-contracheque",
        label: "Contracheque",
        sublabel: "Portal do Servidor e holerites",
        href: "/servicos/contracheque",
        icon: FaIdCard,
        destaque: false,
    },
];

const buscasFrequentes = [
    "IPTU 2ª Via",
    "Fila de Creches",
    "Remédios UBS",
    "Licitações",
    "Contracheque",
    "Diário Oficial",
];

export default function HeroPanoramicoModelo3() {
    const [linksExternos, setLinksExternos] = useState<any[]>([]);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        fetch("/api/links-externos")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setLinksExternos(data);
            })
            .catch(() => {});
    }, []);

    const handleTogglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleToggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            }
        }
    };

    return (
        <div className="space-y-8 sm:space-y-12">
            {/* =====================================================================
                1. BANNER PRINCIPAL COM VÍDEO EM TELA COMPLETA (ALTA VISIBILIDADE & CRAFT)
               ===================================================================== */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-2 sm:pt-4">
                <div className="relative rounded-[26px] sm:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,43,92,0.18)] border border-slate-200/80 min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] flex items-center bg-slate-900 group">
                    {/* Vídeo Oficial em Tela Completa com Filtro de Luminosidade e Saturação Aprimorados */}
                    <video
                        ref={videoRef}
                        autoPlay
                        muted={isMuted}
                        loop
                        playsInline
                        poster="/images/historia-panoramica.jpg"
                        className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[1.05] contrast-[1.06] saturate-[1.12]"
                    >
                        <source src="/video_lajes_pintadas.mp4" type="video/mp4" />
                        <source src={MUNICIPIO.heroVideo} type="video/mp4" />
                    </video>

                    {/* Scrim Gradiente Direcional Assimétrico (Design Moderno):
                        Protege o texto à esquerda com contraste perfeito, mas deixa 100% livre,
                        brilhante e translúcido todo o restante do vídeo da cidade de Lajes Pintadas */}
                    <div
                        className="absolute inset-0 z-[1] pointer-events-none"
                        style={{
                            background: `
                                linear-gradient(95deg, rgba(2, 12, 28, 0.74) 0%, rgba(2, 16, 38, 0.48) 36%, rgba(2, 16, 38, 0.12) 64%, rgba(0, 0, 0, 0) 84%),
                                linear-gradient(180deg, rgba(0, 0, 0, 0.32) 0%, rgba(0, 0, 0, 0) 22%, rgba(0, 0, 0, 0) 75%, rgba(0, 15, 35, 0.45) 100%)
                            `,
                        }}
                    />

                    {/* Filete Superior Heráldico Azul & Amarelo */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 heraldic-stripe z-[2]" />

                    {/* Controles Flutuantes do Vídeo (Play/Pause, Áudio & Fullscreen) */}
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2">
                        <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Imagens Aéreas Oficiais</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleToggleMute}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold transition-all shadow-sm active:scale-95"
                            title={isMuted ? "Ativar som do vídeo" : "Desativar som do vídeo"}
                            aria-label={isMuted ? "Ativar som do vídeo" : "Desativar som do vídeo"}
                        >
                            {isMuted ? <FaVolumeXmark size={11} className="text-amber-300" /> : <FaVolumeHigh size={11} className="text-emerald-400" />}
                            <span className="hidden sm:inline">{isMuted ? "Ativar Som" : "Sem Som"}</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleTogglePlay}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold transition-all shadow-sm active:scale-95"
                            title={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
                            aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
                        >
                            {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
                            <span className="hidden sm:inline">{isPlaying ? "Pausar" : "Reproduzir"}</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleFullscreen}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 hover:bg-[#0072CE] backdrop-blur-md border border-white/20 text-white text-[11px] font-bold transition-all shadow-sm active:scale-95"
                            title="Ver vídeo em tela cheia"
                            aria-label="Ver vídeo em tela cheia"
                        >
                            <FaExpand size={10} />
                            <span className="hidden sm:inline">Tela Cheia</span>
                        </button>
                    </div>

                    {/* Conteúdo Institucional Sobreposto ao Vídeo com Alta Legibilidade */}
                    <div className="relative z-10 w-full p-6 sm:p-10 lg:p-12">
                        <div className="max-w-2xl space-y-5 text-left">
                            {/* Chip Identificador Oficial */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-black/45 backdrop-blur-md border border-white/20 rounded-full text-[11px] font-extrabold text-[#FACC15] uppercase tracking-wider shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-[#F39A32] animate-pulse" />
                                <span>{MUNICIPIO.nomeCompleto} • {MUNICIPIO.uf}</span>
                            </div>

                            {/* Título Principal com Sombra de Alta Legibilidade */}
                            <div className="space-y-3">
                                <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-white font-heading tracking-tight leading-[1.08] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                                    Lajes Pintadas, <br />
                                    <span className="text-[#FACC15] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">mais perto de você.</span>
                                </h1>

                                <div className="h-1.5 w-24 bg-[#FACC15] rounded-full shadow-md" />
                            </div>

                            {/* Linha de Apoio Institucional */}
                            <p className="text-base sm:text-lg text-slate-100 leading-relaxed max-w-xl font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
                                Encontre rapidamente informações oficiais, serviços online e prestação de contas do município com transparência e agilidade.
                            </p>

                            {/* Campo de Busca Principal com Design Limpo e Acessível */}
                            <form
                                id="busca"
                                action="/transparencia"
                                method="GET"
                                className="bg-white/95 backdrop-blur-md p-2 rounded-2xl border-2 border-white/80 focus-within:border-[#FACC15] focus-within:ring-4 focus-within:ring-[#FACC15]/20 flex flex-col sm:flex-row gap-2 shadow-[0_12px_40px_rgba(0,0,0,0.35)] max-w-xl transition-all"
                            >
                                <div className="flex-1 flex items-center px-3 gap-3">
                                    <HiMagnifyingGlass className="text-[#0072CE] text-xl shrink-0" />
                                    <input
                                        type="text"
                                        name="q"
                                        placeholder="O que você procura? Ex: IPTU, Licitações, Contracheque..."
                                        className="w-full bg-transparent text-sm text-[#0F2942] placeholder-slate-400 font-medium focus:outline-none py-2"
                                        aria-label="Buscar no portal"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-[#0072CE] hover:bg-[#005bb5] active:bg-[#003B73] text-white text-xs font-black px-6 py-3 rounded-xl transition-all shrink-0 shadow-md flex items-center justify-center gap-2 hover:scale-[1.02]"
                                >
                                    <span>Buscar</span>
                                </button>
                            </form>

                            {/* Buscas Frequentes em Chips Glassmorphism com Alto Contraste */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="text-xs font-extrabold uppercase tracking-wider text-[#FACC15] drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] mr-1">
                                    Buscas frequentes:
                                </span>
                                {buscasFrequentes.map((term) => (
                                    <Link
                                        key={term}
                                        href={`/transparencia?q=${encodeURIComponent(term)}`}
                                        className="text-xs font-semibold text-white bg-black/50 hover:bg-[#FACC15] hover:text-[#002B5C] backdrop-blur-md border border-white/25 px-3.5 py-1.5 rounded-full transition-all shadow-sm hover:shadow active:scale-95"
                                    >
                                        {term}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================================
                2. SEIS ATALHOS PRINCIPAIS (DESIGN SYSTEM DA PRANCHA APROVADA)
               ===================================================================== */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {atalhosPrincipais.map((item) => {
                        const override = linksExternos.find(
                            (l) => l.moduloAlvo?.toLowerCase() === item.id.toLowerCase()
                        );
                        const finalHref = override ? override.url : item.href;
                        const isExternal = !!override;

                        return (
                            <Link
                                key={item.label}
                                href={finalHref}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between group shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                                    item.destaque
                                        ? "bg-[#003B73] text-white border-[#003B73] shadow-md shadow-[#003B73]/20"
                                        : "bg-white text-[#12304A] border-[#DDE3EA] hover:border-[#0072CE]"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div
                                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all ${
                                            item.destaque
                                                ? "bg-white/15 text-[#FACC15]"
                                                : "bg-blue-50 text-[#0072CE] group-hover:bg-[#0072CE] group-hover:text-white"
                                        }`}
                                    >
                                        <item.icon />
                                    </div>
                                    {isExternal ? (
                                        <FaArrowUpRightFromSquare
                                            size={11}
                                            className={item.destaque ? "text-[#FACC15]" : "text-[#0072CE]"}
                                            title="Link Externo"
                                        />
                                    ) : (
                                        <FaArrowRight
                                            size={10}
                                            className={`opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ${
                                                item.destaque ? "text-[#FACC15]" : "text-[#0072CE]"
                                            }`}
                                        />
                                    )}
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
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
