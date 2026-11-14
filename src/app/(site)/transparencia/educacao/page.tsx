export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import {
    FaArrowRight,
    FaBabyCarriage,
    FaBookOpen,
    FaCheckCircle,
    FaGraduationCap,
    FaHandsHelping,
    FaSchool,
    FaUsers,
} from "react-icons/fa";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { CONFIG_CHAVE_CRITERIOS_CRECHE, parseCriteriosCreche } from "@/lib/educacao";
import { getUnidadesEducacaoAtivas } from "@/lib/unidades-server";

export const metadata: Metadata = {
    title: "Educação e Assistência Social | Portal da Transparência",
    description:
        "Central de transparência da Educação Municipal e Assistência Social de Lajes Pintadas/RN (Cartilha PNTP 2026 - Dimensão 19: Itens 19.1 a 19.4).",
};

export default async function TransparenciaEducacaoHubPage() {
    const [docsPme, declaracaoCreche, criteriosConfig, filaAtivaCount, escolas] = await Promise.all([
        prisma.documento.findMany({
            where: {
                ativo: true,
                tipo: { in: ["plano-educacao", "relatorio-plano-educacao"] },
            },
            orderBy: [{ ano: "desc" }, { criadoEm: "desc" }],
        }),
        prisma.declaracaoTransparencia.findFirst({
            where: {
                ativa: true,
                OR: [{ modulo: "fila_creches" }, { modulo: "creches" }],
            },
            orderBy: [{ exercicio: "desc" }, { dataConferencia: "desc" }],
        }),
        prisma.configuracao.findUnique({
            where: { chave: CONFIG_CHAVE_CRITERIOS_CRECHE },
        }),
        prisma.filaEsperaCreche.count({
            where: { status: "aguardando" },
        }),
        getUnidadesEducacaoAtivas(),
    ]);

    const pmeCount = docsPme.filter((d) => d.tipo === "plano-educacao").length;
    const relatorioPmeCount = docsPme.filter((d) => d.tipo === "relatorio-plano-educacao").length;
    const criterios = parseCriteriosCreche(criteriosConfig?.valor);

    return (
        <div className="bg-[#FAFBFD] min-h-screen pb-16">
            <PageHeader
                title="Transparência da Educação e Assistência Social"
                subtitle="Plano Municipal de Educação (PME) e Relatório de Resultados, Lista de Espera e Critérios em Creches, Rede Escolar Municipal, Conselho do FUNDEB e Assistência Social (Cartilha PNTP 2026 - Dimensão 19)."
                icon={<FaGraduationCap />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Educação" },
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-10">
                {/* Grid de Critérios PNTP 2026 (19.1 a 19.4) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 19.1 */}
                    <Link
                        href="/transparencia/plano-educacao"
                        className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-md hover:border-[#1254A3]/40 transition flex flex-col justify-between gap-5 group"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1254A3] flex items-center justify-center group-hover:bg-[#1254A3] group-hover:text-white transition">
                                    <FaBookOpen size={20} />
                                </div>
                                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#1254A3] text-xs font-black">
                                    PNTP Item 19.1 • Recomendado
                                </span>
                            </div>
                            <h2 className="text-xl font-black text-slate-900">
                                Plano de Educação (PME) e Relatório de Resultados
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Consulta ao texto integral do Plano Municipal de Educação e aos respectivos relatórios periódicos de monitoramento e cumprimento das metas.
                            </p>
                            <div className="flex flex-wrap gap-2 pt-1">
                                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                                    {pmeCount} Plano(s) PME
                                </span>
                                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg">
                                    {relatorioPmeCount} Relatório(s) de Resultados
                                </span>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-[#1254A3] uppercase tracking-wider flex items-center gap-2">
                            Consultar PME e Relatórios <FaArrowRight size={11} />
                        </span>
                    </Link>

                    {/* 19.2 */}
                    <Link
                        href="/transparencia/fila-creches"
                        className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-md hover:border-emerald-400 transition flex flex-col justify-between gap-5 group"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                                    <FaBabyCarriage size={20} />
                                </div>
                                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black">
                                    PNTP Item 19.2 • Obrigatório
                                </span>
                            </div>
                            <h2 className="text-xl font-black text-slate-900">
                                Fila de Espera em Creches Públicas e Critérios de Priorização
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {filaAtivaCount === 0
                                    ? declaracaoCreche?.textoDeclaracao ||
                                      "Demanda 100% atendida na rede pública de educação infantil, com critérios oficiais de prioridade publicados."
                                    : `${filaAtivaCount} solicitação(ões) aguardando vaga na lista de espera anonimizada conforme ordem legal de prioridade.`}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-1">
                                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg inline-flex items-center gap-1.5">
                                    <FaCheckCircle size={10} />{" "}
                                    {filaAtivaCount === 0 ? "Sem Fila Reprimida" : `${filaAtivaCount} na Fila`}
                                </span>
                                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                                    {criterios.length} Critérios de Prioridade
                                </span>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                            Acessar Declaração, Critérios e Fila <FaArrowRight size={11} />
                        </span>
                    </Link>

                    {/* 19.3 */}
                    <Link
                        href="/transparencia/conselhos"
                        className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-md hover:border-indigo-400 transition flex flex-col justify-between gap-5 group"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                                    <FaUsers size={20} />
                                </div>
                                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-black">
                                    PNTP Item 19.3 • Obrigatório
                                </span>
                            </div>
                            <h2 className="text-xl font-black text-slate-900">
                                Conselho de Acompanhamento do FUNDEB (CACS-FUNDEB)
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Composição atualizada dos conselheiros por segmento, presidência, contato oficial, regimento e atas das reuniões ordinárias.
                            </p>
                        </div>
                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                            Consultar CACS-FUNDEB e Atas <FaArrowRight size={11} />
                        </span>
                    </Link>

                    {/* 19.4 & Escolas */}
                    <Link
                        href="/unidades-escolares"
                        className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-md hover:border-amber-400 transition flex flex-col justify-between gap-5 group"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                                    <FaSchool size={20} />
                                </div>
                                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-black">
                                    Rede Municipal de Ensino
                                </span>
                            </div>
                            <h2 className="text-xl font-black text-slate-900">
                                Escolas, Creches e Equipamentos Educacionais
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Endereços, horários, serviços escolares, etapas ofertadas e contatos das {escolas.length} unidades escolares ativas do município.
                            </p>
                        </div>
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
                            Ver Unidades Escolares <FaArrowRight size={11} />
                        </span>
                    </Link>
                </div>

                {/* Atalho PNTP 19.4 - Assistência Social */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                            <FaHandsHelping size={22} />
                        </div>
                        <div>
                            <span className="text-[11px] font-black uppercase tracking-wider text-purple-700">
                                PNTP Item 19.4 • Assistência Social
                            </span>
                            <h3 className="text-lg font-bold text-slate-900">
                                Conselho Municipal de Assistência Social (CMAS)
                            </h3>
                            <p className="text-xs text-slate-500">
                                Consulte composição, calendário de reuniões, atas e deliberações do CMAS no módulo de Conselhos Municipais.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/transparencia/conselhos?tipo=social"
                        className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-2 shrink-0 transition"
                    >
                        Acessar CMAS (19.4) <FaArrowRight size={11} />
                    </Link>
                </div>
            </div>

            <div className="mt-14">
                <BannerPNTP
                    criterio="19.1 - 19.4"
                    requisito="Transparência Integral da Educação Básica (PME, Relatórios, Creches, FUNDEB) e Assistência Social"
                    status="Atendimento Completo PNTP 2026"
                />
            </div>
        </div>
    );
}
