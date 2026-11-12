export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ano = searchParams.get("ano");
    const tipo = searchParams.get("tipo"); // "recebido" ou "concedido"
    const status = searchParams.get("status");
    const query = searchParams.get("query");

    const where: any = {};

    if (tipo) {
        if (tipo === "concedido") {
            where.tipoConvenio = { in: ["concedido", "realizado"] };
        } else if (tipo === "recebido") {
            where.tipoConvenio = "recebido";
        } else {
            where.tipoConvenio = tipo;
        }
    }

    if (ano) {
        const year = parseInt(ano);
        where.OR = [
            { ano: year },
            {
                dataInicio: {
                    gte: new Date(`${year}-01-01T00:00:00.000Z`),
                    lte: new Date(`${year}-12-31T23:59:59.999Z`),
                }
            }
        ];
    }
    
    if (status) where.status = { contains: status, mode: 'insensitive' };
    
    if (query) {
        where.OR = [
            ...(where.OR || []),
            { objeto: { contains: query, mode: 'insensitive' } },
            { concedente: { contains: query, mode: 'insensitive' } },
            { beneficiario: { contains: query, mode: 'insensitive' } },
            { numero: { contains: query, mode: 'insensitive' } },
        ];
    }

    try {
        const [items, total] = await Promise.all([
            prisma.convenio.findMany({
                where,
                orderBy: { dataInicio: "desc" },
            }),
            prisma.convenio.count({ where }),
        ]);
        return NextResponse.json({ items, total });
    } catch (error) {
        console.error("Erro ao buscar convênios:", error);
        return NextResponse.json({ error: "Erro interno ao buscar convênios" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = {
            numero: String(body.numero || "").trim(),
            ano: body.ano ? parseInt(String(body.ano)) : new Date(body.dataInicio || Date.now()).getFullYear(),
            tipoConvenio: body.tipoConvenio || "recebido",
            objeto: String(body.objeto || "").trim(),
            concedente: String(body.concedente || "Prefeitura Municipal de Lajes Pintadas/RN").trim(),
            beneficiario: body.beneficiario ? String(body.beneficiario).trim() : null,
            cnpjParticipe: body.cnpjParticipe ? String(body.cnpjParticipe).trim() : null,
            valor: parseFloat(String(body.valor)) || 0,
            contrapartida: parseFloat(String(body.contrapartida)) || 0,
            valorLiberado: body.valorLiberado ? parseFloat(String(body.valorLiberado)) : 0,
            dataInicio: new Date(body.dataInicio),
            dataFim: new Date(body.dataFim),
            secretaria: String(body.secretaria || "Gabinete do Prefeito").trim(),
            status: String(body.status || "vigente").trim(),
            arquivoInteiroTeor: body.arquivoInteiroTeor ? String(body.arquivoInteiroTeor).trim() : null,
            obrigacoes: body.obrigacoes ? String(body.obrigacoes).trim() : null,
            fonteOrigem: "Controle Municipal / Transferegov",
        };

        const convenio = await prisma.convenio.create({ data });
        return NextResponse.json(convenio, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar convênio:", error);
        return NextResponse.json({ error: "Erro ao salvar convênio no banco de dados" }, { status: 500 });
    }
}
