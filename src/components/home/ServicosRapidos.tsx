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
        color: "text-blue-500",
        bgColor: "bg-blue-50/50"
    },
    {
        label: "E-SIC",
        desc: "Solicite informações públicas eletronicamente.",
        href: "/servicos/esic",
        icon: HiOutlineMagnifyingGlassCircle,
        color: "text-emerald-500",
        bgColor: "bg-emerald-50/50"
    },
    {
        label: "Ouvidoria",
        desc: "Envie sugestões, reclamações ou elogios.",
        href: "/servicos/ouvidoria",
        icon: HiOutlineIdentification,
        color: "text-amber-500",
        bgColor: "bg-amber-50/50"
    },
    {
        label: "Secretarias",
        desc: "Conheça os órgãos e gestores municipais.",
        href: "/secretarias",
        icon: HiOutlineReceiptPercent,
        color: "text-indigo-500",
        bgColor: "bg-indigo-50/50"
    }
];


export default async function ServicosRapidos() {
    const linksExternos = await (prisma as any).linkExterno.findMany({
        where: { ativo: true, moduloAlvo: { startsWith: "home-" } }
    });

    return (
        <section className="pb-24 bg-transparent relative z-20 -mt-32 md:-mt-48" id="servicos" aria-labelledby="servicos-titulo">
            <div className="max-w-[1240px] mx-auto px-6">
                <div className="flex flex-col items-center mb-16 text-center">
                    <span className="text-secondary-400 font-black text-[11px] uppercase tracking-[0.4em] mb-4">Serviços Oficiais</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {servicos.map((s, idx) => {
                        const Icon = s.icon;
                        const key = `home-${s.href.replace("/", "") || "home"}`; // ex: home-transparencia, home-secretarias
                        // Caso especial para caminhos aninhados
                        const identifier = s.href.includes("esic") ? "home-esic" : 
                                         s.href.includes("ouvidoria") ? "home-ouvidoria" : 
                                         s.href === "/transparencia" ? "home-transparencia" :
                                         s.href === "/secretarias" ? "home-secretarias" : "";

                        const override = linksExternos.find((l: any) => 
                            l.moduloAlvo?.toLowerCase() === identifier.toLowerCase()
                        );
                        const finalHref = override ? override.url : s.href;
                        const isExternal = !!override;

                        return (
                            <Link
                                key={idx}
                                href={finalHref}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className="group flex flex-col p-10 rounded-[3rem] glass-light border border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_45px_90px_-20px_rgba(1,176,239,0.25)] transition-all duration-700 hover:-translate-y-4 hover:bg-white"
                            >
                                <div className={`w-20 h-20 ${s.bgColor} ${s.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner relative`}>
                                    <Icon size={40} strokeWidth={1} />
                                    {isExternal && (
                                        <div className="absolute -top-2 -right-2 bg-[#01b0ef] text-white p-1.5 rounded-lg shadow-lg">
                                            <FaExternalLinkAlt size={10} />
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-black text-gray-900 text-xl uppercase tracking-tighter mb-3 group-hover:text-primary-600 transition-colors">
                                    {s.label}
                                </h3>
                                <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 flex-1">
                                    {s.desc}
                                </p>
                                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-primary-500 py-3 px-6 bg-primary-50 rounded-full w-fit group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm">
                                    Acessar <span className="text-base">→</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-20 flex justify-center">
                    <Link href="/servicos" className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-primary-500 transition-all border-b-2 border-gray-200 hover:border-primary-500 pb-2">
                        Ver todos os serviços municipais
                    </Link>
                </div>
            </div>
        </section>
    );
}
