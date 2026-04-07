import { getRREOSiconfi } from "../src/lib/siconfi-service";

async function main() {
    console.log("Teste de Conexão com Siconfi...");
    
    const startTime = Date.now();
    try {
        const dados = await getRREOSiconfi({
            an_exercicio: 2024,
            periodo: 1,
            nr_anexo: "01"
        });
        
        console.log(`✅ Sucesso! Recebidos ${dados.length} registros em ${Date.now() - startTime}ms.`);
        if (dados.length > 0) {
            console.log("Exemplo de registro:", JSON.stringify(dados[0], null, 2));
        } else {
            console.log("Nenhum dado retornado da API do Siconfi. Isso pode não ser um erro, apenas o Tesouro pode não ter dados processados para esses parâmetros no momento.");
        }
    } catch (e) {
        console.error("❌ Erro:", e);
    }
}

main();
