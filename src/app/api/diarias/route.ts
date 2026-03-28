import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ano = searchParams.get("ano");
    const mes = searchParams.get("mes");
    const servidor = searchParams.get("servidor");

    const where: any = {};
    if (ano) where.ano = parseInt(ano);
    if (mes) where.mes = parseInt(mes);
    if (servidor) where.servidor = { contains: servidor };

    try {
        const [items, total] = await Promise.all([
            prisma.diaria.findMany({
                where,
                orderBy: { dataInicio: "desc" },
            }),
            prisma.diaria.count({ where }),
        ]);
        const totalValor = items.reduce((sum, d) => sum + d.valor, 0);
        return NextResponse.json({ items, total, totalValor });
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = {
            ...body,
            dataInicio: new Date(body.dataInicio),
            dataFim: new Date(body.dataFim),
            valor: parseFloat(body.valor) || 0,
            valorUnitario: parseFloat(body.valorUnitario) || 0,
            quantidadeDias: parseInt(body.quantidadeDias) || 1,
            mes: parseInt(body.mes) || new Date().getMonth() + 1,
            ano: parseInt(body.ano) || new Date().getFullYear(),
        };

        const diaria = await (prisma as any).diaria.create({ data });
        return NextResponse.json(diaria, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar diária:", error);
        return NextResponse.json({ error: "Erro ao salvar diária no banco de dados" }, { status: 500 });
    }
}
