export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonNoStore } from "@/lib/revalidate-site";
import {
    CONFIG_CHAVE_CRITERIOS_CRECHE,
    parseCriteriosCreche,
} from "@/lib/educacao";
import { normalizeUnidadeRecord } from "@/lib/unidades";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const anoParam = searchParams.get("ano");
        const q = searchParams.get("q")?.trim();

        const filaWhere: Record<string, any> = {};
        if (anoParam && anoParam !== "todos") {
            const parsedAno = parseInt(anoParam, 10);
            if (!Number.isNaN(parsedAno)) {
                filaWhere.ano = parsedAno;
            }
        }
        if (q) {
            filaWhere.OR = [
                { protocoloAnonimizado: { contains: q, mode: "insensitive" } },
                { iniciaisCrianca: { contains: q, mode: "insensitive" } },
                { unidadeEscolar: { contains: q, mode: "insensitive" } },
                { turmaEtapa: { contains: q, mode: "insensitive" } },
                { criterioPrioridade: { contains: q, mode: "insensitive" } },
            ];
        }

        const [declaracao, criteriosConfig, unidadesRaw, fila] = await Promise.all([
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
            prisma.unidadeAtendimento.findMany({
                where: {
                    ativa: true,
                    tipo: {
                        in: ["Educação", "educacao", "EDUCAÇÃO", "EDUCACAO", "Educacao", "educação"],
                    },
                },
                orderBy: { nome: "asc" },
            }),
            prisma.filaEsperaCreche.findMany({
                where: filaWhere,
                orderBy: [{ ano: "desc" }, { posicaoFila: "asc" }, { dataInscricao: "asc" }],
            }),
        ]);

        const criteriosPrioridade = parseCriteriosCreche(criteriosConfig?.valor);
        const unidades = unidadesRaw.map(normalizeUnidadeRecord);

        return jsonNoStore({
            sucesso: true,
            declaracao,
            criteriosPrioridade,
            unidades,
            fila,
        });
    } catch (error) {
        console.error("Erro ao consultar fila de creches:", error);
        return jsonNoStore(
            { sucesso: false, error: "Erro interno ao consultar dados da fila de creches." },
            { status: 500 }
        );
    }
}
