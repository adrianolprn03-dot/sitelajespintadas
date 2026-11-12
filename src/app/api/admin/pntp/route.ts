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
        } catch (dbErr) {
            console.error("[API Admin PNTP GET] Erro ao consultar banco:", dbErr);
            return NextResponse.json(
                { error: "Falha de conexão com a base de dados do PNTP. Não foi possível carregar os critérios." },
                { status: 500 }
            );
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

        // Juntar catálogo com itens existentes no banco
        const allCodigos = new Set([
            ...CATALOGO_CRITERIOS_PNTP_2026.map((c) => c.codigo),
            ...dbItems.map((i) => i.codigo),
        ]);

        let merged = Array.from(allCodigos).map((codigo) => {
            const cat = CATALOGO_CRITERIOS_PNTP_2026.find((c) => c.codigo === codigo);
            const saved = dbMap.get(codigo);

            const ultimaVerificacao = saved?.dataUltimaVerificacao
                ? new Date(saved.dataUltimaVerificacao)
                : null;
            const atualizadoEm = saved?.atualizadoEm ? new Date(saved.atualizadoEm) : null;

            const refDate = ultimaVerificacao || atualizadoEm;
            const diasDesdeConferencia = refDate
                ? Math.floor((now - refDate.getTime()) / (1000 * 60 * 60 * 24))
                : null;

            const periodicidadeDias = saved?.periodicidadeDias ?? cat?.periodicidadeDias ?? 30;
            const prazoVencido =
                periodicidadeDias > 0 &&
                (diasDesdeConferencia === null || diasDesdeConferencia > periodicidadeDias);

            let exigencias: string[] = [];
            if (saved?.exigenciasCartilha) {
                try {
                    exigencias = JSON.parse(saved.exigenciasCartilha);
                } catch {
                    exigencias = cat?.exigenciasCartilha || [];
                }
            } else {
                exigencias = cat?.exigenciasCartilha || [];
            }

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

            // Parse resultado oficial do ciclo externo (Radar PNTP)
            let resultadoCiclo: any = null;
            if (saved?.resultadoAvaliacaoExterna && typeof saved.resultadoAvaliacaoExterna === "string") {
                try {
                    if (saved.resultadoAvaliacaoExterna.trim().startsWith("{")) {
                        resultadoCiclo = JSON.parse(saved.resultadoAvaliacaoExterna);
                    }
                } catch {}
            }

            if (!resultadoCiclo) {
                resultadoCiclo = {
                    ciclo: "2026",
                    classe: saved?.classificacao || cat?.classificacao || "Obrigatória",
                    disponibilidade: "S",
                    atualidade: "S",
                    serieHistorica: "S",
                    gravacaoRelatorio: "S",
                    filtro: "S",
                    tipoAcao: "Conferir",
                    evidenciaObs: "",
                    encaminhamento: "",
                    evidenciaRadar: saved?.evidenciaUrl || ""
                };
            }

            return {
                codigo,
                dimensao: saved?.dimensao || cat?.dimensao || "Informações Gerais",
                titulo: saved?.titulo || cat?.titulo || `Critério ${codigo}`,
                textoIntegral: saved?.textoIntegral || cat?.textoIntegral || "",
                classificacao: (saved?.classificacao || cat?.classificacao || "OBRIGATORIO") as "ESSENCIAL" | "OBRIGATORIO" | "RECOMENDADO",
                peso: saved?.peso ?? cat?.peso ?? 1.0,
                periodicidade: periodicidadeLabel,
                periodicidadeDias,
                exigenciasCartilha: exigencias,
                exigeDisponibilidade: exigencias.some((e: string) => e?.toLowerCase().includes("disponibilidade")),
                exigeAtualidade: exigencias.some((e: string) => e?.toLowerCase().includes("atualidade")),
                exigeSerieHistorica: exigencias.some((e: string) => e?.toLowerCase().includes("série") || e?.toLowerCase().includes("serie")),
                exigeGravacaoRelatorio: exigencias.some((e: string) => e?.toLowerCase().includes("relatório") || e?.toLowerCase().includes("relatorio") || e?.toLowerCase().includes("exporta")),
                exigeFiltroPesquisa: exigencias.some((e: string) => e?.toLowerCase().includes("filtro") || e?.toLowerCase().includes("pesquisa")),
                paginaPublica: saved?.paginaPublica || cat?.paginaPublica || "/transparencia",
                telaAdministrativa: saved?.telaAdministrativa || cat?.telaAdministrativa || "/admin",
                rotaPublica: saved?.paginaPublica || cat?.paginaPublica || "/transparencia",
                rotaAdmin: saved?.telaAdministrativa || cat?.telaAdministrativa || "/admin",
                secretariaResponsavel: saved?.secretariaResponsavel || cat?.secretariaResponsavel || "Controladoria Geral do Município",
                servidorResponsavel: saved?.verificadoPor || null,
                statusFuncionalidade: saved?.statusFuncionalidade || cat?.statusFuncionalidade || "implementada",
                statusConteudo: saved?.statusConteudo || cat?.statusConteudo || "publicado",
                statusEvidencia: saved?.statusEvidencia || cat?.statusEvidencia || "conferida",
                statusValidacao: saved?.statusValidacao || cat?.statusValidacao || "validado",
                resultadoAvaliacaoExterna: saved?.resultadoAvaliacaoExterna || cat?.resultadoAvaliacaoExterna || "Atendido",
                resultadoCiclo,
                evidenciaUrl: saved?.evidenciaUrl || null,
                observacoes: saved?.pendenciasConteudo || saved?.pendenciasTecnicas || cat?.pendenciasConteudo || null,
                ultimaAtualizacaoConteudo: atualizadoEm ? atualizadoEm.toISOString() : null,
                ultimaConferenciaEm: ultimaVerificacao ? ultimaVerificacao.toISOString() : null,
                diasDesdeConferencia,
                prazoVencido,
            };
        });

        // Ordenar por código numérico
        merged.sort((a, b) => {
            const [a1, a2] = a.codigo.split(".").map(Number);
            const [b1, b2] = b.codigo.split(".").map(Number);
            if (a1 !== b1) return (a1 || 0) - (b1 || 0);
            return (a2 || 0) - (b2 || 0);
        });

        // Cálculo consistente do Resumo
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
                "Índice calculado com base nos critérios auditados no ciclo PNTP 2026. A conferência interna exige registro obrigatório de evidência pública testada para homologação de conformidade.",
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
                    tipoSituacao: String(tipoDeclaracao),
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

        if (!codigo) {
            return NextResponse.json({ error: "Código do critério é obrigatório." }, { status: 400 });
        }

        // Exigir evidência registrada para homologar validação ou conferência (requisito PNTP)
        if ((statusValidacao === "validado" || acao === "conferir") && !evidenciaUrl) {
            return NextResponse.json(
                { error: "É obrigatório registrar o link da evidência pública testada para validar ou homologar a conferência deste critério." },
                { status: 400 }
            );
        }

        // Somente admin e controladoria podem aprovar statusValidacao = "validado"
        if (statusValidacao === "validado" && !["admin", "controladoria"].includes(auth.user.perfil)) {
            return NextResponse.json(
                { error: "Apenas a Controladoria Geral ou Administração pode homologar a validação final de um critério." },
                { status: 403 }
            );
        }

        const now = new Date();
        const isConferenciaSemAlteracao = acao === "conferir";

        const existing = await prisma.criterioPNTP.findUnique({
            where: { codigo }
        });

        const saved = await prisma.criterioPNTP.upsert({
            where: { codigo },
            create: {
                codigo,
                dimensao: body.dimensao || "Informações Gerais",
                titulo: body.titulo || `Critério ${codigo}`,
                textoIntegral: body.textoIntegral || body.titulo || "",
                classificacao: body.classificacao || "OBRIGATORIO",
                peso: body.peso || 1.0,
                periodicidadeDias: 30,
                exigenciasCartilha: JSON.stringify(["Disponibilidade", "Atualidade"]),
                paginaPublica: body.paginaPublica || "/transparencia",
                telaAdministrativa: body.telaAdministrativa || "/admin",
                secretariaResponsavel: secretariaResponsavel || "Controladoria Geral do Município",
                verificadoPor: servidorResponsavel || auth.user.nome,
                statusFuncionalidade: statusFuncionalidade || "implementada",
                statusConteudo: statusConteudo || "publicado",
                statusEvidencia: statusEvidencia || "conferida",
                statusValidacao: statusValidacao || "validado",
                resultadoAvaliacaoExterna: resultadoAvaliacaoExterna || existing?.resultadoAvaliacaoExterna || "Atendido",
                evidenciaUrl: evidenciaUrl || null,
                pendenciasConteudo: observacoes || null,
                dataUltimaVerificacao: now,
            },
            update: {
                ...(secretariaResponsavel !== undefined ? { secretariaResponsavel } : {}),
                verificadoPor: servidorResponsavel || auth.user.nome,
                ...(statusFuncionalidade !== undefined ? { statusFuncionalidade } : {}),
                ...(statusConteudo !== undefined ? { statusConteudo } : {}),
                ...(statusEvidencia !== undefined ? { statusEvidencia } : {}),
                ...(statusValidacao !== undefined ? { statusValidacao } : {}),
                // Preservar resultado oficial do ciclo a menos que explicitamente fornecido
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
                evidenciaUrl: saved.evidenciaUrl
            },
            user: auth.user,
        });

        return NextResponse.json(saved);
    } catch (error) {
        console.error("[API Admin PNTP POST]", error);
        return NextResponse.json({ error: "Erro ao salvar critério PNTP" }, { status: 500 });
    }
}
