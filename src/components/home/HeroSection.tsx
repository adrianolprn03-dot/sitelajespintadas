"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    HiOutlineClipboardDocumentCheck, 
    HiOutlineMagnifyingGlassCircle, 
    HiOutlineIdentification, 
    HiOutlineBuildingOffice2,
    HiOutlineMagnifyingGlass,
    HiXMark
} from "react-icons/hi2";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MUNICIPIO } from "@/config/municipio";

interface SearchResult {
    titulo: string;
    href: string;
    secao: string;
    tipo: "pagina" | "noticia" | "licitacao";
}

const paginasEstaticas: SearchResult[] = [
    { titulo: "Portal da Transparência", href: "/transparencia", secao: "Transparência", tipo: "pagina" },
    { titulo: "Obras Públicas", href: "/transparencia/obras", secao: "Transparência", tipo: "pagina" },
    { titulo: "Receitas Públicas", href: "/transparencia/receitas", secao: "Transparência", tipo: "pagina" },
    { titulo: "Despesas Públicas", href: "/transparencia/despesas", secao: "Transparência", tipo: "pagina" },
    { titulo: "Licitações e Contratos", href: "/transparencia/licitacoes", secao: "Transparência", tipo: "pagina" },
    { titulo: "Diárias e Passagens", href: "/transparencia/diarias", secao: "Transparência", tipo: "pagina" },
    { titulo: "Servidores Municipais", href: "/transparencia/servidores", secao: "Transparência", tipo: "pagina" },
    { titulo: "Relatórios Fiscais (RREO/RGF)", href: "/transparencia/relatorios", secao: "Transparência", tipo: "pagina" },
    { titulo: "Orçamento (LOA / LDO / PPA)", href: "/transparencia/orcamento", secao: "Transparência", tipo: "pagina" },
    { titulo: "Legislação Municipal", href: "/transparencia/legislacao", secao: "Transparência", tipo: "pagina" },
    { titulo: "Dados Abertos", href: "/transparencia/dados-abertos", secao: "Transparência", tipo: "pagina" },
    { titulo: "e-SIC – Acesso à Informação", href: "/servicos/esic", secao: "Serviços", tipo: "pagina" },
    { titulo: "Ouvidoria Municipal", href: "/servicos/ouvidoria", secao: "Serviços", tipo: "pagina" },
    { titulo: "Secretarias Municipais", href: "/secretarias", secao: "Institucional", tipo: "pagina" },
    { titulo: "Unidades de Saúde (UBS)", href: "/unidades-de-saude", secao: "Serviços", tipo: "pagina" },
    { titulo: "Unidades Escolares", href: "/unidades-escolares", secao: "Serviços", tipo: "pagina" },
];

interface HeroSectionProps {
    linksExternos?: Array<{ moduloAlvo?: string; url?: string }>;
}

