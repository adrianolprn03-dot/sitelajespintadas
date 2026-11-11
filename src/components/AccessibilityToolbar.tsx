"use client";
import { useAccessibility } from "./AccessibilityProvider";
import { FaCircleHalfStroke, FaRegClock, FaLandmark } from "react-icons/fa6";
import { IoAccessibilityOutline } from "react-icons/io5";
import { MUNICIPIO } from "@/config/municipio";

export default function AccessibilityToolbar() {
    const { toggleHighContrast, increaseFontSize, decreaseFontSize } = useAccessibility();

    return (
        <div className="bg-gradient-to-r from-[#002654] via-[#003B73] to-[#002654] text-white py-1 w-full border-b border-[#004B87]/60 text-[11px] relative z-[100] px-4 sm:px-6">
            <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3">
                {/* Identificação Institucional & Expediente em Azul e Amarelo */}
                <div className="flex items-center gap-3 font-medium text-sky-100/95">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <FaLandmark className="text-[#FACC15] shrink-0" size={11} />
                        <span className="font-semibold tracking-tight">
                            {MUNICIPIO.nomeCompleto}/{MUNICIPIO.uf}
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-white/20 text-sky-100/85 whitespace-nowrap">
                        <FaRegClock className="text-[#FACC15] shrink-0" size={11} />
                        <span>Expediente: 07h às 13h</span>
                    </div>

                    {/* Atalhos e-MAG discretos */}
                    <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-white/20 text-[10px] font-medium text-sky-200/80 whitespace-nowrap">
                        <a href="#conteudo-principal" className="hover:text-[#FACC15] transition-colors">
                            Conteúdo <span className="text-[#FACC15] font-bold">[1]</span>
                        </a>
                        <span className="text-white/20">·</span>
                        <a href="#menu-principal" className="hover:text-[#FACC15] transition-colors">
                            Menu <span className="text-[#FACC15] font-bold">[2]</span>
                        </a>
                        <span className="text-white/20">·</span>
                        <a href="#busca" className="hover:text-[#FACC15] transition-colors">
                            Busca <span className="text-[#FACC15] font-bold">[3]</span>
                        </a>
                    </div>
                </div>

                {/* Controles de Acessibilidade */}
                <div className="flex items-center gap-2.5 sm:gap-3 ml-auto text-[11px] font-medium text-white whitespace-nowrap">
                    <a
                        href="/transparencia/acessibilidade"
                        className="flex items-center gap-1 hover:text-[#FACC15] transition-colors focus:outline-none focus:ring-1 focus:ring-[#FACC15] rounded px-1"
                        title="Diretrizes de Acessibilidade do Portal"
                    >
                        <IoAccessibilityOutline className="text-[#FACC15]" size={13} />
                        <span className="hidden sm:inline">Acessibilidade</span>
                    </a>

                    <span className="text-white/20">|</span>

                    <button
                        onClick={toggleHighContrast}
                        className="flex items-center gap-1 hover:text-[#FACC15] transition-colors focus:outline-none focus:ring-1 focus:ring-[#FACC15] rounded px-1 cursor-pointer"
                        title="Alt + C (Alto Contraste)"
                        aria-label="Alternar Alto Contraste"
                    >
                        <FaCircleHalfStroke className="text-[#FACC15]" size={11} />
                        <span className="hidden md:inline">Alto Contraste</span>
                    </button>

                    <span className="text-white/20">|</span>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={decreaseFontSize}
                            className="hover:text-[#FACC15] transition-colors px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-[#FACC15] cursor-pointer"
                            title="Diminuir Fonte (A-)"
                            aria-label="Diminuir Fonte"
                        >
                            A-
                        </button>
                        <button
                            onClick={increaseFontSize}
                            className="hover:text-[#FACC15] transition-colors px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-[#FACC15] cursor-pointer"
                            title="Aumentar Fonte (A+)"
                            aria-label="Aumentar Fonte"
                        >
                            A+
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
