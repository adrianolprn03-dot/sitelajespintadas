/**
 * Script de migração de dados: Neon → Supabase
 * Lê o arquivo db_data_dump.json e insere os dados no novo banco.
 * Execute: npx ts-node scripts/migrar-para-supabase.ts
 */
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando migração de dados para o Supabase...\n");

  const dumpPath = path.join(process.cwd(), "db_data_dump.json");
  if (!fs.existsSync(dumpPath)) {
    throw new Error("Arquivo db_data_dump.json não encontrado!");
  }

  const raw = fs.readFileSync(dumpPath, "utf-8");
  const data = JSON.parse(raw);

  // ─── Ordem importante: respeitar FK (chaves estrangeiras) ───
  const ordemImportacao = [
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
    "cidadaoEsic",
    "esic",
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
    "emendaPix",
    "concurso",
    "servicoCarta",
    "avaliacaoServico",
    "relatorioFiscal",
    "pagamento",
    "renunciaFiscal",
    "quadroServidor",
    "pesquisaSatisfacao",
    "estagiario",
    "terceirizado",
  ];

  let totalImportado = 0;
  let totalErros = 0;

  for (const tabela of ordemImportacao) {
    const registros = data[tabela];
    if (!registros || registros.length === 0) {
      console.log(`⏭️  ${tabela}: vazio, pulando.`);
      continue;
    }

    try {
      // Mapear nome camelCase para o model do Prisma
      const modelName = tabela === "fAQ" ? "fAQ" : tabela;
      const prismaModel = (prisma as any)[modelName];

      if (!prismaModel) {
        console.warn(`⚠️  Model '${modelName}' não encontrado no Prisma. Pulando.`);
        continue;
      }

      // Inserir em lotes de 50 para evitar timeout
      const LOTE = 50;
      let importados = 0;
      for (let i = 0; i < registros.length; i += LOTE) {
        const lote = registros.slice(i, i + LOTE);
        for (const registro of lote) {
          try {
            await prismaModel.upsert({
              where: { id: registro.id },
              update: registro,
              create: registro,
            });
            importados++;
          } catch (err: any) {
            // Ignorar duplicatas, logar outros erros
            if (!err.message?.includes("Unique constraint")) {
              console.error(`  ❌ Erro em ${tabela}[${registro.id}]:`, err.message);
              totalErros++;
            }
          }
        }
        process.stdout.write(`\r  ✅ ${tabela}: ${importados}/${registros.length}`);
      }
      console.log(`\r  ✅ ${tabela}: ${importados} registros importados`);
      totalImportado += importados;
    } catch (err: any) {
      console.error(`  ❌ Erro ao processar ${tabela}:`, err.message);
      totalErros++;
    }
  }

  console.log("\n════════════════════════════════════");
  console.log(`✅ Migração concluída!`);
  console.log(`   Total importado: ${totalImportado} registros`);
  console.log(`   Total de erros:  ${totalErros}`);
  console.log("════════════════════════════════════\n");
}

main()
  .catch((e) => {
    console.error("❌ Falha crítica na migração:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
