export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.glossario.findUnique({
            where: { id: params.id }
        });
        if (!item) return jsonNoStore({ error: "Termo não encontrado" }, { status: 404 });
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro ao buscar termo" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const { termo, definicao } = body;

        const glossario = await prisma.glossario.update({
            where: { id: params.id },
            data: {
                termo,
                definicao,
            },
        });
        revalidatePaths(REVALIDATE_GROUPS.institucional);
        return jsonNoStore(glossario);
    } catch {
        return jsonNoStore({ error: "Erro ao atualizar glossário" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        await prisma.glossario.delete({ where: { id: params.id } });
        revalidatePaths(REVALIDATE_GROUPS.institucional);
        return jsonNoStore({ message: "Termo excluído com sucesso" });
    } catch {
        return jsonNoStore({ error: "Erro ao excluir termo" }, { status: 500 });
    }
}
