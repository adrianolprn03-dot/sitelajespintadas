"use client";
import Link from "next/link";
import { 
    HiOutlineCurrencyDollar, 
    HiOutlineBuildingLibrary, 
    HiOutlineNewspaper, 
    HiOutlineEnvelope 
} from "react-icons/hi2";

const acessos = [
    { label: "Contracheque", icon: HiOutlineCurrencyDollar, href: "#" },
    { label: "Portal do Contribuinte", icon: HiOutlineBuildingLibrary, href: "#" },
    { label: "Diário Oficial", icon: HiOutlineNewspaper, href: "/transparencia/diario-oficial" },
    { label: "Webmail", icon: HiOutlineEnvelope, href: "#" },
];

export default function AcessoRapido() {
    return (
        <section className="bg-gray-50/50 py-24" aria-labelledby="acesso-rapido-titulo">
            <div className="max-w-[1240px] mx-auto px-6 text-center">
                <div className="flex flex-col items-center mb-16">
                    <span className="text-primary-600 font-black text-[11px] uppercase tracking-[0.4em] mb-4">Facilidade ao Cidadão</span>
                    <h2 id="acesso-rapido-titulo" className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
                        Acesso <span className="text-primary-500 italic">Rápido</span>
                    </h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {acessos.map((item, index) => (
                        <Link 
                            key={index} 
                            href={item.href}
                            className="group flex flex-col items-center p-10 bg-white rounded-[3rem] border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                        >
                            <div className="w-20 h-20 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500">
                                <item.icon size={40} />
                            </div>
                            <span className="text-gray-900 font-black text-xs uppercase tracking-widest text-center group-hover:text-primary-600 transition-colors">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
