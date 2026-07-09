import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Helper to convert ISO strings to Date objects
function parseDates(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === "string") {
        // Match ISO date format (e.g. 2026-06-09T14:49:37.000Z)
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(obj)) {
            return new Date(obj);
        }
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(parseDates);
    }
    if (typeof obj === "object") {
        const newObj: any = {};
        for (const key of Object.keys(obj)) {
            newObj[key] = parseDates(obj[key]);
        }
        return newObj;
    }
    return obj;
}

async function main() {
    const filePath = path.join(process.cwd(), "db_data_dump.json");
    if (!fs.existsSync(filePath)) {
        console.error("Arquivo db_data_dump.json não encontrado!");
        return;
    }

    console.log("Lendo arquivo de dump...");
    const rawData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const data = parseDates(rawData);

    // List tables in order of deletion (child/dependent tables first)
    const deleteOrder = [
        "avaliacaoServico",
        "esic",
        "conselhoAta",
        "contrato",
        "noticia",
        
        "usuario",
        "secretaria",
        "licitacao",
        "convenio",
        "diaria",
        "servidor",
        "receita",
        "despesa",
        "documento",
        "evento",
        "contato",
        "ouvidoria",
        "cidadaoEsic",
        "galeriaFoto",
        "obra",
        "fAQ",
        "glossario",
        "legislacao",
        "unidadeAtendimento",
        "conselho",
        "importacaoCSV",
        "linkExterno",
        "configuracao",
        "medicamento",
        "veiculo",
        "emendaParlamentar",
        "concurso",
        "servicoCarta",
        "relatorioFiscal",
        "pagamento",
        "renunciaFiscal",
        "quadroServidor",
        "emendaPix",
        "pesquisaSatisfacao",
        "estagiario",
        "terceirizado"
    ];

    // List tables in order of insertion (parent tables first)
    const insertOrder = [
        "usuario",
        "secretaria",
        "licitacao",
        "convenio",
        "diaria",
        "servidor",
        "receita",
        "despesa",
        "documento",
        "evento",
        "contato",
        "ouvidoria",
        "cidadaoEsic",
        "galeriaFoto",
        "obra",
        "fAQ",
        "glossario",
        "legislacao",
        "unidadeAtendimento",
        "conselho",
        "importacaoCSV",
        "linkExterno",
        "configuracao",
        "medicamento",
        "veiculo",
        "emendaParlamentar",
        "concurso",
        "servicoCarta",
        "relatorioFiscal",
        "pagamento",
        "renunciaFiscal",
        "quadroServidor",
        "emendaPix",
        "pesquisaSatisfacao",
        "estagiario",
        "terceirizado",

        "noticia", // depends on secretaria
        "contrato", // depends on licitacao
        "conselhoAta", // depends on conselho
        "esic", // depends on cidadaoEsic
        "avaliacaoServico" // depends on servicoCarta
    ];

    console.log("\nLimpando dados antigos no banco de dados destino...");
    for (const table of deleteOrder) {
        try {
            const result = await (prisma as any)[table].deleteMany();
            console.log(`- Tabela ${table} limpa (${result.count} registros deletados).`);
        } catch (err: any) {
            console.error(`Erro ao limpar tabela ${table}:`, err.message);
        }
    }

    console.log("\nInserindo dados importados...");
    for (const table of insertOrder) {
        const records = data[table] || [];
        if (records.length === 0) {
            console.log(`- ${table}: Nenhum registro para importar.`);
            continue;
        }

        console.log(`- Inserindo ${records.length} registros na tabela ${table}...`);
        try {
            // We use individual inserts to ensure clean logging and bypass any bulk insert limitations
            let count = 0;
            for (const record of records) {
                await (prisma as any)[table].create({ data: record });
                count++;
            }
            console.log(`  Sucesso: ${count}/${records.length} registros inseridos.`);
        } catch (err: any) {
            console.error(`  Erro na tabela ${table}:`, err.message);
        }
    }

    console.log("\nProcesso de importação finalizado!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
