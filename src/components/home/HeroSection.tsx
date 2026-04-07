"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiMagnifyingGlass } from "react-icons/hi2";
import Link from "next/link";

const acessosRapidos = [
    { label: "Licitações", href: "/transparencia/licitacoes" },
    { label: "Concursos", href: "/transparencia/concursos" },
    { label: "Diárias", href: "/transparencia/diarias" },
    { label: "Notícias", href: "/noticias" },
];

export default function HeroSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = searchTerm.trim();
        if (trimmed.length > 1) {
            router.push(`/noticias?busca=${encodeURIComponent(trimmed)}`);
        }
    };

    return (
        <section className="relative w-full min-h-[88vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src="/images/hero-bg.jpg"
                    alt="Vista aérea de Lajes Pintadas"
                    className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 hero-gradient" />
            </div>

            {/* Decorative blobs */}
            <div className="absolute top-1/4 left-[-6rem] w-96 h-96 rounded-full bg-primary-500/20 blur-[100px] pointer-events-none z-0" />
            <div className="absolute bottom-1/3 right-[-4rem] w-72 h-72 rounded-full bg-secondary-400/20 blur-[80px] pointer-events-none z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-primary-600/10 blur-[120px] pointer-events-none z-0" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-[1240px] mx-auto px-6 flex flex-col items-center text-center animate-fade-in-up mt-28 md:mt-32 pb-36 md:pb-52">

                {/* Badge */}
                <div className="flex items-center gap-3 py-2 px-5 rounded-full glass-dark text-white border border-white/20 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] mb-8 shadow-xl">
                    <span className="w-2 h-2 rounded-full bg-secondary-400 animate-pulse" />
                    Portal Oficial da Cidade
                </div>

                {/* Heading */}
                <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-secondary-400 leading-[1.05] mb-5 tracking-tighter drop-shadow-2xl max-w-3xl">
                    Lajes Pintadas
                </h1>

                <p className="text-sm md:text-lg text-white/90 max-w-xl mb-12 font-semibold drop-shadow-md leading-relaxed">
                    Cuidando da nossa gente e Construindo o nosso futuro.
                </p>

                {/* Search Bar */}
                <div className="w-full max-w-2xl">
                    <form onSubmit={handleSearch} className="relative group/search">
                        <input
                            type="text"
                            placeholder="O que você procura hoje?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/95 backdrop-blur-xl rounded-full py-4 md:py-5 px-8 md:px-10 text-gray-800 text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-primary-500/30 placeholder:text-gray-400 placeholder:italic font-semibold shadow-[0_24px_60px_rgba(0,0,0,0.35)] transition-all"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-all shadow-lg hover:scale-105 active:scale-95"
                        >
                            <HiMagnifyingGlass size={22} />
                        </button>
                    </form>
                </div>

                {/* Quick access links */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Acesso rápido:</span>
                    {acessosRapidos.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-white/80 hover:text-white text-[10px] font-black uppercase tracking-widest border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full transition-all"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-8 mt-8 text-white/40">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em]">Lajes Pintadas · RN</span>
                    </div>
                    <div className="w-px h-3 bg-white/20" />
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em]">Portal Ativo</span>
                    </div>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/60 to-transparent z-10 pointer-events-none" />
        </section>
    );
}
