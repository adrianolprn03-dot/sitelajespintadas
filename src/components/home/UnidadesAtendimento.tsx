"use client";
import Link from "next/link";
import { 
    HiOutlineRectangleGroup, 
    HiOutlineHeart, 
    HiOutlineUsers, 
    HiOutlineAcademicCap 
} from "react-icons/hi2";
import { FaPalette } from "react-icons/fa6";

const unidades = [
    { label: "Secretarias", icon: HiOutlineRectangleGroup, href: "/secretarias" },
    { label: "Unidades de saúde", icon: HiOutlineHeart, href: "/servicos/saude" },
    { label: "Socioassistencial", icon: HiOutlineUsers, href: "/servicos/social" },
    { label: "Unidades escolares", icon: HiOutlineAcademicCap, href: "/servicos/educacao" },
    { label: "Unidades culturais", icon: HiOutlineRectangleGroup, href: "/servicos/cultura" },
];

export default function UnidadesAtendimento() {
    return (
        <section className="bg-white py-12" aria-labelledby="unidades-titulo">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col items-center mb-12 text-center">
                    <span className="text-primary-600 font-black text-[11px] uppercase tracking-[0.4em] mb-4">Informações Oficiais</span>
                    <h2 id="unidades-titulo" className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter leading-tight drop-shadow-sm font-['Fustat',sans-serif]">
                        Unidades de <span className="text-primary-500 italic">Atendimento</span>
                    </h2>
                    <div className="w-12 h-1.5 bg-[#FDB913] mt-6 rounded-full shadow-sm" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {unidades.map((item, index) => (
                        <Link 
                            key={index} 
                            href={item.href}
                            className="group flex flex-col items-center p-8 bg-gray-50/50 rounded-[2rem] hover:bg-white border border-gray-100/10 hover:border-primary-100 hover:shadow-2xl hover:shadow-primary-900/5 transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className="w-20 h-20 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner group-hover:bg-primary-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary-200">
                                <item.icon size={36} strokeWidth={1.5} />
                            </div>
                            <span className="text-[#0088b9] group-hover:text-primary-600 font-black text-[10px] uppercase tracking-[0.2em] text-center transition-colors leading-tight">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
