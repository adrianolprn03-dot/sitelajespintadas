"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
    FaUniversalAccess, 
    FaFont, 
    FaCircleHalfStroke, 
    FaBars, 
    FaXmark,
    FaArrowRight,
    FaShieldHalved
} from "react-icons/fa6";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { MUNICIPIO } from "@/config/municipio";

export default function PreviaHeader() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");

    const toggleContrast = () => {
        setHighContrast(!highContrast);
        document.documentElement.classList.toggle("high-contrast");
    };

    const changeFontSize = (delta: number) => {
        if (delta > 0) {
            setFontSize(fontSize === "normal" ? "large" : "xlarge");
            document.documentElement.classList.add("font-large");
        } else {
            setFontSize("normal");
            document.documentElement.classList.remove("font-large", "font-xlarge");
        }
    };

    const navLinks = [
        { label: "Início", href: "/previa" },
        { label: "O Município", href: "/a-prefeitura" },
        { label: "Transparência", href: "/previa/transparencia" },
        { label: "Publicações Oficiais", href: "/previa/licitacoes" },
        { label: "Serviços", href: "/servicos/educacao" },
        { label: "Notícias", href: "/noticias" },
        { label: "Ouvidoria", href: "/servicos/ouvidoria" },
    ];

    return (
        <header className="w-full sticky top-0 z-50 bg-white border-b border-[#DDE3EA]">
            {/* 1. FAIXA AZUL DE ACESSIBILIDADE GOVERNAMENTAL */}
            <div className="bg-[#1254A3] text-white text-[11px] font-semibold py-1.5 px-4 sm:px-6">
                <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-between gap-2">
                    {/* Atalhos de Teclado (e-MAG) */}
                    <div className="hidden lg:flex items-center gap-3 text-white/90">
                        <span className="text-white/70 font-normal">Ir para:</span>
                        <a href="#conteudo-principal-previa" className="hover:underline focus:outline-none focus:ring-1 focus:ring-white px-1">
                            Conteúdo [1]
                        </a>
                        <span className="text-white/40">·</span>
                        <a href="#menu-principal-previa" className="hover:underline focus:outline-none focus:ring-1 focus:ring-white px-1">
                            Menu [2]
                        </a>
                        <span className="text-white/40">·</span>
                        <a href="#busca-previa" className="hover:underline focus:outline-none focus:ring-1 focus:ring-white px-1">
                            Busca [3]
                        </a>
                        <span className="text-white/40">·</span>
                        <a href="#rodape-previa" className="hover:underline focus:outline-none focus:ring-1 focus:ring-white px-1">
                            Rodapé [4]
                        </a>
                    </div>

                    {/* Aviso de Modo Prévia */}
                    <div className="flex items-center gap-2 bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider text-amber-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span>Ambiente de Prévia do Novo Design</span>
                    </div>

                    {/* Controles de Acessibilidade */}
                    <div className="flex items-center gap-4 ml-auto">
                        <button
                            onClick={toggleContrast}
                            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors focus:outline-none focus:ring-1 focus:ring-white px-1 py-0.5 rounded"
                            title="Alternar Alto Contraste"
                            aria-label="Alternar Alto Contraste"
                        >
                            <FaCircleHalfStroke size={12} />
                            <span className="hidden sm:inline">Alto Contraste</span>
                        </button>
                        <div className="flex items-center gap-1 bg-white/15 rounded px-1.5 py-0.5">
                            <span className="text-white/70 mr-1 text-[10px]">Fonte:</span>
                            <button
                                onClick={() => changeFontSize(-1)}
                                className="px-1 font-bold hover:text-amber-300 transition-colors"
                                title="Diminuir fonte"
                                aria-label="Diminuir fonte"
                            >
                                A-
                            </button>
                            <button
                                onClick={() => changeFontSize(1)}
                                className="px-1 font-bold hover:text-amber-300 transition-colors"
                                title="Aumentar fonte"
                                aria-label="Aumentar fonte"
                            >
                                A+
                            </button>
                        </div>
                        <Link
                            href="/previa/transparencia"
                            className="hidden md:inline-flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors font-bold"
                        >
                            <FaShieldHalved size={11} />
                            <span>Acesso à Informação</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. CABEÇALHO INSTITUCIONAL BRANCO */}
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-6">
                {/* Identidade / Brasão */}
                <Link href="/previa" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#1254A3] rounded-lg p-1">
                    <div className="relative w-12 h-12 shrink-0 bg-slate-50 rounded-lg p-1 border border-[#DDE3EA] flex items-center justify-center">
                        <Image
                            src="/images/logo-lajes-pintadas-new.png"
                            alt="Brasão de Lajes Pintadas/RN"
                            width={44}
                            height={44}
                            className="object-contain"
                            priority
                            onError={(e) => {
                                // fallback se falhar
                                const target = e.target as HTMLElement;
                                target.style.display = 'none';
                            }}
                        />
                    </div>
                    <div>
                        <span className="block text-[11px] font-bold text-[#5B738B] uppercase tracking-wider">
                            Poder Executivo Municipal
                        </span>
                        <h2 className="text-lg sm:text-xl font-extrabold text-[#12304A] leading-tight group-hover:text-[#1254A3] transition-colors font-heading">
                            Prefeitura de Lajes Pintadas
                        </h2>
                        <span className="block text-[10px] font-semibold text-[#1254A3] uppercase tracking-widest">
                            Estado do Rio Grande do Norte
                        </span>
                    </div>
                </Link>

                {/* Menu de Navegação Desktop */}
                <nav id="menu-principal-previa" className="hidden xl:flex items-center gap-1" aria-label="Navegação Principal">
                    {navLinks.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3 py-2 text-xs font-semibold rounded-[8px] transition-colors ${
                                    active
                                        ? "text-[#1254A3] bg-blue-50/80 font-bold"
                                        : "text-[#12304A] hover:text-[#1254A3] hover:bg-slate-50"
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Botão de Destaque "Portal da Transparência" */}
                <div className="hidden sm:flex items-center gap-3">
                    <Link
                        href="/previa/transparencia"
                        className="inline-flex items-center gap-2 bg-[#1254A3] hover:bg-[#0d4282] text-white text-xs font-bold px-4 py-2.5 rounded-[10px] shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#1254A3] focus:ring-offset-2"
                    >
                        <FaShieldHalved className="text-amber-300" size={14} />
                        <span>Portal da Transparência</span>
                    </Link>
                </div>

                {/* Botão Mobile Hambúrguer */}
                <div className="flex xl:hidden items-center gap-2">
                    <Link
                        href="/previa/transparencia"
                        className="sm:hidden inline-flex items-center gap-1.5 bg-[#1254A3] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-[8px]"
                    >
                        <FaShieldHalved size={12} className="text-amber-300" />
                        <span>Transparência</span>
                    </Link>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-[8px] border border-[#DDE3EA] text-[#12304A] hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1254A3]"
                        aria-label="Abrir menu de navegação"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
                    </button>
                </div>
            </div>

            {/* Menu Dropdown Mobile */}
            {mobileMenuOpen && (
                <div className="xl:hidden bg-white border-t border-[#DDE3EA] px-4 py-4 space-y-2 animate-in fade-in duration-200">
                    {navLinks.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block px-3 py-2.5 text-sm font-semibold rounded-[8px] ${
                                pathname === item.href
                                    ? "bg-blue-50 text-[#1254A3] font-bold"
                                    : "text-[#12304A] hover:bg-slate-50"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="pt-2 border-t border-slate-100">
                        <Link
                            href="/previa/transparencia"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-center gap-2 w-full bg-[#1254A3] text-white text-xs font-bold py-3 rounded-[10px] shadow-sm"
                        >
                            <FaShieldHalved className="text-amber-300" size={14} />
                            <span>Acessar Portal da Transparência</span>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}

