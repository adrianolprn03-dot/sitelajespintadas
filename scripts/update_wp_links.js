const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const R2_URL = process.env.R2_PUBLIC_URL;
    if (!R2_URL) {
        console.error("R2_PUBLIC_URL não definido.");
        return;
    }

    console.log("Atualizando Noticia...");
    const noticias = await prisma.noticia.findMany();
    let updatedNoticias = 0;
    for (const n of noticias) {
        if (n.conteudo.includes('/wp-content/uploads/')) {
            await prisma.noticia.update({
                where: { id: n.id },
                data: {
                    conteudo: n.conteudo.replace(/https?:\/\/(www\.)?lajespintadas\.rn\.gov\.br\/wp-content\/uploads\//g, `${R2_URL}/uploads/`)
                                      .replace(/\/wp-content\/uploads\//g, `${R2_URL}/uploads/`)
                }
            });
            updatedNoticias++;
        }
    }
    console.log(`Notícias atualizadas: ${updatedNoticias}`);

    console.log("Atualizando Legislacao...");
    const legs = await prisma.legislacao.findMany();
    let updatedLegs = 0;
    for (const l of legs) {
        if (l.arquivo && l.arquivo.includes('/wp-content/uploads/')) {
            await prisma.legislacao.update({
                where: { id: l.id },
                data: {
                    arquivo: l.arquivo.replace(/https?:\/\/(www\.)?lajespintadas\.rn\.gov\.br\/wp-content\/uploads\//g, `${R2_URL}/uploads/`)
                                      .replace(/\/wp-content\/uploads\//g, `${R2_URL}/uploads/`)
                }
            });
            updatedLegs++;
        }
    }
    console.log(`Legislações atualizadas: ${updatedLegs}`);

    console.log("Concluído!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
