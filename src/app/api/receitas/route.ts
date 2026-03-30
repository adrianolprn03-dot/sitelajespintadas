import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ano = searchParams.get("ano");
    const mes = searchParams.get("mes");
    const query = searchParams.get("query");
    const categoria = searchParams.get("categoria");

    const where: any = {};
    if (ano) where.ano = parseInt(ano);
    if (mes) where.mes = parseInt(mes);
    if (categoria) where.categoria = { contains: categoria, mode: 'insensitive' };
    
    if (query) {
        where.OR = [
            { descricao: { contains: query, mode: 'insensitive' } },
        ];
    }

    try {
        const [items, total] = await Promise.all([
            prisma.receita.findMany({ 
                where, 
                orderBy: [{ ano: "desc" }, { mes: "desc" }, { criadoEm: "desc" }] 
            }),
            prisma.receita.count({ where }),
        ]);
        const totalValor = items.reduce((sum, r) => sum + r.valor, 0);
        return NextResponse.json({ items, total, totalValor });
    } catch (error) {
        console.error("Erro ao buscar receitas:", error);
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

        const receita = await prisma.receita.create({ data });
        return NextResponse.json(receita, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar receita:", error);
        return NextResponse.json({ error: "Erro ao salvar receita no banco de dados" }, { status: 500 });
    }
}
