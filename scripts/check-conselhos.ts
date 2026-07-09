import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const conselhos = await prisma.conselho.findMany();
    console.log("Conselhos in DB:", JSON.stringify(conselhos, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
