"use client";

import React from "react";
import Link from "next/link";
import { MUNICIPIO } from "@/config/municipio";
import {
    FaReceipt,
    FaFileInvoiceDollar,
    FaBookOpen,
    FaGraduationCap,
    FaHandsHoldingChild,
    FaShieldHalved,
    FaScaleBalanced,
    FaHeartPulse,
    FaMasksTheater,
    FaBullhorn,
    FaArrowRight,
    FaArrowUpRightFromSquare,
    FaLocationDot,
    FaClock,
    FaPhone,
    FaBuildingColumns
} from "react-icons/fa6";

interface CentralServicosGridProps {
    linksExternos?: Array<{ moduloAlvo: string | null; url: string }>;
}

export default function CentralServicosGrid({ linksExternos = [] }: CentralServicosGridProps) {
    const getLink = (identifiers: string[], fallbackHref: string) => {
        const found = linksExternos.find((l) =>
            l.moduloAlvo && identifiers.some((id) => id.toLowerCase() === l.moduloAlvo?.toLowerCase())
        );
        return {
            href: found ? found.url : fallbackHref,
            isExternal: !!found,
        };
    };

    const linkTributos = getLink(["home-tributario", "tributos", "tributario"], "/servicos/tributario");
    const linkIptu = getLink(["home-iptu", "iptu"], "/servicos/tributario");
    const linkDiario = getLink(["home-diario", "diario-oficial", "diario"], "/transparencia/legislacao");
    const linkEducacao = getLink(["home-educacao", "creches", "fila-creches"], "/transparencia/fila-creches");
    const linkSocial = getLink(["home-social", "assistencia-social", "cras"], "/secretarias/assistencia-social");
    const linkTransparencia = getLink(["home-transparencia", "transparencia"], "/transparencia");
    const linkLeis = getLink(["home-leis-decretos", "legislacao", "leis"], "/transparencia/legislacao");
    const linkSaude = getLink(["home-saude", "remedios", "medicamentos-sus"], "/transparencia/medicamentos-sus");
    const linkCultura = getLink(["home-cultura", "cultura"], "/servicos/cultura");
    const linkOuvidoria = getLink(["home-ouvidoria", "ouvidoria", "esic"], "/servicos/ouvidoria");

    // 10 Cards em Grid 5x2 (Conforme Referência Oficial do Governo Municipal)
    const servicos = [
        {
            id: "serv-tributo",
            titulo: "Tributos",
            sublabel: "Emissão de DAM e certidões",
            href: linkTributos.href,
            isExternal: linkTributos.isExternal,
            icon: FaReceipt,
            corIcone: "text-emerald-600 bg-emerald-50 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white",
        },
        {
            id: "serv-iptu",
            titulo: "IPTU 2ª Via",
            sublabel: "Emissão rápida de carnê",
            href: linkIptu.href,
            isExternal: linkIptu.isExternal,
            icon: FaFileInvoiceDollar,
            corIcone: "text-blue-600 bg-blue-50 border-blue-200 group-hover:bg-[#1254A3] group-hover:text-white",
        },
        {
            id: "serv-diario",
            titulo: "Diário Oficial",
            sublabel: "Edições e decretos",
            href: linkDiario.href,
            isExternal: linkDiario.isExternal,
            icon: FaBookOpen,
            corIcone: "text-cyan-600 bg-cyan-50 border-cyan-200 group-hover:bg-cyan-600 group-hover:text-white",
        },
        {
            id: "serv-educacao",
            titulo: "Educação & Creches",
            sublabel: "Fila de espera e escolas",
            href: linkEducacao.href,
            isExternal: linkEducacao.isExternal,
            icon: FaGraduationCap,
            corIcone: "text-amber-600 bg-amber-50 border-amber-200 group-hover:bg-amber-600 group-hover:text-white",
        },
        {
            id: "serv-social",
            titulo: "Assistência Social",
            sublabel: "CRAS e programas sociais",
            href: linkSocial.href,
            isExternal: linkSocial.isExternal,
            icon: FaHandsHoldingChild,
            corIcone: "text-violet-600 bg-violet-50 border-violet-200 group-hover:bg-violet-600 group-hover:text-white",
        },
        {
            id: "serv-transparencia",
            titulo: "Transparência",
            sublabel: "Contas públicas e PNTP",
            href: linkTransparencia.href,
            isExternal: linkTransparencia.isExternal,
            icon: FaShieldHalved,
            corIcone: "text-[#1254A3] bg-blue-50 border-blue-200 group-hover:bg-[#1254A3] group-hover:text-white",
        },
        {
            id: "serv-leis",
            titulo: "Leis Municipais",
            sublabel: "Legislação e portarias",
            href: linkLeis.href,
            isExternal: linkLeis.isExternal,
            icon: FaScaleBalanced,
            corIcone: "text-emerald-600 bg-emerald-50 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white",
        },
        {
            id: "serv-saude",
            titulo: "Saúde & UBS",
            sublabel: "Remédios SUS e unidades",
            href: linkSaude.href,
            isExternal: linkSaude.isExternal,
            icon: FaHeartPulse,
            corIcone: "text-rose-600 bg-rose-50 border-rose-200 group-hover:bg-rose-600 group-hover:text-white",
        },
        {
            id: "serv-cultura",
            titulo: "Cultura & Lazer",
            sublabel: "Eventos e patrimônio",
            href: linkCultura.href,
            isExternal: linkCultura.isExternal,
            icon: FaMasksTheater,
            corIcone: "text-orange-600 bg-orange-50 border-orange-200 group-hover:bg-orange-600 group-hover:text-white",
        },
        {
            id: "serv-ouvidoria",
            titulo: "Ouvidoria & e-SIC",
            sublabel: "Acesso à informação",
            href: linkOuvidoria.href,
            isExternal: linkOuvidoria.isExternal,
            icon: FaBullhorn,
            corIcone: "text-teal-600 bg-teal-50 border-teal-200 group-hover:bg-teal-600 group-hover:text-white",
        },
    ];

    return (
        <section id="central-servicos" className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
            {/* Título da Seção e Botão "Acessar Todos +" */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
                <div>
                    <span className="inline-block text-xs font-black uppercase tracking-wider text-[#1254A3] mb-1">
                        AUTOATENDIMENTO AO CIDADÃO
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-[#12304A] font-heading tracking-tight leading-tight">
                        Central de <span className="text-[#10B981]">Serviços</span>
                    </h2>
                    <div className="h-1.5 w-24 bg-[#10B981] rounded-full mt-2" />
                </div>

                <Link
                    href="/transparencia/carta-servicos"
                    className="inline-flex items-center gap-2 bg-[#12304A] hover:bg-[#002654] active:bg-[#001733] text-white text-xs sm:text-sm font-extrabold px-5 py-3 rounded-full transition-all shadow-sm hover:shadow-md hover:scale-[1.02] w-fit"
                >
                    <span>Acessar todos os serviços</span>
                    <span className="text-emerald-400 font-black">+</span>
                </Link>
            </div>

            {/* Grid Assimétrico: Coluna da Sede (Esquerda) + Grade 5x2 de Serviços (Direita) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Lado Esquerdo (4 Colunas): Sede da Prefeitura e Canais de Atendimento */}
                <div className="lg:col-span-4 bg-gradient-to-br from-white to-[#F8FAFC] rounded-2xl sm:rounded-[26px] border-2 border-slate-100 p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,38,84,0.06)] flex flex-col justify-between relative overflow-hidden group">
                    {/* Faixa decorativa no topo */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1254A3] via-[#10B981] to-[#F39A32]" />

                    <div>
                        {/* Imagem/Diorama de Destaque da Sede */}
                        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-100 border border-slate-200/80 mb-6 shadow-sm">
                            <img
                                src="/images/historia-panoramica.jpg"
                                alt="Sede da Prefeitura Municipal de Lajes Pintadas"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#002654]/90 via-transparent to-transparent flex items-end p-4">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                                        Palácio Municipal
                                    </span>
                                    <h3 className="text-white text-base sm:text-lg font-black leading-snug">
                                        Prefeito José Farias
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Dados de Atendimento e Horário */}
                        <div className="space-y-3.5 text-xs text-[#5B738B]">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1254A3] flex items-center justify-center shrink-0">
                                    <FaClock size={13} />
                                </div>
                                <div>
                                    <span className="block font-bold text-[#12304A]">Expediente ao Público:</span>
                                    <span>Segunda a Sexta, das 07h às 13h</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                    <FaLocationDot size={13} />
                                </div>
                                <div>
                                    <span className="block font-bold text-[#12304A]">Endereço:</span>
                                    <span>Rua Severino Ferreira, 153 – Centro</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                    <FaBuildingColumns size={13} />
                                </div>
                                <div>
                                    <span className="block font-bold text-[#12304A]">CNPJ Oficial:</span>
                                    <span>{MUNICIPIO.cnpj}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                        <Link
                            href="/servicos/ouvidoria"
                            className="text-xs font-extrabold text-[#1254A3] hover:text-[#0b3b75] flex items-center gap-1.5 transition-colors"
                        >
                            <span>Fale com a Ouvidoria</span>
                            <FaArrowRight size={11} />
                        </Link>
                        <Link
                            href="/a-prefeitura"
                            className="text-[11px] font-bold text-[#10B981] hover:underline"
                        >
                            Ver Estrutura →
                        </Link>
                    </div>
                </div>

                {/* Lado Direito (8 Colunas): Grade 5x2 de Serviços (10 Cards Brancos) */}
                <div className="lg:col-span-8">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 h-full">
                        {servicos.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    target={item.isExternal ? "_blank" : undefined}
                                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                                    className="group bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-100 hover:border-[#1254A3] shadow-sm hover:shadow-[0_12px_28px_rgba(18,84,163,0.12)] transition-all duration-300 flex flex-col items-center text-center justify-between hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#1254A3]/20"
                                >
                                    <div className="w-full flex flex-col items-center">
                                        {/* Ícone em Círculo Colorido */}
                                        <div
                                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${item.corIcone} border flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 transition-transform group-hover:scale-110 shadow-sm`}
                                        >
                                            <Icon />
                                        </div>

                                        {/* Título do Serviço */}
                                        <h3 className="text-xs sm:text-sm font-extrabold text-[#12304A] font-heading group-hover:text-[#1254A3] transition-colors leading-tight">
                                            {item.titulo}
                                        </h3>

                                        <p className="text-[11px] text-[#5B738B] leading-snug mt-1 line-clamp-2">
                                            {item.sublabel}
                                        </p>
                                    </div>

                                    {/* Indicador de Acesso no Rodapé do Card */}
                                    <div className="w-full pt-3 mt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] font-bold text-[#1254A3] group-hover:text-[#10B981] transition-colors">
                                        <span>Acessar</span>
                                        {item.isExternal ? (
                                            <FaArrowUpRightFromSquare size={9} />
                                        ) : (
                                            <FaArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform" />
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
}
