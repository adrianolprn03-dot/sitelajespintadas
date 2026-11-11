"use client";

import { useState } from "react";
import Link from "next/link";
import { MUNICIPIO } from "@/config/municipio";
import {
    HiMagnifyingGlass,
    HiOutlineDocumentText,
    HiOutlineUser,
    HiOutlineCreditCard,
    HiOutlineShieldCheck,
    HiOutlineBuildingOffice2,
    HiOutlineHeart,
    HiOutlineAcademicCap,
    HiOutlineSparkles,
    HiArrowRight,
} from "react-icons/hi2";
import {
    FaComments,
    FaCircleInfo,
    FaPills,
    FaGavel,
    FaFileContract,
    FaScaleBalanced,
    FaLocationDot,
    FaClock,
    FaPhone,
} from "react-icons/fa6";

type ProfileKey = "cidadao" | "servidor" | "empresas" | "transparencia";

const profileConfigs: Record<
    ProfileKey,
    {
        label: string;
        headline: string;
        subtitle: string;
        placeholder: string;
        chips: Array<{ label: string; href: string }>;
    }
> = {
    cidadao: {
        label: "Para o Cidadão",
        headline: "Governo Digital, Transparente e Próximo de Cada Cidadão.",
        subtitle:
            "Acesse serviços de saúde, educação, ouvidoria, tributos e transparência pública de Lajes Pintadas/RN em um só lugar.",
        placeholder: "O que você procura hoje? Ex: IPTU, Remédios SUS, Ouvidoria, Creches...",
        chips: [
            { label: "Medicamentos SUS", href: "/transparencia/medicamentos-sus" },
            { label: "Central de Regulação", href: "/transparencia/central-regulacao" },
            { label: "Ouvidoria Municipal", href: "/servicos/ouvidoria" },
            { label: "e-SIC (Pedido LAI)", href: "/servicos/esic" },
            { label: "Fila de Creches", href: "/transparencia/educacao" },
        ],
    },
    servidor: {
        label: "Para o Servidor",
        headline: "Portal do Servidor Público Municipal de Lajes Pintadas.",
        subtitle:
            "Consulte contracheque online, portarias, diárias, estrutura administrativa e atos oficiais da gestão municipal.",
        placeholder: "Buscar contracheque, portarias, tabela de diárias, concursos...",
        chips: [
            { label: "Contracheque Online", href: "/servicos/contracheque" },
            { label: "Quadro de Servidores", href: "/transparencia/servidores" },
            { label: "Portarias Executivas", href: "/transparencia/portarias" },
            { label: "Diárias de Viagem", href: "/transparencia/diarias" },
            { label: "Concursos e Seleções", href: "/transparencia/concursos" },
        ],
    },
    empresas: {
        label: "Para Empresas",
        headline: "Compras Públicas, Licitações e Atendimento Tributário.",
        subtitle:
            "Acompanhe editais no PNCP, atas de registro de preços, contratos administrativos e ordem cronológica de pagamentos.",
        placeholder: "Buscar licitações, editais, contratos, ordem cronológica, tributos...",
        chips: [
            { label: "Licitações (PNCP)", href: "/transparencia/licitacoes" },
            { label: "Contratos Vigentes", href: "/transparencia/contratos" },
            { label: "Atas de Registro (SRP)", href: "/transparencia/atas-registro" },
            { label: "Ordem Cronológica", href: "/transparencia/ordem-cronologica" },
            { label: "Portal Tributário", href: "/servicos/tributario" },
        ],
    },
    transparencia: {
        label: "Transparência",
        headline: "Transparência Ativa e Contas Públicas de Lajes Pintadas/RN.",
        subtitle:
            "Fiscalize receitas, despesas em tempo real, relatórios da LRF, obras públicas e dados abertos conforme as diretrizes PNTP 2026.",
        placeholder: "Pesquisar despesas, receitas, folha, LRF, obras públicas, leis...",
        chips: [
            { label: "Receitas Públicas", href: "/transparencia/receitas" },
            { label: "Despesas Públicas", href: "/transparencia/despesas" },
            { label: "Relatórios da LRF", href: "/transparencia/lrf" },
            { label: "Obras Públicas", href: "/transparencia/obras" },
            { label: "Dados Abertos", href: "/transparencia/dados-abertos" },
        ],
    },
};

