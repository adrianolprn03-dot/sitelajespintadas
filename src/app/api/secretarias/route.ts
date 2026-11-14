export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const includeInactive = searchParams.get("all") === "true";
        const secretarias = await prisma.secretaria.findMany({
            where: includeInactive ? undefined : { ativa: true },
            orderBy: { ordem: "asc" },
        });
        return jsonNoStore(secretarias);
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const { nome, descricao, contato, telefone, email, endereco, secretario, imagem, ordem } = body;

        const slug = String(nome || "")
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const secretaria = await prisma.secretaria.create({
            data: {
                nome,
                slug,
                descricao,
                contato,
                telefone,
                email,
                endereco,
                secretario,
                imagem,
                horarioFuncionamento: body.horarioFuncionamento || null,
                normaCriacao: body.normaCriacao || null,
                atoNomeacaoSecretario: body.atoNomeacaoSecretario || null,
                ativa: body.ativa !== undefined ? Boolean(body.ativa) : true,
                ordem: parseInt(String(ordem || 0), 10) || 0,
            },
        });
        revalidatePaths(REVALIDATE_GROUPS.secretarias);
        return jsonNoStore(secretaria, { status: 201 });
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

