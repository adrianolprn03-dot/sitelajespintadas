import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface RowItem {
  text?: string;
  href?: string;
}

type Row = (string | RowItem)[];

interface TableData {
  headers: string[];
  rows: Row[];
}

async function main() {
  console.log('\n📦 Importando Dispensas de Licitação do JSON extraído...\n');

  const filePath = path.resolve(__dirname, '../../dispensas_data_0.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data: TableData = JSON.parse(raw);

  console.log(`📊 Total de registros no JSON: ${data.rows.length}`);

  const records = [];

  for (const row of data.rows) {
    const numAnoRaw = typeof row[0] === 'string' ? row[0].trim() : '';
    const modalidade = typeof row[1] === 'string' ? row[1].trim() : 'Dispensa de Licitação';
    const objeto = typeof row[2] === 'string' ? row[2].trim() : 'Não informado';

    // O link do edital está na última coluna (index 7)
    const editalCol = row[7];
    let editalUrl: string | null = null;
    if (typeof editalCol === 'object' && editalCol !== null && 'href' in editalCol) {
      editalUrl = editalCol.href || null;
    }

    // Parse Número e Ano (e.g. "011-2026", "09/2026", "059/2025")
    const match = numAnoRaw.match(/(\d+)[\/-](\d{4})/);
    const numero = match ? match[1] : numAnoRaw.replace(/\D/g, '') || '0';
    const ano = match ? parseInt(match[2]) : new Date().getFullYear();

    records.push({
      numero,
      ano,
      modalidade: modalidade || 'Dispensa de Licitação',
      objeto: objeto || 'Não informado',
      secretaria: 'Prefeitura Municipal',
      status: 'concluida',
      faseAtual: 'encerrada',
      editalUrl,
      valor: null,
    });
  }

  console.log(`✅ Registros preparados: ${records.length}`);

  // Usar createMany com skipDuplicates
  const result = await prisma.licitacao.createMany({
    data: records,
    skipDuplicates: true,
  });

  console.log(`🚀 Importação concluída! ${result.count} registros inseridos.`);

  const total = await prisma.licitacao.count();
  console.log(`📦 Total de licitações no banco: ${total}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
