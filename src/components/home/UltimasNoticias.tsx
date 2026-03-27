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
            day: "2-digit", month: "short", year: "numeric",
        }).replace(/ de /g, '/');
    };

    if (loading || noticias.length === 0) return null;

    const destaque = noticias[0];
    const laterais = noticias.slice(1);

    return (
        <section className="bg-white py-24 relative overflow-hidden" aria-labelledby="noticias-titulo">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full -mr-[200px] -mt-[400px] blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-50/50 rounded-full -ml-[200px] -mb-[300px] blur-3xl pointer-events-none" />
            
            <div className="max-w-[1240px] mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-[#01b0ef] font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Portal de Notícias</span>
                        <h2 id="noticias-titulo" className="text-3xl md:text-5xl font-black text-[#0088b9] uppercase tracking-tighter leading-tight">
                            Acompanhe as <br /> <span className="text-[#50B749]">ações da prefeitura</span>
                        </h2>
                    </div>
                    <Link 
                        href="/noticias" 
                        className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#01b0ef] hover:text-[#0088b9] transition-all"
                    >
                        Ver todas as notícias
                        <div className="w-10 h-10 rounded-full border border-blue-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors cursor-pointer">
                            <HiArrowLongRight className="w-5 h-5" />
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    {/* Destaque Principal - Left col */}
                    <div className="lg:col-span-6 flex">
                        <Link 
                            href={`/noticias/${destaque.slug}`} 
                            className="group relative flex flex-col w-full min-h-[500px] lg:h-full rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 will-change-transform hover:-translate-y-2"
                        >
                            <div className="absolute inset-0 bg-gray-900/40 z-10 transition-opacity duration-500 group-hover:bg-gray-900/20" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/60 to-transparent z-10" />
                            
                            {destaque.imagem ? (
                                <img 
                                    src={destaque.imagem} 
                                    alt={destaque.titulo} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#0088b9] to-[#01b0ef]" />
                            )}
                            
                            <div className="relative z-20 flex flex-col justify-end h-full p-8 md:p-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-4 py-1.5 rounded-full bg-[#50B749] text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        Destaque
                                    </span>
                                    <span className="text-white/90 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                        {formatarData(destaque.publicadoEm)}
                                    </span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4 group-hover:text-[#50B749] transition-colors line-clamp-3">
                                    {destaque.titulo}
                                </h3>
                                <p className="text-white/80 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-8 max-w-2xl font-medium leading-relaxed">
                                    {destaque.resumo}
                                </p>
                                <div className="mt-auto inline-flex items-center gap-3 text-white font-black uppercase tracking-widest text-[11px] group-hover:gap-5 transition-all w-fit bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 hover:bg-white/20">
                                    Ler matéria <HiArrowLongRight className="w-4 h-4 text-[#50B749]" />
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Lateral News - Right col (Grid 2x2) */}
                    <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {laterais.map((n) => (
                            <Link 
                                key={n.id} 
                                href={`/noticias/${n.slug}`} 
                                className="group flex flex-col bg-gray-50 rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 hover:-translate-y-2 h-full"
                            >
                                <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-200">
                                    {n.imagem ? (
                                        <img 
                                            src={n.imagem} 
                                            alt={n.titulo} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                                </div>
                                
                                <div className="flex flex-col flex-1 p-6 md:p-8 bg-white">
                                    <span className="text-[10px] text-[#01b0ef] font-black tracking-widest uppercase mb-3 block">
                                        {formatarData(n.publicadoEm)}
                                    </span>
                                    <h3 className="font-black text-gray-800 text-lg leading-snug group-hover:text-[#0088b9] transition-colors line-clamp-3 mb-4">
                                        {n.titulo}
                                    </h3>
                                    
                                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Acessar</span>
                                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[#01b0ef] group-hover:bg-[#01b0ef] group-hover:text-white transition-all">
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
