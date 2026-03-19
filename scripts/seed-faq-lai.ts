import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
    const faqs = [
        {
            pergunta: "O que é a Lei de Acesso à Informação (LAI)?",
            resposta: "A Lei nº 12.527/2011, conhecida como Lei de Acesso à Informação (LAI), regulamenta o direito constitucional de acesso dos cidadãos às informações públicas, sendo aplicável aos três Poderes da União, dos Estados, do Distrito Federal e dos Municípios.",
            categoria: "Transparência",
            ordem: 1
        },
        {
            pergunta: "Quem pode fazer um pedido de informação pelo e-SIC?",
            resposta: "Qualquer pessoa, física ou jurídica, pode encaminhar pedidos de acesso à informação. Não é necessário apresentar justificativa para o pedido.",
            categoria: "Transparência",
            ordem: 2
        },
        {
            pergunta: "Qual o prazo para receber uma resposta do e-SIC?",
            resposta: "O prazo de resposta é de até 20 dias, podendo ser prorrogado por mais 10 dias, mediante justificativa expressa.",
            categoria: "Transparência",
            ordem: 3
        },
        {
            pergunta: "O que fazer se o meu pedido de informação for negado?",
            resposta: "No caso de negativa de acesso à informação ou de não fornecimento das razões da negativa do acesso, o requerente poderá apresentar recurso no prazo de 10 dias a contar da sua ciência.",
            categoria: "Transparência",
            ordem: 4
        },
        {
            pergunta: "Qual a diferença entre e-SIC e Ouvidoria?",
            resposta: "O e-SIC é para pedidos de informações públicas (dados, documentos, estatísticas). A Ouvidoria é para manifestações como denúncias, reclamações, elogios, sugestões e solicitações de serviços ou providências.",
            categoria: "Transparência",
            ordem: 5
        },
        {
            pergunta: "O acesso à informação é gratuito?",
            resposta: "O serviço de busca e fornecimento da informação é gratuito. Entretanto, podem ser cobrados os custos de reprodução de documentos (cópias xerográficas, mídias digitais, etc.), caso o cidadão opte por receber em meio físico.",
            categoria: "Transparência",
            ordem: 6
        },
        {
            pergunta: "As informações pessoais estão protegidas?",
            resposta: "Sim. O acesso à informação não abrange informações pessoais que possam violar a intimidade, vida privada, honra e imagem das pessoas, em conformidade com a LGPD e a própria LAI.",
            categoria: "Transparência",
            ordem: 7
        }
    ];

    console.log("Seeding FAQ...");
    for (const faq of faqs) {
        await prisma.fAQ.upsert({
            where: { id: `faq-lai-${faq.ordem}` },
            update: faq,
            create: { id: `faq-lai-${faq.ordem}`, ...faq }
        });
    }
    console.log("FAQ Seeded successfully!");
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
