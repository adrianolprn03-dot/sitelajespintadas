const AdmZip = require('adm-zip');
const zip = new AdmZip('wordpress/uploud.zip');
const entries = zip.getEntries();
const pdfs = entries.filter(e => e.entryName.toLowerCase().endsWith('.pdf'));
console.log(`Encontrados ${pdfs.length} PDFs no zip.`);
// Mostrar os 15 primeiros para ter uma ideia
console.log(pdfs.slice(0, 15).map(e => e.entryName));
