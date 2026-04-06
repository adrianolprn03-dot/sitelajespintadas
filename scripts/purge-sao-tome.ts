import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function purge() {
    console.log("🔥 Iniciando limpeza de registros de São Tomé...");

    // IBGE de São Tomé: 2412203
    // IBGE de Lajes Pintadas: 2406601

    const models = [
        'usuario', 'secretaria', 'fAQ', 'legislacao', 
        'unidadeAtendimento', 'conselho', 'linkExterno', 
        'configuracao', 'obra', 'noticia'
    ];

    for (const model of models) {
        try {
            console.log(`Checking ${model}...`);
            const records = await (prisma as any)[model].findMany();
            
            for (const record of records) {
                const str = JSON.stringify(record);
                if (str.includes("São Tomé") || str.includes("saotome") || str.includes("2412203")) {
                    console.log(`  Deleting ${model} ID: ${record.id || record.chave}`);
                    await (prisma as any)[model].delete({
                        where: record.id ? { id: record.id } : { chave: record.chave }
                    });
                }
            }
        } catch (e) {
            console.error(`Error purging ${model}:`, e.message);
        }
    }

    console.log("✅ Limpeza concluída!");
}

purge()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
