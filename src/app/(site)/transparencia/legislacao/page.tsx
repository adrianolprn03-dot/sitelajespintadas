import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import LegislacaoClient from "./_LegislacaoClient";
import { prisma } from "@/lib/prisma";
import { FaExternalLinkAlt, FaGlobe } from "react-icons/fa";

export const metadata: Metadata = {
    title: "Legislação Municipal | Prefeitura de Lajes Pintadas – RN",
    description: "Leis municipais, decretos, portarias e outros atos normativos da Prefeitura de Lajes Pintadas – RN.",
};

export default async function LegislacaoPage() {
    const linksExternos = await (prisma as any).linkExterno.findMany({
        where: {
            ativo: true,
            categoria: { in: ["legislacao", "geral"] }
        },
        orderBy: [{ ordem: "asc" }, { criadoEm: "desc" }]
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Legislação Municipal"
                subtitle="Atos normativos do Município de Lajes Pintadas — leis, decretos, portarias e regulamentações"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Legislação" }
                ]}
            />

            {/* Indicadores legais */}
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Lei Orgânica Municipal", "LAI – Lei 12.527/2011", "LRF – LC 101/2000", "Lei de Gov. Digital 14.129/2021"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>

            <LegislacaoClient />

            {/* Seção de Links Externos */}
            {linksExternos.length > 0 && (
                <div className="max-w-[1200px] mx-auto px-6 py-12 mb-20">
                    <h2 className="text-sm font-black text-primary-600 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                        <span className="w-12 h-px bg-primary-600" /> Outras Fontes de Legislação
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {linksExternos.map((link: any) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start gap-4 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:border-primary-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-gray-50 text-primary-500 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-primary-500 group-hover:text-white transition-all">
                                    <FaExternalLinkAlt size={16} />
                                </div>
                                <div className="min-w-0 pt-1">
                                    <span className="font-black text-gray-800 text-sm block mb-1 group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                                        {link.titulo}
                                    </span>
                                    {link.descricao && (
                                        <span className="text-xs text-gray-500 block mb-2 font-medium leading-relaxed">
                                            {link.descricao}
                                        </span>
                                    )}
                                    <span className="text-[10px] text-primary-400 font-black uppercase tracking-widest flex items-center gap-1.5">
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