const bentoDockCards = [
    {
        title: "Portal da Transparência",
        subtitle: "Receitas, despesas, folha e contratos",
        href: "/transparencia",
        icon: HiOutlineShieldCheck,
        iconBg: "bg-[#0072CE]",
        borderBottom: "border-b-[#0072CE]",
        hoverRing: "hover:border-[#0072CE]/50",
        badgeColor: "text-[#0072CE]",
    },
    {
        title: "Ouvidoria & e-SIC",
        subtitle: "Manifestações e Acesso à Informação",
        href: "/servicos/ouvidoria",
        icon: FaComments,
        iconBg: "bg-[#EA580C]",
        borderBottom: "border-b-[#EA580C]",
        hoverRing: "hover:border-[#EA580C]/50",
        badgeColor: "text-[#EA580C]",
    },
    {
        title: "Saúde & Medicamentos SUS",
        subtitle: "Estoque nas UBS e Central de Regulação",
        href: "/transparencia/medicamentos-sus",
        icon: FaPills,
        iconBg: "bg-[#15803D]",
        borderBottom: "border-b-[#15803D]",
        hoverRing: "hover:border-[#15803D]/50",
        badgeColor: "text-[#15803D]",
    },
    {
        title: "Portal do Contribuinte",
        subtitle: "2ª via de IPTU, ISS, certidões e alvarás",
        href: "/servicos/tributario",
        icon: HiOutlineUser,
        iconBg: "bg-[#EAB308]",
        borderBottom: "border-b-[#EAB308]",
        hoverRing: "hover:border-[#EAB308]/60",
        badgeColor: "text-[#B45309]",
    },
    {
        title: "Servidor & Contracheque",
        subtitle: "Holerite online, diárias e portarias",
        href: "/servicos/contracheque",
        icon: HiOutlineCreditCard,
        iconBg: "bg-[#0072CE]",
        borderBottom: "border-b-[#0072CE]",
        hoverRing: "hover:border-[#0072CE]/50",
        badgeColor: "text-[#0072CE]",
    },
    {
        title: "Diário Oficial & Leis",
        subtitle: "Licitações, decretos e atos oficiais",
        href: "/transparencia/legislacao",
        icon: HiOutlineDocumentText,
        iconBg: "bg-[#15803D]",
        borderBottom: "border-b-[#15803D]",
        hoverRing: "hover:border-[#15803D]/50",
        badgeColor: "text-[#15803D]",
    },
];

