import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ListaDocumentosClient from "@/components/ListaDocumentosClient";
import { FaBuildingColumns } from "react-icons/fa6";

export const metadata: Metadata = {
    title: "PCG - Prestação de Contas de Governo | Prefeitura de Lajes Pintadas – RN",
    description: "Prestação de Contas Anual de Governo do Município, incluindo Balanço-Geral e relatórios consolidados.",
};

export default function PCGPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Prestação de Contas de Governo (PCG)"
                subtitle="Transparência total sobre a gestão anual e a saúde financeira do município."
                variant="premium"
                icon={<FaBuildingColumns />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "PCG" }
                ]}
            />

            {/* Listagem de Documentos - Estilo Padronizado */}
            <div className="pt-0">
                <ListaDocumentosClient 
                    tipoDocumento="pcg" 
                    tituloVazio="Nenhuma Prestação de Contas encontrada" 
                />
            </div>
        </div>
    );
}
