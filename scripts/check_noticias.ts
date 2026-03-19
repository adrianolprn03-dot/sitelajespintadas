import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const count = await prisma.noticia.count()
  console.log(`Total noticias: ${count}`)
  const noticias = await prisma.noticia.findMany({
    take: 5,
    include: { secretaria: true }
  })
  console.log('Sample noticias:', JSON.stringify(noticias, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