const serviceCategories = [
    {
        id: "saude",
        label: "Saúde & SUS",
        icon: HiOutlineHeart,
        activeBg: "bg-[#15803D] text-white border-[#15803D]",
        dotColor: "bg-[#15803D]",
        services: [
            {
                title: "Estoque de Medicamentos SUS",
                desc: "Consulte a disponibilidade de medicamentos na Farmácia Básica e UBS municipais.",
                sla: "Consulta Imediata",
                href: "/transparencia/medicamentos-sus",
                accent: "border-l-[#15803D]",
            },
            {
                title: "Central Municipal de Regulação",
                desc: "Acompanhamento de agendamentos, filas de exames e consultas especializadas.",
                sla: "Online 24h",
                href: "/transparencia/central-regulacao",
                accent: "border-l-[#15803D]",
            },
            {
                title: "Unidades de Saúde (UBS)",
                desc: "Endereços, equipes de atendimento, horários e contatos da rede municipal.",
                sla: "Atendimento 07h às 13h",
                href: "/unidades-de-saude",
                accent: "border-l-[#15803D]",
            },
            {
                title: "Plano e Programação de Saúde",
                desc: "Diretrizes do Plano Municipal de Saúde (PMS), PAS e Relatório Anual de Gestão.",
                sla: "Acesso Público",
                href: "/transparencia/plano-saude",
                accent: "border-l-[#15803D]",
            },
        ],
    },
    {
        id: "cidadao",
        label: "Cidadania & Ouvidoria",
        icon: FaCircleInfo,
        activeBg: "bg-[#EA580C] text-white border-[#EA580C]",
        dotColor: "bg-[#EA580C]",
        services: [
            {
                title: "e-SIC — Pedido de Informação (LAI)",
                desc: "Solicite informações públicas eletronicamente com protocolo e acompanhamento.",
                sla: "Prazo Legal: 20 dias",
                href: "/servicos/esic",
                accent: "border-l-[#EA580C]",
            },
            {
                title: "Ouvidoria Geral do Município",
                desc: "Registre sugestões, elogios, solicitações, reclamações ou denúncias.",
                sla: "Atendimento Digital",
                href: "/servicos/ouvidoria",
                accent: "border-l-[#EA580C]",
            },
            {
                title: "Consulta de Protocolo",
                desc: "Acompanhe o andamento da sua manifestação ou pedido de acesso à informação.",
                sla: "Tempo Real",
                href: "/servicos/consulta-protocolo",
                accent: "border-l-[#EA580C]",
            },
            {
                title: "Carta de Serviços ao Cidadão",
                desc: "Catálogo completo de todos os serviços públicos prestados pela Prefeitura.",
                sla: "Lei nº 13.460/2017",
                href: "/transparencia/carta-servicos",
                accent: "border-l-[#EA580C]",
            },
        ],
    },
    {
        id: "educacao",
        label: "Educação & Cultura",
        icon: HiOutlineAcademicCap,
        activeBg: "bg-[#D97706] text-white border-[#D97706]",
        dotColor: "bg-[#FACC15]",
        services: [
            {
                title: "Unidades Escolares e Creches",
                desc: "Consulte a rede municipal de ensino, etapas ofertadas, diretores e localização.",
                sla: "Rede Municipal",
                href: "/unidades-escolares",
                accent: "border-l-[#EAB308]",
            },
            {
                title: "Transparência da Educação & Creches",
                desc: "Listas de espera em creches, transporte escolar e indicadores educacionais.",
                sla: "Consulta Online",
                href: "/transparencia/educacao",
                accent: "border-l-[#EAB308]",
            },
            {
                title: "Plano Municipal de Educação (PME)",
                desc: "Metas pedagógicas, valorização docente e acompanhamento decenal do ensino.",
                sla: "Acesso Público",
                href: "/transparencia/plano-educacao",
                accent: "border-l-[#EAB308]",
            },
            {
                title: "Incentivos e Fomento Cultural",
                desc: "Editais culturais, patrimônio histórico e ações de valorização artística local.",
                sla: "Cultura Viva",
                href: "/transparencia/incentivos-culturais",
                accent: "border-l-[#EAB308]",
            },
        ],
    },
    {
        id: "tributos",
        label: "Tributos, Licitações & Obras",
        icon: HiOutlineBuildingOffice2,
        activeBg: "bg-[#0072CE] text-white border-[#0072CE]",
        dotColor: "bg-[#0072CE]",
        services: [
            {
                title: "Portal do Contribuinte (IPTU / ISS)",
                desc: "Emissão de DAM, certidões negativas de débitos, nota fiscal eletrônica e alvarás.",
                sla: "Autoatendimento",
                href: "/servicos/tributario",
                accent: "border-l-[#0072CE]",
            },
            {
                title: "Licitações e Editais (PNCP)",
                desc: "Processos licitatórios, pregões, dispensas e atas de registro de preços.",
                sla: "Lei nº 14.133/2021",
                href: "/transparencia/licitacoes",
                accent: "border-l-[#0072CE]",
            },
            {
                title: "Acompanhamento de Obras Públicas",
                desc: "Situação física e financeira das obras municipais, empresas contratadas e prazos.",
                sla: "Fiscalização Cidadã",
                href: "/transparencia/obras",
                accent: "border-l-[#0072CE]",
            },
            {
                title: "Contratos e Ordem Cronológica",
                desc: "Íntegra dos contratos administrativos, aditivos, fiscais e fila de pagamentos.",
                sla: "Dados Abertos",
                href: "/transparencia/contratos",
                accent: "border-l-[#0072CE]",
            },
        ],
    },
];

