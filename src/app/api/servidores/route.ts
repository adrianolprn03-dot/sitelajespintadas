import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ano = searchParams.get("ano");
    const mes = searchParams.get("mes");
    const secretaria = searchParams.get("secretaria");
    const ativo = searchParams.get("ativo");

    const query = searchParams.get("query");
    const vinculo = searchParams.get("vinculo");

    const where: any = {};
    if (ano) where.ano = parseInt(ano);
    if (mes) where.mes = parseInt(mes);
    if (secretaria) where.secretaria = { contains: secretaria, mode: 'insensitive' };
    if (vinculo) where.vinculo = { contains: vinculo, mode: 'insensitive' };
    if (ativo !== null) where.ativo = ativo === "true";
    
    if (query) {
        where.OR = [
            { nome: { contains: query, mode: 'insensitive' } },
            { cargo: { contains: query, mode: 'insensitive' } },
            { cpf: { contains: query, mode: 'insensitive' } },
        ];
    }

    try {
        const [items, total] = await Promise.all([
            prisma.servidor.findMany({ where, orderBy: [{ ano: "desc" }, { mes: "desc" }, { nome: "asc" }] }),
            prisma.servidor.count({ where }),
        ]);
        return NextResponse.json({ items, total });
    } catch {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = {
            ...body,
            salarioBase: parseFloat(body.salarioBase) || 0,
            totalBruto: parseFloat(body.totalBruto) || 0,
            totalLiquido: parseFloat(body.totalLiquido) || 0,
            mes: parseInt(body.mes) || new Date().getMonth() + 1,
            ano: parseInt(body.ano) || new Date().getFullYear(),
        };

        const servidor = await prisma.servidor.create({ data });
        return NextResponse.json(servidor, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar servidor:", error);
        return NextResponse.json({ error: "Erro ao salvar servidor no banco de dados" }, { status: 500 });
    }
}
