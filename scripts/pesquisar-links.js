const cheerio = require('cheerio');

async function pesquisarLinks() {
    console.log('--- Pesquisando links de Transparência ---');
    try {
        const response = await fetch('https://lajespintadas.rn.gov.br/transparencia-3/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
            }
        });
        
        if (!response.ok) {
            console.error(`Erro ao acessar: ${response.status}`);
            return;
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        
        const links = [];
        $('a').each((i, el) => {
            const text = $(el).text().trim();
            const href = $(el).attr('href');
            if (!href) return;

            const t = text.toLowerCase();
            if (t.includes('portaria') || t.includes('lei') || t.includes('decreto') || t.includes('legislacao')) {
                links.push({ text, href });
            }
        });

        console.log('Links encontrados:');
        console.table(links);

    } catch (error) {
        console.error('Erro na pesquisa:', error);
    }
}

pesquisarLinks();
