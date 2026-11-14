export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Privado" }, { status: 401 });
    try {
        const body = await req.json();
        const data: any = {};
        if (body.nome !== undefined) data.nome = String(body.nome).trim();
        if (body.categoria !== undefined) data.categoria = String(body.categoria).trim();
        if (body.descricao !== undefined) data.descricao = String(body.descricao).trim();
        if (body.local !== undefined) data.local = String(body.local).trim();
        if (body.prazo !== undefined) data.prazo = String(body.prazo).trim();
        if (body.documentos !== undefined) data.documentos = body.documentos || null;
        if (body.ativo !== undefined) data.ativo = Boolean(body.ativo);
        if (body.ordem !== undefined) data.ordem = parseInt(String(body.ordem), 10) || 0;
        if (body.etapas !== undefined) data.etapas = body.etapas || null;
        if (body.formasAcesso !== undefined) data.formasAcesso = body.formasAcesso || null;
        if (body.linkAvaliacao !== undefined) data.linkAvaliacao = body.linkAvaliacao || null;
        if (body.previsaoEspera !== undefined) data.previsaoEspera = body.previsaoEspera || null;
        if (body.prioridades !== undefined) data.prioridades = body.prioridades || null;
        if (body.requisitos !== undefined) data.requisitos = body.requisitos || null;
        if (body.statusServico !== undefined) data.statusServico = body.statusServico || null;
        if (body.linkAcesso !== undefined) data.linkAcesso = body.linkAcesso || null;

        const item = await prisma.servicoCarta.update({
            where: { id: params.id },
            data,
        });
        revalidatePaths(REVALIDATE_GROUPS.institucional);
        return jsonNoStore(item);
    } catch (error) {
        console.error("Erro ao atualizar serviço:", error);
        return jsonNoStore({ error: "Erro ao atualizar" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Privado" }, { status: 401 });
    try {
        await prisma.servicoCarta.delete({ where: { id: params.id } });
        revalidatePaths(REVALIDATE_GROUPS.institucional);
        return jsonNoStore({ success: true });
    } catch {
        return jsonNoStore({ error: "Erro" }, { status: 500 });
    }
}
