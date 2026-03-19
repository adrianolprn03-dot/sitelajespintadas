import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function check() {
    console.log("--- Verificando FAQ ---");
    const faqCount = await prisma.fAQ.count();
    const faqs = await prisma.fAQ.findMany({ where: { id: { startsWith: 'faq-lai' } } });
    console.log(`Total de FAQs: ${faqCount}`);
    console.log(`FAQs da LAI encontrados: ${faqs.length}`);

    console.log("\n--- Verificando Glossário ---");
    const glossarioCount = await (prisma as any).glossario.count();
    const termos = await (prisma as any).glossario.findMany({ where: { id: { startsWith: 'term-' } } });
    console.log(`Total de Termos: ${glossarioCount}`);
    console.log(`Termos técnicos novos: ${termos.length}`);

    console.log("\n--- Verificando Links Externos ---");
    const links = await (prisma as any).linkExterno.findMany({ where: { ativo: true } });
    console.log(`Links externos ativos: ${links.length}`);
    links.forEach((l: any) => {
        console.log(`ID: ${l.id}`);
        console.log(`- Titulo: ${l.titulo}`);
        console.log(`- ModuloAlvo: [${l.moduloAlvo}]`);
        console.log(`- Categoria: [${l.categoria}]`);
    });
}

check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
