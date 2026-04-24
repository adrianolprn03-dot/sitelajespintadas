import { NextRequest, NextResponse } from "next/server";

const CNPJ_LAJES = "08159394000137";

export interface PNCPArquivo {
    uri: string;
    url: string;
    statusAtivo: boolean;
    cnpj: string;
    anoCompra: number;
    sequencialCompra: number;
    sequencialDocumento: number;
    titulo: string;
    tipoDocumentoId: number;
    tipoDocumentoNome: string;
    tipoDocumentoDescricao: string;
    dataPublicacaoPncp: string;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const ano = searchParams.get("ano");
    const seq = searchParams.get("seq");

    if (!ano || !seq) {
        return NextResponse.json({ error: "Parâmetros 'ano' e 'seq' são obrigatórios." }, { status: 400 });
    }

    const url = `https://pncp.gov.br/api/pncp/v1/orgaos/${CNPJ_LAJES}/compras/${ano}/${seq}/arquivos`;

    try {
        const res = await fetch(url, {
            headers: { Accept: "application/json" },
            next: { revalidate: 1800 }, // Cache de 30 min
        });

        if (!res.ok) {
            if (res.status === 404) {
                return NextResponse.json([]); // Sem documentos é normal
            }
            throw new Error(`PNCP respondeu ${res.status}`);
        }

        const data: PNCPArquivo[] = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("[PNCP] Erro ao buscar arquivos:", error);
        return NextResponse.json({ error: "Falha ao buscar documentos." }, { status: 500 });
    }
}
