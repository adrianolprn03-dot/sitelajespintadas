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

    // Determinar qual a URL final de onde vamos obter o arquivo
    let fetchUrl = url;
    const decodedPath = decodeURIComponent(parsedUrl.pathname);

    // 1. Se a URL pertence à mesma origem, ou se for do WordPress legado (/wp-content/uploads/)
    if (parsedUrl.origin === origin) {
        fetchUrl = parsedUrl.toString();
    } else if (decodedPath.includes("wp-content/uploads/")) {
        const relativePath = decodedPath.substring(decodedPath.indexOf("wp-content/uploads/") + "wp-content/uploads/".length);
        const localTargetUrl = new URL(`/legacy-uploads/${relativePath}`, req.url);
        fetchUrl = localTargetUrl.toString();
        console.log(`[PDF Proxy] Mapeando URL WordPress para local: ${fetchUrl}`);
    }

    // Encaminhar headers da requisição original (como cookies e bypass tokens) para o fetch interno
    const headers = new Headers();
    req.headers.forEach((value, key) => {
        if (key.toLowerCase() !== "host") {
            headers.set(key, value);
        }
    });

    try {
        let response = await fetch(fetchUrl, { headers });

        // Se falhar ao buscar localmente (por exemplo, 404 ou 403), tenta a URL remota original
        if (!response.ok && fetchUrl !== url) {
            console.warn(`[PDF Proxy] Falha ao carregar arquivo local mapeado (${response.status}). Tentando URL original: ${url}`);
            response = await fetch(url, { headers });
        }

        if (!response.ok) {
            return NextResponse.json({ error: "Arquivo não encontrado ou inacessível" }, { status: response.status });
        }

        // Medida de segurança: verificar se o conteúdo retornado é realmente um PDF ou imagem
        const contentType = response.headers.get("content-type")?.toLowerCase() || "";
        const isPdfOrImage = contentType.includes("pdf") || contentType.includes("image/");
        const isOctetStream = contentType.includes("application/octet-stream") || contentType.includes("application/force-download") || contentType.includes("application/download");

        if (!isPdfOrImage && !isOctetStream) {
            console.warn(`Proxy interceptou tipo de conteúdo alternativo (${contentType}) para a URL: ${url}. Redirecionando iframe para a URL original.`);
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

