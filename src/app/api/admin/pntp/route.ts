export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CATALOGO_CRITERIOS_PNTP_2026 } from "@/lib/pntp-catalog";
import { requireServerAuth } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const dimensao = searchParams.get("dimensao");
        const classificacao = searchParams.get("classificacao");
        const secretaria = searchParams.get("secretaria");
        const filtro = searchParams.get("filtro"); // essenciais_pendentes | vencidos | aguardando_revisao

        let dbItems: Array<Record<string, any>> = [];
        let declaracoesRaw: Array<Record<string, any>> = [];

        try {
            dbItems = await prisma.criterioPNTP.findMany({
                orderBy: { codigo: "asc" },
            });
            declaracoesRaw = await prisma.declaracaoTransparencia.findMany({
                where: { ativa: true },
                orderBy: { criadoEm: "desc" },
            });
        } catch {
            // fallback to catalog if table not yet migrated in remote DB
        }

        const declaracoes = declaracoesRaw.map((d) => ({
            ...d,
            tipoDeclaracao: d.tipoSituacao,
            justificativa: d.textoDeclaracao,
            secretaria: d.orgaoResponsavel,
            documentoUrl: d.arquivoAssinadoUrl,
            dataDeclaracao: d.dataEmissao,
            dataUltimaConferencia: d.dataConferencia,
            vigente: d.ativa,
        }));

        const dbMap = new Map(dbItems.map((item) => [item.codigo, item]));
        const now = Date.now();

        let merged = CATALOGO_CRITERIOS_PNTP_2026.map((cat) => {
            const saved = dbMap.get(cat.codigo);
            const ultimaVerificacao = saved?.dataUltimaVerificacao
                ? new Date(saved.dataUltimaVerificacao)
                : null;
            const atualizadoEm = saved?.atualizadoEm ? new Date(saved.atualizadoEm) : null;

            const refDate = ultimaVerificacao || atualizadoEm;
            const diasDesdeConferencia = refDate
                ? Math.floor((now - refDate.getTime()) / (1000 * 60 * 60 * 24))
                : null;

            const periodicidadeDias = saved?.periodicidadeDias ?? cat.periodicidadeDias;
            const prazoVencido =
                periodicidadeDias > 0 &&
                (diasDesdeConferencia === null || diasDesdeConferencia > periodicidadeDias);

            const exigencias = cat.exigenciasCartilha || [];
            const periodicidadeLabel =
                periodicidadeDias <= 1
                    ? "Tempo Real (Diária)"
                    : periodicidadeDias <= 30
                    ? "Mensal (30 dias)"
                    : periodicidadeDias <= 60
                    ? "Bimestral (60 dias)"
                    : periodicidadeDias <= 120
                    ? "Quadrimestral (120 dias)"
                    : periodicidadeDias <= 180
                    ? "Semestral (180 dias)"
                    : "Anual (365 dias)";

            return {
                codigo: cat.codigo,
                dimensao: saved?.dimensao || cat.dimensao,
                titulo: saved?.titulo || cat.titulo,
                textoIntegral: saved?.textoIntegral || cat.textoIntegral,
                classificacao: saved?.classificacao || cat.classificacao,
                peso: saved?.peso ?? cat.peso,
                periodicidade: periodicidadeLabel,
                periodicidadeDias,
                exigenciasCartilha: exigencias,
                exigeDisponibilidade: exigencias.some((e) => e.toLowerCase().includes("disponibilidade")),
                exigeAtualidade: exigencias.some((e) => e.toLowerCase().includes("atualidade")),
                exigeSerieHistorica: exigencias.some((e) => e.toLowerCase().includes("série") || e.toLowerCase().includes("serie")),
                exigeGravacaoRelatorio: exigencias.some((e) => e.toLowerCase().includes("relatório") || e.toLowerCase().includes("relatorio") || e.toLowerCase().includes("exporta")),
                exigeFiltroPesquisa: exigencias.some((e) => e.toLowerCase().includes("filtro") || e.toLowerCase().includes("pesquisa")),
                paginaPublica: saved?.paginaPublica || cat.paginaPublica,
                telaAdministrativa: saved?.telaAdministrativa || cat.telaAdministrativa,
                rotaPublica: saved?.paginaPublica || cat.paginaPublica,
                rotaAdmin: saved?.telaAdministrativa || cat.telaAdministrativa,
                secretariaResponsavel: saved?.secretariaResponsavel || cat.secretariaResponsavel,
                servidorResponsavel: saved?.verificadoPor || null,
                statusFuncionalidade: saved?.statusFuncionalidade || cat.statusFuncionalidade || "implementada",
                statusConteudo: saved?.statusConteudo || cat.statusConteudo || "publicado",
                statusEvidencia: saved?.statusEvidencia || cat.statusEvidencia || "conferida",
                statusValidacao: saved?.statusValidacao || cat.statusValidacao || "validado",
                resultadoAvaliacaoExterna:
                    saved?.resultadoAvaliacaoExterna || cat.resultadoAvaliacaoExterna || "nao_avaliado",
                evidenciaUrl: saved?.evidenciaUrl || null,
                observacoes: saved?.pendenciasConteudo || saved?.pendenciasTecnicas || cat.pendenciasConteudo || null,
                ultimaAtualizacaoConteudo: atualizadoEm ? atualizadoEm.toISOString() : null,
                ultimaConferenciaEm: ultimaVerificacao ? ultimaVerificacao.toISOString() : null,
                diasDesdeConferencia,
                prazoVencido,
            };
        });

        // Cálculo transparente da Estimativa Interna (antes de filtrar a listagem)
        const pesoTotal = merged.reduce((acc, c) => acc + c.peso, 0);
        const pesoImplementadoTecnico = merged.reduce(
            (acc, c) => acc + (c.statusFuncionalidade === "implementada" ? c.peso : 0),
            0
        );
        const isConteudoOk = (st: string) =>
            ["publicado", "atualizado", "nao_ocorrencia_declarada", "nao_ocorrencia", "nao_aplicavel"].includes(st);

        const pesoConteudoValidado = merged.reduce(
            (acc, c) => acc + (isConteudoOk(c.statusConteudo) && c.statusValidacao === "validado" ? c.peso : 0),
            0
        );
        const essenciais = merged.filter((c) => c.classificacao === "ESSENCIAL");
        const essenciaisValidados = essenciais.filter(
            (c) => isConteudoOk(c.statusConteudo) && c.statusValidacao === "validado"
        );

        const resumo = {
            totalCriterios: merged.length,
            totalEssenciais: essenciais.length,
            essenciaisValidados: essenciaisValidados.length,
            essenciaisPendentes: essenciais.length - essenciaisValidados.length,
            criteriosPrazoVencido: merged.filter((c) => c.prazoVencido).length,
            aguardandoRevisao: merged.filter((c) =>
                ["aguardando_revisao", "em_revisao"].includes(c.statusValidacao) ||
                c.statusConteudo === "aguardando_revisao"
            ).length,
            pesoTotal: Math.round(pesoTotal * 100) / 100,
            percentualFuncionalidadeTecnica:
                pesoTotal > 0 ? Math.round((pesoImplementadoTecnico / pesoTotal) * 1000) / 10 : 0,
            percentualConteudoValidadoInterno:
                pesoTotal > 0 ? Math.round((pesoConteudoValidado / pesoTotal) * 1000) / 10 : 0,
            notaMetodologica:
                "Estimativa interna de controle gerencial calculada pela razão entre a soma ponderada dos critérios e o peso total do catálogo Executivo Municipal PNTP 2026. A certificação oficial depende exclusivamente de auditoria externa dos Tribunais de Contas (ATRICON).",
        };

        if (dimensao && dimensao !== "Todas") {
            merged = merged.filter((c) => c.dimensao === dimensao);
        }
        if (classificacao && classificacao !== "Todas") {
            merged = merged.filter((c) => c.classificacao === classificacao);
        }
        if (secretaria && secretaria !== "Todas") {
            merged = merged.filter((c) => c.secretariaResponsavel === secretaria);
        }
        if (filtro === "essenciais_pendentes") {
            merged = merged.filter(
                (c) => c.classificacao === "ESSENCIAL" && !(isConteudoOk(c.statusConteudo) && c.statusValidacao === "validado")
            );
        } else if (filtro === "vencidos") {
            merged = merged.filter((c) => c.prazoVencido);
        } else if (filtro === "aguardando_revisao") {
            merged = merged.filter(
                (c) =>
                    ["aguardando_revisao", "em_revisao"].includes(c.statusValidacao) ||
                    c.statusConteudo === "aguardando_revisao"
            );
        }

        return NextResponse.json({
            resumo,
            items: merged,
            declaracoes,
        });
    } catch (error) {
        console.error("[API Admin PNTP GET]", error);
        return NextResponse.json({ error: "Erro ao carregar acompanhamento PNTP" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireServerAuth(["admin", "controladoria", "editor", "integracao"]);
    if (!auth.authorized) return auth.response;

    try {
        const body = await req.json();

        // Caso 1: Registrar Declaração Formal de Não Ocorrência ou Não Aplicabilidade
        if (body.tipoOperacao === "declaracao") {
            const {
                modulo,
                criterioPntp,
                tipoDeclaracao,
                exercicio,
                competencia,
                justificativa,
                fundamentoLegal,
                secretaria,
                documentoUrl,
            } = body;

            if (!modulo || !tipoDeclaracao || !exercicio || !justificativa) {
                return NextResponse.json(
                    { error: "Módulo, tipo de declaração, exercício e justificativa formal são obrigatórios." },
                    { status: 400 }
                );
            }

            const dec = await prisma.declaracaoTransparencia.create({
                data: {
                    modulo: String(modulo),
                    criterioPntp: criterioPntp ? String(criterioPntp) : null,
                    orgaoResponsavel: secretaria ? String(secretaria) : "Prefeitura Municipal de Lajes Pintadas",
                    exercicio: parseInt(String(exercicio), 10),
                    competencia: competencia ? String(competencia) : null,
                    tipoSituacao: String(tipoDeclaracao), // nao_ocorrencia_declarada | nao_aplicavel
                    textoDeclaracao: String(justificativa),
                    fundamentoLegal: fundamentoLegal ? String(fundamentoLegal) : null,
                    responsavelNome: auth.user.nome,
                    responsavelCargo: auth.user.perfil,
                    arquivoAssinadoUrl: documentoUrl ? String(documentoUrl) : null,
                    dataEmissao: new Date(),
                    dataConferencia: new Date(),
                    ativa: true,
                },
            });

            await registrarHistoricoAlteracao({
                entidade: "DeclaracaoTransparencia",
                entidadeId: dec.id,
                acao: "publicacao",
                resumoAlteracao: `Declaração Formal (${dec.tipoSituacao}) - ${dec.modulo}/${dec.exercicio}: ${dec.textoDeclaracao}`,
                secretaria: dec.orgaoResponsavel,
                dadosNovos: {
                    modulo: dec.modulo,
                    criterioPntp: dec.criterioPntp,
                    tipoSituacao: dec.tipoSituacao,
                    exercicio: dec.exercicio,
                },
                user: auth.user,
            });

            return NextResponse.json(dec, { status: 201 });
        }

        // Caso 2: Atualizar ou Conferir Critério PNTP
        const {
            codigo,
            acao, // "conferir" | "atualizar"
            statusFuncionalidade,
            statusConteudo,
            statusEvidencia,
            statusValidacao,
            resultadoAvaliacaoExterna,
            secretariaResponsavel,
            servidorResponsavel,
            evidenciaUrl,
            observacoes,
        } = body;

        const cat = CATALOGO_CRITERIOS_PNTP_2026.find((c) => c.codigo === codigo);
        if (!cat) {
            return NextResponse.json({ error: "Critério PNTP não encontrado no catálogo." }, { status: 404 });
        }

        // Somente admin e controladoria podem aprovar statusValidacao = "validado"
        if (statusValidacao === "validado" && !["admin", "controladoria"].includes(auth.user.perfil)) {
            return NextResponse.json(
                { error: "Apenas a Controladoria ou Administração pode homologar a validação final de um critério." },
                { status: 403 }
            );
        }

        const now = new Date();
        const isConferenciaSemAlteracao = acao === "conferir";

        const saved = await prisma.criterioPNTP.upsert({
            where: { codigo: cat.codigo },
            create: {
                codigo: cat.codigo,
                dimensao: cat.dimensao,
                titulo: cat.titulo,
                textoIntegral: cat.textoIntegral,
                classificacao: cat.classificacao,
                peso: cat.peso,
                periodicidadeDias: cat.periodicidadeDias,
                exigenciasCartilha: JSON.stringify(cat.exigenciasCartilha),
                referenciaCartilha: cat.referenciaCartilha,
                paginaPublica: cat.paginaPublica,
                telaAdministrativa: cat.telaAdministrativa,
                secretariaResponsavel: secretariaResponsavel || cat.secretariaResponsavel,
                verificadoPor: servidorResponsavel || auth.user.nome,
                statusFuncionalidade: statusFuncionalidade || cat.statusFuncionalidade || "implementada",
                statusConteudo: statusConteudo || cat.statusConteudo || "publicado",
                statusEvidencia: statusEvidencia || cat.statusEvidencia || "conferida",
                statusValidacao: statusValidacao || cat.statusValidacao || "em_revisao",
                resultadoAvaliacaoExterna:
                    resultadoAvaliacaoExterna || cat.resultadoAvaliacaoExterna || "Atendido",
                evidenciaUrl: evidenciaUrl || null,
                pendenciasConteudo: observacoes || null,
                dataUltimaVerificacao: now,
            },
            update: {
                ...(secretariaResponsavel !== undefined ? { secretariaResponsavel } : {}),
                ...(servidorResponsavel !== undefined
                    ? { verificadoPor: servidorResponsavel }
                    : { verificadoPor: auth.user.nome }),
                ...(statusFuncionalidade !== undefined ? { statusFuncionalidade } : {}),
                ...(statusConteudo !== undefined ? { statusConteudo } : {}),
                ...(statusEvidencia !== undefined ? { statusEvidencia } : {}),
                ...(statusValidacao !== undefined ? { statusValidacao } : {}),
                ...(resultadoAvaliacaoExterna !== undefined ? { resultadoAvaliacaoExterna } : {}),
                ...(evidenciaUrl !== undefined ? { evidenciaUrl } : {}),
                ...(observacoes !== undefined ? { pendenciasConteudo: observacoes } : {}),
                dataUltimaVerificacao: now,
            },
        });

        await registrarHistoricoAlteracao({
            entidade: "CriterioPNTP",
            entidadeId: saved.codigo,
            acao: isConferenciaSemAlteracao ? "conferencia_sem_alteracao" : "revisao",
            resumoAlteracao: `${saved.codigo} - ${saved.titulo} (${saved.statusConteudo} / ${saved.statusValidacao}) — ${
                observacoes ||
                (isConferenciaSemAlteracao
                    ? "Conferência periódica realizada pelo setor sem alteração de conteúdo."
                    : "Atualização de status no painel de governança PNTP.")
            }`,
            isConferenciaSemAlteracao,
            secretaria: saved.secretariaResponsavel,
            dadosNovos: {
                statusFuncionalidade: saved.statusFuncionalidade,
                statusConteudo: saved.statusConteudo,
                statusEvidencia: saved.statusEvidencia,
                statusValidacao: saved.statusValidacao,
            },
            user: auth.user,
        });

        return NextResponse.json(saved);
    } catch (error) {
        console.error("[API Admin PNTP POST]", error);
        return NextResponse.json({ error: "Erro ao salvar critério PNTP" }, { status: 500 });
    }
}
