import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const veiculos = await prisma.veiculo.findMany({
            orderBy: { modelo: "asc" }
        });
        return NextResponse.json(veiculos);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar frota" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const veiculo = await prisma.veiculo.create({ data: body });
        return NextResponse.json(veiculo);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao cadastrar veículo" }, { status: 500 });
    }
}
