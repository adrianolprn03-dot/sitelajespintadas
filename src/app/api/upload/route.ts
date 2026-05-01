import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configuração do Cloudflare R2
const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
        }

        // Gera um nome limpo para o arquivo
        const safeName = file.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // remove acentos
            .replace(/[^a-z0-9.]/g, "_") // remove caracs especiais
            .replace(/_+/g, "_"); // remove duplicatas de _

        const fileName = `uploads/${Date.now()}-${safeName}`;

        // Converte para Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Faz o upload para o Cloudflare R2
        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
        }));

        // Remove a barra final do public url se existir
        const baseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '') || "";
        const publicUrl = `${baseUrl}/${fileName}`;

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
