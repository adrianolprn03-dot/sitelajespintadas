export interface CriterioPrioridadeCreche {
    ordem: number;
    titulo: string;
    fundamento: string;
    descricao: string;
}

export const CONFIG_CHAVE_CRITERIOS_CRECHE = "creches_criterios_prioridade";

export const CRITERIOS_PRIORIDADE_CRECHE_PADRAO: CriterioPrioridadeCreche[] = [
    {
        ordem: 1,
        titulo: "Medida Protetiva / Determinação Judicial ou do Conselho Tutelar",
        fundamento: "Art. 101 e Art. 208 do Estatuto da Criança e do Adolescente (ECA - Lei nº 8.069/1990)",
        descricao:
            "Atendimento imediato a crianças sob medida protetiva ou encaminhamento oficial do Ministério Público, Poder Judiciário ou Conselho Tutelar.",
    },
    {
        ordem: 2,
        titulo: "Criança com Deficiência (PcD) ou Transtorno do Espectro Autista (TEA)",
        fundamento: "Lei Brasileira de Inclusão (Lei nº 13.146/2015) e Política Nacional de Educação Especial",
        descricao:
            "Prioridade de acesso com garantia de acompanhamento pedagógico inclusivo e acessibilidade na unidade escolar.",
    },
    {
        ordem: 3,
        titulo: "Famílias em Situação de Vulnerabilidade Socioeconômica (CadÚnico / Bolsa Família)",
        fundamento: "Lei de Diretrizes e Bases da Educação (Lei nº 9.394/1996) e Plano Municipal de Educação",
        descricao:
            "Crianças pertencentes a núcleos familiares com renda per capita enquadrada em critérios de proteção social básica e extrema pobreza.",
    },
    {
        ordem: 4,
        titulo: "Responsável Legal em Exercício de Atividade Laboral",
        fundamento: "Lei Municipal de Diretrizes Educacionais e Apoio à Família Trabalhadora",
        descricao:
            "Crianças cuja mãe, pai ou responsável legal comprove vínculo empregatício formal ou exercício contínuo de trabalho durante o turno escolar.",
    },
    {
        ordem: 5,
        titulo: "Existência de Irmão(s) Matriculado(s) na Mesma Unidade Escolar",
        fundamento: "Art. 53, inciso V, do Estatuto da Criança e do Adolescente (ECA)",
        descricao:
            "Facilitação do deslocamento familiar e permanência escolar garantindo vaga na mesma escola pública frequentada por irmãos.",
    },
    {
        ordem: 6,
        titulo: "Proximidade da Residência da Criança à Unidade Escolar (Zoneamento)",
        fundamento: "Art. 53, inciso V, do ECA e Critério Territorial da Rede Municipal",
        descricao:
            "Priorização para a unidade de educação infantil mais próxima da residência da família, respeitando a ordem cronológica do requerimento.",
    },
];

export const TEXTO_DECLARACAO_CRECHE_PADRAO =
    "A Prefeitura Municipal e a Secretaria Municipal de Educação declaram oficialmente que, até a presente competência, não há lista de espera reprimida para vagas em creches e pré-escolas na rede pública municipal de ensino, visto que 100% da demanda registrada foi absorvida pelas unidades escolares da zona urbana e rural.";

export function parseCriteriosCreche(raw: string | null | undefined): CriterioPrioridadeCreche[] {
    if (!raw || !raw.trim()) return CRITERIOS_PRIORIDADE_CRECHE_PADRAO;
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) {
            return CRITERIOS_PRIORIDADE_CRECHE_PADRAO;
        }
        return parsed
            .map((item, idx) => ({
                ordem: Number(item?.ordem) || idx + 1,
                titulo: String(item?.titulo || "").trim(),
                fundamento: String(item?.fundamento || "").trim(),
                descricao: String(item?.descricao || "").trim(),
            }))
            .filter((c) => Boolean(c.titulo))
            .sort((a, b) => a.ordem - b.ordem);
    } catch {
        return CRITERIOS_PRIORIDADE_CRECHE_PADRAO;
    }
}
