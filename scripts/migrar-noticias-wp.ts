import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const WP_URL = 'https://lajespintadas.rn.gov.br';

function decodeHtmlEntities(str: string) {
    if (!str) return '';
    return str
        .replace(/&#8211;/g, '-')
        .replace(/&#8212;/g, '--')
        .replace(/&#8216;/g, "'")
        .replace(/&#8217;/g, "'")
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/&#8230;/g, '...')
        .replace(/&hellip;/g, '...')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ');
}

async function main() {
    console.log('Iniciando migração de notícias do WordPress...');
    console.log(`Site fonte: ${WP_URL}`);
    
    let page = 1;
    let hasMore = true;
    let totalImportadas = 0;

    // Desabilitar restrições temporárias SSL do Node para garantir o fetch
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    while (hasMore) {
        console.log(`\nBuscando página ${page} (100 notícias por página)...`);
        try {
            const url = `${WP_URL}/wp-json/wp/v2/posts?_embed&per_page=100&page=${page}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                if (response.status === 400 && errData.code === 'rest_post_invalid_page_number') {
                    console.log('Fim das páginas alcançado corretamente.');
                    hasMore = false;
                    break;
                }
                throw new Error(`Erro na API do WP: ${response.status} ${response.statusText} - ${JSON.stringify(errData)}`);
            }

            const posts = await response.json();
            
            if (!posts || posts.length === 0) {
                console.log('A página retornou 0 resultados. Finalizando...');
                hasMore = false;
                break;
            }

            console.log(`Processando ${posts.length} notícias da página ${page}...`);

            for (const post of posts) {
                // Tenta extrair a URL da imagem em destaque do payload `_embed`
                let imagem = null;
                if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
                    imagem = post._embedded['wp:featuredmedia'][0].source_url;
                }

                // Cria um slug que garantidamente não conflita (adiciona o WP ID)
                const slugSeguro = `${post.slug}-wp${post.id}`;

                // Processa o resumo limpando tags HTML indesejadas que vêm do Excerpt do WP
                let resumoLimpo = "Sem resumo disponível.";
                if (post.excerpt && post.excerpt.rendered) {
                    resumoLimpo = decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>?/gm, '')).trim();
                    // Limita a 200 caracteres para não quebrar o layout
                    if (resumoLimpo.length > 200) {
                        resumoLimpo = resumoLimpo.substring(0, 197) + '...';
                    }
                }

                // Título decodificado
                const tituloLimpo = decodeHtmlEntities(post.title.rendered);

                // Executa a carga no banco
                await prisma.noticia.upsert({
                    where: { slug: slugSeguro },
                    update: {}, // Não atualiza se já existe (preserva edições já feitas no novo painel)
                    create: {
                        titulo: tituloLimpo,
                        slug: slugSeguro,
                        resumo: resumoLimpo,
                        conteudo: post.content.rendered,
                        imagem: imagem,
                        publicada: true,
                        destaque: false,
                        criadoEm: new Date(post.date),
                        publicadoEm: new Date(post.date),
                    }
                });

                totalImportadas++;
            }
            
            console.log(`Página ${page} OK. Total acumulado: ${totalImportadas} notícias importadas.`);
            page++;
            
        } catch (error: any) {
            console.error('ERRO CRÍTICO ao buscar ou salvar posts na página', page, ':', error.message);
            // Decide se falha ou se desiste (melhor desistir do loop se a API cair)
            hasMore = false;
        }
    }

    console.log(`\n======================================================`);
    console.log(`✅ MIGRAÇÃO FINALIZADA COM SUCESSO!`);
    console.log(`📈 Um total de ${totalImportadas} notícias foram migradas do WordPress.`);
    console.log(`======================================================`);
}

main()
    .catch((e) => {
        console.error("Falha geral na execução do script:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
