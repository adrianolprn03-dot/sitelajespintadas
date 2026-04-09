const cheerio = require('cheerio');

async function testUrl(url) {
    const res = await fetch(url);
    const text = await res.text();
    const $ = cheerio.load(text);
    
    // Attempt to extract the text inside elementor-text-editor or similar
    const items = [];
    $('.elementor-text-editor p, .elementor-text-editor li').each((i, el) => {
        items.push($(el).text().trim().substring(0, 150));
    });
    
    console.log("Found pieces:");
    console.log(items.filter(x => x.length > 5).join('\n---\n'));
}

async function main() {
    await testUrl('https://lajespintadas.rn.gov.br/unidades-de-saude/');
    console.log("\n=======\n");
    await testUrl('https://lajespintadas.rn.gov.br/unidades-escolares/');
}
main();
