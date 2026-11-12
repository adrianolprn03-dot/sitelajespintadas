const fs = require('fs');
const content = fs.readFileSync('C:/Users/User/Downloads/ficha-2026.csv', 'utf-8');

// Parse CSV taking multi-line quotes into account
function parseCSV(text) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let insideQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];
        
        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                currentField += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ';' && !insideQuotes) {
            currentRow.push(currentField);
            currentField = '';
        } else if ((char === '\r' || char === '\n') && !insideQuotes) {
            if (char === '\r' && nextChar === '\n') {
                i++;
            }
            currentRow.push(currentField);
            if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
                rows.push(currentRow);
            }
            currentRow = [];
            currentField = '';
        } else {
            currentField += char;
        }
    }
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }
    return rows;
}

const rows = parseCSV(content);
console.log('Total de linhas:', rows.length);
const header = rows[0];
console.log('Header:', header);

const data = rows.slice(1).map((r, i) => ({
    index: i + 1,
    dimensao: r[1],
    criterio: r[2],
    exigibilidade: r[3],
    disponibilidade: r[4],
    atualidade: r[5],
    serieHistorica: r[6],
    gravacaoRelatorios: r[7],
    filtrosPesquisa: r[8],
    autoavaliacao: r[9],
    evidencia: r[10]
}));

console.log('Total critérios:', data.length);
fs.writeFileSync('scripts/parsed_ficha.json', JSON.stringify(data, null, 2), 'utf-8');
console.log('Saved to scripts/parsed_ficha.json');

