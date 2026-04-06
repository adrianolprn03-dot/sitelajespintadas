import type { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("­ƒî▒ Iniciando seed do banco de dados...");

    // --- Usu├írio Admin ---
    const senhaHash = await bcrypt.hash("Admin123!", 12);
    const admin = await prisma.usuario.upsert({
        where: { email: "admin@lajespintadas.rn.gov.br" },
        update: {},
        create: { nome: "Administrador do Sistema", email: "admin@lajespintadas.rn.gov.br", senha: senhaHash, perfil: "admin" },
    });
    console.log("Ô£à Admin criado:", admin.email);

    // --- Usu├írios de teste ---
    const comunicacaoHash = await bcrypt.hash("Comunicacao123!", 12);
    await prisma.usuario.upsert({
        where: { email: "comunicacao@lajespintadas.rn.gov.br" },
        update: {},
        create: { nome: "Assessoria de Comunica├º├úo", email: "comunicacao@lajespintadas.rn.gov.br", senha: comunicacaoHash, perfil: "comunicacao" },
    });

    // --- Secretarias ---
    const secretariasDados = [
        { nome: "Secretaria de Administra├º├úo", slug: "administracao", descricao: "Respons├ível pela gest├úo administrativa, recursos humanos, patrim├┤nio, compras e licita├º├Áes.", secretario: "Jos├® Alves da Silva", email: "administracao@lajespintadas.rn.gov.br", telefone: "(84) 3000-0001", ordem: 1 },
        { nome: "Secretaria de Sa├║de", slug: "saude", descricao: "Coordena os servi├ºos de sa├║de p├║blica, unidades de sa├║de e programas de preven├º├úo.", secretario: "Dr. Carlos Mendes", email: "saude@lajespintadas.rn.gov.br", telefone: "(84) 3000-0002", ordem: 2 },
        { nome: "Secretaria de Educa├º├úo", slug: "educacao", descricao: "Respons├ível pelas escolas municipais, merenda escolar e programas educacionais.", secretario: "Profa. Ana Beatriz", email: "educacao@lajespintadas.rn.gov.br", telefone: "(84) 3000-0003", ordem: 3 },
        { nome: "Secretaria de Obras e Infraestrutura", slug: "obras", descricao: "Gerencia obras, pavimenta├º├Áes, drenagem e manuten├º├úo da infraestrutura urbana.", secretario: "Eng. Pedro Rodrigues", email: "obras@lajespintadas.rn.gov.br", telefone: "(84) 3000-0004", ordem: 4 },
        { nome: "Secretaria de Finan├ºas", slug: "financas", descricao: "Controla as finan├ºas e o or├ºamento municipal, arrecada├º├úo de tributos e presta├º├úo de contas.", secretario: "Maria das Gra├ºas Sousa", email: "financas@lajespintadas.rn.gov.br", telefone: "(84) 3000-0005", ordem: 5 },
        { nome: "Secretaria de Assist├¬ncia Social", slug: "assistencia-social", descricao: "Implementa programas sociais e atende fam├¡lias em situa├º├úo de vulnerabilidade.", secretario: "Francisca Lima Santos", email: "social@lajespintadas.rn.gov.br", telefone: "(84) 3000-0006", ordem: 6 },
    ];

    for (const s of secretariasDados) {
        await prisma.secretaria.upsert({ where: { slug: s.slug }, update: {}, create: s });
    }
    console.log("Ô£à Secretarias criadas");

    // --- Not├¡cias de exemplo ---
    const noticiasDados = [
        { titulo: "Prefeitura entrega obras de pavimenta├º├úo no bairro Centro", resumo: "Obras de pavimenta├º├úo asf├íltica foram conclu├¡das, beneficiando centenas de fam├¡lias.", conteudo: "<p>A Prefeitura Municipal de Lajes Pintadas entregou as obras de pavimenta├º├úo asf├íltica no bairro Centro, beneficiando centenas de fam├¡lias que agora contam com vias pavimentadas e acess├¡veis em qualquer per├¡odo do ano.</p><p>O investimento foi realizado com recursos do munic├¡pio em parceria com o Governo do Estado do Rio Grande do Norte, totalizando mais de R$ 1,2 milh├úo aplicados em infraestrutura urbana.</p>", publicada: true, destaque: true, publicadoEm: new Date("2024-03-08") },
        { titulo: "Campanha de vacina├º├úo atinge meta de cobertura", resumo: "A Secretaria de Sa├║de anuncia que a campanha de vacina├º├úo alcan├ºou 98% da popula├º├úo-alvo.", conteudo: "<p>A Secretaria Municipal de Sa├║de anuncia com satisfa├º├úo que a campanha municipal de vacina├º├úo alcan├ºou 98% da popula├º├úo-alvo, superando a meta nacional estabelecida pelo Minist├®rio da Sa├║de.</p>", publicada: true, destaque: false, publicadoEm: new Date("2024-03-07") },
        { titulo: "In├¡cio das matr├¡culas escolares 2024/2025", resumo: "As matr├¡culas para o ano letivo come├ºam na pr├│xima semana. Confira os documentos necess├írios.", conteudo: "<p>A Secretaria Municipal de Educa├º├úo informa que as matr├¡culas para o ano letivo 2024/2025 ter├úo in├¡cio na pr├│xima segunda-feira, em todas as escolas da rede municipal.</p>", publicada: true, destaque: false, publicadoEm: new Date("2024-03-06") },
    ];

    for (const n of noticiasDados) {
        const slug = n.titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        await prisma.noticia.upsert({ where: { slug }, update: {}, create: { ...n, slug } });
    }
    console.log("Ô£à Not├¡cias de exemplo criadas");

    // --- Receitas de exemplo ---
    const receitasDados = [
        { descricao: "IPTU", categoria: "impostos", valor: 85000, mes: 1, ano: 2024 },
        { descricao: "ISS", categoria: "impostos", valor: 42000, mes: 1, ano: 2024 },
        { descricao: "FPM ÔÇô Fundo de Participa├º├úo dos Munic├¡pios", categoria: "transferencias", valor: 620000, mes: 1, ano: 2024 },
        { descricao: "Cota-parte ICMS", categoria: "transferencias", valor: 190000, mes: 1, ano: 2024 },
        { descricao: "IPTU", categoria: "impostos", valor: 91000, mes: 2, ano: 2024 },
        { descricao: "FPM ÔÇô Fundo de Participa├º├úo dos Munic├¡pios", categoria: "transferencias", valor: 645000, mes: 2, ano: 2024 },
        { descricao: "ISS", categoria: "impostos", valor: 38000, mes: 2, ano: 2024 },
        { descricao: "Taxas de Servi├ºos Municipais", categoria: "receitas-proprias", valor: 18000, mes: 1, ano: 2024 },
        { descricao: "Multas e Juros", categoria: "receitas-proprias", valor: 7500, mes: 2, ano: 2024 },
    ];
    await prisma.receita.createMany({ data: receitasDados });
    console.log("Ô£à Receitas de exemplo criadas");

    // --- Licita├º├Áes de exemplo ---
    const licitacoesDados = [
        { numero: "001/2024", ano: 2024, modalidade: "pregao", objeto: "Aquisi├º├úo de Medicamentos para Rede Municipal de Sa├║de", valor: 250000, status: "concluida", secretaria: "Sa├║de", dataAbertura: new Date("2024-02-15") },
        { numero: "002/2024", ano: 2024, modalidade: "concorrencia", objeto: "Contrata├º├úo de Empresa para Manuten├º├úo de Vias Urbanas", valor: 1800000, status: "aberta", secretaria: "Obras", dataAbertura: new Date("2024-03-01") },
        { numero: "003/2024", ano: 2024, modalidade: "pregao", objeto: "Fornecimento de Material de Escrit├│rio para Secretarias", valor: 45000, status: "em-andamento", secretaria: "Administra├º├úo", dataAbertura: new Date("2024-02-20") },
    ];
    await prisma.licitacao.createMany({ data: licitacoesDados });
    console.log("Ô£à Licita├º├Áes de exemplo criadas");

    // --- Servidores de exemplo ---
    const servidoresDados = [
        { nome: "Maria da Silva Santos", cargo: "Professora Municipal", vinculo: "efetivo", secretaria: "Educa├º├úo", salarioBase: 2400, totalBruto: 3100, totalLiquido: 2650, ativo: true, mes: 3, ano: 2024 },
        { nome: "Jo├úo Carlos Pereira", cargo: "Agente de Sa├║de", vinculo: "efetivo", secretaria: "Sa├║de", salarioBase: 1800, totalBruto: 2200, totalLiquido: 1950, ativo: true, mes: 3, ano: 2024 },
        { nome: "Dr. Carlos Eduardo Lima", cargo: "M├®dico Cl├¡nico Geral", vinculo: "contratado", secretaria: "Sa├║de", salarioBase: 8500, totalBruto: 9200, totalLiquido: 7800, ativo: true, mes: 3, ano: 2024 },
    ];
    await prisma.servidor.createMany({ data: servidoresDados });
    console.log("Ô£à Servidores de exemplo criados");

    // --- Obras de exemplo ---
    const obrasDados = [
        { titulo: "Constru├º├úo da Nova Creche Municipal", descricao: "Obras para uma creche proinf├óncia que atender├í 120 crian├ºas em tempo integral.", local: "Bairro Novo Horizonte", valor: 1450000, status: "em-andamento", dataInicio: new Date("2024-01-10"), previsaoTermino: new Date("2024-11-30"), percentual: 35, empresa: "Construtora Progresso LTDA" },
        { titulo: "Reforma Centro de Conven├º├Áes", descricao: "Reestrutura├º├úo e reforma do centro cultural.", local: "Centro", valor: 650000, status: "concluida", dataInicio: new Date("2023-04-15"), previsaoTermino: new Date("2023-12-10"), percentual: 100, empresa: "Construtora Progresso LTDA" },
        { titulo: "Pavimenta├º├úo do Bairro Bela Vista", descricao: "Pavimenta├º├úo asf├íltica e drenagem pluvial das ruas.", local: "Bairro Bela Vista", valor: 820000, status: "licitacao", dataInicio: null, previsaoTermino: null, percentual: 0, empresa: null },
    ];
    await prisma.obra.createMany({ data: obrasDados });
    console.log("Ô£à Obras de exemplo criadas");

    // --- FAQ de exemplo ---
    const faqDados = [
        { pergunta: "Como fa├ºo para solicitar o reparo da ilumina├º├úo p├║blica?", resposta: "Voc├¬ pode abrir um chamado direto na Secretaria de Obras presencialmente ou acessar o ├¡cone de 'Ouvidoria' no portal preenchendo o formul├írio de Solicita├º├úo de Servi├ºo.", categoria: "Servi├ºos Urbanos", ordem: 1 },
        { pergunta: "Qual o prazo legal para resposta de um pedido de informa├º├úo via e-SIC?", resposta: "O prazo legal, segundo a Lei de Acesso ├á Informa├º├úo (LAI), ├® de 20 (vinte) dias, podendo ser prorrogado por mais 10 (dez) dias, mediante justificativa expressa.", categoria: "Transpar├¬ncia", ordem: 2 },
        { pergunta: "Onde consigo emitir o DAM (Documento de Arrecada├º├úo Municipal) do meu IPTU?", resposta: "O IPTU pode ser emitido na aba 'Servi├ºos Online > Portal do Contribuinte' usando o n├║mero de inscri├º├úo do im├│vel ou o CPF do propriet├írio.", categoria: "Tributos", ordem: 3 },
    ];
    await prisma.fAQ.createMany({ data: faqDados });
    console.log("Ô£à FAQs criadas");

    // --- Gloss├írio de exemplo ---
    const glossarioDados = [
        { termo: "Empenho", definicao: "O primeiro est├ígio da despesa p├║blica. ├ë a reserva de dota├º├úo or├ºament├íria para um fim espec├¡fico, criando uma obriga├º├úo de pagamento pendente de cumprimento de condi├º├úo." },
        { termo: "Liquida├º├úo", definicao: "O segundo est├ígio da despesa. Consiste na verifica├º├úo do direito adquirido pelo credor tendo por base os t├¡tulos e documentos comprobat├│rios do respectivo cr├®dito (ex: nota fiscal de um servi├ºo entregue)." },
        { termo: "RREO", definicao: "Relat├│rio Resumido de Execu├º├úo Or├ºament├íria. Publicado bimestralmente, mostra o andamento da execu├º├úo do or├ºamento, a arrecada├º├úo de receitas e as despesas realizadas." },
        { termo: "Preg├úo", definicao: "Modalidade de licita├º├úo obrigat├│ria para a aquisi├º├úo de bens e servi├ºos comuns, caracterizada pela agilidade e pelo oferecimento de lances de forma decrescente." },
    ];
    await prisma.glossario.createMany({ data: glossarioDados });
    console.log("Ô£à Gloss├írio criado");

    // --- Unidades de Atendimento (Mapeamento) ---
    const unidadesDados = [
        { nome: "Hospital Municipal Maternidade Nossa Senhora", tipo: "saude", descricao: "Atendimento de urg├¬ncia, emerg├¬ncia, maternidade e especialidades b├ísicas.", endereco: "Av. Principal, s/n - Centro", telefone: "(84) 3000-1111", horario: "24 horas", ativa: true },
        { nome: "CRAS - Centro de Refer├¬ncia de Assist├¬ncia Social", tipo: "social", descricao: "Porta de entrada dos servi├ºos sociais, cadastro ├║nico (Cad├Ünico) e Bolsa Fam├¡lia.", endereco: "Rua do Est├ídio, 10 - Bairro das Flores", telefone: "(84) 3000-2222", horario: "08h ├ás 14h", ativa: true },
        { nome: "Escola Municipal Professora Maria das Gra├ºas", tipo: "educacao", descricao: "Ensino fundamental incompleto e educa├º├úo infantil.", endereco: "Av. do Contorno, 55 - Bairro Bela Vista", telefone: "(84) 3000-3333", horario: "07h ├ás 17h", ativa: true },
    ];
    await prisma.unidadeAtendimento.createMany({ data: unidadesDados });
    console.log("Ô£à Unidades de Atendimento criadas");

    // --- Conselhos Municipais ---
    const conselhoSaude = await prisma.conselho.create({
        data: {
            nome: "Conselho Municipal de Sa├║de (CMS)",
            sigla: "CMS",
            tipo: "saude",
            descricao: "├ôrg├úo colegiado destinado a atuar na formula├º├úo de estrat├®gias e no controle da execu├º├úo da pol├¡tica de sa├║de do munic├¡pio, composto por usu├írios, trabalhadores e gestores.",
            composicao: "50% representantes dos usu├írios, 25% trabalhadores da sa├║de, 25% representantes do governo e prestadores.",
            presidente: "Maria Helena Castro",
            email: "cms@lajespintadas.rn.gov.br",
            ativo: true,
            atas: {
                create: [
                    { titulo: "Ata da 1┬¬ Reuni├úo Ordin├íria 2024", dataReuniao: new Date("2024-01-20"), arquivo: "#" },
                    { titulo: "Ata da 2┬¬ Reuni├úo Ordin├íria 2024", dataReuniao: new Date("2024-02-15"), arquivo: "#" }
                ]
            }
        }
    });

    await prisma.conselho.create({
        data: {
            nome: "Conselho de Acompanhamento e Controle Social do FUNDEB",
            sigla: "CACS-FUNDEB",
            tipo: "fundeb",
            descricao: "Acompanhar e controlar a distribui├º├úo, a transfer├¬ncia e a aplica├º├úo dos recursos do Fundo.",
            composicao: "Representantes dos professores, diretores, pais de alunos, e do poder executivo.",
            presidente: "Prof. Marcos Vin├¡cius Dias",
            email: "fundeb@lajespintadas.rn.gov.br",
            ativo: true
        }
    });
    console.log("Ô£à Conselhos Municipais criados");

    console.log("\n­ƒÄë Seed conclu├¡do com sucesso!");
    console.log("\n­ƒôï Credenciais de acesso ao painel:");
    console.log("   E-mail: admin@lajespintadas.rn.gov.br");
    console.log("   Senha:  Admin123!");
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
