import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import ConcursosClient from "./_ConcursosClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
    title: "Concursos e Seleções | Portal da Transparência",
    description: "Acompanhe todos os editais de concursos públicos e processos seletivos da Prefeitura de Lajes Pintadas.",
};

export default async function ConcursosTransparencyPage() {
    // Busca inicial de concursos do tipo "concurso"
    const initialData = await prisma.concurso.findMany({
        where: { 
            tipo: { in: ["concurso", "Concurso Público"] },
            ativo: true 
        },
        orderBy: { dataPublicacao: "desc" },
        take: 50 // Lote inicial
    });

    // Converter datas para string para evitar problemas de serialização
    const formattedData = initialData.map(item => ({
        ...item,
        dataPublicacao: item.dataPublicacao.toISOString(),
        criadoEm: item.criadoEm.toISOString(),
    }));

    return (
        <ConcursosClient 
            initialData={formattedData as any} 
            typeFilter="concurso"
            title="Concursos Públicos"
            subtitle="Editais, convocações e resultados dos concursos efetivos da Prefeitura."
        />
    );
}
