import { MUNICIPIO } from "@/config/municipio";

export const CONFIG_CHAVE_ORIENTACOES = "assistencia_farmaceutica_orientacoes";
export const CONFIG_GRUPO_SAUDE = "saude";

export const COMPONENTES_SUS = [
    "Básico (CBAF)",
    "Especializado (CEAF)",
    "Estratégico (CESAF)",
] as const;

export type ComponenteSUS = (typeof COMPONENTES_SUS)[number];

export const CATEGORIAS_MEDICAMENTO_SUGESTOES = [
    "Analgésico / Antitérmico",
    "Anti-inflamatório / Corticoide",
    "Anti-hipertensivo",
    "Antidiabético",
    "Antibiótico / Antimicrobiano",
    "Antialérgico / Respiratório",
    "Cardiovascular / Dislipidemia",
    "Gastroprotetor",
    "Saúde Mental / Psicotrópico",
    "Vitamina / Suplemento",
    "Alto Custo / Especializado (CEAF)",
    "Estratégico / Programas de Saúde (CESAF)",
    "Outro",
] as const;

export const UNIDADES_MEDIDA_SUGESTOES = [
    "Comprimido",
    "Cápsula",
    "Frasco",
    "Ampola",
    "Bisnaga",
    "Seringa",
    "Aerossol",
    "Sachê",
    "Caixa",
    "Unidade",
] as const;

export interface EtapaObtencaoItem {
    id: string;
    titulo: string;
    descricao: string;
}

export interface DocumentoExigidoItem {
    id: string;
    titulo: string;
    descricao: string;
    obrigatorio: boolean;
}

export interface BlocoComponenteOrientacao {
    titulo: string;
    subtitulo: string;
    descricaoGeral: string;
    custoCidadao: string;
    locaisDispensacao: string[];
    enderecoPrincipal: string;
    horarioAtendimento: string;
    prazoEstimado: string;
    contatoTelefone: string;
    contatoEmail: string;
    etapas: EtapaObtencaoItem[];
    documentosExigidos: DocumentoExigidoItem[];
    observacoesImportantes: string[];
    linkExternoLabel?: string;
    linkExternoUrl?: string;
}

export interface BlocoEstrategicoOrientacao {
    titulo: string;
    resumo: string;
    exemplosProgramas: string[];
    ondeRetirar: string;
}

export interface CanaisApoioOrientacao {
    telefoneOuvidoria: string;
    emailOuvidoria: string;
    enderecoSms: string;
    horarioSms: string;
    linkRenameOficial: string;
    linkPcdtOficial: string;
    fundamentacaoLegal: string;
}

export interface OrientacoesMedicamentosSUS {
    cbaf: BlocoComponenteOrientacao;
    ceaf: BlocoComponenteOrientacao;
    cesaf: BlocoEstrategicoOrientacao;
    canaisApoio: CanaisApoioOrientacao;
    atualizadoEm?: string;
    atualizadoPor?: string;
}

export interface MedicamentoBaseSeed {
    nome: string;
    principioAtivo: string;
    apresentacao: string;
    unidadeMedida: string;
    categoria: string;
    tipoComponente: ComponenteSUS;
    unidadeSaude: string;
    quantidadeEstoque: number;
    estoqueMinimo: number;
    status: "disponivel" | "indisponivel";
    observacao: string;
}

