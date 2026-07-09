require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const noticiasCount = await prisma.noticia.count();
    const licitacoesCount = await prisma.licitacao.count();
    const usuariosCount = await prisma.usuario.count();
    
    console.log("--- BANCO DE DADOS LAJES ---");
    console.log("Total de Notícias:", noticiasCount);
    console.log("Total de Licitações:", licitacoesCount);
    console.log("Total de Usuários:", usuariosCount);
    
    if (noticiasCount > 0) {
      const noticias = await prisma.noticia.findMany({ take: 3 });
      console.log("Amostra de Notícias:", noticias.map(n => n.titulo));
    }
  } catch (e) {
    console.error("Erro ao conectar no banco:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
