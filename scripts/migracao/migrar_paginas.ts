import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();
const WP_API_BASE = 'https://lajespintadas.rn.gov.br/wp-json/wp/v2';

function unescapeHtml(text: string): string {
  if (!text) return '';
  const $ = cheerio.load(text);
  return $.text().trim();
}

async function migrarPaginas() {
  console.log('Iniciando migração de Páginas do WordPress...');

  try {
    const response = await fetch(`${WP_API_BASE}/pages?per_page=100`);
    if (!response.ok) {
      throw new Error(`Erro na API do WP: ${response.status} ${response.statusText}`);
    }

    const pages = await response.json();
    console.log(`Encontradas ${pages.length} páginas na API.`);

    let totalInserido = 0;

    for (const page of pages) {
      const title = unescapeHtml(page.title?.rendered || '');
      const rawContent = page.content?.rendered || '';
      const slug = page.slug || '';

      console.log(`[PROCESSANDO] Página WP: "${title}" (${slug})`);

      // Páginas institucionais não possuem modelo direto de Page no seu Prisma.
      // Vou colocar como FAQ (Perguntas e Respostas) ou Glossário para n perder.
      // O ideal é ter a avaliação do usuário. Para este momento farei a inserção no 
      // modelo Glossario como Termo(Título) e Definição(Conteúdo HTML), 
      // caso já nao exista, para não perder os dados.

      const existe = await prisma.glossario.findFirst({
        where: { termo: title }
      });

      if (existe) {
        console.log(`[IGNORADO] Página "${title}" possivelmente já migrada para Glossário.`);
        continue;
      }

      await prisma.glossario.create({
         data: {
             termo: title,
             definicao: rawContent.length > 5000 ? rawContent.substring(0, 4995) + '...' : rawContent,
         }
      });
      console.log(`[INSERIDO] Página salva no Glossário: "${title}"`);
      totalInserido++;
    }

    console.log(`Migração concluída! Foram salvas ${totalInserido} páginas/informações institucionais.`);

  } catch (error: any) {
    console.error('Erro ao migrar páginas:', error.message);
  }
}

migrarPaginas()
  .then(async () => { await prisma.$disconnect(); process.exit(0); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
