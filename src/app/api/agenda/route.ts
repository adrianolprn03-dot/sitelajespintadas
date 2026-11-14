export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET() {
    try {
        const events = await prisma.evento.findMany({
            orderBy: { dataInicio: "asc" },
        });
        return jsonNoStore(events);
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const event = await prisma.evento.create({
            data: {
                titulo: String(body.titulo || "").trim(),
                descricao: body.descricao || null,
                local: body.local || null,
                dataInicio: new Date(body.dataInicio),
                dataFim: body.dataFim ? new Date(body.dataFim) : null,
                publico: body.publico !== undefined ? Boolean(body.publico) : true,
            },
        });
        revalidatePaths(REVALIDATE_GROUPS.agenda);
        return jsonNoStore(event, { status: 201 });
    } catch (error) {
        console.error("Erro ao agendar evento:", error);
        return jsonNoStore({ error: "Erro ao salvar evento na agenda" }, { status: 500 });
    }
}

