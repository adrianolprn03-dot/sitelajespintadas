import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const noticia = await prisma.noticia.findUnique({
            where: { id: params.id },
            include: { secretaria: true },
        });
        if (!noticia) return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
        return NextResponse.json(noticia);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        
        // Extrair apenas os campos que existem no schema do Prisma
        const { titulo, resumo, conteudo, imagem, publicada, secretariaId } = body;

        const updateData: any = {
            titulo,
            resumo,
            conteudo,
            imagem,
            publicada,
            secretariaId: secretariaId === "" ? null : secretariaId,
        };

        if (publicada === true) {
            updateData.publicadoEm = new Date();
        }

        const noticia = await prisma.noticia.update({
            where: { id: params.id },
            data: updateData,
        });
        return NextResponse.json(noticia);
    } catch (error) {
        console.error("Erro ao atualizar notícia:", error);
        return NextResponse.json({ error: "Erro interno ao atualizar" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.noticia.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
