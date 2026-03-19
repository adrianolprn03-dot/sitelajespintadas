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
    await prisma.legislacao.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
}
