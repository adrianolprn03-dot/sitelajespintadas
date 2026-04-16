import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const items = await prisma.servicoCarta.findMany({ orderBy: { categoria: "asc" } });
        return NextResponse.json(items);
    } catch {
        return NextResponse.json({ error: "Erro" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    try {
        const body = await req.json();
        const item = await prisma.servicoCarta.create({ 
            data: {
                ...body,
                ativo: body.ativo ?? true,
                ordem: body.ordem ?? 0
            } 
        });
        return NextResponse.json(item);
    } catch (error) {
        console.error("Erro ao criar serviço:", error);
        return NextResponse.json({ error: "Erro ao criar serviço" }, { status: 500 });
    }
}
