export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const noticia = await prisma.noticia.findUnique({
            where: { id: params.id },
            include: { secretaria: true },
        });
        if (!noticia) return jsonNoStore({ error: "Não encontrada" }, { status: 404 });
        return jsonNoStore(noticia);
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();

        // Extrair apenas os campos que existem no schema do Prisma
        const { titulo, resumo, conteudo, imagem, publicada, secretariaId, destaque, tags } = body;

        const updateData: any = {};
        if (titulo !== undefined) updateData.titulo = titulo;
        if (resumo !== undefined) updateData.resumo = resumo;
        if (conteudo !== undefined) updateData.conteudo = conteudo;
        if (imagem !== undefined) updateData.imagem = imagem;
        if (publicada !== undefined) updateData.publicada = Boolean(publicada);
        if (destaque !== undefined) updateData.destaque = Boolean(destaque);
        if (tags !== undefined) updateData.tags = typeof tags === "string" ? tags : JSON.stringify(tags || []);
        if (secretariaId !== undefined) updateData.secretariaId = secretariaId === "" ? null : secretariaId;

        if (publicada === true) {
            updateData.publicadoEm = new Date();
        }

        const noticia = await prisma.noticia.update({
            where: { id: params.id },
            data: updateData,
        });
        revalidatePaths(REVALIDATE_GROUPS.noticias);
        return jsonNoStore(noticia);
    } catch (error) {
        console.error("Erro ao atualizar notícia:", error);
        return jsonNoStore({ error: "Erro interno ao atualizar" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        // Busca o registro para obter a URL da imagem antes de deletar
        const noticia = await prisma.noticia.findUnique({ where: { id: params.id } });
        if (noticia?.imagem) {
            const { deleteFileFromR2 } = await import("@/lib/r2");
            await deleteFileFromR2(noticia.imagem);
        }
        await prisma.noticia.delete({
            where: { id: params.id },
        });
        revalidatePaths(REVALIDATE_GROUPS.noticias);
        return jsonNoStore({ success: true });
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}
