export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const item = await prisma.documento.findUnique({
            where: { id: params.id },
        });
        if (!item) return jsonNoStore({ error: "Não encontrado" }, { status: 404 });
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const data: any = { dataAtualizacaoEfetiva: new Date() };
        if (body.titulo !== undefined) data.titulo = String(body.titulo).trim();
        if (body.descricao !== undefined) data.descricao = body.descricao || null;
        if (body.tipo !== undefined) data.tipo = String(body.tipo).trim();
        if (body.orgaoResponsavel !== undefined) data.orgaoResponsavel = body.orgaoResponsavel || null;
        if (body.secretaria !== undefined) data.secretaria = body.secretaria || null;
        if (body.arquivo !== undefined) data.arquivo = body.arquivo || null;
        if (body.documentUrl !== undefined) data.documentUrl = body.documentUrl || null;
        if (body.arquivoEditavelUrl !== undefined) data.arquivoEditavelUrl = body.arquivoEditavelUrl || null;
        if (body.ano !== undefined) data.ano = body.ano ? parseInt(String(body.ano), 10) : null;
        if (body.tamanho !== undefined) data.tamanho = body.tamanho ? parseInt(String(body.tamanho), 10) : null;
        if (body.competencia !== undefined) data.competencia = body.competencia || null;
        if (body.criterioPntp !== undefined) data.criterioPntp = body.criterioPntp || null;
        if (body.situacaoPublicacao !== undefined) data.situacaoPublicacao = body.situacaoPublicacao;
        if (body.ativo !== undefined) data.ativo = Boolean(body.ativo);

        const item = await prisma.documento.update({
            where: { id: params.id },
            data,
        });
        revalidatePaths(REVALIDATE_GROUPS.documentos);
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    return PATCH(req, context);
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        // Busca o registro para obter a URL do arquivo antes de deletar
        const item = await prisma.documento.findUnique({ where: { id: params.id } });
        if (item?.arquivo) {
            const { deleteFileFromR2 } = await import("@/lib/r2");
            await deleteFileFromR2(item.arquivo);
        }
        await prisma.documento.delete({
            where: { id: params.id },
        });
        revalidatePaths(REVALIDATE_GROUPS.documentos);
        return jsonNoStore({ success: true });
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}
