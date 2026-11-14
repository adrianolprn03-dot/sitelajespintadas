export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { FaHospitalAlt } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import UnidadesSaudeCatalog from "@/components/transparencia/UnidadesSaudeCatalog";
import { getUnidadesSaudeAtivas } from "@/lib/unidades-server";

export const metadata: Metadata = {
    title: "Unidades de Saúde, Serviços e Profissionais | Portal da Transparência",
    description:
        "Rede municipal de saúde (UBS e UMS): localização, horários, serviços prestados, especialidades médicas e escalas de profissionais (PNTP 2026 - Item 18.2).",
};

export default async function TransparenciaUnidadesSaudePage() {
    const unidades = await getUnidadesSaudeAtivas();

    return (
        <div className="bg-[#FAFBFD] min-h-screen pb-16">
            <PageHeader
                title="Unidades de Saúde, Serviços e Equipes"
                subtitle="Transparência da Rede Municipal de Saúde (SUS): horários de atendimento, serviços ofertados, especialidades, médicos, enfermeiros, dentistas e locais (Cartilha PNTP 2026 - Item 18.2)."
                icon={<FaHospitalAlt />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Saúde", href: "/transparencia/saude" },
                    { label: "Unidades de Saúde" },
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
                <UnidadesSaudeCatalog initialUnidades={unidades} />
            </div>

            <div className="mt-14">
                <BannerPNTP
                    criterio="18.2"
                    requisito="Divulgação das unidades, horários, serviços, especialidades e profissionais prestadores de saúde"
                    status="Atendimento Integral • Dados em Tempo Real"
                />
            </div>
        </div>
    );
}
