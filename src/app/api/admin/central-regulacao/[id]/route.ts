import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/admin/central-regulacao/[id] - Atualizar um item da fila de regulação
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { tipo, totalPacientes, tempoEspera, procedimentos, icone, cor, ordem, ativo } = body;

        const itemAtualizado = await prisma.centralRegulacaoItem.update({
            where: { id: params.id },
            data: {
                tipo,
                totalPacientes: Number(totalPacientes) || 0,
                tempoEspera,
                procedimentos: procedimentos || null,
                icone,
                cor,
                ordem: Number(ordem) || 0,
                ativo: Boolean(ativo)
            }
        });

        return NextResponse.json({ success: true, item: itemAtualizado });
    } catch (error) {
        console.error("Erro ao atualizar item da regulação:", error);
        return NextResponse.json({ error: "Erro ao atualizar item." }, { status: 400 });
    }
}

// DELETE /api/admin/central-regulacao/[id] - Excluir um item de fila
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.centralRegulacaoItem.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao excluir item da regulação:", error);
        return NextResponse.json({ error: "Erro ao excluir item." }, { status: 400 });
    }
}
