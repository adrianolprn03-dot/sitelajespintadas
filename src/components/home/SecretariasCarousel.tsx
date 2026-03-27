"use client";
import { useRef } from "react";
import Link from "next/link";
import { FaUserTie, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getSecretariaIcon } from "@/lib/icons";

type Secretaria = {
    id: string;
    nome: string;
    slug: string;
    descricao: string;
    secretario: string | null;
};

export default function SecretariasCarousel({ secretarias }: { secretarias: Secretaria[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <section className="py-16 bg-[#f4f7fa] border-y border-gray-200">
            <div className="max-w-[1300px] mx-auto px-6">
                
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-[#003670] uppercase tracking-tighter">
                            Nossas <span className="text-[#01b0ef]">Secretarias</span>
                        </h2>
                        <p className="text-gray-500 text-sm font-medium mt-1">Navegue pelas pastas da administração municipal</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={() => scroll("left")}
                            className="w-10 h-10 rounded-full bg-white text-[#0088b9] border border-blue-100 flex items-center justify-center hover:bg-[#0088b9] hover:text-white transition-all shadow-sm"
                            aria-label="Anterior"
                        >
                            <FaChevronLeft size={14} className="ml-[-2px]" />
                        </button>
                        <button 
                            onClick={() => scroll("right")}
                            className="w-10 h-10 rounded-full bg-white text-[#0088b9] border border-blue-100 flex items-center justify-center hover:bg-[#0088b9] hover:text-white transition-all shadow-sm"
                            aria-label="Próximo"
                        >
                            <FaChevronRight size={14} className="mr-[-2px]" />
                        </button>
                    </div>
                </div>

                {/* Carousel */}
                <div 
                    ref={scrollRef}
                    className="flex gap-5 overflow-x-auto hide-scrollbar pb-6 snap-x snap-mandatory"
                >
                    {secretarias.map((sec) => {
                        const nomeCurto = sec.nome.replace('Secretaria Municipal de ', '').replace('Secretaria Municipal da ', '').replace('Secretaria do ', '');
                        const Icone = getSecretariaIcon(sec.nome);

                        return (
                            <Link key={sec.id} href={`/secretarias/${sec.slug}`} className="snap-start shrink-0 w-[260px] group block">
                                <div className="h-full bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50 border border-gray-100 flex flex-col justify-between hover:shadow-xl hover:border-[#01b0ef] hover:-translate-y-1 transition-all duration-300">
                                    
                                    <div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-blue-50 text-[#01b0ef] rounded-xl flex items-center justify-center group-hover:bg-[#01b0ef] group-hover:text-white transition-colors">
                                                <Icone size={20} />
                                            </div>
                                            <h3 className="text-sm font-black text-[#003670] uppercase tracking-tight leading-tight line-clamp-2">
                                                {nomeCurto}
                                            </h3>
                                        </div>
                                        <p className="text-gray-500 text-[11px] font-medium leading-relaxed line-clamp-3 mb-5">
                                            {sec.descricao || "Acesse para mais detalhes."}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <FaUserTie className="text-gray-400" size={12} />
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black uppercase tracking-widest text-[#0088b9]">Gestor(a)</span>
                                                <span className="text-[11px] font-bold text-gray-700 truncate max-w-[180px]">
                                                    {sec.secretario || "A nomear"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <style>{`
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>

            </div>
        </section>
    );
}
