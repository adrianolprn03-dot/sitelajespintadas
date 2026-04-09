const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const unidades = [
    // --- Saúde ---
    {
        nome: "UBS JOÃO OLINTO OLIVEIRA",
        tipo: "Saúde",
        descricao: "Unidade Básica de Saúde",
        endereco: "Rua Miriam Cavalcante Lima",
        horario: "Segunda a Sexta: 07h - 17h",
        telefone: "98796-9881 (smslajespintadasrn@outlook.com)",
        ativa: true
    },
    {
        nome: "UBS COMUNIDADE BOQUEIRÃO",
        tipo: "Saúde",
        descricao: "Unidade Básica de Saúde",
        endereco: "Zona rural Boqueirão",
        horario: "Terça a Quinta: 07h - 17h",
        telefone: "98796-9881 (smslajespintadasrn@outlook.com)",
        ativa: true
    },
    {
        nome: "UBS COMUNIDADE BARROS PRETO",
        tipo: "Saúde",
        descricao: "Unidade Básica de Saúde",
        endereco: "Zona rural Barros Preto",
        horario: "Segunda a Sexta: 07h - 13h",
        telefone: "98796-9881 (smslajespintadasrn@outlook.com)",
        ativa: true
    },
    {
        nome: "UBS COMUNIDADE RURAL SERRA VERDE",
        tipo: "Saúde",
        descricao: "Unidade Básica de Saúde",
        endereco: "Zona Rural Serra Verde",
        horario: "Terça a Quinta: 07h - 13h",
        telefone: "98796-9881 (smslajespintadasrn@outlook.com)",
        ativa: true
    },
    {
        nome: "UMS RAIMUNDO EUDES SILVA",
        tipo: "Saúde",
        descricao: "Unidade Mista de Saúde",
        endereco: "Rua Gov. Walfredo Gurgel",
        horario: "Todos os dias 24h",
        telefone: "98760-8261 (smslajespintadasrn@outlook.com)",
        ativa: true
    },

    // --- Escolas ---
    {
        nome: "ESCOLA MUNICIPAL AUREA GOMES",
        tipo: "Educação",
        descricao: "Unidade Escolar Municipal",
        endereco: "Comunidade Rural de Serra Verde",
        horario: "Segunda a Sexta: 07h as 21h",
        telefone: "aureagalvaogomes@gmail.com",
        ativa: true
    },
    {
        nome: "ESCOLA MUNICIPAL DERVAL OLIVAR COSTA",
        tipo: "Educação",
        descricao: "Unidade Escolar Municipal",
        endereco: "Rua: São Francisco, centro, Lajes Pintadas/RN",
        horario: "Segunda a Sexta",
        telefone: "98796-9881 (dervalolivarcosta@gmail.com.br)",
        ativa: true
    },
    {
        nome: "ESCOLA MUNICIPAL FRANCISCO J. GOMES",
        tipo: "Educação",
        descricao: "Unidade Escolar Municipal",
        endereco: "Zona rural de Boqueirão",
        horario: "Segunda a Sexta: 18h as 21h",
        telefone: "franciscojeronimogomes8@gmail.com",
        ativa: true
    },
    {
        nome: "ESCOLA MUNICIPAL MANOEL V. DE ALMEIDA",
        tipo: "Educação",
        descricao: "Unidade Escolar Municipal",
        endereco: "Zona Rural de Saco de Dentro",
        horario: "Segunda a Sexta: 18h as 21h",
        telefone: "manoelvalentim1971@gmail.com",
        ativa: true
    },
    {
        nome: "ESCOLA MUNICIPAL NANNI DE OLIVEIRA",
        tipo: "Educação",
        descricao: "Unidade Escolar Municipal",
        endereco: "Comunidade Rural Bento Nunes",
        horario: "Segunda a Sexta - 07h às 21h",
        telefone: "em.nanideoliveiralima@gmail.com",
        ativa: true
    },
    {
        nome: "ESCOLA MUNICIPAL SANTA MARTA",
        tipo: "Educação",
        descricao: "Unidade Escolar Municipal",
        endereco: "Comunidade Rural de Barros Preto",
        horario: "Segunda a Sexta - 07h às 21h",
        telefone: "escolasantamarta2019@gmail.com",
        ativa: true
    },
    {
        nome: "ESCOLA MUNICIPAL SÃO JOSÉ",
        tipo: "Educação",
        descricao: "Unidade Escolar Municipal",
        endereco: "Zona Rural de Saco de Dentro",
        horario: "Segunda a Sexta: 18h as 21h",
        telefone: "manoelvalentim1971@gmail.com",
        ativa: true
    },
    {
        nome: "ESCOLA MUNICIPAL SÃO JOÃO DE DEUS",
        tipo: "Educação",
        descricao: "Unidade Escolar Municipal",
        endereco: "Comunidade Rural de Cabaceiras",
        horario: "Segunda a Sexta - 07h às 21h",
        telefone: "emsaojoaodedeus1963@gmail.com",
        ativa: true
    },

    // --- Socioassistencial ---
    {
        nome: "CENTRO CONVIVENCIA ESTEVAM GABRIEL DE LIMA",
        tipo: "Socioassistencial",
        descricao: "Centro de Convivência",
        endereco: "Rua José Varela, 01, centro - Lajes Pintadas",
        horario: "Segunda a Sexta: 07h as 17h",
        telefone: "(84) 98675-7255 (assistenciasocial.lajesp@gmail.com)",
        ativa: true
    },
    {
        nome: "CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL - CRAS",
        tipo: "Socioassistencial",
        descricao: "Centro de Referência de Assistência Social (CRAS)",
        endereco: "Rua José Varela, 01, centro - Lajes Pintadas",
        horario: "Segunda a Sexta: 07h as 17h",
        telefone: "lajespintadascras@gmail.com",
        ativa: true
    },
    {
        nome: "CONSELHO TUTELAR",
        tipo: "Socioassistencial",
        descricao: "Órgão Permanente e Autônomo (Socioassistencial)",
        endereco: "Rua Joaquim Bernardino da Silva, Lajes Pintadas/RN",
        horario: "Segunda a Sexta: 07h as 17h",
        telefone: "ctlprn2020@gmail.com",
        ativa: true
    }
];

async function main() {
    let sucessos = 0;
    
    for (const uni of unidades) {
        // Verificar duplicidade por nome
        const existe = await prisma.unidadeAtendimento.findFirst({
            where: { nome: uni.nome }
        });
        
        if (existe) {
            await prisma.unidadeAtendimento.update({
                where: { id: existe.id },
                data: uni
            });
        } else {
            await prisma.unidadeAtendimento.create({
                data: uni
            });
        }
        sucessos++;
    }
    
    console.log(`Unidades de Saúde, Escolares e Socioassistenciais processadas com sucesso: ${sucessos}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
