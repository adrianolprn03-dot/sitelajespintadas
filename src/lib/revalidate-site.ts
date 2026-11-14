import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const NO_STORE_HEADERS: Record<string, string> = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
};

export function jsonNoStore<T>(data: T, init?: ResponseInit) {
    return NextResponse.json(data, {
        ...init,
        headers: {
            ...NO_STORE_HEADERS,
            ...(init?.headers || {}),
        },
    });
}

export const REVALIDATE_GROUPS = {
    saudeDocumentos: [
        "/transparencia/plano-saude",
        "/transparencia/programacao-anual-saude",
        "/transparencia/relatorio-anual-gestao",
        "/transparencia",
        "/admin/saude",
    ],
    medicamentos: [
        "/transparencia/saude",
        "/transparencia/medicamentos-sus",
        "/transparencia",
        "/admin/saude",
        "/admin/medicamentos",
        "/admin/saude/medicamentos",
    ],
    unidades: [
        "/",
        "/unidades-de-saude",
        "/transparencia/unidades-saude",
        "/servicos/saude",
        "/unidades-escolares",
        "/servicos/educacao",
        "/socioassistencial",
        "/servicos/social",
        "/servicos/cultura",
        "/admin/unidades",
        "/admin",
    ],
    centralRegulacao: [
        "/transparencia/central-regulacao",
        "/transparencia",
        "/admin/central-regulacao",
        "/admin",
    ],
    noticias: ["/", "/noticias", "/admin", "/admin/noticias"],
    agenda: ["/", "/agenda", "/admin/agenda"],
    secretarias: ["/", "/secretarias", "/admin/secretarias"],
    documentos: [
        "/transparencia/publicacoes",
        "/transparencia/relatorios",
        "/transparencia/orcamento",
        "/transparencia/lrf",
        "/transparencia/prestacao-contas",
        "/transparencia/julgamento-contas",
        "/transparencia/parecer-tce",
        "/transparencia/relatorio-gestao",
        "/transparencia/plano-educacao",
        "/transparencia/plano-estrategico",
        "/transparencia/plano-contratacao",
        "/transparencia/pcg",
        "/transparencia/pcs",
        "/transparencia/rgf",
        "/transparencia/regulamentacao-diarias",
        "/transparencia/atas-registro",
        "/admin/documentos",
    ],
    legislacao: [
        "/transparencia/legislacao",
        "/transparencia/leis",
        "/transparencia/decretos",
        "/transparencia/portarias",
        "/transparencia/editais",
        "/admin/legislacao",
    ],
    concursos: [
        "/transparencia/concursos",
        "/transparencia/processo-seletivo",
        "/transparencia/editais",
        "/admin/concursos",
        "/admin/editais",
    ],
    licitacoes: [
        "/transparencia/licitacoes",
        "/transparencia/atas-registro",
        "/admin",
        "/admin/licitacoes",
    ],
    contratos: [
        "/transparencia/contratos",
        "/transparencia/ordem-cronologica",
        "/admin",
        "/admin/contratos",
    ],
    convenios: ["/transparencia/convenios", "/admin", "/admin/convenios"],
    obras: ["/transparencia/obras", "/admin", "/admin/obras"],
    despesas: [
        "/transparencia/despesas",
        "/transparencia/ordem-cronologica",
        "/admin",
        "/admin/despesas",
    ],
    receitas: ["/transparencia/receitas", "/admin/receitas"],
    diarias: [
        "/transparencia/diarias",
        "/transparencia/tabela-diarias",
        "/admin",
        "/admin/diarias",
    ],
    emendas: [
        "/transparencia/emendas",
        "/transparencia/emendas-pix",
        "/admin/emendas",
        "/admin/emendas-pix",
    ],
    pessoal: [
        "/transparencia/servidores",
        "/transparencia/servidores/quadro",
        "/transparencia/servidores/folha-pagamento",
        "/transparencia/servidores/estagiarios",
        "/transparencia/servidores/terceirizados",
        "/transparencia/estagiarios",
        "/transparencia/terceirizados",
        "/admin",
        "/admin/servidores",
        "/admin/servidores/quadro",
        "/admin/estagiarios",
        "/admin/terceirizados",
    ],
    educacao: [
        "/transparencia/educacao",
        "/transparencia/plano-educacao",
        "/transparencia/fila-creches",
        "/transparencia/creches",
        "/unidades-escolares",
        "/servicos/educacao",
        "/transparencia/conselhos",
        "/admin/educacao",
        "/admin/creches",
        "/admin/documentos",
    ],
    institucional: [
        "/",
        "/a-prefeitura/historia",
        "/transparencia",
        "/transparencia/educacao",
        "/transparencia/plano-educacao",
        "/transparencia/carta-servicos",
        "/transparencia/conselhos",
        "/transparencia/faq",
        "/transparencia/glossario",
        "/transparencia/frota",
        "/transparencia/incentivos-culturais",
        "/transparencia/creches",
        "/transparencia/fila-creches",
        "/unidades-escolares",
        "/servicos/educacao",
        "/transparencia/simbolos",
        "/municipio/simbolos",
        "/transparencia/passiva",
        "/transparencia/passiva/institucional",
        "/transparencia/passiva/relatorios/estatisticas",
        "/transparencia/passiva/relatorios/com-sigilo",
        "/transparencia/passiva/relatorios/sem-sigilo",
        "/servicos/esic",
        "/servicos/esic/relatorio-anual",
        "/admin",
    ],
} as const;

/**
 * Revalida múltiplas rotas públicas e administrativas sem lançar exceções caso
 * alguma rota específica ainda não exista no cache de build.
 */
export function revalidatePaths(paths: readonly string[]) {
    for (const p of paths) {
        try {
            revalidatePath(p);
        } catch {
            // Ignora falha pontual de revalidação em rotas dinâmicas ou scripts CLI
        }
    }
}
