export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MUNICIPIO } from "@/config/municipio";

const MESES_PT = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

type DistribuicaoItem = {
    label: string;
    quantidade: number;
    percentual: number;
};

function calcularDistribuicao(
    valores: Array<string | null | undefined>,
    fallback = "Não informado",
    maxItens?: number
): DistribuicaoItem[] {
    const total = valores.length;
    if (total === 0) return [];

    const contagem = new Map<string, number>();
    for (const raw of valores) {
        const chave = raw && raw.trim() ? raw.trim() : fallback;
        contagem.set(chave, (contagem.get(chave) || 0) + 1);
    }

    let lista = Array.from(contagem.entries())
        .map(([label, quantidade]) => ({
            label,
            quantidade,
            percentual: Math.round((quantidade / total) * 1000) / 10,
        }))
        .sort((a, b) => b.quantidade - a.quantidade);

    if (maxItens && lista.length > maxItens) {
        const principais = lista.slice(0, maxItens);
        const outrosQtd = lista.slice(maxItens).reduce((acc, i) => acc + i.quantidade, 0);
        if (outrosQtd > 0) {
            principais.push({
                label: "Outros",
                quantidade: outrosQtd,
                percentual: Math.round((outrosQtd / total) * 1000) / 10,
            });
        }
        lista = principais;
    }

    return lista;
}

function classificarTipoSolicitante(p: {
    nome?: string | null;
    email?: string | null;
    cidadao?: { tipoPessoa?: string | null; cnpj?: string | null } | null;
}): "PF" | "PJ" | "ANONIMO" {
    if (p.cidadao) {
        const tp = (p.cidadao.tipoPessoa || "").toLowerCase();
        if (tp.includes("jur") || tp === "pj" || Boolean(p.cidadao.cnpj)) {
            return "PJ";
        }
        return "PF";
    }

    const nomeLower = (p.nome || "").trim().toLowerCase();
    const emailLower = (p.email || "").trim().toLowerCase();
    if (
        !nomeLower ||
        nomeLower.includes("anônim") ||
        nomeLower.includes("anonim") ||
        nomeLower.includes("não identificad") ||
        emailLower.includes("anonim")
    ) {
        return "ANONIMO";
    }
    return "PF";
}

function extrairCategoriaEOrgao(orgaoRaw?: string | null): { categoria: string; orgao: string; combinado: string } {
    const texto = (orgaoRaw || "").trim();
    if (!texto) {
        return {
            categoria: "Administração Pública",
            orgao: `Prefeitura Municipal de ${MUNICIPIO.nome}`,
            combinado: "Administração Pública",
        };
    }

    const matchPrefixo = texto.match(/^\[([^\]]+)\]\s*[-–|]?\s*(.*)$/);
    if (matchPrefixo) {
        const categoria = matchPrefixo[1].trim() || "Administração Pública";
        const orgao = matchPrefixo[2].trim() || `Prefeitura Municipal de ${MUNICIPIO.nome}`;
        return {
            categoria,
            orgao,
            combinado: `${categoria} • ${orgao}`,
        };
    }

    return {
        categoria: texto,
        orgao: texto,
        combinado: texto,
    };
}

function prazoMaximoPorGrau(grau?: string | null): number {
    const g = (grau || "").toLowerCase();
    if (g.includes("ultrassecreto")) return 25;
    if (g.includes("secreto")) return 15;
    return 5;
}

