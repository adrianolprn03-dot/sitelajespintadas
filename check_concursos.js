const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const concursos = await prisma.concurso.findMany({
        where: { ativo: true },
        select: { id: true, titulo: true, tipo: true, dataPublicacao: true, status: true }
    });
    console.log(concursos);
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
