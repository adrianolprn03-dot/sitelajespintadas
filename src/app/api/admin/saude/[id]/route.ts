import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export const dynamic = "force-dynamic";

// GET /api/admin/saude/[id] - Obter detalhes de um documento da saúde
export async function GET(_request: Request, { params }: { params: { id: string } }) {
    try {
        const doc = await prisma.documentoSaude.findUnique({
            where: { id: params.id }
        });

        if (!doc) {
            return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
        }

        return jsonNoStore(doc);
    } catch (error) {
        console.error("Erro ao buscar documento:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

// PUT /api/admin/saude/[id] - Atualizar um documento da saúde
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { titulo, categoria, anoExercicio, periodoVigencia, statusConselho, numeroResolucao, descricao, linkDocumento, ativo } = body;

        const updated = await prisma.documentoSaude.update({
            where: { id: params.id },
            data: {
                titulo: titulo !== undefined ? String(titulo).trim() : undefined,
                categoria: categoria !== undefined ? String(categoria).trim() : undefined,
                anoExercicio: anoExercicio !== undefined ? parseInt(String(anoExercicio), 10) : undefined,
                periodoVigencia: periodoVigencia !== undefined ? (periodoVigencia || null) : undefined,
                statusConselho: statusConselho !== undefined ? (statusConselho || null) : undefined,
                numeroResolucao: numeroResolucao !== undefined ? (numeroResolucao || null) : undefined,
                descricao: descricao !== undefined ? (descricao || null) : undefined,
                linkDocumento: linkDocumento !== undefined ? (linkDocumento || null) : undefined,
                ativo: ativo !== undefined ? Boolean(ativo) : undefined
            }
        });

        revalidatePaths(REVALIDATE_GROUPS.saudeDocumentos);
        return NextResponse.json(updated);
    } catch (error) {
        console.error("Erro ao atualizar documento:", error);
        return NextResponse.json({ error: "Erro ao atualizar documento da saúde" }, { status: 500 });
    }
}

// DELETE /api/admin/saude/[id] - Excluir documento da saúde
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });
    }

    try {
        const doc = await prisma.documentoSaude.findUnique({ where: { id: params.id } });
        if (!doc) {
            return NextResponse.json({ error: "Documento não encontrado ou já excluído" }, { status: 404 });
        }

        if (doc.linkDocumento && doc.linkDocumento.startsWith("http")) {
            const { deleteFileFromR2 } = await import("@/lib/r2");
            await deleteFileFromR2(doc.linkDocumento);
        }

        await prisma.documentoSaude.delete({
            where: { id: params.id }
        });

        revalidatePaths(REVALIDATE_GROUPS.saudeDocumentos);
        return NextResponse.json({ message: "Documento excluído com sucesso" });
    } catch (error) {
        console.error("Erro ao excluir documento:", error);
        return NextResponse.json({ error: "Erro ao excluir documento" }, { status: 500 });
    }
}
