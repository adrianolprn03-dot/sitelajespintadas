export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth, canAccessEsicPersonalData } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";
import { MUNICIPIO } from "@/config/municipio";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireServerAuth(["admin", "controladoria", "esic", "editor"]);
    if (!auth.authorized) return auth.response;

    try {
        const item = await prisma.esic.findUnique({ where: { id: params.id } });
        if (!item) return jsonNoStore({ error: "Não encontrado" }, { status: 404 });

        if (!canAccessEsicPersonalData(auth.user)) {
            return jsonNoStore({
                ...item,
                nome: item.nome ? "Solicitante Protegido (LGPD)" : "Anônimo",
                email: null,
                codigoVerificacao: null,
            });
        }
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireServerAuth(["admin", "controladoria", "esic", "editor"]);
    if (!auth.authorized) return auth.response;

    try {
        const atual = await prisma.esic.findUnique({ where: { id: params.id } });
        if (!atual) return jsonNoStore({ error: "Pedido não encontrado" }, { status: 404 });

        const body = await req.json();
        const updateData: any = {};

        if (body.status !== undefined) updateData.status = String(body.status);
        if (body.orgao !== undefined) updateData.orgao = String(body.orgao);
        if (body.grauSigilo !== undefined) updateData.grauSigilo = String(body.grauSigilo);
        if (body.fundamentoSigilo !== undefined) updateData.fundamentoSigilo = body.fundamentoSigilo || null;
        if (body.autoridadeClassificadora !== undefined) updateData.autoridadeClassificadora = body.autoridadeClassificadora || null;
        if (body.dataClassificacao !== undefined) updateData.dataClassificacao = body.dataClassificacao ? new Date(body.dataClassificacao) : null;
        if (body.dataDesclassificacao !== undefined) updateData.dataDesclassificacao = body.dataDesclassificacao ? new Date(body.dataDesclassificacao) : null;
        if (body.resposta !== undefined) updateData.resposta = body.resposta || null;
        if (body.anexoResposta !== undefined) updateData.anexoResposta = body.anexoResposta || null;
        if (body.prorrogado !== undefined) updateData.prorrogado = Boolean(body.prorrogado);
        if (body.justificativaProrrogacao !== undefined) updateData.justificativaProrrogacao = body.justificativaProrrogacao || null;
        if (body.recurso !== undefined) updateData.recurso = body.recurso || null;
        if (body.respostaRecurso !== undefined) updateData.respostaRecurso = body.respostaRecurso || null;
        if (body.recursoSegundaInstancia !== undefined) updateData.recursoSegundaInstancia = body.recursoSegundaInstancia || null;
        if (body.respostaRecursoSegunda !== undefined) updateData.respostaRecursoSegunda = body.respostaRecursoSegunda || null;

        let historico: any[] = [];
        try {
            historico = JSON.parse(atual.historicoTramitacao || "[]");
        } catch {
            historico = [];
        }

        // Prorrogação por +10 dias mediante justificativa expressa (Art. 11, § 2º da LAI)
        if (body.prorrogado === true && !atual.prorrogado) {
            if (!body.justificativaProrrogacao) {
                return jsonNoStore(
                    { error: "A prorrogação de prazo exige justificativa expressa conforme a Lei 12.527/2011." },
                    { status: 400 }
                );
            }
            const diasProrrogacao = MUNICIPIO.prazosEsic?.prorrogacaoDias || 10;
            const basePrazo = atual.prazo ? new Date(atual.prazo) : new Date();
            basePrazo.setDate(basePrazo.getDate() + diasProrrogacao);
            updateData.prazo = basePrazo;
            historico.push({
                data: new Date().toISOString(),
                evento: `Prazo Prorrogado (+${diasProrrogacao} dias)`,
                detalhe: body.justificativaProrrogacao,
                responsavel: auth.user.nome,
            });
        }

        if ((body.status === "concluido" || body.status === "indeferido") && body.resposta && !atual.respondidoEm) {
            updateData.respondidoEm = new Date();
            historico.push({
                data: new Date().toISOString(),
                evento:
                    body.status === "indeferido"
                        ? "Pedido Indeferido Fundamentadamente"
                        : "Resposta Oficial Emitida",
                detalhe: `${body.status === "indeferido" ? "Indeferido" : "Respondido"} por ${auth.user.nome} (${atual.orgao})`,
            });
        }

        if (body.respostaRecurso && !atual.dataRespostaRecurso) {
            updateData.dataRespostaRecurso = new Date();
            updateData.status = "encerrado";
            historico.push({
                data: new Date().toISOString(),
                evento: "Julgamento de Recurso (1ª Instância)",
                detalhe: `Decisão proferida por ${auth.user.nome}`,
            });
        }

        if (body.respostaRecursoSegunda && !atual.dataRespostaSegunda) {
            updateData.dataRespostaSegunda = new Date();
            updateData.status = "encerrado";
            historico.push({
                data: new Date().toISOString(),
                evento: "Julgamento Definitivo de Recurso (2ª Instância)",
                detalhe: `Decisão superior proferida por ${auth.user.nome}`,
            });
        }

        updateData.historicoTramitacao = JSON.stringify(historico);

        const item = await prisma.esic.update({
            where: { id: params.id },
            data: updateData,
        });

        await registrarHistoricoAlteracao({
            entidade: "Esic",
            entidadeId: item.id,
            acao: "edicao",
            resumoAlteracao: `Atualização de protocolo e-SIC ${item.protocolo} (status: ${item.status})`,
            dadosAnteriores: { status: atual.status, prorrogado: atual.prorrogado },
            dadosNovos: { status: item.status, prorrogado: item.prorrogado },
            secretaria: item.orgao,
            user: auth.user,
        });

        revalidatePaths(REVALIDATE_GROUPS.institucional);
        return jsonNoStore(item);
    } catch (err) {
        console.error("Erro ao atualizar e-SIC:", err);
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireServerAuth(["admin"]);
    if (!auth.authorized) return auth.response;

    try {
        await prisma.esic.delete({ where: { id: params.id } });
        revalidatePaths(REVALIDATE_GROUPS.institucional);
        return jsonNoStore({ success: true });
    } catch {
        return jsonNoStore({ error: "Erro interno" }, { status: 500 });
    }
}
