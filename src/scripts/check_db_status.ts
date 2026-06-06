import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const totalLicitacoes = await prisma.licitacao.count();
  const totalContratos = await prisma.contrato.count();
  const totalLegislacao = await prisma.legislacao.count();
  const totalNoticias = await prisma.noticia.count();
  const totalSecretarias = await prisma.secretaria.count();
  
  console.log('=== STATUS DO BANCO DE DADOS ===');
  console.log(`Licitações: ${totalLicitacoes}`);
  console.log(`Contratos: ${totalContratos}`);
  console.log(`Legislação: ${totalLegislacao}`);
  console.log(`Notícias: ${totalNoticias}`);
  console.log(`Secretarias: ${totalSecretarias}`);
  
  // Licitações por modalidade
  const byModalidade = await prisma.licitacao.groupBy({
    by: ['modalidade'],
    _count: true,
    orderBy: { _count: { modalidade: 'desc' } }
  });
  console.log('\n--- Licitações por Modalidade ---');
  byModalidade.forEach(m => console.log(`  ${m.modalidade}: ${m._count}`));
  
  // Licitações por ano
  const byAno = await prisma.licitacao.groupBy({
    by: ['ano'],
    _count: true,
    orderBy: { ano: 'desc' }
  });
  console.log('\n--- Licitações por Ano ---');
  byAno.forEach(a => console.log(`  ${a.ano}: ${a._count}`));
  
  // Verificar licitações com documentos preenchidos
  const comDocumentos = await prisma.licitacao.count({
    where: { NOT: { documentos: '[]' } }
  });
  console.log(`\nLicitações com documentos: ${comDocumentos}`);
  
  // Verificar registros com "Não informado"
  const naoInformado = await prisma.licitacao.count({
    where: { objeto: 'Não informado' }
  });
  console.log(`Licitações com objeto "Não informado": ${naoInformado}`);
  
  await prisma.$disconnect();
}

main().catch(console.error);
