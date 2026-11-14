import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonNoStore } from "@/lib/revalidate-site";

export const dynamic = "force-dynamic";

// GET /api/transparencia/saude - Endereço público para consulta de documentos do PMS, PAS, RAG e RDQA
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoria = searchParams.get("categoria");
        const ano = searchParams.get("ano");

        const where: Record<string, unknown> = { ativo: true };

        if (categoria && categoria !== "todos") {
            where.categoria = categoria;
        }

        if (ano && ano !== "todos") {
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
        console.error("Erro ao buscar documentos da transparência da saúde:", error);
        return NextResponse.json({ error: "Erro interno ao consultar documentos da saúde" }, { status: 500 });
    }
}
