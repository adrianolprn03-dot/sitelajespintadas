export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.diaria.findUnique({
            where: { id: params.id },
        });
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
        if (body.servidor !== undefined) data.servidor = String(body.servidor).trim();
        if (body.matricula !== undefined) data.matricula = body.matricula || null;
        if (body.cargo !== undefined) data.cargo = String(body.cargo).trim();
        if (body.destino !== undefined) data.destino = String(body.destino).trim();
        if (body.tipoDestino !== undefined) data.tipoDestino = body.tipoDestino || "estadual";
        if (body.motivo !== undefined) data.motivo = String(body.motivo).trim();
        if (body.dataInicio !== undefined) data.dataInicio = new Date(body.dataInicio);
        if (body.dataFim !== undefined) data.dataFim = new Date(body.dataFim);
        if (body.valor !== undefined) data.valor = parseFloat(String(body.valor)) || 0;
        if (body.valorUnitario !== undefined) data.valorUnitario = parseFloat(String(body.valorUnitario)) || 0;
        if (body.quantidadeDias !== undefined) data.quantidadeDias = parseFloat(String(body.quantidadeDias)) || 1;
        if (body.secretaria !== undefined) data.secretaria = String(body.secretaria).trim();
        if (body.mes !== undefined) data.mes = parseInt(String(body.mes), 10);
        if (body.ano !== undefined) data.ano = parseInt(String(body.ano), 10);
        if (body.numeroPortaria !== undefined) data.numeroPortaria = body.numeroPortaria || null;
        if (body.portariaUrl !== undefined) data.portariaUrl = body.portariaUrl || null;
        if (body.relatorioViagemUrl !== undefined) data.relatorioViagemUrl = body.relatorioViagemUrl || null;
        if (body.situacaoPublicacao !== undefined) data.situacaoPublicacao = body.situacaoPublicacao;

        const updated = await prisma.diaria.update({
            where: { id: params.id },
            data,
        });
        revalidatePaths(REVALIDATE_GROUPS.diarias);
        return jsonNoStore(updated);
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
        await prisma.diaria.delete({
            where: { id: params.id },
        });
        revalidatePaths(REVALIDATE_GROUPS.diarias);
        return jsonNoStore({ message: "Excluído com sucesso" });
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}
