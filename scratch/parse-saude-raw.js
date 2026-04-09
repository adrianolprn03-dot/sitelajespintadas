const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('scratch/saude.html', 'utf8');
const $ = cheerio.load(html);

// Just print the whole body text
const text = $('body').text().replace(/\s+/g, ' ');
console.log("Total length:", text.length);

if (text.length > 500) {
    console.log(text.substring(2100, 3100)); // Print a slice where content usually is
}
