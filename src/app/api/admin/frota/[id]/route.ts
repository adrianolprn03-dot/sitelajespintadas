import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.veiculo.findUnique({ where: { id: params.id } });
        return NextResponse.json(item);
    } catch {
        return NextResponse.json({ error: "Erro" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const item = await prisma.veiculo.update({
            where: { id: params.id },
            data: body
        });
        return NextResponse.json(item);
    } catch {
        return NextResponse.json({ error: "Erro" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    try {
        await prisma.veiculo.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Erro" }, { status: 500 });
    }
}
