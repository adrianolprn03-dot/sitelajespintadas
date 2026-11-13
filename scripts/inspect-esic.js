const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const records = await prisma.esic.findMany();
    for (const r of records) {
        console.log(`[${r.protocolo}] Grau: ${r.grauSigilo} | Orgão: ${r.orgao} | Pedido: ${r.pedido} | Status: ${r.status} | DataClass: ${r.dataClassificacao} | DataDesclass: ${r.dataDesclassificacao} | Fundamento: ${r.fundamentoSigilo}`);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());

