import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (q.length < 3) return NextResponse.json([]);

    try {
        const [noticias, licitacoes, documentos] = await Promise.all([
            prisma.noticia.findMany({
                where: { OR: [{ titulo: { contains: q } }, { resumo: { contains: q } }] },
                take: 5,
                select: { id: true, titulo: true, slug: true }
            }),
            prisma.licitacao.findMany({
                where: { OR: [{ objeto: { contains: q } }, { numero: { contains: q } }] },
                take: 5,
                select: { id: true, objeto: true, numero: true }
            }),
            prisma.documento.findMany({
                where: { titulo: { contains: q } },
                take: 5,
                select: { id: true, titulo: true, tipo: true }
            })
        ]);

        const results = [
            ...noticias.map(n => ({ type: "Notícia", label: n.titulo, href: `/noticias/${n.slug}` })),
            ...licitacoes.map(l => ({ type: "Licitação", label: `${l.numero} - ${l.objeto}`, href: "/transparencia/licitacoes" })),
            ...documentos.map(d => ({ type: "Documento", label: d.titulo, href: "/transparencia/documentos" }))
        ];

        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
