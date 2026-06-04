import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Corrigir modalidades em minúsculas restantes
  const fixes: Record<string, string> = {
    'pregao': 'Pregão Eletrônico',
    'concorrencia': 'Concorrência Eletrônica',
  };

  for (const [old, novo] of Object.entries(fixes)) {
    const result = await prisma.licitacao.updateMany({
      where: { modalidade: old },
      data: { modalidade: novo }
    });
    console.log(`"${old}" → "${novo}": ${result.count} registros`);
  }

  // Status final
  const byMod = await prisma.licitacao.groupBy({
    by: ['modalidade'],
    _count: true,
    orderBy: { _count: { modalidade: 'desc' } }
  });
  
  const total = await prisma.licitacao.count();
  console.log(`\nTotal: ${total} licitações`);
  console.log('Modalidades finais:');
  byMod.forEach(m => console.log(`  ${m.modalidade}: ${m._count}`));

  await prisma.$disconnect();
}

main().catch(console.error);
