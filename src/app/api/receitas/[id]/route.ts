export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.receita.findUnique({ where: { id: params.id } });
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
        const data: any = { dataAtualizacaoEfetiva: new Date() };
        if (body.descricao !== undefined) data.descricao = String(body.descricao).trim();
        if (body.categoria !== undefined) data.categoria = String(body.categoria);
        if (body.naturezaCodigo !== undefined) data.naturezaCodigo = body.naturezaCodigo || null;
        if (body.orgao !== undefined) data.orgao = body.orgao || null;
        if (body.unidade !== undefined) data.unidade = body.unidade || null;
        if (body.fonte !== undefined) data.fonte = body.fonte || null;
        if (body.valor !== undefined) data.valor = parseFloat(String(body.valor)) || 0;
        if (body.valorPrevisto !== undefined) data.valorPrevisto = body.valorPrevisto !== null && body.valorPrevisto !== "" ? parseFloat(String(body.valorPrevisto)) : null;
        if (body.valorAtualizado !== undefined) data.valorAtualizado = body.valorAtualizado !== null && body.valorAtualizado !== "" ? parseFloat(String(body.valorAtualizado)) : null;
        if (body.valorLancado !== undefined) data.valorLancado = body.valorLancado !== null && body.valorLancado !== "" ? parseFloat(String(body.valorLancado)) : null;
        if (body.valorArrecadado !== undefined) data.valorArrecadado = body.valorArrecadado !== null && body.valorArrecadado !== "" ? parseFloat(String(body.valorArrecadado)) : null;
        if (body.mes !== undefined) data.mes = parseInt(String(body.mes), 10);
        if (body.ano !== undefined) data.ano = parseInt(String(body.ano), 10);
        if (body.situacaoPublicacao !== undefined) data.situacaoPublicacao = body.situacaoPublicacao;

        const item = await prisma.receita.update({ where: { id: params.id }, data });
        revalidatePaths(REVALIDATE_GROUPS.receitas);
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
        await prisma.receita.delete({ where: { id: params.id } });
        revalidatePaths(REVALIDATE_GROUPS.receitas);
        return jsonNoStore({ success: true });
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}
