import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const relatorios = await prisma.relatorioFiscal.findMany({
            orderBy: [{ ano: "desc" }, { periodo: "asc" }],
        });
        return NextResponse.json(relatorios);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar relatórios" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { titulo, tipo, periodo, ano, arquivo } = body;

        if (!titulo || !tipo || !periodo || !ano || !arquivo) {
            return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
        }

        const novoRelatorio = await prisma.relatorioFiscal.create({
            data: {
                titulo,
                tipo,
                periodo,
                ano: parseInt(ano.toString()),
                arquivo,
                dataPublicacao: new Date(),
            },
        });

        return NextResponse.json(novoRelatorio, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar relatório fiscal:", error);
        return NextResponse.json({ error: "Erro ao salvar no banco de dados" }, { status: 500 });
    }
}
