import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const servicosObrigatorios = [
    {
        nome: "Ouvidoria Municipal",
        categoria: "Transparência e Controle",
        descricao: "Canal direto para envio de denúncias, reclamações, sugestões e elogios à administração pública.",
        requisitos: "Identificação do requerente (pode ser anônimo em casos específicos), descrição clara do fato e anexos se houver.",
        etapas: "1. Registro do pedido;\n2. Análise pela Ouvidoria;\n3. Encaminhamento ao setor responsável;\n4. Resposta oficial ao cidadão.",
        formasAcesso: "Presencial na Sede da Prefeitura ou Online via Sistema de Ouvidoria.",
        prioridadesAtendimento: "Idosos, gestantes e pessoas com deficiência conforme Lei 10.048/2000.",
        previsaoEspera: "Até 30 dias (prorrogáveis por mais 30).",
        status: "ATIVO",
        linkAcesso: "https://ouvidoria.lajespintadas.rn.gov.br",
        local: "Prefeitura Municipal de Lajes Pintadas",
        prazo: "30 dias",
        documentos: "RG, CPF e comprovante de residência (se necessário)."
    },
    {
        nome: "e-SIC (Sistema de Informação ao Cidadão)",
        categoria: "Transparência e Controle",
        descricao: "Solicitação de informações públicas com base na Lei de Acesso à Informação (LAI).",
        requisitos: "Solicitação formal contendo a identificação do requerente e a especificação da informação requerida.",
        etapas: "1. Protocolo da solicitação;\n2. Triagem e encaminhamento;\n3. Elaboração da resposta;\n4. Disponibilização da informação.",
        formasAcesso: "Portal da Transparência (Digital) ou Protocolo Geral (Físico).",
        prioridadesAtendimento: "Ordem cronológica de solicitação.",
        previsaoEspera: "Até 20 dias (prorrogáveis por mais 10).",
        status: "ATIVO",
        linkAcesso: "https://transparencia.lajespintadas.rn.gov.br/esic",
        local: "Setor de Protocolo / Online",
        prazo: "20 dias",
        documentos: "Formulário preenchido e identificação básica."
    },
    {
        nome: "IPTU - Emissão de Guia",
        categoria: "Finanças e Tributos",
        descricao: "Emissão de guia para pagamento do Imposto Predial e Territorial Urbano.",
        requisitos: "Inscrição imobiliária ou CPF do proprietário.",
        etapas: "1. Consulta de débito;\n2. Geração de boleto;\n3. Pagamento na rede bancária.",
        formasAcesso: "Presencial no Setor de Tributação ou Online no Portal do Contribuinte.",
        prioridadesAtendimento: "Padrão Legal (Preferencial).",
        previsaoEspera: "Imediato (Online) ou 15 min (Presencial).",
        status: "ATIVO",
        linkAcesso: "https://lajespintadas.rn.gov.br/portal-contribuinte",
        local: "Setor de Tributos",
        prazo: "Imediato",
        documentos: "Inscrição do Imóvel."
    },
    {
        nome: "Portal da Transparência",
        categoria: "Transparência e Controle",
        descricao: "Acesso a dados sobre receitas, despesas, convênios, licitações e contratos do município.",
        requisitos: "Acesso livre a qualquer cidadão.",
        etapas: "Acesso direto via navegador.",
        formasAcesso: "Internet (Website Oficial).",
        prioridadesAtendimento: "Acesso Universal.",
        previsaoEspera: "Disponível 24h.",
        status: "ATIVO",
        linkAcesso: "https://transparencia.lajespintadas.rn.gov.br",
        local: "Online (transparencia.lajespintadas.rn.gov.br)",
        prazo: "Tempo Real / Mensal",
        documentos: "Nenhum documento exigido."
    },
    {
        nome: "Portal do Servidor",
        categoria: "Gestão de Pessoas",
        descricao: "Plataforma para que servidores públicos municipais acessem contracheques, informes de rendimentos e margem consignável.",
        requisitos: "Matrícula do servidor e senha de acesso previamente cadastrada.",
        etapas: "1. Acesso ao portal;\n2. Login com CPF/Matrícula;\n3. Seleção do documento desejado.",
        formasAcesso: "Online via Website Oficial (Área do Servidor).",
        prioridadesAtendimento: "Acesso Digital.",
        previsaoEspera: "Imediato.",
        status: "ATIVO",
        linkAcesso: "https://lajespintadas.rn.gov.br/portal-servidor",
        local: "Secretaria de Administração / Online",
        prazo: "Imediato",
        documentos: "CPF e Senha."
    },
    {
        nome: "Portal do Contribuinte",
        categoria: "Finanças e Tributos",
        descricao: "Espaço virtual destinado ao cidadão para solicitação de serviços tributários, parcelamentos e consultas de débitos.",
        requisitos: "CPF/CNPJ ou inscrição do imóvel/empresa.",
        etapas: "1. Cadastro no portal;\n2. Login;\n3. Escolha do serviço tributário.",
        formasAcesso: "Online ou Presencial no Setor de Tributação.",
        prioridadesAtendimento: "Acesso Digital / Prioridade Legal para Idosos.",
        previsaoEspera: "Imediato para consultas.",
        status: "ATIVO",
        local: "Setor de Tributos",
        prazo: "Imediato",
        documentos: "Documentos de identificação e dados do imóvel/empresa."
    },
    {
        nome: "Consultas de Leis e Normas",
        categoria: "Transparência e Controle",
        descricao: "Consulta pública à legislação municipal, incluindo Leis Orgânicas, Decretos, Portarias e Instruções Normativas.",
        requisitos: "Nenhum requisito para consulta básica.",
        etapas: "1. Acesso ao repositório de leis;\n2. Busca por termo ou número;\n3. Visualização do documento.",
        formasAcesso: "Portal da Transparência / Aba Legislação.",
        prioridadesAtendimento: "Acesso Público e Universal.",
        previsaoEspera: "Imediato.",
        status: "ATIVO",
        linkAcesso: "https://transparencia.lajespintadas.rn.gov.br/legislacao",
        local: "Prefeitura Online",
        prazo: "Imediato",
        documentos: "Nenhum."
    },
    {
        nome: "Protocolo Geral",
        categoria: "Administração",
        descricao: "Entrada formal de documentos, solicitações e processos administrativos endereçados à Prefeitura.",
        requisitos: "Requerimento preenchido e identificação do solicitante.",
        etapas: "1. Entrega do documento;\n2. Registro no sistema;\n3. Geração de número de protocolo para acompanhamento.",
        formasAcesso: "Presencial na Recepção da Prefeitura.",
        prioridadesAtendimento: "Prioridades legais vigentes.",
        previsaoEspera: "15 a 30 minutos.",
        status: "ATIVO",
        local: "Sede da Prefeitura",
        prazo: "Variável conforme pedido",
        documentos: "RG, CPF e requerimento."
    }
];

async function main() {
    console.log("Iniciando seed de serviços PNTP 2026...");
    
    for (const s of servicosObrigatorios) {
        // Mapeando para os nomes de campos corretos do schema
        const data = {
            nome: s.nome,
            categoria: s.categoria,
            descricao: s.descricao,
            local: s.local,
            prazo: s.prazo,
            requisitos: s.requisitos,
            documentos: s.documentos,
            etapas: s.etapas,
            formasAcesso: s.formasAcesso,
            prioridades: s.prioridadesAtendimento,
            previsaoEspera: s.previsaoEspera,
            statusServico: s.status,
            linkAcesso: s.linkAcesso,
            ativo: true
        };

        const existing = await prisma.servicoCarta.findFirst({
            where: { nome: s.nome }
        });

        if (existing) {
            await prisma.servicoCarta.update({
                where: { id: existing.id },
                data
            });
            console.log(`[ATUALIZADO] ${s.nome}`);
        } else {
            await prisma.servicoCarta.create({
                data
            });
            console.log(`[CRIADO] ${s.nome}`);
        }
    }
    
    console.log("Seed finalizado com sucesso!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
