import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import LegislacaoClient from "../legislacao/_LegislacaoClient";
import { prisma } from "@/lib/prisma";
import { FaExternalLinkAlt, FaGlobe, FaGavel } from "react-icons/fa";

export const metadata: Metadata = {
    title: "Leis Municipais | Prefeitura de Lajes Pintadas – RN",
    description: "Consulta às Leis Municipais e Leis Orgânicas da Prefeitura de Lajes Pintadas – RN.",
};

export default async function LeisPage() {
    const linksExternos = await (prisma as any).linkExterno.findMany({
        where: {
            ativo: true,
            categoria: { in: ["legislacao", "geral"] }
        },
        orderBy: [{ ordem: "asc" }, { criadoEm: "desc" }]
    });

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Leis Municipais"
                subtitle="Acesso integral à legislação aprovada pelo Poder Legislativo e sancionada pelo Executivo."
                variant="premium"
                icon={<FaGavel />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Leis" }
                ]}
            />

            {/* Listagem de Legislação - Estilo Padronizado */}
            <div className="pt-0">
                <LegislacaoClient initialTipo="lei" hideTipoFilter={true} />
            </div>

            {/* Seção de Links Externos */}
            {linksExternos.length > 0 && (
                <div className="max-w-7xl mx-auto px-6 py-12 mb-20">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                             Outras Fontes de Legislação
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {linksExternos.map((link: any) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start gap-4 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-500"
                            >
                                <div className="w-14 h-14 bg-gray-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                    <FaExternalLinkAlt size={20} />
                                </div>
                                <div className="min-w-0 pt-1">
                                    <span className="font-black text-gray-800 text-sm block mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                        {link.titulo}
                                    </span>
                                    {link.descricao && (
                                        <span className="text-xs text-gray-500 block mb-3 font-medium leading-relaxed opacity-70">
                                            {link.descricao}
                                        </span>
                                    )}
                                    <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-lg w-fit">
                                        <FaGlobe size={10} /> {new URL(link.url).hostname}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
