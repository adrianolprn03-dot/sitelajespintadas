import Link from "next/link";
import {
    HiOutlineCurrencyDollar,
    HiOutlineBuildingLibrary,
    HiOutlineNewspaper,
    HiOutlineEnvelope,
} from "react-icons/hi2";
import { prisma } from "@/lib/prisma";
import { FaExternalLinkAlt } from "react-icons/fa";

const acessosBase = [
    {
        label: "Contracheque",
        icon: HiOutlineCurrencyDollar,
        href: "#",
        id: "home-contracheque",
        color: "text-primary-400",
        bg: "bg-primary-500/20",
        hoverBg: "group-hover:bg-primary-400",
    },
    {
        label: "Portal do Contribuinte",
        icon: HiOutlineBuildingLibrary,
        href: "#",
        id: "home-contribuinte",
        color: "text-secondary-300",
        bg: "bg-secondary-400/20",
        hoverBg: "group-hover:bg-secondary-400",
    },
    {
        label: "Diário Oficial",
        icon: HiOutlineNewspaper,
        href: "/transparencia/diario-oficial",
        id: "home-diario",
        color: "text-emerald-300",
        bg: "bg-emerald-500/20",
        hoverBg: "group-hover:bg-emerald-500",
    },
    {
        label: "Webmail",
        icon: HiOutlineEnvelope,
        href: "#",
        id: "home-webmail",
        color: "text-purple-300",
        bg: "bg-purple-500/20",
        hoverBg: "group-hover:bg-purple-500",
    },
];

export default async function AcessoRapido() {
    const linksExternos = await (prisma as any).linkExterno.findMany({
        where: { ativo: true, moduloAlvo: { startsWith: "home-" } },
    });

    return (
        <section className="bg-section-dark py-24 relative overflow-hidden" aria-labelledby="acesso-rapido-titulo">
            {/* Decorative circles */}
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-secondary-400/10 blur-3xl pointer-events-none" />

            <div className="max-w-[1240px] mx-auto px-6 text-center relative z-10">
                <div className="flex flex-col items-center mb-14">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-6 h-0.5 bg-secondary-400/60 rounded-full" />
                        <span className="text-secondary-400 font-black text-[10px] uppercase tracking-[0.4em]">Facilidade ao Cidadão</span>
                        <div className="w-6 h-0.5 bg-secondary-400/60 rounded-full" />
                    </div>
                    <h2 id="acesso-rapido-titulo" className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                        Acesso <span className="text-primary-400 italic">Rápido</span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {acessosBase.map((item, index) => {
                        const override = linksExternos.find((l: any) =>
                            l.moduloAlvo?.toLowerCase() === item.id.toLowerCase()
                        );
                        const finalHref = override ? override.url : item.href;
                        const isExternal = !!override;

                        return (
                            <Link
                                key={index}
                                href={finalHref}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className="group flex flex-col items-center p-8 bg-white/5 hover:bg-white/10 rounded-[2.5rem] border border-white/10 hover:border-white/25 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 backdrop-blur-sm"
                            >
                                <div className={`w-20 h-20 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-5 ${item.hoverBg} group-hover:text-white transition-all duration-500 relative shadow-inner`}>
                                    <item.icon size={38} strokeWidth={1.5} />
                                    {isExternal && (
                                        <div className="absolute -top-1.5 -right-1.5 bg-secondary-400 text-[#002241] p-1 rounded-lg shadow-lg">
                                            <FaExternalLinkAlt size={9} />
                                        </div>
                                    )}
                                </div>
                                <span className="text-white/80 group-hover:text-white font-black text-[11px] uppercase tracking-widest text-center transition-colors leading-snug">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
