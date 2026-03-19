import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get("tipo");
    const ano = searchParams.get("ano");

    const where: any = {};
    if (tipo) where.tipo = tipo;
    if (ano) where.ano = parseInt(ano);

    try {
        const items = await prisma.documento.findMany({
            where,
            orderBy: { criadoEm: "desc" },
        });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = {
            ...body,
            ano: body.ano ? parseInt(body.ano) : null,
            tamanho: body.tamanho ? parseInt(body.tamanho) : null,
        };

        const documento = await prisma.documento.create({ data });
        return NextResponse.json(documento, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar documento:", error);
        return NextResponse.json({ error: "Erro ao salvar documento no banco de dados" }, { status: 500 });
    }
}
