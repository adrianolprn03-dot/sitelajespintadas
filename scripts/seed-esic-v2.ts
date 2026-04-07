import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Semeando dados do e-SIC (Transparência Passiva)...");

    // Clear existing records to avoid duplicates during testing
    await prisma.esic.deleteMany();

    const dateToday = new Date();
    
    const pedidos = [
        // Concluído, Sem Sigilo
        {
            protocolo: "ESIC-2024-001",
            orgao: "Secretaria de Saúde",
            pedido: "Solicito a relação de médicos em atendimento nas UBS do município atualizada.",
            nome: "João da Silva",
            email: "joao@example.com",
            status: "concluido",
            grauSigilo: "Sem Sigilo",
            resposta: "Segue em anexo a lista de médicos, escalas e horários de atendimento das UBSs.",
            respondidoEm: new Date(dateToday.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            criadoEm: new Date(dateToday.getTime() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        },
        // Aberto, Sem Sigilo
        {
            protocolo: "ESIC-2024-002",
            orgao: "Obras e Infraestrutura",
            pedido: "Gostaria de saber o cronograma de pavimentação do Bairro Novo Horizonte.",
            nome: "Maria Oliveira",
            email: "maria@example.com",
            status: "aberto",
            grauSigilo: "Sem Sigilo",
            criadoEm: new Date(dateToday.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
        // Concluído, Com Sigilo - Reservado
        {
            protocolo: "ESIC-2024-003",
            orgao: "Gabinete do Prefeito",
            pedido: "Solicito informações sobre o plano de segurança municipal e alocação de guardas.",
            nome: "Carlos Eduardo",
            email: "carlos@example.com",
            status: "concluido",
            grauSigilo: "Reservado",
            resposta: "Acesso restrito. Informação classificada como RESERVADA com base na Lei 12.527/2011 por comprometer a segurança pública. Desclassificação em 5 anos.",
            respondidoEm: new Date(dateToday.getTime() - 10 * 24 * 60 * 60 * 1000),
            criadoEm: new Date(dateToday.getTime() - 20 * 24 * 60 * 60 * 1000),
        },
        // Concluído, Com Sigilo - Secreto
        {
            protocolo: "ESIC-2024-004",
            orgao: "Administração",
            pedido: "Relatório de inteligência sobre fraudes em licitações anteriores a 2020.",
            nome: "Ana Clara",
            email: "ana@example.com",
            status: "concluido",
            grauSigilo: "Secreto",
            resposta: "Acesso restrito. Informação classificada como SECRETA devido a investigações em andamento (LAI Art. 23). Desclassificação em 15 anos.",
            respondidoEm: new Date(dateToday.getTime() - 30 * 24 * 60 * 60 * 1000),
            criadoEm: new Date(dateToday.getTime() - 40 * 24 * 60 * 60 * 1000),
        },
        // Concluído, Com Sigilo - Ultrassecreto
        {
            protocolo: "ESIC-2024-005",
            orgao: "Procuradoria",
            pedido: "Estratégia de defesa do município na ação civil pública nº 000123-45.2023.",
            nome: "Pedro Santos",
            email: "pedro@example.com",
            status: "concluido",
            grauSigilo: "Ultrassecreto",
            resposta: "Acesso restrito. Estratégia de defesa jurídica classificada como ULTRASSECRETA. Desclassificação em 25 anos.",
            respondidoEm: new Date(dateToday.getTime() - 100 * 24 * 60 * 60 * 1000),
            criadoEm: new Date(dateToday.getTime() - 120 * 24 * 60 * 60 * 1000),
        }
    ];

    for (const p of pedidos) {
        await prisma.esic.create({
            data: p
        });
    }

    console.log(`✅ ${pedidos.length} registros e-SIC populados com sucesso!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
