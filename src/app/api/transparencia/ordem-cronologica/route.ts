import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ano = searchParams.get("ano");
    const mes = searchParams.get("mes");
    const status = searchParams.get("status");
    const query = searchParams.get("query");

    const where: any = {};

    if (status) where.status = status;

    if (query) {
        where.OR = [
            { fornecedor: { contains: query, mode: 'insensitive' } },
            { cnpj: { contains: query, mode: 'insensitive' } },
            { descricao: { contains: query, mode: 'insensitive' } },
        ];
    }

    if (ano) {
        const y = parseInt(ano);
        const startDate = new Date(y, 0, 1);
        const endDate = new Date(y, 11, 31, 23, 59, 59);
        
        if (mes) {
            const m = parseInt(mes);
            startDate.setMonth(m - 1);
            endDate.setMonth(m - 1);
            endDate.setDate(new Date(y, m, 0).getDate());
        }
        
        where.dataLiquidacao = {
            gte: startDate,
            lte: endDate,
        };
    }

    try {
        const items = await prisma.pagamento.findMany({
            where,
            orderBy: { ordem: 'asc' }, // Ordem cronológica por definição
        });

        return NextResponse.json({ items });
    } catch (error) {
        console.error("Erro ao buscar ordem cronológica:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