export default function HeroPanoramicoModelo3() {
    const [activeProfile, setActiveProfile] = useState<ProfileKey>("cidadao");
    const [activeServiceTab, setActiveServiceTab] = useState<string>("saude");
    const currentProfile = profileConfigs[activeProfile];
    const currentServiceGroup =
        serviceCategories.find((c) => c.id === activeServiceTab) || serviceCategories[0];

    return (
        <div className="space-y-12 sm:space-y-16">
            {/* =====================================================================
                1. HERO PANORÂMICO "JANELA DE LAJES PINTADAS" COM VÍDEO OFICIAL (MODELO 3)
               ===================================================================== */}
            <section className="relative pt-4 sm:pt-6 pb-4">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
                    {/* Moldura Panorâmica Widescreen com Vídeo Oficial de Lajes Pintadas */}
                    <div className="relative rounded-[28px] sm:rounded-[34px] overflow-hidden shadow-[0_24px_60px_rgba(0,43,92,0.18)] border border-white/60 min-h-[480px] sm:min-h-[520px] flex items-center">
                        {/* Vídeo Oficial Existente no Portal como Background */}
                        <video
                            src="/video_lajes_pintadas.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            poster="/images/historia-panoramica.jpg"
                            className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
                        />

                        {/* Overlay Gradiente Heráldico (Azul Safira Profundo à esquerda -> Pôr do Sol Terracota/Dourado à direita) */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    "linear-gradient(115deg, rgba(0, 38, 84, 0.92) 0%, rgba(0, 88, 170, 0.80) 48%, rgba(21, 128, 61, 0.45) 75%, rgba(234, 88, 12, 0.50) 100%)",
                            }}
                        />

                        {/* Brilho sutil superior nas cores do Brasão */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 heraldic-stripe z-20" />

                        {/* Conteúdo Interno em Vidro Fosco (Frosted Glass Container) */}
                        <div className="relative z-10 w-full p-6 sm:p-10 lg:p-14">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                                {/* Coluna Esquerda (8 colunas): Abas por Perfil, Título, Busca em Vidro e Chips */}
                                <div className="lg:col-span-8 space-y-6 text-left">
                                    {/* Abas de Perfil em Cápsula de Vidro (Modelo 3) */}
                                    <div
                                        role="tablist"
                                        aria-label="Selecionar perfil de atendimento"
                                        className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-inner"
                                    >
                                        {(Object.keys(profileConfigs) as ProfileKey[]).map((key) => {
                                            const isSelected = activeProfile === key;
                                            return (
                                                <button
                                                    key={key}
                                                    role="tab"
                                                    aria-selected={isSelected}
                                                    onClick={() => setActiveProfile(key)}
                                                    className={`px-4 py-2 rounded-full text-xs sm:text-[13px] font-extrabold transition-all duration-200 cursor-pointer ${
                                                        isSelected
                                                            ? "bg-[#FACC15] text-[#0F2942] shadow-md scale-[1.02]"
                                                            : "text-white/90 hover:text-white hover:bg-white/10"
                                                    }`}
                                                >
                                                    {profileConfigs[key].label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Título Principal e Subtítulo */}
                                    <div className="space-y-3">
                                        <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-black text-white font-heading tracking-tight leading-[1.08] drop-shadow-sm">
                                            {currentProfile.headline}
                                        </h1>
                                        <p className="text-sm sm:text-base text-sky-100/95 font-medium leading-relaxed max-w-2xl">
                                            {currentProfile.subtitle}
                                        </p>
                                    </div>

                                    {/* Barra de Busca em Vidro Fosco (Frosted Glass Search Bar) */}
                                    <form
                                        id="busca"
                                        action="/transparencia"
                                        method="GET"
                                        className="bg-white/20 hover:bg-white/25 focus-within:bg-white/95 backdrop-blur-xl p-2 rounded-full border border-white/40 focus-within:border-[#FACC15] flex items-center shadow-2xl max-w-2xl transition-all duration-300 group"
                                    >
                                        <div className="flex-1 flex items-center pl-4 pr-2 gap-3">
                                            <HiMagnifyingGlass className="text-[#FACC15] group-focus-within:text-[#0072CE] text-xl shrink-0 transition-colors" />
                                            <input
                                                type="text"
                                                name="q"
                                                placeholder={currentProfile.placeholder}
                                                className="w-full bg-transparent text-sm sm:text-base text-white group-focus-within:text-[#0F2942] placeholder-white/80 group-focus-within:placeholder-slate-400 font-medium focus:outline-none py-2"
                                                aria-label="Buscar serviços ou dados no portal"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="bg-[#0072CE] hover:bg-[#005bb5] text-white text-xs sm:text-sm font-extrabold px-6 py-3 rounded-full transition-all shrink-0 shadow-md ring-2 ring-[#FACC15]"
                                        >
                                            Buscar
                                        </button>
                                    </form>

                                    {/* Sugestões Rápidas do Perfil Selecionado */}
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#FACC15]">
                                            Acesso direto:
                                        </span>
                                        {currentProfile.chips.map((chip, idx) => (
                                            <Link
                                                key={idx}
                                                href={chip.href}
                                                className="text-xs font-semibold text-white bg-white/15 hover:bg-[#FACC15] hover:text-[#0F2942] backdrop-blur-md border border-white/25 px-3 py-1 rounded-full transition-all"
                                            >
                                                {chip.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Coluna Direita (4 colunas): Card de Vidro Heráldico com o Brasão Oficial de Lajes Pintadas (Sem Selo Diamante) */}
                                <div className="lg:col-span-4 flex justify-center lg:justify-end">
                                    <div className="w-full max-w-[310px] rounded-[26px] bg-white/15 backdrop-blur-xl border border-white/30 p-6 text-center text-white shadow-2xl space-y-4">
                                        {/* Brasão Oficial Colorido de Lajes Pintadas */}
                                        <div className="w-24 h-24 mx-auto rounded-2xl bg-white/95 p-2.5 shadow-lg ring-2 ring-[#FACC15] flex items-center justify-center">
                                            <img
                                                src="/images/brasao-lajes-pintadas.png"
                                                alt={`Brasão Oficial de ${MUNICIPIO.nome}/${MUNICIPIO.uf}`}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        <div>
                                            <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#FACC15] bg-black/25 px-3 py-0.5 rounded-full mb-1">
                                                Poder Executivo Municipal
                                            </span>
                                            <h2 className="text-xl font-black font-heading tracking-tight text-white">
                                                {MUNICIPIO.nome}/{MUNICIPIO.uf}
                                            </h2>
                                            <p className="text-xs text-sky-100/90 font-medium">
                                                Região do Trairi • Rio Grande do Norte
                                            </p>
                                        </div>

                                        <div className="border-t border-white/20 pt-3.5 space-y-2 text-left text-xs text-white/90">
                                            <div className="flex items-center justify-between bg-black/20 px-3 py-2 rounded-xl">
                                                <span className="flex items-center gap-1.5 text-white/80">
                                                    <FaClock className="text-[#FACC15]" size={12} />
                                                    Expediente:
                                                </span>
                                                <span className="font-bold text-white">{MUNICIPIO.horario}</span>
                                            </div>
                                            <div className="flex items-center justify-between bg-black/20 px-3 py-2 rounded-xl">
                                                <span className="flex items-center gap-1.5 text-white/80">
                                                    <FaLocationDot className="text-[#16A34A]" size={12} />
                                                    IBGE / UF:
                                                </span>
                                                <span className="font-bold text-white">{MUNICIPIO.ibge} • RN</span>
                                            </div>
                                        </div>

                                        <Link
                                            href="/servicos/esic"
                                            className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FACC15] text-[#0F2942] font-extrabold text-xs py-2.5 px-4 rounded-xl shadow transition-colors"
                                        >
                                            <FaCircleInfo className="text-[#0072CE]" size={14} />
                                            <span>Acesso à Informação (e-SIC)</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =====================================================================
                        2. BOTTOM BENTO GRID DOCK (6 CARTÕES HORIZONTAIS NAS CORES DO BRASÃO)
                       ===================================================================== */}
                    <div className="mt-6 sm:-mt-8 relative z-20 px-1 sm:px-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                            {bentoDockCards.map((card, index) => {
                                const Icon = card.icon;
                                return (
                                    <Link
                                        key={index}
                                        href={card.href}
                                        className={`group bg-white rounded-2xl p-4 sm:p-5 border border-[#DCE4EE] border-b-4 ${card.borderBottom} ${card.hoverRing} shadow-[0_10px_30px_rgba(0,59,115,0.08)] hover:shadow-[0_16px_36px_rgba(0,59,115,0.14)] transition-all duration-300 hover:-translate-y-1 flex items-center gap-4`}
                                    >
                                        <div
                                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${card.iconBg} text-white flex items-center justify-center text-2xl shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300`}
                                        >
                                            <Icon />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base sm:text-[17px] font-extrabold text-[#0F2942] font-heading group-hover:text-[#0072CE] transition-colors leading-snug">
                                                {card.title}
                                            </h3>
                                            <p className="text-xs text-[#526B84] font-medium truncate mt-0.5">
                                                {card.subtitle}
                                            </p>
                                        </div>

                                        <div className={`text-slate-300 group-hover:${card.badgeColor} group-hover:translate-x-1 transition-all shrink-0`}>
                                            <HiArrowRight size={18} />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================================
                3. CARTA DE SERVIÇOS DIGITAIS POR ÁREA (ABAS NAS CORES DO BRASÃO)
               ===================================================================== */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
                <div className="bg-white rounded-[28px] p-6 sm:p-8 lg:p-10 border border-[#DCE4EE] shadow-gov">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-100">
                        <div>
                            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#15803D] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-2.5">
                                <HiOutlineSparkles size={14} />
                                <span>Atendimento Digital 360º</span>
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-[#0F2942] font-heading tracking-tight">
                                Carta de Serviços por Área
                            </h2>
                            <p className="text-xs sm:text-sm text-[#526B84] mt-1">
                                Navegue pelas cores da nossa cidade e encontre rapidamente o serviço que você precisa.
                            </p>
                        </div>

                        {/* Pílulas de Categoria com as 4 Cores do Brasão */}
                        <div className="flex flex-wrap items-center gap-2">
                            {serviceCategories.map((cat) => {
                                const CatIcon = cat.icon;
                                const isActive = activeServiceTab === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveServiceTab(cat.id)}
                                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-[13px] font-extrabold border transition-all cursor-pointer ${
                                            isActive
                                                ? `${cat.activeBg} shadow-md scale-[1.02]`
                                                : "bg-[#F4F7FB] hover:bg-slate-100 text-[#0F2942] border-[#DCE4EE]"
                                        }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${isActive ? "bg-white" : cat.dotColor}`} />
                                        <CatIcon size={16} />
                                        <span>{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Grid de 4 Serviços da Categoria Ativa */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        {currentServiceGroup.services.map((srv, idx) => (
                            <Link
                                key={idx}
                                href={srv.href}
                                className={`group bg-[#F8FAFC] hover:bg-white rounded-2xl p-5 border border-[#DCE4EE] border-l-4 ${srv.accent} hover:shadow-gov-hover transition-all duration-300 flex flex-col justify-between`}
                            >
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[#526B84]">
                                            {srv.sla}
                                        </span>
                                        <HiArrowRight
                                            size={15}
                                            className="text-slate-400 group-hover:text-[#0072CE] group-hover:translate-x-1 transition-all"
                                        />
                                    </div>
                                    <h3 className="text-base font-extrabold text-[#0F2942] font-heading group-hover:text-[#0072CE] transition-colors leading-snug">
                                        {srv.title}
                                    </h3>
                                    <p className="text-xs text-[#526B84] leading-relaxed">{srv.desc}</p>
                                </div>

                                <div className="pt-4 mt-4 border-t border-slate-200/70 flex items-center justify-between text-xs font-bold text-[#0072CE]">
                                    <span>Acessar serviço online</span>
                                    <span>→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
