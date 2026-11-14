export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.medicamento.findUnique({ where: { id: params.id } });
        if (!item) return NextResponse.json({ error: "Medicamento não encontrado" }, { status: 404 });
        return jsonNoStore(item);
    } catch {
        return NextResponse.json({ error: "Erro ao buscar medicamento" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });

    try {
        const body = await req.json();
        const qtyRaw = body.quantidadeEstoque;
        const minRaw = body.estoqueMinimo;
        const qty = qtyRaw !== undefined && qtyRaw !== null && qtyRaw !== "" ? parseInt(String(qtyRaw), 10) : undefined;
        const min = minRaw !== undefined && minRaw !== null && minRaw !== "" ? parseInt(String(minRaw), 10) : undefined;

        const item = await prisma.medicamento.update({
            where: { id: params.id },
            data: {
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
                dataReferenciaEstoque: new Date(),
            }
        });
        revalidatePaths(REVALIDATE_GROUPS.medicamentos);
        return NextResponse.json(item);
    } catch (error) {
        console.error("Erro ao atualizar medicamento:", error);
        return NextResponse.json({ error: "Erro ao atualizar medicamento" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });

    try {
        await prisma.medicamento.delete({ where: { id: params.id } });
        revalidatePaths(REVALIDATE_GROUPS.medicamentos);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao excluir medicamento:", error);
        return NextResponse.json({ error: "Erro ao excluir medicamento" }, { status: 500 });
    }
}
