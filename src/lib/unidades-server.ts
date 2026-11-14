import { prisma } from "@/lib/prisma";
import { CONFIG_CHAVE_CRITERIOS_CRECHE, CriterioPrioridadeCreche, parseCriteriosCreche } from "@/lib/educacao";
import { normalizeUnidadeRecord, UnidadeComDetalhes } from "@/lib/unidades";

const SAUDE_TIPOS = ["Saúde", "saude", "SAÚDE", "SAUDE", "saúde"];
const EDUCACAO_TIPOS = ["Educação", "educacao", "EDUCAÇÃO", "EDUCACAO", "Educacao", "educação"];

export async function getUnidadesSaudeAtivas(): Promise<UnidadeComDetalhes[]> {
    try {
        const rows = await prisma.unidadeAtendimento.findMany({
            where: {
                ativa: true,
                tipo: { in: SAUDE_TIPOS },
            },
            orderBy: { nome: "asc" },
        });
        return rows.map(normalizeUnidadeRecord);
    } catch {
        return [];
    }
}

export async function getUnidadesEducacaoAtivas(): Promise<UnidadeComDetalhes[]> {
    try {
        const rows = await prisma.unidadeAtendimento.findMany({
            where: {
                ativa: true,
                tipo: { in: EDUCACAO_TIPOS },
            },
            orderBy: { nome: "asc" },
        });
        return rows.map(normalizeUnidadeRecord);
    } catch {
        return [];
    }
}

export interface DadosEducacaoPublica {
    unidades: UnidadeComDetalhes[];
    declaracao: {
        exercicio: number;
        textoDeclaracao: string;
        fundamentoLegal: string;
        orgaoResponsavel: string;
        responsavelNome: string | null;
        dataAtualizacao: string;
        arquivoAssinadoUrl: string | null;
    } | null;
    criterios: CriterioPrioridadeCreche[];
    filaAguardando: number;
}

export async function getDadosEducacaoPublica(): Promise<DadosEducacaoPublica> {
    try {
        const [unidades, declaracao, criteriosCfg, filaAguardando] = await Promise.all([
            getUnidadesEducacaoAtivas(),
            prisma.declaracaoTransparencia.findFirst({
                where: {
                    ativa: true,
                    OR: [{ modulo: "fila_creches" }, { modulo: "creches" }],
                },
                orderBy: [{ exercicio: "desc" }, { dataConferencia: "desc" }, { dataEmissao: "desc" }],
            }),
            prisma.configuracao.findUnique({
                where: { chave: CONFIG_CHAVE_CRITERIOS_CRECHE },
            }),
            prisma.filaEsperaCreche.count({
                where: { status: "aguardando" },
            }),
        ]);

        return {
            unidades,
            declaracao: declaracao
                ? {
                      exercicio: declaracao.exercicio,
                      textoDeclaracao: declaracao.textoDeclaracao,
                      fundamentoLegal:
                          declaracao.fundamentoLegal ||
                          "Art. 208, IV da CF/88 e Cartilha PNTP 2026 (Item 19.2)",
                      orgaoResponsavel: declaracao.orgaoResponsavel,
                      responsavelNome: declaracao.responsavelNome,
                      dataAtualizacao: new Date(
                          declaracao.dataConferencia || declaracao.dataEmissao
                      ).toLocaleDateString("pt-BR"),
                      arquivoAssinadoUrl: declaracao.arquivoAssinadoUrl,
                  }
                : null,
            criterios: parseCriteriosCreche(criteriosCfg?.valor),
            filaAguardando,
        };
    } catch {
        return {
            unidades: [],
            declaracao: null,
            criterios: parseCriteriosCreche(null),
            filaAguardando: 0,
        };
    }
}
