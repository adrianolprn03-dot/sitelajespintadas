"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MUNICIPIO } from "@/config/municipio";
import {
    FaArrowRight,
    FaInstagram,
    FaFacebookF,
    FaYoutube,
    FaCalendarDays,
    FaLocationDot,
    FaClock,
    FaArrowUpRightFromSquare,
    FaRegNewspaper
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

interface MuralMistoNoticiasAgendaProps {
    noticias: NoticiaItem[];
}

export default function MuralMistoNoticiasAgenda({ noticias = [] }: MuralMistoNoticiasAgendaProps) {
    const [categoriaAtiva, setCategoriaAtiva] = useState("TODAS");

    const categorias = [
        "TODAS",
        "EDUCAÇÃO",
        "SAÚDE",
        "OBRAS",
        "ASSISTÊNCIA SOCIAL",
        "AGRICULTURA",
    ];

    const noticiasFiltradas =
        categoriaAtiva === "TODAS"
            ? noticias
            : noticias.filter((n) =>
                  n.categoria.toUpperCase().includes(categoriaAtiva)
              );

    // Próximos Eventos da Agenda Municipal
    const agendaEventos = [
        {
            dia: "18",
            mes: "NOV",
            titulo: "Feira da Agricultura Familiar e Artesanato",
            horario: "06h30 às 11h30",
            local: "Praça Monsenhor Freitas",
            categoria: "Agricultura",
        },
        {
            dia: "22",
            mes: "NOV",
            titulo: "Mutirão de Saúde e Vacinação nas UBS",
            horario: "08h00 às 13h00",
            local: "UBS Centro e Zona Rural",
            categoria: "Saúde",
        },
        {
            dia: "05",
            mes: "DEZ",
            titulo: "Mostra Cultural e Pedagógica das Escolas",
            horario: "09h00 às 16h00",
            local: "Ginásio Poliesportivo",
            categoria: "Educação",
        },
    ];

    return (
        <section id="central-noticias" className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                
                {/* ========================================================= */}
                {/* COLUNA 1 (6 COLUNAS): LAJES PINTADAS EM FOCO (NOTÍCIAS)   */}
                {/* ========================================================= */}
                <div className="lg:col-span-6 bg-white rounded-2xl sm:rounded-[26px] border-2 border-slate-100 p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,38,84,0.06)] flex flex-col justify-between">
                    <div>
                        {/* Header Roxo/Azul Estilizado com Botão "Acessar Notícias +" */}
                        <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg">
                                    <FaRegNewspaper />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-extrabold uppercase tracking-widest text-purple-600">
                                        COMUNICAÇÃO OFICIAL
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-black text-[#12304A] font-heading tracking-tight">
                                        Lajes Pintadas em foco
                                    </h2>
                                </div>
                            </div>

                            <Link
                                href="/noticias"
                                className="inline-flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-sm shrink-0"
                            >
                                <span>Acessar notícias</span>
                                <span className="font-black">+</span>
                            </Link>
                        </div>

                        {/* Chips / Abas de Filtros por Categoria */}
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-5">
                            {categorias.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategoriaAtiva(cat)}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
                                        categoriaAtiva === cat
                                            ? "bg-[#1254A3] text-white border-[#1254A3] shadow-sm"
                                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Lista de Notícias em Destaque */}
                        <div className="space-y-4">
                            {noticiasFiltradas.slice(0, 3).map((item) => (
                                <article
                                    key={item.id}
                                    className="group flex flex-col sm:flex-row gap-4 p-3.5 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-[#1254A3] hover:shadow-md transition-all"
                                >
                                    <Link
                                        href={`/noticias/${item.slug}`}
                                        className="relative w-full sm:w-36 h-28 sm:h-24 rounded-xl overflow-hidden bg-slate-200 shrink-0 block"
                                    >
                                        <img
                                            src={item.imagem}
                                            alt={item.titulo}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 left-2">
                                            <span className="bg-[#1254A3] text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                                                {item.categoria}
                                            </span>
                                        </div>
                                    </Link>

                                    <div className="flex-1 flex flex-col justify-between min-w-0">
                                        <div>
                                            <span className="text-[10px] font-semibold text-[#5B738B]">
                                                {item.dataFormatada}
                                            </span>
                                            <h3 className="text-sm font-extrabold text-[#12304A] font-heading group-hover:text-[#1254A3] transition-colors leading-snug line-clamp-2 mt-0.5">
                                                <Link href={`/noticias/${item.slug}`}>
                                                    {item.titulo}
                                                </Link>
                                            </h3>
                                            <p className="text-[11px] text-[#5B738B] leading-relaxed line-clamp-1 mt-1">
                                                {item.resumo}
                                            </p>
                                        </div>

                                        <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-[#1254A3]">
                                            <Link
                                                href={`/noticias/${item.slug}`}
                                                className="hover:underline flex items-center gap-1"
                                            >
                                                <span>Ler matéria</span>
                                                <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 text-center">
                        <Link
                            href="/noticias"
                            className="text-xs font-bold text-[#1254A3] hover:underline"
                        >
                            Ver todas as matérias e comunicados oficiais da Gestão →
                        </Link>
                    </div>
                </div>

                {/* ========================================================= */}
                {/* COLUNA 2 (3 COLUNAS): REDES SOCIAIS (INSTAGRAM OFICIAL)   */}
                {/* ========================================================= */}
                <div className="lg:col-span-3 bg-white rounded-2xl sm:rounded-[26px] border-2 border-slate-100 p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,38,84,0.06)] flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-lg shadow-sm">
                                <FaInstagram />
                            </div>
                            <div>
                                <span className="block text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">
                                    CONECTE-SE
                                </span>
                                <h2 className="text-xl font-black text-[#12304A] font-heading tracking-tight">
                                    Redes <span className="text-emerald-600">sociais</span>
                                </h2>
                            </div>
                        </div>

                        {/* Card Visual do Instagram */}
                        <div className="rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50 p-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                                    <img
                                        src="/images/brasao-lajes-pintadas.png"
                                        alt="Perfil Oficial Lajes Pintadas"
                                        className="w-full h-full object-cover rounded-full bg-white p-1"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-[#12304A]">
                                        @prefeituradelajespintadas
                                    </h3>
                                    <span className="text-[10px] text-[#5B738B]">
                                        Página Oficial no Instagram
                                    </span>
                                </div>
                            </div>

                            {/* Foto demonstrativa do Feed */}
                            <div className="relative rounded-xl overflow-hidden aspect-square bg-slate-200">
                                <img
                                    src="/images/hero-slider-2.jpg"
                                    alt="Ações da Prefeitura no Instagram"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                                    <p className="text-white text-[11px] font-semibold leading-tight line-clamp-2">
                                        Acompanhe diariamente as ações, entregas e eventos de Lajes Pintadas em nossas redes oficiais!
                                    </p>
                                </div>
                            </div>

                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 hover:opacity-90 text-white text-xs font-extrabold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                            >
                                <FaInstagram size={14} />
                                <span>Seguir no Instagram</span>
                                <FaArrowUpRightFromSquare size={10} />
                            </a>
                        </div>
                    </div>

                    {/* Canais Oficiais Adicionais */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-center gap-3">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-xl bg-blue-50 text-[#1254A3] hover:bg-[#1254A3] hover:text-white flex items-center justify-center transition-all text-sm"
                            title="Facebook Oficial"
                        >
                            <FaFacebookF />
                        </a>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-all text-sm"
                            title="YouTube Oficial"
                        >
                            <FaYoutube />
                        </a>
                    </div>
                </div>

                {/* ========================================================= */}
                {/* COLUNA 3 (3 COLUNAS): PROGRAMAÇÃO CULTURAL E AGENDA       */}
                {/* ========================================================= */}
                <div className="lg:col-span-3 bg-white rounded-2xl sm:rounded-[26px] border-2 border-slate-100 p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,38,84,0.06)] flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg">
                                <FaCalendarDays />
                            </div>
                            <div>
                                <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#10B981]">
                                    AGENDA DA CIDADE
                                </span>
                                <h2 className="text-xl font-black text-[#12304A] font-heading tracking-tight">
                                    Programação <span className="text-emerald-600">cultural</span>
                                </h2>
                            </div>
                        </div>

                        {/* Lista de Eventos */}
                        <div className="space-y-3.5">
                            {agendaEventos.map((ev, idx) => (
                                <div
                                    key={idx}
                                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all flex items-start gap-3"
                                >
                                    {/* Badge da Data */}
                                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                                        <span className="text-sm font-black leading-none">{ev.dia}</span>
                                        <span className="text-[9px] font-bold uppercase tracking-wider">{ev.mes}</span>
                                    </div>

                                    {/* Dados do Evento */}
                                    <div className="min-w-0 flex-1">
                                        <span className="inline-block text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider mb-1">
                                            {ev.categoria}
                                        </span>
                                        <h3 className="text-xs font-black text-[#12304A] leading-snug">
                                            {ev.titulo}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-[10px] text-[#5B738B] mt-1.5">
                                            <FaClock size={9} className="text-emerald-600" />
                                            <span>{ev.horario}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-[#5B738B] mt-0.5">
                                            <FaLocationDot size={9} className="text-emerald-600" />
                                            <span className="truncate">{ev.local}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 text-center">
                        <Link
                            href="/servicos/cultura"
                            className="text-xs font-bold text-emerald-700 hover:underline"
                        >
                            Ver calendário municipal completo →
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}

