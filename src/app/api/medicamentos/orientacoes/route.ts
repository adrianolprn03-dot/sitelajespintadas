export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { jsonNoStore } from "@/lib/revalidate-site";
import { getOrientacoesMedicamentosFromDb } from "@/lib/assistencia-farmaceutica.server";

export async function GET() {
    try {
        const orientacoes = await getOrientacoesMedicamentosFromDb();
        return jsonNoStore(orientacoes);
    } catch (error) {
        console.error("Erro ao carregar orientações públicas de medicamentos:", error);
        return NextResponse.json({ error: "Erro interno ao buscar orientações" }, { status: 500 });
    }
}
