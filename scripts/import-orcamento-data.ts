import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const data = [
  // LDO
  { tipo: "LDO", ano: 2024, ementa: "LDO 2024 - Lei de Diretrizes Orçamentárias", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2201" },
  { tipo: "LDO", ano: 2023, ementa: "LDO 2023 - Lei de Diretrizes Orçamentárias", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2200" },
  { tipo: "LDO", ano: 2022, ementa: "LDO 2022 - Lei de Diretrizes Orçamentárias", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2199" },
  { tipo: "LDO", ano: 2021, ementa: "LDO 2021 - Lei de Diretrizes Orçamentárias", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2198" },
  { tipo: "LDO", ano: 2020, ementa: "LDO 2020 - Lei de Diretrizes Orçamentárias", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2197" },
  { tipo: "LDO", ano: 2019, ementa: "LDO 2019 (Vol 1) - Lei de Diretrizes Orçamentárias", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2195" },
  { tipo: "LDO", ano: 2019, ementa: "LDO 2019 (Vol 2) - Lei de Diretrizes Orçamentárias", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2196" },
  { tipo: "LDO", ano: 2018, ementa: "LDO 2018 - Lei de Diretrizes Orçamentárias", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2194" },
  { tipo: "LDO", ano: 2017, ementa: "LDO 2017 - Lei de Diretrizes Orçamentárias", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2193" },
  
  // LOA
  { tipo: "LOA", ano: 2024, ementa: "LOA 2024 - Lei Orçamentária Anual", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2209" },
  { tipo: "LOA", ano: 2023, ementa: "LOA 2023 - Lei Orçamentária Anual", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2208" },
  { tipo: "LOA", ano: 2022, ementa: "LOA 2022 - Lei Orçamentária Anual", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2207" },
  { tipo: "LOA", ano: 2021, ementa: "LOA 2021 - Lei Orçamentária Anual", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2206" },
  { tipo: "LOA", ano: 2020, ementa: "LOA 2020 - Lei Orçamentária Anual", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2205" },
  { tipo: "LOA", ano: 2019, ementa: "LOA 2019 - Lei Orçamentária Anual", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2202" },
  { tipo: "LOA", ano: 2018, ementa: "LOA 2018 - Lei Orçamentária Anual", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2204" },
  { tipo: "LOA", ano: 2017, ementa: "LOA 2017 - Lei Orçamentária Anual", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2203" },
  
  // PPA
  { tipo: "PPA", ano: 2018, ementa: "PPA 2018-2021 - Plano Plurianual", arquivo: "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=2210" },
];

async function main() {
  console.log("Iniciando importação de dados orçamentários...");
  
  for (const item of data) {
    const exists = await prisma.legislacao.findFirst({
      where: {
        tipo: item.tipo,
        ano: item.ano,
        ementa: item.ementa
      }
    });

    if (!exists) {
      await prisma.legislacao.create({
        data: {
          tipo: item.tipo,
          ano: item.ano,
          ementa: item.ementa,
          arquivo: item.arquivo,
          numero: "S/N", // Orçamento geralmente não tem número de lei no legacy
          categoria: "Lei",
          ativo: true
        }
      });
      console.log(`✅ Criado: ${item.ementa}`);
    } else {
      console.log(`⏩ Pulado (já existe): ${item.ementa}`);
    }
  }

  console.log("Importação concluída!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
