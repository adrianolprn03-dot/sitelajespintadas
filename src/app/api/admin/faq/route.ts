import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const items = await prisma.fAQ.findMany({
            orderBy: { ordem: "asc" }
        });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar FAQs" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { pergunta, resposta, categoria, ordem } = body;

        const faq = await prisma.fAQ.create({
            data: {
                pergunta,
                resposta,
                categoria,
                ordem: parseInt(ordem || "0"),
            },
        });
        return NextResponse.json(faq, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar FAQ" }, { status: 500 });
    }
}
