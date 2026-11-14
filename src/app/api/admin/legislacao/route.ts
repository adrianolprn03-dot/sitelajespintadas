export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");
    const ano = searchParams.get("ano");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (tipo) where.tipo = tipo;
    if (ano) where.ano = parseInt(ano);

    const [items, total] = await Promise.all([
        prisma.legislacao.findMany({
            where,
            orderBy: [{ ano: "desc" }, { dataAto: "desc" }, { criadoEm: "desc" }],
            skip,
            take: limit,
        }),
        prisma.legislacao.count({ where }),
    ]);

    return jsonNoStore({ items, total, page, limit });
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    const body = await request.json();
    const { tipo, numero, ano, ementa, arquivo } = body;

    if (!tipo || !numero || !ano || !ementa) {
        return jsonNoStore({ error: "Campos obrigatórios: tipo, numero, ano, ementa" }, { status: 400 });
    }

    const item = await prisma.legislacao.create({
        data: {
            tipo,
            numero,
            ano: parseInt(String(ano), 10),
            ementa,
            arquivo: arquivo || null,
            categoria: body.categoria || null,
            dataAto: body.dataAto ? new Date(body.dataAto) : null,
            documentUrl: body.documentUrl || null,
            arquivoEditavelUrl: body.arquivoEditavelUrl || null,
            situacaoVigencia: body.situacaoVigencia || "vigente",
            atoRelacionado: body.atoRelacionado || null,
            orgaoResponsavel: body.orgaoResponsavel || "Gabinete do Prefeito",
            situacaoPublicacao: body.situacaoPublicacao || "publicado",
            ativo: body.ativo !== undefined ? Boolean(body.ativo) : true,
            dataAtualizacaoEfetiva: new Date(),
        },
    });

    revalidatePaths(REVALIDATE_GROUPS.legislacao);
    return jsonNoStore(item, { status: 201 });
}

