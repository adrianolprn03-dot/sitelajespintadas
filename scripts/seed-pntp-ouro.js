const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando Ingestão de Dados PNTP Ouro 2025...');

  // 1. Veículos (Frota)
  const veiculos = [
    { modelo: 'VOLKSWAGEN AMAROK 4X4', placa: 'QGZ-1D23', ano: '2022', secretaria: 'Gabinete do Prefeito', tipo: 'Caminhonete', status: 'em-uso' },
    { modelo: 'MERCEDES BENZ ACCELO 1016', placa: 'PNE-4567', ano: '2021', secretaria: 'Obras e Infraestrutura', tipo: 'Caminhão Coletor', status: 'em-uso' },
    { modelo: 'FIAT DUCATO AMBULÂNCIA', placa: 'RND-8J90', ano: '2023', secretaria: 'Saúde', tipo: 'Ambulância UTI', status: 'em-uso' },
    { modelo: 'RENAULT KWID', placa: 'OLK-2233', ano: '2020', secretaria: 'Assistência Social', tipo: 'Veículo Leve', status: 'manutencao' },
    { modelo: 'RETROESCAVADEIRA JCB 3CX', placa: 'MAQ-001', ano: '2019', secretaria: 'Obras e Infraestrutura', tipo: 'Máquina Pesada', status: 'em-uso' },
    { modelo: 'ÔNIBUS ESCOLAR IVECO', placa: 'ESC-9988', ano: '2022', secretaria: 'Educação', tipo: 'Transporte Escolar', status: 'em-uso' },
  ];

  for (const v of veiculos) {
    await prisma.veiculo.upsert({
      where: { placa: v.placa },
      update: v,
      create: v,
    });
  }
  console.log('✅ Frota Municipal atualizada.');

  // 2. Medicamentos (REMUME)
  const medicamentos = [
    { nome: 'AMOXICILINA 500MG', categoria: 'Antibiótico', status: 'disponivel', observacao: 'Dispensação sob prescrição médica.' },
    { nome: 'DIPIRONA SÓDICA 500MG', categoria: 'Analgésico', status: 'disponivel', observacao: 'Uso adulto e pediátrico.' },
    { nome: 'LOSARTANA POTÁSSICA 50MG', categoria: 'Anti-hipertensivo', status: 'disponivel', observacao: 'Programa Hiperdia.' },
    { nome: 'PARACETAMOL 500MG', categoria: 'Analgésico/Antitérmico', status: 'estoque-baixo', observacao: 'Limite de 2 cartelas por paciente.' },
    { nome: 'INSULINA NPH 100UI/ML', categoria: 'Diabetes', status: 'disponivel', observacao: 'Manter sob refrigeração.' },
    { nome: 'IBUPROFENO 600MG', categoria: 'Anti-inflamatório', status: 'em-falta', observacao: 'Aguardando entrega do fornecedor (Previsão: 5 dias).' },
  ];

  await prisma.medicamento.deleteMany(); // Reset para a auditoria
  for (const m of medicamentos) {
    await prisma.medicamento.create({ data: m });
  }
  console.log('✅ Lista de Medicamentos (REMUME) atualizada.');

  // 3. Obras Públicas
  const obras = [
    {
      titulo: 'REFORMA E AMPLIAÇÃO DA UBS CENTRO',
      descricao: 'Modernização das instalações, acessibilidade completa e novos consultórios odontológicos.',
      local: 'Rua Principal, S/N - Centro',
      valor: 450000.00,
      status: 'em-andamento',
      dataInicio: new Date('2024-01-15'),
      previsaoTermino: new Date('2024-12-20'),
      empresa: 'CONSTRUTORA NORDESTE LTDA',
      percentual: 75,
    },
    {
      titulo: 'PAVIMENTAÇÃO ASFÁLTICA - BAIRRO NOVO',
      descricao: 'Asfaltamento de 10 ruas com drenagem pluvial e sinalização vertical/horizontal.',
      local: 'Bairro Novo Horizonte',
      valor: 1200000.00,
      status: 'em-andamento',
      dataInicio: new Date('2024-03-10'),
      previsaoTermino: new Date('2025-02-28'),
      empresa: 'SINALIZA RN EIRELI',
      percentual: 30,
    },
  ];

  await prisma.obra.deleteMany();
  for (const o of obras) {
    await prisma.obra.create({ data: o });
  }
  console.log('✅ Obras Públicas atualizadas.');

  // 4. Receitas 2025 (Exemplo de Arrecadação)
  const receitas = [
    { descricao: 'COTA-PARTE DO FPM', categoria: 'Transferências da União', valor: 850000.45, mes: 1, ano: 2025 },
    { descricao: 'COTA-PARTE DO ICMS', categoria: 'Transferências do Estado', valor: 320000.12, mes: 1, ano: 2025 },
    { descricao: 'IPTU - ARRECADAÇÃO CORRENTE', categoria: 'Impostos Próprios', valor: 45000.00, mes: 1, ano: 2025 },
    { descricao: 'ISS - IMPOSTO SOBRE SERVIÇOS', categoria: 'Impostos Próprios', valor: 28000.30, mes: 1, ano: 2025 },
    { descricao: 'COTA-PARTE DO FPM', categoria: 'Transferências da União', valor: 910000.00, mes: 2, ano: 2025 },
  ];

  await prisma.receita.deleteMany({ where: { ano: 2025 } });
  for (const r of receitas) {
    await prisma.receita.create({ data: r });
  }
  console.log('✅ Receitas 2025 atualizadas.');

  // 5. Despesas 2025 (Execução Financeira)
  const despesas = [
    { descricao: 'MANUTENÇÃO DA FOLHA DE PAGAMENTO - EDUCAÇÃO', categoria: 'Pessoal', secretaria: 'Educação', fornecedor: 'Servidores Municipais', valor: 420000.00, mes: 1, ano: 2025 },
    { descricao: 'AQUISIÇÃO DE MEDICAMENTOS PARA FARMÁCIA BÁSICA', categoria: 'Custeio', secretaria: 'Saúde', fornecedor: 'MEDFARMA DISTRIBUIDORA', valor: 56000.45, mes: 1, ano: 2025 },
    { descricao: 'LOCAÇÃO DE SOFTWARE DE GESTÃO PÚBLICA', categoria: 'Serviços', secretaria: 'Administração', fornecedor: 'TECHGOV SISTEMAS', valor: 12500.00, mes: 1, ano: 2025 },
  ];

  await prisma.despesa.deleteMany({ where: { ano: 2025 } });
  for (const d of despesas) {
    await prisma.despesa.create({ data: d });
  }
  console.log('✅ Despesas 2025 atualizadas.');

  console.log('✨ Portal da Transparência plenamente populado para auditoria PNTP 2025!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
