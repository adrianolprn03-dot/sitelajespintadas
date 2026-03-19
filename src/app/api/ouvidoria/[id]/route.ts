import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.ouvidoria.findUnique({ where: { id: params.id } });
        if (!item) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
        return NextResponse.json(item);
    } catch {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const updateData: any = { ...body };
        
        if (body.status === "concluido" && body.resposta && !body.respondidoEm) {
            updateData.respondidoEm = new Date();
        }

        if (body.recurso && !body.dataRecurso) {
            updateData.dataRecurso = new Date();
            updateData.status = "em-recurso";
        }

        if (body.status === "encerrado" && body.respostaRecurso && !body.dataRespostaRecurso) {
            updateData.dataRespostaRecurso = new Date();
        }

        const item = await prisma.ouvidoria.update({ 
            where: { id: params.id }, 
            data: updateData 
        });
        return NextResponse.json(item);
    } catch {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.ouvidoria.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
