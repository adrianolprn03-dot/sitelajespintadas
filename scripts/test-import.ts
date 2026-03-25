import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
    console.log("--- Teste de API (Simulação) ---");
    const ppa = await prisma.legislacao.findMany({ where: { tipo: "PPA" } });
    console.log(`PPAs encontrados: ${ppa.length}`);
    
    const ldo = await prisma.legislacao.findMany({ where: { tipo: "LDO" } });
    console.log(`LDOs encontrados: ${ldo.length}`);
    
    const loa = await prisma.legislacao.findMany({ where: { tipo: "LOA" } });
    console.log(`LOAs encontrados: ${loa.length}`);

    if (ppa.length > 0 && ldo.length > 0 && loa.length > 0) {
        console.log("✅ Teste bem-sucedido! Todos os tipos estão presentes.");
    } else {
        console.log("❌ Algo deu errado na importação.");
    }
}

test().finally(() => prisma.$disconnect());
