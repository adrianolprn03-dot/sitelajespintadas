import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const items = await prisma.obra.findMany({
            orderBy: { criadoEm: "desc" }
        });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar obras" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { titulo, descricao, local, valor, status, dataInicio, previsaoTermino, empresa, percentual, imagem } = body;

        const obra = await prisma.obra.create({
            data: {
                titulo,
                descricao,
                local,
                valor: parseFloat(valor),
                status,
                dataInicio: dataInicio ? new Date(dataInicio) : null,
                previsaoTermino: previsaoTermino ? new Date(previsaoTermino) : null,
                empresa,
                percentual: parseInt(percentual || "0"),
                imagem,
            },
        });
        return NextResponse.json(obra, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar obra" }, { status: 500 });
    }
}
