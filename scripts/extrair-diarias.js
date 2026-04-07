const { PrismaClient } = require('@prisma/client');
const cheerio = require('cheerio');
const crypto = require('crypto');
const prisma = new PrismaClient();

const URL_DIARIAS = 'https://lajespintadas.rn.gov.br/diarias/';

function generateCuid() {
    return crypto.randomBytes(12).toString('hex');
}

async function extrairDiarias() {
    console.log('--- Iniciando extração de Diárias (Modo SQL Bruto) ---');
    try {
        const response = await fetch(URL_DIARIAS, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const html = await response.text();
        const $ = cheerio.load(html);
        
        const rows = $('table tbody tr');
        console.log(`Linhas encontradas na tabela: ${rows.length}`);

        const diarias = [];

        rows.each((i, el) => {
            const cols = $(el).find('td');
            if (cols.length < 9) return;

            const dataInicioStr = $(cols[0]).text().trim();
            const dataFimStr = $(cols[1]).text().trim();
            const cargo = $(cols[2]).text().trim();
            const servidor = $(cols[3]).text().trim();
            const motivo = $(cols[4]).text().trim();
            const destino = $(cols[5]).text().trim();
            const qtdStr = $(cols[6]).text().trim().replace(',', '.');
            const valorUnitStr = $(cols[7]).text().trim();
            const valorTotalStr = $(cols[8]).text().trim();

            if (!dataInicioStr || !servidor) return;

            // Parsing Dates
            const [d, m, a] = dataInicioStr.split('/');
            const dataInicio = new Date(`${a}-${m}-${d}T12:00:00Z`);
            
            const [df, mf, af] = dataFimStr.split('/');
            const dataFim = new Date(`${af}-${mf}-${df}T12:00:00Z`);

            // Cleaning values
            const parseMoeda = (str) => {
                if (!str) return 0;
                return parseFloat(str.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
            };

            const valorUnitario = parseMoeda(valorUnitStr);
            const valor = parseMoeda(valorTotalStr);
            
            // Tratamento de frações (1½)
            let quantidadeDias = parseFloat(qtdStr);
            if (qtdStr.includes('½')) {
                quantidadeDias = Math.floor(quantidadeDias || 0) + 0.5;
            }
            if (isNaN(quantidadeDias)) quantidadeDias = 1;

            // Classificação de Secretaria
            let secretaria = 'Gabinete';
            const textoBusca = (cargo + ' ' + motivo).toLowerCase();
            
            if (textoBusca.includes('saúde') || textoBusca.includes('ubs') || textoBusca.includes('médico') || textoBusca.includes('enferm')) {
                secretaria = 'Saúde';
            } else if (textoBusca.includes('educa') || textoBusca.includes('escola') || textoBusca.includes('professor') || textoBusca.includes('creche')) {
                secretaria = 'Educação';
            } else if (textoBusca.includes('assistência') || textoBusca.includes('bolsa família') || textoBusca.includes('habitação') || textoBusca.includes('cras') || textoBusca.includes('social')) {
                secretaria = 'Assistência Social';
            } else if (textoBusca.includes('obras') || textoBusca.includes('infraestrutura') || textoBusca.includes('limpeza')) {
                secretaria = 'Obras';
            } else if (textoBusca.includes('turismo') || textoBusca.includes('esporte') || textoBusca.includes('lazer')) {
                secretaria = 'Turismo e Esporte';
            } else if (textoBusca.includes('agricultura') || textoBusca.includes('rural')) {
                secretaria = 'Agricultura';
            }

            diarias.push({
                servidor,
                cargo,
                destino,
                motivo,
                dataInicio,
                dataFim,
                valor,
                valorUnitario,
                quantidadeDias,
                secretaria,
                mes: parseInt(m),
                ano: parseInt(a)
            });
        });

        console.log(`Processados ${diarias.length} registros. Iniciando importação via SQL Direto para evitar bloqueios do Prisma Client...`);

        let count = 0;
        let errors = 0;
        for (const d of diarias) {
            try {
                // Validação de datas
                if (isNaN(d.dataInicio.getTime()) || isNaN(d.dataFim.getTime())) {
                    console.error(`Pulo: Data inválida para servidor ${d.servidor} (${d.dataInicio} - ${d.dataFim})`);
                    errors++;
                    continue;
                }

                const dataInicioISO = d.dataInicio.toISOString();
                const dataFimISO = d.dataFim.toISOString();

                // Verificação via SQL Bruto
                const results = await prisma.$queryRawUnsafe(`
                    SELECT id FROM "Diaria" 
                    WHERE servidor = $1 
                    AND "dataInicio" = $2::timestamp
                    AND valor = $3 
                    AND destino = $4
                    LIMIT 1
                `, d.servidor, dataInicioISO, d.valor, d.destino);

                if (results.length === 0) {
                    const id = generateCuid();
                    await prisma.$executeRawUnsafe(`
                        INSERT INTO "Diaria" ("id", "servidor", "cargo", "destino", "motivo", "dataInicio", "dataFim", "valor", "valorUnitario", "quantidadeDias", "secretaria", "mes", "ano")
                        VALUES ($1, $2, $3, $4, $5, $6::timestamp, $7::timestamp, $8, $9, $10, $11, $12, $13)
                    `, id, d.servidor, d.cargo, d.destino, d.motivo, dataInicioISO, dataFimISO, d.valor, d.valorUnitario, d.quantidadeDias, d.secretaria, d.mes, d.ano);
                    count++;
                }
            } catch (itemError) {
                console.error(`Erro ao processar registro de ${d.servidor}:`, itemError.message);
                errors++;
            }
        }

        console.log(`Importação concluída: ${count} novos registros inseridos. ${errors} erros encontrados.`);

        console.log(`Importação concluída: ${count} novos registros inseridos.`);

    } catch (error) {
        console.error('Erro durante extração:', error);
    } finally {
        await prisma.$disconnect();
    }
}

extrairDiarias();
