import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
    const termos = [
        {
            termo: "PPA (Plano Plurianual)",
            definicao: "Instrumento de planejamento de médio prazo que estabelece as diretrizes, objetivos e metas da administração pública para um período de quatro anos."
        },
        {
            termo: "LDO (Lei de Diretrizes Orçamentárias)",
            definicao: "Define as metas e prioridades da administração para o ano seguinte, orientando a elaboração da Lei Orçamentária Anual (LOA)."
        },
        {
            termo: "LOA (Lei Orçamentária Anual)",
            definicao: "Estima a receita e fixa a despesa do município para o exercício financeiro, ou seja, é o orçamento propriamente dito."
        },
        {
            termo: "RGF (Relatório de Gestão Fiscal)",
            definicao: "Relatório quadrimestral que permite o controle do cumprimento dos limites estabelecidos pela Lei de Responsabilidade Fiscal (LRF), como gastos com pessoal e dívida."
        },
        {
            termo: "RREO (Relatório Resumido de Execução Orçamentária)",
            definicao: "Publicado bimestralmente, apresenta a execução do orçamento, comparando o que foi planejado com o que foi efetivamente realizado."
        },
        {
            termo: "RCL (Receita Corrente Líquida)",
            definicao: "Somatório das receitas tributárias, de contribuições, patrimoniais, industriais, agropecuárias, de serviços, transferências correntes e outras receitas correntes, deduzidas as transferências constitucionais."
        },
        {
            termo: "Empenho",
            definicao: "O primeiro estágio da despesa pública. Reserva do dinheiro para um fim específico, criando a obrigação de pagamento futuro."
        },
        {
            termo: "Liquidação",
            definicao: "O segundo estágio da despesa. Verificação de que o serviço foi prestado ou o material foi entregue corretamente conforme o empenho."
        },
        {
            termo: "Pagamento",
            definicao: "O último estágio da despesa pública. Entrega do valor ao credor (fornecedor/prestador) após a conclusão das etapas de empenho e liquidação."
        },
        {
            termo: "Restos a Pagar",
            definicao: "Despesas empenhadas mas não pagas até o dia 31 de dezembro, fim do exercício financeiro."
        }
    ];

    console.log("Seeding Glossário...");
    for (const item of termos) {
        await (prisma as any).glossario.upsert({
            where: { id: `term-${item.termo.toLowerCase().replace(/[^a-z]/g, '-')}` },
            update: item,
            create: { id: `term-${item.termo.toLowerCase().replace(/[^a-z]/g, '-')}`, ...item }
        });
    }
    console.log("Glossário Seeded successfully!");
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
