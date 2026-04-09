async function testApi(slug) {
    const url = 'https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/relatorio/pesquisa';
    const body = {
        slug: slug,
        ano: 0,
        pesquisa: ''
    };

    console.log(`Testing API for ${slug}...`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const text = await response.text();
        try {
            const data = JSON.parse(text);
            console.log(`Result for ${slug}:`, JSON.stringify(data, null, 2));
        } catch (e) {
            console.log(`Raw text for ${slug}:`, text.substring(0, 500));
        }
    } catch (error) {
        console.error(`Error for ${slug}:`, error.message);
    }
}

async function main() {
    await testApi('lei-de-diretrizes-orcamentarias-ldo');
    await testApi('lei-orcamentaria-anual-loa');
}

main();
