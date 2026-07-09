export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

    // Verificar se o arquivo existe localmente
    try {
        const decodedPath = decodeURIComponent(parsedUrl.pathname);
        let localPath = null;

        // 1. Tentar caminho direto em public/
        const directFilePath = path.join(process.cwd(), "public", decodedPath);
        if (fs.existsSync(directFilePath) && fs.statSync(directFilePath).isFile()) {
            localPath = decodedPath;
        } 
        // 2. Se for uma URL do WordPress (/wp-content/uploads/), verificar se está mapeada localmente
        else if (decodedPath.includes("wp-content/uploads/")) {
            const relativePath = decodedPath.substring(decodedPath.indexOf("wp-content/uploads/") + "wp-content/uploads/".length);
            
            const possibleLocalPaths = [
                { fsPath: path.join(process.cwd(), "public", "tmp-uploads", relativePath), webPath: `/tmp-uploads/${relativePath}` },
                { fsPath: path.join(process.cwd(), "public", "uploads", relativePath), webPath: `/uploads/${relativePath}` },
                { fsPath: path.join(process.cwd(), "public", relativePath), webPath: `/${relativePath}` },
            ];

            for (const p of possibleLocalPaths) {
                if (fs.existsSync(p.fsPath) && fs.statSync(p.fsPath).isFile()) {
                    localPath = p.webPath;
                    break;
                }
            }
        }

        if (localPath) {
            const redirectUrl = new URL(localPath, req.url);
            console.log(`[PDF Proxy] Arquivo encontrado localmente em ${localPath}. Redirecionando...`);
            return NextResponse.redirect(redirectUrl.toString());
        }
    } catch (e) {
        console.error("Erro ao verificar arquivo local:", e);
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

