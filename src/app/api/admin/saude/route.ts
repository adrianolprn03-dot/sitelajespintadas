import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export const dynamic = "force-dynamic";

// GET /api/admin/saude - Listar todos os documentos da gestão da saúde
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoria = searchParams.get("categoria");
        const ano = searchParams.get("ano");

        const where: Record<string, unknown> = {};
        if (categoria && categoria !== "todos") {
            where.categoria = categoria;
        }
        if (ano) {
            const parsedAno = parseInt(ano, 10);
            if (!Number.isNaN(parsedAno)) where.anoExercicio = parsedAno;
        }

        const documentos = await prisma.documentoSaude.findMany({
            where,
            orderBy: [
                { anoExercicio: "desc" },
                { criadoEm: "desc" }
            ]
        });

        return jsonNoStore(documentos);
    } catch (error) {
        console.error("Erro ao listar documentos da saúde:", error);
        return NextResponse.json({ error: "Erro ao buscar documentos da saúde" }, { status: 500 });
    }
}

// POST /api/admin/saude - Criar novo documento da saúde (PMS, PAS, RAG, RDQA)
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { titulo, categoria, anoExercicio, periodoVigencia, statusConselho, numeroResolucao, descricao, linkDocumento, ativo } = body;

        if (!titulo || !categoria || !anoExercicio) {
            return NextResponse.json({ error: "Título, categoria e ano do exercício são obrigatórios" }, { status: 400 });
        }

        const novoDoc = await prisma.documentoSaude.create({
            data: {
                titulo: String(titulo).trim(),
                categoria: String(categoria).trim(),
                anoExercicio: parseInt(String(anoExercicio), 10),
                periodoVigencia: periodoVigencia || null,
                statusConselho: statusConselho || "Aprovado pelo Conselho Municipal de Saúde (CMS)",
                numeroResolucao: numeroResolucao || null,
                descricao: descricao || null,
                linkDocumento: linkDocumento || null,
                ativo: ativo !== undefined ? Boolean(ativo) : true
            }
        });

        revalidatePaths(REVALIDATE_GROUPS.saudeDocumentos);
        return NextResponse.json(novoDoc, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar documento da saúde:", error);
        return NextResponse.json({ error: "Erro ao cadastrar documento da saúde" }, { status: 500 });
    }
}
