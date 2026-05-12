import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ListaDocumentosClient from "@/components/ListaDocumentosClient";

export const metadata: Metadata = {
    title: "Plano Anual de Contratação | Prefeitura de Lajes Pintadas – RN",
    description: "Plano Anual de Contratações (PAC) da Administração Municipal.",
};

export default function PlanoContratacaoPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Plano Anual de Contratação"
                subtitle="Documento que consolida as contratações e compras planejadas para o ano"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Plano de Contratação" }
                ]}
            />
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Nova Lei de Licitações (14.133/2021)", "Transparência de Compras", "PNTP 2026"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>
            <ListaDocumentosClient tipoDocumento="plano-contratacao" tituloVazio="Nenhum Plano Anual de Contratação encontrado" />
        </div>
    );
}
