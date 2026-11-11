import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { FaPrescriptionBottleMedical } from "react-icons/fa6";
import MedicamentosSUSClient from "@/components/transparencia/MedicamentosSUSClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
    title: "Lista e Estoque de Medicamentos SUS (REMUME) | Portal da Transparência",
    description:
        "Relação Municipal de Medicamentos Essenciais (REMUME), controle de estoque atualizado a cada 15 dias e orientações da Assistência Farmacêutica.",
};

export default async function MedicamentosSUSPage() {
    let medicamentos: any[] = [];
    try {
        const medicamentosRaw = await prisma.medicamento.findMany({
            where: { ativo: true },
            orderBy: { nome: "asc" },
        });
        medicamentos = JSON.parse(JSON.stringify(medicamentosRaw));
    } catch {
        medicamentos = [];
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif] pb-24">
            <PageHeader
                title="Medicamentos SUS e Estoque (REMUME)"
                subtitle="Relação Municipal de Medicamentos Essenciais, estoque por unidade de saúde (atualização máxima a cada 15 dias - Critério PNTP 13.4) e orientações de acesso."
                variant="premium"
                icon={<FaPrescriptionBottleMedical />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Medicamentos SUS" },
                ]}
            />

            <main className="max-w-[1240px] mx-auto px-6 pt-12 relative z-30">
                <MedicamentosSUSClient medicamentos={medicamentos} />
            </main>
        </div>
    );
}
