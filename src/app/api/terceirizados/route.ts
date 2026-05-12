import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const ano = searchParams.get("ano");
    const mes = searchParams.get("mes");
    const status = searchParams.get("status");

    try {
        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (query) {
            where.OR = [
                { nome: { contains: query, mode: "insensitive" } },
                { empresa: { contains: query, mode: "insensitive" } },
                { funcao: { contains: query, mode: "insensitive" } },
                { unidadeLotacao: { contains: query, mode: "insensitive" } },
            ];
        }

        if (ano) {
            const startDate = new Date(`${ano}-01-01`);
            const endDate = new Date(`${ano}-12-31`);
            where.dataInicio = {
                gte: startDate,
                lte: endDate,
            };
        }

        if (mes && ano) {
            const startDate = new Date(parseInt(ano), parseInt(mes) - 1, 1);
            const endDate = new Date(parseInt(ano), parseInt(mes), 0);
            where.dataInicio = {
                gte: startDate,
                lte: endDate,
            };
        }

        const items = await prisma.terceirizado.findMany({
            where,
            orderBy: { nome: "asc" }
        });

        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar terceirizados" }, { status: 500 });
    }
}
