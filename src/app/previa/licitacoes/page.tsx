import { prisma } from "@/lib/prisma";
import LicitacoesPreviaClient from "./_LicitacoesPreviaClient";

export const dynamic = "force-dynamic";

export default async function PreviaLicitacoesPage() {
    let licitacoesDb: any[] = [];

    try {
        licitacoesDb = await prisma.licitacao.findMany({
            orderBy: [{ ano: "desc" }, { criadoEm: "desc" }],
        });
    } catch {
        // fallback
    }

    if (licitacoesDb.length === 0) {
        licitacoesDb = [
            {
                id: "lic-01",
                numero: "001/2026",
                numeroProcesso: "Proc. Adm. 012/2026",
                ano: 2026,
                modalidade: "Pregão Eletrônico",
                objeto: "Registro de preços para eventual e futura aquisição de medicamentos de atenção básica e materiais médico-hospitalares destinados à Secretaria Municipal de Saúde de Lajes Pintadas/RN.",
                valorEstimado: 385000.0,
                valorHomologado: 342150.0,
                status: "Homologada",
                dataAbertura: new Date("2026-02-15T09:00:00Z"),
                dataHomologacao: new Date("2026-03-02T14:30:00Z"),
                secretaria: "Secretaria Municipal de Saúde",
                amparoLegal: "Lei Federal nº 14.133/2021 (Nova Lei de Licitações), Art. 28, I",
                editalUrl: "/docs/edital_pregao_001_2026.pdf",
                ataRegistroPreco: true,
                fonteOrigem: "Portal Nacional de Contratações Públicas (PNCP)",
                dataAtualizacaoEfetiva: new Date(),
                dataUltimaConferencia: new Date(),
            },
            {
                id: "lic-02",
                numero: "002/2026",
                numeroProcesso: "Proc. Adm. 024/2026",
                ano: 2026,
                modalidade: "Concorrência Eletrônica",
                objeto: "Contratação de empresa especializada em engenharia civil para execução de obras de pavimentação em paralelepípedo e drenagem superficial de diversas ruas na sede do município de Lajes Pintadas/RN.",
                valorEstimado: 890000.0,
                valorHomologado: null,
                status: "Aberta",
                dataAbertura: new Date("2026-04-10T10:00:00Z"),
                dataHomologacao: null,
                secretaria: "Secretaria de Obras e Infraestrutura",
                amparoLegal: "Lei Federal nº 14.133/2021, Art. 28, II",
                editalUrl: "/docs/edital_concorrencia_002_2026.pdf",
                ataRegistroPreco: false,
                fonteOrigem: "Portal Nacional de Contratações Públicas (PNCP)",
                dataAtualizacaoEfetiva: new Date(),
                dataUltimaConferencia: new Date(),
            },
            {
                id: "lic-03",
                numero: "003/2026",
                numeroProcesso: "Proc. Adm. 031/2026",
                ano: 2026,
                modalidade: "Dispensa de Licitação",
                objeto: "Aquisição de gêneros alimentícios diretamente de agricultores familiares e do empreendedor familiar rural para atendimento ao Programa Nacional de Alimentação Escolar (PNAE).",
                valorEstimado: 94500.0,
                valorHomologado: 94500.0,
                status: "Homologada",
                dataAbertura: new Date("2026-01-20T08:00:00Z"),
                dataHomologacao: new Date("2026-01-28T11:00:00Z"),
                secretaria: "Secretaria Municipal de Educação",
                amparoLegal: "Lei Federal nº 14.133/2021, Art. 75, II c/c Lei nº 11.947/2009",
                editalUrl: "/docs/aviso_dispensa_003_2026.pdf",
                ataRegistroPreco: false,
                fonteOrigem: "Portal de Compras Públicas / PNCP",
                dataAtualizacaoEfetiva: new Date(),
                dataUltimaConferencia: new Date(),
            },
            {
                id: "lic-04",
                numero: "015/2025",
                numeroProcesso: "Proc. Adm. 110/2025",
                ano: 2025,
                modalidade: "Pregão Eletrônico",
                objeto: "Contratação de empresa para fornecimento continuado de combustíveis (gasolina comum, óleo diesel S-10 e etanol) para abastecimento da frota de veículos oficiais do município.",
                valorEstimado: 450000.0,
                valorHomologado: 418900.0,
                status: "Homologada",
                dataAbertura: new Date("2025-05-12T09:00:00Z"),
                dataHomologacao: new Date("2025-05-28T16:00:00Z"),
                secretaria: "Secretaria de Administração e Finanças",
                amparoLegal: "Lei Federal nº 14.133/2021",
                editalUrl: "/docs/edital_combustiveis_2025.pdf",
                ataRegistroPreco: true,
                fonteOrigem: "Portal Nacional de Contratações Públicas (PNCP)",
                dataAtualizacaoEfetiva: new Date(),
                dataUltimaConferencia: new Date(),
            },
            {
                id: "lic-05",
                numero: "008/2025",
                numeroProcesso: "Proc. Adm. 082/2025",
                ano: 2025,
                modalidade: "Inexigibilidade de Licitação",
                objeto: "Contratação de assessoria e consultoria técnica especializada em contabilidade pública aplicada ao setor público municipal e atendimento às exigências do SIAFIC/TCE-RN.",
                valorEstimado: 120000.0,
                valorHomologado: 120000.0,
                status: "Homologada",
                dataAbertura: new Date("2025-02-04T10:00:00Z"),
                dataHomologacao: new Date("2025-02-10T15:00:00Z"),
                secretaria: "Controladoria e Finanças",
                amparoLegal: "Lei Federal nº 14.133/2021, Art. 74, III",
                editalUrl: "/docs/termo_inexigibilidade_008_2025.pdf",
                ataRegistroPreco: false,
                fonteOrigem: "Portal de Compras Públicas / PNCP",
                dataAtualizacaoEfetiva: new Date(),
                dataUltimaConferencia: new Date(),
            },
        ];
    }

    // Serializa as datas para o cliente
    const licitacoesFormatted = licitacoesDb.map((item) => ({
        ...item,
        dataAbertura: item.dataAbertura ? new Date(item.dataAbertura).toISOString() : null,
        dataHomologacao: item.dataHomologacao ? new Date(item.dataHomologacao).toISOString() : null,
        dataAtualizacaoEfetiva: item.dataAtualizacaoEfetiva ? new Date(item.dataAtualizacaoEfetiva).toISOString() : null,
        dataUltimaConferencia: item.dataUltimaConferencia ? new Date(item.dataUltimaConferencia).toISOString() : null,
    }));

    return <LicitacoesPreviaClient licitacoes={licitacoesFormatted} />;
}

