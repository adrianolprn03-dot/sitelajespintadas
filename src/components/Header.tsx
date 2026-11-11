"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineBars3, HiOutlineXMark, HiMagnifyingGlass } from "react-icons/hi2";
import { FaShieldHalved, FaUserLock } from "react-icons/fa6";
import BuscaGlobal from "./BuscaGlobal";
import AccessibilityToolbar from "./AccessibilityToolbar";
import { MUNICIPIO } from "@/config/municipio";

const navItems = [
    { label: "Início", href: "/", hasDropdown: false },
    {
        label: "O Município", href: "/a-prefeitura", hasDropdown: true,
        children: [
            { label: "A Prefeitura", href: "/a-prefeitura" },
            { label: "Secretarias", href: "/secretarias" },
            { label: "História", href: "/a-prefeitura/historia" },
            { label: "Unidades Escolares", href: "/unidades-escolares" },
            { label: "Unidades de Saúde", href: "/unidades-de-saude" },
        ]
    },
    {
        label: "Transparência", href: "/transparencia", hasDropdown: true,
        children: [
            { label: "Portal da Transparência", href: "/transparencia" },
            { label: "Licitações Públicas", href: "/transparencia/licitacoes" },
            { label: "Contratos e Aditivos", href: "/transparencia/contratos" },
            { label: "Receitas Públicas", href: "/transparencia/receitas" },
            { label: "Despesas Públicas", href: "/transparencia/despesas" },
            { label: "Quadro de Pessoal", href: "/transparencia/servidores" },
            { label: "Diárias Concedidas", href: "/transparencia/diarias" },
            { label: "Obras Públicas", href: "/transparencia/obras" },
            { label: "Legislação Municipal", href: "/transparencia/legislacao" },
            { label: "Dados Abertos e API", href: "/transparencia/dados-abertos" },
            { label: "Transparência Passiva (e-SIC)", href: "/transparencia/passiva" },
        ]
    },
    {
        label: "Serviços", href: "/servicos/educacao", hasDropdown: true,
        children: [
            { label: "Educação e Escolas", href: "/servicos/educacao" },
            { label: "Assistência Social", href: "/servicos/social" },
            { label: "Cultura e Esporte", href: "/servicos/cultura" },
            { label: "Unidades de Saúde", href: "/unidades-de-saude" },
            { label: "Ouvidoria Municipal", href: "/servicos/ouvidoria" },
            { label: "e-SIC (LAI)", href: "/servicos/esic" },
        ]
    },
    {
        label: "Notícias", href: "/noticias", hasDropdown: false,
    },
    {
        label: "Cidadão", href: "/servicos/ouvidoria", hasDropdown: true,
        children: [
            { label: "Ouvidoria Municipal", href: "/servicos/ouvidoria" },
            { label: "e-SIC (LAI)", href: "/servicos/esic" },
            { label: "FAQ / Perguntas Frequentes", href: "/transparencia/faq" },
            { label: "Glossário do Cidadão", href: "/transparencia/glossario" },
            { label: "Política de Privacidade (LGPD)", href: "/privacidade" },
        ]
    },
];

