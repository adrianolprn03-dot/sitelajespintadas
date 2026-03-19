import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const noticias = await prisma.noticia.findMany({
    include: { secretaria: true }
  })
  
  console.log('--- Detailed Noticias Check ---')
  noticias.forEach((n, i) => {
    console.log(`\nNoticia ${i + 1}:`)
    console.log(`ID: ${n.id}`)
    console.log(`Titulo: ${n.titulo}`)
    console.log(`Slug: ${n.slug}`)
    console.log(`Publicada: ${n.publicada}`)
    console.log(`PublicadoEm: ${n.publicadoEm}`)
    console.log(`Resumo: ${n.resumo ? 'Yes' : 'MISSING'}`)
    console.log(`Conteudo: ${n.conteudo ? 'Yes' : 'MISSING'}`)
    console.log(`Secretaria: ${n.secretaria ? n.secretaria.nome : 'NONE'}`)
  })
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
