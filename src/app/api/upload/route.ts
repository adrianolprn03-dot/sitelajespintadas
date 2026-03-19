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

        // Gera um nome único para o arquivo
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const path = join(uploadDir, fileName);

        await writeFile(path, buffer);
        console.log(`Arquivo salvo em: ${path}`);

        const fileUrl = `/uploads/${fileName}`;
        return NextResponse.json({ url: fileUrl });
    } catch (error) {
        console.error("Erro no upload:", error);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}
