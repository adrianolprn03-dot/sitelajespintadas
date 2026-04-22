const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const total = await prisma.diaria.count();
  const withUrl = await prisma.diaria.count({
    where: {
      portariaUrl: {
        not: null,
        not: '',
      }
    }
  });

  console.log(`Total diárias: ${total}`);
  console.log(`Diárias com portariaUrl: ${withUrl}`);
  
  if (total > 0) {
    const sample = await prisma.diaria.findFirst({
      select: {
        id: true,
        servidor: true,
        portariaUrl: true
      }
    });
    console.log('Exemplo de registro:', sample);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
