export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.despesa.findUnique({ where: { id: params.id } });
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
        if (body.numeroEmpenho !== undefined) data.numeroEmpenho = body.numeroEmpenho || null;
        if (body.dataEmpenho !== undefined) data.dataEmpenho = body.dataEmpenho ? new Date(body.dataEmpenho) : null;
        if (body.descricao !== undefined) data.descricao = String(body.descricao).trim();
        if (body.categoria !== undefined) data.categoria = String(body.categoria);
        if (body.secretaria !== undefined) data.secretaria = String(body.secretaria);
        if (body.orgao !== undefined) data.orgao = body.orgao || null;
        if (body.unidade !== undefined) data.unidade = body.unidade || null;
        if (body.fornecedor !== undefined) data.fornecedor = body.fornecedor || null;
        if (body.credorCpfCnpj !== undefined) data.credorCpfCnpj = body.credorCpfCnpj || null;
        if (body.classificacaoOrcamentaria !== undefined) data.classificacaoOrcamentaria = body.classificacaoOrcamentaria || null;
        if (body.funcao !== undefined) data.funcao = body.funcao || null;
        if (body.subfuncao !== undefined) data.subfuncao = body.subfuncao || null;
        if (body.programa !== undefined) data.programa = body.programa || null;
        if (body.elementoDespesa !== undefined) data.elementoDespesa = body.elementoDespesa || null;
        if (body.fonteRecurso !== undefined) data.fonteRecurso = body.fonteRecurso || null;
        if (body.valor !== undefined) data.valor = parseFloat(String(body.valor)) || 0;
        if (body.valorEmpenhado !== undefined) data.valorEmpenhado = body.valorEmpenhado !== null && body.valorEmpenhado !== "" ? parseFloat(String(body.valorEmpenhado)) : null;
        if (body.valorLiquidado !== undefined) data.valorLiquidado = body.valorLiquidado !== null && body.valorLiquidado !== "" ? parseFloat(String(body.valorLiquidado)) : null;
        if (body.valorPago !== undefined) data.valorPago = body.valorPago !== null && body.valorPago !== "" ? parseFloat(String(body.valorPago)) : null;
        if (body.modalidadeLicitacao !== undefined) data.modalidadeLicitacao = body.modalidadeLicitacao || null;
        if (body.numeroProcessoLicitatorio !== undefined) data.numeroProcessoLicitatorio = body.numeroProcessoLicitatorio || null;
        if (body.licitacaoId !== undefined) data.licitacaoId = body.licitacaoId || null;
        if (body.contratoId !== undefined) data.contratoId = body.contratoId || null;
        if (body.mes !== undefined) data.mes = parseInt(String(body.mes), 10);
        if (body.ano !== undefined) data.ano = parseInt(String(body.ano), 10);
        if (body.situacaoPublicacao !== undefined) data.situacaoPublicacao = body.situacaoPublicacao;

        const item = await prisma.despesa.update({ where: { id: params.id }, data });
        revalidatePaths(REVALIDATE_GROUPS.despesas);
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
        await prisma.despesa.delete({ where: { id: params.id } });
        revalidatePaths(REVALIDATE_GROUPS.despesas);
        return jsonNoStore({ success: true });
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}
