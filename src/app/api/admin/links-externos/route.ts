import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

export async function GET() {
    try {
        const links = await db.linkExterno.findMany({
            orderBy: [{ ordem: "asc" }, { criadoEm: "desc" }],
        });
        return NextResponse.json(links);
    } catch (err) {
        console.error("Erro ao buscar links:", err);
        return NextResponse.json({ error: "Erro ao buscar links" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const link = await db.linkExterno.create({
            data: {
                titulo: body.titulo,
                url: body.url,
                descricao: body.descricao || null,
                categoria: body.categoria,
                icone: body.icone || "FaLink",
                ativo: body.ativo ?? true,
                ordem: body.ordem ?? 0,
                moduloAlvo: body.moduloAlvo || null,
            },
        });
        return NextResponse.json(link, { status: 201 });
    } catch (err) {
        console.error("Erro ao criar link:", err);
        return NextResponse.json({ error: "Erro ao criar link" }, { status: 500 });
    }
}
