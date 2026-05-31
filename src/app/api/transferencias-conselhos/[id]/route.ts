export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.transferenciaConselho.findUnique({ where: { id: params.id } });
        if (!item) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
        return NextResponse.json(item);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao buscar transferência" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const item = await prisma.transferenciaConselho.update({
            where: { id: params.id },
            data: body,
        });
        return NextResponse.json(item);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao atualizar" }, { status: 400 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.transferenciaConselho.delete({ where: { id: params.id } });
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao excluir" }, { status: 400 });
    }
}
