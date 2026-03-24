import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ListaDocumentosClient from "@/components/ListaDocumentosClient";

export const metadata: Metadata = {
    title: "Relatório de Gestão e Atividades | Prefeitura de Lajes Pintadas – RN",
    description: "Relatórios anuais de gestão e atividades consolidadas do Município.",
};

export default function RelatorioGestaoPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Relatório de Gestão e Atividades"
                subtitle="Documento que congrega os resultados da gestão pública ao longo do exercício"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Relatório de Gestão" }
                ]}
            />
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Eficiência Pública", "Auditoria de Gestão", "PNTP 2025"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>
            <ListaDocumentosClient tipoDocumento="relatorio-gestao" tituloVazio="Nenhum Relatório de Gestão encontrado" />
        </div>
    );
}
