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

  console.log(`Total de notícias para importar: ${noticias.length}`);

  let sucesso = 0;
  let falha = 0;

  for (const item of noticias) {
    if (item.tipo !== 'post') {
      continue;
    }
    try {
      // Limpeza simples do conteúdo HTML (pode ser melhorada se necessário)
      let conteudo = item.conteudo || '';
      conteudo = conteudo.replace(/<!-- \/?wp:[^>]+ -->/g, ''); // Remove comentários do Gutenberg
      conteudo = conteudo.replace(/\\n/g, '\n');
      
      const titulo = item.titulo || 'Sem título';
      const slug = item.slug || titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const dataStr = item.data;
      
      let dataPublicacao = new Date();
      if (dataStr && dataStr !== '0000-00-00 00:00:00') {
        dataPublicacao = new Date(dataStr.replace(' ', 'T') + 'Z');
      }

      await prisma.noticia.upsert({
        where: { slug: slug },
        update: {
          titulo: titulo,
          conteudo: conteudo,
          resumo: item.resumo || '',
          publicadoEm: dataPublicacao,
          publicada: true,
          destaque: false,
        },
        create: {
          titulo: titulo,
          slug: slug,
          conteudo: conteudo,
          resumo: item.resumo || '',
          publicadoEm: dataPublicacao,
          publicada: true,
          destaque: false,
        }
      });
      sucesso++;
      if (sucesso % 50 === 0) {
        console.log(`${sucesso} notícias importadas...`);
      }
    } catch (e) {
      console.error(`Erro ao importar a notícia ${item.slug}:`, e.message);
      falha++;
    }
  }

  console.log(`Importação finalizada! Sucessos: ${sucesso}, Falhas: ${falha}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
