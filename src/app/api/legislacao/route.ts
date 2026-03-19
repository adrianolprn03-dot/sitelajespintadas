import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");
    const ano = searchParams.get("ano");
    const busca = searchParams.get("busca");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = { ativo: true };
    if (tipo) where.tipo = tipo;
    if (ano) where.ano = parseInt(ano);
    if (busca) {
        where.OR = [
            { numero: { contains: busca } },
            { ementa: { contains: busca } }
        ];
    }

    const [items, total] = await Promise.all([
        prisma.legislacao.findMany({
            where,
            orderBy: [{ ano: "desc" }, { criadoEm: "desc" }],
            skip,
            take: limit,
        }),
        prisma.legislacao.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, limit });
}
