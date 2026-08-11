import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import NewsShareButtons from "@/components/noticias/NewsShareButtons";
import { HiOutlineCalendar, HiOutlineUser, HiOutlineClock } from "react-icons/hi2";
import { FaArrowLeft } from "react-icons/fa";
import { MUNICIPIO } from "@/config/municipio";

export const dynamic = "force-dynamic";

function calcularTempoLeitura(conteudo?: string, resumo?: string): string {
    const text = (resumo || "") + " " + (conteudo || "").replace(/<[^>]*>/g, "");
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    return `${minutes} min de leitura`;
}

export default function NoticiaPage({ params }: { params: { slug: string } }) {
    return <NoticiaLoader slug={params.slug} />;
}

async function NoticiaLoader({ slug }: { slug: string }) {
    const noticia = await prisma.noticia.findUnique({
        where: { slug },
        include: { secretaria: true },
    });

    if (!noticia || !noticia.publicada) {
        notFound();
    }

    // Buscar matérias recomendadas (excluindo a atual)
    const recomendadas = await prisma.noticia.findMany({
        where: {
            publicada: true,
            NOT: { id: noticia.id },
        },
        orderBy: [
            { publicadoEm: "desc" },
            { criadoEm: "desc" }
        ],
        take: 3,
        include: { secretaria: { select: { nome: true } } },
    });

    const dataFormatada = new Date(noticia.publicadoEm || noticia.criadoEm).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    const tempoLeitura = calcularTempoLeitura(noticia.conteudo, noticia.resumo);

    return (
        <main className="min-h-screen bg-[#F8FAFC] pb-24">
            <PageHeader
                title="Notícias Municipais"
                subtitle={`Fique por dentro de tudo que acontece em ${MUNICIPIO.nome}`}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Notícias", href: "/noticias" },
                    { label: noticia.titulo.slice(0, 30) + "..." }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 -mt-10 relative z-20">
                {/* Botão de Voltar */}
                <div className="mb-6">
                    <Link
                        href="/noticias"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-gray-700 hover:text-[#0088b9] text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-gray-100"
                    >
                        <FaArrowLeft className="w-3 h-3" /> Voltar para notícias
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* ARTIGO PRINCIPAL (8 COLS) */}
                    <article className="lg:col-span-8 flex flex-col gap-6">
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                            {/* Imagem de Capa */}
                            {noticia.imagem && (
                                <div className="w-full aspect-video md:h-[480px] overflow-hidden relative bg-gray-100">
                                    <img
                                        src={noticia.imagem}
                                        alt={noticia.titulo}
                                        className="w-full h-full object-cover"
                                    />
                                    {noticia.secretaria && (
                                        <div className="absolute top-6 left-6">
                                            <span className="bg-[#FDB913] text-[#002241] text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg">
                                                {noticia.secretaria.nome}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="p-6 md:p-12">
                                {/* Metadata Header */}
                                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-100">
                                    <div className="flex flex-wrap items-center gap-4 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                        <div className="flex items-center gap-1.5">
                                            <HiOutlineCalendar className="w-4 h-4 text-[#01b0ef]" />
                                            <time dateTime={noticia.publicadoEm?.toString() || ""}>{dataFormatada}</time>
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center gap-1.5">
                                            <HiOutlineClock className="w-4 h-4 text-[#FDB913]" />
                                            <span>{tempoLeitura}</span>
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center gap-1.5">
                                            <HiOutlineUser className="w-4 h-4 text-[#01b0ef]" />
                                            <span>Comunicação Institucional</span>
                                        </div>
                                    </div>

                                    {/* Compartilhamento Topo */}
                                    <NewsShareButtons title={noticia.titulo} />
                                </div>

                                {/* Título */}
                                <h1 className="text-3xl md:text-5xl font-black text-[#002241] leading-tight mb-8 tracking-tight">
                                    {noticia.titulo}
                                </h1>

                                {/* Resumo Destaque */}
                                {noticia.resumo && (
                                    <div className="text-lg md:text-xl text-gray-700 font-semibold leading-relaxed mb-10 border-l-4 border-[#01b0ef] pl-6 py-2 bg-blue-50/50 rounded-r-2xl italic">
                                        {noticia.resumo}
                                    </div>
                                )}

                                {/* Conteúdo HTML */}
                                <div
                                    className="prose prose-lg prose-blue max-w-none text-gray-700
                                    prose-headings:font-black prose-headings:text-[#002241] prose-headings:tracking-tight
                                    prose-a:text-[#01b0ef] hover:prose-a:text-[#0088b9] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                                    prose-img:rounded-3xl prose-img:shadow-xl prose-img:my-8
                                    prose-p:leading-relaxed prose-p:mb-6"
                                    dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
                                />

                                {/* Compartilhamento Rodapé */}
                                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <span className="text-xs font-black uppercase text-gray-400 tracking-wider">
                                        Gostou desta matéria? Compartilhe com seus amigos!
                                    </span>
                                    <NewsShareButtons title={noticia.titulo} />
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* BARRA LATERAL DA NOTÍCIA (4 COLS) */}
                    <aside className="lg:col-span-4 flex flex-col gap-8">
                        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-28">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <span className="w-2 h-6 bg-[#0088b9] rounded-full" />
                                <h3 className="text-base font-black text-[#002241] uppercase tracking-tight">
                                    Mais Notícias Recentes
                                </h3>
                            </div>

                            <div className="flex flex-col gap-4">
                                {recomendadas.map((rec) => (
                                    <Link
                                        key={rec.id}
                                        href={`/noticias/${rec.slug}`}
                                        className="group flex gap-3 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                                    >
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
                                            {rec.imagem ? (
                                                <img
                                                    src={rec.imagem}
                                                    alt={rec.titulo}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-[#0088b9]/10 flex items-center justify-center text-xs font-black text-[#0088b9]">
                                                    N
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[9px] font-bold text-[#01b0ef] uppercase tracking-wider block mb-1">
                                                {rec.secretaria?.nome || "Notícia"}
                                            </span>
                                            <h4 className="text-xs font-black text-[#002241] leading-snug group-hover:text-[#01b0ef] transition-colors line-clamp-2">
                                                {rec.titulo}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <Link
                                href="/noticias"
                                className="mt-6 w-full py-3 bg-gray-50 hover:bg-gray-100 text-[#0088b9] text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-200"
                            >
                                Ver todas as notícias →
                            </Link>
                        </div>
                    </aside>
                </div>

                {/* SEÇÃO FINAL: RECOMENDADAS / VEJA TAMBÉM */}
                {recomendadas.length > 0 && (
                    <section className="mt-16 pt-12 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-[#002241] uppercase tracking-tight flex items-center gap-3">
                                <span className="w-2.5 h-7 bg-[#FDB913] rounded-full" />
                                Leia Também
                            </h2>
                            <Link
                                href="/noticias"
                                className="text-xs font-black text-[#0088b9] hover:text-[#01b0ef] uppercase tracking-widest transition-colors"
                            >
                                Ver mais matérias →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recomendadas.map((rec) => (
                                <Link
                                    key={rec.id}
                                    href={`/noticias/${rec.slug}`}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col"
                                >
                                    <div className="h-44 overflow-hidden relative bg-gray-100">
                                        {rec.imagem ? (
                                            <img
                                                src={rec.imagem}
                                                alt={rec.titulo}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#0088b9] to-[#002241]" />
                                        )}
                                        {rec.secretaria && (
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-[#FDB913] text-[#002241] text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                                                    {rec.secretaria.nome}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-black text-[#002241] text-sm leading-snug line-clamp-2 group-hover:text-[#01b0ef] transition-colors mb-2">
                                            {rec.titulo}
                                        </h3>
                                        <p className="text-gray-500 text-xs line-clamp-2 font-medium flex-1">
                                            {rec.resumo}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
