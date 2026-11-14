export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonNoStore } from "@/lib/revalidate-site";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || searchParams.get("search");
    const status = searchParams.get("status");
    const categoria = searchParams.get("categoria");
    const componente = searchParams.get("tipoComponente") || searchParams.get("componente");

    const where: Record<string, unknown> = {
        ativo: true,
    };

    if (status && status !== "todos") {
        where.status = { equals: status };
    }

    if (categoria && categoria !== "todos") {
        where.categoria = { equals: categoria, mode: "insensitive" };
    }

    if (componente && componente !== "todos") {
        where.tipoComponente = { equals: componente, mode: "insensitive" };
    }

    if (query) {
        where.OR = [
            { nome: { contains: query, mode: "insensitive" } },
            { principioAtivo: { contains: query, mode: "insensitive" } },
            { categoria: { contains: query, mode: "insensitive" } },
            { observacao: { contains: query, mode: "insensitive" } },
            { unidadeSaude: { contains: query, mode: "insensitive" } },
        ];
    }

    try {
        const items = await prisma.medicamento.findMany({
            where,
            orderBy: { nome: "asc" },
        });

        return jsonNoStore({
            items,
            total: items.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Erro ao buscar medicamentos:", error);
        return NextResponse.json({ error: "Erro interno ao buscar medicamentos" }, { status: 500 });
    }
}
