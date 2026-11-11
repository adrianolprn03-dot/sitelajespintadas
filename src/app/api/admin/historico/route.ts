export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const entidade = searchParams.get("entidade");
        const acao = searchParams.get("acao");
        const apenasConferencia = searchParams.get("apenasConferencia") === "true";

        const where: Record<string, unknown> = {};
        if (entidade && entidade !== "Todas") where.entidade = entidade;
        if (acao && acao !== "Todas") where.acao = acao;
        if (apenasConferencia) where.isConferenciaSemAlteracao = true;

        const rows = await prisma.historicoAlteracao.findMany({
            where,
            orderBy: { criadoEm: "desc" },
            take: 100,
        });

        const items = rows.map((r) => ({
            ...r,
            tituloRegistro: r.resumoAlteracao,
            conferenciaSemAlteracao: r.isConferenciaSemAlteracao,
            observacao: r.resumoAlteracao,
            usuarioCargo: r.usuarioPerfil,
        }));

        return NextResponse.json({ items });
    } catch {
        return NextResponse.json({ items: [] });
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireServerAuth(["admin", "controladoria", "editor", "integracao"]);
    if (!auth.authorized) return auth.response;

    try {
        const body = await req.json();
        const { entidade, entidadeId, tituloRegistro, criterioPntp, secretaria, observacao } = body;

        if (!entidade || !tituloRegistro) {
            return NextResponse.json(
                { error: "Módulo/entidade e identificação do registro são obrigatórios." },
                { status: 400 }
            );
        }

        const resumo = `${String(tituloRegistro)}${criterioPntp ? ` [Critério ${criterioPntp}]` : ""} — ${
            observacao || "Conferência setorial registrada sem alteração do conteúdo publicado (atualidade verificada)."
        }`;

        await registrarHistoricoAlteracao({
            entidade: String(entidade),
            entidadeId: String(entidadeId || "conferencia-setorial"),
            acao: "conferencia_sem_alteracao",
            resumoAlteracao: resumo,
            isConferenciaSemAlteracao: true,
            secretaria: secretaria ? String(secretaria) : undefined,
            dadosNovos: {
                tituloRegistro,
                criterioPntp: criterioPntp || null,
                situacaoNova: "publicado",
            },
            user: auth.user,
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("[API Historico POST]", error);
        return NextResponse.json({ error: "Erro ao registrar conferência" }, { status: 500 });
    }
}
