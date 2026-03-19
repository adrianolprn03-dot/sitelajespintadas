import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.fAQ.findUnique({
            where: { id: params.id }
        });
        if (!item) return NextResponse.json({ error: "FAQ não encontrado" }, { status: 404 });
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar FAQ" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { pergunta, resposta, categoria, ordem } = body;

        const faq = await prisma.fAQ.update({
            where: { id: params.id },
            data: {
                pergunta,
                resposta,
                categoria,
                ordem: parseInt(ordem || "0"),
            },
        });
        return NextResponse.json(faq);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar FAQ" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.fAQ.delete({ where: { id: params.id } });
        return NextResponse.json({ message: "FAQ excluído com sucesso" });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir FAQ" }, { status: 500 });
    }
}
