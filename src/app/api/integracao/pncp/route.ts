export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getLicitacoesPNCP, getLicitacoesTodasModalidades } from "@/lib/pncp-service";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const pagina = parseInt(searchParams.get("pagina") || "1");
    const tamanho = parseInt(searchParams.get("tamanho") || "10");
    const modalidadeParam = searchParams.get("modalidade");
    const anoInicial = searchParams.get("anoInicial") ? parseInt(searchParams.get("anoInicial")!) : undefined;
    const anoFinal = searchParams.get("anoFinal") ? parseInt(searchParams.get("anoFinal")!) : undefined;

    try {
        let rawData;
        if (modalidadeParam) {
            rawData = await getLicitacoesPNCP(pagina, tamanho, parseInt(modalidadeParam), anoInicial, anoFinal);
        } else {
            rawData = await getLicitacoesPNCP(pagina, tamanho, undefined, anoInicial, anoFinal);
            if (!rawData || rawData.empty || !rawData.data || rawData.data.length === 0) {
                const fallback = await getLicitacoesTodasModalidades(pagina, tamanho, anoInicial, anoFinal);
                if (fallback && fallback.data && fallback.data.length > 0) {
                    rawData = fallback;
                }
            }
        }

        if (!rawData || !rawData.data) {
            return NextResponse.json({ 
                data: [], 
                totalPaginas: 0, 
                totalRegistros: 0,
                empty: true
            });
        }

        return NextResponse.json({
            data: rawData.data,
            totalPaginas: rawData.totalPaginas || 1,
            totalRegistros: rawData.totalRegistros || 0,
            numeroPagina: rawData.numeroPagina || pagina,
            empty: rawData.empty ?? false,
        });

    } catch (error) {
        console.error("Erro na rota API/PNCP:", error);
        return NextResponse.json({ 
            error: "Falha ao conectar com o PNCP. Tente novamente mais tarde.",
            data: [],
            totalPaginas: 0,
            totalRegistros: 0,
        }, { status: 500 });
    }
}

