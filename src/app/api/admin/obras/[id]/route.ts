export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.obra.findUnique({
            where: { id: params.id }
        });
        if (!item) return jsonNoStore({ error: "Obra não encontrada" }, { status: 404 });
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro ao buscar obra" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const {
            titulo,
            descricao,
            local,
            valor,
            valorPago,
            status,
            dataInicio,
            previsaoTermino,
            empresa,
            cnpjEmpresa,
            numeroContrato,
            percentual,
            imagem,
            quantitativosContratados,
            medicoes,
            motivoParalisacao,
            responsavelParalisacao,
            previsaoReinicio,
            documentos
        } = body;

        const obra = await prisma.obra.update({
            where: { id: params.id },
            data: {
                titulo: titulo ? String(titulo).trim() : undefined,
                descricao: descricao !== undefined ? String(descricao) : undefined,
                local: local ? String(local).trim() : undefined,
                valor: valor !== undefined ? parseFloat(String(valor)) : undefined,
                valorPago: valorPago !== undefined ? parseFloat(String(valorPago)) : undefined,
                status: status || undefined,
                dataInicio: dataInicio ? new Date(dataInicio) : null,
                previsaoTermino: previsaoTermino ? new Date(previsaoTermino) : null,
                empresa: empresa || undefined,
                cnpjEmpresa: cnpjEmpresa || undefined,
                numeroContrato: numeroContrato || undefined,
                percentual: percentual !== undefined ? parseInt(String(percentual), 10) : undefined,
                imagem: imagem || undefined,
                quantitativosContratados:
                    quantitativosContratados !== undefined
                        ? (typeof quantitativosContratados === "string" ? quantitativosContratados : JSON.stringify(quantitativosContratados))
                        : undefined,
                medicoes:
                    medicoes !== undefined
                        ? (typeof medicoes === "string" ? medicoes : JSON.stringify(medicoes))
                        : undefined,
                motivoParalisacao: motivoParalisacao !== undefined ? motivoParalisacao : undefined,
                responsavelParalisacao: responsavelParalisacao !== undefined ? responsavelParalisacao : undefined,
                previsaoReinicio: previsaoReinicio ? new Date(previsaoReinicio) : null,
                documentos: documentos !== undefined ? (typeof documentos === "string" ? documentos : JSON.stringify(documentos)) : undefined,
                dataAtualizacaoEfetiva: new Date()
            },
        });
        revalidatePaths(REVALIDATE_GROUPS.obras);
        return jsonNoStore(obra);
    } catch (error) {
        console.error("[API admin obras PUT]", error);
        return jsonNoStore({ error: "Erro ao atualizar obra" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });

    try {
        // Busca o registro para obter a URL da imagem antes de deletar
        const item = await prisma.obra.findUnique({ where: { id: params.id } });
        if (item?.imagem) {
            const { deleteFileFromR2 } = await import("@/lib/r2");
            await deleteFileFromR2(item.imagem);
        }
        await prisma.obra.delete({ where: { id: params.id } });
        revalidatePaths(REVALIDATE_GROUPS.obras);
        return jsonNoStore({ message: "Obra excluída com sucesso" });
    } catch {
        return jsonNoStore({ error: "Erro ao excluir obra" }, { status: 500 });
    }
}
