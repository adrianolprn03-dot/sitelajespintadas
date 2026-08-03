import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/admin/saude/[id] - Obter detalhes de um documento da saúde
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const doc = await prisma.documentoSaude.findUnique({
            where: { id: params.id }
        });

        if (!doc) {
            return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
        }

        return NextResponse.json(doc);
    } catch (error) {
        console.error("Erro ao buscar documento:", error);
        return NextResponse.json({ error: "Erro ao buscar documento" }, { status: 500 });
    }
}

// PUT /api/admin/saude/[id] - Atualizar um documento da saúde
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const { titulo, categoria, anoExercicio, periodoVigencia, statusConselho, numeroResolucao, descricao, linkDocumento, ativo } = body;

        const updated = await prisma.documentoSaude.update({
            where: { id: params.id },
            data: {
                ...(titulo && { titulo }),
                ...(categoria && { categoria }),
                ...(anoExercicio && { anoExercicio: parseInt(anoExercicio) }),
                ...(periodoVigencia !== undefined && { periodoVigencia }),
                ...(statusConselho !== undefined && { statusConselho }),
                ...(numeroResolucao !== undefined && { numeroResolucao }),
                ...(descricao !== undefined && { descricao }),
                ...(linkDocumento !== undefined && { linkDocumento }),
                ...(ativo !== undefined && { ativo: Boolean(ativo) })
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Erro ao atualizar documento:", error);
        return NextResponse.json({ error: "Erro ao atualizar documento" }, { status: 500 });
    }
}

// DELETE /api/admin/saude/[id] - Excluir documento da saúde
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.documentoSaude.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ message: "Documento excluído com sucesso" });
    } catch (error) {
        console.error("Erro ao excluir documento:", error);
        return NextResponse.json({ error: "Erro ao excluir documento" }, { status: 500 });
    }
}
