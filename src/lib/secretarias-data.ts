export interface SecretariaOficial {
    id: string;
    nome: string;
    slug: string;
    aliases: string[];
    descricao: string;
    secretario: string;
    cargo: string;
    email: string;
    telefone: string;
    endereco: string;
    horarioFuncionamento: string;
    ordem: number;
    servicos: string[];
}

export const SECRETARIAS_OFICIAIS: SecretariaOficial[] = [
    {
        id: "sec-administracao",
        nome: "Secretaria Municipal de Administração Geral e Planejamento",
        slug: "administracao-geral-planejamento",
        aliases: ["administracao", "planejamento", "administracao-e-planejamento"],
        descricao:
            "Execução das políticas de Administração de Recursos Humanos e dos bens patrimoniais do Município, coordenação e controle de processos de licitação, assessoria ao Prefeito na supervisão de órgãos municipais e planejamento orçamentário.",
        secretario: "Sidcley Gomes da Silva",
        cargo: "Secretário Municipal de Administração e Planejamento",
        email: "ouvidoria@lajespintadas.rn.gov.br",
        telefone: "(84) 98717-7756",
        endereco: "Rua São Francisco, 275, Centro, Lajes Pintadas/RN, CEP: 59.235-000",
        horarioFuncionamento: "Segunda a Sexta-feira, das 07h às 13h",
        ordem: 1,
        servicos: [
            "Gestão de Recursos Humanos e Atendimento ao Servidor",
            "Emissão de Contracheques e Declarações Funcionais",
            "Protocolo Administrativo Geral e Arquivo Público",
            "Coordenação de Licitações, Compras e Patrimônio Público",
            "Planejamento Orçamentário Participativo (PPA, LDO e LOA)",
        ],
    },
    {
        id: "sec-saude",
        nome: "Secretaria Municipal de Saúde",
        slug: "saude",
        aliases: ["saude-publica", "secretaria-de-saude"],
        descricao:
            "Execução de vigilância epidemiológica e sanitária, promoção e recuperação do sistema municipal de saúde conforme as diretrizes do SUS, gestão de unidades básicas de saúde, assistência farmacêutica e regulação de exames e consultas.",
        secretario: "Nivaldo Alves da Silva",
        cargo: "Secretário Municipal de Saúde",
        email: "ouvidoria@lajespintadas.rn.gov.br",
        telefone: "(84) 98705-7241",
        endereco: "Rua José Varela, 001, Centro, Lajes Pintadas/RN, CEP: 59.235-000",
        horarioFuncionamento: "Segunda a Sexta-feira, das 07h às 13h",
        ordem: 2,
        servicos: [
            "Atendimento médico e odontológico nas Unidades Básicas de Saúde (UBS)",
            "Dispensação de medicamentos na Farmácia Básica Municipal (SUS)",
            "Central Municipal de Regulação de Exames e Consultas Especializadas",
            "Vigilância Sanitária, Epidemiológica e Imunização (Vacinação)",
            "Emissão e atualização do Cartão Nacional de Saúde (Cartão SUS)",
        ],
    },
    {
        id: "sec-educacao",
        nome: "Secretaria Municipal de Educação e Cultura",
        slug: "educacao-cultura",
        aliases: ["educacao", "cultura", "educacao-e-cultura"],
        descricao:
            "Formulação da política educacional do município, organização e controle do processo de ensino nas escolas e creches municipais, gestão de recursos financeiros da educação, transporte e merenda escolar, além da promoção de atividades culturais e artísticas.",
        secretario: "Ana Dark Pereira da Silva",
        cargo: "Secretária Municipal de Educação e Cultura",
        email: "ouvidoria@lajespintadas.rn.gov.br",
        telefone: "(84) 98604-5406",
        endereco: "Rua Geraldo Pegado, 006, Centro, Lajes Pintadas/RN, CEP: 59.235-000",
        horarioFuncionamento: "Segunda a Sexta-feira, das 07h às 13h",
        ordem: 3,
        servicos: [
            "Matrícula Escolar na Educação Infantil (Creches) e Ensino Fundamental",
            "Gestão do Transporte Escolar e Alimentação Escolar (PNAE)",
            "Emissão de Histórico e Transferência Escolar nas Unidades da Rede",
            "Fomento Cultural, Eventos Tradicionais e Patrimônio Histórico",
            "Acompanhamento das metas do Plano Municipal de Educação (PME)",
        ],
    },
    {
        id: "sec-assistencia",
        nome: "Secretaria Municipal de Assistência Social",
        slug: "assistencia-social",
        aliases: ["social", "acao-social", "trabalho-habitacao-assistencia"],
        descricao:
            "Implementação e execução de políticas públicas de inclusão e promoção social, gestão de serviços e programas previstos na Lei Orgânica da Assistência Social (SUAS), atendimento no CRAS e coordenação de programas de segurança alimentar.",
        secretario: "Francisca Aparecida de França Gomes",
        cargo: "Secretária Municipal de Assistência Social",
        email: "ouvidoria@lajespintadas.rn.gov.br",
        telefone: "(84) 98695-7255",
        endereco: "Rua José Varela, 001, Centro, Lajes Pintadas/RN, CEP: 59.235-000",
        horarioFuncionamento: "Segunda a Sexta-feira, das 07h às 13h",
        ordem: 4,
        servicos: [
            "Cadastro Único para Programas Sociais (CadÚnico) e Bolsa Família",
            "Atendimento integral às famílias no CRAS (PAIF e SCFV)",
            "Concessão e acompanhamento de Benefícios Eventuais",
            "Programas de apoio à Criança, Adolescente e Pessoa Idosa",
            "Segurança Alimentar e Inclusão Produtiva",
        ],
    },
    {
        id: "sec-obras",
        nome: "Secretaria Municipal de Obras e Serviços Urbanos",
        slug: "obras-servicos-urbanos",
        aliases: ["obras", "infraestrutura", "servicos-urbanos", "obras-e-infraestrutura"],
        descricao:
            "Manutenção de espaços públicos (limpeza urbana, varrição, poda e coleta de resíduos), execução de obras viárias e pavimentação, manutenção de prédios municipais e gestão da iluminação pública e cemitérios.",
        secretario: "Julio Carlos Ferreira de Oliveira",
        cargo: "Secretário Municipal de Obras e Serviços Urbanos",
        email: "ouvidoria@lajespintadas.rn.gov.br",
        telefone: "(84) 98717-7756",
        endereco: "Rua São Francisco, 275, Centro, Lajes Pintadas/RN, CEP: 59.235-000",
        horarioFuncionamento: "Segunda a Sexta-feira, das 07h às 13h",
        ordem: 5,
        servicos: [
            "Manutenção da Iluminação Pública Municipal",
            "Coleta de Resíduos Sólidos, Limpeza Urbana e Capinação",
            "Fiscalização e Execução de Obras Públicas e Pavimentação",
            "Emissão de Alvarás de Construção e Habite-se",
            "Manutenção de Praças, Prédios Públicos e Vias Urbanas",
        ],
    },
    {
        id: "sec-agricultura",
        nome: "Secretaria Municipal de Agricultura, Recursos Hídricos e Meio Ambiente",
        slug: "agricultura-meio-ambiente",
        aliases: ["agricultura", "meio-ambiente", "recursos-hidricos"],
        descricao:
            "Promoção do desenvolvimento agrícola e pecuário, apoio técnico e infraestrutura para o produtor rural, corte de terras, abastecimento d'água na zona rural e execução da política ambiental e de recursos hídricos.",
        secretario: "Nelio Mendes Lucena",
        cargo: "Secretário Municipal de Agricultura e Meio Ambiente",
        email: "ouvidoria@lajespintadas.rn.gov.br",
        telefone: "(84) 98717-7756",
        endereco: "Rua José Ferreira Sobrinho, 100, Lajes Pintadas/RN, CEP: 59.235-000",
        horarioFuncionamento: "Segunda a Sexta-feira, das 07h às 13h",
        ordem: 6,
        servicos: [
            "Programa de Corte de Terras e Apoio ao Homem do Campo",
            "Assistência Técnica Rural, Garantia-Safra e Sementes",
            "Abastecimento Hídrico, Manutenção de Poços e Açudes",
            "Preservação Ambiental e Educação Ecológica",
            "Apoio à Agricultura Familiar e Comercialização Local",
        ],
    },
    {
        id: "sec-financas",
        nome: "Secretaria Municipal de Finanças",
        slug: "financas",
        aliases: ["financas-e-orcamento", "fazenda"],
        descricao:
            "Controle da execução orçamentária de despesas e receitas, escrituração contábil, preparação de balancetes, relatórios da LRF (RREO/RGF) e balanços gerais, além da movimentação financeira e pagamento a fornecedores.",
        secretario: "Fernando Luiz de Lima Gomes",
        cargo: "Secretário Municipal de Finanças",
        email: "ouvidoria@lajespintadas.rn.gov.br",
        telefone: "(84) 98717-7756",
        endereco: "Rua São Francisco, 275, Centro, Lajes Pintadas/RN, CEP: 59.235-000",
        horarioFuncionamento: "Segunda a Sexta-feira, das 07h às 13h",
        ordem: 7,
        servicos: [
            "Execução Orçamentária, Empenhos, Liquidações e Pagamentos",
            "Ordem Cronológica de Pagamentos a Fornecedores",
            "Publicação de Demonstrativos Fiscais da LRF (RREO e RGF)",
            "Balanços Contábeis e Prestação de Contas Anual",
            "Gestão de Convênios e Transferências Constitucionais",
        ],
    },
    {
        id: "sec-tributacao",
        nome: "Secretaria Municipal de Tributação",
        slug: "tributacao",
        aliases: ["tributos", "setor-tributario"],
        descricao:
            "Execução da política tributária municipal, atendimento ao contribuinte, fiscalização e arrecadação de impostos e taxas (IPTU, ISS, ITBI), inscrição e cobrança da dívida ativa e emissão de certidões e notas fiscais.",
        secretario: "Ernesto Luis Gomes de Almeida",
        cargo: "Secretário Municipal de Tributação",
        email: "ouvidoria@lajespintadas.rn.gov.br",
        telefone: "(84) 98717-7756",
        endereco: "Rua São Francisco, 275, Centro, Lajes Pintadas/RN, CEP: 59.235-000",
        horarioFuncionamento: "Segunda a Sexta-feira, das 07h às 13h",
        ordem: 8,
        servicos: [
            "Emissão de DAM e 2ª Via de IPTU, ISS e Taxas Municipais",
            "Emissão de Certidão Negativa e Positiva com Efeito de Negativa",
            "Nota Fiscal de Serviços Eletrônica (NFS-e) e Alvará de Funcionamento",
            "Cadastro Imobiliário e Mercantil do Município",
            "Parcelamento e Regularização de Débitos Tributários",
        ],
    },
    {
        id: "sec-transportes",
        nome: "Secretaria Municipal de Transportes",
        slug: "transportes",
        aliases: ["transporte", "frota"],
        descricao:
            "Gestão, controle e manutenção da frota de veículos e máquinas oficiais do município, controle de abastecimento e acompanhamento das ações de transporte institucional e conservação de estradas vicinais.",
        secretario: "Paulo Francisco da Silva",
        cargo: "Secretário Municipal de Transportes",
        email: "ouvidoria@lajespintadas.rn.gov.br",
        telefone: "(84) 98717-7756",
        endereco: "Rua São Francisco, 275, Centro, Lajes Pintadas/RN, CEP: 59.235-000",
        horarioFuncionamento: "Segunda a Sexta-feira, das 07h às 13h",
        ordem: 9,
        servicos: [
            "Gestão e Manutenção Preventiva da Frota Oficial Municipal",
            "Apoio Logístico ao Transporte de Pacientes e Estudantes",
            "Recuperação e Patrolamento de Estradas Vicinais Rurais",
            "Controle Transparente de Combustíveis e Veículos Oficiais",
        ],
    },
    {
        id: "sec-controladoria",
        nome: "Controladoria Geral do Município",
        slug: "controladoria-municipal",
        aliases: ["controladoria", "gabinete", "controle-interno"],
        descricao:
            "Conferência e acompanhamento das demonstrações contábeis, orientação técnica às unidades administrativas em processos licitatórios e convênios, fiscalização do cumprimento das normas do TCE/RN, Ouvidoria e Transparência Pública.",
        secretario: "Francisco Adriano Bezerra da Silva",
        cargo: "Controlador Geral do Município",
        email: "ouvidoria@lajespintadas.rn.gov.br",
        telefone: "(84) 98717-7756",
        endereco: "Rua São Francisco, 275, Centro, Lajes Pintadas/RN, CEP: 59.235-000",
        horarioFuncionamento: "Segunda a Sexta-feira, das 07h às 13h",
        ordem: 10,
        servicos: [
            "Coordenação do Portal da Transparência e Conformidade PNTP",
            "Gestão do Serviço de Informação ao Cidadão (e-SIC / LAI)",
            "Ouvidoria Geral do Município e Controle Interno",
            "Auditoria Preventiva de Contratos, Convênios e Licitações",
        ],
    },
    {
        id: "sec-procuradoria",
        nome: "Procuradoria Geral do Município",
        slug: "procuradoria-municipal",
        aliases: ["procuradoria", "juridico"],
        descricao:
            "Representação jurídica do Município em juízo ou extrajudicialmente, consultoria e assessoramento jurídico ao Poder Executivo e às secretarias municipais, elaboração de pareceres e defesa do patrimônio público.",
        secretario: "Fabiola Cunha Souza de Oliveira",
        cargo: "Procuradora Geral do Município",
        email: "ouvidoria@lajespintadas.rn.gov.br",
        telefone: "(84) 98717-7756",
        endereco: "Rua São Francisco, 275, Centro, Lajes Pintadas/RN, CEP: 59.235-000",
        horarioFuncionamento: "Segunda a Sexta-feira, das 07h às 13h",
        ordem: 11,
        servicos: [
            "Assessoramento Jurídico ao Gabinete e Secretarias Municipais",
            "Emissão de Pareceres Jurídicos em Licitações e Contratos",
            "Representação Judicial e Extrajudicial do Município",
            "Sistematização e Consolidação de Leis e Decretos Municipais",
        ],
    },
];

export function findSecretariaBySlugOrAlias(slug: string): SecretariaOficial | undefined {
    const clean = (slug || "").toLowerCase().trim();
    return SECRETARIAS_OFICIAIS.find(
        (s) => s.slug === clean || s.aliases.includes(clean) || s.slug.startsWith(clean)
    );
}
