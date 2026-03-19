import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.despesa.findUnique({ where: { id: params.id } });
        if (!item) return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
        return NextResponse.json(item);
    } catch {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const item = await prisma.despesa.update({ where: { id: params.id }, data: body });
        return NextResponse.json(item);
    } catch {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.despesa.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
