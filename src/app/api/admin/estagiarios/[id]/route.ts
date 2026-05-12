import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const estagiario = await prisma.estagiario.findUnique({
            where: { id: params.id }
        });
        if (!estagiario) return NextResponse.json({ error: "Estagiário não encontrado" }, { status: 404 });
        return NextResponse.json(estagiario);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar estagiário" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const estagiario = await prisma.estagiario.update({
            where: { id: params.id },
            data: {
                nome: body.nome,
                instituicaoEnsino: body.instituicaoEnsino,
                unidadeLotacao: body.unidadeLotacao,
                dataInicio: new Date(body.dataInicio),
                dataFim: body.dataFim ? new Date(body.dataFim) : null,
                valorBolsa: parseFloat(body.valorBolsa),
                status: body.status
            }
        });
        return NextResponse.json(estagiario);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar estagiário" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.estagiario.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir estagiário" }, { status: 500 });
    }
}
