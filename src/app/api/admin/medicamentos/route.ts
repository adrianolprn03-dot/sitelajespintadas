export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";
import { buildMedicamentoData } from "@/lib/assistencia-farmaceutica";

export async function GET() {
    const auth = await requireServerAuth(["admin", "controladoria", "editor", "integracao"]);
    if (!auth.authorized) return auth.response;

    try {
        const medicamentos = await prisma.medicamento.findMany({
            orderBy: { nome: "asc" },
        });
        return jsonNoStore(medicamentos);
    } catch {
        return NextResponse.json({ error: "Erro ao buscar medicamentos" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const auth = await requireServerAuth(["admin", "controladoria", "editor"]);
    if (!auth.authorized) return auth.response;

    try {
        const body = await req.json();
        const nome = typeof body?.nome === "string" ? body.nome.trim() : "";
        const categoria = typeof body?.categoria === "string" ? body.categoria.trim() : "";
        if (!nome || !categoria) {
            return NextResponse.json({ error: "Nome e categoria do medicamento são obrigatórios." }, { status: 400 });
        }

        const data = buildMedicamentoData(body, true) as Parameters<typeof prisma.medicamento.create>[0]["data"];
        const med = await prisma.medicamento.create({ data });

        await registrarHistoricoAlteracao({
            entidade: "Medicamento",
            entidadeId: med.id,
            acao: "criacao",
            resumoAlteracao: `Cadastro de medicamento: ${med.nome} (${med.tipoComponente})`,
            dadosNovos: med,
            secretaria: "Secretaria Municipal de Saúde",
            user: auth.user,
        });

        revalidatePaths(REVALIDATE_GROUPS.medicamentos);
        return jsonNoStore(med, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar medicamento:", error);
        return NextResponse.json({ error: "Erro ao criar medicamento" }, { status: 500 });
    }
}
