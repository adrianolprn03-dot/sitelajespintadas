import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const unidade = await prisma.unidadeAtendimento.findUnique({
            where: { id: params.id }
        });

        if (!unidade) {
            return NextResponse.json({ error: "Unidade não encontrada" }, { status: 404 });
        }

        return NextResponse.json(unidade);
    } catch (error) {
        console.error("Erro ao buscar unidade:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json();

        const unidade = await prisma.unidadeAtendimento.update({
            where: { id: params.id },
            data: {
                nome: data.nome,
                tipo: data.tipo,
                descricao: data.descricao,
                endereco: data.endereco,
                telefone: data.telefone,
                horario: data.horario,
                mapa: data.mapa,
                ativa: data.ativa !== undefined ? data.ativa : true,
            }
        });

        return NextResponse.json(unidade);
    } catch (error) {
        console.error("Erro ao atualizar unidade:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.unidadeAtendimento.delete({
            where: { id: params.id }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Erro ao deletar unidade:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
