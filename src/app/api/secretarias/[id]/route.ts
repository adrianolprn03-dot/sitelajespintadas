export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.secretaria.findUnique({ where: { id: params.id } });
        if (!item) return jsonNoStore({ error: "Não encontrada" }, { status: 404 });
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const data: any = {};
        if (body.nome !== undefined) data.nome = String(body.nome).trim();
        if (body.descricao !== undefined) data.descricao = String(body.descricao);
        if (body.servicos !== undefined) data.servicos = typeof body.servicos === "string" ? body.servicos : JSON.stringify(body.servicos || []);
        if (body.contato !== undefined) data.contato = body.contato || null;
        if (body.telefone !== undefined) data.telefone = body.telefone || null;
        if (body.email !== undefined) data.email = body.email || null;
        if (body.endereco !== undefined) data.endereco = body.endereco || null;
        if (body.secretario !== undefined) data.secretario = body.secretario || null;
        if (body.imagem !== undefined) data.imagem = body.imagem || null;
        if (body.horarioFuncionamento !== undefined) data.horarioFuncionamento = body.horarioFuncionamento || null;
        if (body.normaCriacao !== undefined) data.normaCriacao = body.normaCriacao || null;
        if (body.atoNomeacaoSecretario !== undefined) data.atoNomeacaoSecretario = body.atoNomeacaoSecretario || null;
        if (body.situacaoPublicacao !== undefined) data.situacaoPublicacao = body.situacaoPublicacao;
        if (body.ativa !== undefined) data.ativa = Boolean(body.ativa);
        if (body.ordem !== undefined) data.ordem = parseInt(String(body.ordem), 10) || 0;

        const item = await prisma.secretaria.update({ where: { id: params.id }, data });
        revalidatePaths([...REVALIDATE_GROUPS.secretarias, `/secretarias/${item.slug}`]);
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    return PATCH(req, context);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const item = await prisma.secretaria.findUnique({ where: { id: params.id } });
        await prisma.secretaria.delete({ where: { id: params.id } });
        revalidatePaths(
            item?.slug
                ? [...REVALIDATE_GROUPS.secretarias, `/secretarias/${item.slug}`]
                : REVALIDATE_GROUPS.secretarias
        );
        return jsonNoStore({ success: true });
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}
