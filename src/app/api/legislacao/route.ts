import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");
    const ano = searchParams.get("ano");
    const busca = searchParams.get("busca");
    const categoria = searchParams.get("categoria");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = { ativo: true };
    if (tipo) {
        if (tipo.includes(",")) {
            where.tipo = { in: tipo.split(",").map(t => t.trim()) };
        } else {
            where.tipo = tipo;
        }
    }
    if (categoria) where.categoria = categoria;
    if (ano) where.ano = parseInt(ano);
    if (busca) {
        where.OR = [
            { numero: { contains: busca, mode: 'insensitive' } },
            { ementa: { contains: busca, mode: 'insensitive' } }
        ];
    }

    const [items, total] = await Promise.all([
        prisma.legislacao.findMany({
            where,
            orderBy: [{ ano: "desc" }, { numero: "desc" }, { criadoEm: "desc" }],
            skip,
            take: limit,
        }),
        prisma.legislacao.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, limit });
}
