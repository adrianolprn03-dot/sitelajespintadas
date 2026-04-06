import type { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("🌱 Iniciando seed do banco de dados...");

    // --- Usuário Admin ---
    const senhaHash = await bcrypt.hash("Admin123!", 12);
    const admin = await prisma.usuario.upsert({
        where: { email: "admin@lajespintadas.rn.gov.br" },
        update: {},
        create: { nome: "Administrador do Sistema", email: "admin@lajespintadas.rn.gov.br", senha: senhaHash, perfil: "admin" },
    });
    console.log("✅ Admin criado:", admin.email);

    // --- Usuários de teste ---
    const comunicacaoHash = await bcrypt.hash("Comunicacao123!", 12);
    await prisma.usuario.upsert({
        where: { email: "comunicacao@lajespintadas.rn.gov.br" },
        update: {},
        create: { nome: "Assessoria de Comunicação", email: "comunicacao@lajespintadas.rn.gov.br", senha: comunicacaoHash, perfil: "comunicacao" },
    });

    // --- Secretarias ---
    const secretariasDados = [
        { 
            nome: "Controladoria Municipal", 
            slug: "controladoria-municipal", 
            descricao: "Conferência e acompanhamento das demonstrações contábeis, produção e emissão de notificações às unidades da administração apontando incorreções em processos contábeis, licitatórios, convênios e ajustes, além de fiscalizar o cumprimento de resoluções dos Tribunais de Contas.", 
            secretario: "Francisco Adriano Bezerra da Silva", 
            email: "ouvidoria@lajespintadas.rn.gov.br", 
            telefone: "(84) 98717-7756", 
            endereco: "Rua São Francisco, 275, Centro, Lajes Pintadas/RN, CEP: 59.235-000",
            horarioFuncionamento: "Segunda a Sexta-feira, das 7h às 13h",
            ordem: 1 
        },
        { 
            nome: "Secretaria Municipal de Administração Geral e Planejamento", 
            slug: "administracao-geral-planejamento", 
            descricao: "Execução das políticas de Administração de Recursos Humanos e dos bens patrimoniais do Município, coordenação e controle de processos de licitação, assessoria ao Prefeito na supervisão de órgãos municipais e planejamento orçamentário.", 
            secretario: "Sidcley Gomes da Silva", 
            email: "ouvidoria@lajespintadas.rn.gov.br", 
            telefone: "(84) 98717-7756", 
            endereco: "Rua São Francisco, 275, Centro, Lajes Pintadas/RN, CEP: 59.235-000",
            horarioFuncionamento: "Segunda a Sexta-feira, das 7h às 13h",
            ordem: 2 
        },
        { 
            nome: "Secretaria Municipal de Agricultura, Recursos Hídricos e Meio Ambiente", 
            slug: "agricultura-meio-ambiente", 
            descricao: "Promoção do desenvolvimento agrícola, apoio técnico e infraestrutura para produção e pesquisa, fiscalização do uso de defensivos agrícolas, controle da produção agropastoril e execução da política ambiental e de recursos hídricos.", 
            secretario: "Nelio Mendes Lucena", 
            email: "ouvidoria@lajespintadas.rn.gov.br", 
            telefone: "(84) 98717-7756", 
            endereco: "Rua José Ferreira Sobrinho, 100, Lajes Pintadas/RN, CEP: 59.235-000",
            horarioFuncionamento: "Segunda a Sexta-feira, das 7h às 13h",
            ordem: 3 
        },
        { 
            nome: "Secretaria Municipal de Assistência Social", 
            slug: "assistencia-social", 
            descricao: "Implementação e execução de políticas públicas de inclusão e promoção social, gestão de serviços e programas previstos na lei orgânica da assistência social e coordenação de programas de habitação popular e segurança alimentar.", 
            secretario: "Francisca Aparecida de França Gomes", 
            email: "ouvidoria@lajespintadas.rn.gov.br", 
            telefone: "(84) 98695-7255", 
            endereco: "Rua José Varela, 001, Lajes Pintadas/RN, CEP: 59.235-000",
            horarioFuncionamento: "Segunda a Sexta-feira, das 7h às 13h",
            ordem: 4 
        },
        { 
            nome: "Secretaria Municipal de Educação e Cultura", 
            slug: "educacao-cultura", 
            descricao: "Formulação da política educacional do município, organização e controle do processo de ensino nas escolas municipais, gestão de recursos financeiros da educação e promoção de atividades culturais e artísticas.", 
            secretario: "Ana Dark Pereira da Silva", 
            email: "ouvidoria@lajespintadas.rn.gov.br", 
            telefone: "(84) 98604-5406", 
            endereco: "Rua Geraldo Pegado, 006, Lajes Pintadas/RN, CEP: 59.235-000",
            horarioFuncionamento: "Segunda a Sexta-feira, das 7h às 13h",
            ordem: 5 
        },
        { 
            nome: "Secretaria Municipal de Finanças", 
            slug: "financas", 
            descricao: "Controle da execução orçamentária de despesas e receitas, escrituração contábil, preparação de balancetes e balanços gerais, além da movimentação de numerário e outros valores vinculados à Fazenda Municipal.", 
            secretario: "Fernando Luiz de Lima Gomes", 
            email: "ouvidoria@lajespintadas.rn.gov.br", 
            telefone: "(84) 98717-7756", 
            endereco: "Rua São Francisco, 275, Centro, Lajes Pintadas/RN, CEP: 59.235-000",
            horarioFuncionamento: "Segunda a Sexta-feira, das 7h às 13h",
            ordem: 6 
        },
        { 
            nome: "Secretaria Municipal de Obras e Serviços Urbanos", 
            slug: "obras-servicos-urbanos", 
            descricao: "Manutenção de espaços públicos (limpeza, varrição e coleta de lixo), execução de obras viárias e pavimentação, manutenção de prédios municipais e gestão da iluminação pública e cemitérios.", 
            secretario: "Julio Carlos Ferreira de Oliveira", 
            email: "ouvidoria@lajespintadas.rn.gov.br", 
            telefone: "(84) 98717-7756", 
            endereco: "Rua São Francisco, 275, Centro, Lajes Pintadas/RN, CEP: 59.235-000",
            horarioFuncionamento: "Segunda a Sexta-feira, das 7h às 13h",
            ordem: 7 
        },
        { 
            nome: "Secretaria Municipal de Saúde", 
            slug: "saude", 
            descricao: "Execução de vigilância epidemiológica e sanitária, promoção e recuperação do sistema municipal de saúde conforme as diretrizes do SUS, gestão de laboratórios de saúde pública e fiscalização de serviços privados de saúde.", 
            secretario: "Nivaldo Alves da Silva", 
            email: "ouvidoria@lajespintadas.rn.gov.br", 
            telefone: "(84) 98705-7241", 
            endereco: "Rua José Varela, 001, Lajes Pintadas/RN, CEP: 59.235-000",
            horarioFuncionamento: "Segunda a Sexta-feira, das 7h às 13h",
            ordem: 8 
        },
        { 
            nome: "Secretaria Municipal de Transportes", 
            slug: "transportes", 
            descricao: "Gestão e manutenção da frota de veículos oficiais do município, controle de abastecimento e acompanhamento das subcoordenadorias de transporte e manutenção rodoviária.", 
            secretario: "Paulo Francisco da Silva", 
            email: "ouvidoria@lajespintadas.rn.gov.br", 
            telefone: "(84) 98717-7756", 
            endereco: "Rua São Francisco, 275, Centro, Lajes Pintadas/RN, CEP: 59.235-000",
            horarioFuncionamento: "Segunda a Sexta-feira, das 7h às 13h",
            ordem: 9 
        },
        { 
            nome: "Secretaria Municipal de Tributação", 
            slug: "tributacao", 
            descricao: "Execução da política tributária municipal, fiscalização e arrecadação de impostos e taxas, inscription e cobrança da dívida ativa e orientação tributária aos contribuintes.", 
            secretario: "Ernesto Luis Gomes de Almeida", 
            email: "ouvidoria@lajespintadas.rn.gov.br", 
            telefone: "(84) 98717-7756", 
            endereco: "Rua São Francisco, 275, Centro, Lajes Pintadas/RN, CEP: 59.235-000",
            horarioFuncionamento: "Segunda a Sexta-feira, das 7h às 13h",
            ordem: 10 
        },
        { 
            nome: "Procuradoria Municipal", 
            slug: "procuradoria-municipal", 
            descricao: "Representação jurídica do Município em juízo ou extrajudicialmente, consultoria e assessoramento jurídico às unidades administrativas da prefeitura.", 
            secretario: "Fabiola Cunha Souza de Oliveira", 
            email: "ouvidoria@lajespintadas.rn.gov.br", 
            telefone: "(84) 98717-7756", 
            endereco: "Rua São Francisco, 275, Centro, Lajes Pintadas/RN, CEP: 59.235-000",
            horarioFuncionamento: "Segunda a Sexta-feira, das 7h às 13h",
            ordem: 11 
        },
    ];

    for (const s of secretariasDados) {
        await prisma.secretaria.upsert({ 
            where: { slug: s.slug }, 
            update: {
                nome: s.nome,
                descricao: s.descricao,
                secretario: s.secretario,
                email: s.email,
                telefone: s.telefone,
                endereco: s.endereco,
                horarioFuncionamento: s.horarioFuncionamento,
                ordem: s.ordem
            }, 
            create: s 
        });
    }
    console.log("✅ Secretarias oficiais criadas");

    // --- Notícias de exemplo ---
    const noticiasDados = [
        { titulo: "Prefeitura entrega obras de pavimentação no bairro Centro", resumo: "Obras de pavimentação asfáltica foram concluídas, beneficiando centenas de famílias.", conteudo: "<p>A Prefeitura Municipal de Lajes Pintadas entregou as obras de pavimentação asfáltica no bairro Centro, beneficiando centenas de famílias que agora contam com vias pavimentadas e acessíveis em qualquer período do ano.</p><p>O investimento foi realizado com recursos do município em parceria com o Governo do Estado do Rio Grande do Norte, totalizando mais de R$ 1,2 milhão aplicados em infraestrutura urbana.</p>", publicada: true, destaque: true, publicadoEm: new Date("2024-03-08") },
        { titulo: "Campanha de vacinação atinge meta de cobertura", resumo: "A Secretaria de Saúde anuncia que a campanha de vacinação alcançou 98% da população-alvo.", conteudo: "<p>A Secretaria Municipal de Saúde anuncia com satisfação que a campanha municipal de vacinação alcançou 98% da população-alvo, superando a meta nacional estabelecida pelo Ministério da Saúde.</p>", publicada: true, destaque: false, publicadoEm: new Date("2024-03-07") },
        { titulo: "Início das matrículas escolares 2024/2025", resumo: "As matrículas para o ano letivo começam na próxima semana. Confira os documentos necessários.", conteudo: "<p>A Secretaria Municipal de Educação informa que as matrículas para o ano letivo 2024/2025 terão início na próxima segunda-feira, em todas as escolas da rede municipal.</p>", publicada: true, destaque: false, publicadoEm: new Date("2024-03-06") },
    ];

    for (const n of noticiasDados) {
        const slug = n.titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        await prisma.noticia.upsert({ where: { slug }, update: {}, create: { ...n, slug } });
    }
    console.log("✅ Notícias de exemplo criadas");

    // --- Receitas de exemplo ---
    const receitasDados = [
        { descricao: "IPTU", categoria: "impostos", valor: 85000, mes: 1, ano: 2024 },
        { descricao: "ISS", categoria: "impostos", valor: 42000, mes: 1, ano: 2024 },
        { descricao: "FPM – Fundo de Participação dos Municípios", categoria: "transferencias", valor: 620000, mes: 1, ano: 2024 },
        { descricao: "Cota-parte ICMS", categoria: "transferencias", valor: 190000, mes: 1, ano: 2024 },
        { descricao: "IPTU", categoria: "impostos", valor: 91000, mes: 2, ano: 2024 },
        { descricao: "FPM – Fundo de Participação dos Municípios", categoria: "transferencias", valor: 645000, mes: 2, ano: 2024 },
        { descricao: "ISS", categoria: "impostos", valor: 38000, mes: 2, ano: 2024 },
        { descricao: "Taxas de Serviços Municipais", categoria: "receitas-proprias", valor: 18000, mes: 1, ano: 2024 },
        { descricao: "Multas e Juros", categoria: "receitas-proprias", valor: 7500, mes: 2, ano: 2024 },
    ];
    await prisma.receita.createMany({ data: receitasDados });
    console.log("✅ Receitas de exemplo criadas");

    // --- Licitações de exemplo ---
    const licitacoesDados = [
        { numero: "001/2024", ano: 2024, modalidade: "pregao", objeto: "Aquisição de Medicamentos para Rede Municipal de Saúde", valor: 250000, status: "concluida", secretaria: "Saúde", dataAbertura: new Date("2024-02-15") },
        { numero: "002/2024", ano: 2024, modalidade: "concorrencia", objeto: "Contratação de Empresa para Manutenção de Vias Urbanas", valor: 1800000, status: "aberta", secretaria: "Obras", dataAbertura: new Date("2024-03-01") },
        { numero: "003/2024", ano: 2024, modalidade: "pregao", objeto: "Fornecimento de Material de Escritório para Secretarias", valor: 45000, status: "em-andamento", secretaria: "Administração", dataAbertura: new Date("2024-02-20") },
    ];
    await prisma.licitacao.createMany({ data: licitacoesDados });
    console.log("✅ Licitações de exemplo criadas");

    // --- Servidores de exemplo ---
    const servidoresDados = [
        { nome: "Maria da Silva Santos", cargo: "Professora Municipal", vinculo: "efetivo", secretaria: "Educação", salarioBase: 2400, totalBruto: 3100, totalLiquido: 2650, ativo: true, mes: 3, ano: 2024 },
        { nome: "João Carlos Pereira", cargo: "Agente de Saúde", vinculo: "efetivo", secretaria: "Saúde", salarioBase: 1800, totalBruto: 2200, totalLiquido: 1950, ativo: true, mes: 3, ano: 2024 },
        { nome: "Dr. Carlos Eduardo Lima", cargo: "Médico Clínico Geral", vinculo: "contratado", secretaria: "Saúde", salarioBase: 8500, totalBruto: 9200, totalLiquido: 7800, ativo: true, mes: 3, ano: 2024 },
    ];
    await prisma.servidor.createMany({ data: servidoresDados });
    console.log("✅ Servidores de exemplo criados");

    // --- Obras de exemplo ---
    const obrasDados = [
        { titulo: "Construção da Nova Creche Municipal", descricao: "Obras para uma creche proinfância que atenderá 120 crianças em tempo integral.", local: "Bairro Novo Horizonte", valor: 1450000, status: "em-andamento", dataInicio: new Date("2024-01-10"), previsaoTermino: new Date("2024-11-30"), percentual: 35, empresa: "Construtora Progresso LTDA" },
        { titulo: "Reforma Centro de Convenções", descricao: "Reestruturação e reforma do centro cultural.", local: "Centro", valor: 650000, status: "concluida", dataInicio: new Date("2023-04-15"), previsaoTermino: new Date("2023-12-10"), percentual: 100, empresa: "Construtora Progresso LTDA" },
        { titulo: "Pavimentação do Bairro Bela Vista", descricao: "Pavimentação asfáltica e drenagem pluvial das ruas.", local: "Bairro Bela Vista", valor: 820000, status: "licitacao", dataInicio: null, previsaoTermino: null, percentual: 0, empresa: null },
    ];
    await prisma.obra.createMany({ data: obrasDados });
    console.log("✅ Obras de exemplo criadas");

    // --- FAQ de exemplo ---
    const faqDados = [
        { pergunta: "Como faço para solicitar o reparo da iluminação pública?", resposta: "Você pode abrir um chamado direto na Secretaria de Obras presencialmente ou acessar o ícone de 'Ouvidoria' no portal preenchendo o formulário de Solicitação de Serviço.", categoria: "Serviços Urbanos", ordem: 1 },
        { pergunta: "Qual o prazo legal para resposta de um pedido de informação via e-SIC?", resposta: "O prazo legal, segundo a Lei de Acesso à Informação (LAI), é de 20 (vinte) dias, podendo ser prorrogado por mais 10 (dez) dias, mediante justificativa expressa.", categoria: "Transparência", ordem: 2 },
        { pergunta: "Onde consigo emitir o DAM (Documento de Arrecadação Municipal) do meu IPTU?", resposta: "O IPTU pode ser emitido na aba 'Serviços Online > Portal do Contribuinte' usando o número de inscrição do imóvel ou o CPF do proprietário.", categoria: "Tributos", ordem: 3 },
    ];
    await prisma.fAQ.createMany({ data: faqDados });
    console.log("✅ FAQs criadas");

    // --- Glossário de exemplo ---
    const glossarioDados = [
        { termo: "Empenho", definicao: "O primeiro estágio da despesa pública. É a reserva de dotação orçamentária para um fim específico, criando uma obrigação de pagamento pendente de cumprimento de condição." },
        { termo: "Liquidação", definicao: "O segundo estágio da despesa. Consiste na verificação do direito adquirido pelo credor tendo por base os títulos e documentos comprobatórios do respectivo crédito (ex: nota fiscal de um serviço entregue)." },
        { termo: "RREO", definicao: "Relatório Resumido de Execução Orçamentária. Publicado bimestralmente, mostra o andamento da execução do orçamento, a arrecadação de receitas e as despesas realizadas." },
        { termo: "Pregão", definicao: "Modalidade de licitação obrigatória para a aquisição de bens e serviços comuns, caracterizada pela agilidade e pelo oferecimento de lances de forma decrescente." },
    ];
    await prisma.glossario.createMany({ data: glossarioDados });
    console.log("✅ Glossário criado");

    // --- Unidades de Atendimento (Mapeamento) ---
    const unidadesDados = [
        { nome: "Hospital Municipal Maternidade Nossa Senhora", tipo: "saude", descricao: "Atendimento de urgência, emergência, maternidade e especialidades básicas.", endereco: "Av. Principal, s/n - Centro", telefone: "(84) 3000-1111", horario: "24 horas", ativa: true },
        { nome: "CRAS - Centro de Referência de Assistência Social", tipo: "social", descricao: "Porta de entrada dos serviços sociais, cadastro único (CadÚnico) e Bolsa Família.", endereco: "Rua do Estádio, 10 - Bairro das Flores", telefone: "(84) 3000-2222", horario: "08h às 14h", ativa: true },
        { nome: "Escola Municipal Professora Maria das Graças", tipo: "educacao", descricao: "Ensino fundamental incompleto e educação infantil.", endereco: "Av. do Contorno, 55 - Bairro Bela Vista", telefone: "(84) 3000-3333", horario: "07h às 17h", ativa: true },
    ];
    await prisma.unidadeAtendimento.createMany({ data: unidadesDados });
    console.log("✅ Unidades de Atendimento criadas");

    // --- Conselhos Municipais ---
    const conselhoSaude = await prisma.conselho.create({
        data: {
            nome: "Conselho Municipal de Saúde (CMS)",
            sigla: "CMS",
            tipo: "saude",
            descricao: "Órgão colegiado destinado a atuar na formulação de estratégias e no controle da execução da política de saúde do município, composto por usuários, trabalhadores e gestores.",
            composicao: "50% representantes dos usuários, 25% trabalhadores da saúde, 25% representantes do governo e prestadores.",
            presidente: "Maria Helena Castro",
            email: "cms@lajespintadas.rn.gov.br",
            ativo: true,
            atas: {
                create: [
                    { titulo: "Ata da 1ª Reunião Ordinária 2024", dataReuniao: new Date("2024-01-20"), arquivo: "#" },
                    { titulo: "Ata da 2ª Reunião Ordinária 2024", dataReuniao: new Date("2024-02-15"), arquivo: "#" }
                ]
            }
        }
    });

    await prisma.conselho.create({
        data: {
            nome: "Conselho de Acompanhamento e Controle Social do FUNDEB",
            sigla: "CACS-FUNDEB",
            tipo: "fundeb",
            descricao: "Acompanhar e controlar a distribuição, a transferência e a aplicação dos recursos do Fundo.",
            composicao: "Representantes dos professores, diretores, pais de alunos, e do poder executivo.",
            presidente: "Prof. Marcos Vinícius Dias",
            email: "fundeb@lajespintadas.rn.gov.br",
            ativo: true
        }
    });
    console.log("✅ Conselhos Municipais criados");

    // --- Emendas Parlamentares de exemplo ---
    const emendasDados: Prisma.EmendaParlamentarCreateInput[] = [
        {
            codigoEmenda: "202412340001",
            anoEmenda: 2024,
            autorNome: "Deputado Federal João Silva",
            tipoEmenda: "Individual",
            objeto: "Aquisição de equipamentos hospitalares para o Hospital Municipal.",
            valorPrevisto: 500000,
            valorEmpenhado: 500000,
            valorLiquidado: 450000,
            valorPago: 450000,
            situacaoExecucao: "Em Execução",
            funcaoGoverno: "Saúde",
            urlFonteOficial: "https://www.portaltransparencia.gov.br",
            fonteDado: "Transferegov"
        },
        {
            codigoEmenda: "202456780002",
            anoEmenda: 2024,
            autorNome: "Senadora Maria Oliveira",
            tipoEmenda: "Bancada",
            objeto: "Pavimentação asfáltica de vias urbanas no Bairro Novo Horizonte.",
            valorPrevisto: 1200000,
            valorEmpenhado: 1200000,
            valorLiquidado: 0,
            valorPago: 0,
            situacaoExecucao: "Convênio Celebrado",
            funcaoGoverno: "Urbanismo",
            urlFonteOficial: "https://www.portaltransparencia.gov.br",
            fonteDado: "Transferegov"
        },
        {
            codigoEmenda: "202499990003",
            anoEmenda: 2024,
            autorNome: "Deputado Estadual Ricardo Santos",
            tipoEmenda: "Transferência Especial",
            objeto: "Recursos para custeio da rede municipal de ensino.",
            valorPrevisto: 300000,
            valorEmpenhado: 300000,
            valorLiquidado: 300000,
            valorPago: 300000,
            situacaoExecucao: "Pago",
            funcaoGoverno: "Educação",
            urlFonteOficial: "https://www.portaltransparencia.gov.br",
            fonteDado: "Transferegov"
        },
        // Emendas PIX (Transferências Especiais)
        {
            codigoEmenda: "2024PIX0001",
            anoEmenda: 2024,
            autorNome: "Deputado Federal André Costa",
            tipoEmenda: "Transferência Especial",
            objeto: "Apoio à infraestrutura turística local.",
            valorPrevisto: 250000,
            valorEmpenhado: 250000,
            valorLiquidado: 250000,
            valorPago: 250000,
            situacaoExecucao: "Finalizado",
            funcaoGoverno: "Turismo",
            urlFonteOficial: "https://www.portaltransparencia.gov.br",
            fonteDado: "Transferência Especial (PIX)"
        }
    ];

    for (const e of emendasDados) {
        await prisma.emendaParlamentar.upsert({
            where: { codigoEmenda: e.codigoEmenda },
            update: {},
            create: e
        });
    }
    console.log("✅ Emendas Parlamentares de exemplo criadas");

    // --- Legislação Orçamentária (LOA, LDO, PPA) ---
    const orcamentoDocs = [
        { tipo: "LOA", categoria: "Lei", numero: "560/2024", ano: 2024, ementa: "Estima a receita e fixa a despesa do Município de Lajes Pintadas para o exercício financeiro de 2024.", arquivo: "https://lajespintadas.rn.gov.br/transparencia/loa-2024.pdf" },
        { tipo: "LOA", categoria: "Quadros de Detalhamento", numero: "560/2024-QDD", ano: 2024, ementa: "Quadros de Detalhamento de Despesa (QDD) do exercício de 2024.", arquivo: "https://lajespintadas.rn.gov.br/transparencia/qdd-2024.pdf" },
        { tipo: "LDO", categoria: "Lei", numero: "555/2023", ano: 2024, ementa: "Dispõe sobre as diretrizes para a elaboração e execução da Lei Orçamentária de 2024.", arquivo: "https://lajespintadas.rn.gov.br/transparencia/ldo-2024.pdf" },
        { tipo: "LDO", categoria: "Anexo de Metas Fiscais", numero: "555/2023-AMF", ano: 2024, ementa: "Anexo de Metas Fiscais para o exercício de 2024.", arquivo: "https://lajespintadas.rn.gov.br/transparencia/amf-2024.pdf" },
        { tipo: "PPA", categoria: "Lei", numero: "500/2021", ano: 2024, ementa: "Plano Plurianual do Município de Lajes Pintadas para o período de 2022-2025.", arquivo: "https://lajespintadas.rn.gov.br/transparencia/ppa-2022-2025.pdf" },
        { tipo: "PPA", categoria: "Anexo de Programas", numero: "500/2021-ANX", ano: 2024, ementa: "Anexo de Programas e Metas do PPA 2022-2025.", arquivo: "https://lajespintadas.rn.gov.br/transparencia/ppa-anexos.pdf" },
        // Documentos de 2023 para histórico
        { tipo: "LOA", categoria: "Lei", numero: "540/2022", ano: 2023, ementa: "Estima a receita e fixa a despesa para o exercício de 2023.", arquivo: "https://lajespintadas.rn.gov.br/transparencia/loa-2023.pdf" },
        { tipo: "LDO", categoria: "Lei", numero: "535/2022", ano: 2023, ementa: "Diretrizes Orçamentárias para 2023.", arquivo: "https://lajespintadas.rn.gov.br/transparencia/ldo-2023.pdf" },
    ];

    for (const doc of orcamentoDocs) {
        await prisma.legislacao.create({ data: doc });
    }
    console.log("✅ Legislação Orçamentária criada");

    // --- Configurações do Município ---
    const configuracoesDados = [
        { chave: "municipio_nome", valor: "Lajes Pintadas", descricao: "Nome oficial do município", grupo: "geral" },
        { chave: "municipio_uf", valor: "RN", descricao: "Estado", grupo: "geral" },
        { chave: "municipio_ibge", valor: "2406601", descricao: "Código IBGE", grupo: "geral" },
        { chave: "municipio_populacao", valor: "4.463", descricao: "População estimada (Censo 2022)", grupo: "geral" },
        { chave: "municipio_area", valor: "120,4 km²", descricao: "Área territorial", grupo: "geral" },
        { chave: "municipio_fundacao", valor: "1958", descricao: "Ano de fundação/emancipação", grupo: "geral" },
        { chave: "municipio_cnpj", valor: "08.159.204/0001-38", descricao: "CNPJ da Prefeitura", grupo: "geral" },
        { chave: "prefeitura_endereco", valor: "Rua São Francisco, 275 - Centro", descricao: "Endereço da sede", grupo: "geral" },
        { chave: "prefeitura_telefone", valor: "(84) 98717-7756", descricao: "Telefone de contato", grupo: "geral" },
        { chave: "prefeitura_email", valor: "ouvidoria@lajespintadas.rn.gov.br", descricao: "E-mail oficial", grupo: "geral" },
        { chave: "prefeitura_horario", valor: "Segunda a Sexta: 07h00 às 13h00", descricao: "Horário de atendimento", grupo: "geral" },
    ];

    for (const c of configuracoesDados) {
        await prisma.configuracao.upsert({
            where: { chave: c.chave },
            update: { valor: c.valor },
            create: c
        });
    }
    console.log("✅ Configurações do Município criadas");

    console.log("\n🎉 Seed concluído com sucesso!");
    console.log("\n📋 Credenciais de acesso ao painel:");
    console.log("   E-mail: admin@lajespintadas.rn.gov.br");
    console.log("   Senha:  Admin123!");
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
