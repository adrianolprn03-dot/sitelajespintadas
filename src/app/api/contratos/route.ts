export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth, canAccessSecretaria } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ano = searchParams.get("ano");
    const status = searchParams.get("status");
    const query = searchParams.get("query");

    const where: any = {};

    if (ano) {
        const year = parseInt(ano, 10);
        where.OR = [
            { ano: year },
            {
                dataInicio: {
                    gte: new Date(`${year}-01-01T00:00:00.000Z`),
                    lte: new Date(`${year}-12-31T23:59:59.999Z`),
                },
            },
        ];
    }

    if (status) where.status = { contains: status, mode: "insensitive" };

    if (query) {
        where.AND = [
            ...(where.AND || []),
            {
                OR: [
                    { objeto: { contains: query, mode: "insensitive" } },
                    { fornecedor: { contains: query, mode: "insensitive" } },
                    { cnpjFornecedor: { contains: query, mode: "insensitive" } },
                    { numero: { contains: query, mode: "insensitive" } },
                ],
            },
        ];
    }

    try {
        const [items, total] = await Promise.all([
            prisma.contrato.findMany({
                where,
                include: { licitacao: true },
                orderBy: { dataInicio: "desc" },
            }),
            prisma.contrato.count({ where }),
        ]);
        return NextResponse.json({ items, total });
    } catch (error) {
        console.error("Erro ao buscar contratos:", error);
        return NextResponse.json({ error: "Erro interno ao consultar contratos" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireServerAuth(["admin", "controladoria", "editor"]);
    if (!auth.authorized) return auth.response;

    try {
        const body = await req.json();
        const secretaria = String(body.secretaria || "Administração");

        if (!canAccessSecretaria(auth.user, secretaria)) {
            return NextResponse.json(
                { error: "Sem permissão para cadastrar contratos nesta secretaria." },
                { status: 403 }
            );
        }

        const dataInicio = new Date(body.dataInicio);
        const data = {
            codigoPermanente: body.codigoPermanente || null,
            numero: String(body.numero),
            ano: body.ano ? parseInt(body.ano, 10) : dataInicio.getFullYear(),
            modalidadeOrigem: body.modalidadeOrigem || null,
            objeto: String(body.objeto),
            fornecedor: String(body.fornecedor),
            cnpjFornecedor: body.cnpjFornecedor || null,
            valor: parseFloat(body.valor) || 0,
            dataAssinatura: body.dataAssinatura ? new Date(body.dataAssinatura) : dataInicio,
            dataInicio,
            dataFim: new Date(body.dataFim),
            secretaria,
            unidadeResponsavel: body.unidadeResponsavel || null,
            status: body.status || "vigente",
            instrumentoIntegralUrl: body.instrumentoIntegralUrl || null,
            aditivos:
                typeof body.aditivos === "string"
                    ? body.aditivos
                    : JSON.stringify(body.aditivos || []),
            fiscais:
                typeof body.fiscais === "string"
                    ? body.fiscais
                    : JSON.stringify(body.fiscais || []),
            justificativaOrdemCronologica: body.justificativaOrdemCronologica || null,
            documentos:
                typeof body.documentos === "string"
                    ? body.documentos
                    : JSON.stringify(body.documentos || []),
            licitacaoId: body.licitacaoId || null,
            responsavelCadastro: auth.user.nome,
            dataAtualizacaoEfetiva: new Date(),
            situacaoPublicacao: body.situacaoPublicacao || "publicado",
        };

        const contrato = await prisma.contrato.create({ data });

        await registrarHistoricoAlteracao({
            entidade: "Contrato",
            entidadeId: contrato.id,
            acao: "criacao",
            resumoAlteracao: `Cadastro de contrato nº ${contrato.numero} - ${contrato.fornecedor}`,
            dadosNovos: contrato,
            secretaria,
            user: auth.user,
        });

        return NextResponse.json(contrato, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar contrato:", error);
        return NextResponse.json({ error: "Erro ao salvar contrato no banco de dados" }, { status: 500 });
    }
}
