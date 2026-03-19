"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HiOutlineNewspaper, HiArrowLongRight } from "react-icons/hi2";

type Noticia = {
    id: string;
    titulo: string;
    resumo: string;
    imagem: string | null;
    publicadoEm: string;
    slug: string;
    secretaria?: { nome: string };
};

export default function UltimasNoticias() {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNoticias = async () => {
            try {
                const res = await fetch("/api/noticias?limit=4&publicada=true");
                const data = await res.json();
                setNoticias(data.items || []);
            } catch (error) {
                console.error("Erro ao carregar notícias:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNoticias();
    }, []);

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "short", year: "numeric",
        }).replace(/ de /g, '/');
    };

    if (loading || noticias.length === 0) return null;

    const destaque = noticias[0];
    const laterais = noticias.slice(1);

    return (
        <section className="bg-white py-24 relative overflow-hidden" aria-labelledby="noticias-titulo">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-gray-50/80 to-transparent" />
            
            <div className="max-w-[1240px] mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 text-primary-600">
                                <HiOutlineNewspaper className="w-5 h-5" />
                            </span>
                            <span className="text-primary-600 font-bold text-sm tracking-widest uppercase">
                                Portal de Notícias
                            </span>
                        </div>
                        <h2 id="noticias-titulo" className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                            Acompanhe as <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-tertiary-500">ações da prefeitura</span>
                        </h2>
                    </div>
                    <Link 
                        href="/noticias" 
                        className="group flex items-center gap-3 px-6 py-3 rounded-full bg-gray-50 hover:bg-primary-50 text-gray-700 font-semibold text-sm transition-all border border-gray-100 hover:border-primary-100 hover:text-primary-600"
                    >
                        Ver todas as notícias
                        <HiArrowLongRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    {/* Destaque Principal - Left col */}
                    <div className="lg:col-span-7 xl:col-span-8 flex">
                        <Link 
                            href={`/noticias/${destaque.slug}`} 
                            className="group relative flex flex-col w-full min-h-[500px] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 will-change-transform hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gray-900/60 z-10 transition-opacity group-hover:bg-gray-900/40" />
                            {destaque.imagem ? (
                                <img 
                                    src={destaque.imagem} 
                                    alt={destaque.titulo} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-tertiary-700" />
                            )}
                            
                            <div className="relative z-20 flex flex-col justify-end h-full p-8 md:p-12 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-4 py-1.5 rounded-full bg-primary-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                                        Destaque
                                    </span>
                                    <span className="text-white/80 text-sm font-medium flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                        {formatarData(destaque.publicadoEm)}
                                    </span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4 group-hover:text-primary-300 transition-colors">
                                    {destaque.titulo}
                                </h3>
                                <p className="text-white/80 text-lg line-clamp-2 md:line-clamp-3 mb-6 max-w-3xl leading-relaxed">
                                    {destaque.resumo}
                                </p>
                                <div className="mt-auto inline-flex items-center gap-2 text-white font-bold text-sm tracking-wide group-hover:gap-4 transition-all w-fit">
                                    Ler matéria completa <span className="text-primary-400">→</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Lateral News - Right col */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
                        {laterais.map((n, index) => (
                            <Link 
                                key={n.id} 
                                href={`/noticias/${n.slug}`} 
                                className="group flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-5 p-4 rounded-3xl bg-white border border-gray-100 hover:border-primary-100 hover:shadow-xl transition-all duration-300 flex-1 hover:-translate-y-1"
                            >
                                <div className="relative w-full sm:w-32 lg:w-full xl:w-32 aspect-video sm:aspect-square lg:aspect-video xl:aspect-square flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                                    {n.imagem ? (
                                        <img 
                                            src={n.imagem} 
                                            alt={n.titulo} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                                    )}
                                </div>
                                <div className="flex flex-col flex-1 justify-center py-1 text-left">
                                    <span className="text-xs text-primary-600 font-bold tracking-widest uppercase mb-2">
                                        {formatarData(n.publicadoEm)}
                                    </span>
                                    <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-primary-600 transition-colors line-clamp-3">
                                        {n.titulo}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
