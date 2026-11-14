export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const publicada = searchParams.get("publicada");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const q = searchParams.get("q");
    const secretariaId = searchParams.get("secretariaId");
    const secretariaSlug = searchParams.get("secretariaSlug");
    const skip = (page - 1) * limit;

    try {
        const where: any = {};
        if (publicada !== null) {
            where.publicada = publicada === "true";
        }

        if (secretariaId) {
            where.secretariaId = secretariaId;
        } else if (secretariaSlug) {
            where.secretaria = { slug: secretariaSlug };
        }

        if (q && q.trim()) {
            const searchTerm = q.trim();
            where.OR = [
                { titulo: { contains: searchTerm, mode: "insensitive" } },
                { resumo: { contains: searchTerm, mode: "insensitive" } },
                { conteudo: { contains: searchTerm, mode: "insensitive" } },
            ];
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
                include: { secretaria: { select: { id: true, nome: true, slug: true } } },
            }),
            prisma.noticia.count({ where }),
        ]);
        return jsonNoStore({ items, total, page, limit });
    } catch (error) {
        console.error("Erro ao buscar notícias:", error);
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

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
                destaque: Boolean(body.destaque),
                tags: typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags || []),
                publicadoEm: publicada ? new Date() : null,
                secretariaId: secretariaId || null,
                slug: `${slug}-${Date.now()}`,
            },
        });
        revalidatePaths(REVALIDATE_GROUPS.noticias);
        return jsonNoStore(noticia, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar notícia:", error);
        return jsonNoStore({ error: "Erro interno no servidor" }, { status: 500 });
    }
}

