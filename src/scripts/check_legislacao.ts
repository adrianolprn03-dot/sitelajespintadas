
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const legislacoes = await prisma.legislacao.findMany({
        take: 10,
        orderBy: { ano: 'desc' }
    });
    console.log(JSON.stringify(legislacoes, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
