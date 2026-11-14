export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function PUT(req: Request, context: { params: any }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Privado" }, { status: 401 });
    try {
        const params = await context.params;
        const body = await req.json();

        const updateData: any = {};
        if (body.titulo !== undefined) updateData.titulo = String(body.titulo).trim();
        if (body.tipo !== undefined) updateData.tipo = String(body.tipo);
        if (body.status !== undefined) updateData.status = String(body.status);
        if (body.vagas !== undefined) updateData.vagas = String(body.vagas);
        if (body.dataPublicacao) updateData.dataPublicacao = new Date(body.dataPublicacao);
        if (body.linkEdital !== undefined) updateData.linkEdital = body.linkEdital || null;
        if (body.fasesAtos !== undefined) {
            updateData.fasesAtos = typeof body.fasesAtos === "string" ? body.fasesAtos : JSON.stringify(body.fasesAtos || []);
        }
        if (body.ativo !== undefined) updateData.ativo = Boolean(body.ativo);
        if (body.descricao !== undefined) updateData.descricao = body.descricao || null;

        const item = await prisma.concurso.update({
            where: { id: params.id },
            data: updateData,
        });
        revalidatePaths(REVALIDATE_GROUPS.concursos);
        return jsonNoStore(item);
    } catch (error) {
        console.error("Erro ao atualizar:", error);
        return jsonNoStore({ error: "Erro ao atualizar" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, context: { params: any }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Privado" }, { status: 401 });
    try {
        const params = await context.params;
        await prisma.concurso.delete({ where: { id: params.id } });
        revalidatePaths(REVALIDATE_GROUPS.concursos);
        return jsonNoStore({ success: true });
    } catch (error) {
        console.error("Erro ao deletar concurso:", error);
        return jsonNoStore({ error: "Erro" }, { status: 500 });
    }
}
