/**
 * Serviço de Integração com o PNCP (Portal Nacional de Contratações Públicas)
 * Lajes Pintadas | Código IBGE: 2406306
 */

const BASE_URL = "https://pncp.gov.br/api/consulta/v1";
const IBGE_LAJES = "2406306";

export interface PNCPContratacao {
    numeroControlePNCP: string;
    objetoContratacao: string;
    valorTotalEstimado: number;
    unidadeOrgao?: {
        nomeUnidade?: string;
    };
    identificacaoUnidade?: string;
    modalidadeNome: string;
    dataPublicacaoPncp: string;
    situacaoNome: string;
    numeroSequencial: number;
    anoContratacao: number;
}

export async function getLicitacoesPNCP(pagina: number = 1, tamanhoPagina: number = 10) {
    // Calculando datas para 2024 e 2025
    const dataInicial = "20240101";
    const dataFinal = "20251231";
    
    const url = `${BASE_URL}/contratacoes/publicacao?dataInicial=${dataInicial}&dataFinal=${dataFinal}&codigoMunicipioIbge=${IBGE_LAJES}&pagina=${pagina}&tamanhoPagina=${tamanhoPagina}`;
    
    try {
        const response = await fetch(url, {
            next: { revalidate: 3600 } // Cache de 1 hora
        });
        
        if (!response.ok) {
            throw new Error(`Erro PNCP: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data; // Contém { data: [...], totalPaginas, etc }
    } catch (error) {
        console.error("Falha ao buscar no PNCP:", error);
        return { data: [], totalPaginas: 0, totalRegistros: 0 };
    }
}

export async function getContratoPNCP(numeroControle: string) {
    const url = `${BASE_URL}/contratacoes/${numeroControle}`;
    
    try {
        const response = await fetch(url, {
            next: { revalidate: 3600 }
        });
        
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        return null;
    }
}
