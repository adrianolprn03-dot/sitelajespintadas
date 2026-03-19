"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaClock, FaArrowRight, FaSpinner } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";



type Noticia = {
    id: string;
    titulo: string;
    slug: string;
    resumo: string;
    publicadoEm: string;
    imagem?: string;
    secretaria?: { nome: string };
};

const categoriaCores: Record<string, string> = {
    Obras: "bg-orange-100 text-orange-700", Saúde: "bg-green-100 text-green-700",
    Educação: "bg-blue-100 text-blue-700", Social: "bg-purple-100 text-purple-700",
    Infraestrutura: "bg-gray-100 text-gray-700", Concursos: "bg-red-100 text-red-700",
    Gestão: "bg-primary-100 text-primary-700",
};

function formatarData(dataStr: string) {
    return new Date(dataStr + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function NoticiasPage() {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNoticias = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/noticias?publicada=true&limit=12");
                const data = await res.json();
                setNoticias(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar notícias:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNoticias();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Notícias Municipais"
                subtitle="Fique por dentro de tudo que acontece em Lajes Pintadas"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Notícias" }
                ]}
            />

            <div className="max-w-[1200px] mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#01b0ef] border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-[#0088b9] font-black uppercase tracking-widest text-xs">Carregando notícias...</p>
                    </div>
                ) : noticias.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                        <span className="text-6xl mb-4 block">📭</span>
                        <h2 className="text-xl font-black text-[#0088b9] mb-2 uppercase">Nenhuma notícia encontrada</h2>
                        <p className="text-gray-500 text-sm">Volte mais tarde para conferir as novidades da nossa cidade.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {noticias.map((n) => (
                            <article key={n.id} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-2 border border-white hover:border-blue-100 overflow-hidden flex flex-col group">
                                <Link href={`/noticias/${n.slug}`} className="block overflow-hidden h-48 relative">
                                    {n.imagem ? (
                                        <img src={n.imagem} alt={n.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#01b0ef] to-[#0088b9] flex items-center justify-center">
                                            <span className="text-white/20 text-6xl font-black">?</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-[#FDB913] text-[#0088b9] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                                            {n.secretaria?.nome || "Notícia"}
                                        </span>
                                    </div>
                                </Link>
                                <div className="p-7 flex flex-col flex-1">
                                    <div className="flex items-center gap-3 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                                        <span className="w-6 h-[2px] bg-[#01b0ef]" />
                                        <time dateTime={n.publicadoEm}>{formatarData(n.publicadoEm)}</time>
                                    </div>
                                    <h2 className="font-black text-[#0088b9] text-lg leading-tight mb-4 line-clamp-2 group-hover:text-[#01b0ef] transition-colors">
                                        <Link href={`/noticias/${n.slug}`}>{n.titulo}</Link>
                                    </h2>
                                    <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3 font-medium">{n.resumo}</p>
                                    <Link
                                        href={`/noticias/${n.slug}`}
                                        className="mt-6 flex items-center gap-2 text-[#01b0ef] font-black text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all"
                                    >
                                        Ler notícia completa <span className="text-lg">→</span>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
