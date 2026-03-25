import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();
const WP_API_BASE = 'https://lajespintadas.rn.gov.br/wp-json/wp/v2';

function unescapeHtml(text: string): string {
  if (!text) return '';
  const $ = cheerio.load(text);
  return $.text().trim();
}

async function migrarLegislacao(endpoint: string, tipo: string) {
  console.log(`Iniciando migração de ${tipo} do WordPress...`);

  try {
    const response = await fetch(`${WP_API_BASE}/${endpoint}?per_page=100`);
    if(!response.ok) return;

    const items = await response.json();
    console.log(`Encontrados ${items.length} itens em ${tipo}.`);

    let totalInserido = 0;

    for (const item of items) {
      const title = unescapeHtml(item.title?.rendered || '');
      let numero = "N/A";
      let ano = new Date().getFullYear();

      // Tentando extrair número e ano do título se possível
      const match = title.match(/(\d+)\/?(\d{4})/);
      if (match) {
        numero = match[1];
        ano = parseInt(match[2]);
      } else {
        const extractedAno = title.match(/(20\d{2})/);
        if (extractedAno) {
          ano = parseInt(extractedAno[1]);
        }
      }

      const existe = await prisma.legislacao.findFirst({
        where: { ementa: title, tipo: tipo }
      });

      if (existe) {
        console.log(`[IGNORADO] ${tipo} "${title}" já migrada.`);
        continue;
      }

      await prisma.legislacao.create({
         data: {
             tipo: tipo,
             numero: numero,
             ano: ano,
             ementa: title,
             arquivo: item.link || '', // Backup do link original
             ativo: true,
         }
      });
      console.log(`[INSERIDO] ${tipo}: "${title}"`);
      totalInserido++;
    }

    console.log(`Migração de ${tipo} concluída! Salvos: ${totalInserido}`);

  } catch (error: any) {
    console.error(`Erro ao migrar ${tipo}:`, error.message);
  }
}

async function main() {
    await migrarLegislacao('leis', 'Lei');
    await migrarLegislacao('portarias', 'Portaria');
}

main()
  .then(async () => { await prisma.$disconnect(); process.exit(0); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
