/**
 * Serviço de Integração com o SICONFI (Sistema de Informações Contábeis e Fiscais do Setor Público Brasileiro)
 * Tesouro Nacional — Lajes Pintadas | Código IBGE: 2406306
 * Documentação: https://apidatalake.tesouro.gov.br/docs/siconfi/
 */

const BASE_URL = "https://apidatalake.tesouro.gov.br/ords/siconfi/tt";
const IBGE_LAJES = "2406306";
const CACHE_FISCAL = 86400; // 24h para dados fiscais oficiais

export interface SiconfiItem {
    [key: string]: string | number | null;
}

export interface SiconfiRequest {
    an_exercicio: number;
    periodo: number;
    nr_anexo: string;
}

export interface SiconfiDCAAGFRequest {
    an_exercicio: number;
    nr_periodo: number;
}

// ──────────────────────────────────────────────
// RREO — Relatório Resumido da Execução Orçamentária
// ──────────────────────────────────────────────

export async function getRREOSiconfi({ an_exercicio, periodo, nr_anexo }: SiconfiRequest): Promise<SiconfiItem[]> {
    const url =
        `${BASE_URL}/rreo?an_exercicio=${an_exercicio}&id_ente=${IBGE_LAJES}&periodo=${periodo}&nr_anexo=${nr_anexo}`;

    try {
        const response = await fetch(url, {
            next: { revalidate: CACHE_FISCAL },
            headers: { Accept: "application/json" },
        });

        if (!response.ok) {
            console.warn(`[SICONFI/RREO] Falha ${response.status} – ${an_exercicio}/${periodo}/Anexo ${nr_anexo}`);
            return [];
        }

        const data = await response.json();
        return data?.items ?? [];
    } catch (error) {
        console.error("[SICONFI/RREO] Erro de conexão:", error);
        return [];
    }
}

// ──────────────────────────────────────────────
// RGF — Relatório de Gestão Fiscal
// ──────────────────────────────────────────────

export async function getRGFSiconfi({ an_exercicio, periodo, nr_anexo }: SiconfiRequest): Promise<SiconfiItem[]> {
    const url =
        `${BASE_URL}/rgf?an_exercicio=${an_exercicio}&id_ente=${IBGE_LAJES}&periodo=${periodo}&nr_anexo=${nr_anexo}`;

    try {
        const response = await fetch(url, {
            next: { revalidate: CACHE_FISCAL },
            headers: { Accept: "application/json" },
        });

        if (!response.ok) {
            console.warn(`[SICONFI/RGF] Falha ${response.status} – ${an_exercicio}/Q${periodo}/Anexo ${nr_anexo}`);
            return [];
        }

        const data = await response.json();
        return data?.items ?? [];
    } catch (error) {
        console.error("[SICONFI/RGF] Erro de conexão:", error);
        return [];
    }
}

// ──────────────────────────────────────────────
// DCA — Declaração das Contas Anuais
// ──────────────────────────────────────────────

export async function getDCASiconfi({ an_exercicio, nr_periodo }: SiconfiDCAAGFRequest): Promise<SiconfiItem[]> {
    const url =
        `${BASE_URL}/dca?an_exercicio=${an_exercicio}&id_ente=${IBGE_LAJES}&nr_periodo=${nr_periodo}`;

    try {
        const response = await fetch(url, {
            next: { revalidate: CACHE_FISCAL },
            headers: { Accept: "application/json" },
        });

        if (!response.ok) {
            console.warn(`[SICONFI/DCA] Falha ${response.status} – ${an_exercicio}`);
            return [];
        }

        const data = await response.json();
        return data?.items ?? [];
    } catch (error) {
        console.error("[SICONFI/DCA] Erro de conexão:", error);
        return [];
    }
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

/** Retorna os períodos disponíveis de RREO para um exercício (bimestres 1–6). */
export function getRREOPeriodos(): { valor: number; label: string }[] {
    return [
        { valor: 1, label: "1º Bimestre" },
        { valor: 2, label: "2º Bimestre" },
        { valor: 3, label: "3º Bimestre" },
        { valor: 4, label: "4º Bimestre" },
        { valor: 5, label: "5º Bimestre" },
        { valor: 6, label: "6º Bimestre (Anual)" },
    ];
}

/** Retorna os períodos disponíveis de RGF para um exercício (quadrimestres 1–3). */
export function getRGFPeriodos(): { valor: number; label: string }[] {
    return [
        { valor: 1, label: "1º Quadrimestre" },
        { valor: 2, label: "2º Quadrimestre" },
        { valor: 3, label: "3º Quadrimestre (Anual)" },
    ];
}

/** Retorna a lista de exercícios disponíveis (últimos 5 anos). */
export function getExerciciosDisponiveis(): number[] {
    const atual = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => atual - i);
}
