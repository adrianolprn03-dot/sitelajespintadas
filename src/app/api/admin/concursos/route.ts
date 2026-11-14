export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET() {
    try {
        const items = await prisma.concurso.findMany({ orderBy: { dataPublicacao: "desc" } });
        return jsonNoStore(items);
    } catch {
        return jsonNoStore({ error: "Erro" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });
    try {
        const body = await req.json();
        const { titulo, vagas, dataPublicacao } = body;

        if (!titulo || titulo.trim() === "") {
            return jsonNoStore({ error: "O título é obrigatório" }, { status: 400 });
        }

        const slug = titulo
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");

        let finalDate = new Date();
        if (dataPublicacao) {
            const parsedDate = new Date(dataPublicacao);
            if (!isNaN(parsedDate.getTime())) {
                finalDate = parsedDate;
            }
        }

        const item = await prisma.concurso.create({
            data: {
                titulo: titulo.trim(),
                slug: `${slug}-${Date.now()}`,
                tipo: String(body.tipo || "Concurso Público"),
                status: String(body.status || "aberto"),
                vagas: String(vagas || ""),
                dataPublicacao: finalDate,
                linkEdital: body.linkEdital || null,
                fasesAtos:
                    typeof body.fasesAtos === "string"
                        ? body.fasesAtos
                        : JSON.stringify(body.fasesAtos || []),
                ativo: body.ativo !== undefined ? Boolean(body.ativo) : true,
                descricao: body.descricao || null,
            },
        });
        revalidatePaths(REVALIDATE_GROUPS.concursos);
        return jsonNoStore(item);
    } catch (error) {
        console.error("Erro ao criar concurso:", error);
        return jsonNoStore(
            {
                error: "Erro ao salvar concurso no banco de dados.",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

