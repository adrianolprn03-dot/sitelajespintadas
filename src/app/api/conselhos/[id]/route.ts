import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.conselho.findUnique({
            where: { id: params.id },
            include: { atas: { orderBy: { dataReuniao: "desc" } } }
        });
        if (!item) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Erro" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { atas, ...conselhoData } = body;

        // Atualiza o conselho e recria as atas
        const item = await prisma.conselho.update({
            where: { id: params.id },
            data: {
                ...conselhoData,
                atas: {
                    deleteMany: {}, // Remove atas antigas
                    create: atas?.map((ata: any) => ({
                        titulo: ata.titulo,
                        dataReuniao: new Date(ata.dataReuniao),
                        arquivo: ata.arquivo
                    })) || [] // Insere as novas atas recebidas do form
                }
            },
            include: { atas: true }
        });
        return NextResponse.json(item);
    } catch (error) {
        console.error("Erro na atualização:", error);
        return NextResponse.json({ error: "Erro ao atualizar conselho" }, { status: 400 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.conselho.delete({ where: { id: params.id } });
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir" }, { status: 400 });
    }
}
