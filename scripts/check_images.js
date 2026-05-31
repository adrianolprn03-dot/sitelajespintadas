const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.noticia.findMany({take: 5}).then(n => {
    console.log(n.map(x => x.imagem));
    prisma.$disconnect();
});
