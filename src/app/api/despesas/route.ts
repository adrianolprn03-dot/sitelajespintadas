import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ano = searchParams.get("ano");
    const mes = searchParams.get("mes");
    const secretaria = searchParams.get("secretaria");

    const where: Record<string, unknown> = {};
    if (ano) where.ano = parseInt(ano);
    if (mes) where.mes = parseInt(mes);
    if (secretaria) where.secretaria = { contains: secretaria };

    try {
        const [items, total] = await Promise.all([
            prisma.despesa.findMany({ where, orderBy: [{ ano: "desc" }, { mes: "desc" }] }),
            prisma.despesa.count({ where }),
        ]);
        const totalValor = items.reduce((sum, d) => sum + d.valor, 0);
        return NextResponse.json({ items, total, totalValor });
    } catch {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = {
            ...body,
            valor: parseFloat(body.valor) || 0,
            mes: parseInt(body.mes) || new Date().getMonth() + 1,
            ano: parseInt(body.ano) || new Date().getFullYear(),
        };

        const despesa = await prisma.despesa.create({ data });
        return NextResponse.json(despesa, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar despesa:", error);
        return NextResponse.json({ error: "Erro ao salvar despesa no banco de dados" }, { status: 500 });
    }
}
