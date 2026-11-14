export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.conselho.findUnique({
            where: { id: params.id },
            include: { atas: { orderBy: { dataReuniao: "desc" } } }
        });
        if (!item) return jsonNoStore({ error: "Não encontrado" }, { status: 404 });
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const { atas } = body;

        const data: any = {};
        if (body.nome !== undefined) data.nome = String(body.nome).trim();
        if (body.sigla !== undefined) data.sigla = body.sigla || null;
        if (body.tipo !== undefined) data.tipo = String(body.tipo).trim();
        if (body.descricao !== undefined) data.descricao = String(body.descricao).trim();
        if (body.composicao !== undefined) data.composicao = String(body.composicao).trim();
        if (body.presidente !== undefined) data.presidente = body.presidente || null;
        if (body.email !== undefined) data.email = body.email || null;
        if (body.mandatoVigencia !== undefined) data.mandatoVigencia = body.mandatoVigencia || null;
        if (body.atoNomeacao !== undefined) data.atoNomeacao = body.atoNomeacao || null;
        if (body.regimentoInternoUrl !== undefined) data.regimentoInternoUrl = body.regimentoInternoUrl || null;
        if (body.calendarioReunioes !== undefined) data.calendarioReunioes = body.calendarioReunioes || null;
        if (body.situacaoPublicacao !== undefined) data.situacaoPublicacao = body.situacaoPublicacao;
        if (body.ativo !== undefined) data.ativo = Boolean(body.ativo);

        if (Array.isArray(atas)) {
            data.atas = {
                deleteMany: {},
                create: atas.map((ata: any) => ({
                    titulo: ata.titulo,
                    dataReuniao: new Date(ata.dataReuniao),
                    arquivo: ata.arquivo || null,
                })),
            };
        }

        const item = await prisma.conselho.update({
            where: { id: params.id },
            data,
            include: { atas: true }
        });
        revalidatePaths(REVALIDATE_GROUPS.institucional);
        return jsonNoStore(item);
    } catch (error) {
        console.error("Erro na atualização:", error);
        return jsonNoStore({ error: "Erro ao atualizar conselho" }, { status: 400 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        await prisma.conselho.delete({ where: { id: params.id } });
        revalidatePaths(REVALIDATE_GROUPS.institucional);
        return jsonNoStore({ ok: true });
    } catch {
        return jsonNoStore({ error: "Erro ao excluir" }, { status: 400 });
    }
}
