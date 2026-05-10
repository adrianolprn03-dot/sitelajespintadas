export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ano = searchParams.get("ano");

    const where: any = {};
    if (ano) where.ano = parseInt(ano);

    try {
        const items = await prisma.emendaPix.findMany({
            where,
            orderBy: [{ ano: "desc" }, { criadoEm: "desc" }],
        });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

