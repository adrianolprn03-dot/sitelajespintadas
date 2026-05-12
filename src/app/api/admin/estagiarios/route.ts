import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const estagiarios = await prisma.estagiario.findMany({
            orderBy: { criadoEm: "desc" }
        });
        return NextResponse.json(estagiarios);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar estagiários" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const estagiario = await prisma.estagiario.create({
            data: {
                nome: body.nome,
                instituicaoEnsino: body.instituicaoEnsino,
                unidadeLotacao: body.unidadeLotacao,
                dataInicio: new Date(body.dataInicio),
                dataFim: body.dataFim ? new Date(body.dataFim) : null,
                valorBolsa: parseFloat(body.valorBolsa),
                status: body.status || "ativo"
            }
        });
        return NextResponse.json(estagiario);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao criar estagiário" }, { status: 500 });
    }
}
