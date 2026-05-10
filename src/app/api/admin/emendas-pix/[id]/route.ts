export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.emendaPix.findUnique({
            where: { id: params.id },
        });
        if (!item) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar emenda" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const data = {
            ...body,
            ano: parseInt(body.ano),
            valorPrevisto: parseFloat(body.valorPrevisto || 0),
            valorRecebido: parseFloat(body.valorRecebido || 0),
            valorExecutado: parseFloat(body.valorExecutado || 0),
            dataRecebimento: body.dataRecebimento ? new Date(body.dataRecebimento) : null,
            prazoExecucao: body.prazoExecucao ? new Date(body.prazoExecucao) : null,
        };

        delete data.id;
        delete data.criadoEm;
        delete data.atualizadoEm;

        const item = await prisma.emendaPix.update({
            where: { id: params.id },
            data,
        });
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar emenda" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.emendaPix.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir emenda" }, { status: 500 });
    }
}
