import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await req.json();
        const data = await db.linkExterno.update({
            where: { id },
            data: {
                titulo: body.titulo,
                url: body.url,
                descricao: body.descricao,
                categoria: body.categoria,
                icone: body.icone,
                ativo: body.ativo,
                ordem: body.ordem,
                moduloAlvo: body.moduloAlvo,
            },
        });
        return NextResponse.json(data);
    } catch (err) {
        console.error("Erro ao atualizar link:", err);
        return NextResponse.json({ error: "Erro ao atualizar link" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await db.linkExterno.delete({ where: { id: params.id } });
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Erro ao excluir link:", err);
        return NextResponse.json({ error: "Erro ao excluir link" }, { status: 500 });
    }
}
