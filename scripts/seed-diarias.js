const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Semeando dados de Diárias de Viagem...");

    // Limpar registros existentes para testes limpos
    await prisma.diaria.deleteMany();

    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    const mesAtual = dataAtual.getMonth() + 1; // 1 a 12

    const diarias = [
        {
            servidor: "MARIA DO CARMO SILVA",
            cargo: "Enfermeira Chefe",
            destino: "Natal/RN",
            motivo: "Participação em capacitação sobre novas diretrizes de vacinação na SESAP.",
            dataInicio: new Date(anoAtual, mesAtual - 1, 5),
            dataFim: new Date(anoAtual, mesAtual - 1, 6),
            valor: 350.00,
            valorUnitario: 175.00,
            quantidadeDias: 2,
            secretaria: "Saúde",
            mes: mesAtual,
            ano: anoAtual,
        },
        {
            servidor: "JOSÉ AUGUSTO PEREIRA",
            cargo: "Motorista de Ambulância",
            destino: "Natal/RN",
            motivo: "Transporte de pacientes para exames de alta complexidade.",
            dataInicio: new Date(anoAtual, mesAtual - 1, 10),
            dataFim: new Date(anoAtual, mesAtual - 1, 10),
            valor: 150.00,
            valorUnitario: 150.00,
            quantidadeDias: 1,
            secretaria: "Saúde",
            mes: mesAtual,
            ano: anoAtual,
        },
        {
            servidor: "CARLOS EDUARDO MEDEIROS",
            cargo: "Secretário de Obras",
            destino: "Brasília/DF",
            motivo: "Reunião no Ministério das Cidades para liberação de recursos de pavimentação.",
            dataInicio: new Date(anoAtual, mesAtual - 1, 12),
            dataFim: new Date(anoAtual, mesAtual - 1, 15),
            valor: 2400.00,
            valorUnitario: 600.00,
            quantidadeDias: 4,
            secretaria: "Obras",
            mes: mesAtual,
            ano: anoAtual,
        },
        {
            servidor: "ANA BEATRIZ NUNES",
            cargo: "Prefeita Municipal",
            destino: "Brasília/DF",
            motivo: "Participação na Marcha a Brasília em Defesa dos Municípios.",
            dataInicio: new Date(anoAtual, mesAtual - 1, 12),
            dataFim: new Date(anoAtual, mesAtual - 1, 16),
            valor: 4500.00,
            valorUnitario: 900.00,
            quantidadeDias: 5,
            secretaria: "Gabinete",
            mes: mesAtual,
            ano: anoAtual,
        },
        {
            servidor: "PAULO HENRIQUE SOUZA",
            cargo: "Gestor de Contratos",
            destino: "Parnamirim/RN",
            motivo: "Visita técnica a feira de tecnologia para gestão pública.",
            dataInicio: new Date(anoAtual, mesAtual - 1, 20),
            dataFim: new Date(anoAtual, mesAtual - 1, 21),
            valor: 400.00,
            valorUnitario: 200.00,
            quantidadeDias: 2,
            secretaria: "Administração",
            mes: mesAtual,
            ano: anoAtual,
        }
    ];

    for (const d of diarias) {
        await prisma.diaria.create({ data: d });
    }

    console.log(`✅ ${diarias.length} Diárias cadastradas com sucesso (Mês ${mesAtual}/${anoAtual})!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
