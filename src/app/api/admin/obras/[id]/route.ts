export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.obra.findUnique({
            where: { id: params.id }
        });
        if (!item) return NextResponse.json({ error: "Obra não encontrada" }, { status: 404 });
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar obra" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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
        return NextResponse.json(obra);
    } catch (error) {
        console.error("[API admin obras PUT]", error);
        return NextResponse.json({ error: "Erro ao atualizar obra" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Busca o registro para obter a URL da imagem antes de deletar
        const item = await prisma.obra.findUnique({ where: { id: params.id } });
        if (item?.imagem) {
            const { deleteFileFromR2 } = await import("@/lib/r2");
            await deleteFileFromR2(item.imagem);
        }
        await prisma.obra.delete({ where: { id: params.id } });
        return NextResponse.json({ message: "Obra excluída com sucesso" });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir obra" }, { status: 500 });
    }
}
