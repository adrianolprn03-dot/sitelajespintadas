"use client";
import { useAccessibility } from "./AccessibilityProvider";
import { FaCircleHalfStroke, FaMagnifyingGlassPlus, FaMagnifyingGlassMinus, FaRotateLeft, FaSitemap, FaCircleInfo, FaShieldHalved } from "react-icons/fa6";
import Link from "next/link";

export default function AccessibilityToolbar() {
    const { toggleHighContrast, increaseFontSize, decreaseFontSize, resetFontSize } = useAccessibility();

    return (
        <div className="bg-[#1254A3] text-white py-1.5 w-full border-b border-[#0d4282] flex items-center justify-between text-xs overflow-x-auto no-scrollbar relative z-[100] px-4 md:px-10 lg:px-16 shadow-sm">
            <div className="flex items-center gap-6 shrink-0">
                {/* Atalhos de teclado gov */}
                <div className="flex items-center gap-3 text-[10px] font-semibold text-white/80 border-r border-white/20 pr-6 hidden xl:flex">
                    <span className="text-white/60">Ir para:</span>
                    <a href="#conteudo-principal" className="hover:text-amber-300 transition-colors">Conteúdo [1]</a>
                    <span className="text-white/40">·</span>
                    <a href="#menu-principal" className="hover:text-amber-300 transition-colors">Menu [2]</a>
                    <span className="text-white/40">·</span>
                    <a href="#busca" className="hover:text-amber-300 transition-colors">Busca [3]</a>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={toggleHighContrast}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] hover:bg-white/10 transition-all text-[11px] font-bold text-white hover:text-amber-300"
                        title="Alt + C (Alto Contraste)"
                        aria-label="Alternar Alto Contraste"
                    >
                        <FaCircleHalfStroke size={12} />
                        <span className="hidden sm:inline">Alto Contraste</span>
                    </button>

                    <div className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-[6px]">
                        <span className="text-[10px] text-white/70 mr-1 hidden sm:inline">Fonte:</span>
                        <button 
                            onClick={decreaseFontSize}
                            className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded font-bold text-xs text-white hover:text-amber-300 transition-all"
                            title="Diminuir Fonte"
                            aria-label="Diminuir Fonte"
                        >
                            A-
                        </button>
                        <button 
                            onClick={resetFontSize}
                            className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded text-[10px] text-white/80 hover:text-amber-300 transition-all"
                            title="Resetar Fonte"
                            aria-label="Resetar Fonte"
                        >
                            <FaRotateLeft size={10} />
                        </button>
                        <button 
                            onClick={increaseFontSize}
                            className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded font-bold text-xs text-white hover:text-amber-300 transition-all"
                            title="Aumentar Fonte"
                            aria-label="Aumentar Fonte"
                        >
                            A+
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 ml-6 text-[11px] font-bold text-white/90">
                <Link 
                    href="/transparencia" 
                    className="flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors"
                >
                    <FaShieldHalved size={11} />
                    <span>Portal da Transparência</span>
                </Link>
                <span className="text-white/30 hidden md:inline">|</span>
                <Link 
                    href="/mapa-do-site" 
                    className="hidden md:flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                    <FaSitemap size={11} />
                    <span>Mapa do Site</span>
                </Link>
                <Link 
                    href="/transparencia/passiva" 
                    className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                    <FaCircleInfo size={11} />
                    <span>e-SIC</span>
                </Link>
            </div>
        </div>
    );
}
