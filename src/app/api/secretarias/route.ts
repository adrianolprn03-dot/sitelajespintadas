import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const secretarias = await prisma.secretaria.findMany({
            where: { ativa: true },
            orderBy: { ordem: "asc" },
        });
        return NextResponse.json(secretarias);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nome, descricao, contato, telefone, email, endereco, secretario, imagem, ordem } = body;

        const slug = nome
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const secretaria = await prisma.secretaria.create({
            data: {
                nome,
                slug,
                descricao,
                contato,
                telefone,
                email,
                endereco,
                secretario,
                imagem,
                ordem: ordem || 0,
            },
        });
        return NextResponse.json(secretaria, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
