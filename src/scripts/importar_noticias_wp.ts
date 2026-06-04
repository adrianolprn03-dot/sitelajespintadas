import { PrismaClient } from "@prisma/client";
import * as cheerio from "cheerio";

const prisma = new PrismaClient();

const WP_API_URL = "https://saotome.rn.gov.br/wp-json/wp/v2/posts";

function decodeHtml(html: string): string {
    const $ = cheerio.load(html);
    return $.text().trim();
}

async function importarNoticias() {
    console.log("Iniciando importação de notícias do WordPress via API...");
    
    let page = 1;
    let totalImportadas = 0;
    let totalAtualizadas = 0;
    let hasMore = true;

    while (hasMore) {
        console.log(`Buscando página ${page}...`);
        try {
            const res = await fetch(`${WP_API_URL}?_embed=1&per_page=100&page=${page}`);
            
            if (!res.ok) {
                if (res.status === 400) {
                    console.log("Fim das páginas alcançado.");
                } else {
                    console.error(`Erro na requisição: ${res.statusText}`);
                }
                hasMore = false;
                break;
            }

            const posts = await res.json();
            
            if (!posts || posts.length === 0) {
                console.log("Nenhum post encontrado nesta página. Finalizando.");
                hasMore = false;
                break;
            }

            for (const post of posts) {
                const titulo = decodeHtml(post.title.rendered);
                const slug = post.slug;
                const conteudo = post.content.rendered;
                
                // Extrair resumo (limpar HTML)
                let resumo = decodeHtml(post.excerpt.rendered);
                // Fallback caso o excerpt seja vazio
                if (!resumo) {
                    resumo = decodeHtml(conteudo).substring(0, 150) + "...";
                }

                // Imagem de destaque
                let imagem = null;
                if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'].length > 0) {
                    imagem = post._embedded['wp:featuredmedia'][0].source_url;
                }

                const publicadoEm = new Date(post.date);

                // Upsert da noticia no banco usando o slug como chave unica
                const noticiaDb = await prisma.noticia.upsert({
                    where: { slug: slug },
                    update: {
                        titulo,
                        resumo,
                        conteudo,
                        imagem,
                        publicada: true,
                        publicadoEm,
                    },
                    create: {
                        titulo,
                        slug,
                        resumo,
                        conteudo,
                        imagem,
                        publicada: true,
                        publicadoEm,
                        criadoEm: publicadoEm,
                    }
                });

                if (noticiaDb.criadoEm.getTime() === noticiaDb.atualizadoEm.getTime()) {
                    totalImportadas++;
                } else {
                    // if it was updated, the timestamps might differ slightly, but let's just log totals.
                    totalAtualizadas++;
                }
            }

            console.log(`Página ${page} processada. (${posts.length} posts)`);
            page++;
            
        } catch (err) {
            console.error("Erro ao buscar página", page, err);
            hasMore = false;
        }
    }

    console.log("--- Importação Concluída ---");
    console.log(`Total de notícias processadas: ${totalImportadas + totalAtualizadas}`);
    console.log(`Novas inseridas: ${totalImportadas}`);
    console.log(`Atualizadas (já existiam): ${totalAtualizadas}`);
}

importarNoticias()
    .catch((e) => {
        console.error("Erro fatal:", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
