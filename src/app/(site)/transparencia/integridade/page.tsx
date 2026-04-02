import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { FaShieldAlt, FaCheckCircle, FaUsers, FaFileAlt, FaSearch, FaGlobeAmericas, FaGavel, FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Programa de Integridade | Prefeitura de Lajes Pintadas",
    description: "Programa de Integridade da Prefeitura Municipal de Lajes Pintadas, comprometido com a prevenção à corrupção, transparência e ética na gestão pública.",
};

const pilares = [
    {
        icon: FaShieldAlt,
        titulo: "Comprometimento da Alta Gestão",
        descricao: "O Prefeito Municipal e todos os Secretários demonstram compromisso formal com os princípios da integridade, ética e transparência na gestão dos recursos públicos.",
        cor: "from-blue-600 to-indigo-700",
    },
    {
        icon: FaSearch,
        titulo: "Avaliação de Riscos de Integridade",
        descricao: "Mapeamento periódico dos processos com maior vulnerabilidade à corrupção, fraude ou desvio de finalidade, com medidas preventivas sistematizadas.",
        cor: "from-purple-600 to-violet-700",
    },
    {
        icon: FaGavel,
        titulo: "Regras e Instrumentos",
        descricao: "Código de Conduta para agentes públicos, Política de Conflito de Interesses, regulamentação de controle interno e fiscalização permanente.",
        cor: "from-rose-500 to-pink-600",
    },
    {
        icon: FaUsers,
        titulo: "Capacitação e Comunicação",
        descricao: "Treinamentos periódicos sobre ética, LAI, LGPD, prevenção à lavagem de dinheiro e gestão responsável para todos os servidores municipais.",
        cor: "from-emerald-500 to-teal-600",
    },
    {
        icon: FaFileAlt,
        titulo: "Canais de Denúncia e Proteção",
        descricao: "Canal de ouvidoria com garantia de anonimato ao denunciante. Proibição de retaliação mediante norma interna e proteção ao servidor que relata irregularidades.",
        cor: "from-amber-500 to-orange-600",
    },
    {
        icon: FaGlobeAmericas,
        titulo: "Monitoramento e Melhoria Contínua",
        descricao: "Revisão anual do Programa de Integridade com indicadores de desempenho, relatórios de conformidade e publicação dos resultados no Portal da Transparência.",
        cor: "from-slate-600 to-slate-800",
    },
];

const acoes = [
    { descricao: "Publicação da Carta de Serviços ao Cidadão", status: "concluido", prazo: "Jan/2024" },
    { descricao: "Implantação do e-SIC com protocolo eletrônico", status: "concluido", prazo: "Mar/2024" },
    { descricao: "Cadastro de Conflito de Interesses de Agentes Políticos", status: "concluido", prazo: "Jun/2024" },
    { descricao: "Treinamento de servidores sobre LAI e LGPD", status: "concluido", prazo: "Ago/2024" },
    { descricao: "Publicação do Relatório Anual do SIC (art. 30 LAI)", status: "concluido", prazo: "Fev/2025" },
    { descricao: "Mapeamento de riscos de integridade nas áreas de licitações", status: "em_andamento", prazo: "Jun/2025" },
    { descricao: "Implantação de código de conduta do servidor", status: "em_andamento", prazo: "Ago/2025" },
    { descricao: "Revisão e atualização do Programa de Integridade", status: "planejado", prazo: "Dez/2025" },
];

