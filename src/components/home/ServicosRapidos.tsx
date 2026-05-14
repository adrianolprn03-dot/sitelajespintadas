import Link from "next/link";
import { HiOutlineMagnifyingGlassCircle, HiOutlineClipboardDocumentCheck, HiOutlineReceiptPercent, HiOutlineIdentification } from "react-icons/hi2";
import { prisma } from "@/lib/prisma";
import { FaExternalLinkAlt } from "react-icons/fa";

const servicos = [
    {
        label: "Portal da Transparência",
        desc: "Acompanhe as contas públicas e atos oficiais.",
        href: "/transparencia",
        icon: HiOutlineClipboardDocumentCheck,
        color: "text-primary-500",
        bgColor: "bg-primary-50",
        accentColor: "border-t-primary-500",
        hoverGlow: "hover:shadow-primary-200/60",
    },
    {
        label: "E-SIC",
        desc: "Solicite informações públicas eletronicamente.",
        href: "/servicos/esic",
        icon: HiOutlineMagnifyingGlassCircle,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        accentColor: "border-t-emerald-500",
        hoverGlow: "hover:shadow-emerald-200/60",
    },
    {
        label: "Ouvidoria",
        desc: "Envie sugestões, reclamações ou elogios.",
        href: "/servicos/ouvidoria",
        icon: HiOutlineIdentification,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        accentColor: "border-t-amber-500",
        hoverGlow: "hover:shadow-amber-200/60",
    },
    {
        label: "Secretarias",
        desc: "Conheça os órgãos e gestores municipais.",
        href: "/secretarias",
        icon: HiOutlineReceiptPercent,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
        accentColor: "border-t-indigo-500",
        hoverGlow: "hover:shadow-indigo-200/60",
    },
];

export default async function ServicosRapidos() {
    const linksExternos = await (prisma as any).linkExterno.findMany({
        where: { ativo: true, moduloAlvo: { startsWith: "home-" } },
    });

    return (
        <section className="pb-24 bg-transparent relative z-20 -mt-36 md:-mt-52" id="servicos" aria-labelledby="servicos-titulo">
            <div className="max-w-[1240px] mx-auto px-6">


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {servicos.map((s, idx) => {
                        const Icon = s.icon;
                        const identifier =
                            s.href.includes("esic") ? "home-esic" :
                            s.href.includes("ouvidoria") ? "home-ouvidoria" :
                            s.href === "/transparencia" ? "home-transparencia" :
                            s.href === "/secretarias" ? "home-secretarias" : "";

                        const override = linksExternos.find((l: any) =>
                            l.moduloAlvo?.toLowerCase() === identifier.toLowerCase()
                        );
                        const finalHref = (override && override.url) ? override.url : s.href;
                        const isExternal = !!override;

                        return (
                            <Link
                                key={idx}
                                href={finalHref}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className={`group flex flex-col p-8 rounded-[2.5rem] bg-white border-t-4 ${s.accentColor} shadow-xl ${s.hoverGlow} hover:shadow-2xl transition-all duration-500 hover:-translate-y-3`}
                            >
                                <div className={`w-16 h-16 ${s.bgColor} ${s.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm relative`}>
                                    <Icon size={34} strokeWidth={1.5} />
                                    {isExternal && (
                                        <div className="absolute -top-2 -right-2 bg-primary-500 text-white p-1.5 rounded-lg shadow-lg border-2 border-white">
                                            <FaExternalLinkAlt size={12} />
                                        </div>
                                    )}
                                </div>

                                <h3 className="font-black text-[#002241] text-lg uppercase tracking-tight mb-2 group-hover:text-primary-600 transition-colors leading-tight">
                                    {s.label}
                                </h3>
                                <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6 flex-1">
                                    {s.desc}
                                </p>
                                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${s.color} py-2.5 px-5 bg-gray-50 group-hover:bg-primary-500 group-hover:text-white rounded-full w-fit transition-all duration-300 shadow-sm`}>
                                    {isExternal ? "Portal Externo" : "Acessar"} <span className="text-base">→</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-16 flex justify-center">
                    <Link
                        href="/servicos"
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-primary-500 transition-all border-b-2 border-gray-200 hover:border-primary-500 pb-1"
                    >
                        Ver todos os serviços municipais
                    </Link>
                </div>
            </div>
        </section>
    );
}
