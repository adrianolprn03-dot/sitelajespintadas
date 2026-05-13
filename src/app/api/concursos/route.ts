import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const type = searchParams.get("type"); // pss, concurso, estagio
    const status = searchParams.get("status");

    try {
        const where: any = {
            ativo: true,
        };

        if (q) {
            where.OR = [
                { titulo: { contains: q, mode: "insensitive" } },
                { descricao: { contains: q, mode: "insensitive" } },
            ];
        }

        if (year && year !== "TODOS") {
            let startOfPeriod, endOfPeriod;
            if (month && month !== "") {
                const monthIndex = parseInt(month) - 1; // 0-based
                startOfPeriod = new Date(parseInt(year), monthIndex, 1);
                endOfPeriod = new Date(parseInt(year), monthIndex + 1, 0, 23, 59, 59, 999);
            } else {
                startOfPeriod = new Date(`${year}-01-01T00:00:00.000Z`);
                endOfPeriod = new Date(`${year}-12-31T23:59:59.999Z`);
            }
            where.dataPublicacao = {
                gte: startOfPeriod,
                lte: endOfPeriod,
            };
        }

        if (type && type !== "TODOS") {
            if (type === "pss") {
                where.tipo = { in: ["pss", "processo-seletivo", "Processo Seletivo", "Processo Seletivo Simplificado (PSS)"] };
            } else if (type === "concurso") {
                where.tipo = { in: ["concurso", "Concurso Público"] };
            } else {
                where.tipo = type;
            }
        }

        if (status && status !== "TODOS") {
            where.status = status;
        }

        const items = await prisma.concurso.findMany({
            where,
            orderBy: { dataPublicacao: "desc" },
        });

        return NextResponse.json({ items });
    } catch (error) {
        console.error("Erro na API de concursos:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
