import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define o diretório de upload
        const uploadDir = join(process.cwd(), "public", "uploads");

        // Cria o diretório se não existir
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Gera um nome único e limpo para o arquivo
        const timestamp = Date.now();
        const safeName = file.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // remove acentos
            .replace(/[^a-z0-9.]/g, "_") // remove caracs especiais
            .replace(/_+/g, "_"); // remove duplicatas de _

        const fileName = `${timestamp}-${safeName}`;
        const path = join(uploadDir, fileName);

        try {
            await writeFile(path, buffer);
            console.log(`✅ Arquivo salvo com sucesso em: ${path}`);
        } catch (writeError: any) {
            console.error("❌ Erro ao gravar arquivo no disco:", writeError);
            return NextResponse.json({ 
                error: "Erro ao gravar no disco", 
                details: writeError.message 
            }, { status: 500 });
        }

        const fileUrl = `/uploads/${fileName}`;
        console.log(`🔗 URL gerada: ${fileUrl}`);
        return NextResponse.json({ url: fileUrl });
    } catch (error: any) {
        console.error("❌ Erro crítico no upload:", error);
        return NextResponse.json({ 
            error: "Erro interno no servidor", 
            details: error.message 
        }, { status: 500 });
    }
}
