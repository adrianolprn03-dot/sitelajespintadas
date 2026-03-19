import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { protocolo, recurso, tipoBusca } = body;

        if (!protocolo || !recurso || !tipoBusca) {
            return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
        }

        if (tipoBusca === "ouvidoria") {
            const result = await prisma.ouvidoria.update({
                where: { protocolo },
                data: {
                    recurso,
                    dataRecurso: new Date(),
                    status: "em-recurso"
                }
            });
            return NextResponse.json({ success: true, data: result });
        } else if (tipoBusca === "esic") {
            const result = await prisma.esic.update({
                where: { protocolo },
                data: {
                    recurso,
                    dataRecurso: new Date(),
                    status: "em-recurso"
                }
            });
            return NextResponse.json({ success: true, data: result });
        } else {
            return NextResponse.json({ error: "Tipo de busca inválido." }, { status: 400 });
        }
    } catch (error) {
        console.error("Erro ao registrar recurso:", error);
        return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
    }
}
