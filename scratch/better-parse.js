const fs = require('fs');
const cheerio = require('cheerio');

async function extractText(url, tag) {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    $('script, style, header, footer, nav, .elementor-sitemap-item').remove();
    
    // Attempting to keep spacing
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    console.log(`\n=== ${tag} ===\n`);
    console.log(text.substring(0, 1500));
}

async function main() {
    await extractText('https://lajespintadas.rn.gov.br/unidades-escolares/', 'Escolas');
    await extractText('https://lajespintadas.rn.gov.br/socioassistencial/', 'Socioassistencial');
}

main();