const ChevronDown = () => (
    <svg width="10" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="inline ml-1.5 opacity-60">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const pathname = usePathname();
    const [logo, setLogo] = useState("/images/logo-lajes-pintadas-new.png");
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const res = await fetch("/api/admin/configuracoes");
                if (res.ok) {
                    const data = await res.json();
                    const portalLogo = data.find((c: any) => c.chave === "portal_logo")?.valor;
                    if (portalLogo) setLogo(portalLogo);
                }
            } catch (error) {
                console.error("Erro ao carregar logos:", error);
            }
        };
        fetchLogo();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="w-full z-50 fixed top-0 left-0 right-0 transition-all duration-300">
            <AccessibilityToolbar />

            {/* MAIN NAVBAR */}
            <div className={`w-full transition-all duration-300 flex items-center justify-between gap-6 px-4 md:px-8 lg:px-12 ${
                scrolled 
                    ? 'h-16 bg-white/95 backdrop-blur-md border-b border-[#DDE3EA] shadow-sm' 
                    : 'h-20 bg-white border-b border-[#DDE3EA] shadow-none'
            }`}>
                {/* Logo e Identidade */}
                <div className="flex-shrink-0">
                    <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#1254A3] rounded-lg p-1">
                        <div className="relative h-11 w-11 shrink-0 bg-slate-50 rounded-lg p-1 border border-[#DDE3EA] flex items-center justify-center">
                            <img
                                src={logo}
                                alt={`Prefeitura de ${MUNICIPIO.nome}`}
                                className="object-contain h-9 w-auto group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="hidden sm:block">
                            <span className="block text-[10px] font-bold text-[#5B738B] uppercase tracking-wider">
                                Poder Executivo
                            </span>
                            <span className="block text-base font-extrabold text-[#12304A] leading-tight font-heading group-hover:text-[#1254A3] transition-colors">
                                Prefeitura de {MUNICIPIO.nome}
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <nav id="menu-principal" className="hidden lg:flex items-center gap-1">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        const isDropdownOpen = openDropdown === index;

                        return (
                            <div 
                                key={index} 
                                className="relative py-2"
                                onMouseEnter={() => setOpenDropdown(index)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                <Link
                                    href={item.href}
                                    className={`h-9 px-3.5 flex items-center text-xs font-semibold rounded-[8px] transition-colors ${
                                        isActive 
                                            ? "text-[#1254A3] bg-blue-50/80 font-bold" 
                                            : "text-[#12304A] hover:text-[#1254A3] hover:bg-slate-50"
                                    }`}
                                >
                                    {item.label}
                                    {item.children && <ChevronDown />}
                                </Link>

                                {/* Dropdown Menu */}
                                {item.children && isDropdownOpen && (
                                    <div className="absolute top-full left-0 pt-2 w-64 animate-in fade-in duration-200">
                                        <div className="bg-white rounded-[10px] p-2 shadow-lg border border-[#DDE3EA] overflow-hidden space-y-1">
                                            {item.children.map((sub, sIndex) => (
                                                <Link
                                                    key={sIndex}
                                                    href={sub.href}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-medium text-[#12304A] hover:text-[#1254A3] hover:bg-blue-50/60 transition-colors"
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1254A3]/30" />
                                                    <span>{sub.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Botão Destaque Transparência e Ações */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/transparencia"
                        className="hidden sm:inline-flex items-center gap-2 bg-[#1254A3] hover:bg-[#0d4282] text-white text-xs font-bold px-4 py-2 rounded-[10px] shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#1254A3] focus:ring-offset-2"
                    >
                        <FaShieldHalved className="text-amber-300" size={13} />
                        <span>Portal da Transparência</span>
                    </Link>

                    <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="w-9 h-9 flex items-center justify-center rounded-[8px] bg-slate-50 text-[#5B738B] hover:bg-[#1254A3] hover:text-white transition-colors border border-[#DDE3EA]"
                        title="Buscar no portal"
                        aria-label="Buscar no portal"
                    >
                        <HiMagnifyingGlass size={18} />
                    </button>

                    <Link 
                        href="/admin" 
                        className="w-9 h-9 flex items-center justify-center rounded-[8px] bg-slate-50 text-[#5B738B] hover:bg-[#1254A3] hover:text-white transition-colors border border-[#DDE3EA]"
                        title="Painel Administrativo"
                        aria-label="Painel Administrativo"
                    >
                        <FaUserLock size={15} />
                    </Link>

                    <button 
                        onClick={() => setMobileOpen(!mobileOpen)} 
                        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-[8px] bg-[#1254A3] text-white hover:bg-[#0d4282] transition-colors"
                        aria-label="Menu de navegação"
                    >
                        {mobileOpen ? <HiOutlineXMark size={20} /> : <HiOutlineBars3 size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className={`lg:hidden fixed inset-0 top-[110px] bg-white z-40 overflow-y-auto px-6 py-6 border-t border-[#DDE3EA] space-y-4`}>
                    <div className="pb-3 border-b border-slate-100">
                        <Link
                            href="/transparencia"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center justify-center gap-2 w-full bg-[#1254A3] text-white text-xs font-bold py-3 rounded-[10px] shadow-sm"
                        >
                            <FaShieldHalved className="text-amber-300" size={14} />
                            <span>Acessar Portal da Transparência</span>
                        </Link>
                    </div>

                    <div className="flex flex-col space-y-2">
                        {navItems.map((item, index) => (
                            <div key={index} className="space-y-1">
                                <Link
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-3 py-2 text-sm font-bold text-[#12304A] hover:bg-slate-50 rounded-[8px]"
                                >
                                    {item.label}
                                </Link>
                                {item.children && (
                                    <div className="pl-4 space-y-1 border-l-2 border-slate-100 ml-3">
                                        {item.children.map((sub, sIdx) => (
                                            <Link
                                                key={sIdx}
                                                href={sub.href}
                                                onClick={() => setMobileOpen(false)}
                                                className="block py-1.5 px-2 text-xs text-[#5B738B] hover:text-[#1254A3]"
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Search Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 md:pt-32">
                    <div 
                        className="absolute inset-0 bg-[#0B2545]/60 backdrop-blur-sm" 
                        onClick={() => setIsSearchOpen(false)}
                    />
                    <div className="relative w-full max-w-2xl">
                        <div className="flex justify-end mb-3">
                            <button 
                                onClick={() => setIsSearchOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
                            >
                                <HiOutlineXMark size={20} />
                            </button>
                        </div>
                        <BuscaGlobal onClose={() => setIsSearchOpen(false)} />
                    </div>
                </div>
            )}
        </header>
    );
}
