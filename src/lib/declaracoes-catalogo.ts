import { MUNICIPIO } from "@/config/municipio";

export interface ModeloDeclaracaoInexistencia {
    slug: string;
    aliases: string[];
    titulo: string;
    tituloCurto: string;
    criterioPntp: string;
    dimensaoPntp: string;
    orgaoResponsavelPadrao: string;
    responsavelNomePadrao: string;
    responsavelCargoPadrao: string;
    fundamentoLegalPadrao: string;
    rotaPublica: string;
    rotaAdmin: string;
    gerarTextoPadrao: (exercicio: number, competencia?: string, orgao?: string) => string;
}

const FUNDAMENTO_GERAL =
    "Art. 8º da Lei Federal nº 12.527/2011 (LAI), Lei Complementar nº 101/2000 (LRF) e Cartilha PNTP 2026 (ATRICON / TCE-RN).";

function periodoTexto(exercicio: number, competencia?: string): string {
    const comp = competencia?.trim();
    if (!comp || comp === "Exercício Anual" || comp === String(exercicio)) {
        return `no exercício financeiro de ${exercicio}`;
    }
    return `na competência "${comp}" do exercício de ${exercicio}`;
}

export const CATALOGO_DECLARACOES_INEXISTENCIA: ModeloDeclaracaoInexistencia[] = [
    {
        slug: "terceirizados",
        aliases: ["terceirizados", "pessoal-terceirizado", "Pessoal Terceirizado", "RH / Terceirizados"],
        titulo: "Pessoal Terceirizado e Prestadores de Mão de Obra",
        tituloCurto: "Terceirizados",
        criterioPntp: "6.6",
        dimensaoPntp: "Recursos Humanos",
        orgaoResponsavelPadrao: "Secretaria Municipal de Administração e Recursos Humanos",
        responsavelNomePadrao: "Departamento de Recursos Humanos",
        responsavelCargoPadrao: "Secretário(a) Municipal de Administração",
        fundamentoLegalPadrao:
            "Art. 8º da Lei nº 12.527/2011 (LAI), Decreto Federal nº 10.540/2020 e Critério 6.6 da Cartilha PNTP 2026.",
        rotaPublica: "/transparencia/terceirizados",
        rotaAdmin: "/admin/terceirizados",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), inscrita no CNPJ sob nº ${MUNICIPIO.cnpj}, por intermédio da ${orgao || "Secretaria Municipal de Administração e Recursos Humanos"}, DECLARA formalmente, para fins de transparência pública ativa e cumprimento ao Critério 6.6 do PNTP 2026, que após verificação dos registros contratuais e funcionais, NÃO POSSUI pessoal terceirizado com alocação contínua de mão de obra vinculado à Administração Pública Municipal ${periodoTexto(exercicio, competencia)}. Caso venham a ser firmadas contratações dessa natureza, a relação nominal integral será publicada imediatamente nesta seção.`,
    },
    {
        slug: "estagiarios",
        aliases: ["estagiarios", "Pessoal Estagiário", "Estagiários"],
        titulo: "Relação Nominal de Estagiários",
        tituloCurto: "Estagiários",
        criterioPntp: "6.5",
        dimensaoPntp: "Recursos Humanos",
        orgaoResponsavelPadrao: "Secretaria Municipal de Administração e Recursos Humanos",
        responsavelNomePadrao: "Departamento de Recursos Humanos",
        responsavelCargoPadrao: "Secretário(a) Municipal de Administração",
        fundamentoLegalPadrao:
            "Lei Federal nº 11.788/2008 (Lei do Estágio), Lei nº 12.527/2011 (LAI) e Critério 6.5 da Cartilha PNTP 2026.",
        rotaPublica: "/transparencia/estagiarios",
        rotaAdmin: "/admin/estagiarios",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), CNPJ nº ${MUNICIPIO.cnpj}, por intermédio da ${orgao || "Secretaria Municipal de Administração e Recursos Humanos"}, DECLARA oficialmente, em atendimento ao Critério 6.5 da Cartilha PNTP 2026, que NÃO MANTÉM estagiários remunerados ou não remunerados vinculados ao quadro do Poder Executivo Municipal ${periodoTexto(exercicio, competencia)}. Havendo admissão de novos termos de compromisso de estágio, os dados nominais e as respectivas bolsas-auxílio serão disponibilizados em tempo real neste portal.`,
    },
    {
        slug: "divida_ativa",
        aliases: ["divida_ativa", "divida-ativa", "Dívida Ativa"],
        titulo: "Inscritos em Dívida Ativa Municipal",
        tituloCurto: "Dívida Ativa",
        criterioPntp: "3.2",
        dimensaoPntp: "Receita",
        orgaoResponsavelPadrao: "Secretaria Municipal de Finanças e Tributação",
        responsavelNomePadrao: "Setor de Tributação e Arrecadação",
        responsavelCargoPadrao: "Secretário(a) Municipal de Finanças e Tributação",
        fundamentoLegalPadrao:
            "Lei nº 5.172/1966 (CTN), Lei Complementar nº 101/2000 (LRF), Lei nº 12.527/2011 (LAI) e Critério 3.2 do PNTP 2026.",
        rotaPublica: "/transparencia/divida-ativa",
        rotaAdmin: "/admin/receitas",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), CNPJ nº ${MUNICIPIO.cnpj}, por meio da ${orgao || "Secretaria Municipal de Finanças e Tributação"}, DECLARA para os devidos fins de controle fiscal e atendimento ao PNTP 2026 que, após consulta aos registros tributários, contábeis e administrativos, NÃO FORAM IDENTIFICADAS pessoas físicas ou jurídicas com débitos inscritos em dívida ativa municipal, tributária ou não tributária, ${periodoTexto(exercicio, competencia)}. Ocorrendo futuras inscrições, a relação pública será atualizada nesta página.`,
    },
    {
        slug: "sancoes_administrativas",
        aliases: [
            "sancoes_administrativas",
            "sancoes-administrativas",
            "sancoes",
            "LICITACAO_SANCAO",
            "CONTRATO_PENALIDADE",
            "Licitações / Contratos",
            "Sanções a Fornecedores",
        ],
        titulo: "Sanções Administrativas Aplicadas a Fornecedores",
        tituloCurto: "Sanções (8.7)",
        criterioPntp: "8.7",
        dimensaoPntp: "Licitações",
        orgaoResponsavelPadrao: "Setor de Licitações, Contratos e Controladoria Geral",
        responsavelNomePadrao: "Comissão Permanente de Contratação / Controladoria",
        responsavelCargoPadrao: "Agente de Contratação / Controlador(a) Geral",
        fundamentoLegalPadrao:
            "Art. 156 da Lei Federal nº 14.133/2021, Lei nº 12.846/2013 e Critério 8.7 da Cartilha PNTP 2026.",
        rotaPublica: "/transparencia/sancoes-administrativas",
        rotaAdmin: "/admin/licitacoes",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), CNPJ nº ${MUNICIPIO.cnpj}, através do ${orgao || "Setor de Licitações, Contratos e Controladoria Geral"}, DECLARA formalmente, nos termos do art. 156 da Lei Federal nº 14.133/2021 e do Critério 8.7 da Cartilha PNTP 2026, que NÃO CONSTA registro de sanções administrativas vigentes (advertência, multa rescisória, impedimento de licitar/contratar ou declaração de inidoneidade) aplicadas a fornecedores, pessoas físicas ou jurídicas licitantes ${periodoTexto(exercicio, competencia)}.`,
    },
    {
        slug: "convenios_concedidos",
        aliases: [
            "convenios_concedidos",
            "convenios",
            "Convênios / Obras / Licitações",
            "Transferências Voluntárias",
            "Transferências Concedidas",
        ],
        titulo: "Transferências Voluntárias Concedidas / Convênios Firmados",
        tituloCurto: "Convênios Concedidos",
        criterioPntp: "5.2",
        dimensaoPntp: "Convênios e Transferências",
        orgaoResponsavelPadrao: "Secretaria Municipal de Finanças e Planejamento",
        responsavelNomePadrao: "Setor de Convênios e Contratos",
        responsavelCargoPadrao: "Secretário(a) Municipal de Finanças",
        fundamentoLegalPadrao:
            "Art. 25 da Lei Complementar nº 101/2000 (LRF), Lei Federal nº 13.019/2014 (MROSC) e Critério 5.2 do PNTP 2026.",
        rotaPublica: "/transparencia/convenios",
        rotaAdmin: "/admin/convenios",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), CNPJ nº ${MUNICIPIO.cnpj}, por meio da ${orgao || "Secretaria Municipal de Finanças e Planejamento"}, DECLARA oficialmente, em cumprimento ao Critério 5.2 da Cartilha PNTP 2026, que NÃO REALIZOU repasses nem firmou termos de fomento, colaboração ou transferências voluntárias de recursos públicos municipais a entidades privadas, OSCs ou outros entes ${periodoTexto(exercicio, competencia)}.`,
    },
    {
        slug: "convenios_recebidos",
        aliases: ["convenios_recebidos", "Transferências Recebidas"],
        titulo: "Transferências Voluntárias e Convênios Recebidos",
        tituloCurto: "Convênios Recebidos",
        criterioPntp: "5.1",
        dimensaoPntp: "Convênios e Transferências",
        orgaoResponsavelPadrao: "Secretaria Municipal de Finanças e Planejamento",
        responsavelNomePadrao: "Setor de Convênios e Captação de Recursos",
        responsavelCargoPadrao: "Secretário(a) Municipal de Finanças",
        fundamentoLegalPadrao:
            "Art. 8º da Lei nº 12.527/2011 (LAI), TransfereGov / SICONV e Critério 5.1 da Cartilha PNTP 2026.",
        rotaPublica: "/transparencia/convenios",
        rotaAdmin: "/admin/convenios",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), CNPJ nº ${MUNICIPIO.cnpj}, através da ${orgao || "Secretaria Municipal de Finanças e Planejamento"}, DECLARA para fins de transparência pública (Critério 5.1 do PNTP 2026) que NÃO RECEBEU transferências voluntárias provenientes de convênios celebrados com a União ou Estado ${periodoTexto(exercicio, competencia)}, além daqueles já regularmente escriturados nas receitas orçamentárias.`,
    },
    {
        slug: "acordos_sem_repasse",
        aliases: ["acordos_sem_repasse", "acordos-firmados", "Acordos de Cooperação"],
        titulo: "Acordos Firmados Sem Transferência de Recursos Financeiros",
        tituloCurto: "Acordos sem Repasse",
        criterioPntp: "5.3",
        dimensaoPntp: "Convênios e Transferências",
        orgaoResponsavelPadrao: "Procuradoria Geral / Gabinete Civil",
        responsavelNomePadrao: "Assessoria Jurídica / Gabinete do Prefeito",
        responsavelCargoPadrao: "Procurador(a) Geral do Município",
        fundamentoLegalPadrao:
            "Lei nº 13.019/2014 (Art. 2º, VIII-A), Lei nº 14.133/2021 e Critério 5.3 da Cartilha PNTP 2026.",
        rotaPublica: "/transparencia/acordos-firmados",
        rotaAdmin: "/admin/convenios",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), CNPJ nº ${MUNICIPIO.cnpj}, por meio da ${orgao || "Procuradoria Geral / Gabinete Civil"}, DECLARA formalmente, para atendimento ao Critério 5.3 do PNTP 2026, que NÃO FIRMOU Acordos de Cooperação Técnica ou instrumentos congêneres sem transferência de recursos financeiros ${periodoTexto(exercicio, competencia)}.`,
    },
    {
        slug: "emendas_parlamentares",
        aliases: ["emendas_parlamentares", "emendas", "Emendas Parlamentares"],
        titulo: "Recebimento e Execução de Emendas Parlamentares",
        tituloCurto: "Emendas Parlamentares",
        criterioPntp: "17.1",
        dimensaoPntp: "Emendas Parlamentares",
        orgaoResponsavelPadrao: "Secretaria Municipal de Finanças e Planejamento",
        responsavelNomePadrao: "Controladoria Geral / Setor de Convênios",
        responsavelCargoPadrao: "Secretário(a) Municipal de Finanças",
        fundamentoLegalPadrao:
            "ADPF 854/STF, EC nº 105/2019, Lei nº 12.527/2011 e Critérios 17.1 e 17.3 da Cartilha PNTP 2026.",
        rotaPublica: "/transparencia/emendas",
        rotaAdmin: "/admin/emendas",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), CNPJ nº ${MUNICIPIO.cnpj}, por intermédio da ${orgao || "Secretaria Municipal de Finanças e Planejamento"}, DECLARA oficialmente, para cumprimento dos Critérios 17.1 e 17.3 do PNTP 2026, que NÃO RECEBEU nem executou recursos provenientes de emendas parlamentares individuais ou de bancada (federais, estaduais ou municipais) sem registro neste portal ${periodoTexto(exercicio, competencia)}.`,
    },
    {
        slug: "emendas_pix",
        aliases: ["emendas_pix", "emendas-pix", "emenda-pix", "Emendas PIX", "Transferências Especiais"],
        titulo: "Emendas PIX (Transferências Especiais)",
        tituloCurto: "Emendas PIX",
        criterioPntp: "17.2",
        dimensaoPntp: "Emendas Parlamentares",
        orgaoResponsavelPadrao: "Secretaria Municipal de Finanças e Tesouraria",
        responsavelNomePadrao: "Controladoria Geral / Tesouraria Municipal",
        responsavelCargoPadrao: "Secretário(a) Municipal de Finanças",
        fundamentoLegalPadrao:
            "Art. 166-A da Constituição Federal (EC 105/2019), ADPF 854/STF e Critério 17.2 da Cartilha PNTP 2026.",
        rotaPublica: "/transparencia/emendas-pix",
        rotaAdmin: "/admin/emendas-pix",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), CNPJ nº ${MUNICIPIO.cnpj}, por meio da ${orgao || "Secretaria Municipal de Finanças e Tesouraria"}, DECLARA formalmente, em observância ao Critério 17.2 do PNTP 2026 e às determinações da ADPF 854/STF, que NÃO RECEBEU Transferências Especiais (Emendas PIX) destinadas diretamente ao Município sem plano de trabalho divulgado ${periodoTexto(exercicio, competencia)}.`,
    },
    {
        slug: "renuncia_receita",
        aliases: [
            "renuncia_receita",
            "renuncias-fiscais",
            "incentivos-culturais",
            "desoneracoes",
            "Renúncia de Receita / Incentivos",
        ],
        titulo: "Renúncias de Receita, Desonerações e Incentivos Fiscais/Culturais",
        tituloCurto: "Renúncias e Incentivos",
        criterioPntp: "16.1",
        dimensaoPntp: "Renúncia de Receita",
        orgaoResponsavelPadrao: "Secretaria Municipal de Finanças / Cultura e Turismo",
        responsavelNomePadrao: "Secretaria de Finanças e Tributação",
        responsavelCargoPadrao: "Secretário(a) Municipal de Finanças",
        fundamentoLegalPadrao:
            "Art. 14 da Lei Complementar nº 101/2000 (LRF), Lei nº 12.527/2011 e Critérios 16.1 e 16.2 do PNTP 2026.",
        rotaPublica: "/transparencia/renuncias-fiscais",
        rotaAdmin: "/admin/incentivos-culturais",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), CNPJ nº ${MUNICIPIO.cnpj}, por intermédio da ${orgao || "Secretaria Municipal de Finanças / Cultura e Turismo"}, DECLARA formalmente, para fins dos Critérios 16.1 e 16.2 da Cartilha PNTP 2026 e do art. 14 da LRF, que NÃO CONCEDEU renúncias de receita tributária (isenções, anistias, remissões ou subsídios fiscais) nem desonerações sem previsão na LDO ${periodoTexto(exercicio, competencia)}.`,
    },
    {
        slug: "obras_paralisadas",
        aliases: ["obras_paralisadas", "obras", "Obras Paralisadas"],
        titulo: "Obras Públicas Paralisadas e Inacabadas",
        tituloCurto: "Obras Paralisadas",
        criterioPntp: "10.2",
        dimensaoPntp: "Obras",
        orgaoResponsavelPadrao: "Secretaria Municipal de Obras, Infraestrutura e Serviços Urbanos",
        responsavelNomePadrao: "Engenharia Municipal / Secretaria de Obras",
        responsavelCargoPadrao: "Secretário(a) Municipal de Obras e Infraestrutura",
        fundamentoLegalPadrao:
            "Art. 45 da Lei Complementar nº 101/2000, Lei nº 14.133/2021 e Critério 10.2 da Cartilha PNTP 2026.",
        rotaPublica: "/transparencia/obras",
        rotaAdmin: "/admin/obras",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), CNPJ nº ${MUNICIPIO.cnpj}, através da ${orgao || "Secretaria Municipal de Obras, Infraestrutura e Serviços Urbanos"}, DECLARA oficialmente, em atendimento ao Critério 10.2 da Cartilha PNTP 2026, que NÃO POSSUI obras públicas paralisadas sem justificativa técnica e providências administrativas publicadas ${periodoTexto(exercicio, competencia)}. Todas as obras contratadas encontram-se regulares ou devidamente detalhadas no módulo de Obras Públicas.`,
    },
    {
        slug: "concursos_selecoes",
        aliases: ["concursos_selecoes", "concursos", "processo-seletivo", "Concursos e Seleções"],
        titulo: "Concursos Públicos e Processos Seletivos em Andamento",
        tituloCurto: "Concursos/Seleções",
        criterioPntp: "6.4",
        dimensaoPntp: "Recursos Humanos",
        orgaoResponsavelPadrao: "Secretaria Municipal de Administração e Recursos Humanos",
        responsavelNomePadrao: "Comissão Organizadora / Secretaria de Administração",
        responsavelCargoPadrao: "Secretário(a) Municipal de Administração",
        fundamentoLegalPadrao:
            "Art. 37, II da Constituição Federal, Lei nº 12.527/2011 e Critério 6.4 da Cartilha PNTP 2026.",
        rotaPublica: "/transparencia/concursos",
        rotaAdmin: "/admin/concursos",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), CNPJ nº ${MUNICIPIO.cnpj}, por meio da ${orgao || "Secretaria Municipal de Administração e Recursos Humanos"}, DECLARA para cumprimento ao Critério 6.4 do PNTP 2026 que NÃO POSSUI concursos públicos ou processos seletivos simplificados novos com inscrições abertas não publicados nesta página ${periodoTexto(exercicio, competencia)}. Todos os editais e convocações vigentes encontram-se disponibilizados no portal.`,
    },
    {
        slug: "diarias_internacionais",
        aliases: [
            "diarias_internacionais",
            "diarias",
            "tabela-diarias",
            "regulamentacao-diarias",
            "Diárias no Exterior",
        ],
        titulo: "Concessão e Tabela de Diárias Internacionais (Exterior)",
        tituloCurto: "Diárias Exterior",
        criterioPntp: "7.2",
        dimensaoPntp: "Diárias",
        orgaoResponsavelPadrao: "Secretaria Municipal de Finanças e Administração",
        responsavelNomePadrao: "Setor de Tesouraria e Controle de Diárias",
        responsavelCargoPadrao: "Secretário(a) Municipal de Finanças",
        fundamentoLegalPadrao:
            "Decreto Municipal Regulamentador de Diárias, Lei nº 12.527/2011 e Critério 7.2 da Cartilha PNTP 2026.",
        rotaPublica: "/transparencia/tabela-diarias",
        rotaAdmin: "/admin/diarias",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), CNPJ nº ${MUNICIPIO.cnpj}, por intermédio da ${orgao || "Secretaria Municipal de Finanças e Administração"}, DECLARA formalmente, para fins do Critério 7.2 do PNTP 2026, que a legislação municipal vigente NÃO REGULAMENTA tabela de valores nem autoriza concessão de diárias para deslocamentos internacionais (ao exterior), bem como NÃO HOUVE pagamento de diárias dessa natureza ${periodoTexto(exercicio, competencia)}.`,
    },
    {
        slug: "fila_creches",
        aliases: ["fila_creches", "creches", "fila-creches", "Fila de Creches"],
        titulo: "Lista de Espera para Vagas em Creches Públicas",
        tituloCurto: "Fila de Creches",
        criterioPntp: "19.2",
        dimensaoPntp: "Educação e Assistência Social",
        orgaoResponsavelPadrao: "Secretaria Municipal de Educação, Cultura e Desporto",
        responsavelNomePadrao: "Coordenação de Educação Infantil",
        responsavelCargoPadrao: "Secretário(a) Municipal de Educação",
        fundamentoLegalPadrao:
            "Art. 5º, § 6º da Lei nº 9.394/1996 (LDB), Lei nº 14.685/2023, ECA e Critério 19.2 do PNTP 2026.",
        rotaPublica: "/transparencia/fila-creches",
        rotaAdmin: "/admin/creches",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), CNPJ nº ${MUNICIPIO.cnpj}, por meio da ${orgao || "Secretaria Municipal de Educação, Cultura e Desporto"}, DECLARA oficialmente, em atendimento à Lei Federal nº 14.685/2023 e ao Critério 19.2 da Cartilha PNTP 2026, que NÃO HÁ fila de espera (demanda reprimida) para matrícula em creches e pré-escolas na rede pública municipal ${periodoTexto(exercicio, competencia)}, estando 100% da demanda solicitada regularmente atendida.`,
    },
    {
        slug: "esic_classificadas",
        aliases: ["esic_classificadas", "sigilo", "com-sigilo", "Documentos Classificados (e-SIC)"],
        titulo: "Rol de Informações Classificadas em Grau de Sigilo (LAI Art. 30)",
        tituloCurto: "Sigilo (LAI 12.8)",
        criterioPntp: "12.8",
        dimensaoPntp: "SIC",
        orgaoResponsavelPadrao: "Controladoria Geral do Município / Serviço de Informação ao Cidadão (e-SIC)",
        responsavelNomePadrao: "Autoridade de Monitoramento da LAI (e-SIC)",
        responsavelCargoPadrao: "Controlador(a) Geral do Município",
        fundamentoLegalPadrao:
            "Arts. 23, 24 e 30, I da Lei Federal nº 12.527/2011 (LAI) e Critério 12.8 da Cartilha PNTP 2026.",
        rotaPublica: "/transparencia/passiva/relatorios/com-sigilo",
        rotaAdmin: "/admin/esic",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), CNPJ nº ${MUNICIPIO.cnpj}, através da ${orgao || "Controladoria Geral do Município / e-SIC"}, DECLARA oficialmente, nos termos do art. 30, inciso I, da Lei Federal nº 12.527/2011 (LAI) e do Critério 12.8 do PNTP 2026, que NÃO POSSUI informações ou documentos classificados nos graus de sigilo reservado, secreto ou ultrassecreto ${periodoTexto(exercicio, competencia)}.`,
    },
    {
        slug: "esic_desclassificadas",
        aliases: ["esic_desclassificadas", "sem-sigilo", "Documentos Desclassificados (e-SIC)"],
        titulo: "Rol de Documentos Desclassificados nos Últimos 12 Meses",
        tituloCurto: "Desclassificadas (12.9)",
        criterioPntp: "12.9",
        dimensaoPntp: "SIC",
        orgaoResponsavelPadrao: "Controladoria Geral do Município / Serviço de Informação ao Cidadão (e-SIC)",
        responsavelNomePadrao: "Autoridade de Monitoramento da LAI (e-SIC)",
        responsavelCargoPadrao: "Controlador(a) Geral do Município",
        fundamentoLegalPadrao:
            "Art. 30, inciso II da Lei Federal nº 12.527/2011 (LAI) e Critério 12.9 da Cartilha PNTP 2026.",
        rotaPublica: "/transparencia/passiva/relatorios/sem-sigilo",
        rotaAdmin: "/admin/esic",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), CNPJ nº ${MUNICIPIO.cnpj}, através da ${orgao || "Controladoria Geral do Município / e-SIC"}, DECLARA oficialmente, nos termos do art. 30, inciso II, da Lei nº 12.527/2011 (LAI) e do Critério 12.9 do PNTP 2026, que NÃO HOUVE documentos ou informações desclassificadas de grau de sigilo nos últimos 12 meses (${periodoTexto(exercicio, competencia)}), uma vez que não existiram documentos sob classificação sigilosa.`,
    },
    {
        slug: "julgamento_contas",
        aliases: ["julgamento_contas", "julgamento-contas", "parecer-tce", "Julgamento de Contas"],
        titulo: "Apreciação / Julgamento das Contas pelo Poder Legislativo",
        tituloCurto: "Julgamento Contas",
        criterioPntp: "11.4",
        dimensaoPntp: "Planejamento e Prestação de Contas",
        orgaoResponsavelPadrao: "Controladoria Geral / Secretaria Municipal de Finanças",
        responsavelNomePadrao: "Controladoria Geral do Município",
        responsavelCargoPadrao: "Controlador(a) Geral do Município",
        fundamentoLegalPadrao:
            "Art. 31, § 2º da Constituição Federal, Art. 48 da LRF e Critério 11.4 da Cartilha PNTP 2026.",
        rotaPublica: "/transparencia/julgamento-contas",
        rotaAdmin: "/admin/relatorios-fiscais",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), CNPJ nº ${MUNICIPIO.cnpj}, por meio da ${orgao || "Controladoria Geral / Secretaria Municipal de Finanças"}, DECLARA formalmente, para fins do Critério 11.4 do PNTP 2026, que até a presente data NÃO HOUVE conclusão nem publicação de decreto legislativo de julgamento referente às contas anuais do exercício indicado (${periodoTexto(exercicio, competencia)}) pela Câmara Municipal, aguardando emissão de parecer prévio pelo TCE/RN ou pauta legislativa.`,
    },
    {
        slug: "geral",
        aliases: ["geral", "outros"],
        titulo: "Declaração Geral de Inexistência / Não Aplicabilidade",
        tituloCurto: "Outro Item PNTP",
        criterioPntp: "",
        dimensaoPntp: "Informações Gerais",
        orgaoResponsavelPadrao: "Controladoria Geral do Município",
        responsavelNomePadrao: "Controladoria Geral do Município",
        responsavelCargoPadrao: "Controlador(a) Geral / Secretário(a) Responsável",
        fundamentoLegalPadrao: FUNDAMENTO_GERAL,
        rotaPublica: "/transparencia",
        rotaAdmin: "/admin/declaracoes",
        gerarTextoPadrao: (exercicio, competencia, orgao) =>
            `A ${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}), CNPJ nº ${MUNICIPIO.cnpj}, por intermédio da ${orgao || "Controladoria Geral do Município"}, DECLARA formalmente, para fins de transparência pública ativa e cumprimento da Cartilha PNTP 2026, que NÃO HOUVE ocorrência de fatos geradores nem registros aplicáveis para este tópico ${periodoTexto(exercicio, competencia)}.`,
    },
];

export function obterModeloDeclaracao(slugOuCriterio?: string | null): ModeloDeclaracaoInexistencia {
    const fallback = CATALOGO_DECLARACOES_INEXISTENCIA[CATALOGO_DECLARACOES_INEXISTENCIA.length - 1];
    if (!slugOuCriterio) return fallback;

    const norm = slugOuCriterio.trim().toLowerCase();
    const match = CATALOGO_DECLARACOES_INEXISTENCIA.find(
        (m) =>
            m.slug.toLowerCase() === norm ||
            (m.criterioPntp && m.criterioPntp.toLowerCase() === norm) ||
            m.aliases.some((a) => a.toLowerCase() === norm)
    );
    return match || fallback;
}

export function resolverFiltroModuloDeclaracao(modulo?: string | null, criterioPntp?: string | null) {
    const modelo = obterModeloDeclaracao(modulo || criterioPntp);
    const aliases = new Set<string>();

    if (modulo) {
        aliases.add(modulo.trim());
    }
    if (modelo.slug !== "geral") {
        aliases.add(modelo.slug);
        modelo.aliases.forEach((a) => aliases.add(a));
    }

    const criterioEfetivo = (criterioPntp || modelo.criterioPntp || "").trim();

    return {
        modelo,
        aliases: Array.from(aliases),
        criterioEfetivo,
    };
}
