import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const modulos = [
    { titulo: "Receitas Públicas", href: "/transparencia/receitas" },
    { titulo: "Despesas Públicas", href: "/transparencia/despesas" },
];

async function simulate() {
    const linksExternos = await (prisma as any).linkExterno.findMany({
        where: {
            ativo: true,
            categoria: { in: ["transparencia", "geral"] }
        }
    });

    console.log(`Links recuperados para Transparência: ${linksExternos.length}`);
    
    modulos.forEach(m => {
        const identifier = m.href.split("/").pop();
        const override = linksExternos.find((l: any) => l.moduloAlvo === identifier);
        
        console.log(`Módulo: ${m.titulo}`);
        console.log(`- Identifier extraído: "${identifier}"`);
        if (override) {
            console.log(`- ✅ OVERRIDE ENCONTRADO! Redirecionando para: ${override.url}`);
        } else {
            console.log(`- ❌ Nenhum override. Link padrão: ${m.href}`);
        }
    });
}

simulate().finally(() => prisma.$disconnect());
