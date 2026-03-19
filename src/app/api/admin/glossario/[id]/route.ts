import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.glossario.findUnique({
            where: { id: params.id }
        });
        if (!item) return NextResponse.json({ error: "Termo não encontrado" }, { status: 404 });
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar termo" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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
        return NextResponse.json(glossario);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar glossário" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.glossario.delete({ where: { id: params.id } });
        return NextResponse.json({ message: "Termo excluído com sucesso" });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir termo" }, { status: 500 });
    }
}
