export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

function parseOptionalFloat(v: unknown): number | undefined {
    if (v === undefined) return undefined;
    if (v === null || v === "") return 0;
    const n = parseFloat(String(v));
    return Number.isNaN(n) ? 0 : n;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.emendaParlamentar.findUnique({ where: { id: params.id } });
        if (!item) return jsonNoStore({ error: "Não encontrada" }, { status: 404 });
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });
    try {
        const body = await req.json();
        const data: any = {};
        if (body.objeto !== undefined) data.objeto = body.objeto || null;
        if (body.anoEmenda !== undefined) data.anoEmenda = parseInt(String(body.anoEmenda), 10);
        if (body.esfera !== undefined) data.esfera = body.esfera || "Federal";
        if (body.formaRepasse !== undefined) data.formaRepasse = body.formaRepasse || null;
        if (body.autorNome !== undefined) data.autorNome = String(body.autorNome).trim();
        if (body.codigoEmenda !== undefined) data.codigoEmenda = String(body.codigoEmenda).trim();
        if (body.convenioNumero !== undefined) data.convenioNumero = body.convenioNumero || null;
        if (body.favorecidoCnpjCpf !== undefined) data.favorecidoCnpjCpf = body.favorecidoCnpjCpf || null;
        if (body.favorecidoNome !== undefined) data.favorecidoNome = body.favorecidoNome || null;
        if (body.fonteDado !== undefined) data.fonteDado = body.fonteDado || null;
        if (body.funcaoGoverno !== undefined) data.funcaoGoverno = body.funcaoGoverno || null;
        if (body.instrumentoNumero !== undefined) data.instrumentoNumero = body.instrumentoNumero || null;
        if (body.localidade !== undefined) data.localidade = body.localidade || null;
        if (body.numeroEmenda !== undefined) data.numeroEmenda = body.numeroEmenda || null;
        if (body.orgaoConcedente !== undefined) data.orgaoConcedente = body.orgaoConcedente || null;
        if (body.planoAcaoNumero !== undefined) data.planoAcaoNumero = body.planoAcaoNumero || null;
        if (body.situacaoExecucao !== undefined) data.situacaoExecucao = body.situacaoExecucao || null;
        if (body.subfuncaoGoverno !== undefined) data.subfuncaoGoverno = body.subfuncaoGoverno || null;
        if (body.tipoEmenda !== undefined) data.tipoEmenda = body.tipoEmenda || null;
        if (body.uf !== undefined) data.uf = body.uf || null;
        if (body.urlFonteOficial !== undefined) data.urlFonteOficial = body.urlFonteOficial || null;
        if (body.valorEmpenhado !== undefined) data.valorEmpenhado = parseOptionalFloat(body.valorEmpenhado);
        if (body.valorLiquidado !== undefined) data.valorLiquidado = parseOptionalFloat(body.valorLiquidado);
        if (body.valorPago !== undefined) data.valorPago = parseOptionalFloat(body.valorPago);
        if (body.valorPrevisto !== undefined) data.valorPrevisto = parseOptionalFloat(body.valorPrevisto);
        if (body.valorRecebido !== undefined) data.valorRecebido = parseOptionalFloat(body.valorRecebido);
        if (body.despesaVinculada !== undefined) data.despesaVinculada = body.despesaVinculada || null;
        if (body.contratoVinculado !== undefined) data.contratoVinculado = body.contratoVinculado || null;
        if (body.obraVinculada !== undefined) data.obraVinculada = body.obraVinculada || null;
        if (body.dataUltimaConferencia !== undefined) data.dataUltimaConferencia = body.dataUltimaConferencia ? new Date(body.dataUltimaConferencia) : null;
        if (body.situacaoPublicacao !== undefined) data.situacaoPublicacao = body.situacaoPublicacao || "publicado";

        const item = await prisma.emendaParlamentar.update({ where: { id: params.id }, data });
        revalidatePaths(REVALIDATE_GROUPS.emendas);
        return jsonNoStore(item);
    } catch {
        return jsonNoStore({ error: "Erro" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return jsonNoStore({ error: "Não autorizado" }, { status: 401 });
    try {
        await prisma.emendaParlamentar.delete({ where: { id: params.id } });
        revalidatePaths(REVALIDATE_GROUPS.emendas);
        return jsonNoStore({ success: true });
    } catch {
        return jsonNoStore({ error: "Erro" }, { status: 500 });
    }
}
