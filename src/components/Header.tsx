"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAccessibility } from "./AccessibilityProvider";
import { usePathname } from "next/navigation";
import { HiOutlineCloud, HiOutlineBars3, HiOutlineXMark, HiMagnifyingGlass } from "react-icons/hi2";
import BuscaGlobal from "./BuscaGlobal";


const navItems = [
    { label: "Início", href: "/", hasDropdown: false },
    {
        label: "O Município", href: "/a-prefeitura", hasDropdown: true,
        children: [
            { label: "A Prefeitura", href: "/a-prefeitura" },
            { label: "Secretarias", href: "/secretarias" },
            { label: "História", href: "/a-prefeitura/historia" },
        ]
    },
    {
        label: "Transparência", href: "/transparencia", hasDropdown: true,
        children: [
            { label: "Portal da Transparência", href: "/transparencia" },
            { label: "Obras Públicas", href: "/transparencia/obras" },
            { label: "Licitações", href: "/transparencia/licitacoes" },
            { label: "Contratos", href: "/transparencia/contratos" },
            { label: "Legislação Municipal", href: "/transparencia/legislacao" },
            { label: "Dados Abertos", href: "/transparencia/dados-abertos" },
            { label: "Transferências Const.", href: "/transparencia/transferencias" },
            { label: "Dívida Ativa", href: "/transparencia/divida-ativa" },
            { label: "Conselhos Municipais", href: "/transparencia/conselhos" },
            { label: "Transparência Passiva (e-SIC)", href: "/transparencia/passiva" },
        ]
    },
    {
        label: "Informativos", href: "/noticias", hasDropdown: true,
        children: [
            { label: "Notícias", href: "/noticias" },
            { label: "Agenda de Eventos", href: "/agenda" },
            { label: "Galeria de Fotos", href: "/galeria" },
        ]
    },
    {
        label: "Serviços", href: "/unidades-de-saude", hasDropdown: true,
        children: [
            { label: "Saúde", href: "/unidades-de-saude" },
            { label: "Assistência Social", href: "/servicos/social" },
            { label: "Educação", href: "/servicos/educacao" },
            { label: "Cultura e Esporte", href: "/servicos/cultura" },
        ]
    },
    {
        label: "Cidadão", href: "/servicos/ouvidoria", hasDropdown: true,
        children: [
            { label: "Ouvidoria Municipal", href: "/servicos/ouvidoria" },
            { label: "e-SIC (LAI)", href: "/servicos/esic" },
            { label: "FAQ - Perguntas", href: "/transparencia/faq" },
            { label: "Glossário", href: "/transparencia/glossario" },
            { label: "Política de Privacidade", href: "/privacidade" },
        ]
    },
];

