import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.obra.findUnique({
            where: { id: params.id }
        });
        if (!item) return NextResponse.json({ error: "Obra não encontrada" }, { status: 404 });
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar obra" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { titulo, descricao, local, valor, status, dataInicio, previsaoTermino, empresa, percentual, imagem } = body;

        const obra = await prisma.obra.update({
            where: { id: params.id },
            data: {
                titulo,
                descricao,
                local,
                valor: parseFloat(valor),
                status,
                dataInicio: dataInicio ? new Date(dataInicio) : null,
                previsaoTermino: previsaoTermino ? new Date(previsaoTermino) : null,
                empresa,
                percentual: parseInt(percentual || "0"),
                imagem,
            },
        });
        return NextResponse.json(obra);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar obra" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.obra.delete({ where: { id: params.id } });
        return NextResponse.json({ message: "Obra excluída com sucesso" });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir obra" }, { status: 500 });
    }
}
