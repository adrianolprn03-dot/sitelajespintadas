import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(process.cwd(), 'migracao_wp', 'noticias_extraidas.json');
  console.log(`Lendo arquivo JSON: ${jsonPath}`);
  
  if (!fs.existsSync(jsonPath)) {
    console.error("Arquivo JSON não encontrado!");
    return;
  }

  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const noticias = JSON.parse(rawData);

  console.log(`Total de notícias no JSON: ${noticias.length}`);

  let sucesso = 0;
  let falha = 0;

  for (const item of noticias) {
    if (item.tipo !== 'post' || !item.imagem_path) {
      continue;
    }
    try {
      const titulo = item.titulo || 'Sem título';
      const slug = item.slug || titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const imageUrl = `${process.env.R2_PUBLIC_URL}/uploads/${item.imagem_path}`;

      await prisma.noticia.update({
        where: { slug: slug },
        data: {
          imagem: imageUrl,
        }
      });
      sucesso++;
    } catch (e) {
      // Ignora erro se a notícia não existir
      falha++;
    }
  }

  console.log(`Atualização finalizada! Sucessos: ${sucesso}, Falhas (ou não encontradas): ${falha}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
