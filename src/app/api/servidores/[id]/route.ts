export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.servidor.findUnique({ where: { id: params.id } });
        if (!item) return jsonNoStore({ error: "Não encontrado" }, { status: 404 });
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const data: any = { dataAtualizacaoEfetiva: new Date() };
        if (body.nome !== undefined) data.nome = String(body.nome).trim();
        if (body.cpfAnonimizado !== undefined) data.cpfAnonimizado = body.cpfAnonimizado || null;
        if (body.matricula !== undefined) data.matricula = body.matricula || null;
        if (body.cargo !== undefined) data.cargo = String(body.cargo).trim();
        if (body.vinculo !== undefined) data.vinculo = String(body.vinculo);
        if (body.secretaria !== undefined) data.secretaria = String(body.secretaria).trim();
        if (body.lotacao !== undefined) data.lotacao = body.lotacao || null;
        if (body.cargaHorariaSemanal !== undefined) data.cargaHorariaSemanal = body.cargaHorariaSemanal !== null ? parseInt(String(body.cargaHorariaSemanal), 10) : null;
        if (body.dataAdmissao !== undefined) data.dataAdmissao = body.dataAdmissao ? new Date(body.dataAdmissao) : null;
        if (body.padraoRemuneratorio !== undefined) data.padraoRemuneratorio = body.padraoRemuneratorio || null;
        if (body.salarioBase !== undefined) data.salarioBase = parseFloat(String(body.salarioBase)) || 0;
        if (body.vantagens !== undefined) data.vantagens = parseFloat(String(body.vantagens)) || 0;
        if (body.descontos !== undefined) data.descontos = parseFloat(String(body.descontos)) || 0;
        if (body.totalBruto !== undefined) data.totalBruto = parseFloat(String(body.totalBruto)) || 0;
        if (body.totalLiquido !== undefined) data.totalLiquido = parseFloat(String(body.totalLiquido)) || 0;
        if (body.ativo !== undefined) data.ativo = Boolean(body.ativo);
        if (body.mes !== undefined) data.mes = parseInt(String(body.mes), 10);
        if (body.ano !== undefined) data.ano = parseInt(String(body.ano), 10);
        if (body.situacaoPublicacao !== undefined) data.situacaoPublicacao = body.situacaoPublicacao;

        const item = await prisma.servidor.update({ where: { id: params.id }, data });
        revalidatePaths(REVALIDATE_GROUPS.pessoal);
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    return PATCH(req, context);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        await prisma.servidor.delete({ where: { id: params.id } });
        revalidatePaths(REVALIDATE_GROUPS.pessoal);
        return jsonNoStore({ success: true });
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}
