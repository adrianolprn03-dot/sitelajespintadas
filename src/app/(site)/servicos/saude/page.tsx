export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { FaCapsules, FaClipboardList, FaFileMedical, FaHeartbeat, FaHospitalAlt, FaUsers } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import UnidadesSaudeCatalog from "@/components/transparencia/UnidadesSaudeCatalog";
import { getUnidadesSaudeAtivas } from "@/lib/unidades-server";

export const metadata: Metadata = {
    title: "Serviços de Saúde | Prefeitura Municipal de Lajes Pintadas",
    description:
        "Carta de Serviços da Saúde Municipal, Unidades Básicas (UBS), UMS 24h, equipes médicas e acesso ao SUS em Lajes Pintadas/RN.",
};

export default async function ServicosSaudePage() {
    const unidades = await getUnidadesSaudeAtivas();

    const atalhosSaude = [
        {
            href: "/transparencia/medicamentos-sus",
            titulo: "Medicamentos SUS (REMUME) & Estoques",
            desc: "Lista de medicamentos fornecidos pelo SUS, alto custo (CEAF) e estoque atualizado (PNTP 18.4 e 18.5).",
            icon: FaCapsules,
        },
        {
            href: "/transparencia/central-regulacao",
            titulo: "Central de Regulação (Filas e Exames)",
            desc: "Listas de espera para consultas especializadas, exames e cirurgias (PNTP 18.3).",
            icon: FaHeartbeat,
        },
        {
            href: "/transparencia/plano-saude",
            titulo: "Plano de Saúde, PAS e Relatório Anual (RAG)",
            desc: "Instrumentos de planejamento e gestão do SUS aprovados pelo Conselho (PNTP 18.1).",
            icon: FaFileMedical,
        },
        {
            href: "/transparencia/conselhos",
            titulo: "Conselho Municipal de Saúde (CMS)",
            desc: "Composição atualizada, regimento, atas e deliberações do controle social (PNTP 18.6).",
            icon: FaUsers,
        },
    ];

    return (
        <div className="bg-[#FAFBFD] min-h-screen pb-16">
            <PageHeader
                title="Serviços Municipais de Saúde (SUS)"
                subtitle="Atendimento médico, odontológico, imunização, pronto atendimento 24h, assistência farmacêutica e regulação em saúde em Lajes Pintadas/RN."
                icon={<FaHospitalAlt />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Serviços" },
                    { label: "Saúde" },
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-10">
                {/* Atalhos para Transparência da Saúde (PNTP 18.1 - 18.6) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {atalhosSaude.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-[#1254A3]/40 transition group flex flex-col justify-between gap-3"
                            >
                                <div className="space-y-2">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1254A3] flex items-center justify-center group-hover:bg-[#1254A3] group-hover:text-white transition">
                                        <Icon size={18} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-sm">{item.titulo}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                </div>
                                <span className="text-[11px] font-bold text-[#1254A3] uppercase tracking-wider">
                                    Acessar →
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Catálogo Completo de Unidades, Serviços e Equipes (PNTP 18.2) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-800">
                        <FaClipboardList className="text-[#1254A3]" />
                        <h2 className="text-xl font-black tracking-tight">
                            Rede de Atendimento, Serviços e Profissionais por Unidade
                        </h2>
                    </div>
                    <UnidadesSaudeCatalog initialUnidades={unidades} compactNavigation />
                </div>
            </div>
        </div>
    );
}
