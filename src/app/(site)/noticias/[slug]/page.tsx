import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { HiOutlineCalendar, HiOutlineUser } from "react-icons/hi2";

export const dynamic = "force-dynamic";

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

    const dataFormatada = new Date(noticia.publicadoEm || noticia.criadoEm).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <PageHeader
                title="Notícias Municipais"
                subtitle="Fique por dentro de tudo que acontece em Lajes Pintadas"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Notícias", href: "/noticias" },
                    { label: noticia.titulo.slice(0, 30) + "..." }
                ]}
            />
            
            <article className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    {noticia.imagem && (
                        <div className="w-full aspect-video md:h-[450px] overflow-hidden relative">
                            <img 
                                src={noticia.imagem} 
                                alt={noticia.titulo} 
                                className="w-full h-full object-cover"
                            />
                            {noticia.secretaria && (
                                <div className="absolute top-6 left-6">
                                    <span className="bg-[#FDB913] text-[#0088b9] text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg shadow-lg">
                                        {noticia.secretaria.nome}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className="p-8 md:p-12">
                        <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-500 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <HiOutlineCalendar className="w-5 h-5 text-[#01b0ef]" />
                                <time dateTime={noticia.publicadoEm?.toString() || ""}>{dataFormatada}</time>
                            </div>
                            <div className="flex items-center gap-2">
                                <HiOutlineUser className="w-5 h-5 text-[#01b0ef]" />
                                <span>Por Comunicação Institucional</span>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-[#0088b9] leading-tight mb-8 tracking-tighter">
                            {noticia.titulo}
                        </h1>

                        <p className="text-xl text-gray-600 font-medium leading-relaxed mb-10 border-l-4 border-[#01b0ef] pl-6 italic">
                            {noticia.resumo}
                        </p>

                        <div 
                            className="prose prose-lg prose-blue max-w-none text-gray-700
                            prose-headings:font-black prose-headings:text-[#0088b9] prose-headings:tracking-tighter
                            prose-a:text-[#01b0ef] hover:prose-a:text-[#0088b9] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-2xl prose-img:shadow-lg
                            prose-p:leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
                        />
                    </div>
                </div>
            </article>
        </main>
    );
}
