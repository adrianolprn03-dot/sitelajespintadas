export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { FaBabyCarriage, FaBookOpen, FaGraduationCap, FaUsers } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import UnidadesEscolaresCatalog from "@/components/transparencia/UnidadesEscolaresCatalog";
import { getDadosEducacaoPublica } from "@/lib/unidades-server";

export const metadata: Metadata = {
    title: "Serviços de Educação | Prefeitura Municipal de Lajes Pintadas",
    description:
        "Educação Infantil, Ensino Fundamental, Plano Municipal de Educação, Relatórios de Resultados, Matrículas e Creches de Lajes Pintadas/RN.",
};

export default async function ServicosEducacaoPage() {
    const dados = await getDadosEducacaoPublica();

    const atalhosEducacao = [
        {
            href: "/transparencia/plano-educacao",
            titulo: "Plano de Educação e Relatórios (19.1)",
            desc: "Plano Municipal de Educação (PME) e relatórios de acompanhamento de metas.",
            icon: FaBookOpen,
        },
        {
            href: "/transparencia/fila-creches",
            titulo: "Fila de Creches e Critérios (19.2)",
            desc: "Consulta de protocolos, critérios legais de prioridade e declaração oficial.",
            icon: FaBabyCarriage,
        },
        {
            href: "/transparencia/conselhos?tipo=fundeb",
            titulo: "Conselho do FUNDEB (19.3)",
            desc: "Composição atualizada, calendário e atas do CACS-FUNDEB.",
            icon: FaUsers,
        },
    ];

    return (
        <div className="bg-[#FAFBFD] min-h-screen pb-16">
            <PageHeader
                title="Serviços Municipais de Educação"
                subtitle="Rede municipal de creches e escolas, programas educacionais, Plano Municipal de Educação, critérios de vagas e controle social em Lajes Pintadas/RN."
                icon={<FaGraduationCap />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Serviços" },
                    { label: "Educação" },
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {atalhosEducacao.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-[#1254A3]/40 transition space-y-2"
                            >
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1254A3] flex items-center justify-center">
                                    <Icon size={18} />
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm">{item.titulo}</h3>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </Link>
                        );
                    })}
                </div>

                <UnidadesEscolaresCatalog
                    unidades={dados.unidades}
                    declaracao={dados.declaracao}
                    criterios={dados.criterios}
                    filaAguardando={dados.filaAguardando}
                />
            </div>
        </div>
    );
}
