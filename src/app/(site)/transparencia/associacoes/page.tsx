import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ListaDocumentosClient from "@/components/ListaDocumentosClient";

export const metadata: Metadata = {
    title: "Associações e Parcerias | Prefeitura de Lajes Pintadas – RN",
    description: "Relação de associações municipais parcerias da prefeitura.",
};

export default function AssociacoesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Associações e Terceiro Setor"
                subtitle="Monitoramento e relação de repasses a associações e entidades sem fins lucrativos"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Associações" }
                ]}
            />
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["MROSC – Lei 13.019/2014", "Fomento e Colaboração", "PNTP 2026"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>
            <ListaDocumentosClient tipoDocumento="associacoes" tituloVazio="Nenhuma parceria registrada no momento" />
        </div>
    );
}
