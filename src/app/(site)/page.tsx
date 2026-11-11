import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MUNICIPIO } from "@/config/municipio";
import { 
    FaShieldHalved, 
    FaFileLines, 
    FaBullhorn, 
    FaBookOpen, 
    FaReceipt, 
    FaIdCard, 
    FaArrowRight, 
    FaCalendarDays, 
    FaBuildingColumns, 
    FaGavel, 
    FaFileContract, 
    FaScaleBalanced, 
    FaChartPie 
} from "react-icons/fa6";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import UnidadesAtendimento from "@/components/home/UnidadesAtendimento";
import SecretariasSlider from "@/components/home/SecretariasSlider";
import RadarTransparencia from "@/components/home/RadarTransparencia";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: `${MUNICIPIO.nomeCompleto} – ${MUNICIPIO.uf} | Página Inicial`,
    description: `Site oficial da ${MUNICIPIO.nomeCompleto} – ${MUNICIPIO.uf}. Transparência, serviços ao cidadão, notícias e informações institucionais.`,
};

export default async function Home() {
    let noticias: Array<{
        id: string;
        titulo: string;
        resumo: string;
        imagem: string | null;
        publicadoEm: Date | null;
        slug: string;
        secretaria?: { nome: string } | null;
    }> = [];

    try {
        const dbNoticias = await prisma.noticia.findMany({
            where: { publicada: true },
            take: 3,
            orderBy: { publicadoEm: "desc" },
            include: { secretaria: true },
        });
        noticias = dbNoticias;
    } catch {
        // fallback
    }

    if (noticias.length === 0) {
        noticias = [
            {
                id: "1",
                titulo: "Prefeitura de Lajes Pintadas amplia pavimentação e melhorias na infraestrutura urbana e rural",
                resumo: "Obras contemplam vias estratégicas facilitando o tráfego de moradores e o escoamento da produção agrícola local.",
                imagem: "/images/historia-panoramica.jpg",
                publicadoEm: new Date(),
                slug: "pavimentacao-infraestrutura-lajes-pintadas",
                secretaria: { nome: "Obras e Infraestrutura" },
            },
            {
                id: "2",
                titulo: "Secretaria de Saúde promove semana intensiva de exames preventivos e vacinação no município",
                resumo: "Ações itinerantes alcançam comunidades rurais e garantem atendimento médico e odontológico especializado.",
                imagem: "/images/hero-bg.jpg",
                publicadoEm: new Date(Date.now() - 86400000 * 2),
                slug: "acoes-saude-preventiva-lajes-pintadas",
                secretaria: { nome: "Saúde Pública" },
            },
            {
                id: "3",
                titulo: "Educação Municipal distribui kits escolares e reforça merenda balanceada para toda a rede",
                resumo: "Iniciativa assegura suporte aos alunos da rede básica de ensino com cardápio balanceado.",
                imagem: "/images/hero-slider-2.jpg",
                publicadoEm: new Date(Date.now() - 86400000 * 5),
                slug: "distribuicao-kits-escolares-merenda",
                secretaria: { nome: "Educação e Cultura" },
            },
        ];
    }

    const atalhosPrincipais = [
        {
            label: "Portal da Transparência",
            sublabel: "Receitas, despesas e gestão fiscal",
            href: "/transparencia",
            icon: FaShieldHalved,
            destaque: true,
        },
        {
            label: "e-SIC",
            sublabel: "Serviço de Informação ao Cidadão",
            href: "/servicos/esic",
            icon: FaFileLines,
        },
        {
            label: "Ouvidoria",
            sublabel: "Elogios, sugestões e denúncias",
            href: "/servicos/ouvidoria",
            icon: FaBullhorn,
        },
        {
            label: "Diário Oficial",
            sublabel: "Atos administrativos e portarias",
            href: "/transparencia/licitacoes",
            icon: FaBookOpen,
        },
        {
            label: "Contribuinte",
            sublabel: "IPTU, certidões e tributos",
            href: "/servicos/tributario",
            icon: FaReceipt,
        },
        {
            label: "Contracheque",
            sublabel: "Portal do Servidor e holerites",
            href: "/servicos/contracheque",
            icon: FaIdCard,
        },
    ];

    const publicacoesOficiais = [
        {
            titulo: "Licitações Públicas",
            descricao: "Editais, atas de registro de preços, avisos de dispensa e fases de contratação em tempo real.",
            href: "/transparencia/licitacoes",
            icon: FaGavel,
            badge: "PNCP Integrado",
        },
        {
            titulo: "Contratos Administrativos",
            descricao: "Instrumentos contratuais integrais, termos aditivos, vigência e fiscais designados.",
            href: "/transparencia/contratos",
            icon: FaFileContract,
            badge: "Atualizado",
        },
        {
            titulo: "Leis e Decretos",
            descricao: "Legislação municipal consolidada, leis orgânicas, decretos do executivo e portarias.",
            href: "/transparencia/legislacao",
            icon: FaScaleBalanced,
            badge: "Pesquisável OCR",
        },
        {
            titulo: "Prestação de Contas (LRF)",
            descricao: "Relatórios RGF, RREO, Balanço Geral Anual, PPA, LDO e LOA em formatos abertos e editáveis.",
            href: "/transparencia/relatorios-fiscais",
            icon: FaChartPie,
            badge: "SICONFI / LRF",
        },
    ];

    return (
        <div className="space-y-16 pb-16">
            {/* 1. SEÇÃO PRINCIPAL (HERO COM VÍDEO OFICIAL) */}
            <section className="bg-white border-b border-[#DDE3EA] py-10 md:py-16 relative overflow-hidden">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        {/* Lado Esquerdo: Título, Linha de Apoio e Campo de Busca */}
                        <div className="lg:col-span-6 space-y-5 text-left order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-full text-[11px] font-bold text-[#1254A3] uppercase tracking-wider">
                                <span>Poder Executivo de Lajes Pintadas / RN</span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#12304A] font-heading tracking-tight leading-[1.1]">
                                Sua cidade. <br />
                                <span className="text-[#1254A3]">Mais perto de você.</span>
                            </h1>

                            <div className="h-1.5 w-20 bg-[#F39A32] rounded-full" />

                            <p className="text-sm sm:text-base text-[#5B738B] leading-relaxed max-w-xl">
                                Acesse serviços essenciais, consulte receitas e despesas com transparência total e acompanhe o trabalho da gestão municipal com facilidade e rapidez.
                            </p>

                            {/* Campo de Busca Principal */}
                            <form
                                id="busca"
                                action="/transparencia"
                                method="GET"
                                className="bg-[#F5F7FA] p-2 rounded-[10px] border border-[#DDE3EA] flex flex-col sm:flex-row gap-2 shadow-sm focus-within:border-[#1254A3] focus-within:ring-2 focus-within:ring-[#1254A3]/20 transition-all max-w-xl"
                            >
                                <div className="flex-1 flex items-center px-3 gap-3">
                                    <HiOutlineMagnifyingGlass className="text-[#5B738B] text-xl shrink-0" />
                                    <input
                                        type="text"
                                        name="q"
                                        placeholder="O que você procura? (ex: IPTU, edital, licitações...)"
                                        className="w-full bg-transparent text-xs sm:text-sm text-[#12304A] placeholder-[#5B738B] focus:outline-none py-2"
                                        aria-label="Buscar no portal"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-[#1254A3] hover:bg-[#0d4282] text-white text-xs font-bold px-6 py-3 rounded-[8px] transition-colors shrink-0 shadow-sm flex items-center justify-center gap-2"
                                >
                                    <span>Buscar</span>
                                </button>
                            </form>
                        </div>

                        {/* Lado Direito: Vídeo Oficial Amplo com Atalho para Acesso à Informação */}
                        <div className="lg:col-span-6 relative order-2">
                            <div className="relative rounded-[10px] overflow-hidden border border-[#DDE3EA] shadow-md group">
                                <div className="aspect-[16/10] sm:aspect-[16/9] relative w-full bg-slate-900">
                                    <video
                                        src="/video_lajes_pintadas.mp4"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        poster="/images/historia-panoramica.jpg"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Overlay gradiente suave para leitura */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/90 via-[#0B2545]/25 to-transparent pointer-events-none" />
                                </div>

                                {/* Card de Destaque sobreposto: Acesso à Informação */}
                                <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-[10px] border border-white/60 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-[#F39A32]" />
                                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1254A3]">
                                                Lei de Acesso à Informação (LAI)
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-extrabold text-[#12304A] font-heading leading-tight">
                                            Transparência Passiva e e-SIC
                                        </h3>
                                        <p className="text-xs text-[#5B738B] hidden sm:block">
                                            Abra pedidos e consulte protocolos oficiais pelo sistema.
                                        </p>
                                    </div>

                                    <Link
                                        href="/servicos/esic"
                                        className="bg-[#1254A3] hover:bg-[#0d4282] text-white text-xs font-bold px-4 py-2.5 rounded-[8px] transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm"
                                    >
                                        <span>Solicitar Informação</span>
                                        <FaArrowRight size={11} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. SEIS ATALHOS PRINCIPAIS */}
            <section className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {atalhosPrincipais.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`p-4 sm:p-5 rounded-[10px] border transition-all flex flex-col justify-between text-left group hover:-translate-y-1 ${
                                item.destaque
                                    ? "bg-[#1254A3] text-white border-[#1254A3] shadow-md shadow-[#1254A3]/15"
                                    : "bg-white text-[#12304A] border-[#DDE3EA] hover:border-[#1254A3] shadow-sm hover:shadow-md"
                            }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className={`w-10 h-10 rounded-[8px] flex items-center justify-center text-lg ${
                                        item.destaque
                                            ? "bg-white/15 text-amber-300"
                                            : "bg-blue-50 text-[#1254A3] group-hover:bg-[#1254A3] group-hover:text-white transition-colors"
                                    }`}
                                >
                                    <item.icon />
                                </div>
                                <FaArrowRight
                                    size={10}
                                    className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                                        item.destaque ? "text-amber-300" : "text-[#1254A3]"
                                    }`}
                                />
                            </div>

                            <div>
                                <span
                                    className={`block text-xs sm:text-sm font-extrabold font-heading leading-tight mb-1 ${
                                        item.destaque ? "text-white" : "text-[#12304A]"
                                    }`}
                                >
                                    {item.label}
                                </span>
                                <span
                                    className={`block text-[10px] line-clamp-1 ${
                                        item.destaque ? "text-white/80" : "text-[#5B738B]"
                                    }`}
                                >
                                    {item.sublabel}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 3. ACONTECE EM LAJES PINTADAS */}
            <section className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12304A] font-heading tracking-tight leading-tight">
                            Acontece em Lajes Pintadas
                        </h2>
                        <div className="h-1 w-14 bg-[#F39A32] rounded-full mt-2 mb-1" />
                        <p className="text-xs sm:text-sm text-[#5B738B]">
                            Acompanhe as principais ações, entregas e novidades do município em primeira mão.
                        </p>
                    </div>

                    <Link
                        href="/noticias"
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#1254A3] hover:underline shrink-0"
                    >
                        <span>Ver todas as notícias</span>
                        <FaArrowRight size={11} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {noticias.map((item) => (
                        <article
                            key={item.id}
                            className="bg-white rounded-[10px] border border-[#DDE3EA] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                        >
                            <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                                {item.imagem ? (
                                    <img
                                        src={item.imagem}
                                        alt={item.titulo}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#0B2545] flex items-center justify-center text-white/40">
                                        <FaBuildingColumns size={32} />
                                    </div>
                                )}
                                {item.secretaria && (
                                    <span className="absolute top-3 left-3 bg-[#1254A3] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[6px] shadow-sm">
                                        {item.secretaria.nome}
                                    </span>
                                )}
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-[11px] text-[#5B738B]">
                                        <FaCalendarDays size={11} className="text-[#F39A32]" />
                                        <span>
                                            {item.publicadoEm
                                                ? new Date(item.publicadoEm).toLocaleDateString("pt-BR")
                                                : "Recente"}
                                        </span>
                                    </div>

                                    <h3 className="text-sm sm:text-base font-extrabold text-[#12304A] font-heading leading-snug line-clamp-2 group-hover:text-[#1254A3] transition-colors">
                                        <Link href={`/noticias/${item.slug}`}>
                                            {item.titulo}
                                        </Link>
                                    </h3>

                                    <p className="text-xs text-[#5B738B] leading-relaxed line-clamp-3">
                                        {item.resumo}
                                    </p>
                                </div>

                                <div className="pt-2 border-t border-[#DDE3EA]/60">
                                    <Link
                                        href={`/noticias/${item.slug}`}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1254A3] hover:underline"
                                    >
                                        <span>Ler notícia completa</span>
                                        <FaArrowRight size={10} />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* 4. PUBLICAÇÕES OFICIAIS */}
            <section className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12304A] font-heading tracking-tight leading-tight">
                        Publicações Oficiais
                    </h2>
                    <div className="h-1 w-14 bg-[#F39A32] rounded-full mt-2 mb-1" />
                    <p className="text-xs sm:text-sm text-[#5B738B]">
                        Acesso direto aos instrumentos normativos, processos licitatórios e relatórios da Lei de Responsabilidade Fiscal.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {publicacoesOficiais.map((pub) => (
                        <Link
                            key={pub.titulo}
                            href={pub.href}
                            className="bg-white p-6 rounded-[10px] border border-[#DDE3EA] hover:border-[#1254A3] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group text-left hover:-translate-y-1"
                        >
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-[10px] bg-blue-50 text-[#1254A3] flex items-center justify-center text-xl group-hover:bg-[#1254A3] group-hover:text-white transition-colors">
                                        <pub.icon />
                                    </div>
                                    <span className="text-[10px] font-bold text-[#1254A3] bg-blue-50 px-2 py-0.5 rounded-[4px] uppercase tracking-wider">
                                        {pub.badge}
                                    </span>
                                </div>

                                <h3 className="text-base font-extrabold text-[#12304A] font-heading leading-tight mb-2 group-hover:text-[#1254A3] transition-colors">
                                    {pub.titulo}
                                </h3>

                                <p className="text-xs text-[#5B738B] leading-relaxed mb-4">
                                    {pub.descricao}
                                </p>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1254A3] pt-3 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                                <span>Acessar publicações</span>
                                <FaArrowRight size={10} />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 5. RADAR DA TRANSPARÊNCIA E SERVIÇOS COMPLEMENTARES */}
            <RadarTransparencia />
            <UnidadesAtendimento />
            <SecretariasSlider />
        </div>
    );
}
