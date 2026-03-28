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
        <section className="py-20 bg-white border-y border-gray-100">
            <div className="max-w-[1300px] mx-auto px-6">

                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-6 h-0.5 bg-secondary-400 rounded-full" />
                            <span className="text-primary-500 font-black text-[10px] uppercase tracking-[0.35em]">Administração Municipal</span>
                        </div>
                        <h2 className="text-3xl font-black text-[#002241] uppercase tracking-tighter">
                            Nossas <span className="text-primary-500">Secretarias</span>
                        </h2>
                        <p className="text-gray-400 text-sm font-medium mt-1">Navegue pelas pastas da administração municipal</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => scroll("left")}
                            className="w-10 h-10 rounded-full bg-white text-primary-500 border-2 border-primary-100 flex items-center justify-center hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all shadow-sm"
                            aria-label="Anterior"
                        >
                            <FaChevronLeft size={13} className="ml-[-1px]" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="w-10 h-10 rounded-full bg-white text-primary-500 border-2 border-primary-100 flex items-center justify-center hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all shadow-sm"
                            aria-label="Próximo"
                        >
                            <FaChevronRight size={13} className="mr-[-1px]" />
                        </button>
                    </div>
                </div>

                {/* Carousel */}
                <div
                    ref={scrollRef}
                    className="flex gap-5 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory"
                >
                    {secretarias.map((sec) => {
                        const nomeCurto = sec.nome
                            .replace("Secretaria Municipal de ", "")
                            .replace("Secretaria Municipal da ", "")
                            .replace("Secretaria do ", "");
                        const Icone = getSecretariaIcon(sec.nome);

                        return (
                            <Link key={sec.id} href={`/secretarias/${sec.slug}`} className="snap-start shrink-0 w-[260px] group block">
                                <div className="h-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-primary-300 hover:shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-transparent hover:border-l-primary-500">

                                    <div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors shrink-0">
                                                <Icone size={20} />
                                            </div>
                                            <h3 className="text-sm font-black text-[#002241] uppercase tracking-tight leading-tight line-clamp-2">
                                                {nomeCurto}
                                            </h3>
                                        </div>
                                        <p className="text-gray-400 text-[11px] font-medium leading-relaxed line-clamp-3 mb-5">
                                            {sec.descricao || "Acesse para mais detalhes."}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <FaUserTie className="text-gray-300" size={11} />
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black uppercase tracking-widest text-primary-500">Gestor(a)</span>
                                                <span className="text-[11px] font-bold text-gray-600 truncate max-w-[180px]">
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
