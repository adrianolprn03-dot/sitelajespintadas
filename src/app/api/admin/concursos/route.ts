export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET() {

    try {
        const items = await prisma.concurso.findMany({ orderBy: { dataPublicacao: "desc" } });
        return NextResponse.json(items);
    } catch {
        return NextResponse.json({ error: "Erro" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    try {
        const body = await req.json();
        const { titulo, vagas, dataPublicacao, ...rest } = body;

        if (!titulo || titulo.trim() === "") {
            return NextResponse.json({ error: "O título é obrigatório" }, { status: 400 });
        }
        
        // Gerar slug único
        const slug = titulo
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");

        // Validar data
        let finalDate = new Date();
        if (dataPublicacao) {
            const parsedDate = new Date(dataPublicacao);
            if (!isNaN(parsedDate.getTime())) {
                finalDate = parsedDate;
            }
        }

        const item = await prisma.concurso.create({ 
            data: {
                ...rest,
                titulo,
                slug: `${slug}-${Date.now()}`,
                vagas: String(vagas || ""),
                dataPublicacao: finalDate
            } 
        });
        return NextResponse.json(item);
    } catch (error) {
        console.error("Erro ao criar concurso:", error);
        return NextResponse.json({ 
            error: "Erro ao salvar concurso no banco de dados.",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

