const cheerio = require('cheerio');

async function testFetch() {
    try {
        const response = await fetch('https://lajespintadas.rn.gov.br/diarias/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const html = await response.text();
        const $ = cheerio.load(html);
        const rows = $('table tr').length;
        console.log(`Linhas encontradas: ${rows}`);
        
        // Se encontrar poucos, pode ser que DataTables esteja carregando via JSON em um script
        if (rows < 20) {
            console.log("Poucas linhas no HTML. Verificando scripts...");
            $('script').each((i, el) => {
                const content = $(el).text();
                if (content.includes('data') && content.includes('[')) {
                    console.log(`Script ${i} parece conter dados.`);
                }
            });
        }
    } catch (e) {
        console.error(e);
    }
}

testFetch();
