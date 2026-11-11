export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth, canAccessSecretaria, canApprovePublication } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";

const PAGE_SIZE = 20;

function parseNullableMonetary(value: unknown): number | null {
    if (value === null || value === undefined || value === "") return null;
    const num = typeof value === "number" ? value : Number(String(value).replace(",", "."));
    if (!Number.isFinite(num)) return null;
    return Math.round(num * 100) / 100;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ano = searchParams.get("ano");
    const mes = searchParams.get("mes");
    const secretaria = searchParams.get("secretaria");
    const query = searchParams.get("query");
    const categoria = searchParams.get("categoria");
    const numeroEmpenho = searchParams.get("numeroEmpenho");
    const credor = searchParams.get("credor");
    const pagina = parseInt(searchParams.get("pagina") || "1", 10);
    const agrupar = searchParams.get("agrupar"); // "secretaria" | "categoria" | "mes"
    const exportAll = searchParams.get("exportAll") === "true";

    const where: any = {};
    if (ano) where.ano = parseInt(ano, 10);
    if (mes) where.mes = parseInt(mes, 10);
    if (secretaria) where.secretaria = { contains: secretaria, mode: "insensitive" };
    if (categoria) where.categoria = { contains: categoria, mode: "insensitive" };
    if (numeroEmpenho) where.numeroEmpenho = { contains: numeroEmpenho, mode: "insensitive" };
    if (credor) {
        where.OR = [
            { fornecedor: { contains: credor, mode: "insensitive" } },
            { credorCpfCnpj: { contains: credor, mode: "insensitive" } },
        ];
    }

    if (query) {
        where.OR = [
            { descricao: { contains: query, mode: "insensitive" } },
            { fornecedor: { contains: query, mode: "insensitive" } },
            { credorCpfCnpj: { contains: query, mode: "insensitive" } },
            { numeroEmpenho: { contains: query, mode: "insensitive" } },
            { categoria: { contains: query, mode: "insensitive" } },
        ];
    }

    try {
        if (agrupar) {
            const groupField = ["secretaria", "categoria", "mes"].includes(agrupar) ? agrupar : "categoria";

            const grouped = await (prisma as any).despesa.groupBy({
                by: [groupField],
                where,
                _sum: { valor: true },
                _count: { _all: true },
                orderBy: { _sum: { valor: "desc" } },
                take: 20,
            });

            const totalGeral = await prisma.despesa.aggregate({ where, _sum: { valor: true } });

            return NextResponse.json({
                agrupamento: groupField,
                dados: grouped.map((g: any) => ({
                    chave: g[groupField],
                    total: Math.round((g._sum.valor ?? 0) * 100) / 100,
                    quantidade: g._count._all,
                })),
                totalGeral: Math.round((totalGeral._sum.valor ?? 0) * 100) / 100,
            });
        }

        const skip = exportAll ? undefined : (pagina - 1) * PAGE_SIZE;
        const take = exportAll ? undefined : PAGE_SIZE;

        const [items, total, agregados] = await Promise.all([
            prisma.despesa.findMany({
                where,
                orderBy: [{ ano: "desc" }, { mes: "desc" }, { valor: "desc" }],
                skip,
                take,
            }),
            prisma.despesa.count({ where }),
            prisma.despesa.aggregate({
                where,
                _sum: {
                    valor: true,
                    valorEmpenhado: true,
                    valorLiquidado: true,
                    valorPago: true,
                },
            }),
        ]);

        const ultimaAtualizacao =
            items.length > 0
                ? items.reduce((latest, item) => {
                      const d = new Date(item.dataAtualizacaoEfetiva || item.criadoEm).getTime();
                      return d > latest ? d : latest;
                  }, 0)
                : null;

        return NextResponse.json({
            items,
            total,
            totalValor: Math.round((agregados._sum.valor ?? 0) * 100) / 100,
            totalEmpenhado:
                agregados._sum.valorEmpenhado !== null
                    ? Math.round((agregados._sum.valorEmpenhado ?? 0) * 100) / 100
                    : null,
            totalLiquidado:
                agregados._sum.valorLiquidado !== null
                    ? Math.round((agregados._sum.valorLiquidado ?? 0) * 100) / 100
                    : null,
            totalPago:
                agregados._sum.valorPago !== null
                    ? Math.round((agregados._sum.valorPago ?? 0) * 100) / 100
                    : null,
            pagina: exportAll ? 1 : pagina,
            totalPaginas: exportAll ? 1 : Math.ceil(total / PAGE_SIZE),
            ultimaAtualizacao: ultimaAtualizacao ? new Date(ultimaAtualizacao).toISOString() : null,
        });
    } catch (error) {
        console.error("Erro ao buscar despesas:", error);
        return NextResponse.json({ error: "Erro interno ao consultar despesas" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireServerAuth(["admin", "controladoria", "editor", "integracao"]);
    if (!auth.authorized) return auth.response;

    try {
        const body = await req.json();

        const required = ["descricao", "categoria", "secretaria"];
        const missing = required.filter((f) => !body[f]);
        if (missing.length > 0) {
            return NextResponse.json(
                { error: `Campos obrigatórios faltando: ${missing.join(", ")}` },
                { status: 400 }
            );
        }

        const secretaria = String(body.secretaria);
        if (!canAccessSecretaria(auth.user, secretaria)) {
            return NextResponse.json(
                { error: `Seu usuário não possui permissão para lançar despesas na secretaria "${secretaria}".` },
                { status: 403 }
            );
        }

        const valorEmpenhado = parseNullableMonetary(body.valorEmpenhado ?? body.valor);
        const valorLiquidado = parseNullableMonetary(body.valorLiquidado);
        const valorPago = parseNullableMonetary(body.valorPago);

        if (valorEmpenhado === null && valorPago === null) {
            return NextResponse.json(
                { error: "Informe o valor empenhado ou pago (use 0 para zero formal)." },
                { status: 400 }
            );
        }

        const situacaoDesejada = body.situacaoPublicacao || "publicado";
        const situacaoFinal =
            situacaoDesejada === "publicado" && !canApprovePublication(auth.user) && body.exigirRevisao
                ? "aguardando_revisao"
                : situacaoDesejada;

        const data = {
            codigoPermanente: body.codigoPermanente || null,
            numeroEmpenho: body.numeroEmpenho ? String(body.numeroEmpenho) : null,
            dataEmpenho: body.dataEmpenho ? new Date(body.dataEmpenho) : null,
            descricao: String(body.descricao),
            categoria: String(body.categoria),
            secretaria,
            orgao: body.orgao ? String(body.orgao) : "Prefeitura Municipal de Lajes Pintadas",
            unidade: body.unidade ? String(body.unidade) : secretaria,
            fornecedor: body.fornecedor ? String(body.fornecedor) : null,
            credorCpfCnpj: body.credorCpfCnpj ? String(body.credorCpfCnpj) : null,
            classificacaoOrcamentaria: body.classificacaoOrcamentaria
                ? String(body.classificacaoOrcamentaria)
                : null,
            funcao: body.funcao ? String(body.funcao) : null,
            subfuncao: body.subfuncao ? String(body.subfuncao) : null,
            programa: body.programa ? String(body.programa) : null,
            elementoDespesa: body.elementoDespesa ? String(body.elementoDespesa) : null,
            fonteRecurso: body.fonteRecurso ? String(body.fonteRecurso) : null,
            valor: valorEmpenhado ?? valorPago ?? 0,
            valorEmpenhado,
            valorLiquidado,
            valorPago,
            modalidadeLicitacao: body.modalidadeLicitacao ? String(body.modalidadeLicitacao) : null,
            numeroProcessoLicitatorio: body.numeroProcessoLicitatorio
                ? String(body.numeroProcessoLicitatorio)
                : null,
            licitacaoId: body.licitacaoId || null,
            contratoId: body.contratoId || null,
            mes: parseInt(body.mes, 10) || new Date().getMonth() + 1,
            ano: parseInt(body.ano, 10) || new Date().getFullYear(),
            fonteOrigem: body.fonteOrigem || "Sistema Contábil Municipal",
            responsavelCadastro: auth.user.nome,
            responsavelRevisao: canApprovePublication(auth.user) ? auth.user.nome : null,
            dataAtualizacaoEfetiva: new Date(),
            situacaoPublicacao: situacaoFinal,
        };

        const despesa = await prisma.despesa.create({ data });

        await registrarHistoricoAlteracao({
            entidade: "Despesa",
            entidadeId: despesa.id,
            acao: "criacao",
            resumoAlteracao: `Cadastro de despesa/empenho ${despesa.numeroEmpenho || despesa.id}: ${despesa.descricao}`,
            dadosNovos: despesa,
            secretaria,
            user: auth.user,
        });

        return NextResponse.json(despesa, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar despesa:", error);
        return NextResponse.json({ error: "Erro ao salvar despesa" }, { status: 500 });
    }
}
