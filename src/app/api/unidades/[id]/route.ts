export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const unidade = await prisma.unidadeAtendimento.findUnique({
            where: { id: params.id }
        });

        if (!unidade) {
            return NextResponse.json({ error: "Unidade não encontrada" }, { status: 404 });
        }

        return jsonNoStore(unidade);
    } catch (error) {
        console.error("Erro ao buscar unidade:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });
    }

    try {
        const data = await request.json();

        const unidade = await prisma.unidadeAtendimento.update({
            where: { id: params.id },
            data: {
                nome: data.nome,
                tipo: data.tipo,
                descricao: data.descricao,
                endereco: data.endereco,
                telefone: data.telefone || null,
                horario: data.horario,
                mapa: data.mapa || null,
                ativa: data.ativa !== undefined ? Boolean(data.ativa) : true,
            }
        });

        revalidatePaths(REVALIDATE_GROUPS.unidades);
        return NextResponse.json(unidade);
    } catch (error) {
        console.error("Erro ao atualizar unidade:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });
    }

    try {
        const existing = await prisma.unidadeAtendimento.findUnique({ where: { id: params.id } });
        if (!existing) {
            return NextResponse.json({ error: "Unidade não encontrada" }, { status: 404 });
        }

        await prisma.unidadeAtendimento.delete({
            where: { id: params.id }
        });

        revalidatePaths(REVALIDATE_GROUPS.unidades);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao deletar unidade:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