export const DEFAULT_ORIENTACOES_MEDICAMENTOS: OrientacoesMedicamentosSUS = {
    cbaf: {
        titulo: "Medicamentos Básicos — Atenção Primária (CBAF / REMUME)",
        subtitulo: "Componente Básico da Assistência Farmacêutica (CBAF)",
        descricaoGeral: `Guia oficial para retirada gratuita dos medicamentos da Relação Municipal de Medicamentos Essenciais (REMUME) nas Unidades Básicas de Saúde (UBS) e Farmácia Básica Central de ${MUNICIPIO.nome}/${MUNICIPIO.uf}.`,
        custoCidadao: "100% Gratuito pelo SUS",
        locaisDispensacao: [
            "Unidades Básicas de Saúde (UBS) do Município",
            "Central de Abastecimento Farmacêutico (CAF) / Farmácia Básica Municipal",
        ],
        enderecoPrincipal: `${MUNICIPIO.endereco}, ${MUNICIPIO.nome}/${MUNICIPIO.uf} — CEP ${MUNICIPIO.cep}`,
        horarioAtendimento: "Segunda a Sexta-feira, das 07:00 às 13:00 (ou conforme escala da UBS)",
        prazoEstimado: "Entrega imediata na farmácia da unidade, mediante disponibilidade em estoque",
        contatoTelefone: MUNICIPIO.telefone,
        contatoEmail: MUNICIPIO.email,
        etapas: [
            {
                id: "cbaf-1",
                titulo: "Atendimento e Prescrição",
                descricao: "Realizar consulta na rede SUS (médico, odontólogo ou enfermeiro conforme protocolo clínico) para emissão da receita dentro do prazo legal.",
            },
            {
                id: "cbaf-2",
                titulo: "Conferência na Lista REMUME",
                descricao: "Consultar neste portal se o medicamento consta na lista oficial do município e em qual unidade está disponível.",
            },
            {
                id: "cbaf-3",
                titulo: "Comparecimento com Documentação",
                descricao: "Apresentar-se na Farmácia Básica Municipal (CAF) ou na UBS de referência portando os documentos pessoais e a receita médica.",
            },
            {
                id: "cbaf-4",
                titulo: "Dispensação e Orientação Farmacêutica",
                descricao: "A equipe farmacêutica valida a prescrição, registra a entrega e fornece orientações sobre posologia e conservação.",
            },
        ],
        documentosExigidos: [
            {
                id: "cbaf-doc-1",
                titulo: "Receita Médica dentro da validade (2 vias)",
                descricao: "Receita comum válida por até 180 dias; antimicrobianos válidos por 10 dias; medicamentos sujeitos a controle especial válidos por 30 dias com Notificação de Receita.",
                obrigatorio: true,
            },
            {
                id: "cbaf-doc-2",
                titulo: "Cartão Nacional de Saúde (Cartão do SUS)",
                descricao: "Apresentação física ou digital pelo aplicativo Meu SUS Digital.",
                obrigatorio: true,
            },
            {
                id: "cbaf-doc-3",
                titulo: "Documento de Identificação Oficial com Foto e CPF",
                descricao: "RG, CNH, Carteira de Trabalho ou documento equivalente do paciente (e do responsável, caso retirado por terceiro).",
                obrigatorio: true,
            },
            {
                id: "cbaf-doc-4",
                titulo: "Comprovante de Residência Atualizado",
                descricao: `Recomendado para vinculação cadastral na rede municipal de ${MUNICIPIO.nome}/${MUNICIPIO.uf}.`,
                obrigatorio: false,
            },
        ],
        observacoesImportantes: [
            "Antibióticos e medicamentos controlados (Portaria SVS/MS nº 344/1998) exigem retenção de uma via da receita no ato da entrega.",
            "Para menores de idade ou pessoas impossibilitadas, a retirada pode ser realizada por responsável legal ou cuidador devidamente identificado.",
            "Em caso de desabastecimento momentâneo, o cidadão pode registrar manifestação na Ouvidoria da Saúde para acompanhamento da previsão de reposição.",
        ],
        linkExternoLabel: "Consultar RENAME Oficial (Ministério da Saúde)",
        linkExternoUrl: "https://www.gov.br/saude/pt-br/composicao/sectics/rename",
    },
    ceaf: {
        titulo: "Medicamentos de Alto Custo — Componente Especializado (CEAF)",
        subtitulo: "Componente Especializado da Assistência Farmacêutica (CEAF)",
        descricaoGeral:
            "Os medicamentos de Alto Custo contemplam doenças crônicas ou raras previstas nos Protocolos Clínicos e Diretrizes Terapêuticas (PCDT) do Ministério da Saúde. O fornecimento ocorre em articulação com a Central Estadual de Assistência Farmacêutica (UNICAT / SESAP-RN), com suporte e protocolo inicial pela Secretaria Municipal de Saúde.",
        custoCidadao: "100% Gratuito mediante aprovação de processo (LME / PCDT)",
        locaisDispensacao: [
            "Protocolo e Orientação Inicial: Secretaria Municipal de Saúde (Farmácia / Regulação)",
            "Avaliação Técnica e Dispensação Especializada: UNICAT / SESAP-RN (Polo Regional)",
        ],
        enderecoPrincipal: `Secretaria Municipal de Saúde — Rua João Francisco Borges, Centro, ${MUNICIPIO.nome}/${MUNICIPIO.uf}`,
        horarioAtendimento: "Segunda a Sexta-feira, das 07:00 às 13:00 (acolhimento e encaminhamento de processos CEAF)",
        prazoEstimado: "Análise estadual após protocolo completo; retirada mensal/trimestral após autorização",
        contatoTelefone: MUNICIPIO.telefone,
        contatoEmail: MUNICIPIO.email,
        etapas: [
            {
                id: "ceaf-1",
                titulo: "Avaliação Especializada e Preenchimento do LME",
                descricao: "O médico prescreve o medicamento informando o CID-10 da doença e preenche integralmente o Laudo de Solicitação, Avaliação e Autorização de Medicamento (LME).",
            },
            {
                id: "ceaf-2",
                titulo: "Reunião de Exames e Termo (PCDT)",
                descricao: "Providenciar os exames laboratoriais, de imagem ou laudos clínicos específicos exigidos pelo Protocolo Clínico (PCDT) e assinar o Termo de Esclarecimento e Responsabilidade (TER).",
            },
            {
                id: "ceaf-3",
                titulo: "Conferência e Protocolo na SMS / UNICAT",
                descricao: "Apresentar a documentação completa na Secretaria Municipal de Saúde para conferência e encaminhamento à UNICAT/SESAP-RN (ou protocolar diretamente no polo regional).",
            },
            {
                id: "ceaf-4",
                titulo: "Avaliação Técnica e Autorização",
                descricao: "Os analistas estaduais verificam a conformidade com o PCDT. Sendo deferido, o medicamento é programado para liberação.",
            },
            {
                id: "ceaf-5",
                titulo: "Retirada Mensal e Renovação do LME",
                descricao: "Retirar o medicamento periodicamente conforme agendamento, lembrando de renovar o LME e a receita médica a cada 90 dias (ou prazo do PCDT) antes do vencimento.",
            },
        ],
        documentosExigidos: [
            {
                id: "ceaf-doc-1",
                titulo: "LME — Laudo de Solicitação, Avaliação e Autorização de Medicamento",
                descricao: "Preenchido, datado, carimbado e assinado pelo médico solicitante (com CID-10 e justificativa clínica). Validade padrão de 90 dias.",
                obrigatorio: true,
            },
            {
                id: "ceaf-doc-2",
                titulo: "Receita Médica Atualizada (em 2 vias)",
                descricao: "Mesma data ou compatível com o LME, contendo nome genérico (DCB), dosagem, posologia e duração do tratamento.",
                obrigatorio: true,
            },
            {
                id: "ceaf-doc-3",
                titulo: "Termo de Esclarecimento e Responsabilidade (TER)",
                descricao: "Assinado pelo paciente (ou responsável legal) e pelo médico prescritor, quando exigido pelo PCDT da doença.",
                obrigatorio: true,
            },
            {
                id: "ceaf-doc-4",
                titulo: "Exames e Relatórios Médicos Comprobatórios (PCDT)",
                descricao: "Cópias dos exames laboratoriais, laudos de imagem ou biópsias exigidos pelo protocolo específico do Ministério da Saúde.",
                obrigatorio: true,
            },
            {
                id: "ceaf-doc-5",
                titulo: "Documento de Identificação (RG/CNH), CPF, Cartão SUS e Comprovante de Residência",
                descricao: "Cópias legíveis de todos os documentos pessoais do paciente (no caso de menores ou incapazes, incluir documentos do responsável).",
                obrigatorio: true,
            },
            {
                id: "ceaf-doc-6",
                titulo: "Procuração ou Declaração Autorizadora (para Terceiros)",
                descricao: "Obrigatório quando o medicamento for retirado por familiar, cuidador ou portador, acompanhado de cópia do RG do representante.",
                obrigatorio: false,
            },
        ],
        observacoesImportantes: [
            "Caso o processo caia em 'pendência técnica', a equipe da Secretaria de Saúde entra em contato para complementação de exame ou ajuste do LME.",
            "A renovação periódica da LME deve ser providenciada com antecedência de 20 a 30 dias do término do ciclo autorizado para não haver interrupção do tratamento.",
            "Medicamentos não contemplados na RENAME / CEAF exigem avaliação administrativa específica ou orientação pela assistência social e jurídica municipal.",
        ],
        linkExternoLabel: "Protocolos Clínicos (PCDT) — Ministério da Saúde",
        linkExternoUrl: "https://www.gov.br/saude/pt-br/assuntos/protocolos-clinicos-e-diretrizes-terapeuticas-pcdt",
    },
    cesaf: {
        titulo: "Componente Estratégico da Assistência Farmacêutica (CESAF)",
        resumo: "Destinado ao tratamento e controle de doenças transmissíveis e programas estratégicos financiados diretamente pelo Ministério da Saúde com repasse estadual e dispensação municipal programada.",
        exemplosProgramas: [
            "Tuberculose e Hanseníase",
            "HIV/AIDS, Hepatites Virais e Infecções Sexualmente Transmissíveis (IST)",
            "Endemias focais, Influenza (Oseltamivir) e Vacinas / Soros",
            "Deficiências nutricionais prioritárias e tabagismo",
        ],
        ondeRetirar: "Dispensação direta nas UBS / Vigilância Epidemiológica Municipal mediante notificação e protocolo clínico do programa.",
    },
    canaisApoio: {
        telefoneOuvidoria: MUNICIPIO.telefone,
        emailOuvidoria: MUNICIPIO.email,
        enderecoSms: `Secretaria Municipal de Saúde — ${MUNICIPIO.endereco}, ${MUNICIPIO.nome}/${MUNICIPIO.uf}`,
        horarioSms: `Segunda a Sexta-feira, ${MUNICIPIO.horario}`,
        linkRenameOficial: "https://www.gov.br/saude/pt-br/composicao/sectics/rename",
        linkPcdtOficial: "https://www.gov.br/saude/pt-br/assuntos/protocolos-clinicos-e-diretrizes-terapeuticas-pcdt",
        fundamentacaoLegal:
            "Transparência Ativa de Assistência Farmacêutica em conformidade com a Lei Federal nº 12.527/2011 (LAI), Lei nº 8.080/1990 (SUS), Portaria de Consolidação GM/MS nº 2/2017 e Diretrizes PNTP / ATRICON.",
    },
};

