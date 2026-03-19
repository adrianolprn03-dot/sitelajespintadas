import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const secretaria = searchParams.get("secretaria");
    const modalidade = searchParams.get("modalidade");
    const ano = searchParams.get("ano");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (secretaria) where.secretaria = { contains: secretaria };
    if (modalidade) where.modalidade = modalidade;
    if (ano) where.ano = parseInt(ano);

    try {
        const [items, total] = await Promise.all([
            prisma.licitacao.findMany({ where, orderBy: { criadoEm: "desc" } }),
            prisma.licitacao.count({ where }),
        ]);
        return NextResponse.json({ items, total });
    } catch {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = {
            ...body,
            ano: body.ano ? parseInt(body.ano) : new Date().getFullYear(),
            valor: body.valor ? parseFloat(body.valor) : null,
            dataAbertura: body.dataAbertura ? new Date(body.dataAbertura) : null,
            dataEncerramento: body.dataEncerramento ? new Date(body.dataEncerramento) : null,
        };

        const licitacao = await prisma.licitacao.create({ data });
        return NextResponse.json(licitacao, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar licitação:", error);
        return NextResponse.json({ error: "Erro ao salvar licitação no banco de dados" }, { status: 500 });
    }
}
