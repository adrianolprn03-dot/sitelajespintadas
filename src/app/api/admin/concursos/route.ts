import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const items = await prisma.concurso.findMany({ orderBy: { dataPublicacao: "desc" } });
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
        const item = await prisma.concurso.create({ data: body });
        return NextResponse.json(item);
    } catch {
        return NextResponse.json({ error: "Erro" }, { status: 500 });
    }
}
