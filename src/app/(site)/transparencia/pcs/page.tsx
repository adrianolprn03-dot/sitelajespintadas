import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ListaDocumentosClient from "@/components/ListaDocumentosClient";
import { FaBuildingColumns } from "react-icons/fa6";

export const metadata: Metadata = {
    title: "PCS - Prestação de Contas de Gestão | Prefeitura de Lajes Pintadas – RN",
    description: "Prestação de Contas de Gestão dos ordenadores de despesa do Município.",
};

export default function PCSPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Prestação de Contas de Gestão (PCS)"
                subtitle="Relatórios anuais dos administradores e demais responsáveis por bens e valores públicos."
                variant="premium"
                icon={<FaBuildingColumns />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "PCS" }
                ]}
            />

            <div className="pt-0">
                <ListaDocumentosClient 
                    tipoDocumento="pcs" 
                    tituloVazio="Nenhuma Prestação de Contas de Gestão encontrada" 
                />
            </div>
        </div>
    );
}
