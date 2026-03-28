import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
    try {
        const configs = await prisma.configuracao.findMany({
            orderBy: { chave: "asc" }
        });
        return NextResponse.json(configs);
    } catch (error) {
        console.error("Erro ao buscar configurações:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const { configs } = body; // Array de { chave, valor }

        if (!Array.isArray(configs)) {
            return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
        }

        const updates = configs.map((c: any) => 
            prisma.configuracao.upsert({
                where: { chave: c.chave },
                update: { valor: c.valor },
                create: { chave: c.chave, valor: c.valor }
            })
        );

        await Promise.all(updates);

        revalidatePath("/", "layout");
        revalidatePath("/municipio/simbolos");
        revalidatePath("/transparencia/simbolos");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao salvar configurações:", error);
        return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
    }
}
