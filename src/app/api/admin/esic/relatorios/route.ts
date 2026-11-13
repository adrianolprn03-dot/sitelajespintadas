export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";
import { MUNICIPIO } from "@/config/municipio";

const GRAUS_VALIDOS = new Set(["Reservado", "Secreto", "Ultrassecreto"]);

function limiteLegalAnos(grau: string): number {
    if (grau === "Ultrassecreto") return 25;
    if (grau === "Secreto") return 15;
    return 5;
}

function appendHistorico(
    historicoAtual: string | null | undefined,
    evento: string,
    detalhe: string
): string {
    let arr: Array<{ data: string; evento: string; detalhe: string }> = [];
    if (historicoAtual) {
        try {
            const parsed = JSON.parse(historicoAtual);
            if (Array.isArray(parsed)) arr = parsed;
        } catch {
            arr = [];
        }
    }
    arr.push({
        data: new Date().toISOString(),
        evento,
        detalhe,
    });
    return JSON.stringify(arr);
}

export async function GET() {
    try {
        const auth = await requireServerAuth(["admin", "controladoria", "esic"]);
        if (!auth.authorized) return auth.response;

        const ha12Meses = new Date();
        ha12Meses.setMonth(ha12Meses.getMonth() - 12);

        const [declaracoes, pedidos, classificados, desclassificados] = await Promise.all([
            prisma.declaracaoTransparencia.findMany({
                where: {
                    modulo: {
                        in: ["esic", "esic_classificadas", "esic_desclassificadas", "classificadas", "desclassificadas"],
                    },
                },
                orderBy: { dataEmissao: "desc" },
            }),
            prisma.esic.findMany({
                where: {
                    NOT: { protocolo: { startsWith: "CIDIC-" } },
                },
                orderBy: { criadoEm: "desc" },
                take: 100,
                select: {
                    id: true,
                    protocolo: true,
                    pedido: true,
                    orgao: true,
                    status: true,
                    grauSigilo: true,
                    criadoEm: true,
                },
            }),
            prisma.esic.findMany({
                where: {
                    NOT: { grauSigilo: "Sem Sigilo" },
                    dataDesclassificacao: null,
                },
                orderBy: [{ dataClassificacao: "desc" }, { criadoEm: "desc" }],
            }),
            prisma.esic.findMany({
                where: {
                    dataDesclassificacao: { not: null },
                },
                orderBy: { dataDesclassificacao: "desc" },
                take: 100,
            }),
        ]);

        const desclassificados12m = desclassificados.filter(
            (d) => d.dataDesclassificacao && d.dataDesclassificacao >= ha12Meses
        );

        return NextResponse.json({
            declaracoes,
            pedidos,
            classificados,
            desclassificados,
            totalDesclassificados12m: desclassificados12m.length,
        });
    } catch (error) {
        console.error("[API admin esic/relatorios GET]", error);
        return NextResponse.json({ error: "Erro ao carregar dados administrativos do e-SIC." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const auth = await requireServerAuth(["admin", "controladoria", "esic"]);
        if (!auth.authorized) return auth.response;

        const body = await req.json();

        // 1. Criar ou atualizar Declaração Oficial de Transparência / Inexistência
        if (body.tipoOperacao === "declaracao") {
            const {
                modulo,
                criterioPntp,
                exercicio,
                tipoSituacao,
                textoDeclaracao,
                fundamentoLegal,
                responsavelNome,
                responsavelCargo,
                arquivoAssinadoUrl,
            } = body;

            if (!modulo || !textoDeclaracao) {
                return NextResponse.json(
                    { error: "Módulo e texto da declaração são obrigatórios." },
                    { status: 400 }
                );
            }

            await prisma.declaracaoTransparencia.updateMany({
                where: { modulo, ativa: true },
                data: { ativa: false },
            });

            const criada = await prisma.declaracaoTransparencia.create({
                data: {
                    modulo,
                    criterioPntp: criterioPntp || null,
                    orgaoResponsavel: `Controladoria Geral — ${MUNICIPIO.nome}/${MUNICIPIO.uf}`,
                    exercicio: exercicio ? Number(exercicio) : new Date().getFullYear(),
                    tipoSituacao: tipoSituacao || "nao_ocorrencia_declarada",
                    textoDeclaracao: textoDeclaracao.trim(),
                    fundamentoLegal:
                        fundamentoLegal?.trim() || "Lei Federal nº 12.527/2011 (Art. 30)",
                    responsavelNome: responsavelNome?.trim() || auth.user.nome,
                    responsavelCargo: responsavelCargo?.trim() || "Controlador(a) / Responsável SIC",
                    arquivoAssinadoUrl: arquivoAssinadoUrl || null,
                    situacaoPublicacao: "publicado",
                    ativa: true,
                },
            });

            await registrarHistoricoAlteracao({
                entidade: "DeclaracaoTransparencia",
                entidadeId: criada.id,
                acao: "publicacao",
                resumoAlteracao: `Publicou declaração oficial do e-SIC (${modulo}).`,
                dadosNovos: { modulo, tipoSituacao: criada.tipoSituacao },
                user: auth.user,
            });

            return NextResponse.json({ declaracao: criada });
        }

        // 2. Registrar novo documento classificado diretamente no Rol (sem necessidade de pedido prévio)
        if (body.tipoOperacao === "registrar_documento_classificado") {
            const {
                assunto,
                categoria,
                orgao,
                grauSigilo,
                fundamentoSigilo,
                autoridadeClassificadora,
                dataClassificacao,
                prazoAnos,
                codigoIdentificacao,
            } = body;

            if (!assunto?.trim() || !fundamentoSigilo?.trim()) {
                return NextResponse.json(
                    { error: "Assunto da informação e dispositivo legal que fundamenta o sigilo são obrigatórios." },
                    { status: 400 }
                );
            }

            const grauFinal = GRAUS_VALIDOS.has(grauSigilo) ? grauSigilo : "Reservado";
            const maxLegal = limiteLegalAnos(grauFinal);
            const anosInformados = Number(prazoAnos);
            const anosFinal =
                !Number.isNaN(anosInformados) && anosInformados >= 1
                    ? Math.min(maxLegal, Math.round(anosInformados))
                    : maxLegal;

            const dataClass = dataClassificacao ? new Date(dataClassificacao) : new Date();
            const dataPrevista = new Date(dataClass);
            dataPrevista.setFullYear(dataPrevista.getFullYear() + anosFinal);

            const anoDoc = dataClass.getFullYear();
            const sufixo = Math.floor(100000 + Math.random() * 900000);
            const protocolo = `CIDIC-${anoDoc}-${sufixo}`;

            const categoriaLimpa = (categoria || "Administração Pública").trim();
            const orgaoLimpo = (orgao || `Prefeitura Municipal de ${MUNICIPIO.nome}`).trim();
            const orgaoFormatado = `[${categoriaLimpa}] - ${orgaoLimpo}`;

            const historicoInicial = JSON.stringify([
                {
                    data: dataClass.toISOString(),
                    evento: `Classificação de Documento (${grauFinal})`,
                    detalhe: `Prazo legal de ${anosFinal} ano(s) até ${dataPrevista.toLocaleDateString("pt-BR")}. Fundamento: ${fundamentoSigilo.trim()}`,
                },
            ]);

            const criado = await prisma.esic.create({
                data: {
                    protocolo,
                    codigoVerificacao: codigoIdentificacao?.trim() || protocolo,
                    orgao: orgaoFormatado,
                    pedido: assunto.trim(),
                    nome: "Registro Oficial de Documento Classificado",
                    email: "sic@lajespintadas.rn.gov.br",
                    formaRetorno: "Registro Administrativo",
                    status: "classificado",
                    grauSigilo: grauFinal,
                    fundamentoSigilo: fundamentoSigilo.trim(),
                    autoridadeClassificadora:
                        autoridadeClassificadora?.trim() || `${auth.user.nome} (Autoridade Competente)`,
                    dataClassificacao: dataClass,
                    prazo: dataPrevista,
                    historicoTramitacao: historicoInicial,
                },
            });

            await registrarHistoricoAlteracao({
                entidade: "Esic",
                entidadeId: criado.id,
                acao: "criacao",
                resumoAlteracao: `Registrou documento classificado ${criado.protocolo} em grau ${grauFinal} (${anosFinal} anos).`,
                dadosNovos: {
                    protocolo: criado.protocolo,
                    grauSigilo: criado.grauSigilo,
                    categoria: categoriaLimpa,
                    prazoAnos: anosFinal,
                },
                secretaria: orgaoLimpo,
                user: auth.user,
            });

            return NextResponse.json({ item: criado });
        }

        // 3. Classificar pedido existente ou atualizar classificação
        if (body.tipoOperacao === "classificar") {
            const {
                id,
                grauSigilo,
                fundamentoSigilo,
                autoridadeClassificadora,
                dataClassificacao,
                categoria,
                orgao,
                assuntoPublicavel,
                prazoAnos,
            } = body;

            if (!id || !fundamentoSigilo?.trim()) {
                return NextResponse.json(
                    { error: "Registro e dispositivo legal fundamentador são obrigatórios." },
                    { status: 400 }
                );
            }

            const atual = await prisma.esic.findUnique({ where: { id } });
            if (!atual) {
                return NextResponse.json({ error: "Registro não encontrado." }, { status: 404 });
            }

            const grauFinal = GRAUS_VALIDOS.has(grauSigilo) ? grauSigilo : "Reservado";
            const dataClass = dataClassificacao ? new Date(dataClassificacao) : new Date();
            const isDocInterno = atual.protocolo.startsWith("CIDIC-");

            let novaOrgao = atual.orgao;
            if (categoria?.trim() || orgao?.trim()) {
                const cat = (categoria || "Administração Pública").trim();
                const org = (orgao || atual.orgao || `Prefeitura Municipal de ${MUNICIPIO.nome}`).trim();
                novaOrgao = categoria?.trim() ? `[${cat}] - ${org}` : org;
            }

            let novoPrazo = atual.prazo;
            if (isDocInterno) {
                const maxLegal = limiteLegalAnos(grauFinal);
                const anosInformados = Number(prazoAnos);
                const anosFinal =
                    !Number.isNaN(anosInformados) && anosInformados >= 1
                        ? Math.min(maxLegal, Math.round(anosInformados))
                        : maxLegal;
                const d = new Date(dataClass);
                d.setFullYear(d.getFullYear() + anosFinal);
                novoPrazo = d;
            }

            const updated = await prisma.esic.update({
                where: { id },
                data: {
                    grauSigilo: grauFinal,
                    fundamentoSigilo: fundamentoSigilo.trim(),
                    autoridadeClassificadora:
                        autoridadeClassificadora?.trim() || atual.autoridadeClassificadora || auth.user.nome,
                    dataClassificacao: dataClass,
                    dataDesclassificacao: null,
                    orgao: novaOrgao,
                    pedido: assuntoPublicavel?.trim() || atual.pedido,
                    prazo: novoPrazo,
                    historicoTramitacao: appendHistorico(
                        atual.historicoTramitacao,
                        `Classificação de Sigilo (${grauFinal})`,
                        `Fundamento: ${fundamentoSigilo.trim()}`
                    ),
                },
            });

            await registrarHistoricoAlteracao({
                entidade: "Esic",
                entidadeId: updated.id,
                acao: "edicao",
                resumoAlteracao: `Classificou ${updated.protocolo} em grau ${grauFinal}.`,
                dadosAnteriores: { grauSigilo: atual.grauSigilo },
                dadosNovos: { grauSigilo: updated.grauSigilo, fundamentoSigilo: updated.fundamentoSigilo },
                user: auth.user,
            });

            return NextResponse.json({ item: updated });
        }

        // 4. Desclassificar informação ou documento (passa a integrar a lista dos últimos 12 meses)
        if (body.tipoOperacao === "desclassificar") {
            const { id, dataDesclassificacao, justificativa } = body;
            if (!id) {
                return NextResponse.json({ error: "Identificador do registro é obrigatório." }, { status: 400 });
            }

            const atual = await prisma.esic.findUnique({ where: { id } });
            if (!atual) {
                return NextResponse.json({ error: "Registro não encontrado." }, { status: 404 });
            }

            const dataDesc = dataDesclassificacao ? new Date(dataDesclassificacao) : new Date();
            const atoTexto = justificativa?.trim()
                ? `Desclassificação registrada em ${dataDesc.toLocaleDateString("pt-BR")}: ${justificativa.trim()}`
                : `Desclassificação por término de prazo ou reavaliação em ${dataDesc.toLocaleDateString("pt-BR")} (Lei nº 12.527/2011).`;

            const updated = await prisma.esic.update({
                where: { id },
                data: {
                    dataDesclassificacao: dataDesc,
                    resposta: atual.protocolo.startsWith("CIDIC-") ? atoTexto : atual.resposta || atoTexto,
                    historicoTramitacao: appendHistorico(
                        atual.historicoTramitacao,
                        "Desclassificação de Informação (LAI Art. 30, I)",
                        atoTexto
                    ),
                },
            });

            await registrarHistoricoAlteracao({
                entidade: "Esic",
                entidadeId: updated.id,
                acao: "publicacao",
                resumoAlteracao: `Desclassificou ${updated.protocolo} (grau anterior: ${atual.grauSigilo}).`,
                dadosAnteriores: { grauSigilo: atual.grauSigilo, dataDesclassificacao: atual.dataDesclassificacao },
                dadosNovos: { dataDesclassificacao: updated.dataDesclassificacao, ato: atoTexto },
                user: auth.user,
            });

            return NextResponse.json({ item: updated });
        }

        return NextResponse.json({ error: "Operação inválida." }, { status: 400 });
    } catch (error) {
        console.error("[API admin esic/relatorios POST]", error);
        return NextResponse.json({ error: "Erro ao salvar operação do e-SIC." }, { status: 500 });
    }
}
