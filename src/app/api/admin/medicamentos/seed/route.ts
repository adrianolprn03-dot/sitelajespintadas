export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";
import { CATALOGO_BASE_SUS } from "@/lib/assistencia-farmaceutica";

export async function POST(req: Request) {
    const auth = await requireServerAuth(["admin", "controladoria", "editor", "integracao"]);
    if (!auth.authorized) return auth.response;

    try {
        let componenteFiltro = "todos";
        try {
            const body = await req.json();
            if (body && typeof body.componente === "string" && body.componente.trim()) {
                componenteFiltro = body.componente.trim();
            }
        } catch {
            // Body opcional
        }

        const baseFiltrada =
            componenteFiltro === "todos"
                ? CATALOGO_BASE_SUS
                : CATALOGO_BASE_SUS.filter((item) => item.tipoComponente === componenteFiltro);

        const existentes = await prisma.medicamento.findMany({
            select: { nome: true },
        });
        const nomesExistentes = new Set(existentes.map((m) => m.nome.trim().toLowerCase()));

        const novosItens = baseFiltrada
            .filter((item) => !nomesExistentes.has(item.nome.trim().toLowerCase()))
            .map((item) => ({
                nome: item.nome,
                principioAtivo: item.principioAtivo,
                apresentacao: item.apresentacao,
                unidadeMedida: item.unidadeMedida,
                categoria: item.categoria,
                tipoComponente: item.tipoComponente,
                unidadeSaude: item.unidadeSaude,
                quantidadeEstoque: item.quantidadeEstoque,
                estoqueMinimo: item.estoqueMinimo,
                status: item.status,
                observacao: item.observacao,
                situacaoPublicacao: "publicado",
                ativo: true,
                dataReferenciaEstoque: new Date(),
            }));

        let inserted = 0;
        if (novosItens.length > 0) {
            const result = await prisma.medicamento.createMany({
                data: novosItens,
            });
            inserted = result.count;
        }

        const skipped = baseFiltrada.length - inserted;
        const total = existentes.length + inserted;

        if (inserted > 0) {
            await registrarHistoricoAlteracao({
                entidade: "Medicamento",
                entidadeId: "catalogo-base-sus",
                acao: "importacao",
                resumoAlteracao: `Carga padrão do elenco SUS/REMUME: ${inserted} medicamento(s) inserido(s), ${skipped} já existente(s).`,
                dadosNovos: { componenteFiltro, inserted, skipped, total },
                secretaria: "Secretaria Municipal de Saúde",
                user: auth.user,
            });
            revalidatePaths(REVALIDATE_GROUPS.medicamentos);
        }

        return jsonNoStore({
            success: true,
            inserted,
            skipped,
            total,
        });
    } catch (error) {
        console.error("Erro ao carregar lista padrão SUS:", error);
        return NextResponse.json({ error: "Erro ao carregar lista padrão de medicamentos do SUS" }, { status: 500 });
    }
}
