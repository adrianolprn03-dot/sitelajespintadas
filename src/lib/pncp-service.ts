/**
 * Serviço de Integração com o PNCP (Portal Nacional de Contratações Públicas)
 * Município de Lajes Pintadas | CNPJ: 08159394000137 | Cód. IBGE: 2406809
 *
 * API Base: https://pncp.gov.br/api/consulta/v1
 * Documentação: https://pncp.gov.br/api/pncp/swagger-ui/index.html
 *
 * Modalidades:
 *  1 = Leilão Eletrônico
 *  2 = Diálogo Competitivo
 *  3 = Concurso
 *  4 = Concorrência - Eletrônica
 *  5 = Concorrência - Presencial
 *  6 = Pregão - Eletrônico
 *  7 = Pregão - Presencial
 *  8 = Dispensa de Licitação
 *  9 = Inexigibilidade
 * 10 = Manifestação de Interesse
 * 11 = Pré-qualificação
 * 12 = Credenciamento
 */

const BASE_URL = "https://pncp.gov.br/api/consulta/v1";
const CNPJ_LAJES = "08159394000137";

// ──────────────────────────────────────────
// Tipos
// ──────────────────────────────────────────

export interface OrgaoEntidade {
    cnpj: string;
    razaoSocial: string;
    poderId: string;
    esferaId: string;
}

export interface UnidadeOrgao {
    ufNome: string;
    codigoUnidade: string;
    ufSigla: string;
    municipioNome: string;
    nomeUnidade: string;
    codigoIbge: string;
}

export interface AmparoLegal {
    codigo: number;
    nome: string;
    descricao: string;
}

export interface PNCPContratacao {
    numeroControlePNCP: string;
    anoCompra: number;
    sequencialCompra: number;
    numeroCompra: string;
    processo: string;
    objetoCompra: string;
    modalidadeId: number;
    modalidadeNome: string;
    modoDisputaId: number;
    modoDisputaNome: string;
    valorTotalEstimado: number;
    valorTotalHomologado: number;
    situacaoCompraId: number;
    situacaoCompraNome: string;
    dataPublicacaoPncp: string;
    dataAberturaProposta: string | null;
    dataEncerramentoProposta: string | null;
    dataInclusao: string;
    dataAtualizacao: string;
    linkSistemaOrigem: string;
    linkProcessoEletronico: string | null;
    srp: boolean;
    existeResultado?: boolean;
    orgaoEntidade: OrgaoEntidade;
    unidadeOrgao: UnidadeOrgao;
    amparoLegal?: AmparoLegal;
    tipoInstrumentoConvocatorioNome?: string;
    informacaoComplementar?: string;
}

export interface PNCPResponsePage {
    data: PNCPContratacao[];
    totalRegistros: number;
    totalPaginas: number;
    numeroPagina: number;
    paginasRestantes: number;
    empty: boolean;
}

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────

function formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}${m}${d}`;
}

async function fetchPNCP<T>(url: string): Promise<T | null> {
    try {
        const response = await fetch(url, {
            next: { revalidate: 3600 }, // Cache de 1 hora
            headers: { Accept: "application/json" },
        });

        if (!response.ok) {
            console.warn(`[PNCP] Erro ${response.status} em: ${url}`);
            return null;
        }

        return await response.json() as T;
    } catch (error) {
        console.error("[PNCP] Falha ao buscar dados:", error);
        return null;
    }
}

// ──────────────────────────────────────────
// Funções Públicas
// ──────────────────────────────────────────

/**
 * Busca contratações por modalidade.
 * Modalidade 6 = Pregão Eletrônico (mais comum).
 * Use null para buscar todas as modalidades em chamadas paralelas.
 */
export async function getLicitacoesPNCP(
    pagina: number = 1,
    tamanhoPagina: number = 10,
    modalidade: number = 6,
    anoInicial?: number,
    anoFinal?: number
): Promise<PNCPResponsePage> {
    const now = new Date();
    const yearStart = anoInicial ?? now.getFullYear() - 1;
    const yearEnd = anoFinal ?? now.getFullYear();

    const dataInicial = formatDate(new Date(yearStart, 0, 1));
    const dataFinal = formatDate(new Date(yearEnd, 11, 31));

    const tam = Math.max(tamanhoPagina, 10); // API exige mínimo 10

    const url = `${BASE_URL}/contratacoes/publicacao?dataInicial=${dataInicial}&dataFinal=${dataFinal}&codigoModalidadeContratacao=${modalidade}&cnpj=${CNPJ_LAJES}&pagina=${pagina}&tamanhoPagina=${tam}`;

    const data = await fetchPNCP<PNCPResponsePage>(url);
    return data ?? { data: [], totalRegistros: 0, totalPaginas: 0, numeroPagina: 1, paginasRestantes: 0, empty: true };
}

/**
 * Busca contratações de MÚLTIPLAS modalidades em paralelo e combina os resultados.
 * Ideal para a página de licitações que mostra pregões, dispensas e inexigibilidades.
 */
export async function getLicitacoesTodasModalidades(
    pagina: number = 1,
    tamanhoPagina: number = 10,
    anoInicial?: number,
    anoFinal?: number
): Promise<PNCPResponsePage> {
    // Modalidades mais comuns: Pregão Eletrônico (6), Dispensa (8), Inexigibilidade (9)
    const modalidades = [6, 8, 9];

    const resultados = await Promise.all(
        modalidades.map(m => getLicitacoesPNCP(pagina, tamanhoPagina, m, anoInicial, anoFinal))
    );

    const todasContratacoes = resultados.flatMap(r => r.data);

    // Ordena por data de publicação (mais recente primeiro)
    todasContratacoes.sort((a, b) =>
        new Date(b.dataPublicacaoPncp).getTime() - new Date(a.dataPublicacaoPncp).getTime()
    );

    const totalRegistros = resultados.reduce((sum, r) => sum + r.totalRegistros, 0);
    const totalPaginas = Math.max(...resultados.map(r => r.totalPaginas));

    return {
        data: todasContratacoes,
        totalRegistros,
        totalPaginas,
        numeroPagina: pagina,
        paginasRestantes: totalPaginas - pagina,
        empty: todasContratacoes.length === 0,
    };
}

/**
 * Busca os detalhes de uma compra específica pelo seu número de controle PNCP.
 * Formato: {cnpj}-{unidade}-{sequencial}/{ano}
 * Ex: "08159394000137-1-000002/2024" -> ano=2024, sequencial=2
 */
export async function getContratacaoPNCP(
    anoCompra: number,
    sequencialCompra: number
): Promise<PNCPContratacao | null> {
    const url = `${BASE_URL}/orgaos/${CNPJ_LAJES}/compras/${anoCompra}/${sequencialCompra}`;
    return fetchPNCP<PNCPContratacao>(url);
}

/**
 * Retorna as licitações mais recentes para uso na home ou módulo de licitações.
 * Busca Pregão Eletrônico (mais comum) do ano corrente e anterior.
 */
export async function getUltimasLicitacoesPNCP(quantidade: number = 5): Promise<PNCPContratacao[]> {
    const result = await getLicitacoesPNCP(1, Math.max(quantidade, 10));
    return (result.data ?? []).slice(0, quantidade);
}

/**
 * Busca informações do órgão/prefeitura cadastrado no PNCP.
 */
export async function getOrgaoPNCP() {
    const url = `https://pncp.gov.br/api/pncp/v1/orgaos/${CNPJ_LAJES}`;
    return fetchPNCP<{
        cnpj: string;
        razaoSocial: string;
        statusAtivo: boolean;
        poderId: string;
        esferaId: string;
        dataValidacao: string;
    }>(url);
}