export const CATALOGO_BASE_SUS: MedicamentoBaseSeed[] = [
    // Componente Básico (CBAF — REMUME)
    {
        nome: "Paracetamol 500mg",
        principioAtivo: "Paracetamol",
        apresentacao: "Comprimido 500mg",
        unidadeMedida: "Comprimido",
        categoria: "Analgésico / Antitérmico",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal e UBS",
        quantidadeEstoque: 0,
        estoqueMinimo: 200,
        status: "disponivel",
        observacao: "Fornecimento gratuito nas UBS e Farmácia Básica mediante receita médica.",
    },
    {
        nome: "Dipirona Sódica 500mg",
        principioAtivo: "Dipirona Monoidratada",
        apresentacao: "Comprimido 500mg",
        unidadeMedida: "Comprimido",
        categoria: "Analgésico / Antitérmico",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal e UBS",
        quantidadeEstoque: 0,
        estoqueMinimo: 200,
        status: "disponivel",
        observacao: "Fornecimento na atenção básica mediante prescrição.",
    },
    {
        nome: "Ibuprofeno 600mg",
        principioAtivo: "Ibuprofeno",
        apresentacao: "Comprimido 600mg",
        unidadeMedida: "Comprimido",
        categoria: "Anti-inflamatório / Corticoide",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal e UBS",
        quantidadeEstoque: 0,
        estoqueMinimo: 150,
        status: "disponivel",
        observacao: "Anti-inflamatório não esteroidal da lista REMUME.",
    },
    {
        nome: "Prednisona 20mg",
        principioAtivo: "Prednisona",
        apresentacao: "Comprimido 20mg",
        unidadeMedida: "Comprimido",
        categoria: "Anti-inflamatório / Corticoide",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal",
        quantidadeEstoque: 0,
        estoqueMinimo: 100,
        status: "disponivel",
        observacao: "Uso conforme prescrição e duração indicada pelo médico.",
    },
    {
        nome: "Losartana Potássica 50mg",
        principioAtivo: "Losartana Potássica",
        apresentacao: "Comprimido 50mg",
        unidadeMedida: "Comprimido",
        categoria: "Anti-hipertensivo",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal e UBS",
        quantidadeEstoque: 0,
        estoqueMinimo: 500,
        status: "disponivel",
        observacao: "Uso contínuo para hipertensão arterial. Receita válida por até 180 dias.",
    },
    {
        nome: "Hidroclorotiazida 25mg",
        principioAtivo: "Hidroclorotiazida",
        apresentacao: "Comprimido 25mg",
        unidadeMedida: "Comprimido",
        categoria: "Anti-hipertensivo",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal e UBS",
        quantidadeEstoque: 0,
        estoqueMinimo: 400,
        status: "disponivel",
        observacao: "Diurético para controle de hipertensão arterial.",
    },
    {
        nome: "Maleato de Enalapril 10mg",
        principioAtivo: "Maleato de Enalapril",
        apresentacao: "Comprimido 10mg",
        unidadeMedida: "Comprimido",
        categoria: "Anti-hipertensivo",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal e UBS",
        quantidadeEstoque: 0,
        estoqueMinimo: 300,
        status: "disponivel",
        observacao: "Uso contínuo mediante receita médica da atenção primária.",
    },
    {
        nome: "Besilato de Anlodipino 5mg",
        principioAtivo: "Besilato de Anlodipino",
        apresentacao: "Comprimido 5mg",
        unidadeMedida: "Comprimido",
        categoria: "Anti-hipertensivo",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal e UBS",
        quantidadeEstoque: 0,
        estoqueMinimo: 300,
        status: "disponivel",
        observacao: "Bloqueador de canais de cálcio para controle pressórico.",
    },
    {
        nome: "Cloridrato de Metformina 850mg",
        principioAtivo: "Cloridrato de Metformina",
        apresentacao: "Comprimido 850mg",
        unidadeMedida: "Comprimido",
        categoria: "Antidiabético",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal e UBS",
        quantidadeEstoque: 0,
        estoqueMinimo: 400,
        status: "disponivel",
        observacao: "Controle de diabetes mellitus tipo 2. Uso contínuo.",
    },
    {
        nome: "Glibenclamida 5mg",
        principioAtivo: "Glibenclamida",
        apresentacao: "Comprimido 5mg",
        unidadeMedida: "Comprimido",
        categoria: "Antidiabético",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal e UBS",
        quantidadeEstoque: 0,
        estoqueMinimo: 250,
        status: "disponivel",
        observacao: "Hipoglicemiante oral da rede básica.",
    },
    {
        nome: "Insulina Humana NPH 100 UI/mL",
        principioAtivo: "Insulina Humana NPH",
        apresentacao: "Suspensão injetável 100 UI/mL — Frasco/Caneta 10mL",
        unidadeMedida: "Frasco",
        categoria: "Antidiabético",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal (Rede de Frio)",
        quantidadeEstoque: 0,
        estoqueMinimo: 30,
        status: "disponivel",
        observacao: "Retirada com receita médica e acompanhamento da UBS (armazenamento refrigerado).",
    },
    {
        nome: "Insulina Humana Regular 100 UI/mL",
        principioAtivo: "Insulina Humana Regular",
        apresentacao: "Solução injetável 100 UI/mL — Frasco 10mL",
        unidadeMedida: "Frasco",
        categoria: "Antidiabético",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal (Rede de Frio)",
        quantidadeEstoque: 0,
        estoqueMinimo: 20,
        status: "disponivel",
        observacao: "Retirada com receita médica e cadastro no programa de diabetes.",
    },
    {
        nome: "Amoxicilina 500mg",
        principioAtivo: "Amoxicilina Tri-hidratada",
        apresentacao: "Cápsula 500mg",
        unidadeMedida: "Cápsula",
        categoria: "Antibiótico / Antimicrobiano",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal e UBS",
        quantidadeEstoque: 0,
        estoqueMinimo: 200,
        status: "disponivel",
        observacao: "Exige receita antimicrobiana em 2 vias válida por 10 dias (retenção da 2ª via).",
    },
    {
        nome: "Azitromicina 500mg",
        principioAtivo: "Azitromicina Di-hidratada",
        apresentacao: "Comprimido revestido 500mg",
        unidadeMedida: "Comprimido",
        categoria: "Antibiótico / Antimicrobiano",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal",
        quantidadeEstoque: 0,
        estoqueMinimo: 120,
        status: "disponivel",
        observacao: "Antimicrobiano: receita em 2 vias válida por 10 dias corridos.",
    },
    {
        nome: "Cefalexina 500mg",
        principioAtivo: "Cefalexina Monoidratada",
        apresentacao: "Cápsula ou Comprimido 500mg",
        unidadeMedida: "Cápsula",
        categoria: "Antibiótico / Antimicrobiano",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal",
        quantidadeEstoque: 0,
        estoqueMinimo: 150,
        status: "disponivel",
        observacao: "Antimicrobiano: retenção obrigatória da 2ª via da receita (validade 10 dias).",
    },
    {
        nome: "Omeprazol 20mg",
        principioAtivo: "Omeprazol",
        apresentacao: "Cápsula gastro-resistente 20mg",
        unidadeMedida: "Cápsula",
        categoria: "Gastroprotetor",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal e UBS",
        quantidadeEstoque: 0,
        estoqueMinimo: 300,
        status: "disponivel",
        observacao: "Inibidor da bomba de prótons mediante receita médica.",
    },
    {
        nome: "Sinvastatina 20mg",
        principioAtivo: "Sinvastatina",
        apresentacao: "Comprimido revestido 20mg",
        unidadeMedida: "Comprimido",
        categoria: "Cardiovascular / Dislipidemia",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal e UBS",
        quantidadeEstoque: 0,
        estoqueMinimo: 300,
        status: "disponivel",
        observacao: "Controle de dislipidemias (colesterol) na atenção básica.",
    },
    {
        nome: "Ácido Acetilsalicílico (AAS) 100mg",
        principioAtivo: "Ácido Acetilsalicílico",
        apresentacao: "Comprimido 100mg",
        unidadeMedida: "Comprimido",
        categoria: "Cardiovascular / Dislipidemia",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal e UBS",
        quantidadeEstoque: 0,
        estoqueMinimo: 400,
        status: "disponivel",
        observacao: "Antiagregante plaquetário de uso contínuo cardiovascular.",
    },
    {
        nome: "Sulfato de Salbutamol 100mcg",
        principioAtivo: "Sulfato de Salbutamol",
        apresentacao: "Aerossol oral 100mcg/dose — Frasco 200 doses",
        unidadeMedida: "Frasco",
        categoria: "Antialérgico / Respiratório",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal",
        quantidadeEstoque: 0,
        estoqueMinimo: 30,
        status: "disponivel",
        observacao: "Broncodilatador para crises asmáticas e DPOC mediante receita.",
    },
    {
        nome: "Loratadina 10mg",
        principioAtivo: "Loratadina",
        apresentacao: "Comprimido 10mg",
        unidadeMedida: "Comprimido",
        categoria: "Antialérgico / Respiratório",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal e UBS",
        quantidadeEstoque: 0,
        estoqueMinimo: 150,
        status: "disponivel",
        observacao: "Anti-histamínico da REMUME.",
    },
    {
        nome: "Sulfato Ferroso 40mg Fe",
        principioAtivo: "Sulfato Ferroso Heptaidratado",
        apresentacao: "Comprimido revestido 40mg Fe elementar",
        unidadeMedida: "Comprimido",
        categoria: "Vitamina / Suplemento",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal e UBS",
        quantidadeEstoque: 0,
        estoqueMinimo: 250,
        status: "disponivel",
        observacao: "Suplementação de ferro e programa pré-natal / infantil.",
    },
    {
        nome: "Ácido Fólico 5mg",
        principioAtivo: "Ácido Fólico",
        apresentacao: "Comprimido 5mg",
        unidadeMedida: "Comprimido",
        categoria: "Vitamina / Suplemento",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal e UBS",
        quantidadeEstoque: 0,
        estoqueMinimo: 200,
        status: "disponivel",
        observacao: "Suplementação vitamínica essencial e acompanhamento pré-natal.",
    },
    {
        nome: "Cloridrato de Fluoxetina 20mg",
        principioAtivo: "Cloridrato de Fluoxetina",
        apresentacao: "Cápsula ou Comprimido 20mg",
        unidadeMedida: "Cápsula",
        categoria: "Saúde Mental / Psicotrópico",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal (Controle Especial)",
        quantidadeEstoque: 0,
        estoqueMinimo: 200,
        status: "disponivel",
        observacao: "Controle Especial (Lista C1): exige Receita de Controle Especial em 2 vias válida por 30 dias.",
    },
    {
        nome: "Diazepam 10mg",
        principioAtivo: "Diazepam",
        apresentacao: "Comprimido 10mg",
        unidadeMedida: "Comprimido",
        categoria: "Saúde Mental / Psicotrópico",
        tipoComponente: "Básico (CBAF)",
        unidadeSaude: "CAF / Farmácia Básica Municipal (Controle Especial)",
        quantidadeEstoque: 0,
        estoqueMinimo: 100,
        status: "disponivel",
        observacao: "Psicotrópico (Lista B1): exige Notificação de Receita Azul tipo B válida por 30 dias.",
    },

    // Componente Especializado (CEAF — Alto Custo)
    {
        nome: "Atorvastatina Cálcica 20mg",
        principioAtivo: "Atorvastatina Cálcica",
        apresentacao: "Comprimido revestido 20mg",
        unidadeMedida: "Comprimido",
        categoria: "Alto Custo / Especializado (CEAF)",
        tipoComponente: "Especializado (CEAF)",
        unidadeSaude: "SMS (Protocolo LME) / UNICAT SESAP-RN",
        quantidadeEstoque: 0,
        estoqueMinimo: 0,
        status: "disponivel",
        observacao: "Medicamento do Componente Especializado (CEAF). Solicitação via LME + perfil lipídico conforme PCDT de Dislipidemia.",
    },
    {
        nome: "Budesonida + Fumarato de Formoterol 400/12mcg",
        principioAtivo: "Budesonida + Fumarato de Formoterol",
        apresentacao: "Cápsula para inalação oral 400mcg + 12mcg",
        unidadeMedida: "Caixa",
        categoria: "Alto Custo / Especializado (CEAF)",
        tipoComponente: "Especializado (CEAF)",
        unidadeSaude: "SMS (Protocolo LME) / UNICAT SESAP-RN",
        quantidadeEstoque: 0,
        estoqueMinimo: 0,
        status: "disponivel",
        observacao: "Alto Custo (CEAF). Exige LME + espirometria/laudo médico + TER conforme PCDT de Asma/DPOC.",
    },
    {
        nome: "Insulina Análoga de Ação Prolongada (Glargina) 100 UI/mL",
        principioAtivo: "Insulina Glargina",
        apresentacao: "Caneta aplicadora preenchida 3mL",
        unidadeMedida: "Unidade",
        categoria: "Alto Custo / Especializado (CEAF)",
        tipoComponente: "Especializado (CEAF)",
        unidadeSaude: "SMS (Protocolo LME) / UNICAT SESAP-RN",
        quantidadeEstoque: 0,
        estoqueMinimo: 0,
        status: "disponivel",
        observacao: "Alto Custo (CEAF). Exige LME + exames de HbA1c/glicemia + relatório de endocrinologista/médico conforme PCDT DM1/DM2.",
    },
    {
        nome: "Hemifumarato de Quetiapina 100mg",
        principioAtivo: "Hemifumarato de Quetiapina",
        apresentacao: "Comprimido revestido 100mg",
        unidadeMedida: "Comprimido",
        categoria: "Alto Custo / Especializado (CEAF)",
        tipoComponente: "Especializado (CEAF)",
        unidadeSaude: "SMS (Protocolo LME) / UNICAT SESAP-RN",
        quantidadeEstoque: 0,
        estoqueMinimo: 0,
        status: "disponivel",
        observacao: "Alto Custo (CEAF) — Saúde Mental. Solicitação via LME + Receita C1 + laudo psiquiátrico (PCDT Esquizofrenia / Transtorno Bipolar).",
    },
    {
        nome: "Mesalazina 800mg",
        principioAtivo: "Mesalazina",
        apresentacao: "Comprimido de liberação entérica 800mg",
        unidadeMedida: "Comprimido",
        categoria: "Alto Custo / Especializado (CEAF)",
        tipoComponente: "Especializado (CEAF)",
        unidadeSaude: "SMS (Protocolo LME) / UNICAT SESAP-RN",
        quantidadeEstoque: 0,
        estoqueMinimo: 0,
        status: "disponivel",
        observacao: "Alto Custo (CEAF). Exige LME + colonoscopia/biópsia + TER conforme PCDT de Retocolite Ulcerativa / Doença de Crohn.",
    },
    {
        nome: "Adalimumabe 40mg (Biológico)",
        principioAtivo: "Adalimumabe",
        apresentacao: "Solução injetável 40mg/0,4mL — Seringa/Caneta",
        unidadeMedida: "Seringa",
        categoria: "Alto Custo / Especializado (CEAF)",
        tipoComponente: "Especializado (CEAF)",
        unidadeSaude: "UNICAT / SESAP-RN (Encaminhamento SMS)",
        quantidadeEstoque: 0,
        estoqueMinimo: 0,
        status: "disponivel",
        observacao: "Imunobiológico de Alto Custo (Grupo 1A CEAF). Requer LME, exames laboratoriais, sorologias, PPD/RX tórax e TER conforme PCDT.",
    },

    // Componente Estratégico (CESAF)
    {
        nome: "Rifampicina + Isoniazida (RH 150/75mg)",
        principioAtivo: "Rifampicina + Isoniazida",
        apresentacao: "Comprimido revestido combinado 150mg + 75mg",
        unidadeMedida: "Comprimido",
        categoria: "Estratégico / Programas de Saúde (CESAF)",
        tipoComponente: "Estratégico (CESAF)",
        unidadeSaude: "UBS / Vigilância Epidemiológica Municipal",
        quantidadeEstoque: 0,
        estoqueMinimo: 60,
        status: "disponivel",
        observacao: "Programa Nacional de Controle da Tuberculose (CESAF). Dispensação acompanhada na UBS com notificação SINAN.",
    },
    {
        nome: "Fosfato de Oseltamivir 75mg",
        principioAtivo: "Fosfato de Oseltamivir",
        apresentacao: "Cápsula dura 75mg",
        unidadeMedida: "Cápsula",
        categoria: "Estratégico / Programas de Saúde (CESAF)",
        tipoComponente: "Estratégico (CESAF)",
        unidadeSaude: "CAF / Vigilância Epidemiológica Municipal",
        quantidadeEstoque: 0,
        estoqueMinimo: 20,
        status: "disponivel",
        observacao: "Antiviral estratégico do SUS para Síndrome Gripal / SRAG mediante receituário médico e notificação.",
    },
];

