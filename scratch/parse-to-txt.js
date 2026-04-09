const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('scratch/saude.html', 'utf8');
const $ = cheerio.load(html);

// Remove scripts and styles
$('script, style').remove();

const text = $('body').text().replace(/\s+/g, '\n').split('\n').filter(x => x.length > 2).join('\n');
fs.writeFileSync('scratch/saude-text.txt', text);
