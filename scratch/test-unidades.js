const cheerio = require('cheerio');

async function testUrl(url) {
    const res = await fetch(url);
    const text = await res.text();
    const $ = cheerio.load(text);
    
    // Attempt to see how the units are listed. Usually h3 or strong inside paragraphs.
    console.log("Analyzing:", url);
    // Find typical content container
    const content = $('.elementor-widget-container, .entry-content').text();
    console.log("Content sample (first 1000 chars):", content.substring(0, 1000));
}

async function main() {
    await testUrl('https://lajespintadas.rn.gov.br/unidades-de-saude/');
}
main();
