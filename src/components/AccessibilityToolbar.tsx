"use client";
import { useAccessibility } from "./AccessibilityProvider";
import { FaAdjust, FaSearchPlus, FaSearchMinus, FaRedo, FaSitemap, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";

export default function AccessibilityToolbar() {
    const { toggleHighContrast, increaseFontSize, decreaseFontSize, resetFontSize } = useAccessibility();

    return (
        <div className="bg-[#002241] py-2 px-4 md:px-8 border-b border-white/10 flex items-center justify-between text-white overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-6 shrink-0">
                <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] border-r border-white/20 pr-6 hidden md:flex">
                    <a href="#conteudo-principal" className="hover:text-[#01b0ef] transition-colors">Ir para o conteúdo [1]</a>
                    <a href="#menu-principal" className="hover:text-[#01b0ef] transition-colors">Ir para o menu [2]</a>
                    <a href="#busca" className="hover:text-[#01b0ef] transition-colors">Ir para a busca [3]</a>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={toggleHighContrast}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-wider group"
                        title="Alt + C (Alto Contraste)"
                    >
                        <FaAdjust className="text-[#FDB913] group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline">Contraste</span>
                    </button>

                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                        <button 
                            onClick={decreaseFontSize}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-xs"
                            title="Diminuir Fonte"
                        >
                            <FaSearchMinus />
                        </button>
                        <button 
                            onClick={resetFontSize}
                            className="px-2 py-1.5 hover:bg-white/10 rounded-lg transition-all text-[10px] font-black"
                            title="Resetar Fonte"
                        >
                            <FaRedo size={10} />
                        </button>
                        <button 
                            onClick={increaseFontSize}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-xs"
                            title="Aumentar Fonte"
                        >
                            <FaSearchPlus />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 ml-4">
                <Link 
                    href="/mapa-do-site" 
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider hover:text-[#01b0ef] transition-colors"
                >
                    <FaSitemap className="text-[#01b0ef]" />
                    <span className="hidden lg:inline">Mapa do Site</span>
                </Link>
                <Link 
                    href="/transparencia/acessibilidade" 
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider hover:text-[#01b0ef] transition-colors"
                >
                    <FaInfoCircle className="text-[#01b0ef]" />
                    <span className="hidden lg:inline">Acessibilidade</span>
                </Link>
            </div>
        </div>
    );
}
