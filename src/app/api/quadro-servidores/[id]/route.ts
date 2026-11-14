export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const quadro = await prisma.quadroServidor.findUnique({
            where: { id: params.id },
        });

        if (!quadro) {
            return jsonNoStore({ error: "Registro não encontrado" }, { status: 404 });
        }

        return jsonNoStore(quadro);
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();

        const vagasLei = parseInt(body.vagasLei) || 0;
        const vagasOcupadas = parseInt(body.vagasOcupadas) || 0;

        const data = {
            cargo: body.cargo,
            vinculo: body.vinculo,
            leiCriacao: body.leiCriacao || null,
            vagasLei,
            vagasOcupadas,
            vagasLivres: vagasLei - vagasOcupadas,
            ativo: body.ativo,
        };

        const quadro = await prisma.quadroServidor.update({
            where: { id: params.id },
            data,
        });

        revalidatePaths(REVALIDATE_GROUPS.pessoal);
        return jsonNoStore(quadro);
    } catch (error) {
        console.error("Erro ao atualizar quadro de servidor:", error);
        return jsonNoStore({ error: "Erro ao atualizar registro" }, { status: 500 });
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        await prisma.quadroServidor.delete({
            where: { id: params.id },
        });

        revalidatePaths(REVALIDATE_GROUPS.pessoal);
        return jsonNoStore({ message: "Registro removido com sucesso" });
    } catch (error) {
        console.error("Erro ao remover quadro de servidor:", error);
        return jsonNoStore({ error: "Erro ao remover registro" }, { status: 500 });
    }
}
