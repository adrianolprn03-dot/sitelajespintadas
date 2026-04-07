const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://lajespintadas.rn.gov.br/wp-json/wp/v2';
const OUTPUT_FILE = path.join(__dirname, 'legislacao-completa.json');

async function fetchAllFromEndpoint(endpoint, queryParams = '') {
    let allData = [];
    let page = 1;
    let totalPages = 1;

    console.log(`\n--- Buscando dados de: ${endpoint} ---`);

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    do {
        const url = `${BASE_URL}/${endpoint}?per_page=10&page=${page}${queryParams}`;
        let success = false;
        let retries = 3;

        while (!success && retries > 0) {
            try {
                const response = await fetch(url);
                
                if (page === 1) {
                    const pages = response.headers.get('X-WP-TotalPages') || response.headers.get('x-wp-totalpages');
                    totalPages = parseInt(pages || '1');
                    const total = response.headers.get('X-WP-Total') || response.headers.get('x-wp-total');
                    console.log(`Total de itens: ${total}, Total de páginas: ${totalPages}`);
                }

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        allData = allData.concat(data);
                        console.log(`Pagina ${page}/${totalPages} carregada (${data.length} itens). Total: ${allData.length}`);
                        success = true;
                    } else {
                        console.error(`Dados inválidos na pág ${page}`);
                        break;
                    }
                } else {
                    console.error(`Erro na pág ${page} (Status ${response.status}). Retentativas: ${retries - 1}`);
                    retries--;
                    await delay(2000 * (4 - retries));
                }
            } catch (error) {
                console.error(`Falha na pág ${page}: ${error.message}. Retentativas: ${retries - 1}`);
                retries--;
                await delay(2000 * (4 - retries));
            }
        }

        if (!success) {
            console.error(`Desistindo da página ${page} após 3 tentativas.`);
            break; 
        }

        page++;
    } while (page <= totalPages);

    return allData;
}

function parseLegislacao(title, typeDefault = 'portaria') {
    const t = title.toUpperCase();
    let tipo = typeDefault;
    let numero = '';
    let ano = new Date().getFullYear().toString();

    if (t.includes('LEI')) tipo = 'lei';
    else if (t.includes('DECRETO')) tipo = 'decreto';
    else if (t.includes('PORTARIA')) tipo = 'portaria';

    // Regex para capturar NXXX-YYYY ou NXXX/YYYY ou NXXX YYYY
    const regexFull = /(?:N|Nº|N°|NUMERO)\s?(\d+)[-\/\s](\d{4})/i;
    const matchFull = title.match(regexFull);

    if (matchFull) {
        numero = matchFull[1];
        ano = matchFull[2];
    } else {
        // Tenta capturar apenas o número se o ano não estiver grudado
        const regexNum = /(?:N|Nº|N°|NUMERO)\s?(\d+)/i;
        const matchNum = title.match(regexNum);
        if (matchNum) numero = matchNum[1];

        const regexAno = /(20\d{2})/;
        const matchAno = title.match(regexAno);
        if (matchAno) ano = matchAno[1];
    }

    return { tipo, numero, ano };
}

async function extrairTudo() {
    console.log('--- Iniciando Extração Massiva de Legislação ---');

    // 1. Extrair da Media Library (onde estão a maioria dos PDFs)
    const mediaItems = await fetchAllFromEndpoint('media');
    console.log(`Total de mídia analisada: ${mediaItems.length}`);

    const legislacao = [];

    mediaItems.forEach(item => {
        const titleRaw = item.title.rendered;
        const t = titleRaw.toLowerCase();

        if (t.includes('portaria') || t.includes('lei') || t.includes('decreto')) {
            const { tipo, numero, ano } = parseLegislacao(titleRaw);
            
            legislacao.push({
                titulo: titleRaw,
                tipo,
                numero,
                ano: parseInt(ano),
                dataPublicacao: item.date,
                linkArquivo: item.source_url,
                ementa: titleRaw, // Usando o título como ementa inicial
                subtipo: t.includes('diaria') || t.includes('diária') ? 'portaria_diaria' : null
            });
        }
    });

    // 2. Extrair das postagens de Leis, Decretos e Portarias (CPTs)
    const endpoints = ['leis', 'decretos', 'portarias'];
    for (const ep of endpoints) {
        const posts = await fetchAllFromEndpoint(ep);
        posts.forEach(p => {
            const titleRaw = p.title.rendered;
            const { tipo, numero, ano } = parseLegislacao(titleRaw, ep.slice(0, -1));
            
            // Evitar duplicatas por link de arquivo se possível, ou por Título/Numero/Ano
            const link = p.link_pdf || p.link || ''; 
            
            legislacao.push({
                titulo: titleRaw,
                tipo,
                numero,
                ano: parseInt(ano),
                dataPublicacao: p.date,
                linkArquivo: link,
                ementa: p.content?.rendered?.replace(/<[^>]*>?/gm, '').substring(0, 500).trim() || titleRaw,
                subtipo: (titleRaw.toLowerCase().includes('diaria') || titleRaw.toLowerCase().includes('diária')) ? 'portaria_diaria' : null
            });
        });
    }

    console.log(`Extração finalizada. Total de documentos legislativos encontrados: ${legislacao.length}`);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(legislacao, null, 2));
    console.log(`Dados salvos em ${OUTPUT_FILE}`);
}

extrairTudo();
