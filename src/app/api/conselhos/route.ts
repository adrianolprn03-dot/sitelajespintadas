import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const items = await prisma.conselho.findMany({
            orderBy: { nome: "asc" },
            include: { atas: { orderBy: { dataReuniao: "desc" }, take: 5 } }
        });
        return NextResponse.json({ items });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao buscar conselhos" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const item = await prisma.conselho.create({ data: body });
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao criar conselho" }, { status: 400 });
    }
}
