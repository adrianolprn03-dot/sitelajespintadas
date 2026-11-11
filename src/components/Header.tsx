"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HiOutlineBars3,
    HiOutlineXMark,
    HiMagnifyingGlass,
    HiOutlineHome,
    HiOutlineSquares2X2,
    HiOutlineShieldCheck,
} from "react-icons/hi2";
import { FaUserLock, FaRegComments } from "react-icons/fa6";
import BuscaGlobal from "./BuscaGlobal";
import AccessibilityToolbar from "./AccessibilityToolbar";
import { MUNICIPIO } from "@/config/municipio";

const navItems = [
    {
        label: "Início",
        href: "/",
        hasDropdown: false,
    },
    {
        label: "O Município",
        href: "/a-prefeitura",
        hasDropdown: true,
        children: [
            { label: "A Prefeitura", href: "/a-prefeitura", color: "bg-[#0072CE]" },
            { label: "Prefeito e Vice", href: "/a-prefeitura/prefeito", color: "bg-[#15803D]" },
            { label: "História da Cidade", href: "/a-prefeitura/historia", color: "bg-[#EA580C]" },
            { label: "Símbolos Municipais", href: "/municipio/simbolos", color: "bg-[#EAB308]" },
            { label: "Estrutura Administrativa", href: "/a-prefeitura/estrutura", color: "bg-[#0072CE]" },
            { label: "Unidades Escolares", href: "/unidades-escolares", color: "bg-[#15803D]" },
            { label: "Unidades de Saúde", href: "/unidades-de-saude", color: "bg-[#EA580C]" },
        ],
    },
    {
        label: "Secretarias",
        href: "/secretarias",
        hasDropdown: true,
        children: [
            { label: "Gabinete do Prefeito", href: "/secretarias/gabinete", color: "bg-[#0072CE]" },
            { label: "Administração e Planejamento", href: "/secretarias/administracao", color: "bg-[#0072CE]" },
            { label: "Finanças e Tributação", href: "/secretarias/financas", color: "bg-[#15803D]" },
            { label: "Educação e Cultura", href: "/secretarias/educacao", color: "bg-[#EAB308]" },
            { label: "Saúde Pública", href: "/secretarias/saude", color: "bg-[#15803D]" },
            { label: "Obras e Infraestrutura", href: "/secretarias/obras", color: "bg-[#EA580C]" },
            { label: "Assistência Social", href: "/secretarias/social", color: "bg-[#EA580C]" },
            { label: "Agricultura e Meio Ambiente", href: "/secretarias/agricultura", color: "bg-[#15803D]" },
            { label: "Todas as Secretarias", href: "/secretarias", color: "bg-[#0072CE]" },
        ],
    },
    {
        label: "Serviços",
        href: "/transparencia/carta-servicos",
        hasDropdown: true,
        children: [
            { label: "Carta de Serviços ao Cidadão", href: "/transparencia/carta-servicos", color: "bg-[#0072CE]" },
            { label: "Ouvidoria Municipal", href: "/servicos/ouvidoria", color: "bg-[#EA580C]" },
            { label: "e-SIC (Acesso à Informação)", href: "/servicos/esic", color: "bg-[#EAB308]" },
            { label: "Consulta de Protocolo", href: "/servicos/consulta-protocolo", color: "bg-[#0072CE]" },
            { label: "Tributos e IPTU", href: "/servicos/tributario", color: "bg-[#15803D]" },
            { label: "Contracheque Online", href: "/servicos/contracheque", color: "bg-[#0072CE]" },
            { label: "Medicamentos SUS nas UBS", href: "/transparencia/medicamentos-sus", color: "bg-[#15803D]" },
            { label: "Central de Regulação", href: "/transparencia/central-regulacao", color: "bg-[#EA580C]" },
            { label: "Fila de Creches", href: "/transparencia/educacao", color: "bg-[#EAB308]" },
        ],
    },
    {
        label: "Notícias",
        href: "/noticias",
        hasDropdown: false,
    },
    {
        label: "Legislação",
        href: "/transparencia/legislacao",
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
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <>
            <header className="w-full z-50 fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-[#DCE4EE] shadow-[0_4px_20px_rgba(0,59,115,0.06)]">
                {/* Nível 1: Top Utility Bar em Verde Agave Profundo (Modelo 3) */}
                <AccessibilityToolbar />

                {/* Filete Heráldico Sutil com as 4 Cores do Brasão de Lajes Pintadas */}
                <div className="h-[3px] w-full heraldic-stripe opacity-90" />

                {/* Nível 2: Barra de Navegação Principal Cristalina com Brasão e Logo Oficial */}
                <div className="max-w-[1280px] mx-auto h-20 px-4 sm:px-6 flex items-center justify-between gap-4">
                    {/* BRASÃO OFICIAL E LOGO DA PREFEITURA DE LAJES PINTADAS/RN */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#0072CE] rounded-xl py-1 shrink-0"
                    >
                        <img
                            src="/images/logo-lajes-pintadas-colorida.png"
                            alt={`Brasão e Logo Oficial da ${MUNICIPIO.nomeCompleto} - ${MUNICIPIO.uf}`}
                            className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                    </Link>

                    {/* MENU DE NAVEGAÇÃO DESKTOP CENTRALIZADO (Modelo 3) */}
                    <nav id="menu-principal" className="hidden lg:flex items-center gap-1">
                        {navItems.map((item, index) => {
                            const isActive =
                                item.href === "/"
                                    ? pathname === "/"
                                    : pathname === item.href || pathname.startsWith(item.href);
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
                                        className={`px-3.5 py-2 text-[13.5px] font-bold rounded-xl transition-all flex items-center gap-1 ${
                                            isActive
                                                ? "text-[#0072CE] bg-[#F0F7FF]"
                                                : "text-[#0F2942] hover:text-[#0072CE] hover:bg-slate-50"
                                        }`}
                                    >
                                        <span>{item.label}</span>
                                        {item.children && <ChevronDown />}
                                    </Link>

                                    {/* Dropdown Menu com Marcadores nas Cores do Brasão */}
                                    {item.children && isDropdownOpen && (
                                        <div className="absolute top-full left-0 pt-1.5 w-64 animate-in fade-in duration-150">
                                            <div className="bg-white rounded-2xl p-2 shadow-2xl border border-[#DCE4EE] overflow-hidden space-y-0.5">
                                                <div className="h-1 w-full rounded-full heraldic-stripe mb-1.5 opacity-80" />
                                                {item.children.map((sub, sIndex) => (
                                                    <Link
                                                        key={sIndex}
                                                        href={sub.href}
                                                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#0F2942] hover:text-[#0072CE] hover:bg-[#F0F7FF] transition-colors"
                                                    >
                                                        <span className={`w-2 h-2 rounded-full ${sub.color} shrink-0`} />
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

                    {/* BOTÕES DE AÇÃO DO MODELO 3: e-SIC/Ouvidoria (Contorno) + Portal da Transparência (Safira & Ouro) */}
                    <div className="flex items-center gap-2.5">
                        <Link
                            href="/servicos/ouvidoria"
                            className="hidden xl:inline-flex items-center gap-2 border-2 border-[#0F2942]/80 hover:border-[#EA580C] text-[#0F2942] hover:text-[#EA580C] text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-200"
                        >
                            <FaRegComments size={13} />
                            <span>e-SIC / Ouvidoria</span>
                        </Link>

                        <Link
                            href="/transparencia"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0072CE] to-[#005bb5] hover:from-[#005bb5] hover:to-[#004B87] text-white text-xs sm:text-[13px] font-extrabold px-4 sm:px-5 py-2.5 rounded-full shadow-md ring-2 ring-[#FACC15] ring-offset-1 transition-all duration-200 hover:scale-[1.02] focus:outline-none"
                        >
                            <span>Portal da Transparência</span>
                        </Link>

                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F4F7FB] text-[#0F2942] hover:bg-[#0072CE] hover:text-white transition-colors border border-[#DCE4EE] cursor-pointer"
                            title="Buscar no portal"
                            aria-label="Buscar no portal"
                        >
                            <HiMagnifyingGlass size={18} />
                        </button>

                        <Link
                            href="/admin"
                            className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full bg-[#F4F7FB] text-[#526B84] hover:bg-[#003B73] hover:text-white transition-colors border border-[#DCE4EE]"
                            title="Painel Administrativo"
                            aria-label="Painel Administrativo"
                        >
                            <FaUserLock size={13} />
                        </Link>

                        {/* Botão Hambúrguer Mobile */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-[#0072CE] text-white hover:bg-[#005bb5] transition-colors cursor-pointer"
                            aria-label="Menu de navegação"
                        >
                            {mobileOpen ? <HiOutlineXMark size={20} /> : <HiOutlineBars3 size={20} />}
                        </button>
                    </div>
                </div>

                {/* MENU MOBILE DROPDOWN */}
                {mobileOpen && (
                    <div className="lg:hidden bg-white border-b border-[#DCE4EE] px-4 py-4 space-y-3 shadow-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <Link
                                href="/servicos/esic"
                                onClick={() => setMobileOpen(false)}
                                className="flex-1 text-center py-2.5 px-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold"
                            >
                                e-SIC (LAI)
                            </Link>
                            <Link
                                href="/servicos/ouvidoria"
                                onClick={() => setMobileOpen(false)}
                                className="flex-1 text-center py-2.5 px-3 rounded-xl bg-orange-50 text-orange-800 border border-orange-200 text-xs font-bold"
                            >
                                Ouvidoria 24h
                            </Link>
                        </div>

                        {navItems.map((item, index) => (
                            <div key={index} className="space-y-1">
                                <Link
                                    href={item.href}
                                    onClick={() => !item.children && setMobileOpen(false)}
                                    className="block font-extrabold text-sm text-[#0F2942] py-2 px-2 hover:bg-[#F0F7FF] rounded-lg"
                                >
                                    {item.label}
                                </Link>
                                {item.children && (
                                    <div className="pl-4 space-y-1 border-l-2 border-[#0072CE]/20 ml-2">
                                        {item.children.map((sub, sIndex) => (
                                            <Link
                                                key={sIndex}
                                                href={sub.href}
                                                onClick={() => setMobileOpen(false)}
                                                className="flex items-center gap-2 text-xs font-semibold text-slate-600 py-1.5 px-2 hover:text-[#0072CE]"
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${sub.color}`} />
                                                <span>{sub.label}</span>
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
                                className="text-xs font-bold text-slate-600 hover:text-[#0072CE] flex items-center gap-1.5 py-2"
                            >
                                <FaUserLock size={12} />
                                <span>Área Restrita / Painel</span>
                            </Link>
                        </div>
                    </div>
                )}

                {isSearchOpen && <BuscaGlobal onClose={() => setIsSearchOpen(false)} />}
            </header>

            {/* BARRA DE NAVEGAÇÃO INFERIOR MOBILE-FIRST (Modelo 3 Glass Pill Dock) */}
            <nav
                aria-label="Navegação rápida mobile"
                className="lg:hidden fixed bottom-3 left-3 right-3 z-40 bg-white/95 backdrop-blur-xl border border-[#DCE4EE] rounded-2xl shadow-[0_10px_30px_rgba(0,59,115,0.18)] px-2 py-1.5 flex items-center justify-around no-print"
            >
                <Link
                    href="/"
                    className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-colors ${
                        pathname === "/" ? "text-[#15803D]" : "text-slate-500 hover:text-[#0072CE]"
                    }`}
                >
                    <HiOutlineHome size={19} />
                    <span className="mt-0.5">Início</span>
                </Link>

                <Link
                    href="/transparencia/carta-servicos"
                    className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-colors ${
                        pathname.startsWith("/servicos") || pathname.includes("carta-servicos")
                            ? "text-[#0072CE]"
                            : "text-slate-500 hover:text-[#0072CE]"
                    }`}
                >
                    <HiOutlineSquares2X2 size={19} />
                    <span className="mt-0.5">Serviços</span>
                </Link>

                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="flex flex-col items-center justify-center -mt-4 w-11 h-11 rounded-full bg-gradient-to-br from-[#15803D] to-[#064E3B] text-white shadow-lg shadow-emerald-900/25 ring-2 ring-[#FACC15] cursor-pointer"
                    aria-label="Buscar no portal"
                >
                    <HiMagnifyingGlass size={20} />
                </button>

                <Link
                    href="/transparencia"
                    className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-colors ${
                        pathname.startsWith("/transparencia") && !pathname.includes("carta-servicos")
                            ? "text-[#0072CE]"
                            : "text-slate-500 hover:text-[#0072CE]"
                    }`}
                >
                    <HiOutlineShieldCheck size={19} />
                    <span className="mt-0.5">Transparência</span>
                </Link>

                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold text-slate-500 hover:text-[#0072CE] cursor-pointer"
                >
                    <HiOutlineBars3 size={19} />
                    <span className="mt-0.5">Menu</span>
                </button>
            </nav>
        </>
    );
}
