import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Apagando todos os registros da tabela Noticia...');
  const result = await prisma.noticia.deleteMany({});
  console.log(`Deletados ${result.count} registros.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
