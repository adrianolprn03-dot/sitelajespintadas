export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { FaSchool } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import UnidadesEscolaresCatalog from "@/components/transparencia/UnidadesEscolaresCatalog";
import { getDadosEducacaoPublica } from "@/lib/unidades-server";

export const metadata: Metadata = {
    title: "Unidades Escolares e Creches | Portal da Transparência",
    description:
        "Rede pública municipal de ensino (escolas e creches), etapas ofertadas, horários, fila de espera e critérios de priorização (PNTP 2026 - Item 19.2).",
};

export default async function UnidadesEscolaresPage() {
    const dados = await getDadosEducacaoPublica();

    return (
        <div className="bg-[#FAFBFD] min-h-screen pb-16">
            <PageHeader
                title="Unidades Escolares, Creches e Lista de Espera"
                subtitle="Relação completa de escolas e creches municipais, etapas de ensino, horários, critérios de priorização de vagas e situação da fila de espera em creches públicas (PNTP 2026 - Item 19.2)."
                icon={<FaSchool />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Educação", href: "/transparencia/educacao" },
                    { label: "Unidades Escolares" },
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
                <UnidadesEscolaresCatalog
                    unidades={dados.unidades}
                    declaracao={dados.declaracao}
                    criterios={dados.criterios}
                    filaAguardando={dados.filaAguardando}
                />
            </div>

            <div className="mt-14">
                <BannerPNTP
                    criterio="19.2"
                    requisito="Divulgação das creches/escolas, lista de espera e critérios legais de priorização"
                    status="Atende 100%"
                />
            </div>
        </div>
    );
}
