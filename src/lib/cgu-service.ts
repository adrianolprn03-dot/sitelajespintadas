import { MUNICIPIO } from "@/config/municipio";

const BASE_URL = "https://api.portaldatransparencia.gov.br/api-v1";
const API_TOKEN = process.env.CGU_API_TOKEN || ""; // Requer Token oficial da CGU

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

export interface CGUIntegrationResult {
    items: CGUTransferencia[];
    integrationAvailable: boolean;
    statusMessage?: string;
    codigoIbgeConsultado: string;
}

/**
 * Consulta transferências federais na API oficial do Portal da Transparência (CGU)
 * utilizando o código IBGE oficial de Lajes Pintadas/RN (2406601).
 * Nunca retorna dados fictícios (mock) em caso de ausência de credencial ou erro de rede.
 */
export async function getTransferenciasCGUWithStatus(
    mesAno: string,
    pagina: number = 1
): Promise<CGUIntegrationResult> {
    if (!API_TOKEN) {
        return {
            items: [],
            integrationAvailable: false,
            statusMessage:
                "Chave de API da CGU (CGU_API_TOKEN) pendente de configuração no servidor. Utilize a consulta direta ao Portal da Transparência Federal ou o Portal Contábil Municipal.",
            codigoIbgeConsultado: MUNICIPIO.ibge,
        };
    }

    const [mes, ano] = mesAno.split("/");
    const url = `${BASE_URL}/transferencias/por-municipio?codigoIbge=${MUNICIPIO.ibge}&mesReferencia=${mes}&anoReferencia=${ano}&pagina=${pagina}`;

    try {
        const response = await fetch(url, {
            headers: {
                "chave-api-publica": API_TOKEN,
            },
            next: { revalidate: 86400 },
        });

        if (!response.ok) {
            return {
                items: [],
                integrationAvailable: false,
                statusMessage: `Serviço externo da CGU indisponível no momento (HTTP ${response.status}).`,
                codigoIbgeConsultado: MUNICIPIO.ibge,
            };
        }

        const data = await response.json();
        return {
            items: Array.isArray(data) ? data : [],
            integrationAvailable: true,
            codigoIbgeConsultado: MUNICIPIO.ibge,
        };
    } catch (error) {
        console.error("Falha ao buscar na CGU:", error);
        return {
            items: [],
            integrationAvailable: false,
            statusMessage: "Falha de comunicação com a API do Portal da Transparência Federal (CGU).",
            codigoIbgeConsultado: MUNICIPIO.ibge,
        };
    }
}

export async function getTransferenciasCGU(mesAno: string, pagina: number = 1): Promise<CGUTransferencia[]> {
    const result = await getTransferenciasCGUWithStatus(mesAno, pagina);
    return result.items;
}
