const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const readline = require('readline');
const prisma = new PrismaClient();

function parseCurrency(val) {
  if (!val) return 0;
  let cleaned = val.toString().replace(/"/g, '').replace('R$', '').trim().replace(/\./g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function parseQuantidade(val) {
  if (!val) return 1;
  let s = val.toString().replace(/"/g, '').trim();
  if (s === '0/5') return 0.5;
  if (s === '1/5') return 1.5;
  if (s === '2/5') return 2.5;
  if (s === 'O1' || s === '01') return 1; 
  if (s === 'O2' || s === '02') return 2;
  const num = parseFloat(s.replace(',', '.'));
  return isNaN(num) ? 1 : num;
}

function parseDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') return new Date();
  const s = dateStr.replace(/"/g, '').trim();
  const parts = s.split('/');
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00Z`);
  }
  return new Date();
}

async function main() {
  const filePath = 'C:\\Users\\User\\Downloads\\6-Diarias-2026-04-21.csv';
  console.log('Lendo arquivo CSV:', filePath);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  let lines = content.split('\n');

  await prisma.diaria.deleteMany();
  console.log('Tabela vazia');

  let count = 0;
  for (let i = 1; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    // Simple custom split taking quotes into account
    let inQuotes = false;
    let values = [];
    let currentVal = '';
    
    for (let char of line) {
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(currentVal);
            currentVal = '';
        } else {
            currentVal += char;
        }
    }
    values.push(currentVal);

    if (values.length < 9) continue;

    const dataInicio = parseDate(values[0]);
    const dataFim = parseDate(values[1]);
    const cargo = values[2] || '';
    const nome = values[3] || '';
    const motivo = values[4] || '';
    const destino = values[5] || '';
    const qtd = parseQuantidade(values[6]);
    const vu = parseCurrency(values[7]);
    const vt = parseCurrency(values[8]);

    try {
      await prisma.diaria.create({
        data: {
          servidor: nome || 'Não informado',
          cargo: cargo || 'Não informado',
          motivo: motivo || 'Não informado',
          destino: destino || 'Não informado',
          dataInicio,
          dataFim,
          valorUnitario: vu,
          quantidadeDias: qtd,
          valor: vt,
          secretaria: 'Geral', // Or derived from cargo if possible
          mes: dataInicio.getMonth() + 1,
          ano: dataInicio.getFullYear(),
        }
      });
      count++;
    } catch (e) {
      console.error('Erro na linha', i, e.message);
    }
  }

  console.log(`Importação concluída. ${count} diárias cadastradas.`);
}

main().finally(() => prisma.$disconnect());