export function buildMedicamentoData(body: Record<string, unknown>, isCreate: boolean) {
    const qtyRaw = body.quantidadeEstoque;
    const minRaw = body.estoqueMinimo;
    const qtyParsed = qtyRaw !== undefined && qtyRaw !== null && qtyRaw !== "" ? parseInt(String(qtyRaw), 10) : isCreate ? 0 : undefined;
    const minParsed = minRaw !== undefined && minRaw !== null && minRaw !== "" ? parseInt(String(minRaw), 10) : isCreate ? 10 : undefined;

    const qty = qtyParsed !== undefined && !Number.isNaN(qtyParsed) ? Math.max(0, qtyParsed) : undefined;
    const min = minParsed !== undefined && !Number.isNaN(minParsed) ? Math.max(0, minParsed) : undefined;

    return {
        ...(body.nome !== undefined ? { nome: String(body.nome).trim() } : {}),
        ...(body.principioAtivo !== undefined ? { principioAtivo: body.principioAtivo ? String(body.principioAtivo).trim() : null } : {}),
        ...(body.apresentacao !== undefined
            ? { apresentacao: body.apresentacao ? String(body.apresentacao).trim() : "Comprimido / Frasco" }
            : {}),
        ...(body.unidadeMedida !== undefined
            ? { unidadeMedida: body.unidadeMedida ? String(body.unidadeMedida).trim() : "Unidade" }
            : {}),
        ...(body.categoria !== undefined ? { categoria: String(body.categoria).trim() } : {}),
        ...(body.tipoComponente !== undefined
            ? { tipoComponente: body.tipoComponente ? String(body.tipoComponente).trim() : "Básico (CBAF)" }
            : {}),
        ...(qty !== undefined ? { quantidadeEstoque: qty } : {}),
        ...(min !== undefined ? { estoqueMinimo: min } : {}),
        ...(body.unidadeSaude !== undefined
            ? { unidadeSaude: body.unidadeSaude ? String(body.unidadeSaude).trim() : "CAF / Farmácia Básica Municipal" }
            : {}),
        ...(body.loteValidade !== undefined ? { loteValidade: body.loteValidade ? String(body.loteValidade).trim() : null } : {}),
        ...(body.status !== undefined ? { status: String(body.status).trim() } : {}),
        ...(body.observacao !== undefined ? { observacao: body.observacao ? String(body.observacao).trim() : null } : {}),
        ...(body.situacaoPublicacao !== undefined
            ? { situacaoPublicacao: String(body.situacaoPublicacao).trim() }
            : isCreate
              ? { situacaoPublicacao: "publicado" }
              : {}),
        ...(body.ativo !== undefined ? { ativo: Boolean(body.ativo) } : {}),
        ...(body.dataReferenciaEstoque
            ? { dataReferenciaEstoque: new Date(String(body.dataReferenciaEstoque)) }
            : !isCreate
              ? { dataReferenciaEstoque: new Date() }
              : {}),
    };
}

