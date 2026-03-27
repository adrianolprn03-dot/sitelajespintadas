import { prisma } from "@/lib/prisma";
import SecretariasCarousel from "./SecretariasCarousel";

export default async function SecretariasSlider() {
    const secretarias = await prisma.secretaria.findMany({
        orderBy: { nome: 'asc' },
        select: {
            id: true,
            nome: true,
            slug: true,
            descricao: true,
            secretario: true
        }
    });

    if (secretarias.length === 0) return null;

    return <SecretariasCarousel secretarias={secretarias} />;
}
