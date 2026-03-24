import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ListaDocumentosClient from "@/components/ListaDocumentosClient";

export const metadata: Metadata = {
    title: "Transparência Fiscal (LRF) | Prefeitura de Lajes Pintadas – RN",
    description: "Relatórios Resumidos de Execução Orçamentária e Relatórios de Gestão Fiscal (LRF).",
};

export default function LRFPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Transparência Fiscal (LRF)"
                subtitle="RREO e RGF publicados em atendimento à Lei Complementar 101/2000"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Fiscal (LRF)" }
                ]}
            />
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["LRF – LC 101/2000", "LAI – Lei 12.527/2011", "PNTP 2025"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>
            <ListaDocumentosClient tipoDocumento="lrf" tituloVazio="Nenhum relatório fiscal" />
        </div>
    );
}
