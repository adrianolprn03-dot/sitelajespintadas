import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { FaHandsHelping, FaClock, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

export const metadata: Metadata = {
    title: "Centros Socioassistenciais | Prefeitura de Lajes Pintadas – RN",
    description: "CRAS, CREAS e Centros de Atenção Social na cidade de Lajes Pintadas",
};

export default async function SocioassistencialPage() {
    const unidades = await (prisma as any).unidadeAtendimento.findMany({
        where: { tipo: "Socioassistencial", ativa: true },
        orderBy: { nome: 'asc' }
    });

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Rede Socioassistencial"
                subtitle="Encontre os centros de referência, serviços de assistência e conselhos em Lajes Pintadas."
                variant="premium"
                icon={<FaHandsHelping />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "O Município", href: "/municipio" },
                    { label: "Serviço Social" }
                ]}
            />
            
            <div className="max-w-7xl mx-auto px-6 py-12 mb-20 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {unidades.map((unidade: any) => (
                        <div key={unidade.id} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl transition hover:-translate-y-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{unidade.nome}</h3>
                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-6">
                                {unidade.descricao}
                            </span>
                            
                            <div className="space-y-4 text-sm text-gray-600">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                        <FaMapMarkerAlt size={14} />
                                    </div>
                                    <span>{unidade.endereco}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                        <FaClock size={14} />
                                    </div>
                                    <span>{unidade.horario}</span>
                                </div>
                                {unidade.telefone && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                            <FaEnvelope size={14} />
                                        </div>
                                        <span>{unidade.telefone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
