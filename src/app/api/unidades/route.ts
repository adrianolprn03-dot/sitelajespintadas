import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const tipo = searchParams.get("tipo");
        const limitStr = searchParams.get("limit");
        
        let where: any = {};
        
        if (tipo) {
            where.tipo = tipo;
        }

        where.ativa = true;

        const unidades = await prisma.unidadeAtendimento.findMany({
            where,
            orderBy: {
                nome: 'asc'
            },
            ...(limitStr ? { take: parseInt(limitStr) } : {})
        });

        return NextResponse.json(unidades);
    } catch (error) {
        console.error("Erro ao buscar unidades:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        const unidade = await prisma.unidadeAtendimento.create({
            data: {
                nome: data.nome,
                tipo: data.tipo,
                descricao: data.descricao,
                endereco: data.endereco,
                telefone: data.telefone || null,
                horario: data.horario,
                mapa: data.mapa || null,
                ativa: data.ativa !== undefined ? data.ativa : true,
            }
        });

        return NextResponse.json(unidade, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar unidade de atendimento:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
