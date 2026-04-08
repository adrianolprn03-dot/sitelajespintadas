import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const WP_API_URL = "https://lajespintadas.rn.gov.br/wp-json/wp/v2/posts";

async function fetchNoticias(page = 1) {
    const url = `${WP_API_URL}?_embed&per_page=20&page=${page}`;
    console.log(`Buscando página ${page} da WP API...`);
    
    const response = await fetch(url);
    if (!response.ok) {
        if (response.status === 400) return []; // Acabaram as páginas
        throw new Error(`Erro WP API: ${response.status}`);
    }
    return await response.json();
}

function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

async function run(maxPages = 5) {
    console.log("🚀 Iniciando Importação de Notícias via WP-JSON...");
    let totalImported = 0;

    for (let i = 1; i <= maxPages; i++) {
        try {
            const posts = await fetchNoticias(i);
            if (posts.length === 0) break;

            for (const post of posts) {
                const titulo = post.title.rendered.replace(/&#8211;/g, "–").replace(/&#8217;/g, "'");
                const slugBase = generateSlug(titulo);
                const slug = `${slugBase}-${post.id}`; // Usar o ID do WP para garantir unicidade

                // Verificar se já existe
                const existing = await prisma.noticia.findFirst({
                    where: { 
                        OR: [
                            { slug: slug },
                            { titulo: titulo }
                        ]
                    }
                });

                if (existing) {
                    console.log(`⏭️  Pulando existente: ${titulo}`);
                    continue;
                }

                // Extrair Imagem (Featured Media)
                let imagem = null;
                if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
                    imagem = post._embedded['wp:featuredmedia'][0].source_url;
                }

                await prisma.noticia.create({
                    data: {
                        titulo: titulo,
                        slug: slug,
                        resumo: post.excerpt.rendered.replace(/<[^>]*>/g, "").substring(0, 250),
                        conteudo: post.content.rendered,
                        imagem: imagem,
                        publicada: true,
                        publicadoEm: new Date(post.date),
                        destaque: totalImported === 0, // A primeira vira destaque
                    }
                });

                console.log(`✅ Importada: ${titulo}`);
                totalImported++;
            }
        } catch (error: any) {
            console.error(`❌ Erro na página ${i}:`, error.message);
            break;
        }
    }

    console.log(`\n🎉 Importação concluída! Total de ${totalImported} novas notícias.`);
    process.exit(0);
}

run(5); // Importar as últimas 100 notícias (5 páginas de 20)
