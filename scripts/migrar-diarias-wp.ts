import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

const SOURCE_URL = 'https://lajespintadas.rn.gov.br/diarias/';

async function parseDate(dateStr: string): Promise<Date> {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        // DD/MM/YYYY
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00Z`);
    }
    return new Date();
}

function parseCurrency(valStr: string): number {
    return parseFloat(valStr.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
}

async function runMigration() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.log(`\n🚀 Iniciando migração de DIÁRIAS a partir de: ${SOURCE_URL}`);

    try {
        const res = await fetch(SOURCE_URL);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        
        const html = await res.text();
        const $ = cheerio.load(html);

        const rows = $('table.tablepress tbody tr');
        console.log(`📊 Encontradas ${rows.length} linhas na página principal.`);

        let importados = 0;
        let ignorados = 0;

        for (const row of rows) {
            const cols = $(row).find('td');
            
            // Colunas identificadas:
            // 0: Data Início, 1: Data Fim, 2: Cargo, 3: Nome, 4: Motivo, 5: Destino, 6: Nº Diárias, 7: Valor Unitário, 8: Valor Total
            if (cols.length >= 8) {
                const dataInicioStr = $(cols[0]).text().trim();
                const dataFimStr = $(cols[1]).text().trim();
                const cargo = $(cols[2]).text().trim();
                const servidor = $(cols[3]).text().trim();
                const motivo = $(cols[4]).text().trim();
                const destino = $(cols[5]).text().trim();
                const qtdDiasStr = $(cols[6]).text().trim();
                const valorTotalStr = $(cols[8]).text().trim() || $(cols[7]).text().trim(); // Tenta o total, se não, unitário

                if (!servidor || !dataInicioStr) {
                    ignorados++;
                    continue;
                }

                const dataInicio = await parseDate(dataInicioStr);
                const dataFim = await parseDate(dataFimStr);
                const valor = parseCurrency(valorTotalStr);
                const quantidadeDias = parseInt(qtdDiasStr) || 1;
                
                const mes = dataInicio.getMonth() + 1;
                const ano = dataInicio.getFullYear();

                // Evitar duplicatas (simplificado por servidor, data e valor)
                const existe = await prisma.diaria.findFirst({
                    where: {
                        servidor,
                        dataInicio,
                        valor
                    }
                });

                if (!existe) {
                    await prisma.diaria.create({
                        data: {
                            servidor,
                            cargo,
                            destino,
                            motivo,
                            dataInicio,
                            dataFim,
                            valor,
                            quantidadeDias,
                            secretaria: 'Geral',
                            mes,
                            ano
                        }
                    });
                    importados++;
                } else {
                    ignorados++;
                }
            } else {
                ignorados++;
            }
        }

        console.log(`\n✅ Migração concluída!`);
        console.log(`📈 Importados: ${importados}`);
        console.log(`🔁 Ignorados/Duplicados: ${ignorados}`);

    } catch (error: any) {
        console.error(`❌ Erro durante a migração: ${error.message}`);
    }
}

runMigration()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
