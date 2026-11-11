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
            { label: "A Prefeitura", href: "/a-prefeitura" },
            { label: "Prefeito e Vice", href: "/a-prefeitura/prefeito" },
            { label: "História da Cidade", href: "/a-prefeitura/historia" },
            { label: "Símbolos Municipais", href: "/municipio/simbolos" },
            { label: "Estrutura Administrativa", href: "/a-prefeitura/estrutura" },
            { label: "Unidades Escolares", href: "/unidades-escolares" },
            { label: "Unidades de Saúde", href: "/unidades-de-saude" },
        ],
    },
    {
        label: "Secretarias",
        href: "/secretarias",
        hasDropdown: true,
        children: [
            { label: "Gabinete", href: "/secretarias/gabinete" },
            { label: "Administração e Planejamento", href: "/secretarias/administracao-geral-planejamento" },
            { label: "Saúde", href: "/secretarias/saude" },
            { label: "Educação e Cultura", href: "/secretarias/educacao-cultura" },
            { label: "Assistência Social", href: "/secretarias/assistencia-social" },
            { label: "Obras e Serviços Urbanos", href: "/secretarias/obras-servicos-urbanos" },
            { label: "Agricultura e Meio Ambiente", href: "/secretarias/agricultura-meio-ambiente" },
            { label: "Finanças", href: "/secretarias/financas" },
            { label: "Tributação", href: "/secretarias/tributacao" },
            { label: "Transportes", href: "/secretarias/transportes" },
            { label: "Controladoria Municipal", href: "/secretarias/controladoria-municipal" },
            { label: "Procuradoria Municipal", href: "/secretarias/procuradoria-municipal" },
            { label: "Ver Todas as Secretarias", href: "/secretarias" },
        ],
    },
    {
        label: "Serviços",
        href: "/transparencia/carta-servicos",
        hasDropdown: true,
        children: [
            { label: "Carta de Serviços ao Cidadão", href: "/transparencia/carta-servicos" },
            { label: "Ouvidoria Municipal", href: "/servicos/ouvidoria" },
            { label: "e-SIC (Acesso à Informação)", href: "/servicos/esic" },
            { label: "Consulta de Protocolo", href: "/servicos/consulta-protocolo" },
            { label: "Tributos e IPTU", href: "/servicos/tributario" },
            { label: "Contracheque Online", href: "/servicos/contracheque" },
            { label: "Medicamentos SUS nas UBS", href: "/transparencia/medicamentos-sus" },
            { label: "Central de Regulação", href: "/transparencia/central-regulacao" },
            { label: "Fila de Creches", href: "/transparencia/educacao" },
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
    <svg
        width="9"
        height="5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="inline ml-0.5 opacity-60 shrink-0"
    >
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
            <header className="w-full z-50 fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-[#DCE4EE] shadow-[0_2px_16px_rgba(0,59,115,0.06)]">
                {/* Nível 1: Barra Superior em Azul Institucional */}
                <AccessibilityToolbar />

                {/* Filete Institucional Azul & Amarelo */}
                <div className="h-[2px] w-full heraldic-stripe" />

                {/* Nível 2: Barra de Navegação Compacta e Proporcional */}
                <div className="max-w-[1280px] mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
                    {/* LOGO OFICIAL COLORIDA COM BRASÃO DE LAJES PINTADAS */}
                    <Link
                        href="/"
                        className="flex items-center group focus:outline-none focus:ring-2 focus:ring-[#0072CE] rounded-lg py-1 shrink-0"
                    >
                        <img
                            src="/images/logo-lajes-pintadas-colorida.png"
                            alt={`Brasão e Logo Oficial da ${MUNICIPIO.nomeCompleto} - ${MUNICIPIO.uf}`}
                            className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                        />
                    </Link>

                    {/* MENU DE NAVEGAÇÃO DESKTOP (Sem quebra de linha, tipografia equilibrada) */}
                    <nav id="menu-principal" className="hidden lg:flex items-center gap-0.5 xl:gap-1">
                        {navItems.map((item, index) => {
                            const isActive =
                                item.href === "/"
                                    ? pathname === "/"
                                    : pathname === item.href || pathname.startsWith(item.href);
                            const isDropdownOpen = openDropdown === index;

                            return (
                                <div
                                    key={index}
                                    className="relative py-1.5"
                                    onMouseEnter={() => setOpenDropdown(index)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <Link
                                        href={item.href}
                                        className={`px-2.5 xl:px-3 py-1.5 text-xs xl:text-[13px] font-semibold rounded-lg transition-all flex items-center gap-1 whitespace-nowrap ${
                                            isActive
                                                ? "text-[#0072CE] bg-[#F0F7FF] font-bold"
                                                : "text-[#0F2942] hover:text-[#0072CE] hover:bg-slate-50"
                                        }`}
                                    >
                                        <span>{item.label}</span>
                                        {item.children && <ChevronDown />}
                                    </Link>

                                    {/* Dropdown Menu Unificado em Azul e Amarelo */}
                                    {item.children && isDropdownOpen && (
                                        <div className="absolute top-full left-0 pt-1 w-64 animate-in fade-in duration-150 z-50">
                                            <div className="bg-white rounded-xl p-1.5 shadow-xl border border-[#DCE4EE] overflow-hidden space-y-0.5">
                                                <div className="h-0.5 w-full rounded-full heraldic-stripe mb-1" />
                                                {item.children.map((sub, sIndex) => (
                                                    <Link
                                                        key={sIndex}
                                                        href={sub.href}
                                                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#0F2942] hover:text-[#0072CE] hover:bg-[#F0F7FF] transition-colors"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#0072CE] shrink-0" />
                                                        <span className="truncate">{sub.label}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* BOTÕES DE AÇÃO COMPACTOS EM LINHA ÚNICA (Azul & Amarelo) */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            href="/servicos/ouvidoria"
                            className="hidden xl:inline-flex items-center gap-1.5 whitespace-nowrap border border-[#DCE4EE] hover:border-[#0072CE] bg-[#F8FAFC] hover:bg-[#F0F7FF] text-[#0F2942] hover:text-[#0072CE] text-xs font-semibold px-3.5 py-2 rounded-full transition-all duration-200"
                        >
                            <FaRegComments size={12} className="text-[#0072CE]" />
                            <span>e-SIC / Ouvidoria</span>
                        </Link>

                        <Link
                            href="/transparencia"
                            className="inline-flex items-center gap-1.5 whitespace-nowrap bg-[#0072CE] hover:bg-[#005bb5] text-white text-xs font-bold px-3.5 sm:px-4 py-2 rounded-full shadow-sm border border-[#FACC15] transition-all duration-200 hover:scale-[1.01] focus:outline-none"
                        >
                            <span>Portal da Transparência</span>
                        </Link>

                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F4F7FB] text-[#0F2942] hover:bg-[#0072CE] hover:text-white transition-colors border border-[#DCE4EE] cursor-pointer shrink-0"
                            title="Buscar no portal"
                            aria-label="Buscar no portal"
                        >
                            <HiMagnifyingGlass size={16} />
                        </button>

                        <Link
                            href="/admin"
                            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full bg-[#F4F7FB] text-[#526B84] hover:bg-[#002B5C] hover:text-white transition-colors border border-[#DCE4EE] shrink-0"
                            title="Painel Administrativo"
                            aria-label="Painel Administrativo"
                        >
                            <FaUserLock size={12} />
                        </Link>

                        {/* Botão Hambúrguer Mobile */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full bg-[#0072CE] text-white hover:bg-[#005bb5] transition-colors cursor-pointer shrink-0"
                            aria-label="Menu de navegação"
                        >
                            {mobileOpen ? <HiOutlineXMark size={18} /> : <HiOutlineBars3 size={18} />}
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
                                className="flex-1 text-center py-2 px-3 rounded-xl bg-[#F0F7FF] text-[#0072CE] border border-[#DCE4EE] text-xs font-bold"
                            >
                                e-SIC (LAI)
                            </Link>
                            <Link
                                href="/servicos/ouvidoria"
                                onClick={() => setMobileOpen(false)}
                                className="flex-1 text-center py-2 px-3 rounded-xl bg-amber-50 text-[#0F2942] border border-[#FACC15] text-xs font-bold"
                            >
                                Ouvidoria Municipal
                            </Link>
                        </div>

                        {navItems.map((item, index) => (
                            <div key={index} className="space-y-1">
                                <Link
                                    href={item.href}
                                    onClick={() => !item.children && setMobileOpen(false)}
                                    className="block font-bold text-sm text-[#0F2942] py-1.5 px-2 hover:bg-[#F0F7FF] rounded-lg"
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
                                                className="flex items-center gap-2 text-xs font-medium text-slate-600 py-1.5 px-2 hover:text-[#0072CE]"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#0072CE]" />
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

            {/* BARRA DE NAVEGAÇÃO INFERIOR MOBILE-FIRST (Azul & Amarelo) */}
            <nav
                aria-label="Navegação rápida mobile"
                className="lg:hidden fixed bottom-3 left-3 right-3 z-40 bg-white/95 backdrop-blur-xl border border-[#DCE4EE] rounded-2xl shadow-[0_10px_30px_rgba(0,59,115,0.18)] px-2 py-1.5 flex items-center justify-around no-print"
            >
                <Link
                    href="/"
                    className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-colors ${
                        pathname === "/" ? "text-[#0072CE]" : "text-slate-500 hover:text-[#0072CE]"
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
                    className="flex flex-col items-center justify-center -mt-4 w-11 h-11 rounded-full bg-gradient-to-br from-[#0072CE] to-[#002B5C] text-white shadow-lg shadow-blue-900/25 ring-2 ring-[#FACC15] cursor-pointer"
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
