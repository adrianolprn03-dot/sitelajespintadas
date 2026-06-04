import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.noticia.deleteMany();
  console.log("Todas as notícias foram apagadas!");
}

main().finally(() => prisma.$disconnect());
