import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const items = await prisma.contato.findMany({
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
        const item = await prisma.contato.create({
            data: body,
        });
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
