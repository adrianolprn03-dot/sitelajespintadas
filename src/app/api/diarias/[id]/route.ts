import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.diaria.findUnique({
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
        const updated = await prisma.diaria.update({
            where: { id: params.id },
            data: {
                ...body,
                dataInicio: body.dataInicio ? new Date(body.dataInicio) : undefined,
                dataFim: body.dataFim ? new Date(body.dataFim) : undefined,
                valor: body.valor ? parseFloat(body.valor) : undefined,
                quantidadeDias: body.quantidadeDias ? parseInt(body.quantidadeDias) : undefined,
                mes: body.mes ? parseInt(body.mes) : undefined,
                ano: body.ano ? parseInt(body.ano) : undefined,
            },
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.diaria.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ message: "Excluído com sucesso" });
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