function calcularPrazoClassificacao(p: {
    protocolo: string;
    grauSigilo: string;
    dataClassificacao: Date | null;
    criadoEm: Date;
    prazo: Date | null;
}): {
    dataClass: Date;
    prazoRestricaoAnos: number;
    dataPrevistaDesclassificacao: Date;
    prazoTexto: string;
} {
    const dataClass = p.dataClassificacao || p.criadoEm;
    const isDocumentoInterno = p.protocolo.startsWith("CIDIC-");

    let prazoAnos = prazoMaximoPorGrau(p.grauSigilo);
    let dataPrevista = new Date(dataClass);
    dataPrevista.setFullYear(dataPrevista.getFullYear() + prazoAnos);

    if (isDocumentoInterno && p.prazo && p.prazo.getTime() > dataClass.getTime()) {
        dataPrevista = p.prazo;
        const diffAnos = Math.max(
            1,
            Math.round((p.prazo.getTime() - dataClass.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
        );
        prazoAnos = Math.min(25, diffAnos);
    }

    const prazoTexto = `${prazoAnos} ${prazoAnos === 1 ? "ano" : "anos"} (até ${dataPrevista.toLocaleDateString("pt-BR")})`;
    return {
        dataClass,
        prazoRestricaoAnos: prazoAnos,
        dataPrevistaDesclassificacao: dataPrevista,
        prazoTexto,
    };
}

function calcularEstatisticasGrupo(
    pedidos: Array<{
        status: string;
        orgao: string | null;
        formaRetorno: string;
        nome: string | null;
        email: string | null;
        respondidoEm: Date | null;
        criadoEm: Date;
        recurso: string | null;
        respostaRecurso: string | null;
        recursoSegundaInstancia: string | null;
        respostaRecursoSegunda: string | null;
        cidadao: {
            tipoPessoa: string;
            cnpj: string | null;
            sexo: string | null;
            escolaridade: string | null;
            profissao: string | null;
            cidade: string | null;
            uf: string | null;
        } | null;
    }>
) {
    const totalRecebidos = pedidos.length;

    const statusIndeferidos = new Set(["indeferido", "negado", "rejeitado"]);
    const statusAtendidos = new Set(["concluido", "encerrado", "deferido", "atendido"]);

    const indeferidos = pedidos.filter((p) =>
        statusIndeferidos.has((p.status || "").trim().toLowerCase())
    ).length;

    const atendidos = pedidos.filter((p) => {
        const st = (p.status || "").trim().toLowerCase();
        if (statusIndeferidos.has(st)) return false;
        return statusAtendidos.has(st) || p.respondidoEm !== null;
    }).length;

    const emTramitacao = Math.max(0, totalRecebidos - atendidos - indeferidos);

    let somaDias = 0;
    let comResposta = 0;
    for (const p of pedidos) {
        if (p.respondidoEm && p.criadoEm) {
            const diffDias = (p.respondidoEm.getTime() - p.criadoEm.getTime()) / (1000 * 60 * 60 * 24);
            if (diffDias >= 0) {
                somaDias += diffDias;
                comResposta++;
            }
        }
    }

    const tempoMedioDias = comResposta > 0 ? Math.round((somaDias / comResposta) * 10) / 10 : 0;
    const taxaAtendimento = totalRecebidos > 0 ? Math.round((atendidos / totalRecebidos) * 100) : 0;
    const taxaResolucao =
        totalRecebidos > 0 ? Math.round(((atendidos + indeferidos) / totalRecebidos) * 100) : 0;

    let pessoaFisica = 0;
    let pessoaJuridica = 0;
    let anonimoNaoIdentificado = 0;

    for (const p of pedidos) {
        const tipo = classificarTipoSolicitante(p);
        if (tipo === "PJ") pessoaJuridica++;
        else if (tipo === "ANONIMO") anonimoNaoIdentificado++;
        else pessoaFisica++;
    }

    const primeiraInstancia = pedidos.filter((p) => Boolean(p.recurso)).length;
    const segundaInstancia = pedidos.filter((p) => Boolean(p.recursoSegundaInstancia)).length;
    const recursosInterpostos = pedidos.filter(
        (p) => Boolean(p.recurso) || Boolean(p.recursoSegundaInstancia)
    ).length;
    const recursosRespondidos = pedidos.filter(
        (p) => Boolean(p.respostaRecurso) || Boolean(p.respostaRecursoSegunda)
    ).length;
    const recursosPendentes = Math.max(0, recursosInterpostos - recursosRespondidos);

    const porMes = MESES_PT.map((nomeMes, idx) => {
        const noMes = pedidos.filter((p) => new Date(p.criadoEm).getMonth() === idx);
        const indefMes = noMes.filter((p) =>
            statusIndeferidos.has((p.status || "").trim().toLowerCase())
        ).length;
        const atendMes = noMes.filter((p) => {
            const st = (p.status || "").trim().toLowerCase();
            if (statusIndeferidos.has(st)) return false;
            return statusAtendidos.has(st) || p.respondidoEm !== null;
        }).length;

        return {
            mes: idx + 1,
            nomeMes,
            recebidos: noMes.length,
            atendidos: atendMes,
            indeferidos: indefMes,
            emTramitacao: Math.max(0, noMes.length - atendMes - indefMes),
        };
    });

    const detalhamento = {
        porTipoPessoa: [
            {
                label: "Pessoa Física",
                quantidade: pessoaFisica,
                percentual: totalRecebidos > 0 ? Math.round((pessoaFisica / totalRecebidos) * 1000) / 10 : 0,
            },
            {
                label: "Pessoa Jurídica",
                quantidade: pessoaJuridica,
                percentual: totalRecebidos > 0 ? Math.round((pessoaJuridica / totalRecebidos) * 1000) / 10 : 0,
            },
            {
                label: "Anônimo / Identificação Simplificada",
                quantidade: anonimoNaoIdentificado,
                percentual:
                    totalRecebidos > 0 ? Math.round((anonimoNaoIdentificado / totalRecebidos) * 1000) / 10 : 0,
            },
        ].filter((item) => item.quantidade > 0 || totalRecebidos === 0),
        porEscolaridade: calcularDistribuicao(
            pedidos.map((p) => p.cidadao?.escolaridade),
            "Não informado",
            6
        ),
        porGenero: calcularDistribuicao(
            pedidos.map((p) => p.cidadao?.sexo),
            "Não informado",
            5
        ),
        porOcupacao: calcularDistribuicao(
            pedidos.map((p) => p.cidadao?.profissao),
            "Não informado",
            6
        ),
        porLocalidade: calcularDistribuicao(
            pedidos.map((p) =>
                p.cidadao?.cidade
                    ? `${p.cidadao.cidade}${p.cidadao.uf ? `/${p.cidadao.uf}` : ""}`
                    : null
            ),
            "Não informado",
            6
        ),
        porFormaRetorno: calcularDistribuicao(
            pedidos.map((p) => p.formaRetorno),
            "Sistema Eletrônico / E-mail",
            5
        ),
        porOrgao: calcularDistribuicao(
            pedidos.map((p) => extrairCategoriaEOrgao(p.orgao).orgao),
            "Secretaria Geral / Gabinete",
            8
        ),
    };

    return {
        totalRecebidos,
        atendidos,
        indeferidos,
        emTramitacao,
        tempoMedioDias,
        taxaAtendimento,
        taxaResolucao,
        perfilSolicitantes: {
            pessoaFisica,
            pessoaJuridica,
            anonimoNaoIdentificado,
            detalhamento,
        },
        recursos: {
            interpostos: recursosInterpostos,
            primeiraInstancia,
            segundaInstancia,
            respondidos: recursosRespondidos,
            pendentes: recursosPendentes,
            deferidos: recursosRespondidos,
        },
        porMes,
    };
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const tipo = searchParams.get("tipo") || "estatisticas";
        const anoParam = searchParams.get("ano");
        const grauParam = searchParams.get("grau");

        if (tipo === "estatisticas") {
            const anoAtual = Math.max(2026, new Date().getFullYear());
            const allRegistros = await prisma.esic.findMany({
                orderBy: { criadoEm: "desc" },
                include: {
                    cidadao: {
                        select: {
                            tipoPessoa: true,
                            cnpj: true,
                            sexo: true,
                            escolaridade: true,
                            profissao: true,
                            cidade: true,
                            uf: true,
                        },
                    },
                },
            });

            // Registros iniciados por CIDIC- representam documentos internos classificados no rol
            // e não pedidos de acesso protocolados por cidadãos.
            const allPedidos = allRegistros.filter((p) => !p.protocolo.startsWith("CIDIC-"));

            const anosSet = new Set<number>();
            for (let y = 2021; y <= anoAtual; y++) anosSet.add(y);
            for (const p of allPedidos) {
                anosSet.add(new Date(p.criadoEm).getFullYear());
            }
            const exercicios = Array.from(anosSet).sort((a, b) => a - b);

            const statsPorExercicio = exercicios.map((ex) => {
                const pedidosAno = allPedidos.filter((p) => new Date(p.criadoEm).getFullYear() === ex);
                return {
                    exercicio: ex,
                    ...calcularEstatisticasGrupo(pedidosAno),
                };
            });

            const consolidadoHistorico = calcularEstatisticasGrupo(allPedidos);

            return NextResponse.json({
                stats: statsPorExercicio,
                exerciciosDisponiveis: exercicios,
                consolidadoHistorico,
                resumoExecutivo: {
                    totalGeralRecebidos: allPedidos.length,
                    totalGeralAtendidos: consolidadoHistorico.atendidos,
                    totalGeralIndeferidos: consolidadoHistorico.indeferidos,
                    totalGeralEmTramitacao: consolidadoHistorico.emTramitacao,
                    exercicioAtual: anoAtual,
                    ultimaAtualizacao: new Date().toISOString(),
                },
            });
        }

        if (tipo === "classificadas") {
            const todosClassificados = await prisma.esic.findMany({
                where: {
                    NOT: { grauSigilo: "Sem Sigilo" },
                    dataDesclassificacao: null,
                },
                orderBy: [{ dataClassificacao: "desc" }, { criadoEm: "desc" }],
            });

            const anosSet = new Set<number>([new Date().getFullYear()]);
            for (const p of todosClassificados) {
                anosSet.add(new Date(p.dataClassificacao || p.criadoEm).getFullYear());
            }

            let filtrados = todosClassificados;
            if (anoParam && anoParam !== "TODOS") {
                const anoNum = Number(anoParam);
                if (!Number.isNaN(anoNum)) {
                    filtrados = filtrados.filter(
                        (p) => new Date(p.dataClassificacao || p.criadoEm).getFullYear() === anoNum
                    );
                }
            }

            if (grauParam && grauParam !== "TODOS") {
                const grauLower = grauParam.trim().toLowerCase();
                filtrados = filtrados.filter(
                    (p) => (p.grauSigilo || "").trim().toLowerCase() === grauLower
                );
            }

            const mapeados = filtrados.map((p) => {
                const { dataClass, prazoRestricaoAnos, dataPrevistaDesclassificacao, prazoTexto } =
                    calcularPrazoClassificacao(p);
                const { categoria, orgao, combinado } = extrairCategoriaEOrgao(p.orgao);
                const isDocumentoInterno = p.protocolo.startsWith("CIDIC-");

                return {
                    id: p.id,
                    protocolo: p.protocolo,
                    codigoIdentificacao: p.codigoVerificacao || p.protocolo,
                    isDocumentoInterno,
                    assunto: p.pedido,
                    assuntoPublicavel: p.pedido,
                    categoria,
                    orgao,
                    categoriaOrgao: combinado,
                    grauSigilo: p.grauSigilo,
                    dispositivoLegal:
                        p.fundamentoSigilo || "Lei Federal nº 12.527/2011 (Art. 23 e Art. 24)",
                    fundamentoLegal:
                        p.fundamentoSigilo || "Lei Federal nº 12.527/2011 (Art. 23 e Art. 24)",
                    autoridadeClassificadora:
                        p.autoridadeClassificadora || "Autoridade Competente Municipal",
                    dataClassificacao: dataClass.toISOString(),
                    prazoRestricaoAnos,
                    prazoTexto,
                    dataPrevistaDesclassificacao: dataPrevistaDesclassificacao.toISOString(),
                    documentoUrl: isDocumentoInterno
                        ? null
                        : `/servicos/consulta-protocolo?protocolo=${encodeURIComponent(p.protocolo)}`,
                };
            });

            const contarPorGrau = (lista: typeof todosClassificados) => ({
                reservado: lista.filter((p) => p.grauSigilo.toLowerCase() === "reservado").length,
                secreto: lista.filter((p) => p.grauSigilo.toLowerCase() === "secreto").length,
                ultrassecreto: lista.filter((p) => p.grauSigilo.toLowerCase() === "ultrassecreto").length,
                total: lista.length,
            });

            const declaracaoAtiva = await prisma.declaracaoTransparencia.findFirst({
                where: {
                    modulo: { in: ["esic_classificadas", "classificadas"] },
                    ativa: true,
                },
                orderBy: { dataEmissao: "desc" },
            });

            const statsPorGrau = contarPorGrau(filtrados);
            const statsGlobalPorGrau = contarPorGrau(todosClassificados);

            return NextResponse.json({
                total: mapeados.length,
                totalGeral: todosClassificados.length,
                itens: mapeados,
                anosDisponiveis: Array.from(anosSet).sort((a, b) => b - a),
                statsPorGrau,
                statsGlobalPorGrau,
                declaracaoInexistencia: declaracaoAtiva
                    ? {
                          situacao: declaracaoAtiva.tipoSituacao,
                          texto: declaracaoAtiva.textoDeclaracao,
                          fundamentoLegal: declaracaoAtiva.fundamentoLegal,
                          responsavel: `${declaracaoAtiva.responsavelNome} (${declaracaoAtiva.responsavelCargo})`,
                          dataEmissao: declaracaoAtiva.dataEmissao.toISOString(),
                      }
                    : {
                          situacao: "sem_registro",
                          texto: `Declaramos, em cumprimento ao disposto no art. 30, inciso II, da Lei Federal nº 12.527/2011 (Lei de Acesso à Informação), que ${
                              statsGlobalPorGrau.total === 0
                                  ? `não constam documentos ou informações administrativas classificadas em grau de sigilo (Reservado, Secreto ou Ultrassecreto) vigentes no âmbito da Prefeitura Municipal de ${MUNICIPIO.nome}/${MUNICIPIO.uf} até a presente data, vigorando o princípio constitucional da publicidade máxima.`
                                  : `estão publicados neste rol todos os documentos formalmente classificados por grau de sigilo vigentes na Administração Municipal, com indicação do assunto, categoria, dispositivo legal e prazo de restrição.`
                          }`,
                          fundamentoLegal:
                              "Art. 30, inciso II, e Art. 24 da Lei Federal nº 12.527/2011 (LAI)",
                          responsavel: `Controladoria Geral / Autoridade de Monitoramento da LAI — ${MUNICIPIO.nome}/${MUNICIPIO.uf}`,
                          dataEmissao: new Date().toISOString(),
                      },
            });
        }

        if (tipo === "desclassificadas") {
            const fimPeriodo = new Date();
            const inicioPeriodo = new Date(fimPeriodo);
            inicioPeriodo.setMonth(inicioPeriodo.getMonth() - 12);

            const desclassificados12Meses = await prisma.esic.findMany({
                where: {
                    dataDesclassificacao: {
                        gte: inicioPeriodo,
                    },
                },
                orderBy: { dataDesclassificacao: "desc" },
            });

            const anosSet = new Set<number>([new Date().getFullYear()]);
            for (const p of desclassificados12Meses) {
                if (p.dataDesclassificacao) {
                    anosSet.add(new Date(p.dataDesclassificacao).getFullYear());
                }
            }

            let filtrados = desclassificados12Meses;
            if (anoParam && anoParam !== "TODOS") {
                const anoNum = Number(anoParam);
                if (!Number.isNaN(anoNum)) {
                    filtrados = filtrados.filter(
                        (p) =>
                            p.dataDesclassificacao &&
                            new Date(p.dataDesclassificacao).getFullYear() === anoNum
                    );
                }
            }

            const mapeados = filtrados.map((p) => {
                const { categoria, orgao, combinado } = extrairCategoriaEOrgao(p.orgao);
                const isDocumentoInterno = p.protocolo.startsWith("CIDIC-");

                return {
                    id: p.id,
                    protocolo: p.protocolo,
                    codigoIdentificacao: p.codigoVerificacao || p.protocolo,
                    isDocumentoInterno,
                    assunto: p.pedido,
                    assuntoPublicavel: p.pedido,
                    categoria,
                    orgao,
                    categoriaOrgao: combinado,
                    grauSigiloOriginal:
                        p.grauSigilo && p.grauSigilo !== "Sem Sigilo"
                            ? p.grauSigilo
                            : "Reservado",
                    dispositivoLegal:
                        p.fundamentoSigilo || "Lei Federal nº 12.527/2011 (Art. 24 e Art. 29)",
                    autoridadeClassificadora:
                        p.autoridadeClassificadora || "Controladoria / Autoridade Competente",
                    dataClassificacaoOriginal: (p.dataClassificacao || p.criadoEm).toISOString(),
                    dataDesclassificacao: p.dataDesclassificacao!.toISOString(),
                    atoDesclassificacao:
                        p.resposta || "Término de prazo ou reavaliação administrativa de sigilo",
                    documentoUrl: isDocumentoInterno
                        ? null
                        : `/servicos/consulta-protocolo?protocolo=${encodeURIComponent(p.protocolo)}`,
                };
            });

            const declaracaoAtiva = await prisma.declaracaoTransparencia.findFirst({
                where: {
                    modulo: { in: ["esic_desclassificadas", "desclassificadas"] },
                    ativa: true,
                },
                orderBy: { dataEmissao: "desc" },
            });

            return NextResponse.json({
                total: mapeados.length,
                totalUltimos12Meses: desclassificados12Meses.length,
                itens: mapeados,
                periodoInicio: inicioPeriodo.toISOString(),
                periodoFim: fimPeriodo.toISOString(),
                anosDisponiveis: Array.from(anosSet).sort((a, b) => b - a),
                declaracaoOficial: declaracaoAtiva
                    ? {
                          situacao: declaracaoAtiva.tipoSituacao,
                          texto: declaracaoAtiva.textoDeclaracao,
                          fundamentoLegal: declaracaoAtiva.fundamentoLegal,
                          responsavel: `${declaracaoAtiva.responsavelNome} (${declaracaoAtiva.responsavelCargo})`,
                          dataEmissao: declaracaoAtiva.dataEmissao.toISOString(),
                          arquivoAssinadoUrl: declaracaoAtiva.arquivoAssinadoUrl || null,
                      }
                    : {
                          situacao: "sem_desclassificacoes_12m",
                          texto: `Declaramos, em atendimento ao Art. 30, inciso I, da Lei Federal nº 12.527/2011 (Lei de Acesso à Informação), que nos últimos 12 (doze) meses (${inicioPeriodo.toLocaleDateString("pt-BR")} a ${fimPeriodo.toLocaleDateString("pt-BR")}) ${
                              desclassificados12Meses.length === 0
                                  ? `não houve documentos ou informações públicas desclassificadas no âmbito do Poder Executivo de ${MUNICIPIO.nome}/${MUNICIPIO.uf}, mantendo-se o regime geral de acesso pleno às informações públicas.`
                                  : `foram devidamente publicadas neste rol todas as ${desclassificados12Meses.length} informações que passaram por processo de desclassificação no período.`
                          }`,
                          fundamentoLegal:
                              "Art. 30, inciso I, da Lei Federal nº 12.527/2011 (Lei de Acesso à Informação)",
                          responsavel: `Controladoria Geral do Município — ${MUNICIPIO.nome}/${MUNICIPIO.uf}`,
                          dataEmissao: new Date().toISOString(),
                          arquivoAssinadoUrl: null,
                      },
            });
        }

        return NextResponse.json(
            { error: "Tipo de relatório inválido. Utilize: estatisticas, classificadas ou desclassificadas." },
            { status: 400 }
        );
    } catch (error) {
        console.error("[API esic-relatorios GET]", error);
        return NextResponse.json({ error: "Erro ao processar relatório do e-SIC" }, { status: 500 });
    }
}
