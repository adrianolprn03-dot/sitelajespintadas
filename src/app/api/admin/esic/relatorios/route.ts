export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";

export async function GET(req: NextRequest) {
    const auth = await requireServerAuth(["admin", "controladoria", "esic", "editor"]);
    if (!auth.authorized) return auth.response;

    try {
        const declaracoes = await prisma.declaracaoTransparencia.findMany({
            where: {
                OR: [
                    { modulo: "esic_classificadas" },
                    { modulo: "esic_desclassificadas" },
                    { criterioPntp: "12.8" },
                    { criterioPntp: "12.9" },
                    { criterioPntp: "12.7" }
                ]
            },
            orderBy: { criadoEm: "desc" }
        });

        const classificados = await prisma.esic.findMany({
            where: { NOT: { grauSigilo: "Sem Sigilo" } },
            orderBy: { criadoEm: "desc" }
        });

        const desclassificados = await prisma.esic.findMany({
            where: { dataDesclassificacao: { not: null } },
            orderBy: { dataDesclassificacao: "desc" }
        });

        return NextResponse.json({
            declaracoes,
            classificados,
            desclassificados
        });
    } catch (error) {
        console.error("[API admin esic relatorios GET]", error);
        return NextResponse.json({ error: "Erro ao buscar relatórios e-SIC" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireServerAuth(["admin", "controladoria", "esic"]);
    if (!auth.authorized) return auth.response;

    try {
        const body = await req.json();

        // 1. Registro de Declaração Oficial de Inexistência (12.8 ou 12.9)
        if (body.tipoOperacao === "declaracao") {
            const dec = await prisma.declaracaoTransparencia.create({
                data: {
                    modulo: body.modulo || "esic_desclassificadas",
                    criterioPntp: body.criterioPntp || (body.modulo === "esic_classificadas" ? "12.8" : "12.9"),
                    orgaoResponsavel: body.orgaoResponsavel || "Controladoria Geral do Município",
                    exercicio: parseInt(String(body.exercicio || new Date().getFullYear()), 10),
                    competencia: body.competencia || `${body.exercicio}`,
                    tipoSituacao: "nao_ocorrencia_declarada",
                    textoDeclaracao: body.textoDeclaracao,
                    fundamentoLegal: body.fundamentoLegal || "Lei nº 12.527/11 (LAI - Art. 30)",
                    responsavelNome: auth.user.nome,
                    responsavelCargo: auth.user.perfil,
                    arquivoAssinadoUrl: body.arquivoAssinadoUrl || null,
                    dataEmissao: new Date(),
                    dataConferencia: new Date(),
                    situacaoPublicacao: "publicado",
                    ativa: true
                }
            });

            await registrarHistoricoAlteracao({
                entidade: "DeclaracaoTransparencia",
                entidadeId: dec.id,
                acao: "publicacao",
                resumoAlteracao: `Declaração e-SIC (${dec.modulo}) - ${dec.criterioPntp}: ${dec.textoDeclaracao.slice(0, 80)}...`,
                user: auth.user
            });

            return NextResponse.json(dec, { status: 201 });
        }

        // 2. Classificar documento ou pedido
        if (body.tipoOperacao === "classificar") {
            const { id, grauSigilo, fundamentoSigilo, autoridadeClassificadora, dataClassificacao } = body;
            const updated = await prisma.esic.update({
                where: { id },
                data: {
                    grauSigilo: grauSigilo || "Reservado",
                    fundamentoSigilo,
                    autoridadeClassificadora,
                    dataClassificacao: dataClassificacao ? new Date(dataClassificacao) : new Date()
                }
            });

            await registrarHistoricoAlteracao({
                entidade: "Esic",
                entidadeId: updated.id,
                acao: "edicao",
                resumoAlteracao: `Classificação de sigilo (${updated.protocolo}): Grau ${updated.grauSigilo}`,
                user: auth.user
            });

            return NextResponse.json(updated);
        }

        // 3. Desclassificar documento
        if (body.tipoOperacao === "desclassificar") {
            const { id, dataDesclassificacao, justificativa } = body;
            const updated = await prisma.esic.update({
                where: { id },
                data: {
                    dataDesclassificacao: dataDesclassificacao ? new Date(dataDesclassificacao) : new Date(),
                    resposta: justificativa ? `Desclassificado: ${justificativa}` : undefined
                }
            });

            await registrarHistoricoAlteracao({
                entidade: "Esic",
                entidadeId: updated.id,
                acao: "edicao",
                resumoAlteracao: `Desclassificação de documento (${updated.protocolo})`,
                user: auth.user
            });

            return NextResponse.json(updated);
        }

        return NextResponse.json({ error: "Operação inválida" }, { status: 400 });
    } catch (error) {
        console.error("[API admin esic relatorios POST]", error);
        return NextResponse.json({ error: "Erro ao processar alteração" }, { status: 500 });
    }
}
