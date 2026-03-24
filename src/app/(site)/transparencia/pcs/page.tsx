import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ListaDocumentosClient from "@/components/ListaDocumentosClient";

export const metadata: Metadata = {
    title: "PCS - Prestação de Contas de Gestão | Prefeitura de Lajes Pintadas – RN",
    description: "Prestação de Contas de Gestão dos ordenadores de despesa do Município.",
};

export default function PCSPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Prestação de Contas de Gestão (PCS)"
                subtitle="Relatórios dos administradores e demais responsáveis por dinheiros públicos"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "PCS" }
                ]}
            />
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Lei de Responsabilidade Fiscal", "Instruções Normativas TCE", "PNTP 2025"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>
            <ListaDocumentosClient tipoDocumento="pcs" tituloVazio="Nenhuma Prestação de Contas de Gestão encontrada" />
        </div>
    );
}
