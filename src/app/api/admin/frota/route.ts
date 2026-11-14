export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET() {
    try {
        const veiculos = await prisma.veiculo.findMany({
            orderBy: { modelo: "asc" }
        });
        return jsonNoStore(veiculos);
    } catch {
        return jsonNoStore({ error: "Erro ao buscar frota" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const veiculo = await prisma.veiculo.create({
            data: {
                modelo: String(body.modelo || "").trim(),
                placa: String(body.placa || "").trim().toUpperCase(),
                ano: body.ano ? String(body.ano).trim() : null,
                secretaria: String(body.secretaria || "").trim(),
                tipo: String(body.tipo || "").trim(),
                status: body.status ? String(body.status) : "em-uso",
                ativo: body.ativo !== undefined ? Boolean(body.ativo) : true,
            },
        });
        revalidatePaths(REVALIDATE_GROUPS.institucional);
        return jsonNoStore(veiculo);
    } catch {
        return jsonNoStore({ error: "Erro ao cadastrar veículo" }, { status: 500 });
    }
}

