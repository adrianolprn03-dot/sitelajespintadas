import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import * as dotenv from "dotenv";

// Carregar variáveis de ambiente
const envLocalPath = path.join(process.cwd(), ".env.local");
const envPulledPath = path.join(process.cwd(), ".env.lajes.pulled");
const envDefaultPath = path.join(process.cwd(), ".env");

if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath });
    console.log("ℹ️ Variáveis de ambiente carregadas do .env.local");
}
if (fs.existsSync(envPulledPath)) {
    dotenv.config({ path: envPulledPath });
    console.log("ℹ️ Variáveis de ambiente carregadas do .env.lajes.pulled");
}
if (fs.existsSync(envDefaultPath)) {
    dotenv.config({ path: envDefaultPath });
    console.log("ℹ️ Variáveis de ambiente carregadas do .env");
}

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL) {
    console.error("❌ Erro: Credenciais do R2 incompletas no arquivo .env.local!");
    process.exit(1);
}

// Inicializar cliente do R2
const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

const prisma = new PrismaClient();

// Função recursiva para listar arquivos
function getFiles(dir: string): string[] {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    const files = dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    });
    return Array.prototype.concat(...files);
}

// Obter content type
function getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const map: Record<string, string> = {
        ".pdf": "application/pdf",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".zip": "application/zip",
        ".csv": "text/csv",
    };
    return map[ext] || "application/octet-stream";
}