const ChevronDown = () => (
    <svg width="10" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="inline ml-1.5 opacity-60">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

import AccessibilityToolbar from "./AccessibilityToolbar";

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const pathname = usePathname();
    const [logo, setLogo] = useState("/logo_oficial.png");
    const [isSearchOpen, setIsSearchOpen] = useState(false);


    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const res = await fetch("/api/admin/configuracoes");
                if (res.ok) {
                    const data = await res.json();
                    const brasao = data.find((c: any) => c.chave === "simbolo_brasao")?.valor;
                    if (brasao) setLogo(brasao);
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
        <header className="w-full z-50 fixed top-0 left-0 right-0 transition-all duration-500">
            <AccessibilityToolbar />

            {/* MAIN NAVBAR */}
            <div className={`w-full transition-all duration-500 flex items-center justify-between gap-8 px-4 md:px-10 lg:px-16 shadow-xl ${scrolled ? 'h-14 bg-white/90 backdrop-blur-2xl border-b border-primary-100 shadow-primary-900/5' : 'h-20 md:h-24 bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-none'} relative`}>
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link href="/" className="flex items-center group">
                        <img
                            src={logo}
                            alt="Prefeitura de Lajes Pintadas"
                            className="object-contain h-10 w-auto md:h-12 group-hover:scale-105 transition-transform duration-500"
                        />
                    </Link>
                </div>

                {/* Desktop Menu */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        const isDropdownOpen = openDropdown === index;

                        return (
                            <div 
                                key={index} 
                                className="relative py-4"
                                onMouseEnter={() => setOpenDropdown(index)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                <Link
                                    href={item.href}
                                    className={`h-10 px-5 flex items-center text-[10.5px] font-black uppercase tracking-[0.15em] rounded-full transition-all duration-300 ${
                                        isActive 
                                        ? "text-primary-600 bg-primary-50" 
                                        : "text-primary-900 hover:text-primary-500 hover:bg-gray-50"
                                    }`}
                                >
                                    {item.label}
                                    {item.children && <ChevronDown />}
                                </Link>

                                {/* Dropdown Menu */}
                                {item.children && isDropdownOpen && (
                                    <div className="absolute top-full left-0 pt-2 w-64 animate-dropdown-fade">
                                        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-4 shadow-2xl shadow-primary-900/10 border border-primary-50 overflow-hidden">
                                            {item.children.map((sub, sIndex) => (
                                                <Link
                                                    key={sIndex}
                                                    href={sub.href}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-bold text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all group/sub"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-200 group-hover/sub:bg-primary-500 transition-colors" />
                                                    <span className="uppercase tracking-widest">{sub.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <Link
                        href="/contato"
                        className="h-10 px-5 flex items-center text-[10.5px] font-black uppercase tracking-[0.2em] text-primary-900 hover:text-primary-500 hover:bg-gray-50 rounded-full transition-all"
                    >
                        Contato
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-primary-500 hover:text-white transition-all shadow-inner border border-gray-100"
                        title="Buscar no portal"
                    >
                        <HiMagnifyingGlass size={20} />
                    </button>

                    <Link href="/admin" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-primary-500 hover:text-white transition-all shadow-inner border border-gray-100">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </Link>

                    
                    <button 
                        onClick={() => setMobileOpen(!mobileOpen)} 
                        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-all shadow-lg"
                    >
                        {mobileOpen ? <HiOutlineXMark size={24} /> : <HiOutlineBars3 size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 top-[110px] bg-white/95 backdrop-blur-xl z-40 overflow-y-auto animate-fade-in px-6 py-10">
                    <div className="flex flex-col gap-8">
                        {navItems.map((item, index) => (
                            <div key={index} className="flex flex-col gap-4">
                                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-300 px-2">{item.label}</div>
                                <div className="grid grid-cols-1 gap-2">
                                    {(item.children || [{ label: item.label, href: item.href }]).map((sub, sIdx) => (
                                        <Link
                                            key={sIdx}
                                            href={sub.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-between p-5 text-primary-900 font-black uppercase tracking-[0.25em] text-[10px] bg-white border border-primary-50 rounded-3xl shadow-sm hover:border-primary-400 transition-all underline-offset-4"
                                        >
                                            {sub.label}
                                            <span className="text-primary-500">→</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <Link
                            href="/contato"
                            onClick={() => setMobileOpen(false)}
                            className="bg-primary-600 text-white text-center p-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-500/20"
                        >
                            Falar com a Prefeitura
                        </Link>
                    </div>
                </div>
            )}
            {/* Search Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 md:pt-32">
                    <div 
                        className="absolute inset-0 bg-primary-950/40 backdrop-blur-md animate-fade-in" 
                        onClick={() => setIsSearchOpen(false)}
                    />
                    <div className="relative w-full max-w-2xl animate-fade-in-up">
                        <div className="flex justify-end mb-4">
                            <button 
                                onClick={() => setIsSearchOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
                            >
                                <HiOutlineXMark size={24} />
                            </button>
                        </div>
                        <BuscaGlobal onClose={() => setIsSearchOpen(false)} />
                    </div>
                </div>
            )}
        </header>
    );
}

