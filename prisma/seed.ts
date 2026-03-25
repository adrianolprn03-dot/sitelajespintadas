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
        { nome: "Secretaria de Administração", slug: "administracao", descricao: "Responsável pela gestão administrativa, recursos humanos, patrimônio, compras e licitações.", secretario: "José Alves da Silva", email: "administracao@lajespintadas.rn.gov.br", telefone: "(84) 3000-0001", ordem: 1 },
        { nome: "Secretaria de Saúde", slug: "saude", descricao: "Coordena os serviços de saúde pública, unidades de saúde e programas de prevenção.", secretario: "Dr. Carlos Mendes", email: "saude@lajespintadas.rn.gov.br", telefone: "(84) 3000-0002", ordem: 2 },
        { nome: "Secretaria de Educação", slug: "educacao", descricao: "Responsável pelas escolas municipais, merenda escolar e programas educacionais.", secretario: "Profa. Ana Beatriz", email: "educacao@lajespintadas.rn.gov.br", telefone: "(84) 3000-0003", ordem: 3 },
        { nome: "Secretaria de Obras e Infraestrutura", slug: "obras", descricao: "Gerencia obras, pavimentações, drenagem e manutenção da infraestrutura urbana.", secretario: "Eng. Pedro Rodrigues", email: "obras@lajespintadas.rn.gov.br", telefone: "(84) 3000-0004", ordem: 4 },
        { nome: "Secretaria de Finanças", slug: "financas", descricao: "Controla as finanças e o orçamento municipal, arrecadação de tributos e prestação de contas.", secretario: "Maria das Graças Sousa", email: "financas@lajespintadas.rn.gov.br", telefone: "(84) 3000-0005", ordem: 5 },
        { nome: "Secretaria de Assistência Social", slug: "assistencia-social", descricao: "Implementa programas sociais e atende famílias em situação de vulnerabilidade.", secretario: "Francisca Lima Santos", email: "social@lajespintadas.rn.gov.br", telefone: "(84) 3000-0006", ordem: 6 },
    ];

    for (const s of secretariasDados) {
        await prisma.secretaria.upsert({ where: { slug: s.slug }, update: {}, create: s });
    }
    console.log("✅ Secretarias criadas");

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

    console.log("\n🎉 Seed concluído com sucesso!");
    console.log("\n📋 Credenciais de acesso ao painel:");
    console.log("   E-mail: admin@lajespintadas.rn.gov.br");
    console.log("   Senha:  Admin123!");
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
