"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAccessibility } from "./AccessibilityProvider";
import { usePathname } from "next/navigation";
import { HiOutlineCloud, HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import BuscaGlobal from "./BuscaGlobal";

const navItems = [
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
        label: "Serviços", href: "/servicos/saude", hasDropdown: true,
        children: [
            { label: "Saúde", href: "/servicos/saude" },
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
    const pathname = usePathname();
    const [logo, setLogo] = useState("/logo_oficial.png");

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

    const dataAtual = new Date().toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    }).replace(/^\w/, (c) => c.toUpperCase());

    return (
        <header className="w-full z-50 fixed top-0 left-0 right-0 transition-all duration-500">
            <AccessibilityToolbar />

            {/* MAIN NAVBAR - FULL WIDTH STRIP */}
            <div className={`w-full transition-all duration-500 flex items-center justify-between gap-8 px-4 md:px-10 lg:px-16 shadow-xl ${scrolled ? 'h-12 bg-white/80 backdrop-blur-2xl border-b border-primary-100 shadow-primary-900/5' : 'h-16 md:h-20 bg-white/60 backdrop-blur-xl border-b border-white shadow-none'} relative`}>
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link href="/" className="flex items-center">
                        <img
                            src={logo}
                            alt="Prefeitura de Lajes Pintadas"
                            className="object-contain h-9 w-auto md:h-11"
                        />
                    </Link>
                </div>

                {/* Desktop Menu - Centered & Refined */}
                <nav id="menu" className="hidden lg:flex items-center gap-1 justify-center">
                    {[
                        { label: "Serviços", href: "/servicos/saude" },
                        { label: "Notícias", href: "/noticias" },
                        { label: "Transparência", href: "/transparencia" },
                        { label: "Símbolos", href: "/municipio/simbolos" },
                        { label: "Ouvidoria", href: "/servicos/ouvidoria" },
                        { label: "Contato", href: "/contato" }
                    ].map((item, index) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`h-10 px-4 flex items-center text-[11px] font-black uppercase tracking-[0.2em] rounded-full transition-all duration-300 ${
                                    isActive 
                                    ? "text-primary-600 bg-primary-50" 
                                    : "text-primary-900 hover:text-primary-500 hover:bg-gray-50"
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Profile/User Icon (Mockup style) */}
                <div className="flex items-center justify-end shrink-0 gap-4">
                    <Link href="/admin" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-primary-500 hover:text-white transition-all shadow-inner border border-gray-100">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </Link>
                    
                    <button 
                        onClick={() => setMobileOpen(!mobileOpen)} 
                        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-all shadow-lg"
                        aria-label="Toggle Menu"
                    >
                        {mobileOpen ? <HiOutlineXMark size={24} /> : <HiOutlineBars3 size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu - Simplified */}
            {mobileOpen && (
                <div className="lg:hidden mt-4 glass-light rounded-[2.5rem] shadow-2xl max-h-[70vh] overflow-y-auto w-full p-6 border border-white/50 animate-fade-in-up">
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { label: "Serviços", href: "/servicos/saude" },
                            { label: "Notícias", href: "/noticias" },
                            { label: "Transparência", href: "/transparencia" },
                            { label: "Ouvidoria", href: "/servicos/ouvidoria" },
                            { label: "Contato", href: "/contato" }
                        ].map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center justify-between p-5 text-gray-800 font-black uppercase tracking-[0.25em] text-[11px] bg-white border border-gray-100 rounded-3xl shadow-sm hover:border-primary-400 transition-all"
                            >
                                {item.label}
                                <span className="text-primary-500">→</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
