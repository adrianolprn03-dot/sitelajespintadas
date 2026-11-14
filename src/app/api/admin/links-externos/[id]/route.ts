export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

const db = prisma as any;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const { id } = params;
        const body = await req.json();
        const data = await db.linkExterno.update({
            where: { id },
            data: {
                titulo: body.titulo,
                url: body.url,
                descricao: body.descricao,
                categoria: body.categoria,
                icone: body.icone,
                ativo: body.ativo,
                ordem: body.ordem,
                moduloAlvo: body.moduloAlvo,
            },
        });
        revalidatePaths([...REVALIDATE_GROUPS.institucional, "/admin/links-externos"]);
        return jsonNoStore(data);
    } catch (err) {
        console.error("Erro ao atualizar link:", err);
        return jsonNoStore({ error: "Erro ao atualizar link" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        await db.linkExterno.delete({ where: { id: params.id } });
        revalidatePaths([...REVALIDATE_GROUPS.institucional, "/admin/links-externos"]);
        return jsonNoStore({ ok: true });
    } catch (err) {
        console.error("Erro ao excluir link:", err);
        return jsonNoStore({ error: "Erro ao excluir link" }, { status: 500 });
    }
}
