export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const estagiario = await prisma.estagiario.findUnique({
            where: { id: params.id }
        });
        if (!estagiario) return NextResponse.json({ error: "Estagiário não encontrado" }, { status: 404 });
        return jsonNoStore(estagiario);
    } catch {
        return NextResponse.json({ error: "Erro ao buscar estagiário" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });

    try {
        const body = await req.json();
        const estagiario = await prisma.estagiario.update({
            where: { id: params.id },
            data: {
                nome: body.nome,
                instituicaoEnsino: body.instituicaoEnsino,
                unidadeLotacao: body.unidadeLotacao,
                dataInicio: new Date(body.dataInicio),
                dataFim: body.dataFim ? new Date(body.dataFim) : null,
                valorBolsa: parseFloat(body.valorBolsa),
                status: body.status
            }
        });
        revalidatePaths(REVALIDATE_GROUPS.pessoal);
        return NextResponse.json(estagiario);
    } catch {
        return NextResponse.json({ error: "Erro ao atualizar estagiário" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });

    try {
        await prisma.estagiario.delete({
            where: { id: params.id }
        });
        revalidatePaths(REVALIDATE_GROUPS.pessoal);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Erro ao excluir estagiário" }, { status: 500 });
    }
}
