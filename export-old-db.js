const { Client } = require('pg');
const fs = require('fs');

// BANCO ATUAL (destino - onde os dados serão copiados)
const NEW_URL = "postgresql://neondb_owner:npg_um1cTryl2ZhE@ep-lingering-silence-apya2qyk-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require";

// BANCO ANTIGO (origem - de onde os dados serão lidos)
const OLD_URL = "postgresql://neondb_owner:npg_NztwAjG93rWe@ep-wandering-term-am49xyll-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Tabelas para migrar (com dados no banco antigo)
const TABELAS = [
    'Configuracao', 'Secretaria', 'Noticia', 'Evento', 'Agenda',
    'Obra', 'Licitacao', 'Contrato', 'Convenio', 'Diaria',
    'Servidor', 'Estagiario', 'Terceirizado', 'Receita', 'Despesa',
    'EmendaParlamentar', 'EmendaPix', 'Legislacao', 'Documento',
    'LinkExterno', 'FAQ', 'Glossario', 'Conselho', 'ConselhoAta',
    'UnidadeAtendimento', 'Veiculo', 'Medicamento', 'RelatorioFiscal',
    'RenunciaFiscal', 'Usuario', 'Ouvidoria', 'Esic', 'GaleriaFoto',
];

async function exportar() {
    const client = new Client({ connectionString: OLD_URL });
    await client.connect();
    
    const resultado = {};
    const tablesResult = await client.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
    );
    
    console.log('\n📤 EXPORTANDO DO BANCO ANTIGO...\n');
    
    for (const row of tablesResult.rows) {
        const tabela = row.table_name;
        const data = await client.query(`SELECT * FROM "${tabela}"`);
        resultado[tabela] = data.rows;
        const status = data.rows.length > 0 ? '✅' : '⬜';
        console.log(`${status} ${tabela}: ${data.rows.length} registro(s)`);
    }
    
    fs.writeFileSync('./backup-banco-antigo.json', JSON.stringify(resultado, null, 2));
    console.log('\n💾 Backup salvo em: backup-banco-antigo.json');
    
    await client.end();
    return resultado;
}

exportar().catch(e => { console.error('Erro:', e.message); process.exit(1); });
