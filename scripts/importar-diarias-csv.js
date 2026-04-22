/**
 * Importador de Diárias - CSV → PostgreSQL (via Prisma)
 * Suporte a encoding Windows-1252 (latin1)
 * Prefeitura de Lajes Pintadas/RN
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

// Caminho do arquivo CSV
const CSV_PATH = 'C:\\Users\\User\\Downloads\\6-Diarias-2026-04-21.csv';

// ─── Funções auxiliares ──────────────────────────────────────────────────────

function parseCurrency(val) {
    if (!val) return 0;
    const cleaned = val.toString()
        .replace(/"/g, '')
        .replace('R$', '')
        .trim()
        .replace(/\./g, '')
        .replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
}

function parseQuantidade(val) {
    if (!val) return 1;
    const s = val.toString().replace(/"/g, '').trim();
    // Frações comuns no CSV
    if (s === '0/5' || s === '½' || s === '0,5') return 0.5;
    if (s === '1/5' || s === '1½') return 1.5;
    if (s === '2/5') return 2.5;
    if (s === '3/5') return 3.5;
    if (/^O?\d+$/.test(s)) return parseInt(s.replace('O', '')) || 1;
    const num = parseFloat(s.replace(',', '.'));
    return isNaN(num) ? 1 : num;
}

function parseDate(dateStr) {
    if (!dateStr || !dateStr.trim()) return new Date();
    const s = dateStr.replace(/"/g, '').trim();
    const parts = s.split('/');
    if (parts.length === 3) {
        const [d, m, y] = parts;
        return new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T12:00:00Z`);
    }
    return new Date();
}

function classificarSecretaria(cargo, motivo) {
    const t = (cargo + ' ' + motivo).toLowerCase();
    
    // Saúde
    if (/sa[uú]de|ubs|m[eé]dic[oa]|enferm|farm[aá]|nutrici|dentist|hospital|sus|oncolog|fisioter|psic[oó]log|psiquiat|neurol|pediatra|obstetr|odontol|agente.*comunit|sub.?coord.*sa[uú]de|conselho.*sa[uú]de|membro.*sa[uú]de/.test(t)) return 'Saúde';
    
    // Educação
    if (/educa|escola|professor|ensino|pedagog|creche|alfabetiz|enem|pnaic|fnde|undime|semec|merenda|alimenta[çc][aã]o.*escolar|secretari.*educa|f.rum.*educa|coord.*pedagog/.test(t)) return 'Educação';
    
    // Assistência Social / Conselho Tutelar
    if (/assist[eê]ncia.*social|assistente social|bolsa fam[ií]lia|habita[çc][aã]|cras\b|creas|conselho.*tutelar|conselhei.*tutelar|tutelar|cmdca|crian[çc]a|adolescente|idoso|scfv|paif|peti|igdm|benefi.*social|unicef|articuladora.*unicef|vigilancia.*social|secretari.*social/.test(t)) return 'Assistência Social';
    
    // Obras e Infraestrutura
    if (/obras|infraestrutura|constru[çc][aã]|pavimenta[çc][aã]|engenhei|limpeza|manuten[çc][aã]|urbanismo|tr[aâ]nsito|vigilancia.*sanit/.test(t)) return 'Obras e Infraestrutura';
    
    // Agricultura e Meio Ambiente
    if (/agricultur|rural|agron[oô]mo|agropecuaria|emater|idema|pronaf|pesca|aquicultura|meio ambiente|ambiental|secretari.*agricultur/.test(t)) return 'Agricultura e Meio Ambiente';
    
    // Turismo, Esporte e Cultura
    if (/turismo|esport|lazer|cultura|festival|evento|desfile|artesanato|secretari.*turismo|secretari.*esport|secretari.*cultura/.test(t)) return 'Turismo, Esporte e Cultura';
    
    // Finanças e Controle
    if (/financ|cont[aá]bil|contab|tribut|arrecad|tesouro|siconfi|siafem|tce\b|audit|controla|controle.*interno|secretari.*financ|tesourei|contador/.test(t)) return 'Finanças e Controle';

    // Comunicação
    if (/comunica[çc][aã]|imprensa|m[ií]dia|redes sociais|assessori.*imprensa|coord.*comunica/.test(t)) return 'Comunicação e Imprensa';

    // Administração
    if (/administra[çc][aã]|recursos humanos|\brh\b|concurso|sele[çc][aã]o|licita[çc][aã]|contratos|compras|almoxarif|patrim[oô]nio|secretari.*administra|auxiliar.*administrat|agente.*administrat|coord.*imobili/.test(t)) return 'Administração';

    // Procuradoria
    if (/procurador|jur[ií]dic|advogad/.test(t)) return 'Procuradoria Jurídica';
    
    // Gabinete do Prefeito / Não classificado
    return 'Gabinete do Prefeito';
}

// Parser de CSV com suporte a aspas
function parseCsvLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of line) {
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current.trim());
    return values;
}

// ─── Função principal ────────────────────────────────────────────────────────

async function main() {
    console.log('═══════════════════════════════════════════');
    console.log('  IMPORTADOR DE DIÁRIAS — Lajes Pintadas  ');
    console.log('═══════════════════════════════════════════');
    console.log(`📂 Arquivo: ${CSV_PATH}\n`);

    if (!fs.existsSync(CSV_PATH)) {
        console.error('❌ Arquivo CSV não encontrado!');
        process.exit(1);
    }

    // Lê com encoding latin1 (Windows-1252) para preservar acentos
    const content = fs.readFileSync(CSV_PATH, 'latin1');
    const lines = content.split('\n').filter(l => l.trim());

    console.log(`📊 Total de linhas no CSV: ${lines.length} (incluindo cabeçalho)`);

    // Limpa tabela e reimporta do zero
    const existingCount = await prisma.diaria.count();
    console.log(`🗃️  Registros atuais no banco: ${existingCount}`);
    
    if (existingCount > 0) {
        await prisma.diaria.deleteMany();
        console.log(`🧹 Tabela limpa para reimportação completa.`);
    }

    let importados = 0;
    let erros = 0;
    const secretariaStats = {};

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const values = parseCsvLine(line);
        if (values.length < 9) {
            console.warn(`⚠️  Linha ${i + 1}: Colunas insuficientes (${values.length}) — ignorada`);
            erros++;
            continue;
        }

        const dataInicio = parseDate(values[0]);
        const dataFim = parseDate(values[1]);
        const cargo = values[2] || 'Não informado';
        const servidor = values[3] || 'Não informado';
        const motivo = values[4] || 'Não informado';
        const destino = values[5] || 'Não informado';
        const quantidadeDias = parseQuantidade(values[6]);
        const valorUnitario = parseCurrency(values[7]);
        const valor = parseCurrency(values[8]);
        const secretaria = classificarSecretaria(cargo, motivo);
        const mes = dataInicio.getMonth() + 1;
        const ano = dataInicio.getFullYear();

        if (isNaN(dataInicio.getTime())) {
            console.warn(`⚠️  Linha ${i + 1}: Data inválida "${values[0]}" para ${servidor} — ignorada`);
            erros++;
            continue;
        }

        try {
            await prisma.diaria.create({
                data: {
                    servidor,
                    cargo,
                    motivo,
                    destino,
                    dataInicio,
                    dataFim,
                    valorUnitario,
                    quantidadeDias,
                    valor,
                    secretaria,
                    mes,
                    ano,
                }
            });
            importados++;
            secretariaStats[secretaria] = (secretariaStats[secretaria] || 0) + 1;
        } catch (e) {
            console.error(`❌ Erro na linha ${i + 1} (${servidor}): ${e.message}`);
            erros++;
        }
    }

    console.log('\n═══════════════════════════════════════════');
    console.log(`✅ IMPORTAÇÃO CONCLUÍDA`);
    console.log(`   • Registros importados : ${importados}`);
    console.log(`   • Erros                : ${erros}`);
    console.log('\n📊 Por Secretaria:');
    Object.entries(secretariaStats)
        .sort((a, b) => b[1] - a[1])
        .forEach(([sec, qty]) => console.log(`   ${sec.padEnd(35)} → ${qty} diárias`));
    console.log('═══════════════════════════════════════════');
}

main().finally(() => prisma.$disconnect());
