export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "URL não fornecida" }, { status: 400 });
    }

    // Suporte para arquivos salvos em formato Base64 (data:application/pdf;base64,...)
    if (url.startsWith("data:")) {
        try {
            const [header, base64Data] = url.split(",");
            if (!base64Data) {
                return NextResponse.json({ error: "Dados do arquivo corrompidos" }, { status: 400 });
            }
            const contentType = header.split(";")[0].split(":")[1] || "application/pdf";
            const buffer = Buffer.from(base64Data, "base64");
            return new NextResponse(buffer, {
                status: 200,
                headers: {
                    "Content-Type": contentType,
                    "Content-Disposition": "inline",
                    "Cache-Control": "public, max-age=86400",
                },
            });
        } catch (error) {
            return NextResponse.json({ error: "Erro ao decodificar arquivo base64" }, { status: 500 });
        }
    }

    const requestUrl = new URL(req.url);
    const origin = requestUrl.origin;

    // Validar formato básico da URL (resolvendo URLs relativas com o origin do site)
    let parsedUrl;
    try {
        parsedUrl = new URL(url, origin);
    } catch (e) {
        return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return NextResponse.json({ error: "Protocolo não permitido" }, { status: 403 });
    }

    // Se a URL pertence à mesma origem (arquivo local), verificamos se o arquivo existe fisicamente
    // na pasta public. Se existir, redirecionamos para ele. Se não existir, NÃO retornamos erro
    // imediatamente, pois o arquivo pode estar acessível via proxy reverso/Nginx em caminhos legados (ex: /wp-content).
    // Nesses casos, deixamos a requisição seguir para o fetch remoto abaixo.
    if (parsedUrl.origin === origin) {
        try {
            const fs = await import("fs");
            const path = await import("path");
            const filePath = path.join(process.cwd(), "public", parsedUrl.pathname);
            
            if (fs.existsSync(filePath)) {
                return NextResponse.redirect(parsedUrl.toString());
            }
            console.log(`Arquivo local não encontrado fisicamente em ${filePath}. Tentando carregamento via fetch remoto.`);
        } catch (e) {
            console.error("Erro ao verificar arquivo local:", e);
        }
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return NextResponse.json({ error: "Arquivo não encontrado ou inacessível" }, { status: response.status });
        }

        // Medida de segurança: verificar se o conteúdo retornado é realmente um PDF ou imagem
        const contentType = response.headers.get("content-type")?.toLowerCase() || "";
        const isPdfOrImage = contentType.includes("pdf") || contentType.includes("image/");
        const isOctetStream = contentType.includes("application/octet-stream") || contentType.includes("application/force-download") || contentType.includes("application/download");

        if (!isPdfOrImage && !isOctetStream) {
            console.warn(`Proxy interceptou tipo de conteúdo alternativo (${contentType}) para a URL: ${url}. Redirecionando iframe para a URL original.`);
            
            // Em vez de mostrar a mensagem de erro ou uma tela intermediária, 
            // redirecionamos o iframe para a URL original. Se for uma página HTML (ex: Diário Oficial),
            // o navegador tentará renderizá-la dentro do iframe normalmente.
            return NextResponse.redirect(url);
        }

        const buffer = await response.arrayBuffer();

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": contentType.includes("pdf") ? "application/pdf" : contentType,
                "Content-Disposition": "inline",
                "Cache-Control": "public, max-age=86400",
            },
        });
    } catch (error) {
        console.error("Erro ao fazer proxy do PDF:", error);
        return NextResponse.json({ error: "Erro ao carregar arquivo" }, { status: 500 });
    }
}

