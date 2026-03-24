import Link from "next/link";
import { 
    HiOutlineCurrencyDollar, 
    HiOutlineBuildingLibrary, 
    HiOutlineNewspaper, 
    HiOutlineEnvelope 
} from "react-icons/hi2";
import { prisma } from "@/lib/prisma";
import { FaExternalLinkAlt } from "react-icons/fa";

const acessosBase = [
    { label: "Contracheque", icon: HiOutlineCurrencyDollar, href: "#", id: "home-contracheque" },
    { label: "Portal do Contribuinte", icon: HiOutlineBuildingLibrary, href: "#", id: "home-contribuinte" },
    { label: "Diário Oficial", icon: HiOutlineNewspaper, href: "/transparencia/diario-oficial", id: "home-diario" },
    { label: "Webmail", icon: HiOutlineEnvelope, href: "#", id: "home-webmail" },
];

export default async function AcessoRapido() {
    const linksExternos = await (prisma as any).linkExterno.findMany({
        where: { ativo: true, moduloAlvo: { startsWith: "home-" } }
    });

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
                                className="group flex flex-col items-center p-10 bg-white rounded-[3rem] border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="w-20 h-20 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500 relative">
                                    <item.icon size={40} />
                                    {isExternal && (
                                        <div className="absolute -top-2 -right-2 bg-primary-500 text-white p-1.5 rounded-lg shadow-lg">
                                            <FaExternalLinkAlt size={10} />
                                        </div>
                                    )}
                                </div>
                                <span className="text-gray-900 font-black text-xs uppercase tracking-widest text-center group-hover:text-primary-600 transition-colors">
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
