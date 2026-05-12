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
    let content = fs.readFileSync(f, 'utf8');
    const lines = content.split('\n');
    const newLines = [];
    let seenDynamic = false;
    for (let line of lines) {
        if (line.includes('export const dynamic = "force-dynamic";') || line.includes("export const dynamic = 'force-dynamic';")) {
            if (!seenDynamic) {
                newLines.push('export const dynamic = "force-dynamic";');
                seenDynamic = true;
            }
        } else {
            newLines.push(line);
        }
    }
    const newContent = newLines.join('\n');
    if (content !== newContent) {
        fs.writeFileSync(f, newContent);
        count++;
    }
});
console.log('Fixed ' + count + ' files');
