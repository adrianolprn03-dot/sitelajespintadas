import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Iniciando limpeza da tabela de legislação...');
  
  const count = await prisma.legislacao.deleteMany({});
  
  console.log(`✅ Sucesso! Foram removidos ${count.count} registros.`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao limpar legislação:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
