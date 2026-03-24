import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ListaDocumentosClient from "@/components/ListaDocumentosClient";

export const metadata: Metadata = {
    title: "Plano Municipal de Saúde | Prefeitura de Lajes Pintadas – RN",
    description: "Diretrizes e metas do Plano Municipal de Saúde do Município.",
};

export default function PlanoSaudePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Plano Municipal de Saúde"
                subtitle="Planejamento quadrienal com diretrizes, metas e propostas para a saúde municipal"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Plano de Saúde" }
                ]}
            />
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Lei Orgânica da Saúde (8.080/90)", "SUS", "PNTP 2025"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>
            <ListaDocumentosClient tipoDocumento="plano-saude" tituloVazio="Nenhum Plano de Saúde encontrado" />
        </div>
    );
}
