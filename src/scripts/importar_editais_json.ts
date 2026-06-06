import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Normaliza modalidades para formato padrão
function normalizarModalidade(mod: string): string {
  const m = mod.trim().toUpperCase();
  
  if (m.includes('PREGÃO') && m.includes('SEGUNDA CHAMADA')) return 'Pregão Eletrônico - 2ª Chamada';
  if (m.includes('PREGÃO')) return 'Pregão Eletrônico';
  if (m.includes('CONCORRÊNCIA')) return 'Concorrência Eletrônica';
  if (m.includes('CHAMADA PÚBLICA') && m.includes('2ª')) return 'Chamada Pública - 2ª Chamada';
  if (m.includes('CHAMADA PÚBLICA') || m.includes('AGRICULTURA FAMILIAR')) return 'Chamada Pública';
  if (m.includes('CHAMAMENTO')) return 'Chamamento Público';
  if (m.includes('CREDENCIAMENTO') && m.includes('CHAMAMENTO')) return 'Credenciamento - Chamamento Público';
  if (m.includes('CREDENCIAMENTO')) return 'Credenciamento';
  if (m.includes('RDC')) return 'RDC Eletrônico';
  if (m.includes('DISPENSA') && m.includes('FRACASSADO')) return 'Dispensa de Licitação - Item Fracassado';
  if (m.includes('DISPENSA') && m.includes('DESERTO')) return 'Dispensa de Licitação - Item Deserto';
  if (m.includes('2°') && m.includes('DISPENSA')) return 'Dispensa de Licitação - 2ª Chamada';
  if (m.includes('DISPENSA')) return 'Dispensa de Licitação';
  if (m.includes('EDITAL')) return 'Edital';
  
  return mod.trim(); // retorna como estava se não casou
}

// Extrai data de uma string como "04 de maio de 2026."
function parseDataBrasileira(texto: string): Date | null {
  if (!texto || texto.trim() === '') return null;
  
  const meses: Record<string, number> = {
    'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
    'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
    'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
  };
  
  const match = texto.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/);
  if (match) {
    const dia = parseInt(match[1]);
    const mes = meses[match[2].toLowerCase()];
    const ano = parseInt(match[3]);
    if (mes !== undefined) {
      return new Date(ano, mes, dia);
    }
  }
  return null;
}

async function main() {
  const jsonPath = path.resolve(__dirname, '../../editais_data_0.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error('Arquivo editais_data_0.json não encontrado!');
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const rows: any[][] = data.rows;
  
  console.log(`Total de linhas no JSON: ${rows.length}`);
  
  // headers: Licitação, Modalidade, Objeto, Início das Propostas, 
  //          Recebimento das Propostas, Abertura das Propostas, Edital
  
  const registros: any[] = [];
  let ignorados = 0;
  
  for (const row of rows) {
    const licitacaoRef = (row[0] || '').toString().trim();
    const modalidade = (row[1] || '').toString().trim();
    const objeto = (row[2] || '').toString().trim();
    const inicioPropostas = (row[3] || '').toString().trim();
    const aberturaPropostas = (row[5] || '').toString().trim();
    const editalInfo = row[6];
    
    // Ignorar linhas vazias
    if (!licitacaoRef || !modalidade || !objeto) {
      ignorados++;
      continue;
    }
    
    // Extrair número e ano da referência (ex: "08/2026")
    const refMatch = licitacaoRef.match(/(\d+)\/(\d{4})/);
    if (!refMatch) {
      console.log(`  Ignorando ref inválida: "${licitacaoRef}"`);
      ignorados++;
      continue;
    }
    
    const numero = refMatch[1].padStart(2, '0');
    const ano = parseInt(refMatch[2]);
    const modalidadeNorm = normalizarModalidade(modalidade);
    
    // Extrair URL do edital
    let editalUrl: string | null = null;
    if (typeof editalInfo === 'object' && editalInfo?.href) {
      editalUrl = editalInfo.href;
    } else if (typeof editalInfo === 'string' && editalInfo.startsWith('http')) {
      editalUrl = editalInfo;
    }
    
    // Extrair data de abertura
    const dataAbertura = parseDataBrasileira(inicioPropostas);
    
    registros.push({
      numero: `${numero}/${ano}`,
      ano,
      modalidade: modalidadeNorm,
      objeto,
      status: 'concluida',
      secretaria: 'Administração',
      editalUrl,
      dataAbertura,
      dataPublicacaoEdital: dataAbertura,
      documentos: editalUrl ? JSON.stringify([{ nome: 'Edital', url: editalUrl }]) : '[]',
    });
  }
  
  console.log(`Registros válidos para importar: ${registros.length}`);
  console.log(`Linhas ignoradas (vazias): ${ignorados}`);
  
  // Importar usando createMany com skipDuplicates
  // Primeiro verificar quais já existem
  let novos = 0;
  let existentes = 0;
  let atualizados = 0;
  
  for (const reg of registros) {
    // Buscar por número + ano + modalidade similar
    const existente = await prisma.licitacao.findFirst({
      where: {
        ano: reg.ano,
        OR: [
          { numero: reg.numero },
          { numero: reg.numero.replace(/^0+/, '') }, // sem zero à esquerda
        ]
      }
    });
    
    if (existente) {
      // Atualizar documentos se estava vazio e agora temos
      if (existente.documentos === '[]' && reg.documentos !== '[]') {
        await prisma.licitacao.update({
          where: { id: existente.id },
          data: { 
            documentos: reg.documentos,
          }
        });
        atualizados++;
      } else {
        existentes++;
      }
    } else {
      // Criar novo registro
      const { editalUrl, dataPublicacaoEdital, ...prismaData } = reg;
      await prisma.licitacao.create({ data: prismaData });
      novos++;
    }
  }
  
  console.log(`\n=== RESULTADO DA IMPORTAÇÃO ===`);
  console.log(`Novos registros criados: ${novos}`);
  console.log(`Registros já existentes: ${existentes}`);
  console.log(`Registros atualizados (editalUrl): ${atualizados}`);
  
  // Agora normalizar TODAS as modalidades existentes no banco
  console.log(`\n--- Normalizando modalidades ---`);
  const todasLicitacoes = await prisma.licitacao.findMany({
    select: { id: true, modalidade: true }
  });
  
  let normalizadas = 0;
  for (const lic of todasLicitacoes) {
    const normalizada = normalizarModalidade(lic.modalidade);
    if (normalizada !== lic.modalidade) {
      await prisma.licitacao.update({
        where: { id: lic.id },
        data: { modalidade: normalizada }
      });
      normalizadas++;
    }
  }
  console.log(`Modalidades normalizadas: ${normalizadas}`);
  
  // Estatísticas finais
  const totalFinal = await prisma.licitacao.count();
  const byMod = await prisma.licitacao.groupBy({
    by: ['modalidade'],
    _count: true,
    orderBy: { _count: { modalidade: 'desc' } }
  });
  
  console.log(`\n=== ESTADO FINAL ===`);
  console.log(`Total de licitações: ${totalFinal}`);
  console.log(`Modalidades:`);
  byMod.forEach(m => console.log(`  ${m.modalidade}: ${m._count}`));
  
  await prisma.$disconnect();
}

main().catch(console.error);
