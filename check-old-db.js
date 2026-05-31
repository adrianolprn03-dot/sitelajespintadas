const { Client } = require('pg');

const OLD_URL = "postgresql://neondb_owner:npg_NztwAjG93rWe@ep-wandering-term-am49xyll-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
    const client = new Client({ connectionString: OLD_URL });
    await client.connect();

    const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
    `);

    console.log('\n=== BANCO ANTIGO (lajespintadas.rn.gov.br) ===\n');
    let totalRegistros = 0;

    for (const row of tablesResult.rows) {
        const countResult = await client.query(`SELECT COUNT(*) as total FROM "${row.table_name}"`);
        const count = Number(countResult.rows[0].total);
        totalRegistros += count;
        const status = count > 0 ? '✅' : '⬜';
        console.log(`${status} ${row.table_name}: ${count} registro(s)`);
    }

    console.log(`\n📊 TOTAL DE REGISTROS: ${totalRegistros}`);
    console.log(`📋 TOTAL DE TABELAS: ${tablesResult.rows.length}`);

    await client.end();
}

main().catch(e => { console.error('Erro:', e.message); process.exit(1); });
