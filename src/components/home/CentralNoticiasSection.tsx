"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MUNICIPIO } from "@/config/municipio";
import {
    FaArrowRight,
    FaRegClock,
    FaRegNewspaper,
    FaArrowUpRightFromSquare,
    FaTag,
    FaCalendarDays
} from "react-icons/fa6";

interface NoticiaItem {
    id: string;
    titulo: string;
    resumo: string;
    categoria: string;
    imagem: string;
    slug: string;
    dataFormatada: string;
}

interface CentralNoticiasSectionProps {
    noticias: NoticiaItem[];
}

export default function CentralNoticiasSection({ noticias = [] }: CentralNoticiasSectionProps) {
    const [categoriaAtiva, setCategoriaAtiva] = useState("TODAS");

    const categorias = [
        "TODAS",
        "SAÚDE",
        "EDUCAÇÃO",
        "OBRAS",
        "ASSISTÊNCIA SOCIAL",
        "AGRICULTURA",
        "GESTÃO MUNICIPAL",
    ];

    const noticiasFiltradas =
        categoriaAtiva === "TODAS"
            ? noticias
            : noticias.filter((n) =>
                  n.categoria.toUpperCase().includes(categoriaAtiva)
              );

    const noticiaDestaque = noticiasFiltradas[0] || noticias[0];
    const noticiasSecundarias = noticiasFiltradas.slice(1, 4).length > 0
        ? noticiasFiltradas.slice(1, 4)
        : noticias.slice(1, 4);

    return (
        <section id="central-noticias" className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
            {/* Header da Seção */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-extrabold uppercase tracking-wider text-[#1254A3] mb-2 shadow-xs">
                        <FaRegNewspaper size={12} />
                        <span>COMUNICAÇÃO OFICIAL</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black text-[#12304A] font-heading tracking-tight leading-tight">
                        Central de <span className="text-[#1254A3]">Notícias</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5B738B] mt-1.5 font-medium max-w-xl">
                        Acompanhe diariamente as ações, entregas, projetos e comunicados oficiais da Prefeitura Municipal de Lajes Pintadas.
                    </p>
                    <div className="h-1.5 w-24 bg-[#F39A32] rounded-full mt-3" />
                </div>

                <Link
                    href="/noticias"
                    className="inline-flex items-center gap-2 bg-[#1254A3] hover:bg-[#0e4485] active:bg-[#0b3568] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-full transition-all shadow-sm hover:shadow-md hover:scale-[1.02] w-fit shrink-0"
                >
                    <span>Ver todas as notícias</span>
                    <FaArrowRight size={12} />
                </Link>
            </div>

            {/* Filtros em Abas de Categorias */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 border-b border-slate-100">
                {categorias.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setCategoriaAtiva(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                            categoriaAtiva === cat
                                ? "bg-[#1254A3] text-white border-[#1254A3] shadow-sm scale-105"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grade Principal: Notícia Destaque (Esquerda/Maior) + Notícias Secundárias (Direita) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                
                {/* Notícia Destaque Principal (7 Colunas no Desktop) */}
                {noticiaDestaque && (
                    <article className="lg:col-span-7 bg-white rounded-2xl sm:rounded-[26px] border-2 border-slate-100 hover:border-[#1254A3] shadow-[0_8px_30px_rgba(0,38,84,0.06)] hover:shadow-[0_16px_40px_rgba(0,38,84,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1">
                        <Link
                            href={`/noticias/${noticiaDestaque.slug}`}
                            className="relative block w-full aspect-[16/10] overflow-hidden bg-slate-900"
                        >
                            <img
                                src={noticiaDestaque.imagem}
                                alt={noticiaDestaque.titulo}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute top-4 left-4">
                                <span className="bg-[#1254A3] text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                                    {noticiaDestaque.categoria}
                                </span>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold mb-1">
                                    <FaCalendarDays size={12} className="text-amber-400" />
                                    <span>{noticiaDestaque.dataFormatada}</span>
                                </div>
                                <h3 className="text-lg sm:text-2xl font-black font-heading leading-tight drop-shadow-sm group-hover:text-amber-300 transition-colors line-clamp-2">
                                    {noticiaDestaque.titulo}
                                </h3>
                            </div>
                        </Link>

                        <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                            <p className="text-sm text-[#5B738B] leading-relaxed font-medium line-clamp-3">
                                {noticiaDestaque.resumo}
                            </p>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <Link
                                    href={`/noticias/${noticiaDestaque.slug}`}
                                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#1254A3] hover:text-[#0b3b75] transition-colors"
                                >
                                    <span>Ler matéria completa</span>
                                    <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <span className="text-[11px] font-semibold text-slate-400">
                                    Portal Oficial
                                </span>
                            </div>
                        </div>
                    </article>
                )}

                {/* Notícias Secundárias (5 Colunas no Desktop - Empilhadas com Elegância) */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                    {noticiasSecundarias.map((item) => (
                        <article
                            key={item.id}
                            className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-100 hover:border-[#1254A3] shadow-sm hover:shadow-md transition-all duration-300 flex gap-4 group hover:-translate-y-0.5"
                        >
                            <Link
                                href={`/noticias/${item.slug}`}
                                className="relative w-28 sm:w-32 aspect-square rounded-xl overflow-hidden bg-slate-100 shrink-0 block"
                            >
                                <img
                                    src={item.imagem}
                                    alt={item.titulo}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-1.5 left-1.5">
                                    <span className="bg-[#1254A3] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                        {item.categoria}
                                    </span>
                                </div>
                            </Link>

                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                <div>
                                    <span className="text-[10px] font-bold text-[#5B738B] flex items-center gap-1 mb-1">
                                        <FaRegClock size={10} className="text-[#1254A3]" />
                                        <span>{item.dataFormatada}</span>
                                    </span>
                                    <h4 className="text-xs sm:text-sm font-extrabold text-[#12304A] font-heading group-hover:text-[#1254A3] transition-colors leading-snug line-clamp-2">
                                    <Link href={`/noticias/${item.slug}`}>
                                        {item.titulo}
                                    </Link>
                                    </h4>
                                    <p className="text-[11px] text-[#5B738B] line-clamp-2 mt-1 leading-snug">
                                        {item.resumo}
                                    </p>
                                </div>

                                <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#1254A3]">
                                    <Link
                                        href={`/noticias/${item.slug}`}
                                        className="hover:underline flex items-center gap-1"
                                    >
                                        <span>Acessar</span>
                                        <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

            </div>
        </section>
    );
}
