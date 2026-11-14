export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { FaClinicMedical } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import UnidadesSaudeCatalog from "@/components/transparencia/UnidadesSaudeCatalog";
import { getUnidadesSaudeAtivas } from "@/lib/unidades-server";

export const metadata: Metadata = {
    title: "Unidades de Saúde | Prefeitura Municipal de Lajes Pintadas",
    description:
        "Endereços, telefones, horários de funcionamento, especialidades, médicos, enfermeiros e serviços disponíveis nas unidades de saúde do município.",
};

export default async function UnidadesDeSaudePage() {
    const unidades = await getUnidadesSaudeAtivas();

    return (
        <div className="bg-[#FAFBFD] min-h-screen pb-16">
            <PageHeader
                title="Unidades de Saúde"
                subtitle="Rede Municipal de Atenção Básica e Pronto Atendimento: consulte locais, horários de funcionamento, serviços ofertados, especialidades e profissionais de plantão ou rotina."
                icon={<FaClinicMedical />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Serviços", href: "/servicos/saude" },
                    { label: "Unidades de Saúde" },
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
                <UnidadesSaudeCatalog initialUnidades={unidades} />
            </div>

            <div className="mt-14">
                <BannerPNTP
                    criterio="18.2"
                    requisito="Serviços de saúde com indicação de local, horário, especialidades e profissionais"
                    status="Atende 100%"
                />
            </div>
        </div>
    );
}
