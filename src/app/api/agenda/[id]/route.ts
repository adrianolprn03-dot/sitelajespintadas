import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const event = await prisma.evento.findUnique({
            where: { id: params.id },
        });
        if (!event) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const data: any = { ...body };
        if (body.dataInicio) data.dataInicio = new Date(body.dataInicio);
        if (body.dataFim) data.dataFim = new Date(body.dataFim);

        const event = await prisma.evento.update({
            where: { id: params.id },
            data,
        });
        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.evento.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
