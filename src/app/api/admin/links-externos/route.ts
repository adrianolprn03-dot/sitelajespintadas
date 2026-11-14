export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

const db = prisma as any;

export async function GET() {
    try {
        const links = await db.linkExterno.findMany({
            orderBy: [{ ordem: "asc" }, { criadoEm: "desc" }],
        });
        return jsonNoStore(links);
    } catch (err) {
        console.error("Erro ao buscar links:", err);
        return jsonNoStore({ error: "Erro ao buscar links" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

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
        revalidatePaths([...REVALIDATE_GROUPS.institucional, "/admin/links-externos"]);
        return jsonNoStore(link, { status: 201 });
    } catch (err) {
        console.error("Erro ao criar link:", err);
        return jsonNoStore({ error: "Erro ao criar link" }, { status: 500 });
    }
}
