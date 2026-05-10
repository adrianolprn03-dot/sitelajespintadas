import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Configuração centralizada do Cloudflare R2
export const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
});

/**
 * Extrai a chave (key) do R2 a partir da URL pública do arquivo.
 * Exemplo: "https://pub-xxx.r2.dev/uploads/123-foto.webp" → "uploads/123-foto.webp"
 */
function extractKeyFromUrl(fileUrl: string): string | null {
    try {
        const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, "") || "";
        if (publicBase && fileUrl.startsWith(publicBase)) {
            // Remove a base pública e o "/" inicial
            return fileUrl.slice(publicBase.length).replace(/^\//, "");
        }
        // Fallback: tenta extrair tudo após o domínio
        const url = new URL(fileUrl);
        return url.pathname.replace(/^\//, "");
    } catch {
        return null;
    }
}

/**
 * Deleta um arquivo do Cloudflare R2 a partir da sua URL pública.
 * Falha silenciosamente (log no console) para não bloquear a exclusão do registro.
 */
export async function deleteFileFromR2(fileUrl: string): Promise<void> {
    if (!fileUrl) return;

    const key = extractKeyFromUrl(fileUrl);
    if (!key) {
        console.warn(`⚠️ R2: Não foi possível extrair a chave de: ${fileUrl}`);
        return;
    }

    try {
        await r2Client.send(
            new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: key,
            })
        );
        console.log(`🗑️ R2: Arquivo removido com sucesso: ${key}`);
    } catch (error: any) {
        console.error(`❌ R2: Erro ao deletar arquivo ${key}:`, error.message);
        // Não relança o erro para não bloquear a exclusão do registro no banco
    }
}
