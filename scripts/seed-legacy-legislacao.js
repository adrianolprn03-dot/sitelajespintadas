const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    const data = JSON.parse(fs.readFileSync('legis.json', 'utf8'));
    console.log(`Carregando ${data.length} registros de legislação...`);

    let sucesso = 0;
    let erros = 0;

    for (const item of data) {
        try {
            // Find if already exists using some criteria since we don't have a specific unique index
            // We can match on: tipo + numero + ano.
            const existing = await prisma.legislacao.findFirst({
                where: {
                    tipo: item.tipo,
                    numero: item.numero,
                    ano: item.ano
                }
            });

            if (existing) {
                await prisma.legislacao.update({
                    where: { id: existing.id },
                    data: {
                        ementa: item.ementa,
                        arquivo: item.arquivo,
                        categoria: item.categoria,
                    }
                });
            } else {
                await prisma.legislacao.create({
                    data: item
                });
            }
            sucesso++;
        } catch (e) {
            console.error(`Erro ao inserir ${item.numero} (${item.tipo}):`, e.message);
            erros++;
        }
    }

    console.log(`Seed finalizado. Sucesso: ${sucesso}, Erros: ${erros}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
