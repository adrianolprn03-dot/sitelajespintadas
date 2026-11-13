"use client";

import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { FaBalanceScale, FaFileAlt, FaCheckCircle, FaExternalLinkAlt, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";
import { FaPlane, FaBuildingColumns } from "react-icons/fa6";
import { HISTORICO_DIARIAS } from "@/lib/diarias-historico";

export default function RegulamentacaoDiariasPage() {
    return (
        <div className="min-h-screen bg-[#F5F7FA] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Regulamentação de Diárias"
                subtitle="Atos normativos, leis ordinárias, decretos executivos e diretrizes legais para concessão de diárias no Município."
                icon={<FaBalanceScale />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Regulamentação de Diárias" }
                ]}
            />

            {/* Sub-header de Navegação PNTP */}
            <div className="bg-white border-b border-[#DDE3EA] py-3.5 px-4 sm:px-6 shadow-xs">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 font-bold text-[#12304A]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F39A32]" />
                        <span>Critério PNTP 2026 (ATRICON)</span>
                        <span className="hidden sm:inline text-[#5B738B]">· Legislação Municipal e Declarações Formais</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/transparencia/tabela-diarias"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1254A3] text-white hover:bg-[#0d4282] rounded-lg font-bold transition-colors"
                        >
                            <FaPlane size={11} />
                            <span>Ver Tabela de Valores (2021-2026)</span>
                        </Link>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                
                {/* 1. CARDS DE DESTAQUE INSTITUCIONAL */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1254A3] flex items-center justify-center font-bold mb-3">
                            <FaBalanceScale size={18} />
                        </div>
                        <h3 className="text-base font-black text-[#12304A] mb-1">Norma Base Vigente</h3>
                        <p className="text-xs text-[#5B738B] leading-relaxed">
                            Lei Municipal nº 315/2021 c/c Decretos Anuais de Atualização Orçamentária e Fixação de Valores.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
                            <FaCheckCircle size={18} />
                        </div>
                        <h3 className="text-base font-black text-[#12304A] mb-1">Controle Social</h3>
                        <p className="text-xs text-[#5B738B] leading-relaxed">
                            Publicação individualizada de cada portaria concessória e prestação de contas com comprovantes.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3">
                            <FaShieldAlt size={18} />
                        </div>
                        <h3 className="text-base font-black text-[#12304A] mb-1">Diárias Internacionais</h3>
                        <p className="text-xs text-[#5B738B] leading-relaxed">
                            Inexistência formal de regulamentação e declaração anual de não ocorrência para viagens ao exterior.
                        </p>
                    </div>
                </div>

                {/* 2. REGRAS DE CONCESSÃO EM DESTAQUE */}
                <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 sm:p-8 shadow-sm space-y-6">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#1254A3] block mb-1">
                            Diretrizes Regimentais
                        </span>
                        <h2 className="text-xl font-black text-[#12304A]">
                            Regras e Condições para a Concessão de Diárias
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#12304A]">
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#DDE3EA]">
                                <h4 className="font-black text-[#1254A3] mb-1">1. Finalidade Exclusiva</h4>
                                <p className="text-[#5B738B] leading-relaxed">
                                    O pagamento de diárias destina-se exclusivamente a indenizar o servidor pelas despesas extraordinárias com pousada, alimentação e locomoção urbana decorrentes de viagens a serviço da Administração Pública Municipal.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#DDE3EA]">
                                <h4 className="font-black text-[#1254A3] mb-1">2. Pernoite e Meia-Diária</h4>
                                <p className="text-[#5B738B] leading-relaxed">
                                    A diária é calculada por dia de afastamento. Quando o deslocamento não exigir pernoite fora da comarca, ou nos dias de retorno, a diária é concedida pela metade (50% do valor integral fixado em tabela).
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#DDE3EA]">
                                <h4 className="font-black text-[#1254A3] mb-1">3. Obrigação de Prestação de Contas</h4>
                                <p className="text-[#5B738B] leading-relaxed">
                                    O servidor beneficiário tem o dever legal de apresentar relatório detalhado de viagem, acompanhado dos comprovantes de participação e despesas correspondentes, perante a Controladoria no prazo de 5 (cinco) dias úteis.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#DDE3EA]">
                                <h4 className="font-black text-[#1254A3] mb-1">4. Publicidade e Transparência Ativa</h4>
                                <p className="text-[#5B738B] leading-relaxed">
                                    Todos os atos de concessão são publicados no portal com o nome do servidor, cargo, destino, motivo, período de afastamento, valor unitário, quantidade de dias e o valor total concedido.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. HISTÓRICO DE ATOS NORMATIVOS (2021 A 2026) */}
                <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#1254A3] block mb-1">
                                Série Histórica de Vigências
                            </span>
                            <h2 className="text-xl font-black text-[#12304A]">
                                Atos Normativos Regulamentadores por Exercício
                            </h2>
                        </div>
                        <Link
                            href="/transparencia/legislacao?q=diarias"
                            className="inline-flex items-center gap-2 text-xs font-bold text-[#1254A3] hover:underline"
                        >
                            <span>Pesquisar na Legislação</span>
                            <FaExternalLinkAlt size={10} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {HISTORICO_DIARIAS.map((h) => (
                            <div 
                                key={h.ano} 
                                className="p-5 rounded-2xl border border-[#DDE3EA] bg-[#F8FAFC] hover:bg-white transition-all space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-[#1254A3] px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200">
                                        Exercício {h.ano}
                                    </span>
                                    {h.vigente ? (
                                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F39A32] text-[#12304A]">
                                            VIGENTE
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-[#5B738B]">Histórico</span>
                                    )}
                                </div>

                                <h4 className="text-sm font-bold text-[#12304A] leading-snug">
                                    {h.normaLegal}
                                </h4>

                                <p className="text-[11px] text-[#5B738B] line-clamp-2">
                                    {h.ementaNorma}
                                </p>

                                <div className="pt-2 border-t border-[#DDE3EA] flex items-center justify-between">
                                    <span className="text-[10px] text-[#5B738B]">
                                        Publ: {h.dataPublicacaoNorma}
                                    </span>
                                    <Link
                                        href={h.linkNorma}
                                        className="text-xs font-bold text-[#1254A3] hover:underline flex items-center gap-1"
                                    >
                                        <span>Consultar</span>
                                        <FaExternalLinkAlt size={9} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
}
