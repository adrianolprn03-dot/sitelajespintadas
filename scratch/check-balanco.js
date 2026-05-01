const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const relatorios = await prisma.relatorioFiscal.findMany({
    where: { tipo: 'BALANCO' }
  });
  console.log(JSON.stringify(relatorios, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
