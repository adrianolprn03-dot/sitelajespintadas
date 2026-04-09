async function checkHtml(url) {
    console.log("Checking:", url);
    const res = await fetch(url);
    const text = await res.text();
    const titleMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i);
    console.log("Title:", titleMatch ? titleMatch[1] : "No title");
    
    // Check for PDF links
    const pdfLinks = [];
    const regex = /<a[^>]+href="([^"]+\.pdf)"[^>]*>([^<]+)<\/a>/gi;
    let match;
    while ((match = regex.exec(text)) !== null && pdfLinks.length < 5) {
        pdfLinks.push({ url: match[1], text: match[2].trim().replace(/\s+/g, ' ') });
    }
    console.log("Found PDFs:", pdfLinks);
    console.log("Total HTML length:", text.length, "bytes");
}

async function main() {
    await checkHtml('https://lajespintadas.rn.gov.br/leis-municipais/');
}
main();
