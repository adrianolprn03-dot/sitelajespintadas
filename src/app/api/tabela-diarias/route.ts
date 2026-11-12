export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HISTORICO_DIARIAS } from "@/lib/diarias-historico";
import { requireServerAuth } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ano = searchParams.get("ano");

    try {
        if (ano) {
            const anoNum = parseInt(ano, 10);
            const found = HISTORICO_DIARIAS.find((h) => h.ano === anoNum);
            if (!found) {
                return NextResponse.json({ error: "Ano não localizado no histórico de diárias" }, { status: 404 });
            }
            return NextResponse.json(found);
        }

        return NextResponse.json({
            historico: HISTORICO_DIARIAS,
            anosDisponiveis: HISTORICO_DIARIAS.map((h) => h.ano),
            anoVigente: 2026,
        });
    } catch (error) {
        console.error("Erro na API tabela-diarias:", error);
        return NextResponse.json({ error: "Erro ao consultar histórico de diárias" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireServerAuth(["admin", "controladoria"]);
    if (!auth.authorized) return auth.response;

    try {
        const body = await req.json();
        const { ano, tipoOperacao } = body;

        if (tipoOperacao === "declaracao") {
            const dec = await prisma.declaracaoTransparencia.create({
                data: {
                    modulo: "Diárias / Tabela de Diárias",
                    criterioPntp: "7.2",
                    orgaoResponsavel: "Controladoria Geral do Município",
                    exercicio: parseInt(String(ano), 10),
                    tipoSituacao: "nao_ocorrencia_declarada",
                    textoDeclaracao: body.texto || "Declaração de inexistência de regulamentação para diárias internacionais.",
                    fundamentoLegal: "Art. 37 da Constituição Federal e Critério 7.2 PNTP",
                    responsavelNome: auth.user.nome,
                    responsavelCargo: auth.user.perfil,
                    dataEmissao: new Date(),
                    dataConferencia: new Date(),
                    situacaoPublicacao: "publicado",
                },
            });

            await registrarHistoricoAlteracao({
                entidade: "DeclaracaoTransparencia",
                entidadeId: dec.id,
                acao: "criacao",
                resumoAlteracao: `Declaração de Diárias criada para o ano ${ano}`,
                secretaria: "Controladoria Geral do Município",
                user: auth.user,
            });

            return NextResponse.json(dec, { status: 201 });
        }

        return NextResponse.json({ success: true, message: "Operação registrada com sucesso." });
    } catch (error) {
        console.error("Erro ao salvar declaração de diárias:", error);
        return NextResponse.json({ error: "Erro ao salvar declaração de diárias" }, { status: 500 });
    }
}

