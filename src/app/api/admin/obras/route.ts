export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const q = searchParams.get("q");

        const where: Record<string, unknown> = {};
        if (status && status !== "Todos") where.status = status;
        if (q) {
            where.OR = [
                { titulo: { contains: q, mode: "insensitive" } },
                { local: { contains: q, mode: "insensitive" } },
                { empresa: { contains: q, mode: "insensitive" } },
                { numeroContrato: { contains: q, mode: "insensitive" } },
            ];
        }

        const items = await prisma.obra.findMany({
            where,
            orderBy: { criadoEm: "desc" }
        });
        return NextResponse.json(items);
    } catch {
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireServerAuth(["admin", "controladoria", "editor"]);
    if (!auth.authorized) return auth.response;

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
            numeroContrato,
            contratoId,
            percentual,
            imagem,
            quantitativosContratados,
            medicoesExecutadas,
            medicoes,
            documentosTecnicos,
            documentos,
            motivoParalisacao,
            responsavelParalisacao,
            previsaoReinicio,
            situacaoPublicacao,
        } = body;

        const now = new Date();
        const obra = await prisma.obra.create({
            data: {
                titulo: String(titulo || "").trim(),
                descricao: descricao ? String(descricao) : "",
                local: String(local || "").trim(),
                valor: parseFloat(String(valor || "0")),
                valorPago: valorPago !== undefined && valorPago !== null && valorPago !== "" ? parseFloat(String(valorPago)) : null,
                status: status || "Em Andamento",
                dataInicio: dataInicio ? new Date(dataInicio) : null,
                previsaoTermino: previsaoTermino ? new Date(previsaoTermino) : null,
                empresa: empresa ? String(empresa) : null,
                numeroContrato: numeroContrato ? String(numeroContrato) : null,
                contratoId: contratoId ? String(contratoId) : null,
                percentual: parseInt(String(percentual || "0")),
                imagem: imagem ? String(imagem) : null,
                quantitativosContratados: quantitativosContratados
                    ? typeof quantitativosContratados === "string"
                        ? quantitativosContratados
                        : JSON.stringify(quantitativosContratados)
                    : "[]",
                medicoes: (medicoesExecutadas || medicoes)
                    ? typeof (medicoesExecutadas || medicoes) === "string"
                        ? (medicoesExecutadas || medicoes)
                        : JSON.stringify(medicoesExecutadas || medicoes)
                    : "[]",
                documentos: (documentosTecnicos || documentos)
                    ? typeof (documentosTecnicos || documentos) === "string"
                        ? (documentosTecnicos || documentos)
                        : JSON.stringify(documentosTecnicos || documentos)
                    : "[]",
                motivoParalisacao: motivoParalisacao ? String(motivoParalisacao) : null,
                responsavelParalisacao: responsavelParalisacao ? String(responsavelParalisacao) : null,
                previsaoReinicio: previsaoReinicio ? new Date(previsaoReinicio) : null,
                situacaoPublicacao: situacaoPublicacao || "publicado",
                responsavelCadastro: auth.user.nome,
                dataAtualizacaoEfetiva: now,
                dataUltimaConferencia: now,
                criterioPntp: "10.1",
            },
        });

        await registrarHistoricoAlteracao({
            entidade: "Obra",
            entidadeId: obra.id,
            acao: "criacao",
            resumoAlteracao: `Cadastro de obra pública: ${obra.titulo} (${obra.situacaoPublicacao})`,
            dadosNovos: {
                valor: obra.valor,
                valorPago: obra.valorPago,
                status: obra.status,
                percentual: obra.percentual,
                criterioPntp: "10.1",
            },
            user: auth.user,
        });

        return NextResponse.json(obra, { status: 201 });
    } catch (error) {
        console.error("[API Obras POST]", error);
        return NextResponse.json({ error: "Erro ao criar obra" }, { status: 500 });
    }
}
