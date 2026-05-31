const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { PrismaClient } = require('@prisma/client');
const AdmZip = require('adm-zip');
const path = require('path');
const crypto = require('crypto');

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
    const zipPath = path.join(__dirname, '../wordpress/uploud.zip');
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();
    
    let pdfEntries = zipEntries.filter((entry) => entry.entryName.toLowerCase().endsWith('.pdf'));
    console.log(`Encontrados ${pdfEntries.length} arquivos PDF no zip.`);

    let uploadedCount = 0;
    let errorCount = 0;

    for (const entry of pdfEntries) {
        let name = entry.entryName;
        // Fix encoding: AdmZip extracts strings usually as utf-8 or cp437. 
        // We'll replace spaces and non-ascii characters to be safe for URLs.
        name = name.replace(/[^\w\d\.\-\/]/g, '_');
        const r2Key = `uploads/${name}`;
        
        try {
            const fileData = entry.getData(); // in memory
            await s3Client.send(
                new PutObjectCommand({
                    Bucket: process.env.R2_BUCKET_NAME,
                    Key: r2Key,
                    Body: fileData,
                    ContentType: 'application/pdf',
                })
            );
            uploadedCount++;
            if (uploadedCount % 10 === 0) {
                console.log(`Progresso: ${uploadedCount} PDFs enviados.`);
            }
        } catch (error) {
            console.error(`Erro ao fazer upload de ${r2Key}:`, error);
            errorCount++;
        }
    }
    
    console.log(`\nUpload finalizado! Sucessos: ${uploadedCount}, Erros: ${errorCount}`);

    console.log('\nSubstituindo URLs de PDF no banco de dados (Noticias)...');
    const noticias = await prisma.noticia.findMany();
    let updatedCount = 0;
    for (const n of noticias) {
        let changed = false;
        let newConteudo = n.conteudo;
        if (newConteudo && newConteudo.includes('/wp-content/uploads/') && newConteudo.includes('.pdf')) {
            newConteudo = newConteudo.replace(/https?:\/\/[^\/]+\/wp-content\/uploads\/[^\s"'<>]+.pdf/ig, (match) => {
                const relative = match.split('/wp-content/uploads/')[1];
                const fixed = relative.replace(/[^\w\d\.\-\/]/g, '_');
                return `${process.env.R2_PUBLIC_URL}/uploads/${fixed}`;
            });
            if (newConteudo !== n.conteudo) changed = true;
        }

        if (changed) {
            await prisma.noticia.update({
                where: { id: n.id },
                data: {
                    conteudo: newConteudo,
                }
            });
            updatedCount++;
        }
    }
    console.log(`DB Atualizado! ${updatedCount} notícias modificadas com as novas URLs de PDF no R2.`);
    
    console.log('\nSubstituindo URLs de PDF na tabela Legislacao...');
    const leg = await prisma.legislacao.findMany();
    let legCount = 0;
    for (const l of leg) {
        let changed = false;
        let newArquivo = l.arquivo;
        let newDocUrl = l.documentUrl;
        
        if (newArquivo && newArquivo.includes('.pdf') && !newArquivo.includes(process.env.R2_PUBLIC_URL || '')) {
            if (newArquivo.includes('/wp-content/uploads/')) {
                const relative = newArquivo.split('/wp-content/uploads/')[1];
                const fixed = relative.replace(/[^\w\d\.\-\/]/g, '_');
                newArquivo = `${process.env.R2_PUBLIC_URL}/uploads/${fixed}`;
                changed = true;
            }
        }
        
        if (newDocUrl && newDocUrl.includes('.pdf') && !newDocUrl.includes(process.env.R2_PUBLIC_URL || '')) {
            if (newDocUrl.includes('/wp-content/uploads/')) {
                const relative = newDocUrl.split('/wp-content/uploads/')[1];
                const fixed = relative.replace(/[^\w\d\.\-\/]/g, '_');
                newDocUrl = `${process.env.R2_PUBLIC_URL}/uploads/${fixed}`;
                changed = true;
            }
        }
        
        if (changed) {
            await prisma.legislacao.update({
                where: { id: l.id },
                data: {
                    arquivo: newArquivo,
                    documentUrl: newDocUrl
                }
            });
            legCount++;
        }
    }
    console.log(`DB Atualizado! ${legCount} legislacoes modificadas.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
