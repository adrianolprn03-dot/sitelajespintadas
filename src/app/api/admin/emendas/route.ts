export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

function toFloatOrDefault(v: unknown, def = 0): number {
    if (v === undefined || v === null || v === "") return def;
    const n = parseFloat(String(v));
    return Number.isNaN(n) ? def : n;
}

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

        if (ano) where.anoEmenda = parseInt(ano, 10);
        if (tipo) where.tipoEmenda = { contains: tipo, mode: "insensitive" };
        if (funcao) where.funcaoGoverno = { contains: funcao, mode: "insensitive" };
        if (situacao) where.situacaoExecucao = { contains: situacao, mode: "insensitive" };
        if (autor) where.autorNome = { contains: autor, mode: "insensitive" };

        if (busca) {
            where.OR = [
                { autorNome: { contains: busca, mode: "insensitive" } },
                { objeto: { contains: busca, mode: "insensitive" } },
                { codigoEmenda: { contains: busca, mode: "insensitive" } },
                { favorecidoNome: { contains: busca, mode: "insensitive" } },
            ];
        }

        const items = await prisma.emendaParlamentar.findMany({
            where,
            orderBy: [{ anoEmenda: "desc" }, { autorNome: "asc" }],
        });
        return jsonNoStore(items);
    } catch (error) {
        console.error(error);
        return jsonNoStore({ error: "Erro ao buscar emendas" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });
    try {
        const body = await req.json();
        const anoParsed = parseInt(String(body.anoEmenda || new Date().getFullYear()), 10);
        const item = await prisma.emendaParlamentar.create({
            data: {
                codigoEmenda: String(body.codigoEmenda || "").trim(),
                autorNome: String(body.autorNome || "").trim(),
                anoEmenda: Number.isNaN(anoParsed) ? new Date().getFullYear() : anoParsed,
                objeto: body.objeto || null,
                esfera: body.esfera || "Federal",
                formaRepasse: body.formaRepasse || "Transferência Especial / Convênio",
                convenioNumero: body.convenioNumero || null,
                favorecidoCnpjCpf: body.favorecidoCnpjCpf || null,
                favorecidoNome: body.favorecidoNome || null,
                fonteDado: body.fonteDado || null,
                funcaoGoverno: body.funcaoGoverno || null,
                instrumentoNumero: body.instrumentoNumero || null,
                localidade: body.localidade || null,
                numeroEmenda: body.numeroEmenda || null,
                orgaoConcedente: body.orgaoConcedente || null,
                planoAcaoNumero: body.planoAcaoNumero || null,
                situacaoExecucao: body.situacaoExecucao || null,
                subfuncaoGoverno: body.subfuncaoGoverno || null,
                tipoEmenda: body.tipoEmenda || null,
                uf: body.uf || null,
                urlFonteOficial: body.urlFonteOficial || null,
                valorEmpenhado: toFloatOrDefault(body.valorEmpenhado),
                valorLiquidado: toFloatOrDefault(body.valorLiquidado),
                valorPago: toFloatOrDefault(body.valorPago),
                valorPrevisto: toFloatOrDefault(body.valorPrevisto),
                valorRecebido: toFloatOrDefault(body.valorRecebido),
                despesaVinculada: body.despesaVinculada || null,
                contratoVinculado: body.contratoVinculado || null,
                obraVinculada: body.obraVinculada || null,
                dataUltimaConferencia: body.dataUltimaConferencia ? new Date(body.dataUltimaConferencia) : null,
                situacaoPublicacao: body.situacaoPublicacao || "publicado",
            },
        });
        revalidatePaths(REVALIDATE_GROUPS.emendas);
        return jsonNoStore(item);
    } catch (error) {
        console.error(error);
        return jsonNoStore({ error: "Erro ao criar emenda" }, { status: 500 });
    }
}

