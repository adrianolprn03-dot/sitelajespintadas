import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const emendas = [
    {
      anoEmenda: 2024,
      autorNome: "Transferência Especial - Governo Federal (PIX)",
      codigoEmenda: "EMPIX-2024-001",
      objeto: "Ações de custeio na Saúde e Assistência Social.",
      valorPrevisto: 450000.00,
      valorPago: 450000.00,
      tipoEmenda: "Transferência Especial",
      localidade: "Lajes Pintadas - RN",
      situacaoExecucao: "PAGO"
    },
    {
      anoEmenda: 2024,
      autorNome: "Emenda Individual - Deputado Federal (PIX)",
      codigoEmenda: "EMPIX-2024-002",
      objeto: "Pavimentação asfáltica de vias urbanas.",
      valorPrevisto: 300000.00,
      valorPago: 0,
      tipoEmenda: "Transferência Especial",
      localidade: "Lajes Pintadas - RN",
      situacaoExecucao: "EM PROCESSAMENTO"
    }
  ]

  for (const e of emendas) {
    await prisma.emendaParlamentar.upsert({
      where: { codigoEmenda: e.codigoEmenda },
      update: e,
      create: e
    })
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
