export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { FaUsers } from "react-icons/fa";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import ConselhosClient, { ConselhoPublico } from "@/components/transparencia/ConselhosClient";

export const metadata: Metadata = {
    title: "Conselhos Municipais | Portal da Transparência",
    description:
        "Composição atualizada, mandatos, regimentos, contatos e atas dos Conselhos Municipais de Saúde (18.6), FUNDEB (19.3) e Assistência Social (19.4).",
};

export default async function ConselhosPage() {
    const raw = await prisma.conselho.findMany({
        where: { ativo: true },
        orderBy: { nome: "asc" },
        include: {
            atas: {
                orderBy: { dataReuniao: "desc" },
            },
        },
    });

    const conselhos: ConselhoPublico[] = raw.map((c) => ({
        id: c.id,
        nome: c.nome,
        sigla: c.sigla,
        tipo: c.tipo,
        descricao: c.descricao,
        composicao: c.composicao,
        presidente: c.presidente,
        email: c.email,
        mandatoVigencia: c.mandatoVigencia,
        atoNomeacao: c.atoNomeacao,
        regimentoInternoUrl: c.regimentoInternoUrl,
        calendarioReunioes: c.calendarioReunioes,
        atualizadoEm: (c.dataUltimaConferencia ?? c.criadoEm).toISOString(),
        atas: c.atas.map((a) => ({
            id: a.id,
            titulo: a.titulo,
            dataReuniao: a.dataReuniao.toISOString(),
            arquivo: a.arquivo,
        })),
    }));

    return (
        <div className="bg-[#FAFBFD] min-h-screen pb-16">
            <PageHeader
                title="Conselhos Municipais e Controle Social"
                subtitle="Composição atualizada por segmentos, atas de reunião, calendários e regimentos do Conselho Municipal de Saúde (18.6), Conselho do FUNDEB (19.3) e Assistência Social (19.4)."
                icon={<FaUsers />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Conselhos Municipais" },
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
                <ConselhosClient conselhos={conselhos} />
            </div>

            <div className="mt-14">
                <BannerPNTP
                    criterio="18.6, 19.3 e 19.4"
                    requisito="Divulgação da composição atual e funcionamento dos Conselhos de Saúde, FUNDEB e Assistência Social"
                    status="Atendimento Completo PNTP 2026"
                />
            </div>
        </div>
    );
}
