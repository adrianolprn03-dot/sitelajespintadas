"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, RefreshCw, ShieldCheck, CheckCircle2 } from "lucide-react";

interface DataAtualizacaoProps {
    dataAtualizacao?: string | null;
    dataConferencia?: string | null;
    fonte?: string;
    textoAtualizacao?: string;
    className?: string;
    variant?: "card" | "inline" | "compact" | "banner";
}

export default function DataAtualizacao({
    dataAtualizacao,
    dataConferencia,
    fonte = "Base Oficial do Município",
    textoAtualizacao = "Última atualização efetiva do conteúdo",
    className = "",
    variant = "card",
}: DataAtualizacaoProps) {
    const [dataAcesso, setDataAcesso] = useState<string>("");

    useEffect(() => {
        const hoje = new Date();
        setDataAcesso(
            hoje.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
        );
    }, []);

    const valorAtualizacao = dataAtualizacao || "Conforme último registro publicado";
    const valorConferencia = dataConferencia || null;

    if (variant === "compact") {
        return (
            <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium ${className}`}>
                <span className="flex items-center gap-1.5">
                    <RefreshCw size={12} className="text-emerald-500" />
                    <span>
                        {textoAtualizacao}: <strong className="text-slate-700">{valorAtualizacao}</strong>
                    </span>
                </span>
                {valorConferencia && (
                    <>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 size={12} className="text-teal-600" />
                            <span>
                                Última conferência setorial: <strong className="text-slate-700">{valorConferencia}</strong>
                            </span>
                        </span>
                    </>
                )}
                {dataAcesso && (
                    <>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-blue-500" />
                            <span>
                                Consulta realizada em: <strong className="text-slate-700">{dataAcesso}</strong>
                            </span>
                        </span>
                    </>
                )}
            </div>
        );
    }

    if (variant === "inline") {
        return (
            <div className={`flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium ${className}`}>
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200/60">
                    <RefreshCw size={12} className="text-emerald-600 shrink-0" />
                    <span>
                        {textoAtualizacao}: <strong>{valorAtualizacao}</strong>
                    </span>
                </span>
                {valorConferencia && (
                    <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 px-3 py-1 rounded-lg border border-teal-200/60">
                        <CheckCircle2 size={12} className="text-teal-600 shrink-0" />
                        <span>
                            Conferência setorial: <strong>{valorConferencia}</strong>
                        </span>
                    </span>
                )}
                {dataAcesso && (
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1 rounded-lg border border-blue-200/60">
                        <Calendar size={12} className="text-blue-600 shrink-0" />
                        <span>
                            Consulta em: <strong>{dataAcesso}</strong>
                        </span>
                    </span>
                )}
            </div>
        );
    }

    if (variant === "banner") {
        return (
            <div
                className={`bg-gradient-to-r from-emerald-50 via-teal-50/50 to-blue-50 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${className}`}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                        <ShieldCheck size={16} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">
                            {textoAtualizacao}: <span className="text-emerald-700 font-black">{valorAtualizacao}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Fonte: {fonte} {valorConferencia ? `• Conferido pelo setor em: ${valorConferencia}` : ""}
                        </p>
                    </div>
                </div>
                {dataAcesso && (
                    <div className="shrink-0 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
                        <Clock size={13} className="text-blue-600" />
                        <span className="text-[11px] font-bold text-slate-600">
                            Data da consulta: <strong className="text-blue-700 font-black">{dataAcesso}</strong>
                        </span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl p-4 transition-all duration-200 ${className}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <RefreshCw size={14} className="text-emerald-600 shrink-0" />
                        <span className="text-slate-600 font-medium">
                            {textoAtualizacao}: <strong className="text-slate-800 font-bold">{valorAtualizacao}</strong>
                        </span>
                    </div>
                    {valorConferencia && (
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-teal-600 shrink-0" />
                            <span className="text-slate-600 font-medium">
                                Última conferência: <strong className="text-slate-800 font-bold">{valorConferencia}</strong>
                            </span>
                        </div>
                    )}
                </div>
                {dataAcesso && (
                    <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                        <Calendar size={14} className="text-blue-600 shrink-0" />
                        <span className="text-slate-600 font-medium">
                            Data da consulta: <strong className="text-blue-800 font-bold">{dataAcesso}</strong>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
