import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

const WP_API_BASE = 'https://lajespintadas.rn.gov.br/wp-json/wp/v2';
const PER_PAGE = 50;

// Função auxiliar para remover HTML de strings (como o resumo)
function stripHtml(html: string): string {
  if (!html) return '';
  const $ = cheerio.load(html);
  return $.text().trim();
}

// Função auxiliar para decodificar entidades HTML simples do título
function unescapeHtml(text: string): string {
  if (!text) return '';
  const $ = cheerio.load(text);
  return $.text().trim();
}

async function migrarNoticias() {
  console.log('Iniciando migração de Notícias do WordPress...');

  let page = 1;
  let hasMore = true;
  let totalProcessado = 0;
  let totalInserido = 0;
  let totalIgnorado = 0;

  while (hasMore) {
    try {
      console.log(`Buscando página ${page}...`);
      const response = await fetch(`${WP_API_BASE}/posts?_embed=true&per_page=${PER_PAGE}&page=${page}`);
      
      if (!response.ok) {
        if (response.status === 400) {
          console.log('Fim das páginas (Erro 400 indica página fora do range).');
          hasMore = false;
          break;
        }
        throw new Error(`Erro na API do WP: ${response.status} ${response.statusText}`);
      }

      const posts = await response.json();

      if (!Array.isArray(posts) || posts.length === 0) {
        console.log('Nenhum post encontrado na página, finalizando busca.');
        hasMore = false;
        break;
      }

      for (const post of posts) {
        totalProcessado++;
        const title = unescapeHtml(post.title?.rendered || '');
        let slug = post.slug || '';
        
        // Garante que o slug é único, caso venha vazio da API (raro)
        if (!slug) {
            slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }

        // Verifica duplicidade no banco
        const existe = await prisma.noticia.findUnique({
          where: { slug }
        });

        if (existe) {
          console.log(`[IGNORADO] Duplicidade: "${title}" (slug: ${slug}) já existe no banco.`);
          totalIgnorado++;
          continue;
        }

        const rawContent = post.content?.rendered || '';
        const rawExcerpt = post.excerpt?.rendered || '';
        const resumo = stripHtml(rawExcerpt) || stripHtml(rawContent).substring(0, 150) + '...';
        
        let imageUrl = null;
        if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
          imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
        }

        const date = post.date ? new Date(post.date) : new Date();

        try {
          await prisma.noticia.create({
            data: {
              titulo: title,
              slug: slug,
              resumo: resumo.length > 500 ? resumo.substring(0, 497) + '...' : resumo,
              conteudo: rawContent, // Preservando HTML para a renderização no site
              imagem: imageUrl,
              publicada: true, // Posts do WP geralmente estão publicados
              destaque: false,
              publicadoEm: date,
              criadoEm: date,
              atualizadoEm: post.modified ? new Date(post.modified) : date,
              tags: "[]" // Pode ser turbinado futuramente mapeando as categorias do WP
            }
          });
          console.log(`[INSERIDO] Notícia: "${title}"`);
          totalInserido++;
        } catch (dbError: any) {
          console.error(`[ERRO BANCO] Falha ao inserir "${title}":`, dbError.message);
        }
      }

      // WP API Header 'x-wp-totalpages' can also be used, but going until empty/error is safer
      const totalPagesHeader = response.headers.get('x-wp-totalpages');
      if (totalPagesHeader && page >= Number(totalPagesHeader)) {
         hasMore = false;
      } else {
         page++;
      }

    } catch (error: any) {
      console.error(`Erro inesperado na página ${page}:`, error.message);
      hasMore = false; // Parar loop em caso de erro fatal (ex: net de conexão)
    }
  }

  console.log('--- Resumo da Migração de Notícias ---');
  console.log(`Total de posts processados da API: ${totalProcessado}`);
  console.log(`Total inserido com sucesso: ${totalInserido}`);
  console.log(`Total ignorado (duplicado no novo site): ${totalIgnorado}`);
}

migrarNoticias()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
