import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MUNICIPIO } from "@/config/municipio";
import HeroPanoramicoModelo3 from "@/components/home/HeroPanoramicoModelo3";
import {
    FaArrowRight,
    FaArrowUpRightFromSquare,
    FaHandshake,
    FaScaleBalanced,
    FaDatabase,
    FaChartPie,
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

    const getLinkOverride = (identifiers: string[], fallbackHref: string) => {
        const found = linksExternos.find((l) =>
            l.moduloAlvo && identifiers.some((id) => id.toLowerCase() === l.moduloAlvo?.toLowerCase())
        );
        return {
            href: found ? found.url : fallbackHref,
            isExternal: !!found,
        };
    };

    const licitacoesLink = getLinkOverride(["home-licitacoes", "licitacoes"], "/transparencia/licitacoes");
    const contratosLink = getLinkOverride(["home-contratos", "contratos"], "/transparencia/contratos");
    const leisLink = getLinkOverride(["home-leis-decretos", "legislacao", "leis"], "/transparencia/legislacao");
    const lrfLink = getLinkOverride(["home-prestacao-contas", "lrf", "prestacao-contas"], "/transparencia/lrf");

    if (noticias.length === 0) {
        noticias = [
            {
                id: "1",
                titulo: "Serviços públicos digitais mais perto da população de Lajes Pintadas",
                resumo:
                    "Portal institucional modernizado amplia o acesso rápido à Ouvidoria, e-SIC, Carta de Serviços e Transparência Ativa.",
                categoria: "GOVERNO DIGITAL",
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
                categoria: "GESTÃO MUNICIPAL",
                imagem: "/images/hero-bg.jpg",
                slug: "cuidado-com-a-nossa-cidade",
                dataFormatada: "Gestão Municipal",
            },
        ];
    }

    return (
        <div className="space-y-12 sm:space-y-16 pb-20">
            {/* 1 e 2: Banner Panorâmico com Vídeo Oficial + Acesso Rápido Unificado em Azul e Amarelo */}
            <HeroPanoramicoModelo3 />

            {/* =====================================================================
                3. ACONTECE EM LAJES PINTADAS (MURAL OFICIAL DE NOTÍCIAS)
               ===================================================================== */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
                    <div>
                        <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-[#1254A3] mb-1">
                            MURAL OFICIAL DA GESTÃO
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#12304A] font-heading tracking-tight leading-tight">
                            Acontece em {MUNICIPIO.nome}
                        </h2>
                        <div className="h-1.5 w-20 bg-[#F39A32] rounded-full mt-2" />
                    </div>

                    <Link
                        href="/noticias"
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#1254A3] hover:text-[#0d4282] bg-blue-50/70 hover:bg-blue-100/70 px-4 py-2 rounded-full border border-blue-200/70 transition-colors w-fit"
                    >
                        <span>Ver todas as notícias</span>
                        <FaArrowRight size={11} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {noticias.map((item) => (
                        <article
                            key={item.id}
                            className="bg-white rounded-2xl border border-[#DDE3EA] hover:border-[#1254A3] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col hover:-translate-y-0.5"
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
                                    <span className="inline-block bg-[#1254A3] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                        {item.categoria}
                                    </span>
                                </div>
                            </Link>

                            <div className="p-5 sm:p-6 space-y-2.5 flex-1 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <span className="block text-[11px] font-semibold text-[#5B738B]">
                                        {item.dataFormatada}
                                    </span>
                                    <h3 className="text-base sm:text-lg font-extrabold text-[#12304A] font-heading leading-snug group-hover:text-[#1254A3] transition-colors line-clamp-2">
                                        <Link href={`/noticias/${item.slug}`}>{item.titulo}</Link>
                                    </h3>
                                    <p className="text-xs text-[#5B738B] leading-relaxed line-clamp-2">
                                        {item.resumo}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1254A3]">
                                    <Link href={`/noticias/${item.slug}`} className="flex items-center gap-1.5 hover:underline">
                                        <span>Ler matéria completa</span>
                                        <FaArrowRight
                                            size={11}
                                            className="group-hover:translate-x-1 transition-transform"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* =====================================================================
                4. PUBLICAÇÕES OFICIAIS (DESIGN SYSTEM CONFORME PRANCHA APROVADA)
               ===================================================================== */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
                    <div>
                        <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-[#1254A3] mb-1">
                            PUBLICIDADE E TRANSPARÊNCIA ATIVA
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#12304A] font-heading tracking-tight">
                            Publicações Oficiais
                        </h2>
                        <div className="h-1.5 w-20 bg-[#F39A32] rounded-full mt-2" />
                    </div>

                    <Link
                        href="/transparencia"
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#1254A3] hover:text-[#0d4282] bg-blue-50/70 hover:bg-blue-100/70 px-4 py-2 rounded-full border border-blue-200/70 transition-colors w-fit"
                    >
                        <span>Acessar Portal da Transparência</span>
                        <FaArrowRight size={11} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* 1. Licitações */}
                    <Link
                        href={licitacoesLink.href}
                        target={licitacoesLink.isExternal ? "_blank" : undefined}
                        rel={licitacoesLink.isExternal ? "noopener noreferrer" : undefined}
                        className="bg-white p-6 rounded-2xl border border-[#DDE3EA] hover:border-[#1254A3] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group text-left"
                    >
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1254A3] flex items-center justify-center text-xl group-hover:bg-[#1254A3] group-hover:text-white transition-colors">
                                    <HiOutlineDocumentText />
                                </div>
                                <span className="text-[10px] font-bold text-[#1254A3] bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-200/60">
                                    {licitacoesLink.isExternal ? "Link Externo" : "PNCP Integrado"}
                                </span>
                            </div>

                            <h3 className="text-base font-extrabold text-[#12304A] font-heading leading-tight mb-2 group-hover:text-[#1254A3] transition-colors">
                                Licitações Públicas
                            </h3>

                            <p className="text-xs text-[#5B738B] leading-relaxed mb-4">
                                Editais, atas de registro de preços, dispensas e fases em tempo real.
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1254A3] pt-3 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                            <span>{licitacoesLink.isExternal ? "Acessar portal externo" : "Acessar licitações"}</span>
                            {licitacoesLink.isExternal ? <FaArrowUpRightFromSquare size={10} /> : <FaArrowRight size={10} />}
                        </div>
                    </Link>

                    {/* 2. Contratos */}
                    <Link
                        href={contratosLink.href}
                        target={contratosLink.isExternal ? "_blank" : undefined}
                        rel={contratosLink.isExternal ? "noopener noreferrer" : undefined}
                        className="bg-white p-6 rounded-2xl border border-[#DDE3EA] hover:border-[#1254A3] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group text-left"
                    >
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1254A3] flex items-center justify-center text-xl group-hover:bg-[#1254A3] group-hover:text-white transition-colors">
                                    <FaHandshake />
                                </div>
                                <span className="text-[10px] font-bold text-[#1254A3] bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-200/60">
                                    {contratosLink.isExternal ? "Link Externo" : "Atualizado"}
                                </span>
                            </div>

                            <h3 className="text-base font-extrabold text-[#12304A] font-heading leading-tight mb-2 group-hover:text-[#1254A3] transition-colors">
                                Contratos Administrativos
                            </h3>

                            <p className="text-xs text-[#5B738B] leading-relaxed mb-4">
                                Instrumentos contratuais integrais, termos aditivos e fiscais.
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1254A3] pt-3 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                            <span>{contratosLink.isExternal ? "Acessar portal externo" : "Acessar contratos"}</span>
                            {contratosLink.isExternal ? <FaArrowUpRightFromSquare size={10} /> : <FaArrowRight size={10} />}
                        </div>
                    </Link>

                    {/* 3. Leis e Decretos */}
                    <Link
                        href={leisLink.href}
                        target={leisLink.isExternal ? "_blank" : undefined}
                        rel={leisLink.isExternal ? "noopener noreferrer" : undefined}
                        className="bg-white p-6 rounded-2xl border border-[#DDE3EA] hover:border-[#1254A3] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group text-left"
                    >
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1254A3] flex items-center justify-center text-xl group-hover:bg-[#1254A3] group-hover:text-white transition-colors">
                                    <FaScaleBalanced />
                                </div>
                                <span className="text-[10px] font-bold text-[#1254A3] bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-200/60">
                                    {leisLink.isExternal ? "Link Externo" : "Pesquisável"}
                                </span>
                            </div>

                            <h3 className="text-base font-extrabold text-[#12304A] font-heading leading-tight mb-2 group-hover:text-[#1254A3] transition-colors">
                                Leis e Decretos
                            </h3>

                            <p className="text-xs text-[#5B738B] leading-relaxed mb-4">
                                Legislação municipal consolidada, decretos e portarias normativas.
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1254A3] pt-3 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                            <span>{leisLink.isExternal ? "Acessar portal externo" : "Acessar legislação"}</span>
                            {leisLink.isExternal ? <FaArrowUpRightFromSquare size={10} /> : <FaArrowRight size={10} />}
                        </div>
                    </Link>

                    {/* 4. Prestação de Contas */}
                    <Link
                        href={lrfLink.href}
                        target={lrfLink.isExternal ? "_blank" : undefined}
                        rel={lrfLink.isExternal ? "noopener noreferrer" : undefined}
                        className="bg-white p-6 rounded-2xl border border-[#DDE3EA] hover:border-[#1254A3] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group text-left"
                    >
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1254A3] flex items-center justify-center text-xl group-hover:bg-[#1254A3] group-hover:text-white transition-colors">
                                    <FaChartPie />
                                </div>
                                <span className="text-[10px] font-bold text-[#1254A3] bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-200/60">
                                    {lrfLink.isExternal ? "Link Externo" : "LRF / SICONFI"}
                                </span>
                            </div>

                            <h3 className="text-base font-extrabold text-[#12304A] font-heading leading-tight mb-2 group-hover:text-[#1254A3] transition-colors">
                                Prestação de Contas (LRF)
                            </h3>

                            <p className="text-xs text-[#5B738B] leading-relaxed mb-4">
                                Relatórios RGF, RREO, Balanço Geral, PPA, LDO e LOA abertos.
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1254A3] pt-3 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                            <span>{lrfLink.isExternal ? "Acessar demonstrativos externos" : "Acessar demonstrativos"}</span>
                            {lrfLink.isExternal ? <FaArrowUpRightFromSquare size={10} /> : <FaArrowRight size={10} />}
                        </div>
                    </Link>
                </div>
            </section>

            {/* =====================================================================
                5. NOSSA TERRA, SÍMBOLOS OFICIAIS & SECRETARIAS MUNICIPAIS (AZUL E AMARELO)
               ===================================================================== */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Card Esquerdo (5 colunas): Identidade e Símbolos de Lajes Pintadas */}
                    <div className="lg:col-span-5 bg-white rounded-[26px] border border-[#DCE4EE] p-6 sm:p-8 shadow-gov flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1.5 heraldic-stripe" />

                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0072CE] bg-[#F0F7FF] border border-[#DCE4EE] px-3 py-1 rounded-full">
                                <FaFlag size={12} />
                                <span>Identidade Laje-Pintadense</span>
                            </div>

                            <h2 className="text-2xl font-black text-[#0F2942] font-heading tracking-tight leading-snug">
                                Nossa Terra, Nossa História e Símbolos Oficiais
                            </h2>

                            <p className="text-xs sm:text-sm text-[#526B84] leading-relaxed">
                                Batizada pelas históricas inscrições rupestres em suas lajes de pedra e marcada pela força da serra e da sua gente, {MUNICIPIO.nome}/{MUNICIPIO.uf} celebra sua história desde {MUNICIPIO.estatisticas.fundacao}.
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
                                    <span className="text-[10px] text-[#526B84]">Símbolo Cívico</span>
                                </div>
                            </div>

                            {/* Estatísticas Rápidas em Azul e Amarelo */}
                            <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
                                <div className="bg-[#F8FAFC] rounded-xl p-2.5 border border-[#DCE4EE]">
                                    <span className="block text-sm sm:text-base font-black text-[#0072CE]">
                                        {MUNICIPIO.estatisticas.fundacao}
                                    </span>
                                    <span className="block text-[10px] font-bold text-[#526B84] uppercase">
                                        Emancipação
                                    </span>
                                </div>
                                <div className="bg-[#F8FAFC] rounded-xl p-2.5 border border-[#DCE4EE]">
                                    <span className="block text-sm sm:text-base font-black text-[#0072CE]">
                                        {MUNICIPIO.estatisticas.area}
                                    </span>
                                    <span className="block text-[10px] font-bold text-[#526B84] uppercase">
                                        Território
                                    </span>
                                </div>
                                <div className="bg-[#F8FAFC] rounded-xl p-2.5 border border-[#DCE4EE]">
                                    <span className="block text-sm sm:text-base font-black text-[#0072CE]">
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
                                className="text-xs font-extrabold text-[#0072CE] hover:underline flex items-center gap-1.5"
                            >
                                <span>Ver Símbolos e Hino →</span>
                            </Link>
                        </div>
                    </div>

                    {/* Coluna Direita (7 colunas): Secretarias Municipais Unificadas em Azul e Amarelo */}
                    <div className="lg:col-span-7 bg-white rounded-[26px] border border-[#DCE4EE] p-6 sm:p-8 shadow-gov flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <div>
                                    <span className="block text-xs font-extrabold uppercase tracking-wider text-[#0072CE]">
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
                                            className="group bg-[#F8FAFC] hover:bg-white rounded-2xl p-4 border border-[#DCE4EE] border-b-4 border-b-[#0072CE] hover:border-b-[#FACC15] hover:shadow-md transition-all flex items-start gap-3.5"
                                        >
                                            <div className="w-11 h-11 rounded-xl bg-[#F0F7FF] text-[#0072CE] border border-[#DCE4EE] group-hover:bg-[#0072CE] group-hover:text-[#FACC15] group-hover:border-[#0072CE] flex items-center justify-center text-lg shrink-0 transition-all">
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
