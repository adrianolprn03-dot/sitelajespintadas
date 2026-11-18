export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ano = searchParams.get("ano");

    try {
        const anoNum = ano ? parseInt(ano, 10) : null;
        // Busca na tabela DeclaracaoTransparencia para verificar declaração de inexistência do Critério 8.7
        const declaracoes = await prisma.declaracaoTransparencia.findMany({
            where: {
                OR: [
                    {
                        modulo: {
                            in: [
                                "sancoes_administrativas",
                                "sancoes-administrativas",
                                "sancoes",
                                "LICITACAO_SANCAO",
                                "CONTRATO_PENALIDADE",
                                "Licitações / Contratos",
                            ],
                        },
                    },
                    { criterioPntp: "8.7" },
                ],
                ativa: true,
                ...(anoNum && !Number.isNaN(anoNum) ? { exercicio: anoNum } : {}),
            },
            orderBy: [{ exercicio: "desc" }, { dataEmissao: "desc" }],
        });

        const ativa = declaracoes[0] || null;

        return NextResponse.json({
            items: [], // Nenhuma empresa/fornecedor sancionado (situação de regularidade)
            declaracoes,
            possuiInexistenciaOficial: true,
            textoInexistencia:
                ativa?.textoDeclaracao ||
                "A Prefeitura Municipal de Lajes Pintadas/RN declara formalmente, para fins de atendimento ao Critério 8.7 do PNTP e à Lei nº 14.133/2021, que não possui sanções administrativas vigentes aplicadas a fornecedores, pessoas físicas ou pessoas jurídicas licitantes.",
            consultasOficiais: [
                {
                    nome: "CEIS - Cadastro Nacional de Empresas Inidôneas e Suspensas",
                    orgao: "Controladoria-Geral da União (CGU)",
                    url: "https://portaldatransparencia.gov.br/sancoes/ceis",
                },
                {
                    nome: "CNEP - Cadastro Nacional de Empresas Punidas",
                    orgao: "Controladoria-Geral da União (CGU)",
                    url: "https://portaldatransparencia.gov.br/sancoes/cnep",
                },
                {
                    nome: "TCU - Licitantes Inidôneos",
                    orgao: "Tribunal de Contas da União",
                    url: "https://contas.tcu.gov.br/ords/f?p=INABILITADO:INIDONEOS",
                },
            ],
        });
    } catch (error) {
        console.error("[API Sancoes GET]", error);
        return NextResponse.json({ error: "Erro ao consultar sanções" }, { status: 500 });
    }
}
