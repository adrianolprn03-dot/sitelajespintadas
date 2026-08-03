import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { FaPrescriptionBottleMedical } from "react-icons/fa6";
import MedicamentosSUSClient from "@/components/transparencia/MedicamentosSUSClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Lista de Medicamentos SUS (REMUME) | Portal da Transparência",
    description: "Relação Municipal de Medicamentos Essenciais (REMUME) e orientações do Componente Básico da Assistência Farmacêutica.",
};

export default async function MedicamentosSUSPage() {
    const medicamentos = await prisma.medicamento.findMany({
        where: { ativo: true },
        orderBy: { nome: "asc" }
    });

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif] pb-24">
            <PageHeader
                title="Lista de Medicamentos SUS"
                subtitle="Consulte a Relação Municipal de Medicamentos Essenciais (REMUME) e orientações de dispensação da Assistência Farmacêutica."
                variant="premium"
                icon={<FaPrescriptionBottleMedical />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Medicamentos SUS" }
                ]}
            />

            <main className="max-w-[1240px] mx-auto px-6 pt-12 relative z-30">
                <MedicamentosSUSClient medicamentos={medicamentos} />
            </main>
        </div>
    );
}
