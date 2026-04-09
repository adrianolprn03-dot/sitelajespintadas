const fs = require('fs');

async function checkAndInstall() {
    try {
        require('cheerio');
    } catch(e) {
        console.log("Cheerio not found, installing in scratch directory...");
        const { execSync } = require('child_process');
        execSync('npm install cheerio', { stdio: 'inherit', cwd: __dirname });
    }
}

async function scrapePage(url, tipo, categoria) {
    const cheerio = require('cheerio');
    console.log(`Scraping ${url} ...`);
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    const results = [];
    
    // As observed, these WP pages often have rows in a table `tr` with `.column-1`, `.column-2`, `.column-3`
    $('tr').each((i, el) => {
        const col1 = $(el).find('.column-1').text().trim();
        const col2 = $(el).find('.column-2').text().trim();
        const col3Html = $(el).find('.column-3').html() || '';
        const linkMatch = col3Html.match(/href="([^"]+)"/);
        const arquivo = linkMatch ? linkMatch[1] : null;

        if (col1 && col2 && arquivo && col1 !== 'Número') { // ignore table header 'Número' 
            // Extract Number and Year
            let numero = col1;
            let ano = new Date().getFullYear();
            
            // Typical format is 436/2026 or 436/26 or "LEI 123"
            const yearMatch = col1.match(/\/(\d{4})/);
            if (yearMatch) {
                ano = parseInt(yearMatch[1], 10);
            } else {
                // look inside the URL for year like /uploads/2024/05/
                const urlYearMatch = arquivo.match(/\/uploads\/(\d{4})\//);
                if (urlYearMatch) ano = parseInt(urlYearMatch[1], 10);
            }
            
            results.push({
                tipo,
                categoria,
                numero,
                ano,
                ementa: col2,
                arquivo,
                ativo: true
            });
        }
    });
    
    console.log(`Extracted ${results.length} items from ${url}`);
    return results;
}

async function main() {
    await checkAndInstall();
    
    const allData = [];
    
    const leis = await scrapePage('https://lajespintadas.rn.gov.br/leis-municipais/', 'lei', 'Lei');
    const decretos = await scrapePage('https://lajespintadas.rn.gov.br/decretos/', 'decreto', 'Decreto');
    const portarias = await scrapePage('https://lajespintadas.rn.gov.br/portarias-municipais/', 'portaria', 'Portaria');
    
    allData.push(...leis, ...decretos, ...portarias);
    
    // Save to legis.json
    fs.writeFileSync('legis.json', JSON.stringify(allData, null, 2));
    console.log(`Saved ${allData.length} records to legis.json`);
}

main().catch(console.error);
