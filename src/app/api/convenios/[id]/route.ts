export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.convenio.findUnique({
            where: { id: params.id },
        });
        if (!item) return jsonNoStore({ error: "Não encontrado" }, { status: 404 });
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const updated = await prisma.convenio.update({
            where: { id: params.id },
            data: {
                numero: body.numero ? String(body.numero).trim() : undefined,
                ano: body.ano ? parseInt(String(body.ano)) : undefined,
                tipoConvenio: body.tipoConvenio || undefined,
                objeto: body.objeto !== undefined ? String(body.objeto).trim() : undefined,
                concedente: body.concedente !== undefined ? String(body.concedente).trim() : undefined,
                beneficiario: body.beneficiario !== undefined ? (body.beneficiario ? String(body.beneficiario).trim() : null) : undefined,
                cnpjParticipe: body.cnpjParticipe !== undefined ? (body.cnpjParticipe ? String(body.cnpjParticipe).trim() : null) : undefined,
                valor: body.valor !== undefined ? parseFloat(String(body.valor)) : undefined,
                contrapartida: body.contrapartida !== undefined ? parseFloat(String(body.contrapartida)) : undefined,
                valorLiberado: body.valorLiberado !== undefined ? parseFloat(String(body.valorLiberado)) : undefined,
                dataInicio: body.dataInicio ? new Date(body.dataInicio) : undefined,
                dataFim: body.dataFim ? new Date(body.dataFim) : undefined,
                secretaria: body.secretaria !== undefined ? String(body.secretaria).trim() : undefined,
                status: body.status || undefined,
                arquivoInteiroTeor: body.arquivoInteiroTeor !== undefined ? (body.arquivoInteiroTeor ? String(body.arquivoInteiroTeor).trim() : null) : undefined,
                obrigacoes: body.obrigacoes !== undefined ? String(body.obrigacoes).trim() : undefined,
                dataAtualizacaoEfetiva: new Date(),
            },
        });
        revalidatePaths(REVALIDATE_GROUPS.convenios);
        return jsonNoStore(updated);
    } catch (error) {
        console.error("Erro ao atualizar convênio:", error);
        return jsonNoStore({ error: "Erro interno ao atualizar convênio" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    return PUT(req, { params });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        await prisma.convenio.delete({
            where: { id: params.id },
        });
        revalidatePaths(REVALIDATE_GROUPS.convenios);
        return jsonNoStore({ message: "Excluído com sucesso" });
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}
