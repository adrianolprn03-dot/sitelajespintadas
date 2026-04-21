import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, context: { params: any }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Privado" }, { status: 401 });
    try {
        const params = await context.params;
        const body = await req.json();
        const { vagas, dataPublicacao, ...rest } = body;
        
        const updateData: any = { ...rest };
        if (vagas !== undefined) updateData.vagas = String(vagas);
        if (dataPublicacao) updateData.dataPublicacao = new Date(dataPublicacao);

        const item = await prisma.concurso.update({ 
            where: { id: params.id }, 
            data: updateData 
        });
        return NextResponse.json(item);
    } catch (error) { 
        console.error("Erro ao atualizar:", error);
        return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 }); 
    }
}

export async function DELETE(req: Request, context: { params: any }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Privado" }, { status: 401 });
    try {
        const params = await context.params;
        await prisma.concurso.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error) { 
        console.error("Erro ao deletar concurso:", error);
        return NextResponse.json({ error: "Erro" }, { status: 500 }); 
    }
}
