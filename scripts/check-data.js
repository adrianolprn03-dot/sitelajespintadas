const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const unidades = await prisma.unidadeAtendimento.findMany();
    console.log("Unidades:", unidades.length);
    const fila = await prisma.filaEsperaCreche.findMany();
    console.log("Fila espera creche:", fila.length);
    const declaracoes = await prisma.declaracaoTransparencia.findMany();
    console.log("Declaracoes:", declaracoes.length);
    const criterios = await prisma.criterioPNTP.findMany();
    console.log("Criterios PNTP:", criterios.length);
    const esic = await prisma.esic.findMany();
    console.log("Esic:", esic.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
