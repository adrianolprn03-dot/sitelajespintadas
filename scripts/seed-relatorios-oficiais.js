const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("Iniciando alimentação de relatórios fiscais oficiais...");

    const relatorios = [
        // RREO 2024
        {
            titulo: "RREO - 1º Bimestre - Exercício 2024",
            tipo: "RREO",
            periodo: "1º Bimestre",
            ano: 2024,
            arquivo: "https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/arquivos/relatorio-resumido-da-execucao-orcamentaria-rreo",
        },
        // RREO 2023
        {
            titulo: "RREO - 6º Bimestre - Exercício 2023",
            tipo: "RREO",
            periodo: "6º Bimestre",
            ano: 2023,
            arquivo: "https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/arquivos/relatorio-resumido-da-execucao-orcamentaria-rreo",
        },
        {
            titulo: "RREO - 5º Bimestre - Exercício 2023",
            tipo: "RREO",
            periodo: "5º Bimestre",
            ano: 2023,
            arquivo: "https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/arquivos/relatorio-resumido-da-execucao-orcamentaria-rreo",
        },
        {
            titulo: "RREO - 4º Bimestre - Exercício 2023",
            tipo: "RREO",
            periodo: "4º Bimestre",
            ano: 2023,
            arquivo: "https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/arquivos/relatorio-resumido-da-execucao-orcamentaria-rreo",
        },
        {
            titulo: "RREO - 3º Bimestre - Exercício 2023",
            tipo: "RREO",
            periodo: "3º Bimestre",
            ano: 2023,
            arquivo: "https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/arquivos/relatorio-resumido-da-execucao-orcamentaria-rreo",
        },
        {
            titulo: "RREO - 2º Bimestre - Exercício 2023",
            tipo: "RREO",
            periodo: "2º Bimestre",
            ano: 2023,
            arquivo: "https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/arquivos/relatorio-resumido-da-execucao-orcamentaria-rreo",
        },
        {
            titulo: "RREO - 1º Bimestre - Exercício 2023",
            tipo: "RREO",
            periodo: "1º Bimestre",
            ano: 2023,
            arquivo: "https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/arquivos/relatorio-resumido-da-execucao-orcamentaria-rreo",
        },
        // RGF 2024
        {
            titulo: "RGF - 1º Quadrimestre - Exercício 2024",
            tipo: "RGF",
            periodo: "1º Quadrimestre",
            ano: 2024,
            arquivo: "https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/arquivos/relatorio-de-gestao-fiscal-rgf",
        },
        // RGF 2023
        {
            titulo: "RGF - 3º Quadrimestre - Exercício 2023",
            tipo: "RGF",
            periodo: "3º Quadrimestre",
            ano: 2023,
            arquivo: "https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/arquivos/relatorio-de-gestao-fiscal-rgf",
        },
        {
            titulo: "RGF - 2º Quadrimestre - Exercício 2023",
            tipo: "RGF",
            periodo: "2º Quadrimestre",
            ano: 2023,
            arquivo: "https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/arquivos/relatorio-de-gestao-fiscal-rgf",
        },
        {
            titulo: "RGF - 1º Quadrimestre - Exercício 2023",
            tipo: "RGF",
            periodo: "1º Quadrimestre",
            ano: 2023,
            arquivo: "https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/arquivos/relatorio-de-gestao-fiscal-rgf",
        },
        // Balanço Geral
        {
            titulo: "Balanço Geral - Exercício 2023",
            tipo: "BALANCO",
            periodo: "Anual",
            ano: 2023,
            arquivo: "https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/arquivos/balanco-geral",
        },
        // Contas de Gestão (PCS)
        {
            titulo: "PCS - Prestação de Contas de Gestão - Exercício 2023",
            tipo: "PCS",
            periodo: "Anual",
            ano: 2023,
            arquivo: "https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/arquivos/relatorio-de-gestao",
        },
        // Relatório de Gestão
        {
            titulo: "Relatório de Gestão Municipal - Exercício 2023",
            tipo: "RELATORIO_GESTAO",
            periodo: "Anual",
            ano: 2023,
            arquivo: "https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/arquivos/relatorio-de-gestao",
        },
    ];

    for (const r of relatorios) {
        await prisma.relatorioFiscal.upsert({
            where: { id: `seed-${r.tipo}-${r.ano}-${r.periodo}`.toLowerCase().replace(/\s+/g, '-') },
            update: r,
            create: {
                id: `seed-${r.tipo}-${r.ano}-${r.periodo}`.toLowerCase().replace(/\s+/g, '-'),
                ...r
            }
        });
    }

    console.log("Alimentação concluída com sucesso!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
