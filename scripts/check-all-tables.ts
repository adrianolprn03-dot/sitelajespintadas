import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const tables = [
        "usuario",
        "secretaria",
        "noticia",
        "licitacao",
        "contrato",
        "convenio",
        "diaria",
        "servidor",
        "receita",
        "despesa",
        "documento",
        "evento",
        "contato",
        "ouvidoria",
        "esic",
        "cidadaoEsic",
        "galeriaFoto",
        "obra",
        "fAQ",
        "glossario",
        "legislacao",
        "unidadeAtendimento",
        "conselho",
        "conselhoAta",
        "importacaoCSV",
        "linkExterno",
        "configuracao",
        "medicamento",
        "veiculo",
        "emendaParlamentar",
        "concurso",
        "servicoCarta",
        "avaliacaoServico",
        "relatorioFiscal",
        "pagamento",
        "renunciaFiscal",
        "quadroServidor",
        "emendaPix",
        "pesquisaSatisfacao",
        "estagiario",
        "terceirizado"
    ];

    console.log("Checking row counts for all tables...");
    for (const table of tables) {
        try {
            const count = await (prisma as any)[table].count();
            console.log(`- ${table}: ${count} rows`);
        } catch (err: any) {
            console.error(`Failed to count table ${table}:`, err.message);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
