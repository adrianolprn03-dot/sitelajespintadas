import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const ano = searchParams.get("ano");
        const autor = searchParams.get("autor");
        const tipo = searchParams.get("tipo");
        const funcao = searchParams.get("funcao");
        const situacao = searchParams.get("situacao");
        const busca = searchParams.get("busca");

        const where: any = {};

        if (ano) where.anoEmenda = parseInt(ano);
        if (tipo) where.tipoEmenda = { contains: tipo, mode: "insensitive" };
        if (funcao) where.funcaoGoverno = { contains: funcao, mode: "insensitive" };
        if (situacao) where.situacaoExecucao = { contains: situacao, mode: "insensitive" };
        if (autor) where.autorNome = { contains: autor, mode: "insensitive" };

        if (busca) {
            where.OR = [
                { autorNome: { contains: busca, mode: "insensitive" } },
                { objeto: { contains: busca, mode: "insensitive" } },
                { codigoEmenda: { contains: busca, mode: "insensitive" } },
            ];
        }

        const items = await prisma.emendaParlamentar.findMany({
            where,
            orderBy: [{ anoEmenda: "desc" }, { autorNome: "asc" }],
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao buscar emendas" }, { status: 500 });
    }
}
