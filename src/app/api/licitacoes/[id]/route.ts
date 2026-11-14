export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.licitacao.findUnique({ where: { id: params.id } });
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
        if (body.codigoPermanente !== undefined) data.codigoPermanente = body.codigoPermanente || null;
        if (body.numero !== undefined) data.numero = String(body.numero).trim();
        if (body.numeroProcesso !== undefined) data.numeroProcesso = body.numeroProcesso || null;
        if (body.ano !== undefined) data.ano = parseInt(String(body.ano), 10);
        if (body.modalidade !== undefined) data.modalidade = String(body.modalidade);
        if (body.objeto !== undefined) data.objeto = String(body.objeto).trim();
        if (body.valor !== undefined) data.valor = body.valor !== null && body.valor !== "" ? parseFloat(String(body.valor)) : null;
        if (body.valorEstimado !== undefined) data.valorEstimado = body.valorEstimado !== null && body.valorEstimado !== "" ? parseFloat(String(body.valorEstimado)) : null;
        if (body.valorHomologado !== undefined) data.valorHomologado = body.valorHomologado !== null && body.valorHomologado !== "" ? parseFloat(String(body.valorHomologado)) : null;
        if (body.status !== undefined) data.status = String(body.status);
        if (body.dataAbertura !== undefined) data.dataAbertura = body.dataAbertura ? new Date(body.dataAbertura) : null;
        if (body.dataEncerramento !== undefined) data.dataEncerramento = body.dataEncerramento ? new Date(body.dataEncerramento) : null;
        if (body.dataPublicacao !== undefined) data.dataPublicacao = body.dataPublicacao ? new Date(body.dataPublicacao) : null;
        if (body.dataHomologacao !== undefined) data.dataHomologacao = body.dataHomologacao ? new Date(body.dataHomologacao) : null;
        if (body.secretaria !== undefined) data.secretaria = String(body.secretaria).trim();
        if (body.unidadeResponsavel !== undefined) data.unidadeResponsavel = body.unidadeResponsavel || null;
        if (body.amparoLegal !== undefined) data.amparoLegal = body.amparoLegal || null;
        if (body.editalUrl !== undefined) data.editalUrl = body.editalUrl || null;
        if (body.fasesDocumentos !== undefined) data.fasesDocumentos = typeof body.fasesDocumentos === "string" ? body.fasesDocumentos : JSON.stringify(body.fasesDocumentos || []);
        if (body.ataRegistroPreco !== undefined) data.ataRegistroPreco = Boolean(body.ataRegistroPreco);
        if (body.adesaoArp !== undefined) data.adesaoArp = Boolean(body.adesaoArp);
        if (body.documentos !== undefined) data.documentos = typeof body.documentos === "string" ? body.documentos : JSON.stringify(body.documentos || []);
        if (body.resultado !== undefined) data.resultado = body.resultado || null;
        if (body.situacaoPublicacao !== undefined) data.situacaoPublicacao = body.situacaoPublicacao;

        const item = await prisma.licitacao.update({ where: { id: params.id }, data });
        revalidatePaths(REVALIDATE_GROUPS.licitacoes);
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
        await prisma.licitacao.delete({ where: { id: params.id } });
        revalidatePaths(REVALIDATE_GROUPS.licitacoes);
        return jsonNoStore({ success: true });
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}
