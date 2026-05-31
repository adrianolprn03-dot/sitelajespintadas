const AdmZip = require('adm-zip');
const zip = new AdmZip('wordpress/uploud.zip');
const entries = zip.getEntries();
const pdfs = entries.filter(e => e.entryName.toLowerCase().endsWith('.pdf') && !e.entryName.toLowerCase().includes('complianz'));
console.log(`Encontrados ${pdfs.length} PDFs (excluindo complianz) no zip.`);
// Mostrar os 30 primeiros
console.log(pdfs.slice(0, 30).map(e => e.entryName));
