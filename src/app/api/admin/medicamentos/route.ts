export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

function buildMedicamentoData(body: Record<string, unknown>, isCreate: boolean) {
    const qtyRaw = body.quantidadeEstoque;
    const minRaw = body.estoqueMinimo;
    const qty = qtyRaw !== undefined && qtyRaw !== null && qtyRaw !== "" ? parseInt(String(qtyRaw), 10) : (isCreate ? 0 : undefined);
    const min = minRaw !== undefined && minRaw !== null && minRaw !== "" ? parseInt(String(minRaw), 10) : (isCreate ? 10 : undefined);

    return {
        ...(body.nome !== undefined ? { nome: String(body.nome).trim() } : {}),
        ...(body.principioAtivo !== undefined ? { principioAtivo: body.principioAtivo ? String(body.principioAtivo).trim() : null } : {}),
        ...(body.apresentacao !== undefined ? { apresentacao: body.apresentacao ? String(body.apresentacao).trim() : "Comprimido / Frasco" } : {}),
        ...(body.unidadeMedida !== undefined ? { unidadeMedida: body.unidadeMedida ? String(body.unidadeMedida).trim() : "Unidade" } : {}),
        ...(body.categoria !== undefined ? { categoria: String(body.categoria).trim() } : {}),
        ...(body.tipoComponente !== undefined ? { tipoComponente: body.tipoComponente ? String(body.tipoComponente).trim() : "Básico (CBAF)" } : {}),
        ...(qty !== undefined && !Number.isNaN(qty) ? { quantidadeEstoque: qty } : {}),
        ...(min !== undefined && !Number.isNaN(min) ? { estoqueMinimo: min } : {}),
        ...(body.unidadeSaude !== undefined ? { unidadeSaude: body.unidadeSaude ? String(body.unidadeSaude).trim() : "CAF / Farmácia Básica Municipal" } : {}),
        ...(body.loteValidade !== undefined ? { loteValidade: body.loteValidade ? String(body.loteValidade).trim() : null } : {}),
        ...(body.status !== undefined ? { status: String(body.status).trim() } : {}),
        ...(body.observacao !== undefined ? { observacao: body.observacao ? String(body.observacao).trim() : null } : {}),
        ...(body.situacaoPublicacao !== undefined ? { situacaoPublicacao: String(body.situacaoPublicacao).trim() } : {}),
        ...(body.ativo !== undefined ? { ativo: Boolean(body.ativo) } : {}),
        ...(body.dataReferenciaEstoque ? { dataReferenciaEstoque: new Date(String(body.dataReferenciaEstoque)) } : {}),
    };
}

export async function GET() {
    try {
        const medicamentos = await prisma.medicamento.findMany({
            orderBy: { nome: "asc" }
        });
        return jsonNoStore(medicamentos);
    } catch {
        return NextResponse.json({ error: "Erro ao buscar medicamentos" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });

    try {
        const body = await req.json();
        if (!body?.nome || !body?.categoria) {
            return NextResponse.json({ error: "Nome e categoria do medicamento são obrigatórios." }, { status: 400 });
        }

        const data = buildMedicamentoData(body, true) as Parameters<typeof prisma.medicamento.create>[0]["data"];
        const med = await prisma.medicamento.create({ data });
        revalidatePaths(REVALIDATE_GROUPS.medicamentos);
        return NextResponse.json(med, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar medicamento:", error);
        return NextResponse.json({ error: "Erro ao criar medicamento" }, { status: 500 });
    }
}

