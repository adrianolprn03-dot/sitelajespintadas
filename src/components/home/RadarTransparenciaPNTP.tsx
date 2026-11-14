"use client";

import React from "react";
import Link from "next/link";
import { MUNICIPIO } from "@/config/municipio";
import {
    FaShieldHalved,
    FaArrowRight,
    FaChartPie,
    FaHandshake,
    FaFileInvoiceDollar,
    FaUsers,
    FaTrowelBricks,
    FaScaleBalanced,
    FaAward
} from "react-icons/fa6";

export default function RadarTransparenciaPNTP() {
    const pilares = [
        {
            titulo: "Receitas & Despesas",
            sublabel: "Execução orçamentária e financeira em tempo real",
            href: "/transparencia/receitas",
            icon: FaFileInvoiceDollar,
            tag: "LRF / SICONFI",
        },
        {
            titulo: "Licitações Públicas",
            sublabel: "Editais, atas, fases e integração PNCP",
            href: "/transparencia/licitacoes",
            icon: FaScaleBalanced,
            tag: "PNCP Integrado",
        },
        {
            titulo: "Contratos & Aditivos",
            sublabel: "Inteiro teor, aditivos e fiscais designados",
            href: "/transparencia/contratos",
            icon: FaHandshake,
            tag: "Atualizado",
        },
        {
            titulo: "Folha de Pagamento",
            sublabel: "Quadro de servidores, remunerações e diárias",
            href: "/transparencia/servidores",
            icon: FaUsers,
            tag: "Acesso Livre",
        },
        {
            titulo: "Obras Públicas",
            sublabel: "Medições, valores pagos e situações de execução",
            href: "/transparencia/obras",
            icon: FaTrowelBricks,
            tag: "Fiscalização",
        },
        {
            titulo: "Relatórios Fiscais",
            sublabel: "RGF, RREO, Balanço Geral e prestação de contas",
            href: "/transparencia/lrf",
            icon: FaChartPie,
            tag: "Contabilidade",
        },
    ];

    return (
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-14 sm:pt-20">
            <div className="bg-gradient-to-br from-[#002654] via-[#003B73] to-[#001D3D] rounded-2xl sm:rounded-[30px] p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-blue-900/40">
                {/* Elementos Decorativos de Fundo */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/15">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-[#FACC15] mb-3">
                            <FaAward className="text-[#FACC15]" />
                            <span>Compromisso com a Transparência Pública • Matriz PNTP</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight leading-tight">
                            Portal da Transparência & Controle Social
                        </h2>
                        <p className="text-sm sm:text-base text-slate-200 mt-2 max-w-2xl font-medium">
                            Acompanhe de forma clara e aberta como os recursos públicos de {MUNICIPIO.nome} são aplicados em benefício de toda a sociedade.
                        </p>
                    </div>

                    <Link
                        href="/transparencia"
                        className="inline-flex items-center justify-center gap-2 bg-[#FACC15] hover:bg-[#EAB308] active:bg-[#CA8A04] text-[#002B5C] font-black text-sm px-7 py-3.5 rounded-full transition-all shadow-lg hover:scale-105 shrink-0 focus:outline-none focus:ring-2 focus:ring-[#003B73]"
                    >
                        <span>Acessar Portal Completo</span>
                        <FaArrowRight size={12} />
                    </Link>
                </div>

                {/* Grade de 6 Pilares da Transparência */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-8">
                    {pilares.map((pilar, idx) => {
                        const Icon = pilar.icon;
                        return (
                            <Link
                                key={idx}
                                href={pilar.href}
                                className="group bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl p-5 border border-white/15 hover:border-[#FACC15]/60 transition-all duration-300 flex items-start gap-4 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/15 text-white flex items-center justify-center text-xl shrink-0 group-hover:bg-[#EAB308] group-hover:text-[#002B5C] transition-colors shadow-sm">
                                    <Icon />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h3 className="text-sm font-bold text-white group-hover:text-[#FDE047] transition-colors truncate">
                                            {pilar.titulo}
                                        </h3>
                                        <span className="text-[9px] font-black uppercase tracking-wider text-[#FACC15] bg-black/30 px-2 py-0.5 rounded">
                                            {pilar.tag}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-snug line-clamp-2">
                                        {pilar.sublabel}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

