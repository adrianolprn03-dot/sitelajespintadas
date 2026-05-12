import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.terceirizado.findUnique({
            where: { id: params.id }
        });
        if (!item) return NextResponse.json({ error: "Terceirizado não encontrado" }, { status: 404 });
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar terceirizado" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const item = await prisma.terceirizado.update({
            where: { id: params.id },
            data: {
                nome: body.nome,
                empresa: body.empresa,
                funcao: body.funcao,
                unidadeLotacao: body.unidadeLotacao,
                dataInicio: new Date(body.dataInicio),
                dataFim: body.dataFim ? new Date(body.dataFim) : null,
                status: body.status
            }
        });
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar terceirizado" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.terceirizado.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir terceirizado" }, { status: 500 });
    }
}
