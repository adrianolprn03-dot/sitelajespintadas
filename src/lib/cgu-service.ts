/**
 * Serviço de Integração com o Portal da Transparência (CGU)
 * Lajes Pintadas | Código IBGE: 2406306
 */

const BASE_URL = "https://api.portaldatransparencia.gov.br/api-v1";
const IBGE_LAJES = "2406306";
const API_TOKEN = process.env.CGU_API_TOKEN || ""; // Requer Token da CGU

export interface CGUTransferencia {
    id: number;
    dataLancamento: string;
    valor: number;
    municipio: {
        nomeIBGE: string;
    };
    tipoTransferencia: string;
    acao: {
        codigo: string;
        nome: string;
    };
}

export async function getTransferenciasCGU(mesAno: string, pagina: number = 1) {
    if (!API_TOKEN) {
        console.warn("CGU_API_TOKEN não configurado. Utilizando dados de demonstração (Mock).");
        return getMockTransferencias();
    }

    // mesAno formato: MM/YYYY
    const [mes, ano] = mesAno.split("/");
    const url = `${BASE_URL}/transferencias/por-municipio?codigoIbge=${IBGE_LAJES}&mesReferencia=${mes}&anoReferencia=${ano}&pagina=${pagina}`;

    try {
        const response = await fetch(url, {
            headers: {
                "chave-api-publica": API_TOKEN
            },
            next: { revalidate: 86400 } // 24h cache
        });

        if (!response.ok) throw new Error(`Erro CGU: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Falha ao buscar na CGU:", error);
        return [];
    }
}

// Fallback para quando o token não estiver presente (ideal para demonstração inicial)
function getMockTransferencias() {
    return [
        {
            id: 1,
            dataLancamento: "2024-03-20",
            valor: 1250400.50,
            tipoTransferencia: "Transferência Obrigatória",
            acao: { nome: "FPM - Fundo de Participação dos Municípios" }
        },
        {
            id: 2,
            dataLancamento: "2024-03-15",
            valor: 450200.00,
            tipoTransferencia: "Transferência de Convênio",
            acao: { nome: "FUNDEB - Fundo de Manutenção da Educação" }
        }
    ];
}
