import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MUNICIPIO } from "@/config/municipio";
import { 
    FaArrowRight, 
    FaComments,
    FaHandshake,
    FaScaleBalanced,
    FaDatabase,
    FaCircleInfo
} from "react-icons/fa6";
import { 
    HiMagnifyingGlass, 
    HiOutlineDocumentText, 
    HiOutlineUser, 
    HiOutlineCreditCard 
} from "react-icons/hi2";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: `${MUNICIPIO.nomeCompleto} – ${MUNICIPIO.uf} | Página Inicial`,
    description: `Site oficial da ${MUNICIPIO.nomeCompleto} – ${MUNICIPIO.uf}. Transparência, serviços ao cidadão, notícias e informações institucionais.`,
};

export default async function Home() {
    let noticias: Array<{
        id: string;
        titulo: string;
        categoria: string;
        imagem: string;
        slug: string;
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
                categoria: n.secretaria?.nome ? n.secretaria.nome.split(" ")[0].toUpperCase() : (idx === 0 ? "SERVIÇOS" : idx === 1 ? "EDUCAÇÃO" : "CIDADE"),
                imagem: n.imagem || (idx === 0 ? "/images/historia-panoramica.jpg" : idx === 1 ? "/images/hero-slider-2.jpg" : "/images/hero-bg.jpg"),
                slug: n.slug,
            }));
        }
    } catch {
        // fallback
    }

    if (noticias.length === 0) {
        noticias = [
            {
                id: "1",
                titulo: "Serviços mais perto da população",
                categoria: "SERVIÇOS",
                imagem: "/images/historia-panoramica.jpg",
                slug: "servicos-mais-perto-da-populacao",
            },
            {
                id: "2",
                titulo: "Educação em movimento",
                categoria: "EDUCAÇÃO",
                imagem: "/images/hero-slider-2.jpg",
                slug: "educacao-em-movimento",
            },
            {
                id: "3",
                titulo: "Cuidado com a nossa cidade",
                categoria: "CIDADE",
                imagem: "/images/hero-bg.jpg",
                slug: "cuidado-com-a-nossa-cidade",
            },
        ];
    }

    return (
        <div className="space-y-12 sm:space-y-14 pb-16">
            {/* 1. SEÇÃO PRINCIPAL (HERO) */}
            <section className="bg-white border-b border-[#DDE3EA] pt-6 pb-12 sm:pt-10 sm:pb-16 relative overflow-hidden">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        {/* Lado Esquerdo: Textos e Busca */}
                        <div className="lg:col-span-6 space-y-4 text-left">
                            <span className="block text-xs sm:text-sm font-extrabold text-[#1254A3] uppercase tracking-wider">
                                PREFEITURA MAIS PERTO DE VOCÊ
                            </span>

                            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#0F172A] font-heading tracking-tight leading-[1.08]">
                                Sua cidade.<br />
                                Mais perto de você.
                            </h1>

                            <div className="h-1.5 w-16 bg-[#F39A32] rounded-full" />

                            <p className="text-sm sm:text-base text-[#475569] font-medium leading-relaxed max-w-xl">
                                Serviços, informação e transparência em um só lugar.
                            </p>

                            {/* Campo de Busca Principal */}
                            <form
                                id="busca"
                                action="/transparencia"
                                method="GET"
                                className="bg-white p-1.5 rounded-[10px] border border-[#CBD5E1] flex items-center shadow-sm max-w-md focus-within:border-[#1254A3] focus-within:ring-2 focus-within:ring-[#1254A3]/20 transition-all mt-6"
                            >
                                <div className="flex-1 flex items-center pl-3 pr-2 gap-2.5">
                                    <HiMagnifyingGlass className="text-slate-400 text-xl shrink-0" />
                                    <input
                                        type="text"
                                        name="q"
                                        placeholder="O que você procura?"
                                        className="w-full bg-transparent text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none py-1.5"
                                        aria-label="Buscar no portal"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-[#1254A3] hover:bg-[#0d4282] text-white text-sm font-bold px-6 py-2.5 rounded-[8px] transition-colors shrink-0 shadow-sm"
                                >
                                    Buscar
                                </button>
                            </form>
                        </div>

                        {/* Lado Direito: Vídeo Oficial com Curva Característica e Botão Acesso à Informação */}
                        <div className="lg:col-span-6 relative">
                            <div className="relative rounded-[20px] rounded-tl-[80px] sm:rounded-tl-[100px] overflow-hidden shadow-lg border border-[#E2E8F0] aspect-[16/11] sm:aspect-[16/10] bg-slate-900 group">
                                <video
                                    src="/video_lajes_pintadas.mp4"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    poster="/images/historia-panoramica.jpg"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />

                                {/* Botão Flutuante Inferior Direito: Acesso à informação */}
                                <Link
                                    href="/servicos/esic"
                                    className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md hover:bg-white text-[#0F172A] px-4 py-2.5 rounded-[12px] shadow-lg flex items-center gap-2 border border-slate-100 transition-all hover:scale-105 group/btn"
                                >
                                    <FaCircleInfo className="text-base text-[#0F172A]" />
                                    <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                                        Acesso à informação
                                    </span>
                                    <FaArrowRight className="text-xs text-[#0F172A] group-hover/btn:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. SEIS ATALHOS PRINCIPAIS */}
            <section className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="bg-[#EDF5FD] rounded-[20px] p-5 sm:p-7 border border-[#E2EEFC]">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 text-center">
                        {/* 1. Transparência */}
                        <Link
                            href="/transparencia"
                            className="flex flex-col items-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1254A3] rounded-[12px] p-2 transition-transform hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#D7E9FB] group-hover:bg-[#1254A3] text-[#1254A3] group-hover:text-white flex items-center justify-center text-2xl transition-all duration-300 shadow-sm mb-2.5">
                                <HiMagnifyingGlass />
                            </div>
                            <span className="text-sm sm:text-base font-bold text-[#0F172A] font-heading group-hover:text-[#1254A3] transition-colors leading-tight">
                                Transparência
                            </span>
                        </Link>

                        {/* 2. e-SIC */}
                        <Link
                            href="/servicos/esic"
                            className="flex flex-col items-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1254A3] rounded-[12px] p-2 transition-transform hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#D7E9FB] group-hover:bg-[#1254A3] text-[#1254A3] group-hover:text-white flex items-center justify-center text-2xl transition-all duration-300 shadow-sm mb-2.5">
                                <FaCircleInfo />
                            </div>
                            <span className="text-sm sm:text-base font-bold text-[#0F172A] font-heading group-hover:text-[#1254A3] transition-colors leading-tight">
                                e-SIC
                            </span>
                        </Link>

                        {/* 3. Ouvidoria */}
                        <Link
                            href="/servicos/ouvidoria"
                            className="flex flex-col items-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1254A3] rounded-[12px] p-2 transition-transform hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#D7E9FB] group-hover:bg-[#1254A3] text-[#1254A3] group-hover:text-white flex items-center justify-center text-2xl transition-all duration-300 shadow-sm mb-2.5">
                                <FaComments />
                            </div>
                            <span className="text-sm sm:text-base font-bold text-[#0F172A] font-heading group-hover:text-[#1254A3] transition-colors leading-tight">
                                Ouvidoria
                            </span>
                        </Link>

                        {/* 4. Diário Oficial */}
                        <Link
                            href="/transparencia/licitacoes"
                            className="flex flex-col items-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1254A3] rounded-[12px] p-2 transition-transform hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#D7E9FB] group-hover:bg-[#1254A3] text-[#1254A3] group-hover:text-white flex items-center justify-center text-2xl transition-all duration-300 shadow-sm mb-2.5">
                                <HiOutlineDocumentText />
                            </div>
                            <span className="text-sm sm:text-base font-bold text-[#0F172A] font-heading group-hover:text-[#1254A3] transition-colors leading-tight">
                                Diário Oficial
                            </span>
                        </Link>

                        {/* 5. Contribuinte */}
                        <Link
                            href="/servicos/tributario"
                            className="flex flex-col items-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1254A3] rounded-[12px] p-2 transition-transform hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#D7E9FB] group-hover:bg-[#1254A3] text-[#1254A3] group-hover:text-white flex items-center justify-center text-2xl transition-all duration-300 shadow-sm mb-2.5">
                                <HiOutlineUser />
                            </div>
                            <span className="text-sm sm:text-base font-bold text-[#0F172A] font-heading group-hover:text-[#1254A3] transition-colors leading-tight">
                                Contribuinte
                            </span>
                        </Link>

                        {/* 6. Contracheque */}
                        <Link
                            href="/servicos/contracheque"
                            className="flex flex-col items-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1254A3] rounded-[12px] p-2 transition-transform hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#D7E9FB] group-hover:bg-[#1254A3] text-[#1254A3] group-hover:text-white flex items-center justify-center text-2xl transition-all duration-300 shadow-sm mb-2.5">
                                <HiOutlineCreditCard />
                            </div>
                            <span className="text-sm sm:text-base font-bold text-[#0F172A] font-heading group-hover:text-[#1254A3] transition-colors leading-tight">
                                Contracheque
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. ACONTECE EM LAJES PINTADAS */}
            <section className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] font-heading tracking-tight leading-tight">
                            Acontece em Lajes Pintadas
                        </h2>
                        <div className="h-1 w-14 bg-[#F39A32] rounded-full mt-1.5" />
                    </div>

                    <Link
                        href="/noticias"
                        className="text-xs sm:text-sm font-bold text-[#1254A3] hover:underline flex items-center gap-1.5"
                    >
                        <span>Todas as notícias</span>
                        <FaArrowRight size={11} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {noticias.map((item) => (
                        <article
                            key={item.id}
                            className="bg-white rounded-[16px] border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                        >
                            <Link href={`/noticias/${item.slug}`} className="block overflow-hidden aspect-[16/10]">
                                <img
                                    src={item.imagem}
                                    alt={item.titulo}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </Link>

                            <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-start">
                                <span className="inline-block bg-[#E0EEFF] text-[#1254A3] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider w-fit">
                                    {item.categoria}
                                </span>

                                <h3 className="text-base sm:text-lg font-black text-[#0F172A] font-heading leading-snug group-hover:text-[#1254A3] transition-colors">
                                    <Link href={`/noticias/${item.slug}`}>
                                        {item.titulo}
                                    </Link>
                                </h3>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* 4. PUBLICAÇÕES OFICIAIS */}
            <section className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="mb-5">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] font-heading tracking-tight leading-tight">
                        Publicações oficiais
                    </h2>
                    <div className="h-1 w-14 bg-[#F39A32] rounded-full mt-1.5" />
                </div>

                <div className="bg-[#EDF5FD] rounded-[20px] p-4 sm:p-5 border border-[#E2EEFC]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {/* Licitações */}
                        <Link
                            href="/transparencia/licitacoes"
                            className="bg-white rounded-[12px] p-4 border border-[#BFDBFE] hover:border-[#1254A3] hover:shadow-sm transition-all flex items-center justify-between group cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <HiOutlineDocumentText className="text-xl text-[#1254A3]" />
                                <span className="text-sm sm:text-base font-bold text-[#0F172A] font-heading group-hover:text-[#1254A3] transition-colors">
                                    Licitações
                                </span>
                            </div>
                            <FaArrowRight className="text-[#1254A3] text-sm group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {/* Contratos */}
                        <Link
                            href="/transparencia/contratos"
                            className="bg-white rounded-[12px] p-4 border border-[#BFDBFE] hover:border-[#1254A3] hover:shadow-sm transition-all flex items-center justify-between group cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <FaHandshake className="text-xl text-[#1254A3]" />
                                <span className="text-sm sm:text-base font-bold text-[#0F172A] font-heading group-hover:text-[#1254A3] transition-colors">
                                    Contratos
                                </span>
                            </div>
                            <FaArrowRight className="text-[#1254A3] text-sm group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {/* Leis e Decretos */}
                        <Link
                            href="/transparencia/legislacao"
                            className="bg-white rounded-[12px] p-4 border border-[#BFDBFE] hover:border-[#1254A3] hover:shadow-sm transition-all flex items-center justify-between group cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <FaScaleBalanced className="text-xl text-[#1254A3]" />
                                <span className="text-sm sm:text-base font-bold text-[#0F172A] font-heading group-hover:text-[#1254A3] transition-colors">
                                    Leis e Decretos
                                </span>
                            </div>
                            <FaArrowRight className="text-[#1254A3] text-sm group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {/* Prestação de Contas */}
                        <Link
                            href="/transparencia/relatorios-fiscais"
                            className="bg-white rounded-[12px] p-4 border border-[#BFDBFE] hover:border-[#1254A3] hover:shadow-sm transition-all flex items-center justify-between group cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <FaDatabase className="text-xl text-[#1254A3]" />
                                <span className="text-sm sm:text-base font-bold text-[#0F172A] font-heading group-hover:text-[#1254A3] transition-colors">
                                    Prestação de Contas
                                </span>
                            </div>
                            <FaArrowRight className="text-[#1254A3] text-sm group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
