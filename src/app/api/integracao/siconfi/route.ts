import { NextRequest, NextResponse } from "next/server";
import { getRREOSiconfi, getRGFSiconfi } from "@/lib/siconfi-service";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo") || "rreo";
    const ano = parseInt(searchParams.get("ano") || new Date().getFullYear().toString());
    const periodo = parseInt(searchParams.get("periodo") || "1");
    const anexo = searchParams.get("anexo") || "01";

    try {
        let items = [];
        const params = { an_exercicio: ano, periodo, nr_anexo: anexo };

        if (tipo.toLowerCase() === "rreo") {
            items = await getRREOSiconfi(params);
        } else {
            items = await getRGFSiconfi(params);
        }

        return NextResponse.json({
            items,
            lastUpdate: new Date().toISOString(),
            source: "Siconfi / Tesouro Nacional"
        });

    } catch (error) {
        console.error("Erro na rota API/SICONFI:", error);
        return NextResponse.json({ 
            error: "Falha ao extrair dados do SICONFI.",
            items: [] 
        }, { status: 500 });
    }
}