async function run() {
    console.log("🚀 Iniciando migração para o Cloudflare R2...");

    const zipPath = path.join(process.cwd(), "uploads.zip");
    const targetDir = path.join(process.cwd(), "public", "wp-content", "uploads");

    // 1. Descompactar se existir o zip
    if (fs.existsSync(zipPath)) {
        console.log("📦 Encontrado uploads.zip. Descompactando...");
        try {
            // Garantir que a pasta final exista e esteja limpa
            if (fs.existsSync(targetDir)) {
                console.log("🧹 Limpando pasta de destino existente...");
                fs.rmSync(targetDir, { recursive: true, force: true });
            }
            fs.mkdirSync(targetDir, { recursive: true });
            
            // Tentar usar o tar (nativo e extremamente rápido no Windows 10/11)
            try {
                console.log("⚡ Extraindo usando tar diretamente no destino...");
                execSync(`tar -xf "${zipPath}" -C "${targetDir}"`, { stdio: "inherit" });
            } catch (tarErr) {
                console.warn("⚠️ Falha ao usar tar. Tentando PowerShell Expand-Archive (mais lento)...");
                execSync(`powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${targetDir}' -Force"`, { stdio: "inherit" });
            }

            // Verificar se o zip criou uma subpasta chamada "uploads" dentro do destino (ex: public/wp-content/uploads/uploads)
            const zipUploadsFolder = path.join(targetDir, "uploads");
            if (fs.existsSync(zipUploadsFolder)) {
                console.log("📂 Estrutura de pasta aninhada encontrada no zip. Ajustando caminhos...");
                const items = fs.readdirSync(zipUploadsFolder);
                for (const item of items) {
                    const oldPath = path.join(zipUploadsFolder, item);
                    const newPath = path.join(targetDir, item);
                    
                    // Se a pasta de destino já existir por algum motivo, removemos antes de mover
                    if (fs.existsSync(newPath)) {
                        fs.rmSync(newPath, { recursive: true, force: true });
                    }
                    fs.renameSync(oldPath, newPath);
                }
                // Remover a pasta aninhada vazia
                fs.rmdirSync(zipUploadsFolder);
            }

            console.log("✅ Descompactação concluída com sucesso!");
        } catch (err: any) {
            console.error("❌ Erro ao descompactar uploads.zip:", err.message);
            process.exit(1);
        }
    }

    if (!fs.existsSync(targetDir)) {
        console.error(`❌ Pasta de uploads não encontrada no caminho: ${targetDir}`);
        console.log("Por favor, coloque a pasta uploads em public/wp-content/uploads ou uploads.zip na raiz.");
        process.exit(1);
    }

    // 2. Varrer e fazer upload para o R2
    console.log("🔍 Procurando arquivos locais em public/wp-content/uploads...");
    const allFiles = getFiles(targetDir);
    console.log(`📁 Encontrados ${allFiles.length} arquivos para upload.`);

    const CONCURRENCY_LIMIT = 50;
    let successCount = 0;
    let failCount = 0;

    // Função de worker que processa uma fila de uploads
    async function uploadWorker(filesToUpload: { filePath: string; index: number }[]) {
        for (const item of filesToUpload) {
            const { filePath, index } = item;
            
            // Ignorar arquivo de metadados .htaccess se presente no zip do WordPress
            if (path.basename(filePath) === ".htaccess") {
                continue;
            }

            const relativePath = path.relative(path.join(process.cwd(), "public"), filePath).replace(/\\/g, "/");
            
            // Log a cada 100 arquivos para não sobrecarregar o console do usuário
            if (index % 100 === 0 || index === allFiles.length - 1) {
                console.log(`[${index + 1}/${allFiles.length}] Enviando: ${relativePath}...`);
            }

            try {
                const fileBuffer = fs.readFileSync(filePath);
                const contentType = getContentType(filePath);

                await r2Client.send(new PutObjectCommand({
                    Bucket: R2_BUCKET_NAME,
                    Key: relativePath,
                    Body: fileBuffer,
                    ContentType: contentType,
                }));
                
                successCount++;
            } catch (error: any) {
                console.error(`❌ Falha ao enviar ${relativePath}:`, error.message);
                failCount++;
            }
        }
    }

    // Dividir os arquivos entre os workers de concorrência
    const queue = allFiles.map((filePath, index) => ({ filePath, index }));
    const workerQueues: { filePath: string; index: number }[][] = Array.from({ length: CONCURRENCY_LIMIT }, () => []);
    
    queue.forEach((item, idx) => {
        workerQueues[idx % CONCURRENCY_LIMIT].push(item);
    });

    console.log(`⚡ Iniciando uploads com concorrência de ${CONCURRENCY_LIMIT} threads...`);
    const startTime = Date.now();
    
    const workers: Promise<void>[] = [];
    for (let i = 0; i < CONCURRENCY_LIMIT; i++) {
        workers.push(uploadWorker(workerQueues[i]));
    }

    await Promise.all(workers);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    console.log(`\n⚡ Todos os uploads concluídos em ${duration}s!`);
    console.log(`📊 Resumo do Upload: ${successCount} com sucesso, ${failCount} falhas.`);

    // 3. Atualizar Banco de Dados
    console.log("\n🔄 Atualizando referências no banco de dados Neon...");

    const oldDomain = "lajespintadas.rn.gov.br";
    const r2DomainUrl = `${R2_PUBLIC_URL}/wp-content/uploads`;

    // Função de substituição das URLs
    const getNewUrl = (url: string | null): string | null => {
        if (!url) return null;
        
        // Se for URL completa com o domínio antigo do WP
        if (url.includes(`${oldDomain}/wp-content/uploads/`)) {
            return url.replace(new RegExp(`https?://${oldDomain}/wp-content/uploads/`, "g"), `${r2DomainUrl}/`);
        }
        
        // Se for caminho relativo /wp-content/uploads/
        if (url.startsWith("/wp-content/uploads/")) {
            return url.replace("/wp-content/uploads/", `${r2DomainUrl}/`);
        }
        if (url.startsWith("wp-content/uploads/")) {
            return url.replace("wp-content/uploads/", `${r2DomainUrl}/`);
        }
        
        return url;
    };

    try {
        // --- 3.1 Legislacao ---
        console.log("📝 Atualizando Legislações...");
        const legislacoes = await prisma.legislacao.findMany({
            where: {
                OR: [
                    { arquivo: { contains: "wp-content/uploads" } },
                    { documentUrl: { contains: "wp-content/uploads" } }
                ]
            }
        });
        
        for (const item of legislacoes) {
            await prisma.legislacao.update({
                where: { id: item.id },
                data: {
                    arquivo: getNewUrl(item.arquivo),
                    documentUrl: getNewUrl(item.documentUrl)
                }
            });
        }
        console.log(`✅ ${legislacoes.length} legislações atualizadas.`);

        // --- 3.2 Documento ---
        console.log("📄 Atualizando Documentos...");
        const documentos = await prisma.documento.findMany({
            where: {
                OR: [
                    { arquivo: { contains: "wp-content/uploads" } },
                    { documentUrl: { contains: "wp-content/uploads" } }
                ]
            }
        });
        
        for (const item of documentos) {
            await prisma.documento.update({
                where: { id: item.id },
                data: {
                    arquivo: getNewUrl(item.arquivo),
                    documentUrl: getNewUrl(item.documentUrl)
                }
            });
        }
        console.log(`✅ ${documentos.length} documentos atualizados.`);

        // --- 3.3 RelatorioFiscal ---
        console.log("📊 Atualizando Relatórios Fiscais...");
        const relatorios = await prisma.relatorioFiscal.findMany({
            where: { arquivo: { contains: "wp-content/uploads" } }
        });
        for (const item of relatorios) {
            await prisma.relatorioFiscal.update({
                where: { id: item.id },
                data: { arquivo: getNewUrl(item.arquivo) || "" }
            });
        }
        console.log(`✅ ${relatorios.length} relatórios fiscais atualizados.`);

        // --- 3.4 Diaria ---
        console.log("✈️ Atualizando Diárias...");
        const diarias = await prisma.diaria.findMany({
            where: { portariaUrl: { contains: "wp-content/uploads" } }
        });
        for (const item of diarias) {
            await prisma.diaria.update({
                where: { id: item.id },
                data: { portariaUrl: getNewUrl(item.portariaUrl) }
            });
        }
        console.log(`✅ ${diarias.length} diárias atualizadas.`);

        // --- 3.5 Concurso ---
        console.log("🏫 Atualizando Concursos...");
        const concursos = await prisma.concurso.findMany({
            where: { linkEdital: { contains: "wp-content/uploads" } }
        });
        for (const item of concursos) {
            await prisma.concurso.update({
                where: { id: item.id },
                data: { linkEdital: getNewUrl(item.linkEdital) }
            });
        }
        console.log(`✅ ${concursos.length} concursos atualizados.`);

        // --- 3.6 EmendaPix ---
        console.log("💰 Atualizando Emendas Pix...");
        const emendasPix = await prisma.emendaPix.findMany({
            where: {
                OR: [
                    { arquivo: { contains: "wp-content/uploads" } },
                    { documentUrl: { contains: "wp-content/uploads" } }
                ]
            }
        });
        for (const item of emendasPix) {
            await prisma.emendaPix.update({
                where: { id: item.id },
                data: {
                    arquivo: getNewUrl(item.arquivo),
                    documentUrl: getNewUrl(item.documentUrl)
                }
            });
        }
        console.log(`✅ ${emendasPix.length} emendas pix atualizadas.`);

        // --- 3.7 Secretarias ---
        console.log("🏛️ Atualizando Imagens de Secretarias...");
        const secretarias = await prisma.secretaria.findMany({
            where: { imagem: { contains: "wp-content/uploads" } }
        });
        for (const item of secretarias) {
            await prisma.secretaria.update({
                where: { id: item.id },
                data: { imagem: getNewUrl(item.imagem) }
            });
        }
        console.log(`✅ ${secretarias.length} secretarias atualizadas.`);

        // --- 3.8 Noticias ---
        console.log("📰 Atualizando Notícias...");
        const noticias = await prisma.noticia.findMany({
            where: {
                OR: [
                    { imagem: { contains: "wp-content/uploads" } },
                    { conteudo: { contains: "wp-content/uploads" } }
                ]
            }
        });
        for (const item of noticias) {
            // Atualiza imagem de destaque
            let novaImagem = getNewUrl(item.imagem);
            
            // Substituir todas as ocorrências de links do WP no corpo da notícia (HTML)
            let novoConteudo = item.conteudo;
            if (novoConteudo.includes("wp-content/uploads")) {
                novoConteudo = novoConteudo.replace(new RegExp(`https?://${oldDomain}/wp-content/uploads/`, "g"), `${r2DomainUrl}/`);
                novoConteudo = novoConteudo.replace(/\/wp-content\/uploads\//g, `${r2DomainUrl}/`);
                novoConteudo = novoConteudo.replace(/wp-content\/uploads\//g, `${r2DomainUrl}/`);
            }

            await prisma.noticia.update({
                where: { id: item.id },
                data: {
                    imagem: novaImagem,
                    conteudo: novoConteudo
                }
            });
        }
        console.log(`✅ ${noticias.length} notícias atualizadas.`);

        // --- 3.9 Tabelas com arrays de documentos em formato JSON ---
        
        // Licitacao
        console.log("🤝 Atualizando Licitações (JSON)...");
        const licitacoes = await prisma.licitacao.findMany({
            where: { documentos: { contains: "wp-content/uploads" } }
        });
        for (const item of licitacoes) {
            try {
                const docs = JSON.parse(item.documentos || "[]");
                const novosDocs = docs.map((d: any) => ({
                    ...d,
                    url: getNewUrl(d.url) || ""
                }));
                await prisma.licitacao.update({
                    where: { id: item.id },
                    data: { documentos: JSON.stringify(novosDocs) }
                });
            } catch (e) {
                console.error(`Erro ao atualizar JSON da licitação ${item.id}`);
            }
        }
        console.log(`✅ ${licitacoes.length} licitações atualizadas.`);

        // Contrato
        console.log("💼 Atualizando Contratos (JSON)...");
        const contratos = await prisma.contrato.findMany({
            where: { documentos: { contains: "wp-content/uploads" } }
        });
        for (const item of contratos) {
            try {
                const docs = JSON.parse(item.documentos || "[]");
                const novosDocs = docs.map((d: any) => ({
                    ...d,
                    url: getNewUrl(d.url) || ""
                }));
                await prisma.contrato.update({
                    where: { id: item.id },
                    data: { documentos: JSON.stringify(novosDocs) }
                });
            } catch (e) {
                console.error(`Erro ao atualizar JSON do contrato ${item.id}`);
            }
        }
        console.log(`✅ ${contratos.length} contratos atualizados.`);

        // Convenio
        console.log("📃 Atualizando Convênios (JSON)...");
        const convenios = await prisma.convenio.findMany({
            where: { documentos: { contains: "wp-content/uploads" } }
        });
        for (const item of convenios) {
            try {
                const docs = JSON.parse(item.documentos || "[]");
                const novosDocs = docs.map((d: any) => ({
                    ...d,
                    url: getNewUrl(d.url) || ""
                }));
                await prisma.convenio.update({
                    where: { id: item.id },
                    data: { documentos: JSON.stringify(novosDocs) }
                });
            } catch (e) {
                console.error(`Erro ao atualizar JSON do convênio ${item.id}`);
            }
        }
        console.log(`✅ ${convenios.length} convênios atualizados.`);

        // Obra
        console.log("🏗️ Atualizando Obras (JSON)...");
        const obras = await prisma.obra.findMany({
            where: { documentos: { contains: "wp-content/uploads" } }
        });
        for (const item of obras) {
            try {
                const docs = JSON.parse(item.documentos || "[]");
                const novosDocs = docs.map((d: any) => ({
                    ...d,
                    url: getNewUrl(d.url) || ""
                }));
                await prisma.obra.update({
                    where: { id: item.id },
                    data: { documentos: JSON.stringify(novosDocs) }
                });
            } catch (e) {
                console.error(`Erro ao atualizar JSON da obra ${item.id}`);
            }
        }
        console.log(`✅ ${obras.length} obras atualizadas.`);

        console.log("\n🎉 Banco de dados atualizado com sucesso!");

    } catch (dbError: any) {
        console.error("❌ Erro durante a atualização do banco de dados:", dbError.message);
    } finally {
        await prisma.$disconnect();
    }

    // 4. Limpeza da pasta física de uploads
    console.log("\n🧹 Limpando arquivos locais temporários...");
    try {
        const wpContentDir = path.join(process.cwd(), "public", "wp-content");
        if (fs.existsSync(wpContentDir)) {
            // Usar PowerShell no Windows para remover
            execSync(`powershell -Command "Remove-Item -Recurse -Force '${wpContentDir}'"`, { stdio: "inherit" });
            console.log("✅ Pasta public/wp-content removida.");
        }
    } catch (cleanupErr: any) {
        console.warn("⚠️ Alerta: Não foi possível remover a pasta temporária public/wp-content automaticamente. Por favor, remova-a manualmente antes de commitar.");
    }

    console.log("\n✨ Processo de migração concluído com sucesso!");
}

run();
