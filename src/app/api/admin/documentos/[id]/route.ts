export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const { titulo, tipo, arquivo, ano } = body;

        const doc = await prisma.documento.update({
            where: { id: params.id },
            data: { titulo, tipo, arquivo, ano }
        });

        return NextResponse.json(doc);
    } catch {
        return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
    }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Busca o registro para obter a URL do arquivo antes de deletar
        const item = await prisma.documento.findUnique({ where: { id: params.id } });
        if (item?.arquivo) {
            const { deleteFileFromR2 } = await import("@/lib/r2");
            await deleteFileFromR2(item.arquivo);
        }
        await prisma.documento.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Erro ao deletar" }, { status: 500 });
    }
}
