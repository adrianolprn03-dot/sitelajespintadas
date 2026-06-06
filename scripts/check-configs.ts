import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const configs = await prisma.configuracao.findMany({
        select: {
            chave: true,
            valor: true,
            grupo: true
        }
    });
    const formatted = configs.map(c => ({
        chave: c.chave,
        valor: c.valor.length > 80 ? c.valor.substring(0, 80) + "..." : c.valor,
        grupo: c.grupo
    }));
    console.table(formatted);
}

main().finally(() => prisma.$disconnect());
