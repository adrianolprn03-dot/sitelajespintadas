export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const tipoConselho = searchParams.get("tipo");
        const ano = searchParams.get("ano");

        const where: Record<string, unknown> = {};
        if (tipoConselho) where.tipoConselho = tipoConselho;
        if (ano) where.ano = parseInt(ano);

        const items = await prisma.transferenciaConselho.findMany({
            where,
            orderBy: [{ ano: "desc" }, { mes: "desc" }],
        });

        // Totais por conselho para os cards
        const totais = await prisma.transferenciaConselho.groupBy({
            by: ["tipoConselho"],
            _sum: { valorRepasse: true },
            _count: { id: true },
            where: { ano: new Date().getFullYear() },
        });

        // Último repasse de cada conselho
        const ultimoSaude = await prisma.transferenciaConselho.findFirst({
            where: { tipoConselho: "saude" },
            orderBy: [{ ano: "desc" }, { mes: "desc" }],
        });
        const ultimoFundeb = await prisma.transferenciaConselho.findFirst({
            where: { tipoConselho: "fundeb" },
            orderBy: [{ ano: "desc" }, { mes: "desc" }],
        });
        const ultimoAssistencia = await prisma.transferenciaConselho.findFirst({
            where: { tipoConselho: "assistencia_social" },
            orderBy: [{ ano: "desc" }, { mes: "desc" }],
        });

        return NextResponse.json({ items, totais, ultimoSaude, ultimoFundeb, ultimoAssistencia });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao buscar transferências" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const item = await prisma.transferenciaConselho.create({ data: body });
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao criar transferência" }, { status: 400 });
    }
}
