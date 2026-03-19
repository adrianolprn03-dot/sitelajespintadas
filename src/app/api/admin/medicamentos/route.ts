import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const medicamentos = await prisma.medicamento.findMany({
            orderBy: { nome: "asc" }
        });
        return NextResponse.json(medicamentos);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar medicamentos" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const med = await prisma.medicamento.create({ data: body });
        return NextResponse.json(med);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar medicamento" }, { status: 500 });
    }
}
