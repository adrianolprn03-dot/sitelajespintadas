export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Consulta pública de protocolo (e-SIC e Ouvidoria).
 * Nunca retorna dados pessoais do solicitante (nome, e-mail, CPF, cidadaoId) em resposta pública.
 * Caso o registro possua código verificador ou e-mail e o usuário informe o verificador, valida a correspondência.
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const protocolo = searchParams.get("protocolo")?.trim();
    const verificador = searchParams.get("verificador")?.trim().toLowerCase();

    if (!protocolo) {
        return NextResponse.json({ error: "Protocolo é obrigatório." }, { status: 400 });
    }

    try {
        // 1. Busca na Ouvidoria
        const ouvidoria = await prisma.ouvidoria.findUnique({
            where: { protocolo },
        });

        if (ouvidoria) {
            if (verificador && ouvidoria.email && ouvidoria.codigoVerificacao) {
                const matchEmail = ouvidoria.email.toLowerCase() === verificador;
                const matchPin = ouvidoria.codigoVerificacao.toLowerCase() === verificador;
                if (!matchEmail && !matchPin) {
                    return NextResponse.json(
                        { error: "Código verificador ou e-mail não corresponde ao protocolo informado." },
                        { status: 403 }
                    );
                }
            }

            return NextResponse.json({
                tipoBusca: "ouvidoria",
                data: {
                    protocolo: ouvidoria.protocolo,
                    status: ouvidoria.status,
                    tipo: ouvidoria.tipo,
                    assunto: ouvidoria.assunto,
                    descricao: ouvidoria.descricao,
                    resposta: ouvidoria.resposta,
                    respondidoEm: ouvidoria.respondidoEm,
                    criadoEm: ouvidoria.criadoEm,
                    prazo: ouvidoria.prazo,
                    prorrogado: ouvidoria.prorrogado,
                    justificativaPrazo: ouvidoria.justificativaPrazo,
                    anexoResposta: ouvidoria.anexoResposta,
                    recurso: ouvidoria.recurso,
                    dataRecurso: ouvidoria.dataRecurso,
                    respostaRecurso: ouvidoria.respostaRecurso,
                    dataRespostaRecurso: ouvidoria.dataRespostaRecurso,
                    historicoTramitacao: ouvidoria.historicoTramitacao,
                },
            });
        }

        // 2. Busca no e-SIC
        const esic = await prisma.esic.findUnique({
            where: { protocolo },
        });

        if (esic) {
            if (verificador && (esic.email || esic.codigoVerificacao)) {
                const matchEmail = esic.email ? esic.email.toLowerCase() === verificador : false;
                const matchPin = esic.codigoVerificacao ? esic.codigoVerificacao.toLowerCase() === verificador : false;
                if (!matchEmail && !matchPin) {
                    return NextResponse.json(
                        { error: "Código verificador ou e-mail não corresponde ao protocolo informado." },
                        { status: 403 }
                    );
                }
            }

            return NextResponse.json({
                tipoBusca: "esic",
                data: {
                    protocolo: esic.protocolo,
                    status: esic.status,
                    orgao: esic.orgao,
                    pedido: esic.pedido,
                    formaRetorno: esic.formaRetorno,
                    grauSigilo: esic.grauSigilo,
                    resposta: esic.resposta,
                    respondidoEm: esic.respondidoEm,
                    criadoEm: esic.criadoEm,
                    prazo: esic.prazo,
                    prorrogado: esic.prorrogado,
                    justificativaProrrogacao: esic.justificativaProrrogacao,
                    anexoResposta: esic.anexoResposta,
                    recurso: esic.recurso,
                    dataRecurso: esic.dataRecurso,
                    respostaRecurso: esic.respostaRecurso,
                    dataRespostaRecurso: esic.dataRespostaRecurso,
                    recursoSegundaInstancia: esic.recursoSegundaInstancia,
                    dataRecursoSegunda: esic.dataRecursoSegunda,
                    respostaRecursoSegunda: esic.respostaRecursoSegunda,
                    dataRespostaSegunda: esic.dataRespostaSegunda,
                    historicoTramitacao: esic.historicoTramitacao,
                },
            });
        }

        return NextResponse.json({ error: "Protocolo não encontrado." }, { status: 404 });
    } catch {
        return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
    }
}
