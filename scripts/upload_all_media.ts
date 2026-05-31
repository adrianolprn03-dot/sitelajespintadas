import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

function getContentType(filePath: string) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.jpg': case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.gif': return 'image/gif';
        case '.pdf': return 'application/pdf';
        case '.webp': return 'image/webp';
        default: return 'application/octet-stream';
    }
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const prisma = new PrismaClient();

async function walkDir(dir: string): Promise<string[]> {
    let files: string[] = [];
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(await walkDir(fullPath));
        } else {
            files.push(fullPath);
        }
    }
    return files;
}

async function main() {
  const uploadsDir = path.join(__dirname, '../migracao_wp/uploads');
  if (!fs.existsSync(uploadsDir)) {
    console.error('Diretório de uploads não encontrado!');
    return;
  }

  console.log('Varrendo arquivos em', uploadsDir);
  const allFiles = await walkDir(uploadsDir);
  console.log(`Encontrados ${allFiles.length} arquivos locais.`);

  let uploadedCount = 0;
  let errorCount = 0;

  for (const localPath of allFiles) {
      const relPath = path.relative(uploadsDir, localPath).replace(/\\/g, '/');
      const r2Key = `uploads/${relPath}`;
      const publicUrl = `${process.env.R2_PUBLIC_URL}/${r2Key}`;

      const fileStream = fs.readFileSync(localPath);
      const contentType = getContentType(localPath);

      console.log(`Fazendo upload de ${r2Key}...`);
      try {
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: r2Key,
            Body: fileStream,
            ContentType: contentType,
          })
        );
        uploadedCount++;
      } catch (error) {
        console.error(`Erro ao fazer upload de ${r2Key}:`, error);
        errorCount++;
      }
  }

  console.log(`\nUpload finalizado! Sucessos: ${uploadedCount}, Erros: ${errorCount}`);

  console.log('\nSubstituindo URLs no banco de dados...');
  const noticias = await prisma.noticia.findMany();
  let updatedCount = 0;
  for (const n of noticias) {
      let changed = false;
      let newConteudo = n.conteudo;
      if (newConteudo.includes('/wp-content/uploads/')) {
          newConteudo = newConteudo.replace(/\/wp-content\/uploads\//g, `${process.env.R2_PUBLIC_URL}/uploads/`);
          changed = true;
      }
      let newImagem = n.imagem;
      if (newImagem && newImagem.startsWith('/uploads/')) {
          newImagem = `${process.env.R2_PUBLIC_URL}${newImagem}`;
          changed = true;
      }

      if (changed) {
          await prisma.noticia.update({
              where: { id: n.id },
              data: {
                  conteudo: newConteudo,
                  imagem: newImagem
              }
          });
          updatedCount++;
      }
  }
  console.log(`DB Atualizado! ${updatedCount} notícias modificadas com as novas URLs do R2.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
