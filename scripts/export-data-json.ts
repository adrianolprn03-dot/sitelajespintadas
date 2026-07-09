import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

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

    const dumpData: Record<string, any[]> = {};

    console.log("Iniciando exportação dos dados de todas as tabelas...");

    for (const table of tables) {
        try {
            const records = await (prisma as any)[table].findMany();
            dumpData[table] = records;
            console.log(`- ${table}: ${records.length} registros exportados`);
        } catch (err: any) {
            console.error(`Erro ao exportar tabela ${table}:`, err.message);
        }
    }

    const outputPath = path.join(process.cwd(), "db_data_dump.json");
    fs.writeFileSync(outputPath, JSON.stringify(dumpData, null, 2), "utf-8");
    console.log(`\nExportação concluída! Arquivo salvo em: ${outputPath}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
