"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineBars3, HiOutlineXMark, HiMagnifyingGlass, HiArrowTopRightOnSquare } from "react-icons/hi2";
import { FaUserLock } from "react-icons/fa6";
import BuscaGlobal from "./BuscaGlobal";
import AccessibilityToolbar from "./AccessibilityToolbar";
import { MUNICIPIO } from "@/config/municipio";

const navItems = [
    {
        label: "O Município", 
        href: "/a-prefeitura", 
        hasDropdown: true,
        children: [
            { label: "A Prefeitura", href: "/a-prefeitura" },
            { label: "Prefeito e Vice", href: "/a-prefeitura/prefeito" },
            { label: "História", href: "/a-prefeitura/historia" },
            { label: "Estrutura Administrativa", href: "/a-prefeitura/estrutura" },
            { label: "Unidades Escolares", href: "/unidades-escolares" },
            { label: "Unidades de Saúde", href: "/unidades-de-saude" },
        ]
    },
    {
        label: "Secretarias", 
        href: "/secretarias", 
        hasDropdown: true,
        children: [
            { label: "Gabinete do Prefeito", href: "/secretarias/gabinete" },
            { label: "Administração e Planejamento", href: "/secretarias/administracao" },
            { label: "Finanças e Tributação", href: "/secretarias/financas" },
            { label: "Educação e Cultura", href: "/secretarias/educacao" },
            { label: "Saúde Pública", href: "/secretarias/saude" },
            { label: "Obras e Infraestrutura", href: "/secretarias/obras" },
            { label: "Assistência Social", href: "/secretarias/social" },
            { label: "Agricultura e Meio Ambiente", href: "/secretarias/agricultura" },
            { label: "Todas as Secretarias", href: "/secretarias" },
        ]
    },
    {
        label: "Serviços", 
        href: "/servicos/ouvidoria", 
        hasDropdown: true,
        children: [
            { label: "Ouvidoria Municipal", href: "/servicos/ouvidoria" },
            { label: "e-SIC (LAI)", href: "/servicos/esic" },
            { label: "Carta de Serviços", href: "/transparencia/carta-servicos" },
            { label: "Tributos e IPTU", href: "/servicos/tributario" },
            { label: "Contracheque Online", href: "/servicos/contracheque" },
            { label: "Medicamentos SUS", href: "/transparencia/medicamentos-sus" },
            { label: "Central de Regulação", href: "/transparencia/central-regulacao" },
            { label: "Fila de Creches", href: "/transparencia/educacao" },
        ]
    },
    {
        label: "Notícias", 
        href: "/noticias", 
        hasDropdown: false,
    },
];

