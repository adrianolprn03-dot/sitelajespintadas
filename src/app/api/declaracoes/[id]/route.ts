export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth, type PerfilUsuario } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";
import { jsonNoStore, revalidatePaths } from "@/lib/revalidate-site";
import { obterModeloDeclaracao, resolverFiltroModuloDeclaracao } from "@/lib/declaracoes-catalogo";

const DECLARACAO_ALLOWED_ROLES: PerfilUsuario[] = [
    "admin",
    "controladoria",
    "editor",
    "integracao",
    "esic",
    "comunicacao",
];

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const auth = await requireServerAuth(DECLARACAO_ALLOWED_ROLES);
    if (!auth.authorized) return auth.response;

    try {
        const { id } = await context.params;
        const body = await req.json();

        const existing = await prisma.declaracaoTransparencia.findUnique({
            where: { id },
        });
        if (!existing) {
            return NextResponse.json({ error: "Declaração não encontrada." }, { status: 404 });
        }

        const nextModulo =
            body.modulo !== undefined ? String(body.modulo).trim() : existing.modulo;
        const nextCriterio =
            body.criterioPntp !== undefined
                ? String(body.criterioPntp || "").trim() || null
                : existing.criterioPntp;
        const nextExercicio =
            body.exercicio !== undefined
                ? parseInt(String(body.exercicio), 10) || existing.exercicio
                : existing.exercicio;
        const nextCompetencia =
            body.competencia !== undefined
                ? String(body.competencia || "").trim() || null
                : existing.competencia;
        const nextAtiva =
            body.ativa !== undefined ? Boolean(body.ativa) : existing.ativa;
        const nextTipoSituacao =
            body.tipoSituacao !== undefined
                ? body.tipoSituacao === "nao_aplicavel"
                    ? "nao_aplicavel"
                    : "nao_ocorrencia_declarada"
                : existing.tipoSituacao;

        if (nextAtiva && body.substituirAnteriores) {
            const { aliases } = resolverFiltroModuloDeclaracao(nextModulo, nextCriterio);
            await prisma.declaracaoTransparencia.updateMany({
                where: {
                    id: { not: id },
                    modulo: { in: aliases.length > 0 ? aliases : [nextModulo] },
                    exercicio: nextExercicio,
                    ativa: true,
                },
                data: { ativa: false },
            });
        }

        const updated = await prisma.declaracaoTransparencia.update({
            where: { id },
            data: {
                modulo: nextModulo,
                criterioPntp: nextCriterio,
                orgaoResponsavel:
                    body.orgaoResponsavel !== undefined
                        ? String(body.orgaoResponsavel).trim()
                        : existing.orgaoResponsavel,
                exercicio: nextExercicio,
                competencia: nextCompetencia,
                tipoSituacao: nextTipoSituacao,
                textoDeclaracao:
                    body.textoDeclaracao !== undefined
                        ? String(body.textoDeclaracao).trim()
                        : existing.textoDeclaracao,
                fundamentoLegal:
                    body.fundamentoLegal !== undefined
                        ? String(body.fundamentoLegal || "").trim() || null
                        : existing.fundamentoLegal,
                responsavelNome:
                    body.responsavelNome !== undefined
                        ? String(body.responsavelNome).trim()
                        : existing.responsavelNome,
                responsavelCargo:
                    body.responsavelCargo !== undefined
                        ? String(body.responsavelCargo || "").trim() || null
                        : existing.responsavelCargo,
                arquivoAssinadoUrl:
                    body.arquivoAssinadoUrl !== undefined
                        ? String(body.arquivoAssinadoUrl || "").trim() || null
                        : existing.arquivoAssinadoUrl,
                ativa: nextAtiva,
                dataConferencia: new Date(),
            },
        });

        if (updated.criterioPntp) {
            await prisma.criterioPNTP.updateMany({
                where: { codigo: updated.criterioPntp },
                data: {
                    statusConteudo: updated.ativa
                        ? updated.tipoSituacao || "nao_ocorrencia_declarada"
                        : "publicado",
                    dataUltimaVerificacao: new Date(),
                },
            });
        }

        await registrarHistoricoAlteracao({
            entidade: "DeclaracaoTransparencia",
            entidadeId: updated.id,
            acao: "edicao",
            resumoAlteracao: `Declaração ${updated.modulo} (${updated.exercicio}) atualizada — Status: ${updated.ativa ? "Ativa" : "Arquivada"}`,
            secretaria: updated.orgaoResponsavel,
            dadosAnteriores: existing,
            dadosNovos: updated,
            user: auth.user,
        });

        const modelo = obterModeloDeclaracao(updated.modulo);
        revalidatePaths([
            "/transparencia",
            "/admin",
            "/admin/pntp",
            "/admin/declaracoes",
            modelo.rotaPublica,
            modelo.rotaAdmin,
        ]);

        return jsonNoStore(updated);
    } catch (error) {
        console.error("[API Declaracoes PUT]", error);
        return NextResponse.json(
            { error: "Erro ao atualizar declaração." },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const auth = await requireServerAuth(DECLARACAO_ALLOWED_ROLES);
    if (!auth.authorized) return auth.response;

    try {
        const { id } = await context.params;
        const existing = await prisma.declaracaoTransparencia.findUnique({
            where: { id },
        });
        if (!existing) {
            return NextResponse.json({ error: "Declaração não encontrada." }, { status: 404 });
        }

        await prisma.declaracaoTransparencia.delete({ where: { id } });

        await registrarHistoricoAlteracao({
            entidade: "DeclaracaoTransparencia",
            entidadeId: id,
            acao: "exclusao",
            resumoAlteracao: `Declaração removida: ${existing.modulo} (${existing.exercicio})`,
            secretaria: existing.orgaoResponsavel,
            dadosAnteriores: existing,
            user: auth.user,
        });

        const modelo = obterModeloDeclaracao(existing.modulo);
        revalidatePaths([
            "/transparencia",
            "/admin",
            "/admin/pntp",
            "/admin/declaracoes",
            modelo.rotaPublica,
            modelo.rotaAdmin,
        ]);

        return jsonNoStore({ success: true });
    } catch (error) {
        console.error("[API Declaracoes DELETE]", error);
        return NextResponse.json(
            { error: "Erro ao remover declaração." },
            { status: 500 }
        );
    }
}
