export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { servicoId, nota, comentario } = body;

        if (!servicoId || !nota) {
            return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
        }

        const avaliacao = await prisma.avaliacaoServico.create({
            data: {
                servicoId,
                nota: Number(nota),
                comentario: comentario || ""
            }
        });

        return NextResponse.json(avaliacao);
    } catch (error) {
        console.error("Erro ao registrar avaliação:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function GET() {
    // Rota para o admin listar as avaliações (pode ser protegida ou movida para /api/admin)
    // Para simplificar, vou permitir o GET aqui, mas em produção deveria haver auth
    try {
        const avaliacoes = await prisma.avaliacaoServico.findMany({
            include: {
                servico: {
                    select: { nome: true }
                }
            },
            orderBy: { respondidoEm: "desc" }
        });
        return NextResponse.json(avaliacoes);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao carregar avaliações" }, { status: 500 });
    }
}

