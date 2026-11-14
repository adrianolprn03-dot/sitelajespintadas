export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonNoStore } from "@/lib/revalidate-site";

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
        return jsonNoStore(links);
    } catch (err) {
        console.error("Erro ao buscar links externos:", err);
        return jsonNoStore({ error: "Erro ao buscar links" }, { status: 500 });
    }
}
