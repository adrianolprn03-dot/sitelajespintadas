export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registrarHistoricoAlteracao } from "@/lib/audit";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";
import {
    CONFIG_CHAVE_CRITERIOS_CRECHE,
    CriterioPrioridadeCreche,
    parseCriteriosCreche,
} from "@/lib/educacao";

export async function GET() {
    try {
        const [fila, declaracoes, criteriosConfig, unidadesEscolares] = await Promise.all([
            prisma.filaEsperaCreche.findMany({
                orderBy: [{ ano: "desc" }, { posicaoFila: "asc" }, { dataInscricao: "asc" }],
            }),
            prisma.declaracaoTransparencia.findMany({
                where: { OR: [{ modulo: "fila_creches" }, { modulo: "creches" }] },
                orderBy: [{ exercicio: "desc" }, { dataEmissao: "desc" }],
            }),
            prisma.configuracao.findUnique({
                where: { chave: CONFIG_CHAVE_CRITERIOS_CRECHE },
            }),
            prisma.unidadeAtendimento.findMany({
                where: {
                    ativa: true,
                    tipo: {
                        in: ["Educação", "educacao", "EDUCAÇÃO", "EDUCACAO", "Educacao", "educação"],
                    },
                },
                select: { id: true, nome: true },
                orderBy: { nome: "asc" },
            }),
        ]);

        return jsonNoStore({
            fila,
            declaracoes,
            criteriosPrioridade: parseCriteriosCreche(criteriosConfig?.valor),
            unidadesEscolares,
        });
    } catch (error) {
        console.error("Erro ao consultar dados admin de creches:", error);
        return NextResponse.json({ error: "Erro ao buscar dados de creches" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    try {
        const body = await req.json();

        // 1. Publicar nova Declaração Oficial de Inexistência/Demanda (PNTP 19.2)
        if (body.tipoOperacao === "declaracao") {
            const dec = await prisma.declaracaoTransparencia.create({
                data: {
                    modulo: "fila_creches",
                    criterioPntp: "19.2",
                    orgaoResponsavel:
                        body.orgaoResponsavel ||
                        "Secretaria Municipal de Educação, Cultura e Desporto",
                    exercicio: parseInt(String(body.exercicio || new Date().getFullYear()), 10),
                    competencia: body.competencia || String(body.exercicio || new Date().getFullYear()),
                    tipoSituacao: body.tipoSituacao || "nao_ocorrencia_declarada",
                    textoDeclaracao: String(body.textoDeclaracao || "").trim(),
                    fundamentoLegal:
                        body.fundamentoLegal ||
                        "Lei nº 9.394/96 (LDB), ECA (Lei nº 8.069/90) e Lei nº 12.527/11 (LAI)",
                    responsavelNome:
                        body.responsavelNome || session.user?.name || "Secretaria Municipal de Educação",
                    arquivoAssinadoUrl: body.arquivoAssinadoUrl || null,
                    ativa: true,
                    dataEmissao: new Date(),
                    dataConferencia: new Date(),
                },
            });

            await registrarHistoricoAlteracao({
                entidade: "DeclaracaoTransparencia",
                entidadeId: dec.id,
                acao: "criacao",
                resumoAlteracao: `Declaração Oficial Fila de Creches 19.2 (${dec.exercicio}) publicada`,
                dadosNovos: dec,
                secretaria: "Educação",
            });

            revalidatePaths(REVALIDATE_GROUPS.educacao);
            return jsonNoStore(dec, { status: 201 });
        }

        // 2. Atualizar lista completa de Critérios de Priorização (PNTP 19.2)
        if (body.tipoOperacao === "criterios") {
            const criteriosInput = Array.isArray(body.criterios) ? body.criterios : [];
            const sanitizados: CriterioPrioridadeCreche[] = criteriosInput
                .map((c: any, index: number) => ({
                    ordem: Number(c?.ordem) || index + 1,
                    titulo: String(c?.titulo || "").trim(),
                    fundamento: String(c?.fundamento || "").trim(),
                    descricao: String(c?.descricao || "").trim(),
                }))
                .filter((c: CriterioPrioridadeCreche) => Boolean(c.titulo))
                .sort((a: CriterioPrioridadeCreche, b: CriterioPrioridadeCreche) => a.ordem - b.ordem);

            if (sanitizados.length === 0) {
                return NextResponse.json(
                    { error: "Informe ao menos um critério legal de priorização." },
                    { status: 400 }
                );
            }

            const config = await prisma.configuracao.upsert({
                where: { chave: CONFIG_CHAVE_CRITERIOS_CRECHE },
                update: {
                    valor: JSON.stringify(sanitizados),
                    grupo: "educacao",
                },
                create: {
                    chave: CONFIG_CHAVE_CRITERIOS_CRECHE,
                    valor: JSON.stringify(sanitizados),
                    grupo: "educacao",
                    descricao: "Critérios legais de priorização de vagas em creches públicas (PNTP 19.2)",
                },
            });

            await registrarHistoricoAlteracao({
                entidade: "Configuracao",
                entidadeId: config.id,
                acao: "edicao",
                resumoAlteracao: `Atualizados ${sanitizados.length} critérios de priorização de vagas em creches (PNTP 19.2)`,
                dadosNovos: sanitizados,
                secretaria: "Educação",
            });

            revalidatePaths(REVALIDATE_GROUPS.educacao);
            return jsonNoStore({ ok: true, criteriosPrioridade: sanitizados });
        }

        // 3. Criar nova inscrição na fila de espera
        const anoNum = parseInt(String(body.ano || new Date().getFullYear()), 10);
        const protocolo =
            String(body.protocoloAnonimizado || "").trim() ||
            `EDU-${anoNum}-${Math.floor(1000 + Math.random() * 9000)}`;

        const novo = await prisma.filaEsperaCreche.create({
            data: {
                protocoloAnonimizado: protocolo,
                iniciaisCrianca: String(body.iniciaisCrianca || "").trim(),
                dataNascimentoMesAno: String(body.dataNascimentoMesAno || "").trim(),
                unidadeEscolar: String(body.unidadeEscolar || "").trim(),
                turmaEtapa: String(body.turmaEtapa || "Educação Infantil").trim(),
                criterioPrioridade: String(body.criterioPrioridade || "Proximidade da Residência").trim(),
                posicaoFila: parseInt(String(body.posicaoFila || 1), 10),
                status: String(body.status || "aguardando").trim(),
                ano: anoNum,
                dataInscricao: body.dataInscricao ? new Date(body.dataInscricao) : new Date(),
            },
        });

        await registrarHistoricoAlteracao({
            entidade: "FilaEsperaCreche",
            entidadeId: novo.id,
            acao: "criacao",
            resumoAlteracao: `Inscrição fila de creches: ${novo.protocoloAnonimizado} (${novo.unidadeEscolar})`,
            dadosNovos: novo,
            secretaria: "Educação",
        });

        revalidatePaths(REVALIDATE_GROUPS.educacao);
        return jsonNoStore(novo, { status: 201 });
    } catch (error) {
        console.error("Erro ao salvar dados de creches:", error);
        return NextResponse.json({ error: "Erro ao salvar registro de creches" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, tipoOperacao } = body;

        if (!id) {
            return NextResponse.json({ error: "ID é obrigatório para edição." }, { status: 400 });
        }

        if (tipoOperacao === "declaracao") {
            const dec = await prisma.declaracaoTransparencia.update({
                where: { id },
                data: {
                    exercicio: body.exercicio !== undefined ? parseInt(String(body.exercicio), 10) : undefined,
                    textoDeclaracao: body.textoDeclaracao !== undefined ? String(body.textoDeclaracao).trim() : undefined,
                    fundamentoLegal: body.fundamentoLegal !== undefined ? String(body.fundamentoLegal).trim() : undefined,
                    arquivoAssinadoUrl: body.arquivoAssinadoUrl !== undefined ? body.arquivoAssinadoUrl || null : undefined,
                    orgaoResponsavel: body.orgaoResponsavel !== undefined ? String(body.orgaoResponsavel).trim() : undefined,
                    responsavelNome: body.responsavelNome !== undefined ? String(body.responsavelNome).trim() : undefined,
                    ativa: body.ativa !== undefined ? Boolean(body.ativa) : undefined,
                    dataConferencia: new Date(),
                },
            });

            await registrarHistoricoAlteracao({
                entidade: "DeclaracaoTransparencia",
                entidadeId: dec.id,
                acao: "edicao",
                resumoAlteracao: `Declaração Oficial Fila de Creches (${dec.exercicio}) atualizada`,
                dadosNovos: dec,
                secretaria: "Educação",
            });

            revalidatePaths(REVALIDATE_GROUPS.educacao);
            return jsonNoStore(dec);
        }

        const updated = await prisma.filaEsperaCreche.update({
            where: { id },
            data: {
                iniciaisCrianca: body.iniciaisCrianca !== undefined ? String(body.iniciaisCrianca).trim() : undefined,
                dataNascimentoMesAno: body.dataNascimentoMesAno !== undefined ? String(body.dataNascimentoMesAno).trim() : undefined,
                unidadeEscolar: body.unidadeEscolar !== undefined ? String(body.unidadeEscolar).trim() : undefined,
                turmaEtapa: body.turmaEtapa !== undefined ? String(body.turmaEtapa).trim() : undefined,
                criterioPrioridade: body.criterioPrioridade !== undefined ? String(body.criterioPrioridade).trim() : undefined,
                posicaoFila: body.posicaoFila !== undefined ? parseInt(String(body.posicaoFila), 10) : undefined,
                status: body.status !== undefined ? String(body.status).trim() : undefined,
                ano: body.ano !== undefined ? parseInt(String(body.ano), 10) : undefined,
            },
        });

        await registrarHistoricoAlteracao({
            entidade: "FilaEsperaCreche",
            entidadeId: updated.id,
            acao: "edicao",
            resumoAlteracao: `Inscrição ${updated.protocoloAnonimizado} atualizada para status "${updated.status}"`,
            dadosNovos: updated,
            secretaria: "Educação",
        });

        revalidatePaths(REVALIDATE_GROUPS.educacao);
        return jsonNoStore(updated);
    } catch (error) {
        console.error("Erro ao atualizar registro de creches:", error);
        return NextResponse.json({ error: "Erro ao atualizar registro" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") || "fila";
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID é obrigatório para exclusão." }, { status: 400 });
        }

        if (type === "declaracao") {
            await prisma.declaracaoTransparencia.delete({ where: { id } });
            await registrarHistoricoAlteracao({
                entidade: "DeclaracaoTransparencia",
                entidadeId: id,
                acao: "exclusao",
                resumoAlteracao: `Declaração Oficial de Creches removida (${id})`,
                secretaria: "Educação",
            });
        } else {
            await prisma.filaEsperaCreche.delete({ where: { id } });
            await registrarHistoricoAlteracao({
                entidade: "FilaEsperaCreche",
                entidadeId: id,
                acao: "exclusao",
                resumoAlteracao: `Inscrição removida da fila de creches (${id})`,
                secretaria: "Educação",
            });
        }

        revalidatePaths(REVALIDATE_GROUPS.educacao);
        return jsonNoStore({ ok: true });
    } catch (error) {
        console.error("Erro ao excluir registro de creches:", error);
        return NextResponse.json({ error: "Erro ao excluir registro" }, { status: 500 });
    }
}
