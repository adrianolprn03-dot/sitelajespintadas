/**
 * ══════════════════════════════════════════════════════════════════
 * EXTRAÇÃO COMPLETA DE LEGISLAÇÃO - PREFEITURA DE LAJES PINTADAS/RN
 * ══════════════════════════════════════════════════════════════════
 * 
 * FASE 1: Scraping das tabelas TablePress (decretos, leis, portarias)
 * FASE 2: Extração via API REST WordPress (portarias, leis como CPT)
 * FASE 3: Extração de diárias da página de diárias
 * FASE 4: Importação unificada no banco Prisma
 */

const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const prisma = new PrismaClient();
const WP_URL = 'https://lajespintadas.rn.gov.br';

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'identity',
    'Connection': 'keep-alive',
    'Referer': 'https://lajespintadas.rn.gov.br/',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
};

function decodeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
        .replace(/&#8216;/g, "'").replace(/&#8217;/g, "'")
        .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
        .replace(/&#8230;/g, '...').replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ').replace(/<[^>]*>/g, '')
        .replace(/&#[0-9]+;/g, '').replace(/\n/g, ' ')
        .replace(/\s+/g, ' ').trim();
}

async function fetchPage(url) {
    console.log(`   🌐 Acessando: ${url}`);
    try {
        const res = await fetch(url, { headers: HEADERS, redirect: 'follow' });
        if (!res.ok) {
            console.log(`   ⚠️  Status ${res.status}`);
            return null;
        }
        return await res.text();
    } catch (e) {
        console.log(`   ❌ Erro: ${e.message}`);
        return null;
    }
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ══════════════════════════════════════════════════════
// FASE 1: Scraping de Tabelas TablePress
// ══════════════════════════════════════════════════════

async function scrapeTabelaLegislacao(url, tipo) {
    console.log(`\n📋 FASE 1 - Scraping tabela de ${tipo.toUpperCase()} em: ${url}`);
    const results = [];

    const html = await fetchPage(url);
    if (!html) return results;

    const $ = cheerio.load(html);

    // Busca tabelas (TablePress ou genéricas)
    let rows = $('table.tablepress tbody tr');
    if (rows.length === 0) {
        rows = $('table tbody tr');
    }
    if (rows.length === 0) {
        // Tentar qualquer tabela
        rows = $('table tr').not('thead tr');
    }

    console.log(`   📊 Encontradas ${rows.length} linhas na tabela.`);

    rows.each((i, row) => {
        const cols = $(row).find('td');
        if (cols.length < 2) return;

        const col0 = $(cols[0]).text().trim();
        const col1 = $(cols[1]).text().trim();
        let arquivo = $(row).find('a').attr('href') || null;

        // Parse número/ano do formato "04/2026" ou "004/2026"
        const partes = col0.replace(/\s/g, '').split('/');
        let numero = partes[0] || '';
        let ano = parseInt(partes[1]);

        if (!numero || isNaN(ano)) {
            // Tentar extrair de qualquer coluna
            const textoCompleto = col0 + ' ' + col1;
            const match = textoCompleto.match(/(\d+)\s*\/\s*(20\d{2}|19\d{2})/);
            if (match) {
                numero = match[1];
                ano = parseInt(match[2]);
            } else {
                const anoMatch = textoCompleto.match(/(20\d{2}|19\d{2})/);
                if (anoMatch) {
                    numero = col0 || 'S/N';
                    ano = parseInt(anoMatch[1]);
                } else {
                    return; // Linha não reconhecida
                }
            }
        }

        const ementa = col1 || `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} nº ${numero}/${ano}`;

        if (ementa.length > 3) {
            results.push({ tipo, numero, ano, ementa, arquivo });
        }
    });

    console.log(`   ✅ Extraídos: ${results.length} ${tipo}(s)`);
    return results;
}

// ══════════════════════════════════════════════════════
// FASE 2: Extração via API REST WordPress
// ══════════════════════════════════════════════════════

async function extrairViaRestAPI(endpoint, tipo) {
    console.log(`\n📡 FASE 2 - API REST /wp-json/wp/v2/${endpoint}...`);
    const results = [];
    let page = 1;
    let hasMore = true;

    const apiHeaders = {
        ...HEADERS,
        'Accept': 'application/json',
    };

    while (hasMore) {
        const url = `${WP_URL}/wp-json/wp/v2/${endpoint}?per_page=100&page=${page}&_fields=id,title,link,content,date`;
        console.log(`   Página ${page}...`);

        try {
            const response = await fetch(url, { headers: apiHeaders });

            if (!response.ok) {
                const text = await response.text();
                if (text.includes('rest_post_invalid_page_number') || response.status === 400) {
                    hasMore = false;
                    break;
                }
                console.log(`   ⚠️ Status ${response.status}. Parando.`);
                hasMore = false;
                break;
            }

            const contentType = response.headers.get('content-type') || '';
            if (!contentType.includes('json')) {
                hasMore = false;
                break;
            }

            const items = await response.json();
            if (!Array.isArray(items) || items.length === 0) {
                hasMore = false;
                break;
            }

            for (const item of items) {
                const titulo = decodeHtml(item.title?.rendered || '');
                const conteudo = decodeHtml(item.content?.rendered || '');
                const match = titulo.match(/(\d+)\s*\/\s*(20\d{2}|19\d{2})/);

                if (match) {
                    results.push({
                        tipo,
                        numero: match[1],
                        ano: parseInt(match[2]),
                        ementa: titulo,
                        arquivo: item.link || null,
                    });
                }
            }

            const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');
            if (page >= totalPages) hasMore = false;
            page++;
            await delay(500);
        } catch (err) {
            console.error(`   ❌ Erro: ${err.message}`);
            hasMore = false;
        }
    }

    console.log(`   ✅ Extraídos via API: ${results.length} ${tipo}(s)`);
    return results;
}

// ══════════════════════════════════════════════════════
// FASE 3: Scraping de páginas paginadas do WordPress
// ══════════════════════════════════════════════════════

async function scrapeListaPaginada(baseUrl, tipo) {
    console.log(`\n📄 FASE 3 - Scraping de lista paginada: ${baseUrl}`);
    const results = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const url = page === 1 ? baseUrl : `${baseUrl}page/${page}/`;
        const html = await fetchPage(url);
        if (!html) { hasMore = false; break; }

        const $ = cheerio.load(html);

        // Buscar artigos/posts na listagem
        const articles = $('article, .post, .entry, .elementor-post, .jet-listing-grid__item');
        if (articles.length === 0) {
            // Tentar links genéricos
            const links = $('a[href*="/' + tipo + 's/"], a[href*="/' + tipo + '/"]');
            links.each((i, el) => {
                const href = $(el).attr('href');
                const text = $(el).text().trim();
                if (text && href) {
                    const match = text.match(/(\d+)\s*\/\s*(20\d{2}|19\d{2})/);
                    if (match) {
                        results.push({
                            tipo, numero: match[1], ano: parseInt(match[2]),
                            ementa: decodeHtml(text), arquivo: href,
                        });
                    }
                }
            });
            hasMore = false;
            break;
        }

        articles.each((i, el) => {
            const titleEl = $(el).find('h2 a, h3 a, .entry-title a, .elementor-post__title a, a.jet-listing-dynamic-link__link');
            const title = titleEl.text().trim() || $(el).find('h2, h3, .entry-title').text().trim();
            const link = titleEl.attr('href') || $(el).find('a').first().attr('href');

            if (title) {
                const match = title.match(/(\d+)\s*\/\s*(20\d{2}|19\d{2})/);
                if (match) {
                    results.push({
                        tipo, numero: match[1], ano: parseInt(match[2]),
                        ementa: decodeHtml(title), arquivo: link || null,
                    });
                }
            }
        });

        // Verificar se há próxima página
        const nextLink = $('a.next, .nav-next a, a[rel="next"], .pagination .next');
        if (nextLink.length === 0) hasMore = false;

        page++;
        if (page > 50) hasMore = false; // segurança
        await delay(800);
    }

    console.log(`   ✅ Extraídos via scraping paginado: ${results.length} ${tipo}(s)`);
    return results;
}

// ══════════════════════════════════════════════════════
// FASE 4: Buscar detalhes de cada post individual para PDFs
// ══════════════════════════════════════════════════════

async function buscarPDFsIndividuais(documentos) {
    console.log(`\n🔍 FASE 4 - Buscando PDFs em ${documentos.length} páginas individuais...`);
    let found = 0;
    
    for (let i = 0; i < documentos.length; i++) {
        const doc = documentos[i];
        if (!doc.arquivo || doc.arquivoPdf) continue;
        
        // Só buscar se o arquivo é uma URL de página (não PDF)
        if (doc.arquivo.endsWith('.pdf')) {
            doc.arquivoPdf = doc.arquivo;
            found++;
            continue;
        }

        try {
            const html = await fetchPage(doc.arquivo);
            if (!html) continue;
            
            const $ = cheerio.load(html);
            
            // Buscar links para PDF na página do documento
            const pdfLinks = $('a[href$=".pdf"]');
            if (pdfLinks.length > 0) {
                doc.arquivoPdf = pdfLinks.first().attr('href');
                found++;
                console.log(`   📎 PDF encontrado para ${doc.tipo} ${doc.numero}/${doc.ano}`);
            }
            
            // Buscar iframe de PDF (elementor, google docs)
            const iframes = $('iframe[src*=".pdf"], iframe[src*="docs.google"]');
            if (iframes.length > 0 && !doc.arquivoPdf) {
                doc.arquivoPdf = iframes.first().attr('src');
                found++;
                console.log(`   📎 PDF (iframe) encontrado para ${doc.tipo} ${doc.numero}/${doc.ano}`);
            }

            // Buscar no conteúdo embed/object
            const embeds = $('embed[src*=".pdf"], object[data*=".pdf"]');
            if (embeds.length > 0 && !doc.arquivoPdf) {
                doc.arquivoPdf = embeds.first().attr('src') || embeds.first().attr('data');
                found++;
            }
            
            await delay(400);
        } catch (e) {
            // Continua mesmo com erro
        }

        // Feedback de progresso
        if ((i + 1) % 10 === 0) {
            console.log(`   ... ${i + 1}/${documentos.length} processados`);
        }
    }
    
    console.log(`   ✅ PDFs encontrados: ${found}/${documentos.length}`);
    return documentos;
}

// ══════════════════════════════════════════════════════
// IMPORTAÇÃO NO BANCO DE DADOS
// ══════════════════════════════════════════════════════

async function importarNoBanco(documentos) {
    console.log(`\n💾 IMPORTANDO ${documentos.length} documentos no banco de dados...`);
    let importados = 0;
    let duplicados = 0;
    let erros = 0;

    for (const doc of documentos) {
        try {
            // Verificar duplicata
            const existe = await prisma.legislacao.findFirst({
                where: { tipo: doc.tipo, numero: doc.numero, ano: doc.ano }
            });

            if (!existe) {
                await prisma.legislacao.create({
                    data: {
                        tipo: doc.tipo,
                        numero: doc.numero,
                        ano: doc.ano,
                        ementa: doc.ementa,
                        arquivo: doc.arquivoPdf || doc.arquivo || null,
                        ativo: true,
                    }
                });
                importados++;
            } else {
                // Atualizar o arquivo se encontramos um PDF e o registro não tinha
                if (doc.arquivoPdf && (!existe.arquivo || !existe.arquivo.endsWith('.pdf'))) {
                    await prisma.legislacao.update({
                        where: { id: existe.id },
                        data: { arquivo: doc.arquivoPdf }
                    });
                    console.log(`   🔄 Atualizado PDF: ${doc.tipo} ${doc.numero}/${doc.ano}`);
                }
                duplicados++;
            }
        } catch (e) {
            erros++;
        }
    }

    console.log(`\n   ✅ Importados: ${importados}`);
    console.log(`   🔄 Duplicados/Atualizados: ${duplicados}`);
    if (erros > 0) console.log(`   ❌ Erros: ${erros}`);
}

// ══════════════════════════════════════════════════════
// FUNÇÃO PRINCIPAL
// ══════════════════════════════════════════════════════

async function main() {
    console.log('══════════════════════════════════════════════════════════');
    console.log('🏛️  EXTRAÇÃO COMPLETA DE LEGISLAÇÃO - LAJES PINTADAS/RN');
    console.log('══════════════════════════════════════════════════════════\n');

    const todosDocumentos = [];

    // ── DECRETOS ──
    // 1a. Tabela na página de decretos
    const decretosTabela = await scrapeTabelaLegislacao(`${WP_URL}/decretos/`, 'decreto');
    todosDocumentos.push(...decretosTabela);
    await delay(1000);

    // 1b. Lista paginada de decretos
    const decretosLista = await scrapeListaPaginada(`${WP_URL}/decretos/`, 'decreto');
    todosDocumentos.push(...decretosLista);
    await delay(1000);

    // ── PORTARIAS ──
    // 2a. Tabela na página de portarias
    const portariasTabela = await scrapeTabelaLegislacao(`${WP_URL}/portarias-municipais/`, 'portaria');
    todosDocumentos.push(...portariasTabela);
    await delay(1000);

    // 2b. API REST
    const portariasAPI = await extrairViaRestAPI('portarias', 'portaria');
    todosDocumentos.push(...portariasAPI);
    await delay(1000);

    // 2c. Lista paginada
    const portariasLista = await scrapeListaPaginada(`${WP_URL}/portarias/`, 'portaria');
    todosDocumentos.push(...portariasLista);
    await delay(1000);

    // ── LEIS ──
    // 3a. Tabela na página de leis
    const leisTabela = await scrapeTabelaLegislacao(`${WP_URL}/leis-municipais/`, 'lei');
    todosDocumentos.push(...leisTabela);
    await delay(1000);

    // 3b. API REST
    const leisAPI = await extrairViaRestAPI('leis', 'lei');
    todosDocumentos.push(...leisAPI);
    await delay(1000);

    // ── PORTARIAS DE DIÁRIAS ──
    // 4a. Tabela na página de diárias
    const diariasTab = await scrapeTabelaLegislacao(`${WP_URL}/diarias/`, 'portaria_diaria');
    todosDocumentos.push(...diariasTab);
    await delay(1000);

    // 4b. Tentar outras URLs de diárias/portarias de diárias
    const diariasTab2 = await scrapeTabelaLegislacao(`${WP_URL}/portarias-de-diarias/`, 'portaria_diaria');
    todosDocumentos.push(...diariasTab2);
    await delay(1000);

    // ── DEDUPLICAÇÃO ──
    console.log('\n🔧 Deduplicando resultados...');
    const uniqueMap = new Map();
    todosDocumentos.forEach(doc => {
        const key = `${doc.tipo}|${doc.numero}|${doc.ano}`;
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, doc);
        } else {
            // Manter o que tem mais informação
            const existing = uniqueMap.get(key);
            if (!existing.arquivo && doc.arquivo) {
                uniqueMap.set(key, doc);
            }
            if (doc.ementa.length > existing.ementa.length) {
                uniqueMap.set(key, { ...doc, arquivo: doc.arquivo || existing.arquivo });
            }
        }
    });
    const documentosUnicos = Array.from(uniqueMap.values());
    console.log(`   De ${todosDocumentos.length} brutos → ${documentosUnicos.length} únicos`);

    // ── BUSCAR PDFs NOS POSTS INDIVIDUAIS ──
    await buscarPDFsIndividuais(documentosUnicos);

    // ── RESUMO ──
    const porTipo = {};
    documentosUnicos.forEach(d => { porTipo[d.tipo] = (porTipo[d.tipo] || 0) + 1; });

    console.log('\n══════════════════════════════════════════════════════════');
    console.log('📊 RESUMO FINAL DA EXTRAÇÃO:');
    console.log('══════════════════════════════════════════════════════════');
    Object.entries(porTipo).sort().forEach(([tipo, count]) => {
        console.log(`   📂 ${tipo.toUpperCase().padEnd(20)} ${count} documento(s)`);
    });
    console.log(`   ─────────────────────────────────────────`);
    console.log(`   📦 TOTAL: ${documentosUnicos.length} documento(s)`);
    console.log('══════════════════════════════════════════════════════════');

    // ── SALVAR JSON ──
    const outputFile = path.join(__dirname, 'legislacao-completa.json');
    fs.writeFileSync(outputFile, JSON.stringify(documentosUnicos, null, 2), 'utf8');
    console.log(`\n💾 JSON salvo em: ${outputFile}`);

    // ── AMOSTRA DE CADA TIPO ──
    Object.keys(porTipo).sort().forEach(tipo => {
        const amostra = documentosUnicos.filter(d => d.tipo === tipo).slice(0, 5);
        console.log(`\n📋 Amostra de ${tipo.toUpperCase()}:`);
        amostra.forEach(d => {
            const pdf = d.arquivoPdf ? ' 📎' : '';
            console.log(`   • ${d.numero}/${d.ano} – ${d.ementa.substring(0, 90)}${pdf}`);
        });
    });

    // ── IMPORTAR NO BANCO ──
    console.log('\n');
    await importarNoBanco(documentosUnicos);

    // ── VERIFICAÇÃO FINAL ──
    const totalBanco = await prisma.legislacao.count({ where: { ativo: true } });
    const porTipoBanco = await prisma.legislacao.groupBy({
        by: ['tipo'],
        _count: true,
        where: { ativo: true }
    });

    console.log('\n══════════════════════════════════════════════════════════');
    console.log('✅ ESTADO FINAL DO BANCO DE DADOS:');
    console.log('══════════════════════════════════════════════════════════');
    porTipoBanco.forEach(g => {
        console.log(`   📂 ${g.tipo.toUpperCase().padEnd(20)} ${g._count} registro(s)`);
    });
    console.log(`   ─────────────────────────────────────────`);
    console.log(`   📦 TOTAL NO BANCO: ${totalBanco} registro(s)`);
    console.log('══════════════════════════════════════════════════════════');
}

main()
    .catch(e => console.error('❌ ERRO FATAL:', e))
    .finally(async () => {
        await prisma.$disconnect();
        console.log('\n🏁 Processo finalizado.');
    });
