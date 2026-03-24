import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ListaDocumentosClient from "@/components/ListaDocumentosClient";

export const metadata: Metadata = {
    title: "PCG - Prestação de Contas de Governo | Prefeitura de Lajes Pintadas – RN",
    description: "Prestação de Contas Anual de Governo do Município.",
};

export default function PCGPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Prestação de Contas de Governo (PCG)"
                subtitle="Balanço-Geral e Relatório do Controle Interno referentes ao balanço consolidado de governo"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "PCG" }
                ]}
            />
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Art. 71, CRFB/88", "Lei de Responsabilidade Fiscal", "PNTP 2025"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>
            <ListaDocumentosClient tipoDocumento="pcg" tituloVazio="Nenhuma Prestação de Contas de Governo encontrada" />
        </div>
    );
}
