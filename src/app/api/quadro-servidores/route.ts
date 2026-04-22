import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const vinculo = searchParams.get("vinculo");
    const ativo = searchParams.get("ativo");

    const where: any = {};
    if (vinculo) where.vinculo = { contains: vinculo, mode: 'insensitive' };
    if (ativo === "true" || ativo === "false") where.ativo = ativo === "true";
    
    if (query) {
        where.OR = [
            { cargo: { contains: query, mode: 'insensitive' } },
            { leiCriacao: { contains: query, mode: 'insensitive' } },
        ];
    }

    try {
        const [items, total] = await Promise.all([
            prisma.quadroServidor.findMany({ where, orderBy: [{ cargo: "asc" }] }),
            prisma.quadroServidor.count({ where }),
        ]);
        return NextResponse.json({ items, total });
    } catch {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const vagasLei = parseInt(body.vagasLei) || 0;
        const vagasOcupadas = parseInt(body.vagasOcupadas) || 0;
        
        const data = {
            cargo: body.cargo,
            vinculo: body.vinculo,
            leiCriacao: body.leiCriacao || null,
            vagasLei,
            vagasOcupadas,
            vagasLivres: vagasLei - vagasOcupadas,
            ativo: body.ativo !== undefined ? body.ativo : true,
        };

        const quadro = await prisma.quadroServidor.create({ data });
        return NextResponse.json(quadro, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar quadro de servidor:", error);
        return NextResponse.json({ error: "Erro ao salvar quadro de servidor" }, { status: 500 });
    }
}
