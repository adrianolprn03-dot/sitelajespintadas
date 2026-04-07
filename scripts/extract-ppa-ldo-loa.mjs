/**
 * Script para extrair documentos PPA, LDO e LOA do portal TopSolutions
 * de Lajes Pintadas/RN e gerar um seed para o banco de dados local.
 */
import https from 'https';
import fs from 'fs';

const BASE_API = 'https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br';
const BASE_FILES = 'https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('🔍 Buscando documentos na API TopSolutions...\n');

  // Endpoint de Atos Normativos (pode conter PPA, LDO, LOA)
  const endpoints = [
    '/atonormativo/atonormativoasync',
    '/arquivo/listarporarquivoasync?arquivo=PPA',
    '/arquivo/listarporarquivoasync?arquivo=LDO',
    '/arquivo/listarporarquivoasync?arquivo=LOA',
    '/arquivo/listarporarquivoasync?arquivo=Planejamento',
    '/arquivo/listarporarquivoasync?arquivo=Orcamento',
  ];

  const results = {};
  
  for (const ep of endpoints) {
    const url = BASE_API + ep;
    console.log(`📡 GET ${url}`);
    try {
      const data = await get(url);
      results[ep] = data;
      if (data && Array.isArray(data) && data.length > 0) {
        console.log(`  ✅ ${data.length} itens encontrados`);
        console.log(JSON.stringify(data.slice(0, 3), null, 2));
      } else if (data && typeof data === 'object') {
        console.log(`  📦 Resposta:`, JSON.stringify(data).substring(0, 200));
      } else {
        console.log(`  ⚠️ Sem dados ou formato inesperado`);
      }
    } catch (e) {
      console.log(`  ❌ Erro: ${e.message}`);
      results[ep] = null;
    }
    console.log();
  }

  // Filtrar por PPA, LDO, LOA nos atos normativos
  const atos = results['/atonormativo/atonormativoasync'];
  const keywords = ['PPA', 'LDO', 'LOA', 'Plurianual', 'Diretriz', 'Orçamentária', 'Orçamentaria', 'Orcamentaria'];

  if (Array.isArray(atos)) {
    const filtered = atos.filter(a => {
      const str = JSON.stringify(a).toLowerCase();
      return keywords.some(k => str.includes(k.toLowerCase()));
    });
    
    if (filtered.length > 0) {
      console.log('\n🎯 DOCUMENTOS PPA/LDO/LOA ENCONTRADOS EM ATOS NORMATIVOS:');
      console.log(JSON.stringify(filtered, null, 2));
    } else {
      console.log('\n⚠️ Nenhum ato normativo com PPA/LDO/LOA encontrado.');
      console.log('Total de atos encontrados:', Array.isArray(atos) ? atos.length : 0);
      if (Array.isArray(atos) && atos.length > 0) {
        console.log('Exemplo de ato:', JSON.stringify(atos[0], null, 2));
        // Mostrar as chaves disponíveis
        console.log('Chaves do objeto:', Object.keys(atos[0]));
      }
    }
  }

  // Salvar resultado completo
  fs.writeFileSync('topsolutions_api_results.json', JSON.stringify(results, null, 2));
  console.log('\n💾 Resultados salvos em topsolutions_api_results.json');
}

main().catch(console.error);