function sanitizeSafeUrl(value: unknown, fallback = ""): string {
    if (typeof value !== "string") return fallback;
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("/") || /^https?:\/\//i.test(trimmed)) {
        return trimmed.slice(0, 500);
    }
    return fallback;
}

function sanitizeString(value: unknown, fallback: string, maxLen = 1200): string {
    if (typeof value !== "string") return fallback;
    const trimmed = value.trim();
    return trimmed ? trimmed.slice(0, maxLen) : fallback;
}

function sanitizeStringArray(value: unknown, fallback: string[], maxItems = 16): string[] {
    if (!Array.isArray(value)) return fallback;
    const cleaned = value
        .map((item) => (typeof item === "string" ? item.trim().slice(0, 600) : ""))
        .filter(Boolean)
        .slice(0, maxItems);
    return cleaned.length > 0 ? cleaned : fallback;
}

function sanitizeEtapas(value: unknown, fallback: EtapaObtencaoItem[]): EtapaObtencaoItem[] {
    if (!Array.isArray(value)) return fallback;
    const cleaned = value
        .map((item, idx) => {
            if (!item || typeof item !== "object") return null;
            const obj = item as Record<string, unknown>;
            const titulo = sanitizeString(obj.titulo, "", 160);
            const descricao = sanitizeString(obj.descricao, "", 600);
            if (!titulo && !descricao) return null;
            return {
                id: sanitizeString(obj.id, `etapa-${idx + 1}`, 60),
                titulo: titulo || `Etapa ${idx + 1}`,
                descricao,
            };
        })
        .filter((item): item is EtapaObtencaoItem => Boolean(item))
        .slice(0, 12);
    return cleaned.length > 0 ? cleaned : fallback;
}

