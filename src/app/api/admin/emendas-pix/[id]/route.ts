export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.emendaPix.findUnique({
            where: { id: params.id },
        });
        if (!item) return jsonNoStore({ error: "Não encontrado" }, { status: 404 });
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro ao buscar emenda" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const data: any = {};
        if (body.ano !== undefined) data.ano = parseInt(String(body.ano), 10);
        if (body.origem !== undefined) data.origem = String(body.origem);
        if (body.tipoEmenda !== undefined) data.tipoEmenda = body.tipoEmenda || null;
        if (body.formaRepasse !== undefined) data.formaRepasse = body.formaRepasse || null;
        if (body.numeroEmenda !== undefined) data.numeroEmenda = body.numeroEmenda || null;
        if (body.autor !== undefined) data.autor = String(body.autor);
        if (body.beneficiario !== undefined) data.beneficiario = String(body.beneficiario);
        if (body.cnpjBeneficiario !== undefined) data.cnpjBeneficiario = body.cnpjBeneficiario || null;
        if (body.valorPrevisto !== undefined) data.valorPrevisto = parseFloat(String(body.valorPrevisto || 0)) || 0;
        if (body.valorRecebido !== undefined) data.valorRecebido = parseFloat(String(body.valorRecebido || 0)) || 0;
        if (body.valorExecutado !== undefined) data.valorExecutado = parseFloat(String(body.valorExecutado || 0)) || 0;
        if (body.objeto !== undefined) data.objeto = body.objeto || null;
        if (body.funcaoGoverno !== undefined) data.funcaoGoverno = body.funcaoGoverno || null;
        if (body.secretariaResponsavel !== undefined) data.secretariaResponsavel = body.secretariaResponsavel || null;
        if (body.situacao !== undefined) data.situacao = String(body.situacao);
        if (body.dataRecebimento !== undefined) data.dataRecebimento = body.dataRecebimento ? new Date(body.dataRecebimento) : null;
        if (body.prazoExecucao !== undefined) data.prazoExecucao = body.prazoExecucao ? new Date(body.prazoExecucao) : null;
        if (body.contaBancaria !== undefined) data.contaBancaria = body.contaBancaria || null;
        if (body.naturezaDespesa !== undefined) data.naturezaDespesa = body.naturezaDespesa || null;
        if (body.arquivo !== undefined) data.arquivo = body.arquivo || null;
        if (body.documentUrl !== undefined) data.documentUrl = body.documentUrl || null;

        const item = await prisma.emendaPix.update({
            where: { id: params.id },
            data,
        });
        revalidatePaths(REVALIDATE_GROUPS.emendas);
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro ao atualizar emenda" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        await prisma.emendaPix.delete({
            where: { id: params.id },
        });
        revalidatePaths(REVALIDATE_GROUPS.emendas);
        return jsonNoStore({ success: true });
    } catch {
        return jsonNoStore({ error: "Erro ao excluir emenda" }, { status: 500 });
    }
}
