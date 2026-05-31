// Tenta conectar ao banco ANTIGO pela URL DIRETA (sem pooler)
const { Client } = require('pg');

const OLD_DIRECT = "postgresql://neondb_owner:npg_NztwAjG93rWe@ep-wandering-term-am49xyll.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
    console.log('Tentando conectar ao banco antigo (URL direta)...');
    const client = new Client({ connectionString: OLD_DIRECT, connectionTimeoutMillis: 15000 });
    
    try {
        await client.connect();
        console.log('✅ CONECTADO!\n');
        
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);

        let total = 0;
        for (const row of tablesResult.rows) {
            const countResult = await client.query(`SELECT COUNT(*) as total FROM "${row.table_name}"`);
            const count = Number(countResult.rows[0].total);
            total += count;
            if (count > 0) console.log(`✅ ${row.table_name}: ${count} registro(s)`);
        }
        console.log(`\n📊 TOTAL: ${total} registros recuperáveis`);
        await client.end();
        
    } catch (err) {
        console.log('❌ Erro:', err.message);
        await client.end().catch(() => {});
    }
}

main();
