const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Deletando emendas existentes (opcional)...");
    // await prisma.emendaPix.deleteMany();

    const emendas = [
        {
            ano: 2024,
            origem: "Federal",
            tipoEmenda: "Individual",
            formaRepasse: "Transferência Especial - PIX",
            numeroEmenda: "202440150001",
            autor: "Senador Styvenson Valentim",
            beneficiario: "Prefeitura Municipal de Lajes Pintadas",
            cnpjBeneficiario: "08.106.505/0001-24",
            valorPrevisto: 300000.00,
            valorRecebido: 300000.00,
            valorExecutado: 150000.00,
            objeto: "Custeio de serviços de Atenção Primária à Saúde",
            funcaoGoverno: "Saúde",
            secretariaResponsavel: "Secretaria Municipal de Saúde",
            situacao: "Em Execução",
            dataRecebimento: new Date("2024-05-15T00:00:00Z"),
        },
        {
            ano: 2023,
            origem: "Federal",
            tipoEmenda: "Individual",
            formaRepasse: "Transferência Especial - PIX",
            numeroEmenda: "202340120045",
            autor: "Deputado Benes Leocádio",
            beneficiario: "Prefeitura Municipal de Lajes Pintadas",
            cnpjBeneficiario: "08.106.505/0001-24",
            valorPrevisto: 250000.00,
            valorRecebido: 250000.00,
            valorExecutado: 250000.00,
            objeto: "Aquisição de equipamentos para Unidade Básica de Saúde",
            funcaoGoverno: "Saúde",
            secretariaResponsavel: "Secretaria Municipal de Saúde",
            situacao: "Concluído",
            dataRecebimento: new Date("2023-08-20T00:00:00Z"),
        },
        {
            ano: 2024,
            origem: "Estadual",
            tipoEmenda: "Individual",
            formaRepasse: "Transferência Especial - PIX",
            numeroEmenda: "202420050012",
            autor: "Deputado Estadual Tomba Farias",
            beneficiario: "Prefeitura Municipal de Lajes Pintadas",
            cnpjBeneficiario: "08.106.505/0001-24",
            valorPrevisto: 150000.00,
            valorRecebido: 150000.00,
            valorExecutado: 0.00,
            objeto: "Pavimentação de ruas no centro da cidade",
            funcaoGoverno: "Urbanismo",
            secretariaResponsavel: "Secretaria Municipal de Obras",
            situacao: "Recebido",
            dataRecebimento: new Date("2024-10-05T00:00:00Z"),
        }
    ];

    for (const emenda of emendas) {
        await prisma.emendaPix.create({
            data: emenda
        });
    }

    console.log("Emendas PIX inseridas com sucesso!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
