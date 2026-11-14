export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";
import {
    DADOS_PADRAO_UNIDADES_SAUDE,
    normalizeText,
    parseEquipe,
    parseEspecialidades,
} from "@/lib/unidades";

/**
 * POST /api/admin/unidades/seed
 * Restaura ou complementa serviços, especialidades e escalas de profissionais das unidades de saúde.
 * Se a unidade existir (correspondência pelo nome), preenche apenas campos vazios.
 * Se todas estiverem ausentes ou o modo forceCreate=true for informado, cria unidades modelo ausentes.
 */
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    try {
        const body = await req.json().catch(() => ({}));
        const forceOverwrite = Boolean(body?.forceOverwrite);
        const createMissing = Boolean(body?.createMissing);

        const existing = await prisma.unidadeAtendimento.findMany();
        let updated = 0;
        let created = 0;

        for (const tpl of DADOS_PADRAO_UNIDADES_SAUDE) {
            const match = existing.find((u) => {
                const n = normalizeText(u.nome);
                return tpl.matchTerms.some((term) => n.includes(term));
            });

            if (match) {
                const espAtuais = parseEspecialidades(match.especialidades);
                const equipeAtual = parseEquipe(match.equipe);
                const dataUpdate: Record<string, any> = {};

                if (forceOverwrite || !match.subtipo) dataUpdate.subtipo = tpl.subtipo;
                if (forceOverwrite || !match.servicos?.trim()) dataUpdate.servicos = tpl.servicos;
                if (forceOverwrite || espAtuais.length === 0) {
                    dataUpdate.especialidades = JSON.stringify(tpl.especialidades);
                }
                if (forceOverwrite || equipeAtual.length === 0) {
                    dataUpdate.equipe = JSON.stringify(tpl.equipe);
                }

                if (Object.keys(dataUpdate).length > 0) {
                    await prisma.unidadeAtendimento.update({
                        where: { id: match.id },
                        data: dataUpdate,
                    });
                    updated++;
                }
            } else if (createMissing || existing.length === 0) {
                await prisma.unidadeAtendimento.create({
                    data: {
                        nome: tpl.fallbackNome,
                        tipo: tpl.tipo,
                        subtipo: tpl.subtipo,
                        descricao: tpl.descricao,
                        endereco: tpl.endereco,
                        telefone: tpl.telefone,
                        horario: tpl.horario,
                        servicos: tpl.servicos,
                        especialidades: JSON.stringify(tpl.especialidades),
                        equipe: JSON.stringify(tpl.equipe),
                        ativa: true,
                    },
                });
                created++;
            }
        }

        revalidatePaths(REVALIDATE_GROUPS.unidades);
        return jsonNoStore({ ok: true, updated, created });
    } catch (error) {
        console.error("Erro ao restaurar unidades padrão:", error);
        return jsonNoStore({ error: "Erro ao restaurar dados de saúde" }, { status: 500 });
    }
}
