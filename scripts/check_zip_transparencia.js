const AdmZip = require('adm-zip');
const zip = new AdmZip('wordpress/uploud.zip');
const entries = zip.getEntries();
const trans = entries.filter(e => e.entryName.toLowerCase().includes('transparencia'));
console.log(trans.map(e => e.entryName));