export default function HeroSection({ linksExternos = [] }: HeroSectionProps) {
    const [videoError, setVideoError] = useState(false);
    const [query, setQuery] = useState("");
    const [resultados, setResultados] = useState<SearchResult[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const getFinalUrl = (defaultHref: string, identifier: string) => {
        const override = linksExternos.find(
            (l) => l.moduloAlvo?.toLowerCase() === identifier.toLowerCase()
        );
        return {
            href: override?.url || defaultHref,
            isExternal: !!override?.url,
        };
    };

    const botoes = [
        {
            label: "Portal da Transparência",
            href: "/transparencia",
            identifier: "home-transparencia",
            icon: HiOutlineClipboardDocumentCheck,
            isActive: true,
        },
        {
            label: "e-SIC",
            href: "/servicos/esic",
            identifier: "home-esic",
            icon: HiOutlineMagnifyingGlassCircle,
            isActive: false,
        },
        {
            label: "Ouvidoria",
            href: "/servicos/ouvidoria",
            identifier: "home-ouvidoria",
            icon: HiOutlineIdentification,
            isActive: false,
        },
        {
            label: "Secretarias",
            href: "/secretarias",
            identifier: "home-secretarias",
            icon: HiOutlineBuildingOffice2,
            isActive: false,
        },
    ];

    useEffect(() => {
        if (query.trim().length < 2) {
            setResultados([]);
            return;
        }
        const q = query.toLowerCase();
        const filtrados = paginasEstaticas.filter(
            (p) => p.titulo.toLowerCase().includes(q) || p.secao.toLowerCase().includes(q)
        );
        setResultados(filtrados.slice(0, 6));
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectResult = (href: string) => {
        router.push(href);
        setQuery("");
        setIsFocused(false);
    };

    return (
        <section className="relative w-full min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
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
                {/* Overlay gradiente escuro para contraste impecável dos elementos */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />
            </div>

            {/* Elementos decorativos de iluminação */}
            <div className="absolute top-1/4 left-[-6rem] w-96 h-96 rounded-full bg-primary-500/15 blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-1/4 right-[-4rem] w-80 h-80 rounded-full bg-sky-400/15 blur-[100px] pointer-events-none z-0" />

            {/* Conteúdo Principal */}
            <div className="relative z-10 w-full max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col items-center text-center pt-28 pb-20 md:pt-36 md:pb-28">
                
                {/* Título & Slogan */}
                <div className="mb-8 md:mb-12 animate-fade-in-up">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-4">
                        Prefeitura Municipal de {MUNICIPIO.nome}
                    </span>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.85)] max-w-4xl mx-auto">
                        Cuidando da nossa gente e construindo o nosso futuro
                    </h1>
                </div>

                {/* Card Glassmorphic Flutuante (Modelo solicitado) */}
                <div className="w-full max-w-4xl bg-slate-950/40 backdrop-blur-md border border-white/20 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-300">
                    
                    {/* Campo de Busca "O que você procura?" */}
                    <div ref={searchRef} className="relative w-full mb-6">
                        <div className="relative flex items-center w-full rounded-full bg-white/10 hover:bg-white/15 focus-within:bg-white/20 border border-white/30 focus-within:border-white/60 transition-all duration-300 shadow-inner">
                            <HiOutlineMagnifyingGlass className="absolute left-5 text-white/80 text-xl sm:text-2xl pointer-events-none" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                placeholder="O que você procura?"
                                className="w-full bg-transparent pl-14 sm:pl-16 pr-12 py-3.5 sm:py-4 text-white text-base sm:text-lg font-medium placeholder-white/70 outline-none rounded-full"
                                aria-label="Buscar no portal"
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery("")}
                                    className="absolute right-5 text-white/70 hover:text-white transition-colors"
                                    aria-label="Limpar busca"
                                >
                                    <HiXMark className="text-xl" />
                                </button>
                            )}
                        </div>

                        {/* Dropdown de Autocomplete / Sugestões da Busca */}
                        {isFocused && resultados.length > 0 && (
                            <div className="absolute left-0 right-0 mt-3 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-50 animate-fade-in-up text-left">
                                <div className="p-2 sm:p-3">
                                    {resultados.map((r, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelectResult(r.href)}
                                            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/10 transition-all text-left rounded-xl text-white group"
                                        >
                                            <div>
                                                <div className="text-sm sm:text-base font-semibold group-hover:text-sky-300 transition-colors">
                                                    {r.titulo}
                                                </div>
                                                <div className="text-[10px] text-white/60 uppercase tracking-wider mt-0.5">
                                                    {r.secao}
                                                </div>
                                            </div>
                                            <span className="text-xs text-white/70 group-hover:translate-x-1 transition-transform">
                                                →
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botões Rápidos */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
                        {botoes.map((item, idx) => {
                            const Icon = item.icon;
                            const { href, isExternal } = getFinalUrl(item.href, item.identifier);

                            return (
                                <Link
                                    key={idx}
                                    href={href}
                                    target={isExternal ? "_blank" : undefined}
                                    rel={isExternal ? "noopener noreferrer" : undefined}
                                    className={
                                        idx === 0
                                            ? "bg-white text-emerald-950 font-bold px-5 sm:px-6 py-3 sm:py-3.5 rounded-full shadow-lg flex items-center gap-2.5 text-sm sm:text-base hover:bg-slate-100 transition-all duration-300 hover:scale-105 active:scale-95"
                                            : "bg-white/10 hover:bg-white text-white hover:text-slate-900 font-medium border border-white/30 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full flex items-center gap-2.5 text-sm sm:text-base backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
                                    }
                                >
                                    <Icon className="text-lg sm:text-xl flex-shrink-0" />
                                    <span>{item.label}</span>
                                    {isExternal && <FaExternalLinkAlt className="text-xs opacity-75" />}
                                </Link>
                            );
                        })}
                    </div>

                </div>

            </div>

            {/* Bottom Fade suave transição */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/50 to-transparent z-10 pointer-events-none" />
        </section>
    );
}


