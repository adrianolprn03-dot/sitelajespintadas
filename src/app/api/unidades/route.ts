export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const tipo = searchParams.get("tipo");
        const limitStr = searchParams.get("limit");
        const includeInactive = searchParams.get("all") === "true";

        const where: Record<string, unknown> = {};

        if (tipo) {
            const t = tipo.toLowerCase();
            if (t.includes("saud") || t === "saude") {
                where.tipo = { in: ["Saúde", "saude", "SAÚDE", "SAUDE"] };
            } else if (t.includes("educa") || t === "educacao") {
                where.tipo = { in: ["Educação", "educacao", "EDUCAÇÃO", "EDUCACAO", "Educacao"] };
            } else if (t.includes("socia") || t === "social") {
                where.tipo = { in: ["Socioassistencial", "social", "SOCIOASSISTENCIAL", "Social"] };
            } else if (t.includes("cultur") || t === "cultura") {
                where.tipo = { in: ["Cultura", "cultura", "CULTURA"] };
            } else {
                where.tipo = { contains: tipo, mode: "insensitive" };
            }
        }

        if (!includeInactive) {
            where.ativa = true;
        }

        const unidades = await prisma.unidadeAtendimento.findMany({
            where,
            orderBy: {
                nome: "asc",
            },
            ...(limitStr ? { take: parseInt(limitStr, 10) } : {}),
        });

        return jsonNoStore(unidades);
    } catch (error) {
        console.error("Erro ao buscar unidades:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });
    }

    try {
        const data = await request.json();

        const unidade = await prisma.unidadeAtendimento.create({
            data: {
                nome: String(data.nome || "").trim(),
                tipo: String(data.tipo || "").trim(),
                descricao: String(data.descricao || "").trim(),
                endereco: String(data.endereco || "").trim(),
                telefone: data.telefone || null,
                horario: String(data.horario || "").trim(),
                mapa: data.mapa || null,
                ativa: data.ativa !== undefined ? Boolean(data.ativa) : true,
            },
        });

        revalidatePaths(REVALIDATE_GROUPS.unidades);
        return NextResponse.json(unidade, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar unidade de atendimento:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

