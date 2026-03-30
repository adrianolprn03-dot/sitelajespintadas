import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const sigilo = searchParams.get("sigilo");
    const ano = searchParams.get("ano");
    const mes = searchParams.get("mes");

    let where: any = {};

    if (status) where.status = status;
    if (sigilo) where.grauSigilo = sigilo;
    
    if (ano) {
        const year = parseInt(ano);
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);
        
        if (mes) {
            const m = parseInt(mes);
            startDate.setMonth(m - 1);
            endDate.setMonth(m - 1);
            endDate.setDate(new Date(year, m, 0).getDate());
        }
        
        where.criadoEm = {
            gte: startDate,
            lte: endDate,
        };
    }

    try {
        const items = await prisma.esic.findMany({
            where,
            orderBy: { criadoEm: 'desc' },
        });

        return NextResponse.json({ items });
    } catch (error) {
        console.error("Erro ao buscar pedidos e-SIC:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
