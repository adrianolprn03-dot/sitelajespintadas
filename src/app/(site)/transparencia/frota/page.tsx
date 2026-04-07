import { prisma } from "@/lib/prisma";
import FrotaClient from "./_FrotaClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Frota Municipal | Portal da Transparência",
    description: "Relação de veículos e máquinas pesadas pertencentes ao patrimônio do município de Lajes Pintadas – RN.",
};

export default async function FrotaTransparencyPage() {
    const veiculos = await prisma.veiculo.findMany({
        where: { ativo: true },
        orderBy: { modelo: "asc" }
    });

    return <FrotaClient initialVeiculos={JSON.parse(JSON.stringify(veiculos))} />;
}
