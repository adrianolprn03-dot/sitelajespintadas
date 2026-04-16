import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { FaBook } from "react-icons/fa";
import ExportButtons from "@/components/transparencia/ExportButtons";
import CartaServicosClient from "@/components/transparencia/CartaServicosClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Carta de Serviços | Portal da Transparência",
    description: "Guia completo de serviços prestados pela Prefeitura de Lajes Pintadas – RN ao cidadão conforme o PNTP 2026.",
};

export default async function CartaServicosTransparencyPage() {
    const servicos = await prisma.servicoCarta.findMany({
        orderBy: { categoria: "asc" }
    });

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Carta de Serviços ao Cidadão"
                subtitle="O seu guia para entender como acessar e utilizar os serviços públicos municipais conforme as diretrizes do PNTP 2026."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Carta de Serviços" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Serviços Disponíveis</h2>
                    <ExportButtons data={servicos} filename="carta_servicos_lajes_pintadas" />
                </div>

                {/* Disclaimer PNTP 2026 */}
                <div className="mb-16 bg-white rounded-[3rem] p-12 shadow-xl shadow-gray-200/40 border border-white flex flex-col md:flex-row items-center gap-10">
                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner">
                        <FaBook size={36} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-4">Carta de Serviços ao Usuário</h4>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium">
                            Este documento informa sobre os serviços prestados pela prefeitura, as formas de acesso, 
                            os compromissos e padrões de qualidade de atendimento ao público, conforme exigido pela 
                            Lei Federal nº 13.460/2017 e os critérios de transparência do PNTP 2026.
                        </p>
                    </div>
                </div>

                {/* Componente Interativo com Filtros e Modal */}
                <CartaServicosClient servicos={JSON.parse(JSON.stringify(servicos))} />
            </div>
        </div>
    );
}
