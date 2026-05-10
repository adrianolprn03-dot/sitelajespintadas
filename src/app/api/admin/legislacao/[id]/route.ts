export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const item = await prisma.legislacao.findUnique({ where: { id: params.id } });
    if (!item) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json(item);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const body = await request.json();
    const { tipo, numero, ano, ementa, arquivo, ativo } = body;

    const item = await prisma.legislacao.update({
        where: { id: params.id },
        data: {
            tipo,
            numero,
            ano: parseInt(ano),
            ementa,
            arquivo: arquivo || null,
            ativo: ativo !== undefined ? Boolean(ativo) : undefined,
        },
    });

    return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Busca o registro para obter a URL do arquivo antes de deletar
        const item = await prisma.legislacao.findUnique({ where: { id: params.id } });
        if (item?.arquivo) {
            const { deleteFileFromR2 } = await import("@/lib/r2");
            await deleteFileFromR2(item.arquivo);
        }
        await prisma.legislacao.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao deletar legislação" }, { status: 500 });
    }
}
