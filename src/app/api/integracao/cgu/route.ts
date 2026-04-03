import { NextRequest, NextResponse } from "next/server";
import { getTransferenciasCGU } from "@/lib/cgu-service";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const mes = searchParams.get("mes") || "03";
    const ano = searchParams.get("ano") || "2024";
    const pagina = parseInt(searchParams.get("pagina") || "1");

    try {
        const items = await getTransferenciasCGU(`${mes}/${ano}`, pagina);
        
        return NextResponse.json({
            items,
            lastUpdate: new Date().toISOString(),
            source: "CGU / Portal da Transparência"
        });

    } catch (error) {
        console.error("Erro na rota API/CGU:", error);
        return NextResponse.json({ 
            error: "Falha ao extrair repasses da CGU.",
            items: [] 
        }, { status: 500 });
    }
}
