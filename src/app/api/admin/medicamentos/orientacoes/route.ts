export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";
import {
    CONFIG_CHAVE_ORIENTACOES,
    CONFIG_GRUPO_SAUDE,
    sanitizeOrientacoesMedicamentos,
} from "@/lib/assistencia-farmaceutica";
import { getOrientacoesMedicamentosFromDb } from "@/lib/assistencia-farmaceutica.server";

export async function GET() {
    const auth = await requireServerAuth(["admin", "controladoria", "editor"]);
    if (!auth.authorized) return auth.response;

    try {
        const orientacoes = await getOrientacoesMedicamentosFromDb();
        return jsonNoStore(orientacoes);
    } catch (error) {
        console.error("Erro ao carregar orientações de medicamentos:", error);
        return NextResponse.json({ error: "Erro ao buscar orientações de medicamentos" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const auth = await requireServerAuth(["admin", "controladoria", "editor"]);
    if (!auth.authorized) return auth.response;

    try {
        const body = await req.json();
        const sanitized = sanitizeOrientacoesMedicamentos(body);
        const payload = {
            ...sanitized,
            atualizadoEm: new Date().toISOString(),
            atualizadoPor: auth.user.nome,
        };

        const anterior = await prisma.configuracao.findUnique({
            where: { chave: CONFIG_CHAVE_ORIENTACOES },
            select: { valor: true },
        });

        await prisma.configuracao.upsert({
            where: { chave: CONFIG_CHAVE_ORIENTACOES },
            update: {
                valor: JSON.stringify(payload),
                grupo: CONFIG_GRUPO_SAUDE,
                descricao:
                    "Orientações oficiais de acesso a medicamentos básicos (CBAF), alto custo (CEAF) e estratégicos (CESAF).",
            },
            create: {
                chave: CONFIG_CHAVE_ORIENTACOES,
                valor: JSON.stringify(payload),
                grupo: CONFIG_GRUPO_SAUDE,
                descricao:
                    "Orientações oficiais de acesso a medicamentos básicos (CBAF), alto custo (CEAF) e estratégicos (CESAF).",
            },
        });

        await registrarHistoricoAlteracao({
            entidade: "Configuracao",
            entidadeId: CONFIG_CHAVE_ORIENTACOES,
            acao: "edicao",
            resumoAlteracao: "Atualização das orientações de acesso a medicamentos do SUS (CBAF e Alto Custo / CEAF)",
            dadosAnteriores: anterior?.valor || null,
            dadosNovos: payload,
            secretaria: "Secretaria Municipal de Saúde",
            user: auth.user,
        });

        revalidatePaths(REVALIDATE_GROUPS.medicamentos);
        return jsonNoStore(payload);
    } catch (error) {
        console.error("Erro ao salvar orientações de medicamentos:", error);
        return NextResponse.json({ error: "Erro ao salvar orientações de medicamentos" }, { status: 500 });
    }
}
