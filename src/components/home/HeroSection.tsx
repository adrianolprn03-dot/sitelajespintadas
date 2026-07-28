"use client";
import { useState } from "react";
import { MUNICIPIO } from "@/config/municipio";

export default function HeroSection() {
    const [videoError, setVideoError] = useState(false);

    return (
        <section className="relative w-full min-h-[88vh] flex items-center justify-center overflow-hidden">
            {/* Background Video com fallback para imagem */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {!videoError ? (
                    <video
                        src={MUNICIPIO.heroVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        onError={() => setVideoError(true)}
                        className="w-full h-full object-cover brightness-[1.08] contrast-[1.04] scale-105 transition-all duration-700"
                    />
                ) : (
                    <img
                        src="/images/hero-bg.jpg"
                        alt={`Vista aérea de ${MUNICIPIO.nome}`}
                        className="w-full h-full object-cover scale-105"
                    />
                )}
                {/* Soft gradient overlay for crisp text readability without obscuring the video */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/40" />
            </div>

            {/* Decorative blobs */}
            <div className="absolute top-1/4 left-[-6rem] w-96 h-96 rounded-full bg-primary-500/10 blur-[100px] pointer-events-none z-0" />
            <div className="absolute bottom-1/3 right-[-4rem] w-72 h-72 rounded-full bg-secondary-400/10 blur-[80px] pointer-events-none z-0" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-[1240px] mx-auto px-6 flex flex-col items-center text-center animate-fade-in-up mt-28 md:mt-32 pb-32 md:pb-44">

                {/* Heading */}
                <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-secondary-400 leading-[1.05] mb-5 tracking-tighter drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)] max-w-3xl">
                    {MUNICIPIO.nome}
                </h1>

                <p className="text-base md:text-xl text-white max-w-xl mb-12 font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] leading-relaxed tracking-wide">
                    Cuidando da nossa gente e Construindo o nosso futuro.
                </p>

            </div>

            {/* Bottom fade suave */}
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/40 to-transparent z-10 pointer-events-none" />
        </section>
    );
}

