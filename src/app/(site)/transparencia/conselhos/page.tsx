import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { FaUsers, FaFilePdf, FaCalendarAlt } from "react-icons/fa";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Conselhos Municipais | Prefeitura de Lajes Pintadas",
    description: "Espaço de participação social e controle da gestão pública municipal em Lajes Pintadas – RN.",
};

export default async function ConselhosPage() {
    const conselhos = await prisma.conselho.findMany({
        where: { ativo: true },
        include: {
            atas: {
                orderBy: { dataReuniao: "desc" }
            }
        },
        orderBy: { nome: "asc" }
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Conselhos Municipais"
                subtitle="Espaço de participação social e controle da gestão pública municipal."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Conselhos" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                {conselhos.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 mb-16">
                        <span className="text-6xl block mb-4 text-gray-300">🏛️</span>
                        <p className="text-gray-500 font-medium">Os conselhos municipais estão sendo atualizados. Retorne em breve!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        {conselhos.map((c) => (
                            <div key={c.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 shrink-0">
                                        <FaUsers size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-gray-800 group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                                            {c.nome}
                                        </h2>
                                        {c.sigla && <span className="text-xs font-bold text-gray-400">{c.sigla}</span>}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    {c.descricao}
                                </p>
                                <div className="p-4 bg-gray-50 rounded-2xl mb-6">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Composição & Contato</span>
                                    <p className="text-xs font-bold text-gray-700 leading-relaxed mb-2">{c.composicao}</p>
                                    {(c.presidente || c.email) && (
                                        <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                                            {c.presidente && <div><span className="font-bold">Presidente:</span> {c.presidente}</div>}
                                            {c.email && <div><span className="font-bold">E-mail:</span> {c.email}</div>}
                                        </div>
                                    )}
                                </div>
                                
                                {c.atas.length > 0 ? (
                                    <div className="space-y-3">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <FaCalendarAlt /> Atas Recentes
                                        </h3>
                                        <div className="flex flex-col gap-2">
                                            {c.atas.slice(0, 3).map((ata) => (
                                                <a 
                                                    key={ata.id} 
                                                    href={ata.arquivo || "#"} 
                                                    target={ata.arquivo ? "_blank" : undefined}
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors text-sm text-gray-600 border border-transparent hover:border-primary-100 group/ata"
                                                >
                                                    <span className="font-medium line-clamp-1">{ata.titulo}</span>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <span className="text-xs font-bold text-gray-400 group-hover/ata:text-primary-400">
                                                            {new Date(ata.dataReuniao).toLocaleDateString('pt-BR')}
                                                        </span>
                                                        <FaFilePdf className="text-red-400" />
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                        {c.atas.length > 3 && (
                                            <button className="text-[10px] font-bold text-primary-600 hover:text-primary-800 uppercase tracking-wider mt-2 w-full text-center py-2">
                                                Ver todas as {c.atas.length} atas →
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-xs text-gray-400 italic font-medium">Nenhuma ata registrada recentemente.</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="bg-blue-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden mt-8">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <FaUsers size={300} className="absolute -bottom-20 -right-20" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Participação Social</h3>
                        <p className="text-blue-200 max-w-2xl mx-auto mb-8 font-medium">
                            Os conselhos municipais são ferramentas fundamentais para que a sociedade civil organizada possa fiscalizar e ajudar a decidir o futuro das políticas públicas de Lajes Pintadas.
                        </p>
                        <a href="/servicos/ouvidoria" className="inline-flex items-center gap-2 bg-[#FDB913] text-blue-900 px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest shadow-lg hover:scale-105 transition-transform">
                            Fale com a Ouvidoria
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
