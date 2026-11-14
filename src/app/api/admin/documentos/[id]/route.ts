export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await request.json();
        const { titulo, tipo, arquivo, ano } = body;

        const data: any = { dataAtualizacaoEfetiva: new Date() };
        if (titulo !== undefined) data.titulo = String(titulo).trim();
        if (tipo !== undefined) data.tipo = String(tipo).trim();
        if (arquivo !== undefined) data.arquivo = arquivo || null;
        if (ano !== undefined) data.ano = ano ? parseInt(String(ano), 10) : null;
        if (body.descricao !== undefined) data.descricao = body.descricao || null;
        if (body.orgaoResponsavel !== undefined) data.orgaoResponsavel = body.orgaoResponsavel || null;
        if (body.secretaria !== undefined) data.secretaria = body.secretaria || null;
        if (body.documentUrl !== undefined) data.documentUrl = body.documentUrl || null;
        if (body.arquivoEditavelUrl !== undefined) data.arquivoEditavelUrl = body.arquivoEditavelUrl || null;
        if (body.competencia !== undefined) data.competencia = body.competencia || null;
        if (body.criterioPntp !== undefined) data.criterioPntp = body.criterioPntp || null;
        if (body.situacaoPublicacao !== undefined) data.situacaoPublicacao = body.situacaoPublicacao;
        if (body.ativo !== undefined) data.ativo = Boolean(body.ativo);

        const doc = await prisma.documento.update({
            where: { id: params.id },
            data,
        });

        revalidatePaths(REVALIDATE_GROUPS.documentos);
        return jsonNoStore(doc);
    } catch {
        return jsonNoStore({ error: "Erro ao atualizar" }, { status: 500 });
    }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        // Busca o registro para obter a URL do arquivo antes de deletar
        const item = await prisma.documento.findUnique({ where: { id: params.id } });
        if (item?.arquivo) {
            const { deleteFileFromR2 } = await import("@/lib/r2");
            await deleteFileFromR2(item.arquivo);
        }
        await prisma.documento.delete({ where: { id: params.id } });
        revalidatePaths(REVALIDATE_GROUPS.documentos);
        return jsonNoStore({ success: true });
    } catch {
        return jsonNoStore({ error: "Erro ao deletar" }, { status: 500 });
    }
}
