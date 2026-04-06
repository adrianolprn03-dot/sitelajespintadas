/**
 * Script de Extração de Legislação - Portal de Lajes Pintadas/RN
 * 
 * Extrai via WP REST API:
 * - Decretos
 * - Portarias
 * - Leis
 * 
 * Salva resultado em arquivos JSON para revisão antes de inserir no banco.
 */

const fs = require('fs');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const WP_URL = 'https://lajespintadas.rn.gov.br';
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Accept-Language': 'pt-BR,pt;q=0.9',
    'Referer': 'https://lajespintadas.rn.gov.br/'
};

function decodeHtmlEntities(str) {
    if (!str) return '';
    return str
        .replace(/&#8211;/g, '–')
        .replace(/&#8212;/g, '—')
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
        .replace(/<[^>]*>/g, '')
        .replace(/&#[0-9]+;/g, '')
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function parseTitleNumeroAno(title) {
    // Padrões: "Decreto Nº 005/2026", "Portaria 432/2025", "Lei nº 123/2024"
    const match = title.match(/(\d+)\s*\/\s*(20\d{2}|19\d{2})/);
    if (match) {
        return { numero: match[1], ano: parseInt(match[2]) };
    }
    // Só ano
    const yearMatch = title.match(/(20\d{2}|19\d{2})/);
    if (yearMatch) {
        return { numero: 'S/N', ano: parseInt(yearMatch[1]) };
    }
    return null;
}

function categorizarPortaria(titulo, conteudo) {
    const textoCompleto = (titulo + ' ' + conteudo).toLowerCase();
    if (textoCompleto.includes('diária') || textoCompleto.includes('diarias') || textoCompleto.includes('viagem')) {
        return 'portaria_diaria';
    }
    return 'portaria';
}

async function fetchAllFromEndpoint(endpoint, tipo) {
    const results = [];
    let page = 1;
    let hasMore = true;

    console.log(`\n📥 Buscando ${tipo.toUpperCase()} em /wp-json/wp/v2/${endpoint}...`);

    while (hasMore) {
        const url = `${WP_URL}/wp-json/wp/v2/${endpoint}?per_page=100&page=${page}&_fields=id,title,link,content,date,modified`;
        console.log(`   Página ${page}...`);

        try {
            const response = await fetch(url, { headers: HEADERS });

            if (!response.ok) {
                if (response.status === 400 || response.status === 404) {
                    hasMore = false;
                    break;
                }
                const text = await response.text();
                // Check if it's a rest_post_invalid_page_number error (normal end of pagination)
                if (text.includes('rest_post_invalid_page_number')) {
                    hasMore = false;
                    break;
                }
                console.log(`   ⚠️ Status ${response.status} na página ${page}. Parando.`);
                hasMore = false;
                break;
            }

            const contentType = response.headers.get('content-type') || '';
            if (!contentType.includes('json')) {
                console.log(`   ⚠️ Resposta não é JSON (${contentType}). Página ${page}. Parando.`);
                hasMore = false;
                break;
            }

            const items = await response.json();
            if (!Array.isArray(items) || items.length === 0) {
                hasMore = false;
                break;
            }

            for (const item of items) {
                const titulo = decodeHtmlEntities(item.title?.rendered || '');
                const conteudo = decodeHtmlEntities(item.content?.rendered || '');
                const parsed = parseTitleNumeroAno(titulo);

                if (!parsed) {
                    console.log(`   ⚠️ Sem número/ano: "${titulo.substring(0, 80)}..."`);
                    continue;
                }

                // Para portarias, verificar se é portaria de diária
                let tipoFinal = tipo;
                if (tipo === 'portaria') {
                    tipoFinal = categorizarPortaria(titulo, conteudo);
                }

                results.push({
                    tipo: tipoFinal,
                    numero: parsed.numero,
                    ano: parsed.ano,
                    ementa: titulo,
                    conteudoResumo: conteudo.substring(0, 300),
                    arquivo: item.link || null,
                    dataPublicacao: item.date || null,
                    wpId: item.id
                });
            }

            // Check total pages header
            const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');
            if (page >= totalPages) {
                hasMore = false;
            }

            page++;

            // Delay para não sobrecarregar o servidor
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (err) {
            console.error(`   ❌ Erro na página ${page}: ${err.message}`);
            hasMore = false;
        }
    }

    console.log(`   ✅ Total extraído para ${tipo}: ${results.length} documentos`);
    return results;
}

async function tentarDecretosComoPost() {
    // Tentar buscar decretos como custom post type ou como posts com categoria
    console.log('\n📥 Tentando buscar DECRETOS como custom post type...');
    
    // Primeiro, tentar como endpoint direto
    const endpoints = ['decretos', 'decreto'];
    
    for (const ep of endpoints) {
        try {
            const url = `${WP_URL}/wp-json/wp/v2/${ep}?per_page=5`;
            const response = await fetch(url, { headers: HEADERS });
            
            if (response.ok) {
                const contentType = response.headers.get('content-type') || '';
                if (contentType.includes('json')) {
                    const items = await response.json();
                    if (Array.isArray(items) && items.length > 0) {
                        console.log(`   ✅ Encontrou endpoint: /wp-json/wp/v2/${ep}`);
                        return ep;
                    }
                }
            }
        } catch (e) {
            // ignora
        }
    }
    
    return null;
}

async function main() {
    console.log('══════════════════════════════════════════════════════');
    console.log('🏛️ EXTRAÇÃO DE LEGISLAÇÃO - LAJES PINTADAS/RN');
    console.log('══════════════════════════════════════════════════════');

    const todosResultados = [];

    // 1. Portarias (e Portarias de Diárias)
    const portarias = await fetchAllFromEndpoint('portarias', 'portaria');
    todosResultados.push(...portarias);

    // 2. Leis
    const leis = await fetchAllFromEndpoint('leis', 'lei');
    todosResultados.push(...leis);

    // 3. Decretos - tentar encontrar o endpoint
    const decretosEndpoint = await tentarDecretosComoPost();
    if (decretosEndpoint) {
        const decretos = await fetchAllFromEndpoint(decretosEndpoint, 'decreto');
        todosResultados.push(...decretos);
    } else {
        console.log('   ⚠️ Endpoint de decretos não encontrado como custom post type.');
        console.log('   Tentando buscar em /wp-json/wp/v2/posts com busca por "decreto"...');
        
        // Tentar pela busca genérica
        try {
            const url = `${WP_URL}/wp-json/wp/v2/posts?per_page=100&search=decreto&_fields=id,title,link,content,date`;
            const response = await fetch(url, { headers: HEADERS });
            if (response.ok) {
                const items = await response.json();
                if (Array.isArray(items)) {
                    for (const item of items) {
                        const titulo = decodeHtmlEntities(item.title?.rendered || '');
                        const parsed = parseTitleNumeroAno(titulo);
                        if (parsed) {
                            todosResultados.push({
                                tipo: 'decreto',
                                numero: parsed.numero,
                                ano: parsed.ano,
                                ementa: titulo,
                                conteudoResumo: decodeHtmlEntities(item.content?.rendered || '').substring(0, 300),
                                arquivo: item.link || null,
                                dataPublicacao: item.date || null,
                                wpId: item.id
                            });
                        }
                    }
                    console.log(`   ✅ Encontrados ${items.length} posts relacionados a decretos`);
                }
            }
        } catch (e) {
            console.log(`   ❌ Falha na busca genérica: ${e.message}`);
        }
    }

    // Resumo
    const porTipo = {};
    todosResultados.forEach(r => {
        porTipo[r.tipo] = (porTipo[r.tipo] || 0) + 1;
    });

    console.log('\n══════════════════════════════════════════════════════');
    console.log('📊 RESUMO DA EXTRAÇÃO:');
    console.log('══════════════════════════════════════════════════════');
    Object.entries(porTipo).forEach(([tipo, count]) => {
        console.log(`   ${tipo}: ${count} documentos`);
    });
    console.log(`   TOTAL: ${todosResultados.length} documentos`);
    console.log('══════════════════════════════════════════════════════');

    // Salvar em JSON para revisão
    const outputFile = path.join(__dirname, 'legislacao-extraida.json');
    fs.writeFileSync(outputFile, JSON.stringify(todosResultados, null, 2), 'utf8');
    console.log(`\n💾 Dados salvos em: ${outputFile}`);

    // Mostrar amostra de cada tipo
    Object.keys(porTipo).forEach(tipo => {
        const amostra = todosResultados.filter(r => r.tipo === tipo).slice(0, 3);
        console.log(`\n📋 Amostra de ${tipo.toUpperCase()}:`);
        amostra.forEach(d => {
            console.log(`   ${d.tipo} ${d.numero}/${d.ano} - ${d.ementa.substring(0, 100)}`);
        });
    });
}

main().catch(console.error);
