"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiMagnifyingGlass } from "react-icons/hi2";

export default function HeroSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Fallback simplificado. Na prática pode redirecionar para uma página de resultados
        // Mas a BuscaGlobal do Header já cuida bem. Aqui faremos só um visual.
        if (searchTerm.trim().length > 2) {
            router.push(`/noticias`); // Exemplo
        }
    };

    return (
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Background Image & Gradient Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src="/images/hero-bg.jpg"
                    alt="Prefeitura de Lajes Pintadas"
                    className="w-full h-full object-cover mix-blend-soft-light opacity-60 scale-100"
                />
                <div className="absolute inset-0 hero-gradient opacity-95" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-[1240px] mx-auto px-6 flex flex-col items-center text-center animate-fade-in-up mt-28 md:mt-32 pb-32 md:pb-48">
                
                <div className="flex items-center gap-3 py-2 px-5 rounded-full glass-dark text-white border border-white/20 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-8 shadow-xl">
                    <span className="w-2 h-2 rounded-full bg-secondary-400 animate-pulse" />
                    Portal Oficial da Cidade
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-secondary-400 leading-[1.1] mb-6 tracking-tighter drop-shadow-2xl max-w-4xl">
                    Lajes Pintadas
                </h1>
                
                <p className="text-sm md:text-lg text-white/90 max-w-4xl mb-12 font-bold drop-shadow-md leading-relaxed whitespace-nowrap">
                    Cuidando da nossa gente e Construindo o nosso futuro.
                </p>

                {/* Pill Search Bar - Compact & Aligned */}
                <div className="w-full max-w-2xl">
                    <form onSubmit={handleSearch} className="relative group/search">
                        <input
                            type="text"
                            placeholder="O que você procura hoje?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/95 backdrop-blur-xl rounded-full py-4 md:py-5 px-8 md:px-10 text-gray-800 text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-primary-500/20 placeholder:text-gray-400 placeholder:italic font-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all"
                        />
                        <button 
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-all shadow-lg hover:scale-105 active:scale-95"
                        >
                            <HiMagnifyingGlass size={24} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Decorative Overlay for smooth transition */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-50 to-transparent z-10" />
        </section>
    );
}
