import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const items = await prisma.glossario.findMany({
            orderBy: { termo: "asc" }
        });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar termos do glossário" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { termo, definicao } = body;

        const glossario = await prisma.glossario.create({
            data: {
                termo,
                definicao,
            },
        });
        return NextResponse.json(glossario, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar termo no glossário" }, { status: 500 });
    }
}
