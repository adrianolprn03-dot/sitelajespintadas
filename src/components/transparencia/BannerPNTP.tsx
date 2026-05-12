"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function BannerPNTP() {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 mb-12">
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-indigo-900/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl -ml-24 -mb-24 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                    <div className="flex flex-col md:flex-row items-center gap-6 flex-1 text-center md:text-left">
                        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center border border-blue-400/30 shrink-0 shadow-xl shadow-blue-500/30">
                            <ShieldCheck size={26} className="text-white" />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
                                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-none">
                                    Transparência Ativa
                                </h2>
                                <span className="px-3 py-1 bg-blue-500 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow">
                                    PNTP 2026
                                </span>
                            </div>
                            <p className="text-blue-100/70 text-sm font-medium leading-relaxed max-w-2xl">
                                Dados disponibilizados em conformidade com o Programa Nacional de Transparência Pública 2026 e a Lei nº 12.527/2011 (LAI). Acesso em formatos abertos e acessíveis.
                            </p>
                        </div>
                    </div>

                    <div className="shrink-0 w-full md:w-auto flex gap-3">
                        <Link
                            href="/servicos/esic"
                            className="flex-1 md:flex-initial inline-flex items-center justify-center bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 whitespace-nowrap"
                        >
                            Solicitar via e-SIC
                        </Link>
                        <Link
                            href="/transparencia/radar"
                            className="hidden md:flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 whitespace-nowrap"
                        >
                            Radar PNTP
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
