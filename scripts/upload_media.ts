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

async function main() {
  const jsonPath = path.join(__dirname, '../migracao_wp/noticias_extraidas.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('Arquivo noticias_extraidas.json não encontrado!');
    return;
  }

  const posts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Lidos ${posts.length} posts.`);

  let successCount = 0;
  let missingCount = 0;
  
  for (const post of posts) {
    if (!post.imagem_path) continue;
    
    // imagem_path geralmente é algo como "2023/04/arquivo.jpg"
    const localImagePath = path.join(__dirname, '../migracao_wp/uploads', post.imagem_path.replace(/\//g, path.sep));
    
    if (fs.existsSync(localImagePath)) {
      const fileStream = fs.readFileSync(localImagePath);
      const fileName = path.basename(localImagePath);
      const contentType = getContentType(localImagePath);
      
      const r2Key = `uploads/${post.imagem_path}`;
      const publicUrl = `${process.env.R2_PUBLIC_URL}/${r2Key}`;

      console.log(`Fazendo upload de ${localImagePath} para ${r2Key}...`);
      
      try {
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: r2Key,
            Body: fileStream,
            ContentType: contentType,
          })
        );
        
        // Atualizar no DB
        const existing = await prisma.noticia.findFirst({
            where: { slug: post.slug }
        });
        
        if (existing) {
            await prisma.noticia.update({
                where: { id: existing.id },
                data: { imagem: publicUrl }
            });
            console.log(`✓ Atualizado DB para ${post.slug} com URL: ${publicUrl}`);
            successCount++;
        }
      } catch (error) {
        console.error(`X Erro ao fazer upload de ${r2Key}:`, error);
      }
    } else {
      console.warn(`! Arquivo local não encontrado para post ${post.id}: ${localImagePath}`);
      missingCount++;
    }
  }

  console.log(`\nFinalizado! Sucesso: ${successCount}. Faltantes localmente: ${missingCount}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
