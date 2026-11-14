export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET() {
    try {
        const items = await prisma.servicoCarta.findMany({ orderBy: { categoria: "asc" } });
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
        const ordemParsed = body.ordem !== undefined ? parseInt(String(body.ordem), 10) : 0;
        const item = await prisma.servicoCarta.create({
            data: {
                nome: String(body.nome || "").trim(),
                categoria: String(body.categoria || "").trim(),
                descricao: String(body.descricao || "").trim(),
                local: String(body.local || "").trim(),
                prazo: String(body.prazo || "").trim(),
                documentos: body.documentos || null,
                ativo: body.ativo !== undefined ? Boolean(body.ativo) : true,
                ordem: Number.isNaN(ordemParsed) ? 0 : ordemParsed,
                etapas: body.etapas || null,
                formasAcesso: body.formasAcesso || null,
                linkAvaliacao: body.linkAvaliacao || "/transparencia/carta-servicos/avaliar",
                previsaoEspera: body.previsaoEspera || null,
                prioridades: body.prioridades || null,
                requisitos: body.requisitos || null,
                statusServico: body.statusServico || null,
                linkAcesso: body.linkAcesso || null,
            },
        });
        revalidatePaths(REVALIDATE_GROUPS.institucional);
        return jsonNoStore(item);
    } catch (error) {
        console.error("Erro ao criar serviço:", error);
        return jsonNoStore({ error: "Erro ao criar serviço" }, { status: 500 });
    }
}

