import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PlanoSaudeClientPage from "@/components/transparencia/PlanoSaudeClientPage";

export const metadata: Metadata = {
    title: "Relatório Anual de Gestão (RAG) | Prefeitura de Lajes Pintadas – RN",
    description: "Relatório Anual de Gestão (RAG) da Saúde do município de Lajes Pintadas – RN.",
};

export default function RelatorioAnualGestaoPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Relatório Anual de Gestão (RAG)"
                subtitle="Prestação de contas anual comprobatória da execução da Programação Anual de Saúde e parecer do CMS"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Relatório Anual de Gestão" }
                ]}
            />
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Lei Orgânica da Saúde (8.080/90)", "Prestação de Contas SUS", "Aprovação CMS", "PNTP 2026"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>
            
            <PlanoSaudeClientPage categoriaInicial="rag" />
        </div>
    );
}
