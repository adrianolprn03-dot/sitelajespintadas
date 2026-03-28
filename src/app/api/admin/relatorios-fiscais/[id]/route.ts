import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { titulo, tipo, periodo, ano, arquivo } = body;

        const atualizado = await prisma.relatorioFiscal.update({
            where: { id: params.id },
            data: {
                titulo,
                tipo,
                periodo,
                ano: parseInt(ano.toString()),
                arquivo,
            },
        });

        return NextResponse.json(atualizado);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar relatório" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.relatorioFiscal.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ message: "Relatório removido" });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir relatório" }, { status: 500 });
    }
}
