export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyESICToken } from "@/lib/esic-auth";
import { MUNICIPIO } from "@/config/municipio";
import { getAuthContext, canAccessEsicPersonalData } from "@/lib/rbac";

function generateReadableProtocol(prefix: string = "ESIC"): string {
    const year = new Date().getFullYear();
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${year}-${randomPart}`;
}

function generateVerificationPin(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orgao, pedido, nome, email, formaRetorno } = body;

        // A LAI (Lei 12.527/2011, art. 10, § 3º) veda exigir motivos/justificativas para o pedido de informação.
        if (!orgao || !pedido) {
            return NextResponse.json({ error: "Órgão destinatário e descrição do pedido são obrigatórios." }, { status: 400 });
        }

        const diasPrazo = MUNICIPIO.prazosEsic?.respostaInicialDias || 20;
        const prazo = new Date();
        prazo.setDate(prazo.getDate() + diasPrazo);

        const authHeader = req.headers.get("authorization");
        let cidadaoId = null;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            const decoded = await verifyESICToken(token);
            if (decoded) cidadaoId = decoded.id;
        }

        const protocolo = generateReadableProtocol("LAI");
        const codigoVerificacao = generateVerificationPin();
        const historicoInicial = [
            {
                data: new Date().toISOString(),
                evento: "Abertura de Solicitação (LAI)",
                detalhe: `Pedido encaminhado para ${orgao}. Prazo regulamentar de ${diasPrazo} dias corridos.`,
            },
        ];

        const esic = await prisma.esic.create({
            data: {
                protocolo,
                codigoVerificacao,
                orgao,
                pedido,
                nome: nome || null,
                email: email || null,
                formaRetorno: formaRetorno || "sistema",
                prazo,
                cidadaoId,
                historicoTramitacao: JSON.stringify(historicoInicial),
            },
        });

        return NextResponse.json(
            {
                success: true,
                protocolo: esic.protocolo,
                codigoVerificacao: esic.codigoVerificacao,
                prazo: esic.prazo,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao criar pedido e-SIC:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const ano = searchParams.get("ano");
    const where: any = {};
    if (status) where.status = status;
    if (ano) {
        const y = parseInt(ano, 10);
        where.criadoEm = {
            gte: new Date(y, 0, 1),
            lte: new Date(y, 11, 31, 23, 59, 59),
        };
    }

    try {
        const authUser = await getAuthContext();
        const isAuthorizedOperator = canAccessEsicPersonalData(authUser);

        const items = await prisma.esic.findMany({
            where,
            orderBy: { criadoEm: "desc" },
        });

        // Protege dados pessoais dos solicitantes (LGPD) caso a consulta seja pública ou de perfil sem permissão e-SIC
        const safeItems = items.map((item) => {
            if (isAuthorizedOperator) return item;
            return {
                ...item,
                nome: item.nome ? "Solicitante Protegido (LGPD)" : "Anônimo",
                email: null,
                codigoVerificacao: null,
                cidadaoId: null,
            };
        });

        return NextResponse.json(safeItems);
    } catch (error) {
        console.error("Erro ao listar pedidos e-SIC:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
