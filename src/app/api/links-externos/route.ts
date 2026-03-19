import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const categoria = searchParams.get("categoria");

        const links = await db.linkExterno.findMany({
            where: {
                ativo: true,
                ...(categoria ? { categoria } : {}),
            },
            orderBy: [{ ordem: "asc" }, { criadoEm: "desc" }],
        });
        return NextResponse.json(links);
    } catch (err) {
        console.error("Erro ao buscar links externos:", err);
        return NextResponse.json({ error: "Erro ao buscar links" }, { status: 500 });
    }
}