const statusConfig: Record<string, { label: string; cor: string }> = {
    concluido: { label: "Concluído", cor: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    em_andamento: { label: "Em Andamento", cor: "bg-blue-100 text-blue-700 border-blue-200" },
    planejado: { label: "Planejado", cor: "bg-gray-100 text-gray-600 border-gray-200" },
};

export default function IntegridadePage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Programa de Integridade"
                subtitle="Compromisso da Prefeitura Municipal de Lajes Pintadas com a transparência, ética e prevenção à corrupção na gestão pública."
                variant="premium"
                icon={<FaShieldAlt />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Integridade" }
                ]}
            />

            <div className="w-full px-6 md:px-12 lg:px-20 py-12 space-y-16">

                {/* Apresentação */}
                <section className="bg-white rounded-[3rem] p-10 md:p-14 shadow-xl shadow-primary-900/5 border border-primary-50/50">
                    <div className="flex flex-col lg:flex-row gap-10 items-start">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 px-4 py-2 rounded-full text-[9px] font-black text-primary-600 uppercase tracking-widest mb-6">
                                <FaShieldAlt size={10} /> PNTP 2025 — Conformidade
                            </div>
                            <h2 className="text-2xl font-black text-primary-900 uppercase tracking-tighter mb-6">Sobre o Programa</h2>
                            <p className="text-gray-600 leading-relaxed font-medium mb-4">
                                O <strong>Programa de Integridade</strong> da Prefeitura Municipal de Lajes Pintadas é o conjunto de medidas e ações 
                                institucionalizadas com o objetivo de prevenir, detectar e remediar atos de corrupção, fraude, 
                                nepotismo e desvio de conduta no âmbito da administração pública municipal.
                            </p>
                            <p className="text-gray-600 leading-relaxed font-medium mb-4">
                                Alinhado às diretrizes do <strong>Programa Nacional de Transparência Pública (PNTP/ATRICON)</strong>, 
                                da <strong>Lei de Acesso à Informação (Lei 12.527/2011)</strong> e da <strong>Lei Geral de Proteção de Dados 
                                (Lei 13.709/2018)</strong>, nosso compromisso é com a gestão responsável, ética e transparente dos recursos públicos.
                            </p>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                O programa é coordenado pela <strong>Controladoria Municipal</strong> com participação de todas as secretarias 
                                e revisão anual obrigatória.
                            </p>
                        </div>

                        <div className="lg:w-80 space-y-4">
                            <div className="bg-primary-50 rounded-[2rem] p-8 border border-primary-100 text-center">
                                <FaShieldAlt className="text-primary-500 mx-auto mb-4" size={40} />
                                <div className="text-3xl font-black text-primary-900 tracking-tighter">2024</div>
                                <div className="text-[9px] font-black text-primary-500 uppercase tracking-widest mt-1">Ano de Implementação</div>
                            </div>
                            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 text-center">
                                <div className="text-xl font-black text-emerald-700">
                                    {acoes.filter(a => a.status === "concluido").length}/{acoes.length}
                                </div>
                                <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Ações Concluídas</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pilares */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-1 bg-primary-600 rounded-full" />
                        <h2 className="text-2xl font-black text-primary-900 uppercase tracking-tighter">Pilares do Programa</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pilares.map((p, i) => (
                            <div key={i} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                                <div className={`h-1.5 bg-gradient-to-r ${p.cor}`} />
                                <div className="p-8">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${p.cor} text-white rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <p.icon size={20} />
                                    </div>
                                    <h3 className="font-black text-primary-900 text-sm uppercase tracking-tight mb-3">{p.titulo}</h3>
                                    <p className="text-gray-500 text-xs leading-relaxed">{p.descricao}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Plano de Ação */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-1 bg-secondary-500 rounded-full" />
                        <h2 className="text-2xl font-black text-primary-900 uppercase tracking-tighter">Plano de Ação 2024–2025</h2>
                    </div>
                    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Ação</th>
                                    <th className="px-8 py-5 text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">Prazo / Conclusão</th>
                                    <th className="px-8 py-5 text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {acoes.map((a, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                {a.status === "concluido" && <FaCheckCircle className="text-emerald-400 shrink-0" size={14} />}
                                                <span className="font-medium text-sm text-gray-700">{a.descricao}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="font-bold text-sm text-gray-500">{a.prazo}</span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`inline-flex px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${statusConfig[a.status].cor}`}>
                                                {statusConfig[a.status].label}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Documentos Oficiais */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-1 bg-blue-600 rounded-full" />
                        <h2 className="text-2xl font-black text-primary-900 uppercase tracking-tighter">Documentos e Downloads</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { titulo: "Código de Ética e Conduta", tamanho: "850 KB", data: "15/01/2024" },
                            { titulo: "Plano de Integridade 2024-2025", tamanho: "1.2 MB", data: "10/02/2024" },
                            { titulo: "Política de Gestão de Riscos", tamanho: "640 KB", data: "05/03/2024" },
                            { titulo: "Regulamento da Ouvidoria", tamanho: "420 KB", data: "20/03/2024" },
                        ].map((doc, i) => (
                            <div key={i} className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-red-500 group-hover:text-white transition-all shadow-inner">
                                    <FaFileAlt size={20} />
                                </div>
                                <h4 className="text-[11px] font-black text-primary-900 uppercase tracking-tight mb-2 line-clamp-2">{doc.titulo}</h4>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-6">{doc.tamanho} • {doc.data}</p>
                                <button className="mt-auto w-full py-2.5 bg-gray-50 text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-xl border border-gray-100 group-hover:bg-primary-900 group-hover:text-white group-hover:border-primary-900 transition-all flex items-center justify-center gap-2">
                                    Baixar PDF <FaExternalLinkAlt size={8} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <BannerPNTP />
            </div>
        </div>
    );
}
