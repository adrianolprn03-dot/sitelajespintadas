import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function findSaoTome() {
    const models = [
        'usuario', 'secretaria', 'noticia', 'licitacao', 'contrato', 
        'convenio', 'diaria', 'servidor', 'receita', 'despesa', 
        'documento', 'evento', 'contato', 'ouvidoria', 'esic', 
        'cidadaoEsic', 'galeriaFoto', 'obra', 'fAQ', 'glossario', 
        'legislacao', 'unidadeAtendimento', 'conselho', 'conselhoAta', 
        'importacaoCSV', 'linkExterno', 'configuracao', 'medicamento', 
        'veiculo', 'emendaParlamentar', 'concurso', 'servicoCarta', 
        'relatorioFiscal'
    ];

    console.log("--- Procurando por 'São Tomé' ou IBGE '2412203' ---");

    for (const model of models) {
        try {
            const records = await (prisma as any)[model].findMany();
            const strRecords = JSON.stringify(records);
            if (strRecords.includes("São Tomé") || strRecords.includes("saotome") || strRecords.includes("2412203")) {
                console.log(`[!] Encontrado em: ${model}`);
                // Print a sample
                const found = records.filter((r: any) => 
                    JSON.stringify(r).includes("São Tomé") || 
                    JSON.stringify(r).includes("saotome") || 
                    JSON.stringify(r).includes("2412203")
                );
                console.log(`    - Registros afetados: ${found.length}`);
            }
        } catch (e) {
            // some models might not be accessible via (prisma as any)[model]
        }
    }
}

findSaoTome()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
