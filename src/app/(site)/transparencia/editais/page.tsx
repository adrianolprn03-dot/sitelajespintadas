import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import ConcursosClient from "../concursos/_ConcursosClient";

export const metadata: Metadata = {
    title: "Editais Diversos | Portal da Transparência",
    description: "Acompanhe todos os editais de chamamento, notificações e outros processos públicos da Prefeitura de Lajes Pintadas.",
};

export default async function EditaisTransparencyPage() {
    // Busca inicial de concursos do tipo "Edital"
    const initialData = await prisma.concurso.findMany({
        where: { 
            tipo: { in: ["edital", "Edital"] },
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
            typeFilter="edital"
            title="Editais Diversos"
            subtitle="Editais de chamamento, notificações e processos públicos diversos da Prefeitura."
        />
    );
}
