export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get("tipo");
    const ano = searchParams.get("ano");

    const where: any = {};
    if (tipo) {
        if (tipo.includes(",")) {
            where.tipo = { in: tipo.split(",").map(t => t.trim()) };
        } else {
            where.tipo = tipo;
        }
    }
    if (ano) where.ano = parseInt(ano, 10);

    try {
        const items = await prisma.documento.findMany({
            where,
            orderBy: { criadoEm: "desc" },
        });
        return jsonNoStore(items);
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        if (!body.titulo || !body.tipo) {
            return jsonNoStore({ error: "Título e tipo são obrigatórios." }, { status: 400 });
        }

        const data = {
            titulo: String(body.titulo).trim(),
            descricao: body.descricao ? String(body.descricao).trim() : null,
            tipo: String(body.tipo).trim(),
            orgaoResponsavel: body.orgaoResponsavel ? String(body.orgaoResponsavel).trim() : null,
            secretaria: body.secretaria ? String(body.secretaria).trim() : null,
            arquivo: body.arquivo || null,
            documentUrl: body.documentUrl || null,
            arquivoEditavelUrl: body.arquivoEditavelUrl || null,
            ano: body.ano ? parseInt(String(body.ano), 10) : null,
            tamanho: body.tamanho ? parseInt(String(body.tamanho), 10) : null,
            competencia: body.competencia ? String(body.competencia).trim() : null,
            criterioPntp: body.criterioPntp ? String(body.criterioPntp).trim() : null,
            situacaoPublicacao: body.situacaoPublicacao || "publicado",
            ativo: body.ativo !== undefined ? Boolean(body.ativo) : true,
            dataAtualizacaoEfetiva: new Date(),
        };

        const documento = await prisma.documento.create({ data });
        revalidatePaths(REVALIDATE_GROUPS.documentos);
        return jsonNoStore(documento, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar documento:", error);
        return jsonNoStore({ error: "Erro ao salvar documento no banco de dados" }, { status: 500 });
    }
}

