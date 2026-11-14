export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

// PUT /api/admin/central-regulacao/[id] - Atualizar um item da fila de regulação
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { tipo, totalPacientes, tempoEspera, procedimentos, competencia, protocolosLista, icone, cor, ordem, ativo } = body;

        const itemAtualizado = await prisma.centralRegulacaoItem.update({
            where: { id: params.id },
            data: {
                tipo,
                totalPacientes: Number(totalPacientes) || 0,
                tempoEspera,
                procedimentos: procedimentos || null,
                competencia: competencia !== undefined ? competencia || null : undefined,
                protocolosLista:
                    protocolosLista !== undefined
                        ? typeof protocolosLista === "string"
                            ? protocolosLista
                            : protocolosLista
                            ? JSON.stringify(protocolosLista)
                            : null
                        : undefined,
                icone,
                cor,
                ordem: Number(ordem) || 0,
                ativo: Boolean(ativo)
            }
        });

        revalidatePaths(REVALIDATE_GROUPS.centralRegulacao);
        return NextResponse.json({ success: true, item: itemAtualizado });
    } catch (error) {
        console.error("Erro ao atualizar item da regulação:", error);
        return NextResponse.json({ error: "Erro ao atualizar item." }, { status: 400 });
    }
}

// DELETE /api/admin/central-regulacao/[id] - Excluir um item de fila
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });
    }

    try {
        await prisma.centralRegulacaoItem.delete({
            where: { id: params.id }
        });
        revalidatePaths(REVALIDATE_GROUPS.centralRegulacao);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao excluir item da regulação:", error);
        return NextResponse.json({ error: "Erro ao excluir item." }, { status: 400 });
    }
}
