import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { FaPrescriptionBottleMedical } from "react-icons/fa6";
import MedicamentosSUSClient from "@/components/transparencia/MedicamentosSUSClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
    title: "Lista de Medicamentos SUS (REMUME) | Portal da Transparência",
    description: "Relação Municipal de Medicamentos Essenciais (REMUME) e orientações do Componente Básico e Especializado da Assistência Farmacêutica.",
};

export default async function MedicamentosSUSPage() {
    const medicamentosRaw = await prisma.medicamento.findMany({
        where: { ativo: true },
        orderBy: { nome: "asc" }
    });

    // Converter objetos do Prisma (incluindo instancias de Date) em objetos JSON simples antes de enviar ao Client Component
    const medicamentos = JSON.parse(JSON.stringify(medicamentosRaw));

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
