import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nome, email, assunto, mensagem } = body;

        if (!nome || !email || !assunto || !mensagem) {
            return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
        }

        const contato = await prisma.contato.create({
            data: { nome, email, assunto, mensagem },
        });

        return NextResponse.json({ success: true, id: contato.id }, { status: 201 });
    } catch (error) {
        console.error("Erro ao salvar contato:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const contatos = await prisma.contato.findMany({
            orderBy: { criadoEm: "desc" },
        });
        return NextResponse.json(contatos);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
