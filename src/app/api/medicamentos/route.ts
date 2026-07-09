export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || searchParams.get("search");
    const status = searchParams.get("status");
    const categoria = searchParams.get("categoria");

    const where: any = {
        ativo: true // Apenas medicamentos ativos na listagem pública
    };
    
    if (status) {
        where.status = { equals: status };
    }
    
    if (categoria) {
        where.categoria = { equals: categoria, mode: 'insensitive' };
    }
    
    if (query) {
        where.OR = [
            { nome: { contains: query, mode: 'insensitive' } },
            { categoria: { contains: query, mode: 'insensitive' } },
            { observacao: { contains: query, mode: 'insensitive' } },
        ];
    }

    try {
        const items = await prisma.medicamento.findMany({
            where,
            orderBy: { nome: "asc" },
        });
        
        return NextResponse.json({ 
            items,
            total: items.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Erro ao buscar medicamentos:", error);
        return NextResponse.json({ error: "Erro interno ao buscar medicamentos" }, { status: 500 });
    }
}
