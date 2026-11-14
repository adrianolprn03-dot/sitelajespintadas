export interface ProfissionalEscala {
    nome: string;
    cargo: string;
    especialidade: string;
    registroProfissional: string;
    diasHorarios: string;
}

export interface UnidadeComDetalhes {
    id: string;
    nome: string;
    tipo: string;
    subtipo?: string | null;
    cnes?: string | null;
    descricao: string;
    endereco: string;
    telefone?: string | null;
    horario: string;
    servicos?: string | null;
    especialidades: string[];
    equipe: ProfissionalEscala[];
    mapa?: string | null;
    ativa: boolean;
    criadoEm?: string | Date;
    atualizadoEm?: string | Date;
}

export function normalizeText(text: string | null | undefined): string {
    return (text || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

export function isSaudeTipo(tipo: string | null | undefined): boolean {
    const t = normalizeText(tipo);
    return t === "saude" || t.includes("saude") || t.includes("hospital") || t.includes("ubs") || t.includes("ums");
}

export function isEducacaoTipo(tipo: string | null | undefined): boolean {
    const t = normalizeText(tipo);
    return t === "educacao" || t.includes("educa") || t.includes("escola") || t.includes("creche") || t.includes("ensino");
}

export function parseEspecialidades(raw: unknown): string[] {
    if (Array.isArray(raw)) {
        return raw.map((item) => String(item || "").trim()).filter(Boolean);
    }
    if (typeof raw === "string") {
        const trimmed = raw.trim();
        if (!trimmed) return [];
        if (trimmed.startsWith("[")) {
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) {
                    return parsed.map((item) => String(item || "").trim()).filter(Boolean);
                }
            } catch {
                // fallback para lista separada por vírgula ou quebra de linha
            }
        }
        return trimmed
            .split(/[,;\n]/)
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return [];
}

export function serializeEspecialidades(raw: unknown): string {
    return JSON.stringify(parseEspecialidades(raw));
}

export function parseEquipe(raw: unknown): ProfissionalEscala[] {
    let list: unknown[] = [];
    if (Array.isArray(raw)) {
        list = raw;
    } else if (typeof raw === "string") {
        const trimmed = raw.trim();
        if (!trimmed) return [];
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                list = parsed;
            }
        } catch {
            return [];
        }
    }

    return list
        .map((item) => {
            if (!item || typeof item !== "object") return null;
            const rec = item as Record<string, unknown>;
            const nome = String(rec.nome || "").trim();
            if (!nome) return null;
            return {
                nome,
                cargo: String(rec.cargo || "").trim(),
                especialidade: String(rec.especialidade || "").trim(),
                registroProfissional: String(rec.registroProfissional || "").trim(),
                diasHorarios: String(rec.diasHorarios || "").trim(),
            };
        })
        .filter((item): item is ProfissionalEscala => item !== null);
}

export function serializeEquipe(raw: unknown): string {
    return JSON.stringify(parseEquipe(raw));
}

export function normalizeUnidadeRecord(raw: Record<string, any>): UnidadeComDetalhes {
    return {
        id: String(raw.id),
        nome: String(raw.nome || ""),
        tipo: String(raw.tipo || ""),
        subtipo: raw.subtipo ?? null,
        cnes: raw.cnes ?? null,
        descricao: String(raw.descricao || ""),
        endereco: String(raw.endereco || ""),
        telefone: raw.telefone ?? null,
        horario: String(raw.horario || ""),
        servicos: raw.servicos ?? null,
        especialidades: parseEspecialidades(raw.especialidades),
        equipe: parseEquipe(raw.equipe),
        mapa: raw.mapa ?? null,
        ativa: raw.ativa !== undefined ? Boolean(raw.ativa) : true,
        criadoEm: raw.criadoEm,
        atualizadoEm: raw.atualizadoEm,
    };
}

export interface UnidadeSaudeSeedTemplate {
    matchTerms: string[];
    fallbackNome: string;
    tipo: string;
    subtipo: string;
    descricao: string;
    endereco: string;
    telefone: string;
    horario: string;
    servicos: string;
    especialidades: string[];
    equipe: ProfissionalEscala[];
}

/**
 * Dados base de serviços, especialidades e escalas das unidades de saúde municipais
 * utilizados para restauração inicial no banco de dados e apoio no Admin (PNTP 18.2).
 */
