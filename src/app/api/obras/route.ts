import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const status = searchParams.get("status");

    const where: any = {};
    
    if (status) where.status = { equals: status };
    
    if (query) {
        where.OR = [
            { titulo: { contains: query, mode: 'insensitive' } },
            { descricao: { contains: query, mode: 'insensitive' } },
            { local: { contains: query, mode: 'insensitive' } },
            { empresa: { contains: query, mode: 'insensitive' } },
        ];
    }

    try {
        const items = await prisma.obra.findMany({
            where,
            orderBy: { criadoEm: "desc" },
        });
        return NextResponse.json({ items });
    } catch (error) {
        console.error("Erro ao buscar obras:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
