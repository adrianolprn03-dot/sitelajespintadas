import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import QuadroServidoresClient from "./_QuadroServidoresClient";

export const metadata: Metadata = {
    title: "Quadro de Pessoal | Portal da Transparência",
    description: "Consulte o quadro geral de pessoal da Prefeitura de Lajes Pintadas, com vagas ocupadas e disponíveis.",
};

export default async function QuadroServidoresPage() {
    // Busca inicial de quadro de pessoal ativo
    const initialData = await prisma.quadroServidor.findMany({
        where: { ativo: true },
        orderBy: { cargo: "asc" }
    });

    return (
        <QuadroServidoresClient initialData={initialData as any} />
    );
}
