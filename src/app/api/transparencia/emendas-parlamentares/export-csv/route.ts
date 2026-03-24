import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const ano = searchParams.get("ano");
        const autor = searchParams.get("autor");
        const tipo = searchParams.get("tipo");
        const funcao = searchParams.get("funcao");
        const situacao = searchParams.get("situacao");
        const busca = searchParams.get("busca");

        const where: any = {};

        if (ano) where.anoEmenda = parseInt(ano);
        if (tipo) where.tipoEmenda = { contains: tipo, mode: "insensitive" };
        if (funcao) where.funcaoGoverno = { contains: funcao, mode: "insensitive" };
        if (situacao) where.situacaoExecucao = { contains: situacao, mode: "insensitive" };
        if (autor) where.autorNome = { contains: autor, mode: "insensitive" };

        if (busca) {
            where.OR = [
                { autorNome: { contains: busca, mode: "insensitive" } },
                { objeto: { contains: busca, mode: "insensitive" } },
            ];
        }

        const items = await prisma.emendaParlamentar.findMany({
            where,
            orderBy: [{ anoEmenda: "desc" }, { autorNome: "asc" }],
        });

        // Gerar CSV
        const headers = [
            "codigo_emenda", "ano_emenda", "autor_nome", "numero_emenda", "tipo_emenda",
            "objeto", "funcao_governo", "subfuncao_governo", "localidade", "uf",
            "favorecido_nome", "favorecido_cnpj_cpf", "valor_previsto", "valor_empenhado",
            "valor_liquidado", "valor_pago", "situacao_execucao", "orgao_concedente",
            "instrumento_numero", "plano_acao_numero", "convenio_numero", "url_fonte_oficial",
            "fonte_dado"
        ];

        const csvLines = [headers.join(";")];

        for (const item of items) {
            const row = [
                item.codigoEmenda,
                item.anoEmenda,
                item.autorNome,
                item.numeroEmenda || "",
                item.tipoEmenda || "",
                (item.objeto || "").replace(/;/g, ",").replace(/\n/g, " "),
                item.funcaoGoverno || "",
                item.subfuncaoGoverno || "",
                item.localidade || "",
                item.uf || "",
                item.favorecidoNome || "",
                item.favorecidoCnpjCpf || "",
                item.valorPrevisto || 0,
                item.valorEmpenhado || 0,
                item.valorLiquidado || 0,
                item.valorPago || 0,
                item.situacaoExecucao || "",
                item.orgaoConcedente || "",
                item.instrumentoNumero || "",
                item.planoAcaoNumero || "",
                item.convenioNumero || "",
                item.urlFonteOficial || "",
                item.fonteDado || "",
            ];
            csvLines.push(row.map(v => `"${v}"`).join(";"));
        }

        const csvContent = "\uFEFF" + csvLines.join("\n"); // BOM para Excel

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="emendas_parlamentares.csv"`,
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao exportar" }, { status: 500 });
    }
}
