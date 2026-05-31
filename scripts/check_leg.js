const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.legislacao.findMany({take: 5}).then(l => {
    console.log("Legislacao arquivos:");
    console.log(l.map(x => x.arquivo));
    prisma.$disconnect();
});
