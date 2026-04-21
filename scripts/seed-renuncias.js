const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Semeando Renúncias Fiscais...');

  const renuncias = [
    {
      descricao: "Isenção de IPTU – Imóveis de entidades beneficentes",
      categoria: "Isenção Tributária",
      baseLegal: "Lei 312/2018",
      valorEstimado: 48500.00,
      beneficiarios: "23 entidades",
      vigencia: "Anual",
      ano: 2024
    },
    {
      descricao: "Isenção de ISS – Profissionais autônomos de baixa renda",
      categoria: "Isenção Tributária",
      baseLegal: "LC 28/2017",
      valorEstimado: 22800.00,
      beneficiarios: "45 profissionais",
      vigencia: "Anual",
      ano: 2024
    },
    {
      descricao: "Redução de ISS – Microempreendedores Individuais (MEI)",
      categoria: "Redução de Alíquota",
      baseLegal: "LC Municipal 28/2017",
      valorEstimado: 31200.00,
      beneficiarios: "87 MEIs",
      vigencia: "Permanente",
      ano: 2024
    },
    {
      descricao: "Anistia de multas e juros – REFIS Municipal 2023",
      categoria: "Anistia",
      baseLegal: "Lei 389/2023",
      valorEstimado: 76400.00,
      beneficiarios: "134 contribuintes",
      vigencia: "Exercício 2023",
      ano: 2024
    }
  ];

  await prisma.renunciaFiscal.deleteMany();
  for (const r of renuncias) {
    await prisma.renunciaFiscal.create({ data: r });
  }

  console.log('✅ Renúncias Fiscais semeadas.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
