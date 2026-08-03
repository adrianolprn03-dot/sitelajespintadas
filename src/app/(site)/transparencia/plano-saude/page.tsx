import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PlanoSaudeClientPage from "@/components/transparencia/PlanoSaudeClientPage";

export const metadata: Metadata = {
    title: "Plano Municipal de Saúde | Prefeitura de Lajes Pintadas – RN",
    description: "Plano Municipal de Saúde (PMS), Programação Anual (PAS), Relatório Anual de Gestão (RAG) e Relatórios Quadrimestrais (RDQA).",
};

export default function PlanoSaudePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Plano Municipal de Saúde"
                subtitle="Planejamento quadrienal com diretrizes, metas e prestações de contas da saúde municipal"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Plano de Saúde" }
                ]}
            />
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Lei Orgânica da Saúde (8.080/90)", "Conselho Municipal de Saúde (CMS)", "LC 141/2012", "PNTP 2026"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>
            
            <PlanoSaudeClientPage />
        </div>
    );
}

