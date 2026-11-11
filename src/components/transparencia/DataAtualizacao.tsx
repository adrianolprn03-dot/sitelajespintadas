"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, RefreshCw, ShieldCheck } from "lucide-react";

interface DataAtualizacaoProps {
    dataAtualizacao?: string;
    textoAtualizacao?: string;
    className?: string;
    variant?: "card" | "inline" | "compact" | "banner";
}

export default function DataAtualizacao({
    dataAtualizacao = "29/07/2026",
    textoAtualizacao = "Data de atualização das informações",
    className = "",
    variant = "card"
}: DataAtualizacaoProps) {
    const [dataAcesso, setDataAcesso] = useState<string>("");

    useEffect(() => {
        const hoje = new Date();
        const dataFormatada = hoje.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
        setDataAcesso(dataFormatada);
    }, []);

    const dataExibicaoAcesso = dataAcesso || new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    if (variant === "compact") {
        return (
            <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium ${className}`}>
                <span className="flex items-center gap-1.5">
                    <RefreshCw size={12} className="text-emerald-500" />
                    <span>{textoAtualizacao}: <strong className="text-slate-700">{dataAtualizacao}</strong></span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-blue-500" />
                    <span>Data de acesso: <strong className="text-slate-700">{dataExibicaoAcesso}</strong></span>
                </span>
            </div>
        );
    }

    if (variant === "inline") {
        return (
            <div className={`flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium ${className}`}>
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200/60">
                    <RefreshCw size={12} className="text-emerald-600 shrink-0" />
                    <span>{textoAtualizacao}: <strong>{dataAtualizacao}</strong></span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1 rounded-lg border border-blue-200/60">
                    <Calendar size={12} className="text-blue-600 shrink-0" />
                    <span>Acessado em: <strong>{dataExibicaoAcesso}</strong></span>
                </span>
            </div>
        );
    }

    if (variant === "banner") {
        return (
            <div className={`bg-gradient-to-r from-emerald-50 via-teal-50/50 to-blue-50 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${className}`}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                        <ShieldCheck size={16} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">
                            {textoAtualizacao}: <span className="text-emerald-700 font-black">{dataAtualizacao}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Dados atualizados periodicamente conforme a Lei nº 12.527/2011 (LAI).
                        </p>
                    </div>
                </div>
                <div className="shrink-0 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
                    <Clock size={13} className="text-blue-600" />
                    <span className="text-[11px] font-bold text-slate-600">
                        Data de acesso: <strong className="text-blue-700 font-black">{dataExibicaoAcesso}</strong>
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl p-4 transition-all duration-200 ${className}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                    <RefreshCw size={14} className="text-emerald-600 shrink-0" />
                    <span className="text-slate-600 font-medium">
                        {textoAtualizacao}: <strong className="text-slate-800 font-bold">{dataAtualizacao}</strong>
                    </span>
                </div>
                <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                    <Calendar size={14} className="text-blue-600 shrink-0" />
                    <span className="text-slate-600 font-medium">
                        Data de acesso: <strong className="text-blue-800 font-bold">{dataExibicaoAcesso}</strong>
                    </span>
                </div>
            </div>
        </div>
    );
}
