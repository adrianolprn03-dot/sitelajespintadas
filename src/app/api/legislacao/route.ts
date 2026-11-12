export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");
    const ano = searchParams.get("ano");
    const busca = searchParams.get("busca");
    const categoria = searchParams.get("categoria");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 10000);
    const skip = (page - 1) * limit;

    const where: any = { ativo: true };
    if (tipo) {
        const rawList = tipo.includes(",") ? tipo.split(",").map(t => t.trim()) : [tipo.trim()];
        const expandedTipos = new Set<string>();
        for (const t of rawList) {
            expandedTipos.add(t);
            expandedTipos.add(t.toLowerCase());
            expandedTipos.add(t.toUpperCase());
            expandedTipos.add(t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
        }
        where.tipo = { in: Array.from(expandedTipos) };
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
            orderBy: [{ ano: "desc" }, { dataAto: "desc" }, { criadoEm: "desc" }, { id: "desc" }],
            skip,
            take: limit,
        }),
        prisma.legislacao.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, limit });
}

