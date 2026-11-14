export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const ata = await prisma.conselhoAta.create({
            data: {
                conselhoId: String(body.conselhoId),
                titulo: String(body.titulo || "").trim(),
                dataReuniao: new Date(body.dataReuniao),
                arquivo: body.arquivo || null,
            },
        });
        revalidatePaths(REVALIDATE_GROUPS.institucional);
        return jsonNoStore(ata, { status: 201 });
    } catch {
        return jsonNoStore({ error: "Erro ao criar ata" }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const id = new URL(req.url).searchParams.get("id");
        if (!id) return jsonNoStore({ error: "ID é obrigatório" }, { status: 400 });
        await prisma.conselhoAta.delete({ where: { id } });
        revalidatePaths(REVALIDATE_GROUPS.institucional);
        return jsonNoStore({ ok: true });
    } catch {
        return jsonNoStore({ error: "Erro ao excluir ata" }, { status: 400 });
    }
}

