export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.fAQ.findUnique({
            where: { id: params.id }
        });
        if (!item) return jsonNoStore({ error: "FAQ não encontrado" }, { status: 404 });
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro ao buscar FAQ" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const { pergunta, resposta, categoria, ordem } = body;

        const faq = await prisma.fAQ.update({
            where: { id: params.id },
            data: {
                pergunta,
                resposta,
                categoria,
                ordem: parseInt(ordem || "0", 10) || 0,
            },
        });
        revalidatePaths(REVALIDATE_GROUPS.institucional);
        return jsonNoStore(faq);
    } catch {
        return jsonNoStore({ error: "Erro ao atualizar FAQ" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        await prisma.fAQ.delete({ where: { id: params.id } });
        revalidatePaths(REVALIDATE_GROUPS.institucional);
        return jsonNoStore({ message: "FAQ excluído com sucesso" });
    } catch {
        return jsonNoStore({ error: "Erro ao excluir FAQ" }, { status: 500 });
    }
}
