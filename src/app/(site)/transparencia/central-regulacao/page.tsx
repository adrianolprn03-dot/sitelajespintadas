export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { FaHeartbeat } from "react-icons/fa";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import CentralRegulacaoClient, {
    CentralRegulacaoConfigPublico,
    CentralRegulacaoItemPublico,
    ProtocoloRegulacaoPublico,
} from "@/components/transparencia/CentralRegulacaoClient";

export const metadata: Metadata = {
    title: "Central de Regulação | Portal da Transparência",
    description:
        "Transparência das listas de espera para acesso a consultas especializadas, exames e procedimentos médicos no SUS (Cartilha PNTP 2026 - Item 18.3).",
};

function parseProtocolos(raw: string | null | undefined): ProtocoloRegulacaoPublico[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((p) => p && typeof p === "object" && p.protocolo);
    } catch {
        return [];
    }
}

export default async function CentralRegulacaoPage() {
    let rawItens: any[] = [];
    let rawConfig: any = null;

    try {
        [rawItens, rawConfig] = await Promise.all([
            prisma.centralRegulacaoItem.findMany({
                where: { ativo: true },
                orderBy: { ordem: "asc" },
            }),
            prisma.centralRegulacaoConfig.findUnique({
                where: { id: "config" },
            }),
        ]);
    } catch (e) {
        console.error("Erro ao consultar Central de Regulação:", e);
    }

    const itens: CentralRegulacaoItemPublico[] = rawItens.map((item) => ({
        id: item.id,
        tipo: item.tipo,
        totalPacientes: item.totalPacientes,
        tempoEspera: item.tempoEspera,
        procedimentos: item.procedimentos,
        competencia: item.competencia || null,
        protocolosLista: parseProtocolos(item.protocolosLista),
        icone: item.icone,
        cor: item.cor,
        atualizadoEm: new Date(item.atualizadoEm).toISOString(),
    }));

    const config: CentralRegulacaoConfigPublico = rawConfig
        ? {
              titulo: rawConfig.titulo,
              subtitulo: rawConfig.subtitulo,
              comoFunciona: rawConfig.comoFunciona,
              telefone: rawConfig.telefone,
              horarioFuncionamento: rawConfig.horarioFuncionamento,
              endereco: rawConfig.endereco,
              linkSistemaExterno: rawConfig.linkSistemaExterno,
              documentoRegulamento: rawConfig.documentoRegulamento,
              atualizadoEm: rawConfig.atualizadoEm
                  ? new Date(rawConfig.atualizadoEm).toISOString()
                  : undefined,
          }
        : {
              titulo: "Central de Regulação em Saúde",
              subtitulo:
                  "Acompanhe as listas de espera para consultas especializadas, exames e procedimentos eletivos no SUS municipal com respeito à LGPD.",
              comoFunciona:
                  "A Central de Regulação de Saúde organiza os encaminhamentos emitidos pelas Unidades Básicas de Saúde (UBS) para consultas especializadas, exames diagnósticos e cirurgias eletivas, obedecendo critérios clínicos de prioridade e ordem cronológica.",
              telefone: "(84) 98796-9881",
              horarioFuncionamento: "Segunda a Sexta, 07h às 13h",
              endereco: "Secretaria Municipal de Saúde de Lajes Pintadas/RN",
              linkSistemaExterno: "",
              documentoRegulamento: "",
          };

    return (
        <div className="bg-[#FAFBFD] min-h-screen pb-16">
            <PageHeader
                title={config.titulo}
                subtitle={
                    config.subtitulo ||
                    "Lista de espera da regulação para acesso a consultas, exames e serviços médicos (Cartilha PNTP 2026 - Item 18.3)."
                }
                icon={<FaHeartbeat />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Saúde", href: "/transparencia/saude" },
                    { label: "Central de Regulação" },
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
                <CentralRegulacaoClient itens={itens} config={config} />
            </div>

            <div className="mt-14">
                <BannerPNTP
                    criterio="18.3"
                    requisito="Divulgação da lista de espera de regulação para consultas, exames e serviços médicos com preservação da privacidade (LGPD)"
                    status="Transparente e Exportável"
                />
            </div>
        </div>
    );
}
