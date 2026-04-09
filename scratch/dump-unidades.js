const fs = require('fs');
async function dumpHtml(url, file) {
    const res = await fetch(url);
    const text = await res.text();
    fs.writeFileSync(file, text);
    console.log("Dumped", url, "to", file);
}

async function main() {
    await dumpHtml('https://lajespintadas.rn.gov.br/unidades-de-saude/', 'scratch/saude.html');
}
main();
