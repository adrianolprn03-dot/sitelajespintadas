import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const tipo = searchParams.get("tipo");

        const where = tipo ? { tipo } : {};

        const relatorios = await prisma.relatorioFiscal.findMany({
            where,
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

        revalidatePath("/transparencia/lrf");
        revalidatePath("/admin/relatorios-fiscais");

        return NextResponse.json(novoRelatorio, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar relatório fiscal:", error);
        return NextResponse.json({ error: "Erro ao salvar no banco de dados" }, { status: 500 });
    }
}
