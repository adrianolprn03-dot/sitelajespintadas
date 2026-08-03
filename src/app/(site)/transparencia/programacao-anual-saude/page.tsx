import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PlanoSaudeClientPage from "@/components/transparencia/PlanoSaudeClientPage";

export const metadata: Metadata = {
    title: "Programação Anual de Saúde (PAS) | Prefeitura de Lajes Pintadas – RN",
    description: "Programação Anual de Saúde (PAS) com metas, ações e alocação de recursos do SUS no município de Lajes Pintadas – RN.",
};

export default function ProgramacaoAnualSaudePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Programação Anual de Saúde (PAS)"
                subtitle="Instrumento de planejamento anual de metas, ações e alocação de recursos da Saúde pública municipal"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Programação Anual de Saúde" }
                ]}
            />
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Lei Orgânica da Saúde (8.080/90)", "Conselho Municipal de Saúde (CMS)", "Metas do Exercício", "PNTP 2026"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>
            
            <PlanoSaudeClientPage categoriaInicial="pas" />
        </div>
    );
}
