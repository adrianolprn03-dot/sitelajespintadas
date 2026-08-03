import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/admin/saude - Listar todos os documentos da gestão da saúde
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoria = searchParams.get("categoria");
        const ano = searchParams.get("ano");

        const where: any = {};
        if (categoria && categoria !== "todos") {
            where.categoria = categoria;
        }
        if (ano) {
            where.anoExercicio = parseInt(ano);
        }

        const documentos = await prisma.documentoSaude.findMany({
            where,
            orderBy: [
                { anoExercicio: "desc" },
                { criadoEm: "desc" }
            ]
        });

        return NextResponse.json(documentos);
    } catch (error) {
        console.error("Erro ao listar documentos da saúde:", error);
        return NextResponse.json({ error: "Erro ao buscar documentos da saúde" }, { status: 500 });
    }
}

// POST /api/admin/saude - Criar novo documento da saúde (PMS, PAS, RAG, RDQA)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { titulo, categoria, anoExercicio, periodoVigencia, statusConselho, numeroResolucao, descricao, linkDocumento, ativo } = body;

        if (!titulo || !categoria || !anoExercicio) {
            return NextResponse.json({ error: "Título, categoria e ano do exercício são obrigatórios" }, { status: 400 });
        }

        const novoDoc = await prisma.documentoSaude.create({
            data: {
                titulo,
                categoria, // "pms", "pas", "rag", "rdqa"
                anoExercicio: parseInt(anoExercicio),
                periodoVigencia: periodoVigencia || null,
                statusConselho: statusConselho || "Aprovado pelo Conselho Municipal de Saúde (CMS)",
                numeroResolucao: numeroResolucao || null,
                descricao: descricao || null,
                linkDocumento: linkDocumento || null,
                ativo: ativo !== undefined ? Boolean(ativo) : true
            }
        });

        return NextResponse.json(novoDoc, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar documento da saúde:", error);
        return NextResponse.json({ error: "Erro ao cadastrar documento da saúde" }, { status: 500 });
    }
}
