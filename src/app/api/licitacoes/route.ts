export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth, canAccessSecretaria } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const secretaria = searchParams.get("secretaria");
    const modalidade = searchParams.get("modalidade");
    const ano = searchParams.get("ano");
    const mes = searchParams.get("mes");
    const query = searchParams.get("query");
    const ataRegistroPreco = searchParams.get("ataRegistroPreco");

    const where: any = {};
    if (status) where.status = status;
    if (secretaria) where.secretaria = { contains: secretaria, mode: "insensitive" };
    if (modalidade) where.modalidade = { contains: modalidade, mode: "insensitive" };
    if (ano) where.ano = parseInt(ano, 10);
    if (ataRegistroPreco === "true") where.ataRegistroPreco = true;
    if (mes && ano) {
        const y = parseInt(ano, 10);
        const m = parseInt(mes, 10);
        if (m >= 1 && m <= 12) {
            const start = new Date(y, m - 1, 1);
            const end = new Date(y, m, 0, 23, 59, 59);
            where.dataAbertura = { gte: start, lte: end };
        }
    }
    if (query) {
        where.OR = [
            { objeto: { contains: query, mode: "insensitive" } },
            { numero: { contains: query, mode: "insensitive" } },
            { numeroProcesso: { contains: query, mode: "insensitive" } },
            { secretaria: { contains: query, mode: "insensitive" } },
        ];
    }

    try {
        const [items, total] = await Promise.all([
            prisma.licitacao.findMany({
                where,
                orderBy: [{ ano: "desc" }, { criadoEm: "desc" }],
                include:
                    ataRegistroPreco === "true"
                        ? {
                              contratos: {
                                  take: 1,
                                  orderBy: { criadoEm: "desc" },
                                  select: {
                                      fornecedor: true,
                                      cnpjFornecedor: true,
                                      dataInicio: true,
                                      dataFim: true,
                                      valor: true,
                                      status: true,
                                      instrumentoIntegralUrl: true,
                                  },
                              },
                          }
                        : undefined,
            }),
            prisma.licitacao.count({ where }),
        ]);
        return jsonNoStore({ items, total });
    } catch {
        return jsonNoStore({ error: "Erro interno ao consultar licitações" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireServerAuth(["admin", "controladoria", "editor"]);
    if (!auth.authorized) return auth.response;

    try {
        const body = await req.json();
        const secretaria = String(body.secretaria || "Setor de Licitações");

        if (!canAccessSecretaria(auth.user, secretaria)) {
            return NextResponse.json(
                { error: "Sem permissão para cadastrar licitações nesta secretaria." },
                { status: 403 }
            );
        }

        const valorEstimado =
            body.valorEstimado !== undefined && body.valorEstimado !== ""
                ? parseFloat(body.valorEstimado)
                : body.valor
                ? parseFloat(body.valor)
                : null;
        const valorHomologado =
            body.valorHomologado !== undefined && body.valorHomologado !== ""
                ? parseFloat(body.valorHomologado)
                : null;

        const data = {
            codigoPermanente: body.codigoPermanente || null,
            numero: String(body.numero),
            numeroProcesso: body.numeroProcesso ? String(body.numeroProcesso) : null,
            ano: body.ano ? parseInt(body.ano, 10) : new Date().getFullYear(),
            modalidade: String(body.modalidade),
            objeto: String(body.objeto),
            valor: valorEstimado,
            valorEstimado,
            valorHomologado,
            status: body.status || "aberta",
            dataAbertura: body.dataAbertura ? new Date(body.dataAbertura) : null,
            dataEncerramento: body.dataEncerramento ? new Date(body.dataEncerramento) : null,
            dataPublicacao: body.dataPublicacao ? new Date(body.dataPublicacao) : new Date(),
            dataHomologacao: body.dataHomologacao ? new Date(body.dataHomologacao) : null,
            secretaria,
            unidadeResponsavel: body.unidadeResponsavel || null,
            amparoLegal: body.amparoLegal || "Lei Federal nº 14.133/2021",
            editalUrl: body.editalUrl || null,
            fasesDocumentos:
                typeof body.fasesDocumentos === "string"
                    ? body.fasesDocumentos
                    : JSON.stringify(body.fasesDocumentos || []),
            ataRegistroPreco: Boolean(body.ataRegistroPreco),
            adesaoArp: Boolean(body.adesaoArp),
            documentos:
                typeof body.documentos === "string"
                    ? body.documentos
                    : JSON.stringify(body.documentos || []),
            resultado: body.resultado || null,
            responsavelCadastro: auth.user.nome,
            dataAtualizacaoEfetiva: new Date(),
            situacaoPublicacao: body.situacaoPublicacao || "publicado",
        };

        const licitacao = await prisma.licitacao.create({ data });

        await registrarHistoricoAlteracao({
            entidade: "Licitacao",
            entidadeId: licitacao.id,
            acao: "criacao",
            resumoAlteracao: `Cadastro de licitação ${licitacao.modalidade} nº ${licitacao.numero}/${licitacao.ano}`,
            dadosNovos: licitacao,
            secretaria,
            user: auth.user,
        });

        revalidatePaths(REVALIDATE_GROUPS.licitacoes);
        return jsonNoStore(licitacao, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar licitação:", error);
        return NextResponse.json({ error: "Erro ao salvar licitação no banco de dados" }, { status: 500 });
    }
}
