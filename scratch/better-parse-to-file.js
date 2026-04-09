const fs = require('fs');
const cheerio = require('cheerio');

async function extractText(url, tag) {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    $('script, style, header, footer, nav, .elementor-sitemap-item').remove();
    
    // Attempting to keep spacing
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    return `\n=== ${tag} ===\n` + text.substring(0, 3000);
}

async function main() {
    const t1 = await extractText('https://lajespintadas.rn.gov.br/unidades-escolares/', 'Escolas');
    const t2 = await extractText('https://lajespintadas.rn.gov.br/socioassistencial/', 'Socioassistencial');
    fs.writeFileSync('scratch/units.txt', t1 + t2);
}

main();
