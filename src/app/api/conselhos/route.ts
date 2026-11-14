export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET() {
    try {
        const items = await prisma.conselho.findMany({
            orderBy: { nome: "asc" },
            include: { atas: { orderBy: { dataReuniao: "desc" }, take: 5 } }
        });
        return jsonNoStore({ items });
    } catch (error) {
        console.error(error);
        return jsonNoStore({ error: "Erro ao buscar conselhos" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const item = await prisma.conselho.create({
            data: {
                nome: String(body.nome || "").trim(),
                sigla: body.sigla || null,
                tipo: String(body.tipo || "").trim(),
                descricao: String(body.descricao || "").trim(),
                composicao: String(body.composicao || "").trim(),
                presidente: body.presidente || null,
                email: body.email || null,
                mandatoVigencia: body.mandatoVigencia || null,
                atoNomeacao: body.atoNomeacao || null,
                regimentoInternoUrl: body.regimentoInternoUrl || null,
                calendarioReunioes: body.calendarioReunioes || null,
                situacaoPublicacao: body.situacaoPublicacao || "publicado",
                ativo: body.ativo !== undefined ? Boolean(body.ativo) : true,
            },
        });
        revalidatePaths(REVALIDATE_GROUPS.institucional);
        return jsonNoStore(item, { status: 201 });
    } catch (error) {
        console.error(error);
        return jsonNoStore({ error: "Erro ao criar conselho" }, { status: 400 });
    }
}

