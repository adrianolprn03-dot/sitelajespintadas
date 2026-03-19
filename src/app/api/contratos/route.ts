import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ano = searchParams.get("ano");
    const status = searchParams.get("status");

    const where: any = {};
    if (ano) where.dataAssinatura = {
        gte: new Date(`${ano}-01-01`),
        lte: new Date(`${ano}-12-31`),
    };
    if (status) where.status = status;

    try {
        const [items, total] = await Promise.all([
            prisma.contrato.findMany({
                where,
                orderBy: { dataInicio: "desc" },
            }),
            prisma.contrato.count({ where }),
        ]);
        return NextResponse.json({ items, total });
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = {
            ...body,
            valor: parseFloat(body.valor) || 0,
            dataInicio: new Date(body.dataInicio),
            dataFim: new Date(body.dataFim),
            dataAssinatura: body.dataAssinatura ? new Date(body.dataAssinatura) : new Date(),
            licitacaoId: body.licitacaoId || null,
        };

        const contrato = await prisma.contrato.create({ data });
        return NextResponse.json(contrato, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar contrato:", error);
        return NextResponse.json({ error: "Erro ao salvar contrato no banco de dados" }, { status: 500 });
    }
}
