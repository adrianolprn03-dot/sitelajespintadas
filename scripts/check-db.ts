import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const counts = await prisma.legislacao.groupBy({
        by: ['tipo'],
        _count: {
            _all: true
        }
    });
    console.log("Counts by type:", JSON.stringify(counts, null, 2));

    const latest = await prisma.legislacao.findMany({
        take: 5,
        orderBy: { criadoEm: 'desc' }
    });
    console.log("Latest 5 records:", JSON.stringify(latest, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
