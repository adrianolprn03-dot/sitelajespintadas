import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.convenio.findUnique({
            where: { id: params.id },
        });
        if (!item) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const updated = await prisma.convenio.update({
            where: { id: params.id },
            data: {
                ...body,
                dataInicio: body.dataInicio ? new Date(body.dataInicio) : undefined,
                dataFim: body.dataFim ? new Date(body.dataFim) : undefined,
                valor: body.valor ? parseFloat(body.valor) : undefined,
                contrapartida: body.contrapartida !== undefined ? parseFloat(body.contrapartida) : undefined,
            },
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.convenio.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ message: "Excluído com sucesso" });
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
