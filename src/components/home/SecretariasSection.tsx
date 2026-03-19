"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HiOutlineBuildingLibrary, HiOutlineAcademicCap, HiOutlinePlusCircle, HiOutlineWrenchScrewdriver, HiOutlineBanknotes, HiOutlineUserGroup, HiOutlineSun, HiOutlineMusicalNote, HiOutlineArrowLongRight } from "react-icons/hi2";

type Secretaria = {
    id: string;
    nome: string;
    slug: string;
    imagem: string | null;
};

const secretariasIcones: Record<string, any> = {
    "administracao": HiOutlineBuildingLibrary,
    "saude": HiOutlinePlusCircle,
    "educacao": HiOutlineAcademicCap,
    "obras": HiOutlineWrenchScrewdriver,
    "financas": HiOutlineBanknotes,
    "assistencia-social": HiOutlineUserGroup,
    "agricultura": HiOutlineSun,
    "cultura": HiOutlineMusicalNote,
};

const secretariasColors: Record<string, string> = {
    "administracao": "text-blue-600 bg-blue-50",
    "saude": "text-red-600 bg-red-50",
    "educacao": "text-green-600 bg-green-50",
    "obras": "text-orange-600 bg-orange-50",
    "financas": "text-emerald-600 bg-emerald-50",
    "assistencia-social": "text-purple-600 bg-purple-50",
    "agricultura": "text-amber-600 bg-amber-50",
    "cultura": "text-pink-600 bg-pink-50",
};

export default function SecretariasSection() {
    const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSecretarias = async () => {
            try {
                const res = await fetch("/api/secretarias");
                const data = await res.json();
                setSecretarias(data || []);
            } catch (error) {
                console.error("Erro ao buscar secretarias:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSecretarias();
    }, []);

    if (loading) return (
        <div className="py-24 flex items-center justify-center bg-white">
            <div className="w-8 h-8 border-4 border-[#01b0ef] border-t-transparent rounded-full animate-spin" />
        </div>
    );
    
    if (secretarias.length === 0) return null;

    return (
        <section className="py-16 bg-white border-b border-gray-50" aria-labelledby="secretarias-titulo">
            <div className="max-w-[1200px] mx-auto px-6">
                
                {/* HEADER DA SEÇÃO */}
                <div className="flex flex-col items-center mb-12 text-center">
                    <h2 id="secretarias-titulo" className="text-2xl md:text-3xl font-black text-[#0088b9] uppercase tracking-tighter">
                        Secretarias e Órgãos
                    </h2>
                    <div className="w-10 h-1 bg-[#FDB913] mt-4 rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {secretarias.map((s) => {
                        const Icon = secretariasIcones[s.slug] || HiOutlineBuildingLibrary;
                        const colors = secretariasColors[s.slug] || "text-gray-600 bg-gray-50";

                        return (
                            <Link
                                key={s.id}
                                href={`/secretarias/${s.slug}`}
                                className="group bg-white rounded-[2rem] p-8 border-2 border-gray-50 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 hover:-translate-y-2"
                            >
                                <div className={`w-16 h-16 ${colors} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                                    <Icon size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-black text-[#0088b9] text-lg leading-tight mb-6 group-hover:text-[#01b0ef] transition-colors min-h-[3rem]">
                                    {s.nome}
                                </h3>
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#01b0ef] opacity-60 group-hover:opacity-100 transition-opacity">
                                    Ver estrutura 
                                    <HiOutlineArrowLongRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-16 flex justify-center">
                    <Link href="/secretarias" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#0088b9] hover:text-[#01b0ef] transition-colors bg-gray-50 px-8 py-4 rounded-full border border-gray-100">
                        Conheça todas as Secretarias
                        <span className="text-xl">+</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
