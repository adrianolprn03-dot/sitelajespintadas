import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MUNICIPIO } from "@/config/municipio";
import HeroWaveCards from "@/components/home/HeroWaveCards";
import CentralServicosGrid from "@/components/home/CentralServicosGrid";
import MuralMistoNoticiasAgenda from "@/components/home/MuralMistoNoticiasAgenda";
import RadarTransparenciaPNTP from "@/components/home/RadarTransparenciaPNTP";
import {
    FaArrowRight,
    FaHeartPulse,
    FaGraduationCap,
    FaTrowelBricks,
    FaSeedling,
    FaUsers,
    FaBuildingColumns,
    FaLandmark,
    FaFlag,
} from "react-icons/fa6";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: `${MUNICIPIO.nomeCompleto} – ${MUNICIPIO.uf} | Portal Oficial`,
    description: `Portal oficial da ${MUNICIPIO.nomeCompleto} – ${MUNICIPIO.uf}. Acesso a serviços ao cidadão, notícias da gestão, transparência pública e informações institucionais.`,
};

const secretariasHighlight = [
    {
        nome: "Saúde",
        desc: "UBS, Farmácia Básica SUS, vigilância em saúde e regulação.",
        href: "/secretarias/saude",
        icon: FaHeartPulse,
    },
    {
        nome: "Educação e Cultura",
        desc: "Rede municipal de ensino, creches, transporte escolar e cultura.",
        href: "/secretarias/educacao-cultura",
        icon: FaGraduationCap,
    },
    {
        nome: "Obras e Serviços Urbanos",
        desc: "Pavimentação, urbanismo, iluminação pública e limpeza urbana.",
        href: "/secretarias/obras-servicos-urbanos",
        icon: FaTrowelBricks,
    },
    {
        nome: "Assistência Social",
        desc: "CRAS, programas socioassistenciais, Cadastro Único e proteção.",
        href: "/secretarias/assistencia-social",
        icon: FaUsers,
    },
    {
        nome: "Agricultura e Meio Ambiente",
        desc: "Apoio ao produtor rural, recursos hídricos e sustentabilidade.",
        href: "/secretarias/agricultura-meio-ambiente",
        icon: FaSeedling,
    },
    {
        nome: "Administração e Planejamento",
        desc: "Gestão administrativa, atendimento ao servidor e planejamento.",
        href: "/secretarias/administracao-geral-planejamento",
        icon: FaBuildingColumns,
    },
];

