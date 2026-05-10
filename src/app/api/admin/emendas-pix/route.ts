export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const items = await prisma.emendaPix.findMany({
            orderBy: [{ ano: "desc" }, { criadoEm: "desc" }],
        });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar emendas" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = {
            ...body,
            ano: parseInt(body.ano),
            valorPrevisto: parseFloat(body.valorPrevisto || 0),
            valorRecebido: parseFloat(body.valorRecebido || 0),
            valorExecutado: parseFloat(body.valorExecutado || 0),
            dataRecebimento: body.dataRecebimento ? new Date(body.dataRecebimento) : null,
            prazoExecucao: body.prazoExecucao ? new Date(body.prazoExecucao) : null,
        };

        const item = await prisma.emendaPix.create({ data });
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar emenda PIX:", error);
        return NextResponse.json({ error: "Erro ao salvar emenda" }, { status: 500 });
    }
}

