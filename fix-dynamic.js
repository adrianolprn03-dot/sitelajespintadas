const fs = require('fs');
const path = require('path');
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('route.ts')) results.push(file);
        }
    });
    return results;
}
const files = walk('src/app/api');
let count = 0;
files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    if (!content.includes('export const dynamic = "force-dynamic";')) {
        fs.writeFileSync(f, 'export const dynamic = "force-dynamic";\n' + content);
        count++;
    }
});
console.log('Modified ' + count + ' files');
