import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MUNICIPIO } from "@/config/municipio";
import HeroPanoramicoModelo3 from "@/components/home/HeroPanoramicoModelo3";
import {
    FaArrowRight,
    FaHandshake,
    FaScaleBalanced,
    FaDatabase,
    FaHeartPulse,
    FaGraduationCap,
    FaTrowelBricks,
    FaSeedling,
    FaUsers,
    FaBuildingColumns,
    FaLandmark,
    FaFlag,
} from "react-icons/fa6";
import { HiOutlineDocumentText } from "react-icons/hi2";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: `${MUNICIPIO.nomeCompleto} – ${MUNICIPIO.uf} | Página Inicial`,
    description: `Site oficial da ${MUNICIPIO.nomeCompleto} – ${MUNICIPIO.uf}. Transparência, serviços ao cidadão, notícias e informações institucionais.`,
};

const badgeThemes = [
    { bg: "bg-[#0072CE]", text: "text-white", borderBottom: "border-b-[#0072CE]" },
    { bg: "bg-[#15803D]", text: "text-white", borderBottom: "border-b-[#15803D]" },
    { bg: "bg-[#EA580C]", text: "text-white", borderBottom: "border-b-[#EA580C]" },
];

const secretariasHighlight = [
    {
        nome: "Saúde Pública",
        desc: "UBS, Farmácia Básica SUS, vigilância em saúde e regulação.",
        href: "/secretarias/saude",
        icon: FaHeartPulse,
        iconBg: "bg-emerald-50 text-[#15803D] border-emerald-200",
        bottomBar: "border-b-[#15803D]",
    },
    {
        nome: "Educação e Cultura",
        desc: "Rede municipal de ensino, creches, transporte escolar e cultura.",
        href: "/secretarias/educacao",
        icon: FaGraduationCap,
        iconBg: "bg-amber-50 text-[#D97706] border-amber-200",
        bottomBar: "border-b-[#EAB308]",
    },
    {
        nome: "Obras e Infraestrutura",
        desc: "Pavimentação, urbanismo, iluminação pública e obras municipais.",
        href: "/secretarias/obras",
        icon: FaTrowelBricks,
        iconBg: "bg-orange-50 text-[#EA580C] border-orange-200",
        bottomBar: "border-b-[#EA580C]",
    },
    {
        nome: "Assistência Social",
        desc: "CRAS, programas socioassistenciais, Cadastro Único e proteção.",
        href: "/secretarias/social",
        icon: FaUsers,
        iconBg: "bg-sky-50 text-[#0072CE] border-sky-200",
        bottomBar: "border-b-[#0072CE]",
    },
    {
        nome: "Agricultura e Meio Ambiente",
        desc: "Apoio ao produtor rural, recursos hídricos e sustentabilidade.",
        href: "/secretarias/agricultura",
        icon: FaSeedling,
        iconBg: "bg-emerald-50 text-[#15803D] border-emerald-200",
        bottomBar: "border-b-[#15803D]",
    },
    {
        nome: "Administração e Finanças",
        desc: "Gestão administrativa, planejamento orçamentário e tributação.",
        href: "/secretarias/administracao",
        icon: FaBuildingColumns,
        iconBg: "bg-sky-50 text-[#0072CE] border-sky-200",
        bottomBar: "border-b-[#0072CE]",
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
            take: 3,
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
                    ? "INFRAESTRUTURA"
                    : idx === 1
                    ? "EDUCAÇÃO"
                    : "SAÚDE & CIDADE",
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

    if (noticias.length === 0) {
        noticias = [
            {
                id: "1",
                titulo: "Serviços públicos digitais mais perto da população de Lajes Pintadas",
                resumo:
                    "Portal institucional modernizado amplia o acesso rápido à Ouvidoria, e-SIC, Carta de Serviços e Transparência Ativa.",
                categoria: "SERVIÇOS DIGITAIS",
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
                categoria: "SAÚDE & CIDADE",
                imagem: "/images/hero-bg.jpg",
                slug: "cuidado-com-a-nossa-cidade",
                dataFormatada: "Gestão Municipal",
            },
        ];
    }

    return (
        <div className="space-y-14 sm:space-y-16 pb-20">
            {/* SEÇÕES 1, 2 e 3: Hero Panorâmico com Vídeo Oficial + Bento Dock + Carta de Serviços */}
            <HeroPanoramicoModelo3 />

            {/* =====================================================================
                4. ACONTECE EM LAJES PINTADAS (GRID EDITORIAL MODELO 3)
               ===================================================================== */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
                    <div>
                        <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-[#0072CE] mb-1">
                            MURAL OFICIAL DA GESTÃO
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#0F2942] font-heading tracking-tight leading-tight">
                            Acontece em {MUNICIPIO.nome}
                        </h2>
                        <div className="h-1.5 w-20 heraldic-stripe rounded-full mt-2" />
                    </div>

                    <Link
                        href="/noticias"
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#0072CE] bg-white hover:bg-[#0072CE] hover:text-white px-4 py-2.5 rounded-full border border-[#DCE4EE] shadow-sm transition-all w-fit"
                    >
                        <span>Ver todas as notícias</span>
                        <FaArrowRight size={12} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {noticias.map((item, idx) => {
                        const theme = badgeThemes[idx % badgeThemes.length];
                        return (
                            <article
                                key={item.id}
                                className={`bg-white rounded-[22px] border border-[#DCE4EE] border-b-4 ${theme.borderBottom} overflow-hidden shadow-gov hover:shadow-gov-hover transition-all duration-300 group flex flex-col hover:-translate-y-1`}
                            >
                                <Link
                                    href={`/noticias/${item.slug}`}
                                    className="block relative overflow-hidden aspect-[16/10] bg-slate-100"
                                >
                                    <img
                                        src={item.imagem}
                                        alt={item.titulo}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span
                                            className={`inline-block ${theme.bg} ${theme.text} text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md`}
                                        >
                                            {item.categoria}
                                        </span>
                                    </div>
                                </Link>

                                <div className="p-5 sm:p-6 space-y-2.5 flex-1 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <span className="block text-[11px] font-semibold text-[#526B84]">
                                            {item.dataFormatada}
                                        </span>
                                        <h3 className="text-base sm:text-lg font-extrabold text-[#0F2942] font-heading leading-snug group-hover:text-[#0072CE] transition-colors line-clamp-2">
                                            <Link href={`/noticias/${item.slug}`}>{item.titulo}</Link>
                                        </h3>
                                        <p className="text-xs text-[#526B84] leading-relaxed line-clamp-2">
                                            {item.resumo}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0072CE]">
                                        <Link href={`/noticias/${item.slug}`} className="flex items-center gap-1.5">
                                            <span>Ler matéria completa</span>
                                            <FaArrowRight
                                                size={11}
                                                className="group-hover:translate-x-1 transition-transform"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            {/* =====================================================================
                5. PUBLICAÇÕES OFICIAIS & ATOS DA GESTÃO (CORES DO BRASÃO)
               ===================================================================== */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
                <div className="rounded-[28px] bg-gradient-to-r from-[#002B5C] via-[#003B73] to-[#064E3B] p-6 sm:p-8 lg:p-10 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 heraldic-stripe" />

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-7">
                        <div>
                            <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#FACC15] mb-1">
                                PUBLICIDADE E TRANSPARÊNCIA ATIVA
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                                Publicações Oficiais e Controle Social
                            </h2>
                            <p className="text-xs sm:text-sm text-sky-100/85 mt-1">
                                Acesso rápido aos editais de licitação, contratos firmados, legislação municipal e demonstrativos da LRF.
                            </p>
                        </div>

                        <Link
                            href="/transparencia"
                            className="inline-flex items-center gap-2 bg-[#FACC15] hover:bg-amber-300 text-[#0F2942] font-extrabold text-xs sm:text-sm px-5 py-3 rounded-full shadow-md transition-all w-fit shrink-0"
                        >
                            <span>Acessar Portal da Transparência</span>
                            <FaArrowRight size={12} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* 1. Licitações */}
                        <Link
                            href="/transparencia/licitacoes"
                            className="bg-white/10 hover:bg-white text-white hover:text-[#0F2942] backdrop-blur-md rounded-2xl p-5 border border-white/20 transition-all duration-200 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-xl bg-[#EA580C] text-white flex items-center justify-center text-xl shrink-0 shadow">
                                    <HiOutlineDocumentText />
                                </div>
                                <div>
                                    <span className="block text-sm sm:text-base font-extrabold font-heading">
                                        Licitações
                                    </span>
                                    <span className="block text-[11px] opacity-75">Editais e PNCP</span>
                                </div>
                            </div>
                            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {/* 2. Contratos */}
                        <Link
                            href="/transparencia/contratos"
                            className="bg-white/10 hover:bg-white text-white hover:text-[#0F2942] backdrop-blur-md rounded-2xl p-5 border border-white/20 transition-all duration-200 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-xl bg-[#0072CE] text-white flex items-center justify-center text-xl shrink-0 shadow">
                                    <FaHandshake />
                                </div>
                                <div>
                                    <span className="block text-sm sm:text-base font-extrabold font-heading">
                                        Contratos
                                    </span>
                                    <span className="block text-[11px] opacity-75">Vigentes e Aditivos</span>
                                </div>
                            </div>
                            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {/* 3. Leis e Decretos */}
                        <Link
                            href="/transparencia/legislacao"
                            className="bg-white/10 hover:bg-white text-white hover:text-[#0F2942] backdrop-blur-md rounded-2xl p-5 border border-white/20 transition-all duration-200 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-xl bg-[#EAB308] text-[#0F2942] flex items-center justify-center text-xl shrink-0 shadow">
                                    <FaScaleBalanced />
                                </div>
                                <div>
                                    <span className="block text-sm sm:text-base font-extrabold font-heading">
                                        Leis e Decretos
                                    </span>
                                    <span className="block text-[11px] opacity-75">Atos Normativos</span>
                                </div>
                            </div>
                            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {/* 4. Prestação de Contas */}
                        <Link
                            href="/transparencia/lrf"
                            className="bg-white/10 hover:bg-white text-white hover:text-[#0F2942] backdrop-blur-md rounded-2xl p-5 border border-white/20 transition-all duration-200 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-xl bg-[#15803D] text-white flex items-center justify-center text-xl shrink-0 shadow">
                                    <FaDatabase />
                                </div>
                                <div>
                                    <span className="block text-sm sm:text-base font-extrabold font-heading">
                                        Contas Públicas
                                    </span>
                                    <span className="block text-[11px] opacity-75">RREO, RGF e Balanços</span>
                                </div>
                            </div>
                            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* =====================================================================
                6. NOSSA TERRA, SÍMBOLOS OFICIAIS & SECRETARIAS MUNICIPAIS (MODELO 3)
               ===================================================================== */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Card Esquerdo (5 colunas): Identidade Heráldica e Símbolos de Lajes Pintadas */}
                    <div className="lg:col-span-5 bg-white rounded-[26px] border border-[#DCE4EE] p-6 sm:p-8 shadow-gov flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1.5 heraldic-stripe" />

                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#15803D] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                                <FaFlag size={12} />
                                <span>Identidade Laje-Pintadense</span>
                            </div>

                            <h2 className="text-2xl font-black text-[#0F2942] font-heading tracking-tight leading-snug">
                                Nossa Terra, Nossa História e Símbolos Oficiais
                            </h2>

                            <p className="text-xs sm:text-sm text-[#526B84] leading-relaxed">
                                Batizada pelas históricas inscrições rupestres em suas lajes de pedra e marcada pela força da serra verde e da sua gente, {MUNICIPIO.nome}/{MUNICIPIO.uf} celebra sua história desde {MUNICIPIO.estatisticas.fundacao}.
                            </p>

                            {/* Brasão e Bandeira Lado a Lado */}
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div className="bg-[#F4F7FB] rounded-2xl p-4 border border-[#DCE4EE] flex flex-col items-center text-center">
                                    <img
                                        src="/images/brasao-lajes-pintadas.png"
                                        alt="Brasão Municipal de Lajes Pintadas"
                                        className="h-20 w-auto object-contain mb-2"
                                    />
                                    <span className="text-xs font-extrabold text-[#0F2942]">Brasão Oficial</span>
                                    <span className="text-[10px] text-[#526B84]">Armas do Município</span>
                                </div>

                                <div className="bg-[#F4F7FB] rounded-2xl p-4 border border-[#DCE4EE] flex flex-col items-center text-center">
                                    <img
                                        src="/images/bandeira-lajes-pintadas.png"
                                        alt="Bandeira Municipal de Lajes Pintadas"
                                        className="h-20 w-auto object-contain rounded shadow-sm mb-2"
                                    />
                                    <span className="text-xs font-extrabold text-[#0F2942]">Bandeira Oficial</span>
                                    <span className="text-[10px] text-[#526B84]">Verde, Ouro e Azul</span>
                                </div>
                            </div>

                            {/* Estatísticas Rápidas */}
                            <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
                                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80">
                                    <span className="block text-sm sm:text-base font-black text-[#0072CE]">
                                        {MUNICIPIO.estatisticas.fundacao}
                                    </span>
                                    <span className="block text-[10px] font-bold text-[#526B84] uppercase">
                                        Emancipação
                                    </span>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80">
                                    <span className="block text-sm sm:text-base font-black text-[#15803D]">
                                        {MUNICIPIO.estatisticas.area}
                                    </span>
                                    <span className="block text-[10px] font-bold text-[#526B84] uppercase">
                                        Território
                                    </span>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80">
                                    <span className="block text-sm sm:text-base font-black text-[#EA580C]">
                                        {MUNICIPIO.uf}
                                    </span>
                                    <span className="block text-[10px] font-bold text-[#526B84] uppercase">
                                        Região Trairi
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-5 mt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                            <Link
                                href="/a-prefeitura/historia"
                                className="text-xs font-extrabold text-[#0072CE] hover:underline flex items-center gap-1.5"
                            >
                                <FaLandmark size={12} />
                                <span>Conhecer a História da Cidade</span>
                            </Link>
                            <Link
                                href="/municipio/simbolos"
                                className="text-xs font-extrabold text-[#15803D] hover:underline flex items-center gap-1.5"
                            >
                                <span>Ver Símbolos e Hino →</span>
                            </Link>
                        </div>
                    </div>

                    {/* Coluna Direita (7 colunas): Secretarias Municipais nas Cores do Brasão */}
                    <div className="lg:col-span-7 bg-white rounded-[26px] border border-[#DCE4EE] p-6 sm:p-8 shadow-gov flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <div>
                                    <span className="block text-xs font-extrabold uppercase tracking-wider text-[#EA580C]">
                                        ESTRUTURA ADMINISTRATIVA
                                    </span>
                                    <h2 className="text-2xl font-black text-[#0F2942] font-heading tracking-tight">
                                        Secretarias Municipais
                                    </h2>
                                </div>
                                <Link
                                    href="/secretarias"
                                    className="text-xs font-extrabold text-[#0072CE] hover:underline flex items-center gap-1.5 shrink-0"
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
                                            className={`group bg-[#F8FAFC] hover:bg-white rounded-2xl p-4 border border-[#DCE4EE] border-b-4 ${sec.bottomBar} hover:shadow-md transition-all flex items-start gap-3.5`}
                                        >
                                            <div
                                                className={`w-11 h-11 rounded-xl border ${sec.iconBg} flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform`}
                                            >
                                                <Icon />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-extrabold text-[#0F2942] font-heading group-hover:text-[#0072CE] transition-colors">
                                                    {sec.nome}
                                                </h3>
                                                <p className="text-[11px] text-[#526B84] leading-snug mt-0.5 line-clamp-2">
                                                    {sec.desc}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#526B84]">
                            <span>
                                Horário de funcionamento das Secretarias: <strong>{MUNICIPIO.horario}</strong>
                            </span>
                            <Link
                                href="/a-prefeitura/estrutura"
                                className="font-extrabold text-[#0072CE] hover:underline"
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
