import { NextRequest, NextResponse } from "next/server";
import { getLicitacoesPNCP } from "@/lib/pncp-service";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const pagina = parseInt(searchParams.get("pagina") || "1");
    const tamanho = parseInt(searchParams.get("tamanho") || "10");

    try {
        const rawData = await getLicitacoesPNCP(pagina, tamanho);
        
        // Se a API do governo retornar um erro ou formato inesperado, 
        // fallback para um array vazio e total 0.
        if (!rawData || !rawData.data) {
            return NextResponse.json({ 
                data: [], 
                totalPaginas: 0, 
                totalRegistros: 0 
            });
        }

        // PNCP costuma retornar o campo 'data' com a lista e 'totalPaginas'
        return NextResponse.json({
            data: rawData.data,
            totalPaginas: rawData.totalPaginas || 1,
            totalRegistros: rawData.totalRegistros || 0
        });

    } catch (error) {
        console.error("Erro na rota API/PNCP:", error);
        return NextResponse.json({ 
            error: "Falha ao conectar com o PNCP. Tente novamente mais tarde.",
            data: [],
            totalPaginas: 0
        }, { status: 500 });
    }
}
