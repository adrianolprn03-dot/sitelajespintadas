"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HiArrowLongRight } from "react-icons/hi2";

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
                const res = await fetch("/api/noticias?limit=5&publicada=true");
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
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).replace(/ de /g, "/");
    };

    if (loading || noticias.length === 0) return null;

    const destaque = noticias[0];
    const laterais = noticias.slice(1);

    return (
        <section className="bg-white py-24 relative overflow-hidden" aria-labelledby="noticias-titulo">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary-50/40 rounded-full -mr-[200px] -mt-[350px] blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-50/30 rounded-full -ml-[150px] -mb-[250px] blur-3xl pointer-events-none" />

            <div className="max-w-[1240px] mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-14 gap-6">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-1 bg-secondary-400 rounded-full" />
                            <span className="text-primary-500 font-black text-[10px] uppercase tracking-[0.35em]">Portal de Notícias</span>
                        </div>
                        <h2 id="noticias-titulo" className="text-3xl md:text-5xl font-black text-[#002241] uppercase tracking-tighter leading-tight">
                            Acompanhe as <br />
                            <span className="text-primary-500">ações da prefeitura</span>
                        </h2>
                    </div>
                    <Link
                        href="/noticias"
                        className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-primary-500 hover:text-primary-700 transition-all"
                    >
                        Ver todas as notícias
                        <div className="w-10 h-10 rounded-full border-2 border-primary-100 flex items-center justify-center group-hover:bg-primary-500 group-hover:border-primary-500 group-hover:text-white transition-all">
                            <HiArrowLongRight className="w-5 h-5" />
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    {/* Featured Article */}
                    <div className="lg:col-span-6 flex">
                        <Link
                            href={`/noticias/${destaque.slug}`}
                            className="group relative flex flex-col w-full min-h-[500px] lg:h-full rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary-900/15 transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-[#002241]/95 via-[#002241]/50 to-transparent z-10" />

                            {destaque.imagem ? (
                                <img
                                    src={destaque.imagem}
                                    alt={destaque.titulo}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#002241] to-primary-600" />
                            )}

                            <div className="relative z-20 flex flex-col justify-end h-full p-8 md:p-10">
                                <div className="flex items-center gap-3 mb-5">
                                    <span className="px-4 py-1.5 rounded-full bg-secondary-400 text-[#002241] text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        Destaque
                                    </span>
                                    <span className="text-white/70 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                        {formatarData(destaque.publicadoEm)}
                                    </span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4 group-hover:text-secondary-300 transition-colors line-clamp-3">
                                    {destaque.titulo}
                                </h3>
                                <p className="text-white/70 text-sm line-clamp-2 mb-8 font-medium leading-relaxed">
                                    {destaque.resumo}
                                </p>
                                <div className="inline-flex items-center gap-3 text-white font-black uppercase tracking-widest text-[10px] group-hover:gap-5 transition-all w-fit bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 hover:bg-primary-500/40">
                                    Ler matéria <HiArrowLongRight className="w-4 h-4 text-secondary-400" />
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Side News Grid */}
                    <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {laterais.map((n) => (
                            <Link
                                key={n.id}
                                href={`/noticias/${n.slug}`}
                                className="group flex flex-col bg-white rounded-[1.75rem] border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-primary-900/8 transition-all duration-500 hover:-translate-y-1.5 h-full"
                            >
                                <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                                    {n.imagem ? (
                                        <img
                                            src={n.imagem}
                                            alt={n.titulo}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#002241]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                                </div>

                                <div className="flex flex-col flex-1 p-5 md:p-6">
                                    <span className="text-[10px] text-primary-500 font-black tracking-widest uppercase mb-2 block">
                                        {formatarData(n.publicadoEm)}
                                    </span>
                                    <h3 className="font-black text-[#002241] text-base leading-snug group-hover:text-primary-600 transition-colors line-clamp-3 mb-4 flex-1">
                                        {n.titulo}
                                    </h3>

                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Acessar</span>
                                        <div className="w-8 h-8 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all">
                                            <HiArrowLongRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
