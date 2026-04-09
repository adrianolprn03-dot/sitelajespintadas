async function checkHtmlStructure(url) {
    const res = await fetch(url);
    const text = await res.text();
    
    const index = text.indexOf('.pdf"');
    if (index !== -1) {
        console.log("HTML around first PDF link:\n", text.substring(index - 300, index + 300));
    } else {
        console.log("No PDF found.");
    }
}

checkHtmlStructure('https://lajespintadas.rn.gov.br/leis-municipais/');
