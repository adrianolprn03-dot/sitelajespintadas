import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const configs = await prisma.configuracao.findMany();
    console.log(JSON.stringify(configs, null, 2));
}

main().finally(() => prisma.$disconnect());
