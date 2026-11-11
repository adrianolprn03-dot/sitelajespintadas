"use client";
import { useAccessibility } from "./AccessibilityProvider";
import { FaCircleHalfStroke } from "react-icons/fa6";
import { IoAccessibilityOutline } from "react-icons/io5";

export default function AccessibilityToolbar() {
    const { toggleHighContrast, increaseFontSize, decreaseFontSize } = useAccessibility();

    return (
        <div className="bg-[#1254A3] text-white py-1.5 w-full border-b border-[#0d4282] text-xs relative z-[100] px-4 md:px-8 lg:px-12 shadow-sm">
            <div className="max-w-[1240px] mx-auto flex items-center justify-between">
                {/* Atalhos para leitor de tela / teclado (WCAG 2.2) */}
                <div className="hidden md:flex items-center gap-3 text-[10px] font-semibold text-white/70">
                    <span className="text-white/50">Ir para:</span>
                    <a href="#conteudo-principal" className="hover:text-amber-300 transition-colors">Conteúdo [1]</a>
                    <span className="text-white/30">·</span>
                    <a href="#menu-principal" className="hover:text-amber-300 transition-colors">Menu [2]</a>
                    <span className="text-white/30">·</span>
                    <a href="#busca" className="hover:text-amber-300 transition-colors">Busca [3]</a>
                </div>

                {/* Controles de Acessibilidade iguais à referência */}
                <div className="flex items-center gap-4 ml-auto text-xs font-semibold text-white">
                    <a 
                        href="/acessibilidade"
                        className="flex items-center gap-1.5 hover:text-amber-300 transition-colors focus:outline-none focus:ring-1 focus:ring-white rounded px-1"
                        title="Diretrizes de Acessibilidade do Portal"
                    >
                        <IoAccessibilityOutline size={16} />
                        <span>Acessibilidade</span>
                    </a>

                    <span className="text-white/30">|</span>

                    <button 
                        onClick={toggleHighContrast}
                        className="flex items-center gap-1.5 hover:text-amber-300 transition-colors focus:outline-none focus:ring-1 focus:ring-white rounded px-1"
                        title="Alt + C (Alto Contraste)"
                        aria-label="Alternar Alto Contraste"
                    >
                        <FaCircleHalfStroke size={13} />
                        <span>Alto contraste</span>
                    </button>

                    <span className="text-white/30">|</span>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={decreaseFontSize}
                            className="hover:text-amber-300 transition-colors px-1 py-0.5 rounded hover:bg-white/10 font-bold focus:outline-none focus:ring-1 focus:ring-white"
                            title="Diminuir Fonte (A-)"
                            aria-label="Diminuir Fonte"
                        >
                            A-
                        </button>
                        <button 
                            onClick={increaseFontSize}
                            className="hover:text-amber-300 transition-colors px-1 py-0.5 rounded hover:bg-white/10 font-bold focus:outline-none focus:ring-1 focus:ring-white"
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
