import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Semeando Relatórios Fiscais (PCG)...");

    const relatorios = [
        {
            titulo: "Balanço Geral Consolidado - Exercício 2023",
            tipo: "PCG",
            periodo: "Anual",
            ano: 2023,
            arquivo: "/uploads/transparencia/pcg/balanco-geral-2023.pdf",
            dataPublicacao: new Date("2024-03-30"),
        },
        {
            titulo: "Relatório de Gestão Fiscal - PCG 2022",
            tipo: "PCG",
            periodo: "Anual",
            ano: 2022,
            arquivo: "/uploads/transparencia/pcg/gestao-fiscal-2022.pdf",
            dataPublicacao: new Date("2023-03-25"),
        },
        {
            titulo: "Parecer Prévio do TCE - Contas 2021",
            tipo: "PCG",
            periodo: "Anual",
            ano: 2021,
            arquivo: "/uploads/transparencia/pcg/parecer-tce-2021.pdf",
            dataPublicacao: new Date("2022-11-15"),
        }
    ];

    for (const r of relatorios) {
        await prisma.relatorioFiscal.create({
            data: r
        });
    }

    console.log("✅ PCG populado com sucesso!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
