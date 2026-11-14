import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { FaClock } from "react-icons/fa";
import { prisma } from "@/lib/prisma";
import SaudeMedicamentosTable from "@/components/transparencia/SaudeMedicamentosTable";

export const metadata: Metadata = {
    title: "Saúde e Medicamentos | Portal da Transparência",
    description: "Relação Municipal de Medicamentos Essenciais (REMUME) e disponibilidade atualizada.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SaudeTransparencyPage() {
    const medicamentosRaw = await prisma.medicamento.findMany({
        where: { ativo: true },
        orderBy: { nome: "asc" }
    });
    const medicamentos = JSON.parse(JSON.stringify(medicamentosRaw));

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Saúde e Medicamentos"
                subtitle="Consulta à disponibilidade de medicamentos na rede municipal de saúde (REMUME)."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Saúde e Medicamentos" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                <div className="mb-12 bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex items-center justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                            <FaClock size={18} />
                        </div>
                        <div>
                            <h4 className="text-emerald-900 font-black uppercase text-xs tracking-tight mb-1">Última Atualização do Estoque</h4>
                            <p className="text-emerald-700/80 text-sm font-medium">As informações abaixo são sincronizadas diariamente com o Almoxarifado Central da Saúde.</p>
                        </div>
                    </div>
                </div>

                <SaudeMedicamentosTable medicamentos={medicamentos} />
            </div>
        </div>
    );
}
