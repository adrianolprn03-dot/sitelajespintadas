const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, '../migracao_wp/legislacao_extraida.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(rawData);

  console.log(`Encontrados ${data.length} registros de legislação.`);

  for (const item of data) {
    let ano = new Date(item.data).getFullYear();
    let numero = item.titulo;
    
    // Attempt to extract number and year from title or meta
    if (item.meta && item.meta.numero) {
        numero = item.meta.numero;
    }

    let arquivoUrl = null;
    if (item.arquivos && item.arquivos.length > 0) {
        // Find a PDF in the files if any
        const pdf = item.arquivos.find((a) => a.url && a.url.endsWith('.pdf'));
        if (pdf) arquivoUrl = pdf.url;
    }
    
    if (!arquivoUrl && item.conteudo) {
        // regex to find a href with .pdf
        const match = item.conteudo.match(/href=["'](https?:\/\/[^"']+\.pdf)["']/i);
        if (match) {
            arquivoUrl = match[1];
        }
    }
    
    // rewrite WP URL to R2 URL
    if (arquivoUrl && arquivoUrl.includes('lajespintadas.rn.gov.br/wp-content/uploads/')) {
        arquivoUrl = arquivoUrl.replace('https://lajespintadas.rn.gov.br/wp-content/uploads/', 'https://pub-ebdbbd4dd247496ab593dd85361309f9.r2.dev/uploads/');
    }

    try {
        await prisma.legislacao.create({
            data: {
                tipo: item.tipo,
                numero: numero.substring(0, 50),
                ano: isNaN(ano) ? new Date().getFullYear() : ano,
                ementa: (item.meta?.descricao || item.titulo || '').substring(0, 500),
                arquivo: arquivoUrl,
                documentUrl: arquivoUrl,
                ativo: true,
                criadoEm: new Date(item.data),
            }
        });
        console.log(`Inserido: ${item.titulo}`);
    } catch (e) {
        console.error(`Erro ao inserir ${item.titulo}: ${e.message}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
