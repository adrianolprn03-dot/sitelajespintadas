const fs = require('fs');
const path = require('path');

const CNPJ_LAJES = "08159394000137";
const BASE_URL = "https://pncp.gov.br/api/consulta/v1";

const MODALIDADES = [
    { id: 1, nome: "Leilão" },
    { id: 4, nome: "Concorrência" },
    { id: 6, nome: "Pregão Eletrônico" },
    { id: 8, nome: "Dispensa" },
    { id: 9, nome: "Inexigibilidade" },
    { id: 10, nome: "Manifestação de Interesse" },
    { id: 12, nome: "Credenciamento" }
];

const ANOS = [2021, 2022, 2023, 2024, 2025, 2026];

async function fetchWithTimeout(url, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json' } });
        clearTimeout(id);
        return response;
    } catch (e) {
        clearTimeout(id);
        return null;
    }
}

async function fetchAll() {
    console.log(`🚀 Extraindo licitações PNCP (2021-2026)...`);
    let todas = [];

    for (const ano of ANOS) {
        const dIni = `${ano}0101`;
        const dFin = `${ano}1231`;

        for (const mod of MODALIDADES) {
            let pagina = 1;
            while (true) {
                const url = `${BASE_URL}/contratacoes/publicacao?dataInicial=${dIni}&dataFinal=${dFin}&codigoModalidadeContratacao=${mod.id}&cnpj=${CNPJ_LAJES}&pagina=${pagina}&tamanhoPagina=50`;
                const res = await fetchWithTimeout(url);
                
                if (!res || !res.ok) break;

                const text = await res.text();
                if (!text) break;

                try {
                    const data = JSON.parse(text);
                    if (data.data && data.data.length > 0) {
                        console.log(`  ✅ ${ano} | ${mod.nome} | +${data.data.length}`);
                        todas.push(...data.data);
                        if (pagina >= data.totalPaginas) break;
                        pagina++;
                    } else break;
                } catch { break; }
            }
        }
    }

    console.log(`📊 Total: ${todas.length}`);

    if (todas.length > 0) {
        const headers = ["PNCP", "Ano", "Seq", "Compra", "Modalidade", "Objeto", "Estimado", "Homologado", "Situacao", "Data"];
        const csv = [headers.join(","), ...todas.map(i => [
            i.numeroControlePNCP, i.anoCompra, i.sequencialCompra, `"${i.numeroCompra}"`, `"${i.modalidadeNome}"`, 
            `"${(i.objetoCompra || '').replace(/"/g, '""').substring(0, 500)}"`, 
            i.valorTotalEstimado || 0, i.valorTotalHomologado || 0, `"${i.situacaoCompraNome}"`, i.dataPublicacaoPncp
        ].join(","))].join("\n");

        fs.writeFileSync(path.join(process.cwd(), 'public', 'licitacoes_pncp_completo.csv'), csv);
        console.log(`💾 Salvo em: public/licitacoes_pncp_completo.csv`);
    }
}

fetchAll();