function sanitizeDocumentos(value: unknown, fallback: DocumentoExigidoItem[]): DocumentoExigidoItem[] {
    if (!Array.isArray(value)) return fallback;
    const cleaned = value
        .map((item, idx) => {
            if (!item || typeof item !== "object") return null;
            const obj = item as Record<string, unknown>;
            const titulo = sanitizeString(obj.titulo, "", 200);
            const descricao = sanitizeString(obj.descricao, "", 600);
            if (!titulo && !descricao) return null;
            return {
                id: sanitizeString(obj.id, `doc-${idx + 1}`, 60),
                titulo: titulo || `Documento ${idx + 1}`,
                descricao,
                obrigatorio: obj.obrigatorio !== false,
            };
        })
        .filter((item): item is DocumentoExigidoItem => Boolean(item))
        .slice(0, 20);
    return cleaned.length > 0 ? cleaned : fallback;
}

function sanitizeBlocoComponente(
    raw: unknown,
    fallback: BlocoComponenteOrientacao
): BlocoComponenteOrientacao {
    if (!raw || typeof raw !== "object") return fallback;
    const obj = raw as Record<string, unknown>;
    return {
        titulo: sanitizeString(obj.titulo, fallback.titulo, 200),
        subtitulo: sanitizeString(obj.subtitulo, fallback.subtitulo, 200),
        descricaoGeral: sanitizeString(obj.descricaoGeral, fallback.descricaoGeral, 1500),
        custoCidadao: sanitizeString(obj.custoCidadao, fallback.custoCidadao, 180),
        locaisDispensacao: sanitizeStringArray(obj.locaisDispensacao, fallback.locaisDispensacao, 10),
        enderecoPrincipal: sanitizeString(obj.enderecoPrincipal, fallback.enderecoPrincipal, 300),
        horarioAtendimento: sanitizeString(obj.horarioAtendimento, fallback.horarioAtendimento, 240),
        prazoEstimado: sanitizeString(obj.prazoEstimado, fallback.prazoEstimado, 300),
        contatoTelefone: sanitizeString(obj.contatoTelefone, fallback.contatoTelefone, 120),
        contatoEmail: sanitizeString(obj.contatoEmail, fallback.contatoEmail, 160),
        etapas: sanitizeEtapas(obj.etapas, fallback.etapas),
        documentosExigidos: sanitizeDocumentos(obj.documentosExigidos, fallback.documentosExigidos),
        observacoesImportantes: sanitizeStringArray(
            obj.observacoesImportantes,
            fallback.observacoesImportantes,
            12
        ),
        linkExternoLabel: sanitizeString(obj.linkExternoLabel, fallback.linkExternoLabel || "", 180),
        linkExternoUrl: sanitizeSafeUrl(obj.linkExternoUrl, fallback.linkExternoUrl || ""),
    };
}

