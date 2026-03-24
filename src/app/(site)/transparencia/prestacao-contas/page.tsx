import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ListaDocumentosClient from "@/components/ListaDocumentosClient";

export const metadata: Metadata = {
    title: "Prestação de Contas | Prefeitura de Lajes Pintadas – RN",
    description: "Extratos, balanços e prestação de contas do Município em conformidade com o PNTP.",
};

export default function PrestacaoContasPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Prestação de Contas"
                subtitle="Consulta aos balanços, relatórios contábeis e prestações de contas do Município"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Prestação de Contas" }
                ]}
            />
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Lei de Responsabilidade Fiscal", "LAI – Lei 12.527/2011", "PNTP 2025"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>
            <ListaDocumentosClient tipoDocumento="prestacao-contas" tituloVazio="Nenhuma prestação de contas" />
        </div>
    );
}
