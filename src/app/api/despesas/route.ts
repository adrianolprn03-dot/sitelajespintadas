import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ano = searchParams.get("ano");
    const mes = searchParams.get("mes");
    const secretaria = searchParams.get("secretaria");
    const query = searchParams.get("query");
    const categoria = searchParams.get("categoria");
    const pagina = parseInt(searchParams.get("pagina") || "1");
    const agrupar = searchParams.get("agrupar"); // "secretaria" | "categoria" | "mes"

    const where: any = {};
    if (ano) where.ano = parseInt(ano);
    if (mes) where.mes = parseInt(mes);
    if (secretaria) where.secretaria = { contains: secretaria, mode: "insensitive" };
    if (categoria) where.categoria = { contains: categoria, mode: "insensitive" };

    if (query) {
        where.OR = [
            { descricao: { contains: query, mode: "insensitive" } },
            { fornecedor: { contains: query, mode: "insensitive" } },
            { categoria: { contains: query, mode: "insensitive" } },
        ];
    }

    try {
        // ── Modo agrupado: retorna totais por dimensão (para gráficos)
        if (agrupar) {
            const groupField = ["secretaria", "categoria", "mes"].includes(agrupar) ? agrupar : "categoria";

            const grouped = await (prisma as any).despesa.groupBy({
                by: [groupField],
                where,
                _sum: { valor: true },
                _count: { _all: true },
                orderBy: { _sum: { valor: "desc" } },
                take: 20,
            });

            const totalGeral = await prisma.despesa.aggregate({ where, _sum: { valor: true } });

            return NextResponse.json({
                agrupamento: groupField,
                dados: grouped.map((g: any) => ({
                    chave: g[groupField],
                    total: g._sum.valor ?? 0,
                    quantidade: g._count._all,
                })),
                totalGeral: totalGeral._sum.valor ?? 0,
            });
        }

        // ── Modo paginado padrão
        const skip = (pagina - 1) * PAGE_SIZE;

        const [items, total] = await Promise.all([
            prisma.despesa.findMany({
                where,
                orderBy: [{ ano: "desc" }, { mes: "desc" }, { valor: "desc" }],
                skip,
                take: PAGE_SIZE,
            }),
            prisma.despesa.count({ where }),
        ]);

        const totalValor = await prisma.despesa.aggregate({ where, _sum: { valor: true } });

        return NextResponse.json({
            items,
            total,
            totalValor: totalValor._sum.valor ?? 0,
            pagina,
            totalPaginas: Math.ceil(total / PAGE_SIZE),
        });
    } catch (error) {
        console.error("Erro ao buscar despesas:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const required = ["descricao", "categoria", "secretaria", "valor"];
        const missing = required.filter((f) => !body[f]);
        if (missing.length > 0) {
            return NextResponse.json(
                { error: `Campos obrigatórios faltando: ${missing.join(", ")}` },
                { status: 400 }
            );
        }

        const data = {
            descricao: String(body.descricao),
            categoria: String(body.categoria),
            secretaria: String(body.secretaria),
            fornecedor: body.fornecedor ? String(body.fornecedor) : null,
            valor: parseFloat(body.valor) || 0,
            mes: parseInt(body.mes) || new Date().getMonth() + 1,
            ano: parseInt(body.ano) || new Date().getFullYear(),
        };

        const despesa = await prisma.despesa.create({ data });
        return NextResponse.json(despesa, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar despesa:", error);
        return NextResponse.json({ error: "Erro ao salvar despesa" }, { status: 500 });
    }
}