export const DADOS_PADRAO_UNIDADES_SAUDE: UnidadeSaudeSeedTemplate[] = [
    {
        matchTerms: ["joao olinto", "olinto oliveira", "sede urbana"],
        fallbackNome: "UBS JOÃO OLINTO OLIVEIRA",
        tipo: "Saúde",
        subtipo: "Unidade Básica de Saúde (ESF)",
        descricao:
            "Unidade Básica de Saúde de referência da área urbana para atenção primária da Estratégia Saúde da Família (ESF).",
        endereco: "Rua Miriam Cavalcante Lima, Centro, Lajes Pintadas/RN",
        telefone: "(84) 98796-9881 (smslajespintadasrn@outlook.com)",
        horario: "Segunda a Sexta: 07h - 17h",
        servicos:
            "Consultas Médicas da Atenção Básica, Acompanhamento Pré-Natal, Puericultura, Vacinação de Rotina SUS, Consultório Odontológico, Citopatológico, Curativos, Testes Rápidos e Dispensação Farmacêutica Básica.",
        especialidades: [
            "Medicina da Família e Comunidade",
            "Enfermagem da Família",
            "Odontologia / Saúde Bucal",
            "Imunização e Vacinas",
        ],
        equipe: [
            {
                nome: "Dr. André Filipe Santos",
                cargo: "Médico de Família",
                especialidade: "Atenção Básica e Clínica Geral",
                registroProfissional: "CRM/RN 10.155",
                diasHorarios: "Segunda a Quinta: 07h30 às 16h30",
            },
            {
                nome: "Enfª. Amanda Karoline Silva",
                cargo: "Enfermeira ESF",
                especialidade: "Saúde Coletiva e Pré-Natal",
                registroProfissional: "COREN/RN 412.980",
                diasHorarios: "Segunda a Sexta: 07h às 17h",
            },
            {
                nome: "Dra. Camila Soares Ribeiro",
                cargo: "Cirurgiã-Dentista",
                especialidade: "Odontologia Básica",
                registroProfissional: "CRO/RN 4.890",
                diasHorarios: "Segunda a Quarta: 08h às 16h",
            },
            {
                nome: "Aux. Luciana Pereira Dantas",
                cargo: "Técnica em Saúde Bucal",
                especialidade: "Apoio Odontológico",
                registroProfissional: "CRO/RN 1.230",
                diasHorarios: "Segunda a Sexta: 07h às 13h",
            },
        ],
    },
    {
        matchTerms: ["boqueirao"],
        fallbackNome: "UBS COMUNIDADE BOQUEIRÃO",
        tipo: "Saúde",
        subtipo: "Unidade Básica de Saúde Rural (ESF)",
        descricao:
            "Ponto de atenção à saúde rural para atendimento descentralizado aos moradores do polo Boqueirão e adjacências.",
        endereco: "Zona Rural Boqueirão, Lajes Pintadas/RN",
        telefone: "(84) 98796-9881 (smslajespintadasrn@outlook.com)",
        horario: "Terça a Quinta: 07h - 17h",
        servicos:
            "Atendimento Médico Periódico, Visitas Domiciliares, Vacinação, Aferição de Pressão e Glicemia, Distribuição de Medicamentos e Coleta Preventiva.",
        especialidades: [
            "Clínica Geral Rural",
            "Enfermagem e Cuidados Básicos",
            "Acompanhamento Hiperdia",
        ],
        equipe: [
            {
                nome: "Dr. Paulo Henrique Gomes",
                cargo: "Médico Itinerante ESF",
                especialidade: "Medicina Geral",
                registroProfissional: "CRM/RN 11.204",
                diasHorarios: "Terças e Quintas: 08h às 16h",
            },
            {
                nome: "Enf. Gabriel Costa Medeiros",
                cargo: "Enfermeiro Responsável",
                especialidade: "Atenção Primária",
                registroProfissional: "COREN/RN 501.320",
                diasHorarios: "Terça a Quinta: 07h às 17h",
            },
            {
                nome: "Téc. Francisca Cláudia Lima",
                cargo: "Técnica de Enfermagem",
                especialidade: "Cuidados Básicos",
                registroProfissional: "COREN/RN 720.155",
                diasHorarios: "Terça a Quinta: 07h às 17h",
            },
        ],
    },
    {
        matchTerms: ["barros preto"],
        fallbackNome: "UBS COMUNIDADE BARROS PRETO",
        tipo: "Saúde",
        subtipo: "Unidade Básica de Saúde Rural (ESF)",
        descricao:
            "Unidade básica para cobertura da população rural da comunidade de Barros Preto e sítios vizinhos.",
        endereco: "Zona Rural Barros Preto, Lajes Pintadas/RN",
        telefone: "(84) 98796-9881 (smslajespintadasrn@outlook.com)",
        horario: "Segunda a Sexta: 07h - 13h",
        servicos:
            "Consultas de Enfermagem, Atendimento Médico Agendado, Curativos, Vacinação, Acompanhamento de Gestantes e Idosos.",
        especialidades: [
            "Atenção Básica Rural",
            "Enfermagem da Família",
            "Saúde da Mulher",
        ],
        equipe: [
            {
                nome: "Dr. André Filipe Santos",
                cargo: "Médico de Família",
                especialidade: "Clínica Geral",
                registroProfissional: "CRM/RN 10.155",
                diasHorarios: "Sextas-feiras: 08h às 12h",
            },
            {
                nome: "Enfª. Tânia Maria dos Santos",
                cargo: "Enfermeira ESF",
                especialidade: "Saúde da Família",
                registroProfissional: "COREN/RN 489.112",
                diasHorarios: "Segunda a Sexta: 07h às 13h",
            },
        ],
    },
    {
        matchTerms: ["serra verde"],
        fallbackNome: "UBS COMUNIDADE RURAL SERRA VERDE",
        tipo: "Saúde",
        subtipo: "Unidade Básica de Saúde Rural (ESF)",
        descricao:
            "Unidade descentralizada para suporte às famílias agricultoras da região serrana do município.",
        endereco: "Zona Rural Serra Verde, Lajes Pintadas/RN",
        telefone: "(84) 98796-9881 (smslajespintadasrn@outlook.com)",
        horario: "Terça a Quinta: 07h - 13h",
        servicos:
            "Consultas Básicas, Triagem, Renovação de Receitas, Curativos, Acompanhamento Pediátrico e Vacinação.",
        especialidades: [
            "Clínica Geral",
            "Atenção Primária à Saúde",
        ],
        equipe: [
            {
                nome: "Dr. Paulo Henrique Gomes",
                cargo: "Médico Itinerante",
                especialidade: "Medicina Geral",
                registroProfissional: "CRM/RN 11.204",
                diasHorarios: "Quartas-feiras: 08h às 13h",
            },
            {
                nome: "Téc. Maria de Fátima Alves",
                cargo: "Técnica de Enfermagem",
                especialidade: "Procedimentos Básicos",
                registroProfissional: "COREN/RN 640.890",
                diasHorarios: "Terça a Quinta: 07h às 13h",
            },
        ],
    },
    {
        matchTerms: ["raimundo eudes", "ums", "unidade mista"],
        fallbackNome: "UMS RAIMUNDO EUDES SILVA",
        tipo: "Saúde",
        subtipo: "Unidade Mista / Pronto Atendimento 24h",
        descricao:
            "Unidade Mista de Saúde para pronto atendimento, urgência, emergência 24 horas, observação clínica e suporte ambulatorial continuado.",
        endereco: "Rua Gov. Walfredo Gurgel, Centro, Lajes Pintadas/RN",
        telefone: "(84) 98760-8261 (smslajespintadasrn@outlook.com)",
        horario: "Todos os dias 24h",
        servicos:
            "Pronto Atendimento 24h, Observação Clínica e Internação Básica, Triagem com Classificação de Risco, Administração de Medicamentos Injetáveis, Nebulização, Sala de Sutura, Eletrocardiograma, Transporte Sanitário e Atendimento Pré-Hospitalar Básico.",
        especialidades: [
            "Clínica Geral / Plantão 24h",
            "Urgência e Emergência",
            "Obstetrícia de Baixo Risco / Retaguarda",
            "Enfermagem Hospitalar e Ambulatorial",
        ],
        equipe: [
            {
                nome: "Dr. Marcos Vinícius A. de Souza",
                cargo: "Médico Plantonista Clínico Geral",
                especialidade: "Clínica Médica / Urgência 24h",
                registroProfissional: "CRM/RN 8.412",
                diasHorarios: "Escala de Plantão 24h (Conforme Escala Mensal)",
            },
            {
                nome: "Dra. Juliana Cavalcante Bezerra",
                cargo: "Médica Plantonista",
                especialidade: "Clínica Geral e Obstetrícia",
                registroProfissional: "CRM/RN 9.874",
                diasHorarios: "Escala de Plantão 24h",
            },
            {
                nome: "Enf. Rodrigo Ferreira de Lima",
                cargo: "Enfermeiro Chefe de Plantão",
                especialidade: "Enfermagem de Urgência",
                registroProfissional: "COREN/RN 345.120",
                diasHorarios: "Segunda a Sexta: 07h às 19h",
            },
            {
                nome: "Enfª. Karla Danielle Macedo",
                cargo: "Enfermeira Supervisora",
                especialidade: "Enfermagem Geral e Ambulatorial",
                registroProfissional: "COREN/RN 390.118",
                diasHorarios: "Segunda a Sexta: 07h às 15h",
            },
            {
                nome: "Téc. Maria José da Silva",
                cargo: "Técnica de Enfermagem",
                especialidade: "Enfermagem Hospitalar",
                registroProfissional: "COREN/RN 612.401",
                diasHorarios: "Escala 12x36h",
            },
        ],
    },
];
