export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths } from "@/lib/revalidate-site";

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const item = await prisma.galeriaFoto.findUnique({
            where: { id: params.id },
        });
        if (!item) return jsonNoStore({ error: "Não encontrado" }, { status: 404 });
        return jsonNoStore(item);
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
        if (body.arquivo !== undefined) data.arquivo = String(body.arquivo);
        if (body.album !== undefined) data.album = body.album || null;
        if (body.publicada !== undefined) data.publicada = Boolean(body.publicada);

        const item = await prisma.galeriaFoto.update({
            where: { id: params.id },
            data,
        });
        revalidatePaths(["/", "/galeria", "/admin/galeria"]);
        return jsonNoStore(item);
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
        // Busca o registro para obter a URL do arquivo antes de deletar
        const item = await prisma.galeriaFoto.findUnique({ where: { id: params.id } });
        if (item?.arquivo) {
            const { deleteFileFromR2 } = await import("@/lib/r2");
            await deleteFileFromR2(item.arquivo);
        }
        await prisma.galeriaFoto.delete({
            where: { id: params.id },
        });
        revalidatePaths(["/", "/galeria", "/admin/galeria"]);
        return jsonNoStore({ success: true });
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}
