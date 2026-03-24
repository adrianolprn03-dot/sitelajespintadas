import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ListaDocumentosClient from "@/components/ListaDocumentosClient";

export const metadata: Metadata = {
    title: "Parecer do Tribunal de Contas | Prefeitura de Lajes Pintadas – RN",
    description: "Pareceres Prévios emitidos pelo Tribunal de Contas do Estado (TCE-RN).",
};

export default function ParecerTCEPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Pareceres do Tribunal de Contas"
                subtitle="Pareceres Prévios emitidos pelo Tribunal de Contas do Estado sobre as contas do Chefe do Executivo"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Parecer TCE" }
                ]}
            />
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["TCE RN", "Constituição Federal", "PNTP 2025"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>
            <ListaDocumentosClient tipoDocumento="parecer-tce" tituloVazio="Nenhum Parecer Técnico encontrado" />
        </div>
    );
}
