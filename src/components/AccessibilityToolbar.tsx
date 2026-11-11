"use client";
import { useAccessibility } from "./AccessibilityProvider";
import { FaCircleHalfStroke, FaRegClock, FaLandmark } from "react-icons/fa6";
import { IoAccessibilityOutline } from "react-icons/io5";
import { MUNICIPIO } from "@/config/municipio";

export default function AccessibilityToolbar() {
    const { toggleHighContrast, increaseFontSize, decreaseFontSize } = useAccessibility();

    return (
        <div className="bg-gradient-to-r from-[#064E3B] via-[#0F5E43] to-[#064E3B] text-white py-1.5 w-full border-b border-emerald-900/60 text-xs relative z-[100] px-4 sm:px-6 shadow-sm">
            <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
                {/* Identidade Institucional & Expediente (Modelo 3 Top Utility Bar) */}
                <div className="flex items-center gap-4 text-[11px] font-medium text-emerald-50/90">
                    <div className="flex items-center gap-1.5">
                        <FaLandmark className="text-[#FACC15] shrink-0" size={12} />
                        <span className="font-semibold tracking-tight truncate max-w-[200px] sm:max-w-none">
                            {MUNICIPIO.nomeCompleto}/{MUNICIPIO.uf}
                        </span>
                    </div>

                    <div className="hidden lg:flex items-center gap-1.5 pl-4 border-l border-white/20 text-emerald-100/90">
                        <FaRegClock className="text-[#FACC15] shrink-0" size={12} />
                        <span>Atendimento: {MUNICIPIO.horario.replace("07:00 às 13:00", "07h às 13h")}</span>
                    </div>

                    {/* Atalhos para leitor de tela / teclado (WCAG 2.2 / e-MAG) */}
                    <div className="hidden xl:flex items-center gap-2.5 pl-4 border-l border-white/20 text-[10px] font-semibold text-emerald-100/80">
                        <a href="#conteudo-principal" className="hover:text-[#FACC15] transition-colors">
                            Conteúdo <span className="text-[#FACC15] font-bold">[1]</span>
                        </a>
                        <span className="text-white/25">·</span>
                        <a href="#menu-principal" className="hover:text-[#FACC15] transition-colors">
                            Menu <span className="text-[#FACC15] font-bold">[2]</span>
                        </a>
                        <span className="text-white/25">·</span>
                        <a href="#busca" className="hover:text-[#FACC15] transition-colors">
                            Busca <span className="text-[#FACC15] font-bold">[3]</span>
                        </a>
                    </div>
                </div>

                {/* Controles de Acessibilidade (Modelo 3) */}
                <div className="flex items-center gap-3 sm:gap-4 ml-auto text-[11px] font-semibold text-white">
                    <a
                        href="/transparencia/acessibilidade"
                        className="flex items-center gap-1.5 hover:text-[#FACC15] transition-colors focus:outline-none focus:ring-1 focus:ring-[#FACC15] rounded px-1"
                        title="Diretrizes de Acessibilidade do Portal"
                    >
                        <IoAccessibilityOutline className="text-[#FACC15]" size={15} />
                        <span className="hidden sm:inline">Acessibilidade</span>
                    </a>

                    <span className="text-white/25">|</span>

                    <button
                        onClick={toggleHighContrast}
                        className="flex items-center gap-1.5 hover:text-[#FACC15] transition-colors focus:outline-none focus:ring-1 focus:ring-[#FACC15] rounded px-1 cursor-pointer"
                        title="Alt + C (Alto Contraste)"
                        aria-label="Alternar Alto Contraste"
                    >
                        <FaCircleHalfStroke className="text-[#FACC15]" size={12} />
                        <span className="hidden md:inline">Alto Contraste</span>
                    </button>

                    <span className="text-white/25">|</span>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={decreaseFontSize}
                            className="hover:text-[#FACC15] transition-colors px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 font-bold focus:outline-none focus:ring-1 focus:ring-[#FACC15] cursor-pointer"
                            title="Diminuir Fonte (A-)"
                            aria-label="Diminuir Fonte"
                        >
                            A-
                        </button>
                        <button
                            onClick={increaseFontSize}
                            className="hover:text-[#FACC15] transition-colors px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 font-bold focus:outline-none focus:ring-1 focus:ring-[#FACC15] cursor-pointer"
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
