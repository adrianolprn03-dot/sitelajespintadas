export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const quadro = await prisma.quadroServidor.findUnique({
            where: { id: params.id },
        });

        if (!quadro) {
            return NextResponse.json({ error: "Registro não encontrado" }, { status: 404 });
        }

        return NextResponse.json(quadro);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        
        const vagasLei = parseInt(body.vagasLei) || 0;
        const vagasOcupadas = parseInt(body.vagasOcupadas) || 0;

        const data = {
            cargo: body.cargo,
            vinculo: body.vinculo,
            leiCriacao: body.leiCriacao || null,
            vagasLei,
            vagasOcupadas,
            vagasLivres: vagasLei - vagasOcupadas,
            ativo: body.ativo,
        };

        const quadro = await prisma.quadroServidor.update({
            where: { id: params.id },
            data,
        });

        return NextResponse.json(quadro);
    } catch (error) {
        console.error("Erro ao atualizar quadro de servidor:", error);
        return NextResponse.json({ error: "Erro ao atualizar registro" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.quadroServidor.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Registro removido com sucesso" });
    } catch (error) {
        console.error("Erro ao remover quadro de servidor:", error);
        return NextResponse.json({ error: "Erro ao remover registro" }, { status: 500 });
    }
}
