export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";

export async function GET(req: NextRequest) {
    const auth = await requireServerAuth(["admin", "controladoria", "editor", "integracao"]);
    if (!auth.authorized) return auth.response;

    try {
        const fila = await prisma.filaEsperaCreche.findMany({
            orderBy: [{ ano: "desc" }, { posicaoFila: "asc" }]
        });

        const declaracoes = await prisma.declaracaoTransparencia.findMany({
            where: {
                OR: [
                    { modulo: "fila_creches" },
                    { criterioPntp: "19.2" }
                ]
            },
            orderBy: { criadoEm: "desc" }
        });

        return NextResponse.json({ fila, declaracoes });
    } catch (error) {
        console.error("[API admin creches GET]", error);
        return NextResponse.json({ error: "Erro ao listar dados de creches" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireServerAuth(["admin", "controladoria", "editor"]);
    if (!auth.authorized) return auth.response;

    try {
        const body = await req.json();

        if (body.tipoOperacao === "declaracao") {
            const dec = await prisma.declaracaoTransparencia.create({
                data: {
                    modulo: "fila_creches",
                    criterioPntp: "19.2",
                    orgaoResponsavel: body.orgaoResponsavel || "Secretaria Municipal de Educação, Cultura e Desportos",
                    exercicio: parseInt(String(body.exercicio || new Date().getFullYear()), 10),
                    competencia: body.competencia || `${body.exercicio}`,
                    tipoSituacao: body.tipoSituacao || "nao_ocorrencia_declarada",
                    textoDeclaracao: body.textoDeclaracao,
                    fundamentoLegal: body.fundamentoLegal || "Lei nº 9.394/96 (LDB) e Lei nº 12.527/11 (LAI)",
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
                resumoAlteracao: `Declaração Oficial Fila de Creches 19.2 (${dec.exercicio}): Demanda 100% atendida`,
                secretaria: dec.orgaoResponsavel,
                user: auth.user
            });

            return NextResponse.json(dec, { status: 201 });
        }

        // Criar registro na fila de espera
        const {
            protocoloAnonimizado,
            iniciaisCrianca,
            dataNascimentoMesAno,
            unidadeEscolar,
            turmaEtapa,
            criterioPrioridade,
            posicaoFila,
            status,
            ano
        } = body;

        const novo = await prisma.filaEsperaCreche.create({
            data: {
                protocoloAnonimizado: protocoloAnonimizado || `CRECHE-${ano || 2026}-${Date.now().toString().slice(-4)}`,
                iniciaisCrianca,
                dataNascimentoMesAno,
                unidadeEscolar,
                turmaEtapa,
                criterioPrioridade,
                posicaoFila: parseInt(String(posicaoFila || 1), 10),
                status: status || "aguardando",
                ano: parseInt(String(ano || new Date().getFullYear()), 10),
            }
        });

        await registrarHistoricoAlteracao({
            entidade: "FilaEsperaCreche",
            entidadeId: novo.id,
            acao: "criacao",
            resumoAlteracao: `Inscrição fila de creches: ${novo.protocoloAnonimizado} (${novo.unidadeEscolar})`,
            user: auth.user
        });

        return NextResponse.json(novo, { status: 201 });
    } catch (error) {
        console.error("[API admin creches POST]", error);
        return NextResponse.json({ error: "Erro ao salvar dados de creches" }, { status: 500 });
    }
}

