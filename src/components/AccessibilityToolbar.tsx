"use client";
import { useAccessibility } from "./AccessibilityProvider";
import { FaAdjust, FaSearchPlus, FaSearchMinus, FaRedo, FaSitemap, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";

export default function AccessibilityToolbar() {
    const { toggleHighContrast, increaseFontSize, decreaseFontSize, resetFontSize } = useAccessibility();

    return (
        <div className="bg-white/90 backdrop-blur-md py-1.5 w-full border-b border-gray-100 flex items-center justify-between text-primary-900 overflow-x-auto no-scrollbar relative z-[100] px-4 md:px-10 lg:px-16 shadow-sm shadow-blue-900/5">
            <div className="flex items-center gap-8 shrink-0">
                <div className="flex items-center gap-5 text-[8px] font-black uppercase tracking-[0.25em] border-r border-gray-200 pr-8 hidden xl:flex text-primary-900/40">
                    <a href="#conteudo-principal" className="hover:text-primary-500 transition-colors">Conteúdo [1]</a>
                    <a href="#menu-principal" className="hover:text-primary-500 transition-colors">Menu [2]</a>
                    <a href="#busca" className="hover:text-primary-500 transition-colors">Busca [3]</a>
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleHighContrast}
                        className="flex items-center gap-2.5 px-4 py-2 rounded-xl hover:bg-primary-50 transition-all text-[9.5px] font-black uppercase tracking-widest group border border-transparent hover:border-primary-100"
                        title="Alt + C (Alto Contraste)"
                    >
                        <FaAdjust className="text-primary-500 group-hover:rotate-180 transition-transform duration-500" />
                        <span className="hidden sm:inline">Contraste</span>
                    </button>

                    <div className="flex items-center gap-1.5 bg-gray-50/50 p-1 rounded-2xl border border-gray-100">
                        <button 
                            onClick={decreaseFontSize}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-xl transition-all text-xs text-primary-900/60 hover:text-primary-500"
                            title="Diminuir Fonte"
                        >
                            <FaSearchMinus />
                        </button>
                        <button 
                            onClick={resetFontSize}
                            className="px-3 h-8 flex items-center justify-center hover:bg-white rounded-xl transition-all text-[9px] font-black text-primary-900/30 hover:text-primary-500"
                            title="Resetar Fonte"
                        >
                            <FaRedo size={9} />
                        </button>
                        <button 
                            onClick={increaseFontSize}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-xl transition-all text-sm text-primary-900/60 hover:text-primary-500"
                            title="Aumentar Fonte"
                        >
                            <FaSearchPlus />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 shrink-0 ml-6">
                <Link 
                    href="/mapa-do-site" 
                    className="flex items-center gap-2.5 text-[9.5px] font-black uppercase tracking-widest text-primary-900/60 hover:text-primary-500 transition-all group"
                >
                    <FaSitemap className="text-primary-500 group-hover:scale-110 transition-transform" />
                    <span className="hidden md:inline">Mapa do Site</span>
                </Link>
                <Link 
                    href="/transparencia/acessibilidade" 
                    className="flex items-center gap-2.5 text-[9.5px] font-black uppercase tracking-widest text-primary-900/60 hover:text-primary-500 transition-all group"
                >
                    <FaInfoCircle className="text-primary-500 group-hover:scale-110 transition-transform" />
                    <span className="hidden md:inline">Acessibilidade</span>
                </Link>
            </div>
        </div>
    );
}
