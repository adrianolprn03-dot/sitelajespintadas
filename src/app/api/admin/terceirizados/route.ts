import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const items = await prisma.terceirizado.findMany({
            orderBy: { criadoEm: "desc" }
        });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar terceirizados" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const item = await prisma.terceirizado.create({
            data: {
                nome: body.nome,
                empresa: body.empresa,
                funcao: body.funcao,
                unidadeLotacao: body.unidadeLotacao,
                dataInicio: new Date(body.dataInicio),
                dataFim: body.dataFim ? new Date(body.dataFim) : null,
                status: body.status || "ativo"
            }
        });
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar terceirizado" }, { status: 500 });
    }
}
