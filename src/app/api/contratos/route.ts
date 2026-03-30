import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ano = searchParams.get("ano");
    const status = searchParams.get("status");
    const query = searchParams.get("query");

    const where: any = {};
    
    if (ano) {
        const year = parseInt(ano);
        where.dataInicio = {
            gte: new Date(`${year}-01-01T00:00:00.000Z`),
            lte: new Date(`${year}-12-31T23:59:59.999Z`),
        };
    }
    
    if (status) where.status = { contains: status, mode: 'insensitive' };
    
    if (query) {
        where.OR = [
            { objeto: { contains: query, mode: 'insensitive' } },
            { fornecedor: { contains: query, mode: 'insensitive' } },
            { numero: { contains: query, mode: 'insensitive' } },
        ];
    }

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
        console.error("Erro ao buscar contratos:", error);
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
