import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

        revalidatePath("/transparencia/lrf");
        revalidatePath("/admin/relatorios-fiscais");

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

        revalidatePath("/transparencia/lrf");
        revalidatePath("/admin/relatorios-fiscais");

        return NextResponse.json({ message: "Relatório removido" });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir relatório" }, { status: 500 });
    }
}
