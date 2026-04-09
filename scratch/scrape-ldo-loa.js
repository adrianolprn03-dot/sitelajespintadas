
async function extractFiles(url) {
    const res = await fetch(url);
    const text = await res.text();
    
    // The HTML contains things like <a href="/arquivo/downloadarquivoporidasync?idArquivo=2204" class="btn ...">
    const regex = /<a[^>]+href="([^"]+downloadarquivoporidasync\?idArquivo=[0-9]+)"[^>]*>/gi;
    const links = new Set();
    let match;
    while ((match = regex.exec(text)) !== null) {
        links.add("https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br" + match[1]);
    }
    
    // Also try to find the year/text associated with it if possible, but extracting just IDs is enough for a check
    console.log(`Found ${links.size} files in ${url}`);
    console.log([...links]);
}

async function main() {
    await extractFiles('https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/arquivos/lei-de-diretrizes-orcamentarias-ldo');
    await extractFiles('https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/arquivos/lei-orcamentaria-anual-loa');
}

main();