const ChevronDown = () => (
    <svg width="10" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="inline ml-1 opacity-70">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
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

    return (
        <header className="w-full z-50 fixed top-0 left-0 right-0 bg-white border-b border-[#DDE3EA] shadow-none">
            <AccessibilityToolbar />

            {/* BARRA PRINCIPAL */}
            <div className="max-w-[1240px] mx-auto h-20 px-4 sm:px-6 flex items-center justify-between gap-6">
                {/* LOGO OFICIAL CONFORME A IMAGEM */}
                <Link href="/" className="flex items-center gap-3.5 group focus:outline-none focus:ring-2 focus:ring-[#1254A3] rounded-lg">
                    <img
                        src={logo}
                        alt={`Prefeitura de ${MUNICIPIO.nome}`}
                        className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                    <div className="hidden sm:block border-l border-slate-300 pl-3.5">
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight">
                            PREFEITURA DE
                        </span>
                        <span className="block text-base sm:text-lg font-black text-[#12304A] font-heading leading-tight tracking-tight">
                            LAJES PINTADAS
                        </span>
                        <span className="block text-[10px] font-medium text-slate-500 leading-tight">
                            Rio Grande do Norte
                        </span>
                    </div>
                </Link>

                {/* MENU DE NAVEGAÇÃO DESKTOP */}
                <nav id="menu-principal" className="hidden lg:flex items-center gap-2">
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
                                    className={`px-3.5 py-2 text-sm font-semibold rounded-[8px] transition-colors flex items-center gap-1 ${
                                        isActive 
                                            ? "text-[#1254A3] font-bold" 
                                            : "text-[#12304A] hover:text-[#1254A3]"
                                    }`}
                                >
                                    <span>{item.label}</span>
                                    {item.children && <ChevronDown />}
                                </Link>

                                {/* Dropdown Menu */}
                                {item.children && isDropdownOpen && (
                                    <div className="absolute top-full left-0 pt-1 w-64 animate-in fade-in duration-150">
                                        <div className="bg-white rounded-[10px] p-2 shadow-xl border border-[#DDE3EA] overflow-hidden space-y-1">
                                            {item.children.map((sub, sIndex) => (
                                                <Link
                                                    key={sIndex}
                                                    href={sub.href}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-semibold text-[#12304A] hover:text-[#1254A3] hover:bg-[#F0F6FD] transition-colors"
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1254A3]" />
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

                {/* BOTÃO EM DESTAQUE: PORTAL DA TRANSPARÊNCIA */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/transparencia"
                        className="inline-flex items-center gap-2 bg-[#1254A3] hover:bg-[#0d4282] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-[8px] shadow-sm transition-all hover:shadow focus:outline-none focus:ring-2 focus:ring-[#1254A3] focus:ring-offset-2"
                    >
                        <span>Portal da Transparência</span>
                        <HiArrowTopRightOnSquare size={16} />
                    </Link>

                    <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="w-9 h-9 flex items-center justify-center rounded-[8px] bg-slate-50 text-slate-500 hover:bg-[#1254A3] hover:text-white transition-colors border border-slate-200"
                        title="Buscar no portal"
                        aria-label="Buscar no portal"
                    >
                        <HiMagnifyingGlass size={18} />
                    </button>

                    <Link 
                        href="/admin" 
                        className="hidden sm:flex w-9 h-9 items-center justify-center rounded-[8px] bg-slate-50 text-slate-500 hover:bg-[#1254A3] hover:text-white transition-colors border border-slate-200"
                        title="Painel Administrativo"
                        aria-label="Painel Administrativo"
                    >
                        <FaUserLock size={14} />
                    </Link>

                    {/* Botão Hambúrguer Mobile */}
                    <button 
                        onClick={() => setMobileOpen(!mobileOpen)} 
                        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-[8px] bg-[#1254A3] text-white hover:bg-[#0d4282] transition-colors"
                        aria-label="Menu de navegação"
                    >
                        {mobileOpen ? <HiOutlineXMark size={20} /> : <HiOutlineBars3 size={20} />}
                    </button>
                </div>
            </div>

            {/* MENU MOBILE COMPACTO */}
            {mobileOpen && (
                <div className="lg:hidden bg-white border-b border-[#DDE3EA] px-4 py-4 space-y-3 shadow-xl max-h-[80vh] overflow-y-auto">
                    {navItems.map((item, index) => (
                        <div key={index} className="space-y-1">
                            <Link
                                href={item.href}
                                onClick={() => !item.children && setMobileOpen(false)}
                                className="block font-bold text-sm text-[#12304A] py-2 px-2 hover:bg-[#F0F6FD] rounded-[6px]"
                            >
                                {item.label}
                            </Link>
                            {item.children && (
                                <div className="pl-4 space-y-1 border-l-2 border-slate-100 ml-2">
                                    {item.children.map((sub, sIndex) => (
                                        <Link
                                            key={sIndex}
                                            href={sub.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="block text-xs font-medium text-slate-600 py-1.5 px-2 hover:text-[#1254A3]"
                                        >
                                            {sub.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <Link
                            href="/admin"
                            onClick={() => setMobileOpen(false)}
                            className="text-xs font-bold text-slate-600 hover:text-[#1254A3] flex items-center gap-1.5 py-2"
                        >
                            <FaUserLock size={12} />
                            <span>Área Restrita / Painel</span>
                        </Link>
                    </div>
                </div>
            )}

            {isSearchOpen && <BuscaGlobal onClose={() => setIsSearchOpen(false)} />}
        </header>
    );
}
