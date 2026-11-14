export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";
import { buildMedicamentoData } from "@/lib/assistencia-farmaceutica";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    const auth = await requireServerAuth(["admin", "controladoria", "editor", "integracao"]);
    if (!auth.authorized) return auth.response;

    try {
        const item = await prisma.medicamento.findUnique({ where: { id: params.id } });
        if (!item) return NextResponse.json({ error: "Medicamento não encontrado" }, { status: 404 });
        return jsonNoStore(item);
    } catch {
        return NextResponse.json({ error: "Erro ao buscar medicamento" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const auth = await requireServerAuth(["admin", "controladoria", "editor"]);
    if (!auth.authorized) return auth.response;

    try {
        const anterior = await prisma.medicamento.findUnique({ where: { id: params.id } });
        if (!anterior) {
            return NextResponse.json({ error: "Medicamento não encontrado" }, { status: 404 });
        }

        const body = await req.json();
        if (body.nome !== undefined && !String(body.nome).trim()) {
            return NextResponse.json({ error: "O nome do medicamento não pode ficar em branco." }, { status: 400 });
        }
        if (body.categoria !== undefined && !String(body.categoria).trim()) {
            return NextResponse.json({ error: "A categoria do medicamento não pode ficar em branco." }, { status: 400 });
        }

        const data = buildMedicamentoData(body, false) as Parameters<typeof prisma.medicamento.update>[0]["data"];
        const item = await prisma.medicamento.update({
            where: { id: params.id },
            data,
        });

        await registrarHistoricoAlteracao({
            entidade: "Medicamento",
            entidadeId: item.id,
            acao: "edicao",
            resumoAlteracao: `Atualização do medicamento: ${item.nome} (${item.status})`,
            dadosAnteriores: anterior,
            dadosNovos: item,
            secretaria: "Secretaria Municipal de Saúde",
            user: auth.user,
        });

        revalidatePaths(REVALIDATE_GROUPS.medicamentos);
        return jsonNoStore(item);
    } catch (error) {
        console.error("Erro ao atualizar medicamento:", error);
        return NextResponse.json({ error: "Erro ao atualizar medicamento" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const auth = await requireServerAuth(["admin", "controladoria", "editor"]);
    if (!auth.authorized) return auth.response;

    try {
        const anterior = await prisma.medicamento.findUnique({ where: { id: params.id } });
        if (!anterior) {
            return NextResponse.json({ error: "Medicamento não encontrado" }, { status: 404 });
        }

        await prisma.medicamento.delete({ where: { id: params.id } });

        await registrarHistoricoAlteracao({
            entidade: "Medicamento",
            entidadeId: params.id,
            acao: "exclusao",
            resumoAlteracao: `Exclusão do medicamento: ${anterior.nome}`,
            dadosAnteriores: anterior,
            secretaria: "Secretaria Municipal de Saúde",
            user: auth.user,
        });

        revalidatePaths(REVALIDATE_GROUPS.medicamentos);
        return jsonNoStore({ success: true });
    } catch (error) {
        console.error("Erro ao excluir medicamento:", error);
        return NextResponse.json({ error: "Erro ao excluir medicamento" }, { status: 500 });
    }
}
