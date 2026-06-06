import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

const SOURCES = [
  {
    url: 'https://saotome.rn.gov.br/editais/',
    tipo: 'Edital',
    tableId: '#tablepress-3',
    colLinkIndex: 6
  },
  // {
  //   url: 'https://saotome.rn.gov.br/dispensas-de-licitacoes/',
  //   tipo: 'Dispensa',
  //   tableId: '#tablepress-25',
  //   colLinkIndex: 7
  // }
];

async function scrapeSource(source: typeof SOURCES[0]) {
  console.log(`\n🔍 Raspando Licitações (${source.tipo}) de ${source.url}...`);
  
  try {
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const rows = $(`${source.tableId} tbody tr`);
    
    console.log(`📊 Encontradas ${rows.length} linhas na tabela.`);
    
    const records: any[] = [];
    
    rows.each((i, el) => {
      const tds = $(el).find('td');
      if (tds.length > source.colLinkIndex) {
        const numAnoRaw = $(tds[0]).text().trim();
        const modalidade = $(tds[1]).text().trim();
        const objeto = $(tds[2]).text().trim();
        
        const linkEl = $(tds[source.colLinkIndex]).find('a');
        const editalUrl = linkEl.attr('href') || null;
        
        // Parse Número e Ano (e.g. "08/2026" ou "011-2026")
        const match = numAnoRaw.match(/(\d+)[\/\-](\d{4})/);
        const numero = match ? match[1] : numAnoRaw;
        const ano = match ? parseInt(match[2]) : new Date().getFullYear();
        
        records.push({
          numero,
          ano,
          modalidade: modalidade || source.tipo,
          objeto: objeto || 'Não informado',
          secretaria: 'Prefeitura Municipal',
          status: 'aberta',
          documentos: editalUrl ? JSON.stringify([{ nome: 'Edital', url: editalUrl }]) : '[]',
          valor: null
        });
      }
    });
    
    return records;
  } catch (error) {
    console.error(`❌ Erro ao raspar ${source.url}:`, error);
    return [];
  }
}

async function main() {
  let allRecords: any[] = [];
  
  for (const source of SOURCES) {
    const records = await scrapeSource(source);
    allRecords = allRecords.concat(records);
  }
  
  console.log(`\n✅ Total de licitações capturadas: ${allRecords.length}`);
  
  if (allRecords.length === 0) {
    console.log('⚠️ Nenhuma licitação encontrada. Abortando importação.');
    return;
  }
  
  console.log('💾 Salvando no banco de dados...');
  
  // Usar createMany para performance
  const result = await prisma.licitacao.createMany({
    data: allRecords,
    skipDuplicates: true
  });
  
  console.log(`🚀 Importação concluída! ${result.count} registros inseridos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
