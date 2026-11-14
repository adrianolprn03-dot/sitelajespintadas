export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.terceirizado.findUnique({
            where: { id: params.id }
        });
        if (!item) return NextResponse.json({ error: "Terceirizado não encontrado" }, { status: 404 });
        return jsonNoStore(item);
    } catch {
        return NextResponse.json({ error: "Erro ao buscar terceirizado" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });

    try {
        const body = await req.json();
        const item = await prisma.terceirizado.update({
            where: { id: params.id },
            data: {
                nome: body.nome,
                empresa: body.empresa,
                funcao: body.funcao,
                unidadeLotacao: body.unidadeLotacao,
                dataInicio: new Date(body.dataInicio),
                dataFim: body.dataFim ? new Date(body.dataFim) : null,
                status: body.status
            }
        });
        revalidatePaths(REVALIDATE_GROUPS.pessoal);
        return NextResponse.json(item);
    } catch {
        return NextResponse.json({ error: "Erro ao atualizar terceirizado" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });

    try {
        await prisma.terceirizado.delete({
            where: { id: params.id }
        });
        revalidatePaths(REVALIDATE_GROUPS.pessoal);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Erro ao excluir terceirizado" }, { status: 500 });
    }
}
