"use client";

import Link from "next/link";
import { FaInfoCircle } from "react-icons/fa";

export default function BannerPNTP() {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 mb-12">
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-800 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-indigo-900/20 group">
                {/* Elementos decorativos de fundo */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 flex-1 text-center md:text-left">
                        {/* Ícone Estilizado */}
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                            <FaInfoCircle size={24} className="text-white opacity-80" />
                        </div>
                        
                        <div className="space-y-1">
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-none">
                                Transparência Ativa <span className="text-indigo-300">PNTP 2025</span>
                            </h2>
                            <p className="text-indigo-50/70 text-sm md:text-base font-medium leading-relaxed max-w-2xl">
                                Dados disponibilizados em conformidade com o Programa Nacional de Transparência Pública. Acesso em formatos abertos e acessíveis.
                            </p>
                        </div>
                    </div>

                    {/* Botão de Ação */}
                    <div className="shrink-0 w-full md:w-auto">
                        <Link 
                            href="/servicos/esic" 
                            className="inline-flex w-full md:w-auto items-center justify-center bg-white text-indigo-700 hover:bg-slate-50 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 whitespace-nowrap"
                        >
                            Solicitar via e-SIC
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
