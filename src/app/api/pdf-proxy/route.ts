import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "URL não fornecida" }, { status: 400 });
    }

    // Validar que a URL é de domínios permitidos (segurança)
    const allowedDomains = ["topsolutionsrn.com.br", "lajespintadas.rn.gov.br"];
    const allowed = allowedDomains.some(domain => url.includes(domain));
    if (!allowed) {
        return NextResponse.json({ error: "Domínio não permitido" }, { status: 403 });
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return NextResponse.json({ error: "Arquivo não encontrado" }, { status: response.status });
        }

        const buffer = await response.arrayBuffer();

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "inline",
                "Cache-Control": "public, max-age=86400",
            },
        });
    } catch (error) {
        console.error("Erro ao fazer proxy do PDF:", error);
        return NextResponse.json({ error: "Erro ao carregar arquivo" }, { status: 500 });
    }
}
