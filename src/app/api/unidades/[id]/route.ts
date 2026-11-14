export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";
import { registrarHistoricoAlteracao } from "@/lib/audit";
import {
    normalizeUnidadeRecord,
    serializeEquipe,
    serializeEspecialidades,
} from "@/lib/unidades";

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const unidade = await prisma.unidadeAtendimento.findUnique({
            where: { id: params.id },
        });
        if (!unidade) {
            return jsonNoStore({ error: "Unidade não encontrada" }, { status: 404 });
        }
        return jsonNoStore(normalizeUnidadeRecord(unidade));
    } catch (error) {
        console.error("Erro ao buscar unidade:", error);
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return jsonNoStore({ error: "Não autorizado" }, { status: 401 });
    }

    try {
        const anterior = await prisma.unidadeAtendimento.findUnique({
            where: { id: params.id },
        });
        if (!anterior) {
            return jsonNoStore({ error: "Unidade não encontrada" }, { status: 404 });
        }

        const body = await req.json();
        const data: Record<string, any> = {};

        if (body.nome !== undefined) data.nome = String(body.nome).trim();
        if (body.tipo !== undefined) data.tipo = String(body.tipo).trim();
        if (body.subtipo !== undefined) data.subtipo = body.subtipo ? String(body.subtipo).trim() : null;
        if (body.cnes !== undefined) data.cnes = body.cnes ? String(body.cnes).trim() : null;
        if (body.descricao !== undefined) data.descricao = String(body.descricao).trim();
        if (body.endereco !== undefined) data.endereco = String(body.endereco).trim();
        if (body.telefone !== undefined) data.telefone = body.telefone ? String(body.telefone).trim() : null;
        if (body.horario !== undefined) data.horario = String(body.horario).trim();
        if (body.servicos !== undefined) data.servicos = body.servicos ? String(body.servicos).trim() : null;
        if (body.especialidades !== undefined) data.especialidades = serializeEspecialidades(body.especialidades);
        if (body.equipe !== undefined) data.equipe = serializeEquipe(body.equipe);
        if (body.mapa !== undefined) data.mapa = body.mapa ? String(body.mapa).trim() : null;
        if (body.ativa !== undefined) data.ativa = Boolean(body.ativa);

        const unidade = await prisma.unidadeAtendimento.update({
            where: { id: params.id },
            data,
        });

        await registrarHistoricoAlteracao({
            entidade: "UnidadeAtendimento",
            entidadeId: unidade.id,
            acao: "edicao",
            resumoAlteracao: `Unidade atualizada: ${unidade.nome} (${unidade.tipo})`,
            dadosAnteriores: anterior,
            dadosNovos: unidade,
            secretaria: unidade.tipo,
        });

        revalidatePaths([...REVALIDATE_GROUPS.unidades, "/transparencia/educacao", "/transparencia/fila-creches", "/transparencia/saude"]);
        return jsonNoStore(normalizeUnidadeRecord(unidade));
    } catch (error) {
        console.error("Erro ao atualizar unidade:", error);
        return jsonNoStore({ error: "Erro ao atualizar unidade" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
    return PUT(req, context);
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return jsonNoStore({ error: "Não autorizado" }, { status: 401 });
    }

    try {
        const anterior = await prisma.unidadeAtendimento.findUnique({
            where: { id: params.id },
        });
        if (!anterior) {
            return jsonNoStore({ error: "Unidade não encontrada" }, { status: 404 });
        }

        await prisma.unidadeAtendimento.delete({
            where: { id: params.id },
        });

        await registrarHistoricoAlteracao({
            entidade: "UnidadeAtendimento",
            entidadeId: params.id,
            acao: "exclusao",
            resumoAlteracao: `Unidade removida: ${anterior.nome} (${anterior.tipo})`,
            dadosAnteriores: anterior,
            secretaria: anterior.tipo,
        });

        revalidatePaths([...REVALIDATE_GROUPS.unidades, "/transparencia/educacao", "/transparencia/fila-creches", "/transparencia/saude"]);
        return jsonNoStore({ success: true });
    } catch (error) {
        console.error("Erro ao excluir unidade:", error);
        return jsonNoStore({ error: "Erro ao excluir unidade" }, { status: 500 });
    }
}
