"use client";
import Link from "next/link";
import {
    HiOutlineRectangleGroup,
    HiOutlineHeart,
    HiOutlineUsers,
    HiOutlineAcademicCap,
    HiOutlineMusicalNote,
} from "react-icons/hi2";

const unidades = [
    {
        label: "Secretarias",
        icon: HiOutlineRectangleGroup,
        href: "/secretarias",
        color: "text-primary-600",
        bg: "bg-primary-50",
        hoverBg: "group-hover:bg-primary-500",
        ring: "group-hover:ring-primary-200",
    },
    {
        label: "Unidades de Saúde",
        icon: HiOutlineHeart,
        href: "/unidades-de-saude",
        color: "text-rose-600",
        bg: "bg-rose-50",
        hoverBg: "group-hover:bg-rose-500",
        ring: "group-hover:ring-rose-200",
    },
    {
        label: "Socioassistencial",
        icon: HiOutlineUsers,
        href: "/socioassistencial",
        color: "text-violet-600",
        bg: "bg-violet-50",
        hoverBg: "group-hover:bg-violet-500",
        ring: "group-hover:ring-violet-200",
    },
    {
        label: "Unidades Escolares",
        icon: HiOutlineAcademicCap,
        href: "/unidades-escolares",
        color: "text-amber-600",
        bg: "bg-amber-50",
        hoverBg: "group-hover:bg-amber-500",
        ring: "group-hover:ring-amber-200",
    },
    {
        label: "Unidades Culturais",
        icon: HiOutlineMusicalNote,
        href: "/servicos/cultura",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        hoverBg: "group-hover:bg-emerald-500",
        ring: "group-hover:ring-emerald-200",
    },
];

export default function UnidadesAtendimento() {
    return (
        <section className="bg-section-light py-20 border-t border-gray-100" aria-labelledby="unidades-titulo">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col items-center mb-14 text-center">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-6 h-0.5 bg-secondary-400 rounded-full" />
                        <span className="text-primary-500 font-black text-[10px] uppercase tracking-[0.4em]">Informações Oficiais</span>
                        <div className="w-6 h-0.5 bg-secondary-400 rounded-full" />
                    </div>
                    <h2 id="unidades-titulo" className="text-3xl md:text-4xl font-black text-[#002241] uppercase tracking-tighter leading-tight">
                        Unidades de <span className="text-primary-500 italic">Atendimento</span>
                    </h2>
                    <div className="w-12 h-1.5 bg-secondary-400 mt-5 rounded-full" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                    {unidades.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="group flex flex-col items-center p-7 bg-white rounded-[1.75rem] border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-400 hover:-translate-y-2"
                        >
                            <div className={`w-18 h-18 w-[4.5rem] h-[4.5rem] ${item.bg} ${item.color} ${item.hoverBg} group-hover:text-white rounded-2xl flex items-center justify-center mb-5 ${item.ring} group-hover:ring-4 transition-all duration-400 shadow-sm`}>
                                <item.icon size={32} strokeWidth={1.5} />
                            </div>
                            <span className="text-[#002241] group-hover:text-primary-600 font-black text-[10px] uppercase tracking-[0.15em] text-center transition-colors leading-tight">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
