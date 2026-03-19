import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const noticia = await prisma.noticia.findUnique({
            where: { id: params.id },
            include: { secretaria: true },
        });
        if (!noticia) return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
        return NextResponse.json(noticia);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const noticia = await prisma.noticia.update({
            where: { id: params.id },
            data: body,
        });
        return NextResponse.json(noticia);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.noticia.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
