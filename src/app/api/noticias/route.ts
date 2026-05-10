export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const publicada = searchParams.get("publicada");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    try {
        const where: any = {};
        if (publicada !== null) {
            where.publicada = publicada === "true";
        }

        const [items, total] = await Promise.all([
            prisma.noticia.findMany({
                where,
                orderBy: [
                    { publicadoEm: "desc" },
                    { criadoEm: "desc" }
                ],
                take: limit,
                skip,
                include: { secretaria: { select: { nome: true, slug: true } } },
            }),
            prisma.noticia.count({ where }),
        ]);
        return NextResponse.json({ items, total, page, limit });
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { titulo, resumo, conteudo, imagem, publicada, secretariaId } = body;

        const slug = titulo
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const noticia = await prisma.noticia.create({
            data: {
                titulo,
                resumo,
                conteudo,
                imagem,
                publicada: !!publicada,
                publicadoEm: publicada ? new Date() : null,
                secretariaId: secretariaId || null,
                slug: `${slug}-${Date.now()}`,
            },
        });
        return NextResponse.json(noticia, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar notícia:", error);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}

