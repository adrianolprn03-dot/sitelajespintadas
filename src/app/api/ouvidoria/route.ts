import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { tipo, assunto, descricao, nome, email, anonimo } = body;

        if (!tipo || !assunto || !descricao) {
            return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
        }

        const prazo = new Date();
        prazo.setDate(prazo.getDate() + 30); // 30 dias corridos

        const ouvidoria = await prisma.ouvidoria.create({
            data: { 
                tipo, 
                assunto, 
                descricao, 
                nome: anonimo ? null : nome, 
                email: anonimo ? null : email, 
                anonimo: anonimo || false,
                prazo 
            },
        });

        return NextResponse.json({ success: true, protocolo: ouvidoria.protocolo }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const where = status ? { status } : {};

    try {
        const items = await prisma.ouvidoria.findMany({ where, orderBy: { criadoEm: "desc" } });
        return NextResponse.json(items);
    } catch {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
