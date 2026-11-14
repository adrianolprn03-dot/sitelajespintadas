export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.contrato.findUnique({ where: { id: params.id } });
        if (!item) return jsonNoStore({ error: "Não encontrado" }, { status: 404 });
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
        if (body.ano !== undefined) data.ano = body.ano ? parseInt(String(body.ano), 10) : null;
        if (body.modalidadeOrigem !== undefined) data.modalidadeOrigem = body.modalidadeOrigem || null;
        if (body.objeto !== undefined) data.objeto = String(body.objeto).trim();
        if (body.fornecedor !== undefined) data.fornecedor = String(body.fornecedor).trim();
        if (body.cnpjFornecedor !== undefined) data.cnpjFornecedor = body.cnpjFornecedor || null;
        if (body.valor !== undefined) data.valor = parseFloat(String(body.valor)) || 0;
        if (body.dataAssinatura !== undefined) data.dataAssinatura = body.dataAssinatura ? new Date(body.dataAssinatura) : null;
        if (body.dataInicio !== undefined) data.dataInicio = new Date(body.dataInicio);
        if (body.dataFim !== undefined) data.dataFim = new Date(body.dataFim);
        if (body.secretaria !== undefined) data.secretaria = String(body.secretaria).trim();
        if (body.unidadeResponsavel !== undefined) data.unidadeResponsavel = body.unidadeResponsavel || null;
        if (body.status !== undefined) data.status = String(body.status);
        if (body.instrumentoIntegralUrl !== undefined) data.instrumentoIntegralUrl = body.instrumentoIntegralUrl || null;
        if (body.aditivos !== undefined) data.aditivos = typeof body.aditivos === "string" ? body.aditivos : JSON.stringify(body.aditivos || []);
        if (body.fiscais !== undefined) data.fiscais = typeof body.fiscais === "string" ? body.fiscais : JSON.stringify(body.fiscais || []);
        if (body.justificativaOrdemCronologica !== undefined) data.justificativaOrdemCronologica = body.justificativaOrdemCronologica || null;
        if (body.documentos !== undefined) data.documentos = typeof body.documentos === "string" ? body.documentos : JSON.stringify(body.documentos || []);
        if (body.licitacaoId !== undefined) data.licitacaoId = body.licitacaoId || null;
        if (body.situacaoPublicacao !== undefined) data.situacaoPublicacao = body.situacaoPublicacao;

        const item = await prisma.contrato.update({ where: { id: params.id }, data });
        revalidatePaths(REVALIDATE_GROUPS.contratos);
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
        await prisma.contrato.delete({ where: { id: params.id } });
        revalidatePaths(REVALIDATE_GROUPS.contratos);
        return jsonNoStore({ success: true });
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}
