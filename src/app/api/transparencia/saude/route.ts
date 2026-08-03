import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/transparencia/saude - Endereço público para consulta de documentos do PMS, PAS, RAG e RDQA
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoria = searchParams.get("categoria");
        const ano = searchParams.get("ano");

        const where: any = { ativo: true };

        if (categoria && categoria !== "todos") {
            where.categoria = categoria;
        }

        if (ano && ano !== "todos") {
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
        console.error("Erro ao buscar documentos da transparência da saúde:", error);
        return NextResponse.json({ error: "Erro interno ao consultar documentos da saúde" }, { status: 500 });
    }
}