export function sanitizeOrientacoesMedicamentos(raw: unknown): OrientacoesMedicamentosSUS {
    if (!raw || typeof raw !== "object") {
        return DEFAULT_ORIENTACOES_MEDICAMENTOS;
    }
    const obj = raw as Record<string, unknown>;
    const cesafRaw = (obj.cesaf && typeof obj.cesaf === "object" ? obj.cesaf : {}) as Record<string, unknown>;
    const apoioRaw = (obj.canaisApoio && typeof obj.canaisApoio === "object" ? obj.canaisApoio : {}) as Record<
        string,
        unknown
    >;

    return {
        cbaf: sanitizeBlocoComponente(obj.cbaf, DEFAULT_ORIENTACOES_MEDICAMENTOS.cbaf),
        ceaf: sanitizeBlocoComponente(obj.ceaf, DEFAULT_ORIENTACOES_MEDICAMENTOS.ceaf),
        cesaf: {
            titulo: sanitizeString(cesafRaw.titulo, DEFAULT_ORIENTACOES_MEDICAMENTOS.cesaf.titulo, 200),
            resumo: sanitizeString(cesafRaw.resumo, DEFAULT_ORIENTACOES_MEDICAMENTOS.cesaf.resumo, 1200),
            exemplosProgramas: sanitizeStringArray(
                cesafRaw.exemplosProgramas,
                DEFAULT_ORIENTACOES_MEDICAMENTOS.cesaf.exemplosProgramas,
                12
            ),
            ondeRetirar: sanitizeString(
                cesafRaw.ondeRetirar,
                DEFAULT_ORIENTACOES_MEDICAMENTOS.cesaf.ondeRetirar,
                400
            ),
        },
        canaisApoio: {
            telefoneOuvidoria: sanitizeString(
                apoioRaw.telefoneOuvidoria,
                DEFAULT_ORIENTACOES_MEDICAMENTOS.canaisApoio.telefoneOuvidoria,
                120
            ),
            emailOuvidoria: sanitizeString(
                apoioRaw.emailOuvidoria,
                DEFAULT_ORIENTACOES_MEDICAMENTOS.canaisApoio.emailOuvidoria,
                160
            ),
            enderecoSms: sanitizeString(
                apoioRaw.enderecoSms,
                DEFAULT_ORIENTACOES_MEDICAMENTOS.canaisApoio.enderecoSms,
                300
            ),
            horarioSms: sanitizeString(
                apoioRaw.horarioSms,
                DEFAULT_ORIENTACOES_MEDICAMENTOS.canaisApoio.horarioSms,
                200
            ),
            linkRenameOficial: sanitizeSafeUrl(
                apoioRaw.linkRenameOficial,
                DEFAULT_ORIENTACOES_MEDICAMENTOS.canaisApoio.linkRenameOficial
            ),
            linkPcdtOficial: sanitizeSafeUrl(
                apoioRaw.linkPcdtOficial,
                DEFAULT_ORIENTACOES_MEDICAMENTOS.canaisApoio.linkPcdtOficial
            ),
            fundamentacaoLegal: sanitizeString(
                apoioRaw.fundamentacaoLegal,
                DEFAULT_ORIENTACOES_MEDICAMENTOS.canaisApoio.fundamentacaoLegal,
                800
            ),
        },
        atualizadoEm: typeof obj.atualizadoEm === "string" ? obj.atualizadoEm : undefined,
        atualizadoPor: typeof obj.atualizadoPor === "string" ? obj.atualizadoPor : undefined,
    };
}
