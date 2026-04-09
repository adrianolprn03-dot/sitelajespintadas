const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('scratch/saude.html', 'utf8');
const $ = cheerio.load(html);

const items = [];
// This typically targets Elementor text editor blocks. Let's look inside them.
$('.elementor-text-editor').each((i, el) => {
    items.push($(el).text().trim());
});

console.log("Found pieces:", items.length);
if (items.length > 0) {
    items.forEach((x, i) => console.log(`Piece ${i}:`, x.substring(0, 200)));
} else {
    // If elementor-text-editor is not there, let's just get all <p> and <li> that have substantial text
    console.log("\nFalling back to <p> tags...");
    $('p').each((i, el) => {
        const t = $(el).text().trim();
        if (t.length > 30) {
            console.log(`P ${i}:`, t.substring(0, 150));
        }
    });
}
