const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.legislacao.findMany({}).then(l => {
    console.log(Array.from(new Set(l.map(x => { 
        if (!x.arquivo) return null;
        try { 
            return new URL(x.arquivo).pathname.split('/')[1] 
        } catch(e) { 
            return x.arquivo.split('/')[1] 
        } 
    }))));
    prisma.$disconnect();
});
