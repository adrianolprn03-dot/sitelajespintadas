import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orgao, pedido, nome, email, formaRetorno } = body;

        if (!orgao || !pedido) {
            return NextResponse.json({ error: "Órgão e pedido são obrigatórios." }, { status: 400 });
        }

        const prazo = new Date();
        prazo.setDate(prazo.getDate() + 20); // 20 dias corridos

        const esic = await prisma.esic.create({
            data: { 
                orgao, 
                pedido, 
                nome: nome || null, 
                email: email || null,
                formaRetorno: formaRetorno || "sistema",
                prazo
            },
        });

        return NextResponse.json({ success: true, protocolo: esic.protocolo }, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar pedido e-SIC:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const where = status ? { status } : {};

    try {
        const items = await prisma.esic.findMany({ 
            where, 
            orderBy: { criadoEm: "desc" } 
        });
        return NextResponse.json(items);
    } catch (error) {
        console.error("Erro ao listar pedidos e-SIC:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
