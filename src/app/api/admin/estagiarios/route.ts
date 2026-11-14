export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET() {
    try {
        const estagiarios = await prisma.estagiario.findMany({
            orderBy: { criadoEm: "desc" }
        });
        return jsonNoStore(estagiarios);
    } catch {
        return NextResponse.json({ error: "Erro ao buscar estagiários" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });

    try {
        const body = await req.json();
        const estagiario = await prisma.estagiario.create({
            data: {
                nome: body.nome,
                instituicaoEnsino: body.instituicaoEnsino,
                unidadeLotacao: body.unidadeLotacao,
                dataInicio: new Date(body.dataInicio),
                dataFim: body.dataFim ? new Date(body.dataFim) : null,
                valorBolsa: parseFloat(body.valorBolsa),
                status: body.status || "ativo"
            }
        });
        revalidatePaths(REVALIDATE_GROUPS.pessoal);
        return NextResponse.json(estagiario);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao criar estagiário" }, { status: 500 });
    }
}
