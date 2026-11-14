export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { FaGraduationCap } from "react-icons/fa";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import PlanoEducacaoClientPage from "@/components/transparencia/PlanoEducacaoClientPage";

export const metadata: Metadata = {
    title: "Plano de Educação e Relatórios de Resultados | Transparência",
    description:
        "Plano Municipal de Educação (PME) e Relatórios de Monitoramento e Resultados com série histórica e exportação (Cartilha PNTP 2026 - Item 19.1).",
};

export default async function PlanoEducacaoPage() {
    const rawDocs = await prisma.documento.findMany({
        where: {
            ativo: true,
            tipo: { in: ["plano-educacao", "relatorio-plano-educacao"] },
        },
        orderBy: [{ ano: "desc" }, { criadoEm: "desc" }],
    });

    const docs = rawDocs.map((d) => ({
        id: d.id,
        titulo: d.titulo,
        descricao: d.descricao,
        tipo: d.tipo,
        orgaoResponsavel: d.orgaoResponsavel,
        arquivo: d.arquivo,
        documentUrl: d.documentUrl,
        arquivoEditavelUrl: d.arquivoEditavelUrl,
        ano: d.ano,
        competencia: d.competencia,
        criadoEm: d.criadoEm.toISOString(),
        atualizadoEm: d.atualizadoEm.toISOString(),
    }));

    return (
        <div className="bg-[#FAFBFD] min-h-screen pb-16">
            <PageHeader
                title="Plano Municipal de Educação e Relatórios de Resultados"
                subtitle="Acompanhamento das metas, estratégias decenais do PME e respectivos relatórios de monitoramento e avaliação educacional (Cartilha PNTP 2026 - Item 19.1)."
                icon={<FaGraduationCap />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Educação", href: "/transparencia/educacao" },
                    { label: "Plano de Educação (PME)" },
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-10">
                <PlanoEducacaoClientPage initialDocs={docs} />
            </div>

            <div className="mt-14">
                <BannerPNTP
                    criterio="19.1"
                    requisito="Divulgação do Plano Municipal de Educação e do respectivo relatório de resultados com série histórica e pesquisa"
                    status="Em Conformidade PNTP 2026"
                />
            </div>
        </div>
    );
}
