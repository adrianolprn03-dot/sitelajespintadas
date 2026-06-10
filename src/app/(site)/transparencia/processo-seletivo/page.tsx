import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import ConcursosClient from "../concursos/_ConcursosClient";
import { MUNICIPIO } from "@/config/municipio";

export const metadata: Metadata = {
    title: "Processos Seletivos | Portal da Transparência",
    description: `Acompanhe os Processos Seletivos Simplificados (PSS) da Prefeitura de ${MUNICIPIO.nome}.`,
};

export default async function ProcessoSeletivoPage() {
    // Busca inicial de concursos do tipo PSS
    const initialData = await prisma.concurso.findMany({
        where: { 
            tipo: { in: ["pss", "processo-seletivo"] },
            ativo: true 
        },
        orderBy: { dataPublicacao: "desc" },
        take: 50
    });

    const formattedData = initialData.map(item => ({
        ...item,
        dataPublicacao: item.dataPublicacao.toISOString(),
        criadoEm: item.criadoEm.toISOString(),
    }));

    return (
        <ConcursosClient 
            initialData={formattedData as any} 
            typeFilter="pss"
            title="Processos Seletivos"
            subtitle="Editais, convocações e resultados de contratações temporárias e PSS."
            specialBannerText={`A Prefeitura Municipal de ${MUNICIPIO.nome} informa que não realizou processo seletivo para o período de 01/01/2021 à 21/04/2026.`}
        />
    );
}
