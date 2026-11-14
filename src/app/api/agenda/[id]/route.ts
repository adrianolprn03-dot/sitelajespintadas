export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const event = await prisma.evento.findUnique({
            where: { id: params.id },
        });
        if (!event) return jsonNoStore({ error: "Não encontrado" }, { status: 404 });
        return jsonNoStore(event);
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const data: any = {};
        if (body.titulo !== undefined) data.titulo = String(body.titulo).trim();
        if (body.descricao !== undefined) data.descricao = body.descricao || null;
        if (body.local !== undefined) data.local = body.local || null;
        if (body.dataInicio !== undefined) data.dataInicio = new Date(body.dataInicio);
        if (body.dataFim !== undefined) data.dataFim = body.dataFim ? new Date(body.dataFim) : null;
        if (body.publico !== undefined) data.publico = Boolean(body.publico);

        const event = await prisma.evento.update({
            where: { id: params.id },
            data,
        });
        revalidatePaths(REVALIDATE_GROUPS.agenda);
        return jsonNoStore(event);
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        await prisma.evento.delete({
            where: { id: params.id },
        });
        revalidatePaths(REVALIDATE_GROUPS.agenda);
        return jsonNoStore({ success: true });
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}
