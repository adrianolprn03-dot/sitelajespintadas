"use client";
import { useState } from "react";

export default function VideoHero() {
    const [videoError, setVideoError] = useState(false);

    return (
        <section className="relative w-full overflow-hidden bg-gray-900" style={{ height: "280px" }}>
            {!videoError ? (
                <video
                    src="https://webnets.com.br/arquitetura/Videos/clientes/cocal.mov"
                    autoPlay
                    muted
                    loop
                    playsInline
                    onError={() => setVideoError(true)}
                    className="absolute inset-0 w-full h-full object-cover"
                    aria-hidden="true"
                />
            ) : (
                /* Fallback: imagem estática da cidade */
                <img
                    src="/images/hero-slider-2.jpg"
                    alt="Vista aérea de Lajes Pintadas"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )}

            {/* Overlay suave no rodapé como no Cocal */}
            <div
                className="absolute bottom-0 left-0 right-0 h-32"
                style={{ background: "linear-gradient(to top, rgba(248,250,252,1) 0%, transparent 100%)" }}
            />
        </section>
    );
}
