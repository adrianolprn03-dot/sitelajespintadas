import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

const fontes = [
    { url: 'https://lajespintadas.rn.gov.br/decretos/', tipo: 'decreto' },
    { url: 'https://lajespintadas.rn.gov.br/leis-municipais/', tipo: 'lei' },
    { url: 'https://lajespintadas.rn.gov.br/portarias-municipais/', tipo: 'portaria' }
];

async function extrairTabela(url: string, tipo: string) {
    console.log(`\nIniciando extração de '${tipo.toUpperCase()}' a partir de: ${url}`);
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        
        const html = await res.text();
        const $ = cheerio.load(html);

        // O TablePress gera tabelas com a classe .tablepress
        const rows = $('table.tablepress tbody tr');
        let importados = 0;
        let ignorados = 0;

        console.log(`Encontradas ${rows.length} linhas na tabela.`);

        if (rows.length === 0) {
            console.log('⚠️ ALERTA: Nenhuma linha de tabela encontrada com a classe .tablepress.');
            return;
        }

        // Para evitar await dentro de map, usaremos um for...of
        for (const row of rows) {
            const cols = $(row).find('td');
            
            // Geralmente são 3 colunas: [Número/Ano, Ementa, PDF]
            if (cols.length >= 2) {
                // A primeira coluna costuma ser 04/2026 ou apenas 04
                const numAno = $(cols[0]).text().trim(); 
                let ementa = $(cols[1]).text().trim();
                
                // Em algumas tabelas (ex: 3 colunas), a 3ª é o link, mas o link também pode estar na 2ª.
                let arquivo = $(row).find('a').attr('href') || null;

                if (!numAno) {
                    ignorados++;
                    continue;
                }

                // Parse do Número e Ano (ex: "04/2026" ou "04 / 2026")
                const partes = numAno.replace(/\s/g, '').split('/');
                const numero = partes[0] || 'S/N';
                // Pega o ano da segunda parte, se não houver, extrai da ementa com regex ou assume o atual
                let ano = parseInt(partes[1]);
                
                if (isNaN(ano)) {
                    const matchAnoExplicito = numAno.match(/(19|20)\d{2}/);
                    if (matchAnoExplicito) {
                        ano = parseInt(matchAnoExplicito[0]);
                    } else {
                        ano = new Date().getFullYear();
                    }
                }

                if (numero && ementa.length > 5) { // Validação mínima para não importar lixo
                    // Evitar duplicatas exatas no Prisma (idempotência)
                    const existe = await prisma.legislacao.findFirst({
                        where: { tipo, numero, ano }
                    });

                    if (!existe) {
                        await prisma.legislacao.create({
                            data: {
                                tipo,
                                numero,
                                ano,
                                ementa,
                                arquivo,
                                ativo: true,
                            }
                        });
                        importados++;
                    } else {
                        ignorados++;
                    }
                } else {
                    ignorados++;
                }
            } else {
                ignorados++;
            }
        }
        
        console.log(`✅ Sucesso! ${importados} novos documentos do tipo '${tipo}' importados para o banco de dados.`);
        if (ignorados > 0) console.log(`   (Ignorados/Duplicados: ${ignorados})`);
        
    } catch (e: any) {
        console.error(`❌ Erro ao processar ${url}: ${e.message}`);
    }
}

async function main() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Ignorar erros SSL do site antigo
    
    for (const f of fontes) {
        await extrairTabela(f.url, f.tipo);
    }
    
    console.log('\n======================================================');
    console.log('🏁 Migração de legislação via Web Scraping finalizada!');
    console.log('======================================================');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
