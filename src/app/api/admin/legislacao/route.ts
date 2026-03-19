import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");
    const ano = searchParams.get("ano");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (tipo) where.tipo = tipo;
    if (ano) where.ano = parseInt(ano);

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

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { tipo, numero, ano, ementa, arquivo } = body;

    if (!tipo || !numero || !ano || !ementa) {
        return NextResponse.json({ error: "Campos obrigatórios: tipo, numero, ano, ementa" }, { status: 400 });
    }

    const item = await prisma.legislacao.create({
        data: {
            tipo,
            numero,
            ano: parseInt(ano),
            ementa,
            arquivo: arquivo || null,
        },
    });

    return NextResponse.json(item, { status: 201 });
}
