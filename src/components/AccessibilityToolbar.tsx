"use client";
import { useAccessibility } from "./AccessibilityProvider";
import { FaAdjust, FaSearchPlus, FaSearchMinus, FaRedo, FaSitemap, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";

export default function AccessibilityToolbar() {
    const { toggleHighContrast, increaseFontSize, decreaseFontSize, resetFontSize } = useAccessibility();

    return (
        <div className="bg-primary-900 py-1.5 w-full border-b border-white/5 flex items-center justify-between text-white overflow-x-auto no-scrollbar relative z-[100] px-4 md:px-10 lg:px-16">
            <div className="flex items-center gap-8 shrink-0">
                <div className="flex items-center gap-5 text-[8px] font-black uppercase tracking-[0.25em] border-r border-white/10 pr-8 hidden xl:flex text-white/60">
                    <a href="#conteudo-principal" className="hover:text-primary-400 transition-colors">Conteúdo [1]</a>
                    <a href="#menu-principal" className="hover:text-primary-400 transition-colors">Menu [2]</a>
                    <a href="#busca" className="hover:text-primary-400 transition-colors">Busca [3]</a>
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleHighContrast}
                        className="flex items-center gap-2.5 px-4 py-2 rounded-xl hover:bg-white/5 transition-all text-[9.5px] font-black uppercase tracking-widest group border border-transparent hover:border-white/10 shadow-lg shadow-black/20"
                        title="Alt + C (Alto Contraste)"
                    >
                        <FaAdjust className="text-secondary-500 group-hover:rotate-180 transition-transform duration-500" />
                        <span className="hidden sm:inline">Contraste</span>
                    </button>

                    <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-2xl border border-white/5">
                        <button 
                            onClick={decreaseFontSize}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-xs text-white/80"
                            title="Diminuir Fonte"
                        >
                            <FaSearchMinus />
                        </button>
                        <button 
                            onClick={resetFontSize}
                            className="px-3 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-[9px] font-black text-white/50"
                            title="Resetar Fonte"
                        >
                            <FaRedo size={9} />
                        </button>
                        <button 
                            onClick={increaseFontSize}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-sm text-white/80"
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
                    className="flex items-center gap-2.5 text-[9.5px] font-black uppercase tracking-widest text-white/70 hover:text-primary-400 transition-all group"
                >
                    <FaSitemap className="text-primary-400 group-hover:scale-110 transition-transform" />
                    <span className="hidden md:inline">Mapa do Site</span>
                </Link>
                <Link 
                    href="/transparencia/acessibilidade" 
                    className="flex items-center gap-2.5 text-[9.5px] font-black uppercase tracking-widest text-white/70 hover:text-primary-400 transition-all group"
                >
                    <FaInfoCircle className="text-primary-400 group-hover:scale-110 transition-transform" />
                    <span className="hidden md:inline">Acessibilidade</span>
                </Link>
            </div>
        </div>
    );
}
