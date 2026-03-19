import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const protocolo = searchParams.get("protocolo");

    if (!protocolo) {
        return NextResponse.json({ error: "Protocolo é obrigatório." }, { status: 400 });
    }

    try {
        // Busca na Ouvidoria
        const ouvidoria = await prisma.ouvidoria.findUnique({
            where: { protocolo }
        });

        if (ouvidoria) {
            return NextResponse.json({ tipoBusca: "ouvidoria", data: ouvidoria });
        }

        // Busca no e-SIC
        const esic = await prisma.esic.findUnique({
            where: { protocolo }
        });

        if (esic) {
            return NextResponse.json({ tipoBusca: "esic", data: esic });
        }

        return NextResponse.json({ error: "Protocolo não encontrado." }, { status: 404 });
    } catch {
        return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
    }
}
