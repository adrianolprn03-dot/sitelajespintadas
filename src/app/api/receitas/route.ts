export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth, canAccessSecretaria, canApprovePublication } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";

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
    const query = searchParams.get("query");
    const categoria = searchParams.get("categoria");
    const natureza = searchParams.get("natureza");
    const incluirNaoPublicados = searchParams.get("admin") === "true";

    const where: any = {};
    if (ano) where.ano = parseInt(ano, 10);
    if (mes) where.mes = parseInt(mes, 10);
    if (categoria) where.categoria = { contains: categoria, mode: "insensitive" };
    if (natureza) where.naturezaCodigo = { contains: natureza, mode: "insensitive" };
    if (!incluirNaoPublicados) {
        where.situacaoPublicacao = "publicado";
    }

    if (query) {
        where.OR = [
            { descricao: { contains: query, mode: "insensitive" } },
            { naturezaCodigo: { contains: query, mode: "insensitive" } },
            { fonte: { contains: query, mode: "insensitive" } },
        ];
    }

    try {
        const [items, total] = await Promise.all([
            prisma.receita.findMany({
                where,
                orderBy: [{ ano: "desc" }, { mes: "desc" }, { criadoEm: "desc" }],
            }),
            prisma.receita.count({ where }),
        ]);

        const totalValor = items.reduce(
            (sum, r) => Math.round((sum + (r.valorArrecadado ?? r.valor ?? 0)) * 100) / 100,
            0
        );
        const totalPrevisto = items.reduce(
            (sum, r) => Math.round((sum + (r.valorPrevisto ?? r.valor ?? 0)) * 100) / 100,
            0
        );

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
            totalValor,
            totalPrevisto,
            ultimaAtualizacao: ultimaAtualizacao ? new Date(ultimaAtualizacao).toISOString() : null,
        });
    } catch (error) {
        console.error("Erro ao buscar receitas:", error);
        return NextResponse.json({ error: "Erro interno ao consultar receitas" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireServerAuth(["admin", "controladoria", "editor", "integracao"]);
    if (!auth.authorized) return auth.response;

    try {
        const body = await req.json();
        const orgao = body.orgao ? String(body.orgao) : "Secretaria de Finanças e Tributação";

        if (!canAccessSecretaria(auth.user, orgao)) {
            return NextResponse.json(
                { error: "Você não possui permissão para publicar receitas deste órgão/secretaria." },
                { status: 403 }
            );
        }

        const valorArrecadado = parseNullableMonetary(body.valorArrecadado ?? body.valor);
        const valorPrevisto = parseNullableMonetary(body.valorPrevisto);
        const valorAtualizado = parseNullableMonetary(body.valorAtualizado);
        const valorLancado = parseNullableMonetary(body.valorLancado);

        if (valorArrecadado === null && valorPrevisto === null) {
            return NextResponse.json(
                { error: "Informe o valor arrecadado ou previsto (use 0 para zero formal, não deixe indefinido)." },
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
            descricao: String(body.descricao || ""),
            categoria: String(body.categoria || "Receita Corrente"),
            naturezaCodigo: body.naturezaCodigo ? String(body.naturezaCodigo) : null,
            orgao,
            unidade: body.unidade ? String(body.unidade) : null,
            fonte: body.fonte ? String(body.fonte) : null,
            valor: valorArrecadado ?? valorPrevisto ?? 0,
            valorPrevisto,
            valorAtualizado,
            valorLancado,
            valorArrecadado,
            mes: parseInt(body.mes, 10) || new Date().getMonth() + 1,
            ano: parseInt(body.ano, 10) || new Date().getFullYear(),
            fonteOrigem: body.fonteOrigem || "Sistema Contábil Municipal",
            responsavelCadastro: auth.user.nome,
            responsavelRevisao: canApprovePublication(auth.user) ? auth.user.nome : null,
            dataAtualizacaoEfetiva: new Date(),
            situacaoPublicacao: situacaoFinal,
        };

        const receita = await prisma.receita.create({ data });

        await registrarHistoricoAlteracao({
            entidade: "Receita",
            entidadeId: receita.id,
            acao: "criacao",
            resumoAlteracao: `Cadastro de receita: ${receita.descricao} (${receita.mes}/${receita.ano})`,
            dadosNovos: receita,
            secretaria: orgao,
            user: auth.user,
        });

        return NextResponse.json(receita, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar receita:", error);
        return NextResponse.json({ error: "Erro ao salvar receita no banco de dados" }, { status: 500 });
    }
}
