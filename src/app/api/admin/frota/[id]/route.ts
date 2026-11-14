export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.veiculo.findUnique({ where: { id: params.id } });
        if (!item) return jsonNoStore({ error: "Não encontrado" }, { status: 404 });
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const data: any = {};
        if (body.modelo !== undefined) data.modelo = String(body.modelo).trim();
        if (body.placa !== undefined) data.placa = String(body.placa).trim().toUpperCase();
        if (body.ano !== undefined) data.ano = body.ano ? String(body.ano).trim() : null;
        if (body.secretaria !== undefined) data.secretaria = String(body.secretaria).trim();
        if (body.tipo !== undefined) data.tipo = String(body.tipo).trim();
        if (body.status !== undefined) data.status = String(body.status);
        if (body.ativo !== undefined) data.ativo = Boolean(body.ativo);

        const item = await prisma.veiculo.update({
            where: { id: params.id },
            data,
        });
        revalidatePaths(REVALIDATE_GROUPS.institucional);
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        await prisma.veiculo.delete({ where: { id: params.id } });
        revalidatePaths(REVALIDATE_GROUPS.institucional);
        return jsonNoStore({ success: true });
    } catch {
        return jsonNoStore({ error: "Erro" }, { status: 500 });
    }
}
