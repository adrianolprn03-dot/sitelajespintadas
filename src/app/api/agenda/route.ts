import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const events = await prisma.evento.findMany({
            orderBy: { dataInicio: "asc" },
        });
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = {
            ...body,
            dataInicio: new Date(body.dataInicio),
            dataFim: body.dataFim ? new Date(body.dataFim) : null,
        };

        const event = await prisma.evento.create({ data });
        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error("Erro ao agendar evento:", error);
        return NextResponse.json({ error: "Erro ao salvar evento na agenda" }, { status: 500 });
    }
}
