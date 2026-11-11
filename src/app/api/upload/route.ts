export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/r2";
import sharp from "sharp";

// Tipos de imagem que serão comprimidos para WebP
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/tiff"];

// Largura máxima para redimensionamento (preserva aspecto)
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 82; // Qualidade WebP (0-100) — 82 é um excelente balanço entre tamanho e qualidade visual

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
        }

        // Converte para Buffer
        let buffer = Buffer.from(await file.arrayBuffer());
        let contentType = file.type;
        const originalSize = buffer.length;

        // Gera um nome limpo para o arquivo
        const safeName = file.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // remove acentos
            .replace(/[^a-z0-9.]/g, "_") // remove caracs especiais
            .replace(/_+/g, "_"); // remove duplicatas de _

        let finalName: string;

        // Se for imagem, comprimir com Sharp e converter para WebP
        if (IMAGE_TYPES.includes(file.type)) {
            const nameWithoutExt = safeName.replace(/\.[^.]+$/, "");
            finalName = `uploads/${Date.now()}-${nameWithoutExt}.webp`;

            buffer = Buffer.from(await sharp(buffer)
                .resize({ width: MAX_WIDTH, withoutEnlargement: true }) // Não amplia imagens menores
                .webp({ quality: WEBP_QUALITY })
                .toBuffer());

            contentType = "image/webp";

            const savings = ((1 - buffer.length / originalSize) * 100).toFixed(1);
            console.log(`🖼️ Imagem comprimida: ${(originalSize / 1024).toFixed(0)}KB → ${(buffer.length / 1024).toFixed(0)}KB (${savings}% menor)`);
        } else {
            // PDFs e outros arquivos — salva como está
            finalName = `uploads/${Date.now()}-${safeName}`;
        }

        // Faz o upload para o Cloudflare R2
        await r2Client.send(new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: finalName,
            Body: buffer,
            ContentType: contentType,
        }));

        // Remove a barra final do public url se existir
        const baseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '') || "";
        const publicUrl = `${baseUrl}/${finalName}`;

        console.log(`✅ Arquivo salvo com sucesso no R2: ${publicUrl}`);

        // Retorna a URL pública do blob
        return NextResponse.json({ url: publicUrl });
    } catch (error: any) {
        console.error("❌ Erro crítico no upload:", error);
        return NextResponse.json({ 
            error: "Erro no servidor ao realizar upload (R2)", 
            details: error.message 
        }, { status: 500 });
    }
}
