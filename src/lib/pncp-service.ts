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
    anoCompra?: number;
    numeroCompra?: string;
}

export interface PNCPResponsePage {
    data: PNCPContratacao[];
    totalPaginas: number;
    totalRegistros: number;
    paginaAtual?: number;
}

function formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}${m}${d}`;
}

/**
 * Busca contratações publicadas no PNCP para Lajes Pintadas.
 * Por padrão retorna do início do ano corrente até hoje.
 */
export async function getLicitacoesPNCP(
    pagina: number = 1,
    tamanhoPagina: number = 10,
    anoInicial?: number,
    anoFinal?: number
): Promise<PNCPResponsePage> {
    const now = new Date();
    const yearStart = anoInicial ?? now.getFullYear() - 1; // inicia no ano anterior para mostrar histórico
    const yearEnd = anoFinal ?? now.getFullYear();

    const dataInicial = formatDate(new Date(yearStart, 0, 1));
    const dataFinal = formatDate(new Date(yearEnd, 11, 31));

    const url = `${BASE_URL}/contratacoes/publicacao?dataInicial=${dataInicial}&dataFinal=${dataFinal}&codigoMunicipioIbge=${IBGE_LAJES}&pagina=${pagina}&tamanhoPagina=${tamanhoPagina}`;

    try {
        const response = await fetch(url, {
            next: { revalidate: 3600 }, // Cache de 1 hora
            headers: { Accept: "application/json" },
        });

        if (!response.ok) {
            console.warn(`[PNCP] Resposta não-ok (${response.status}): ${response.statusText}`);
            return { data: [], totalPaginas: 0, totalRegistros: 0 };
        }

        const data = await response.json();
        return data as PNCPResponsePage;
    } catch (error) {
        console.error("[PNCP] Falha ao buscar contratações:", error);
        return { data: [], totalPaginas: 0, totalRegistros: 0 };
    }
}

/**
 * Busca detalhes de uma contratação específica pelo número de controle PNCP.
 */
export async function getContratoPNCP(numeroControle: string): Promise<PNCPContratacao | null> {
    const url = `${BASE_URL}/contratacoes/${numeroControle}`;

    try {
        const response = await fetch(url, {
            next: { revalidate: 3600 },
            headers: { Accept: "application/json" },
        });

        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("[PNCP] Falha ao buscar contrato:", error);
        return null;
    }
}

/**
 * Retorna as licitações mais recentes para exibição na home/módulo de licitações.
 */
export async function getUltimasLicitacoesPNCP(quantidade: number = 5): Promise<PNCPContratacao[]> {
    const result = await getLicitacoesPNCP(1, quantidade);
    return result.data ?? [];
}
