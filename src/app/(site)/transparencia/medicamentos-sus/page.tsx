import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { FaPrescriptionBottleMedical } from "react-icons/fa6";
import MedicamentosSUSClient from "@/components/transparencia/MedicamentosSUSClient";
import { getOrientacoesMedicamentosFromDb } from "@/lib/assistencia-farmaceutica.server";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
    title: "Lista e Estoque de Medicamentos SUS (REMUME) | Portal da Transparência",
    description:
        "Relação Municipal de Medicamentos Essenciais (REMUME), acesso a medicamentos básicos e de alto custo (CEAF) e orientações da Assistência Farmacêutica.",
};

function parseAbaInicial(abaParam?: string): "lista" | "como-obter" | "especializado" {
    if (abaParam === "como-obter" || abaParam === "especializado") {
        return abaParam;
    }
    return "lista";
}

export default async function MedicamentosSUSPage({
    searchParams,
}: {
    searchParams?: { aba?: string };
}) {
    let medicamentos: any[] = [];
    const [medsResult, orientacoes] = await Promise.all([
        prisma.medicamento
            .findMany({
                where: { ativo: true },
                orderBy: { nome: "asc" },
            })
            .catch(() => []),
        getOrientacoesMedicamentosFromDb(),
    ]);

    medicamentos = JSON.parse(JSON.stringify(medsResult));
    const abaInicial = parseAbaInicial(searchParams?.aba);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif] pb-24">
            <PageHeader
                title="Medicamentos SUS e Estoque (REMUME)"
                subtitle="Relação Municipal de Medicamentos Essenciais, disponibilidade na rede e guia oficial para obtenção de medicamentos básicos e de alto custo (CEAF)."
                variant="premium"
                icon={<FaPrescriptionBottleMedical />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Medicamentos SUS" },
                ]}
            />

            <main className="max-w-[1240px] mx-auto px-6 pt-12 relative z-30">
                <MedicamentosSUSClient
                    medicamentos={medicamentos}
                    orientacoes={orientacoes}
                    abaInicial={abaInicial}
                />
            </main>
        </div>
    );
}
