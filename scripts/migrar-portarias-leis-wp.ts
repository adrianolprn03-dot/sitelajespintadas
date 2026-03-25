import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const WP_URL = 'https://lajespintadas.rn.gov.br';

function decodeHtmlEntities(str: string): string {
    if (!str) return '';
    return str
        .replace(/&#8211;/g, '-')
        .replace(/&#8212;/g, '--')
        .replace(/&#8216;/g, "'")
        .replace(/&#8217;/g, "'")
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/&#8230;/g, '...')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&#[0-9]+;/g, '')
        .trim();
}

/**
 * Tries to parse "005/2026", "432/2025" etc from the WP title.
 * Returns { numero, ano } or null if it can't parse.
 */
function parseTitleNumeroAno(title: string): { numero: string; ano: number } | null {
    // Match patterns like "005/2026", "432/2025", "N° 005/2026", "nº 005/2026"
    const match = title.match(/(\d+)\s*\/\s*(20\d{2}|19\d{2})/);
    if (match) {
        return { numero: match[1], ano: parseInt(match[2]) };
    }
    // Fallback: just get the year
    const yearMatch = title.match(/(20\d{2}|19\d{2})/);
    if (yearMatch) {
        return { numero: 'S/N', ano: parseInt(yearMatch[1]) };
    }
    return null;
}

async function migrarTipo(wpType: string, tipoLegislacao: string) {
    console.log(`\n=== Migrando ${tipoLegislacao.toUpperCase()} (endpoint: /wp-json/wp/v2/${wpType}) ===`);
    
    let page = 1;
    let hasMore = true;
    let totalImportadas = 0;
    let totalIgnoradas = 0;

    while (hasMore) {
        const url = `${WP_URL}/wp-json/wp/v2/${wpType}?per_page=100&page=${page}`;
        const response = await fetch(url);

        if (!response.ok) {
            const err = await response.json().catch(() => ({})) as any;
            if (response.status === 400 && err.code === 'rest_post_invalid_page_number') {
                hasMore = false;
                break;
            }
            throw new Error(`Erro ${response.status}: ${JSON.stringify(err)}`);
        }

        const items: any[] = await response.json();
        if (!items || items.length === 0) {
            hasMore = false;
            break;
        }

        for (const item of items) {
            const titulo = decodeHtmlEntities(item.title?.rendered || '');
            const parsed = parseTitleNumeroAno(titulo);

            if (!parsed) {
                console.log(`  ⚠️  Ignorando (sem número/ano): "${titulo}"`);
                totalIgnoradas++;
                continue;
            }

            const { numero, ano } = parsed;
            // Use the WP link as the arquivo URL
            const arquivo = item.link || null;

            // Check if it already exists
            const existe = await prisma.legislacao.findFirst({
                where: { tipo: tipoLegislacao, numero, ano }
            });

            if (!existe) {
                await prisma.legislacao.create({
                    data: {
                        tipo: tipoLegislacao,
                        numero,
                        ano,
                        ementa: titulo,
                        arquivo,
                        ativo: true,
                    }
                });
                console.log(`  ✅ Importado: ${tipoLegislacao} ${numero}/${ano}`);
                totalImportadas++;
            } else {
                console.log(`  ⏭️  Já existe: ${tipoLegislacao} ${numero}/${ano}`);
                totalIgnoradas++;
            }
        }
        
        page++;
    }

    console.log(`\nResumo ${tipoLegislacao}: ${totalImportadas} importadas, ${totalIgnoradas} ignoradas/duplicadas.`);
}

async function main() {
    await migrarTipo('portarias', 'portaria');
    await migrarTipo('leis', 'lei');

    console.log('\n======================================================');
    console.log('🏁 Migração de portarias e leis via REST API finalizada!');
    console.log('======================================================');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
