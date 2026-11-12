export interface ValorDiariaItem {
    cargo: string;
    estadual: number;      // Natal, Mossoró ou Caicó
    interior: number;      // Demais Cidades do RN
    outrosEstados: number; // Outros Estados da Federação
    brasilia: number;      // Brasília / DF
    internacional: string; // "Não Regulamentado"
}

export interface HistoricoTabelaDiaria {
    ano: number;
    vigente: boolean;
    normaLegal: string;
    ementaNorma: string;
    dataPublicacaoNorma: string;
    linkNorma: string;
    valores: ValorDiariaItem[];
    declaracaoNaoRegulamentacao: {
        titulo: string;
        protocolo: string;
        orgaoEmissor: string;
        fundamentoLegal: string;
        texto: string;
        declaracaoNaoOcorrencia: string;
        responsavel: string;
        cargoResponsavel: string;
        dataEmissao: string;
        status: "Ativo" | "Homologado";
    };
}

export const HISTORICO_DIARIAS: HistoricoTabelaDiaria[] = [
    {
        ano: 2026,
        vigente: true,
        normaLegal: "Decreto Municipal nº 004/2026 c/c Lei Municipal nº 315/2021",
        ementaNorma: "Atualiza os valores das diárias devidas aos servidores públicos e agentes políticos municipais no exercício de 2026.",
        dataPublicacaoNorma: "02/01/2026",
        linkNorma: "/transparencia/legislacao?q=diarias&ano=2026",
        valores: [
            { cargo: "Prefeito Municipal", estadual: 400.0, interior: 350.0, outrosEstados: 500.0, brasilia: 1000.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Vice-Prefeito Municipal", estadual: 350.0, interior: 300.0, outrosEstados: 450.0, brasilia: 800.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Procurador Geral do Município", estadual: 350.0, interior: 250.0, outrosEstados: 450.0, brasilia: 800.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Controlador Geral do Município", estadual: 350.0, interior: 250.0, outrosEstados: 450.0, brasilia: 800.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Secretários Municipais", estadual: 350.0, interior: 250.0, outrosEstados: 450.0, brasilia: 800.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Conselheiros Tutelares", estadual: 150.0, interior: 100.0, outrosEstados: 250.0, brasilia: 500.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Superior / Assessores", estadual: 200.0, interior: 150.0, outrosEstados: 300.0, brasilia: 600.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Médio / Técnico", estadual: 150.0, interior: 100.0, outrosEstados: 220.0, brasilia: 450.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Operacional / Motoristas", estadual: 130.0, interior: 90.0, outrosEstados: 200.0, brasilia: 400.0, internacional: "Sem Regulamentação Formal" },
        ],
        declaracaoNaoRegulamentacao: {
            titulo: "Declaração de Inexistência de Regulamentação e Não Ocorrência de Diárias Internacionais (2026)",
            protocolo: "DEC-CGM-2026-DIAR-001",
            orgaoEmissor: "Controladoria Geral do Município e Gabinete do Prefeito",
            fundamentoLegal: "Art. 37 da Constituição Federal de 1988, Lei Federal nº 12.527/2011 (LAI) e Critério 7.2 do PNTP 2026",
            texto: "A Prefeitura Municipal de Lajes Pintadas/RN, por meio de sua Controladoria Geral e Secretaria de Administração, DECLARA formalmente para os devidos fins de transparência pública e cumprimento das exigências da Cartilha PNTP 2026 (Critério 7.2), que NÃO HÁ LEGISLAÇÃO OU REGULAMENTAÇÃO NORMATIVA MUNICIPAL que preveja a fixação ou concessão de diárias com destino internacional (fora do território nacional) no exercício de 2026.",
            declaracaoNaoOcorrencia: "DECLARA-SE igualmente que até a presente data NÃO HOUVE CONCESSÃO, empenho, liquidação ou pagamento de qualquer valor a título de diária para fora do país a agentes políticos, servidores efetivos, comissionados ou colaboradores eventuais no exercício financeiro de 2026.",
            responsavel: "Francisco Adriano Bezerra da Silva",
            cargoResponsavel: "Controlador Geral do Município / Encarregado DPO",
            dataEmissao: "02/01/2026",
            status: "Homologado"
        }
    },
    {
        ano: 2025,
        vigente: false,
        normaLegal: "Decreto Municipal nº 002/2025 c/c Lei Municipal nº 315/2021",
        ementaNorma: "Fixa os valores das diárias e indenizações de viagens a serviço do Município para o exercício de 2025.",
        dataPublicacaoNorma: "03/01/2025",
        linkNorma: "/transparencia/legislacao?q=diarias&ano=2025",
        valores: [
            { cargo: "Prefeito Municipal", estadual: 400.0, interior: 350.0, outrosEstados: 500.0, brasilia: 1000.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Vice-Prefeito Municipal", estadual: 350.0, interior: 300.0, outrosEstados: 450.0, brasilia: 800.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Procurador Geral do Município", estadual: 350.0, interior: 250.0, outrosEstados: 450.0, brasilia: 800.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Controlador Geral do Município", estadual: 350.0, interior: 250.0, outrosEstados: 450.0, brasilia: 800.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Secretários Municipais", estadual: 350.0, interior: 250.0, outrosEstados: 450.0, brasilia: 800.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Conselheiros Tutelares", estadual: 150.0, interior: 100.0, outrosEstados: 250.0, brasilia: 500.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Superior / Assessores", estadual: 200.0, interior: 150.0, outrosEstados: 300.0, brasilia: 600.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Médio / Técnico", estadual: 150.0, interior: 100.0, outrosEstados: 220.0, brasilia: 450.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Operacional / Motoristas", estadual: 130.0, interior: 90.0, outrosEstados: 200.0, brasilia: 400.0, internacional: "Sem Regulamentação Formal" },
        ],
        declaracaoNaoRegulamentacao: {
            titulo: "Declaração de Inexistência de Regulamentação e Não Ocorrência de Diárias Internacionais (2025)",
            protocolo: "DEC-CGM-2025-DIAR-001",
            orgaoEmissor: "Controladoria Geral do Município e Gabinete do Prefeito",
            fundamentoLegal: "Art. 37 da Constituição Federal de 1988, Lei Federal nº 12.527/2011 (LAI) e Critério 7.2 do PNTP",
            texto: "A Prefeitura Municipal de Lajes Pintadas/RN, por meio de sua Controladoria Geral e Secretaria de Administração, DECLARA formalmente que no exercício de 2025 NÃO EXISTIU REGULAMENTAÇÃO ESPECÍFICA para fixação ou concessão de diárias com destino internacional no âmbito municipal.",
            declaracaoNaoOcorrencia: "DECLARA-SE formalmente que no exercício financeiro de 2025 NÃO HOUVE QUALQUER CONCESSÃO ou pagamento de diária internacional a membros da administração municipal.",
            responsavel: "Francisco Adriano Bezerra da Silva",
            cargoResponsavel: "Controlador Geral do Município",
            dataEmissao: "03/01/2025",
            status: "Homologado"
        }
    },
    {
        ano: 2024,
        vigente: false,
        normaLegal: "Decreto Municipal nº 005/2024 c/c Lei Municipal nº 315/2021",
        ementaNorma: "Fixa os valores das diárias dos servidores e agentes públicos da Prefeitura Municipal para o exercício de 2024.",
        dataPublicacaoNorma: "02/01/2024",
        linkNorma: "/transparencia/legislacao?q=diarias&ano=2024",
        valores: [
            { cargo: "Prefeito Municipal", estadual: 400.0, interior: 350.0, outrosEstados: 500.0, brasilia: 1000.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Vice-Prefeito Municipal", estadual: 350.0, interior: 300.0, outrosEstados: 450.0, brasilia: 800.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Procurador Geral do Município", estadual: 350.0, interior: 250.0, outrosEstados: 450.0, brasilia: 800.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Controlador Geral do Município", estadual: 350.0, interior: 250.0, outrosEstados: 450.0, brasilia: 800.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Secretários Municipais", estadual: 350.0, interior: 250.0, outrosEstados: 450.0, brasilia: 800.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Conselheiros Tutelares", estadual: 150.0, interior: 100.0, outrosEstados: 250.0, brasilia: 500.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Superior / Assessores", estadual: 200.0, interior: 150.0, outrosEstados: 300.0, brasilia: 600.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Médio / Técnico", estadual: 150.0, interior: 100.0, outrosEstados: 220.0, brasilia: 450.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Operacional / Motoristas", estadual: 130.0, interior: 90.0, outrosEstados: 200.0, brasilia: 400.0, internacional: "Sem Regulamentação Formal" },
        ],
        declaracaoNaoRegulamentacao: {
            titulo: "Declaração de Inexistência de Regulamentação e Não Ocorrência de Diárias Internacionais (2024)",
            protocolo: "DEC-CGM-2024-DIAR-001",
            orgaoEmissor: "Controladoria Geral do Município e Gabinete do Prefeito",
            fundamentoLegal: "Art. 37 da Constituição Federal de 1988, Lei Federal nº 12.527/2011 (LAI) e Critério 7.2 do PNTP",
            texto: "A Prefeitura Municipal de Lajes Pintadas/RN DECLARA formalmente que no exercício de 2024 não possuiu regulamentação normativa para concessão de diárias no exterior.",
            declaracaoNaoOcorrencia: "DECLARA-SE que durante o exercício de 2024 não houve pagamento de diárias para viagens fora do território brasileiro.",
            responsavel: "Francisco Adriano Bezerra da Silva",
            cargoResponsavel: "Controlador Geral do Município",
            dataEmissao: "02/01/2024",
            status: "Homologado"
        }
    },
    {
        ano: 2023,
        vigente: false,
        normaLegal: "Decreto Municipal nº 008/2023 c/c Lei Municipal nº 315/2021",
        ementaNorma: "Dispõe sobre o valor das diárias operacionais e administrativas no município de Lajes Pintadas/RN para 2023.",
        dataPublicacaoNorma: "03/01/2023",
        linkNorma: "/transparencia/legislacao?q=diarias&ano=2023",
        valores: [
            { cargo: "Prefeito Municipal", estadual: 380.0, interior: 320.0, outrosEstados: 480.0, brasilia: 900.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Vice-Prefeito Municipal", estadual: 320.0, interior: 280.0, outrosEstados: 420.0, brasilia: 750.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Procurador Geral do Município", estadual: 320.0, interior: 230.0, outrosEstados: 420.0, brasilia: 750.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Controlador Geral do Município", estadual: 320.0, interior: 230.0, outrosEstados: 420.0, brasilia: 750.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Secretários Municipais", estadual: 320.0, interior: 230.0, outrosEstados: 420.0, brasilia: 750.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Conselheiros Tutelares", estadual: 140.0, interior: 90.0, outrosEstados: 220.0, brasilia: 450.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Superior / Assessores", estadual: 180.0, interior: 130.0, outrosEstados: 280.0, brasilia: 550.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Médio / Técnico", estadual: 130.0, interior: 90.0, outrosEstados: 200.0, brasilia: 400.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Operacional / Motoristas", estadual: 120.0, interior: 80.0, outrosEstados: 180.0, brasilia: 350.0, internacional: "Sem Regulamentação Formal" },
        ],
        declaracaoNaoRegulamentacao: {
            titulo: "Declaração de Inexistência de Regulamentação e Não Ocorrência de Diárias Internacionais (2023)",
            protocolo: "DEC-CGM-2023-DIAR-001",
            orgaoEmissor: "Controladoria Geral do Município e Gabinete do Prefeito",
            fundamentoLegal: "Art. 37 da Constituição Federal de 1988, Lei Federal nº 12.527/2011 (LAI) e Critério 7.2 do PNTP",
            texto: "A Prefeitura Municipal de Lajes Pintadas/RN DECLARA a inexistência de previsão legal ou regulamentar para pagamento de diárias internacionais no exercício de 2023.",
            declaracaoNaoOcorrencia: "DECLARA-SE que no exercício de 2023 nenhuma diária internacional foi solicitada, concedida ou liquidada.",
            responsavel: "Francisco Adriano Bezerra da Silva",
            cargoResponsavel: "Controlador Geral do Município",
            dataEmissao: "03/01/2023",
            status: "Homologado"
        }
    },
    {
        ano: 2022,
        vigente: false,
        normaLegal: "Decreto Municipal nº 006/2022 c/c Lei Municipal nº 315/2021",
        ementaNorma: "Regulamenta os valores de diárias no exercício de 2022 em consonância com a Lei Municipal nº 315/2021.",
        dataPublicacaoNorma: "04/01/2022",
        linkNorma: "/transparencia/legislacao?q=diarias&ano=2022",
        valores: [
            { cargo: "Prefeito Municipal", estadual: 350.0, interior: 300.0, outrosEstados: 450.0, brasilia: 850.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Vice-Prefeito Municipal", estadual: 300.0, interior: 250.0, outrosEstados: 400.0, brasilia: 700.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Procurador Geral do Município", estadual: 300.0, interior: 220.0, outrosEstados: 400.0, brasilia: 700.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Controlador Geral do Município", estadual: 300.0, interior: 220.0, outrosEstados: 400.0, brasilia: 700.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Secretários Municipais", estadual: 300.0, interior: 220.0, outrosEstados: 400.0, brasilia: 700.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Conselheiros Tutelares", estadual: 130.0, interior: 80.0, outrosEstados: 200.0, brasilia: 400.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Superior / Assessores", estadual: 170.0, interior: 120.0, outrosEstados: 260.0, brasilia: 500.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Médio / Técnico", estadual: 120.0, interior: 80.0, outrosEstados: 180.0, brasilia: 380.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Operacional / Motoristas", estadual: 110.0, interior: 70.0, outrosEstados: 160.0, brasilia: 320.0, internacional: "Sem Regulamentação Formal" },
        ],
        declaracaoNaoRegulamentacao: {
            titulo: "Declaração de Inexistência de Regulamentação e Não Ocorrência de Diárias Internacionais (2022)",
            protocolo: "DEC-CGM-2022-DIAR-001",
            orgaoEmissor: "Controladoria Geral do Município e Gabinete do Prefeito",
            fundamentoLegal: "Art. 37 da Constituição Federal de 1988 e Lei Federal nº 12.527/2011 (LAI)",
            texto: "A Prefeitura Municipal de Lajes Pintadas/RN DECLARA formalmente a ausência de ato normativo para diárias internacionais no exercício de 2022.",
            declaracaoNaoOcorrencia: "DECLARA-SE a não concessão de diárias com destino ao exterior durante o ano financeiro de 2022.",
            responsavel: "Francisco Adriano Bezerra da Silva",
            cargoResponsavel: "Controlador Geral do Município",
            dataEmissao: "04/01/2022",
            status: "Homologado"
        }
    },
    {
        ano: 2021,
        vigente: false,
        normaLegal: "Lei Municipal nº 315/2021 c/c Decreto Municipal nº 012/2021",
        ementaNorma: "Institui e regulamenta a concessão e a tabela de valores de diárias no âmbito do Município de Lajes Pintadas/RN.",
        dataPublicacaoNorma: "15/06/2021",
        linkNorma: "/transparencia/legislacao?q=diarias&ano=2021",
        valores: [
            { cargo: "Prefeito Municipal", estadual: 350.0, interior: 300.0, outrosEstados: 450.0, brasilia: 850.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Vice-Prefeito Municipal", estadual: 300.0, interior: 250.0, outrosEstados: 400.0, brasilia: 700.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Procurador Geral do Município", estadual: 300.0, interior: 220.0, outrosEstados: 400.0, brasilia: 700.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Controlador Geral do Município", estadual: 300.0, interior: 220.0, outrosEstados: 400.0, brasilia: 700.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Secretários Municipais", estadual: 300.0, interior: 220.0, outrosEstados: 400.0, brasilia: 700.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Conselheiros Tutelares", estadual: 130.0, interior: 80.0, outrosEstados: 200.0, brasilia: 400.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Superior / Assessores", estadual: 170.0, interior: 120.0, outrosEstados: 260.0, brasilia: 500.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Médio / Técnico", estadual: 120.0, interior: 80.0, outrosEstados: 180.0, brasilia: 380.0, internacional: "Sem Regulamentação Formal" },
            { cargo: "Servidores de Nível Operacional / Motoristas", estadual: 110.0, interior: 70.0, outrosEstados: 160.0, brasilia: 320.0, internacional: "Sem Regulamentação Formal" },
        ],
        declaracaoNaoRegulamentacao: {
            titulo: "Declaração de Inexistência de Regulamentação e Não Ocorrência de Diárias Internacionais (2021)",
            protocolo: "DEC-CGM-2021-DIAR-001",
            orgaoEmissor: "Controladoria Geral do Município e Gabinete do Prefeito",
            fundamentoLegal: "Art. 37 da Constituição Federal de 1988 e Lei Federal nº 12.527/2011 (LAI)",
            texto: "A Prefeitura Municipal de Lajes Pintadas/RN DECLARA para os devidos fins legais que no exercício de 2021 não existiu regulamentação normativa para concessão de diárias com destino internacional.",
            declaracaoNaoOcorrencia: "DECLARA-SE formalmente a não ocorrência de pagamentos de diárias internacionais no exercício financeiro de 2021.",
            responsavel: "Francisco Adriano Bezerra da Silva",
            cargoResponsavel: "Controlador Geral do Município",
            dataEmissao: "15/06/2021",
            status: "Homologado"
        }
    }
];