export default async function Home() {
    let noticias: Array<{
        id: string;
        titulo: string;
        resumo: string;
        categoria: string;
        imagem: string;
        slug: string;
        dataFormatada: string;
    }> = [];

    try {
        const dbNoticias = await prisma.noticia.findMany({
            where: { publicada: true },
            take: 6,
            orderBy: { publicadoEm: "desc" },
            include: { secretaria: true },
        });

        if (dbNoticias.length > 0) {
            noticias = dbNoticias.map((n, idx) => ({
                id: n.id,
                titulo: n.titulo,
                resumo:
                    n.resumo ||
                    "Confira os detalhes completos desta ação realizada pela gestão municipal em benefício da população de Lajes Pintadas.",
                categoria: n.secretaria?.nome
                    ? n.secretaria.nome.split(" ")[0].toUpperCase()
                    : idx === 0
                    ? "GESTÃO MUNICIPAL"
                    : idx === 1
                    ? "EDUCAÇÃO"
                    : "CIDADE",
                imagem:
                    n.imagem ||
                    (idx === 0
                        ? "/images/historia-panoramica.jpg"
                        : idx === 1
                        ? "/images/hero-slider-2.jpg"
                        : "/images/hero-bg.jpg"),
                slug: n.slug,
                dataFormatada: n.publicadoEm
                    ? new Date(n.publicadoEm).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                      })
                    : "Atualizado recentemente",
            }));
        }
    } catch {
        // fallback silencioso preservando integridade
    }

    let linksExternos: Array<{ moduloAlvo: string | null; url: string }> = [];
    try {
        linksExternos = await (prisma as any).linkExterno.findMany({
            where: { ativo: true },
            select: { moduloAlvo: true, url: true },
        });
    } catch {
        // fallback silencioso
    }

    if (noticias.length === 0) {
        noticias = [
            {
                id: "1",
                titulo: "Serviços públicos digitais mais perto da população de Lajes Pintadas",
                resumo:
                    "Portal institucional modernizado amplia o acesso rápido à Ouvidoria, e-SIC, Carta de Serviços e Transparência Ativa.",
                categoria: "GESTÃO MUNICIPAL",
                imagem: "/images/historia-panoramica.jpg",
                slug: "servicos-mais-perto-da-populacao",
                dataFormatada: "Portal Oficial",
            },
            {
                id: "2",
                titulo: "Educação e Cultura em movimento nas escolas da rede municipal",
                resumo:
                    "Ações pedagógicas e investimentos fortalecem o ensino básico e valorizam a identidade histórica laje-pintadense.",
                categoria: "EDUCAÇÃO",
                imagem: "/images/hero-slider-2.jpg",
                slug: "educacao-em-movimento",
                dataFormatada: "Rede Municipal",
            },
            {
                id: "3",
                titulo: "Cuidado permanente com a saúde, infraestrutura e bem-estar na cidade",
                resumo:
                    "Equipes municipais atuam de forma integrada no atendimento básico, manutenção urbana e apoio ao homem do campo.",
                categoria: "SAÚDE",
                imagem: "/images/hero-bg.jpg",
                slug: "cuidado-com-a-nossa-cidade",
                dataFormatada: "Gestão Municipal",
            },
        ];
    }

    return (
        <div className="space-y-12 sm:space-y-16 pb-20">
            {/* =====================================================================
                1. HERO COM VÍDEO OFICIAL BEM VISÍVEL & 4 CARDS VERTICAIS FLUTUANTES
               ===================================================================== */}
            <HeroWaveCards linksExternos={linksExternos} />

            {/* =====================================================================
                2. CENTRAL DE NOTÍCIAS: LAJES PINTADAS EM FOCO, REDES E AGENDA CULTURAL
               ===================================================================== */}
            <MuralMistoNoticiasAgenda noticias={noticias} />

            {/* =====================================================================
                3. CENTRAL DE SERVIÇOS (DIORAMA DA SEDE + GRADE 5x2 DE SERVIÇOS)
               ===================================================================== */}
            <CentralServicosGrid linksExternos={linksExternos} />

            {/* =====================================================================
                4. RADAR PNTP 2026: COMPROMISSO COM A TRANSPARÊNCIA PÚBLICA
               ===================================================================== */}
            <RadarTransparenciaPNTP />

            {/* =====================================================================
                5. NOSSA TERRA, SÍMBOLOS OFICIAIS & SECRETARIAS MUNICIPAIS
               ===================================================================== */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Card Esquerdo (5 colunas): Identidade e Símbolos de Lajes Pintadas */}
                    <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-[26px] border-2 border-slate-100 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,38,84,0.06)] flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1.5 heraldic-stripe" />

                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#1254A3] bg-blue-50 border border-blue-200/70 px-3 py-1 rounded-full">
                                <FaFlag size={12} />
                                <span>Identidade Laje-Pintadense</span>
                            </div>

                            <h2 className="text-2xl font-black text-[#12304A] font-heading tracking-tight leading-snug">
                                Nossa Terra, Nossa História e Símbolos Oficiais
                            </h2>

                            <p className="text-xs sm:text-sm text-[#5B738B] leading-relaxed">
                                Batizada pelas históricas inscrições rupestres em suas lajes de pedra e marcada pela força da serra e da sua gente, {MUNICIPIO.nome}/{MUNICIPIO.uf} celebra sua história desde {MUNICIPIO.estatisticas.fundacao}.
                            </p>

                            {/* Brasão e Bandeira Lado a Lado */}
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-200/80 flex flex-col items-center text-center">
                                    <img
                                        src="/images/brasao-lajes-pintadas.png"
                                        alt="Brasão Municipal de Lajes Pintadas"
                                        className="h-20 w-auto object-contain mb-2"
                                    />
                                    <span className="text-xs font-extrabold text-[#12304A]">Brasão Oficial</span>
                                    <span className="text-[10px] text-[#5B738B]">Armas do Município</span>
                                </div>

                                <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-200/80 flex flex-col items-center text-center">
                                    <img
                                        src="/images/bandeira-lajes-pintadas.png"
                                        alt="Bandeira Municipal de Lajes Pintadas"
                                        className="h-20 w-auto object-contain rounded shadow-sm mb-2"
                                    />
                                    <span className="text-xs font-extrabold text-[#12304A]">Bandeira Oficial</span>
                                    <span className="text-[10px] text-[#5B738B]">Símbolo Cívico</span>
                                </div>
                            </div>

                            {/* Estatísticas Rápidas em Azul e Amarelo */}
                            <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
                                <div className="bg-[#F8FAFC] rounded-xl p-2.5 border border-slate-200/80">
                                    <span className="block text-sm sm:text-base font-black text-[#1254A3]">
                                        {MUNICIPIO.estatisticas.fundacao}
                                    </span>
                                    <span className="block text-[10px] font-bold text-[#5B738B] uppercase">
                                        Emancipação
                                    </span>
                                </div>
                                <div className="bg-[#F8FAFC] rounded-xl p-2.5 border border-slate-200/80">
                                    <span className="block text-sm sm:text-base font-black text-[#1254A3]">
                                        {MUNICIPIO.estatisticas.area}
                                    </span>
                                    <span className="block text-[10px] font-bold text-[#5B738B] uppercase">
                                        Território
                                    </span>
                                </div>
                                <div className="bg-[#F8FAFC] rounded-xl p-2.5 border border-slate-200/80">
                                    <span className="block text-sm sm:text-base font-black text-[#1254A3]">
                                        {MUNICIPIO.uf}
                                    </span>
                                    <span className="block text-[10px] font-bold text-[#5B738B] uppercase">
                                        Região Trairi
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-5 mt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                            <Link
                                href="/a-prefeitura/historia"
                                className="text-xs font-extrabold text-[#1254A3] hover:underline flex items-center gap-1.5"
                            >
                                <FaLandmark size={12} />
                                <span>Conhecer a História da Cidade</span>
                            </Link>
                            <Link
                                href="/municipio/simbolos"
                                className="text-xs font-extrabold text-[#1254A3] hover:underline flex items-center gap-1.5"
                            >
                                <span>Ver Símbolos e Hino →</span>
                            </Link>
                        </div>
                    </div>

                    {/* Coluna Direita (7 colunas): Secretarias Municipais */}
                    <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-[26px] border-2 border-slate-100 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,38,84,0.06)] flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <div>
                                    <span className="block text-xs font-extrabold uppercase tracking-wider text-[#1254A3]">
                                        ESTRUTURA ADMINISTRATIVA
                                    </span>
                                    <h2 className="text-2xl font-black text-[#12304A] font-heading tracking-tight">
                                        Secretarias Municipais
                                    </h2>
                                </div>
                                <Link
                                    href="/secretarias"
                                    className="text-xs font-extrabold text-[#1254A3] hover:underline flex items-center gap-1.5 shrink-0"
                                >
                                    <span>Todas as secretarias</span>
                                    <FaArrowRight size={11} />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {secretariasHighlight.map((sec, idx) => {
                                    const Icon = sec.icon;
                                    return (
                                        <Link
                                            key={idx}
                                            href={sec.href}
                                            className="group bg-[#F8FAFC] hover:bg-white rounded-2xl p-4 border border-slate-200/80 border-b-4 border-b-[#1254A3] hover:border-b-[#10B981] hover:shadow-md transition-all flex items-start gap-3.5"
                                        >
                                            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1254A3] border border-blue-100 group-hover:bg-[#1254A3] group-hover:text-white group-hover:border-[#1254A3] flex items-center justify-center text-lg shrink-0 transition-all shadow-sm">
                                                <Icon />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-extrabold text-[#12304A] font-heading group-hover:text-[#1254A3] transition-colors">
                                                    {sec.nome}
                                                </h3>
                                                <p className="text-[11px] text-[#5B738B] leading-snug mt-0.5 line-clamp-2">
                                                    {sec.desc}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#5B738B]">
                            <span>
                                Horário de funcionamento das Secretarias: <strong>{MUNICIPIO.horario}</strong>
                            </span>
                            <Link
                                href="/a-prefeitura/estrutura"
                                className="font-extrabold text-[#1254A3] hover:underline"
                            >
                                Consultar Organograma Completo →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
