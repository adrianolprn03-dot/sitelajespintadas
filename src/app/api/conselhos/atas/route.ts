import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const ata = await prisma.conselhoAta.create({ data: body });
        return NextResponse.json(ata, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar ata" }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.conselhoAta.delete({ where: { id: params.id } });
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir ata" }, { status: 400 });
    }
}
