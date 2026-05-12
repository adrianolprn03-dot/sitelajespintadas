"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    HiOutlineBuildingLibrary, HiOutlineAcademicCap, HiOutlinePlusCircle,
    HiOutlineWrenchScrewdriver, HiOutlineBanknotes, HiOutlineUserGroup,
    HiOutlineSun, HiOutlineMusicalNote, HiOutlineArrowLongRight
} from "react-icons/hi2";

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

const secretariasConfig: Record<string, { icon: string; gradient: string; accent: string }> = {
    "administracao": { icon: "🏛️", gradient: "from-blue-600 to-indigo-700", accent: "bg-blue-50 text-blue-600" },
    "saude": { icon: "🏥", gradient: "from-rose-500 to-red-600", accent: "bg-rose-50 text-rose-600" },
    "educacao": { icon: "📚", gradient: "from-emerald-500 to-teal-600", accent: "bg-emerald-50 text-emerald-600" },
    "obras": { icon: "🔧", gradient: "from-orange-500 to-amber-600", accent: "bg-orange-50 text-orange-600" },
    "financas": { icon: "💰", gradient: "from-emerald-600 to-green-700", accent: "bg-emerald-50 text-emerald-600" },
    "assistencia-social": { icon: "🤝", gradient: "from-purple-600 to-violet-700", accent: "bg-purple-50 text-purple-600" },
    "agricultura": { icon: "🌾", gradient: "from-amber-500 to-yellow-600", accent: "bg-amber-50 text-amber-600" },
    "cultura": { icon: "🎭", gradient: "from-pink-500 to-rose-600", accent: "bg-pink-50 text-pink-600" },
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
        <section className="py-24 bg-[#f8fafc] border-b border-gray-100 font-['Montserrat',sans-serif]" aria-labelledby="secretarias-titulo">
            <div className="max-w-[1300px] mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8 mb-16">
                    <div className="text-center lg:text-left">
                        <p className="text-[10px] font-black text-[#01b0ef] uppercase tracking-[0.4em] mb-4">
                            Estrutura de Governo
                        </p>
                        <h2 id="secretarias-titulo" className="text-4xl md:text-5xl font-black text-[#0088b9] uppercase tracking-tighter leading-none">
                            Secretarias e<br className="hidden md:block" />{" "}
                            Órgãos Municipais
                        </h2>
                        <div className="w-16 h-1.5 bg-[#FDB913] mt-6 rounded-full mx-auto lg:mx-0" />
                    </div>
                    <Link
                        href="/secretarias"
                        className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#01b0ef] hover:text-[#0088b9] transition-all"
                    >
                        Ver todas
                        <HiOutlineArrowLongRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Grid Premium */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {secretarias.map((s, idx) => {
                        const Icon = secretariasIcones[s.slug] || HiOutlineBuildingLibrary;
                        const cfg = secretariasConfig[s.slug] || {
                            gradient: "from-slate-600 to-slate-800",
                            accent: "bg-slate-50 text-slate-600"
                        };

                        return (
                            <Link
                                key={s.id}
                                href={`/secretarias/${s.slug}`}
                                className="group relative bg-white rounded-[2rem] border border-gray-100 shadow-lg hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                            >
                                {/* Top gradient accent */}
                                <div className={`h-1.5 w-full bg-gradient-to-r ${cfg.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />

                                <div className="p-8">
                                    {/* Icon */}
                                    <div className={`w-14 h-14 ${cfg.accent} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                        <Icon size={28} strokeWidth={1.5} />
                                    </div>

                                    {/* Content */}
                                    <h3 className="font-black text-gray-800 text-base leading-tight mb-4 group-hover:text-[#01b0ef] transition-colors uppercase tracking-tight">
                                        {s.nome}
                                    </h3>

                                    {/* Footer */}
                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 group-hover:text-[#01b0ef] transition-colors mt-4 pt-4 border-t border-gray-50">
                                        Acessar estrutura
                                        <HiOutlineArrowLongRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                {/* Number badge */}
                                <div className="absolute top-6 right-6 text-[10px] font-black text-gray-200 tabular-nums">
                                    {String(idx + 1).padStart(2, "0")}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* CTA bottom */}
                <div className="mt-12 text-center">
                    <Link
                        href="/secretarias"
                        className="inline-flex items-center gap-3 bg-[#0088b9] text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#006d99] transition-all shadow-xl shadow-[#0088b9]/20 hover:shadow-[#0088b9]/30"
                    >
                        Conhecer Todas as Secretarias
                        <HiOutlineArrowLongRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
