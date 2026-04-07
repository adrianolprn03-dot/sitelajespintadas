"use client";

import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { 
    FaShieldAlt, FaCheckCircle, FaUsers, FaFileAlt, FaSearch, 
    FaGlobeAmericas, FaGavel, FaExternalLinkAlt, FaShieldHalved,
    FaCircleCheck, FaArrowRight, FaClockRotateLeft, FaFileSignature,
    FaArrowTrendUp, FaBolt, FaFeatherPointed
} from "react-icons/fa6";
import { motion } from "framer-motion";

const pilares = [
    {
        icon: FaShieldAlt,
        titulo: "Comprometimento da Alta Gestão",
        descricao: "O Prefeito Municipal e todos os Secretários demonstram compromisso formal com os princípios da integridade, ética e transparência na gestão dos recursos públicos.",
        cor: "from-blue-600 to-indigo-700",
        shadow: "shadow-blue-500/10"
    },
    {
        icon: FaSearch,
        titulo: "Avaliação de Riscos",
        descricao: "Mapeamento periódico dos processos com maior vulnerabilidade à corrupção, fraude ou desvio de finalidade, com medidas preventivas sistematizadas.",
        cor: "from-indigo-600 to-blue-700",
        shadow: "shadow-indigo-500/10"
    },
    {
        icon: FaGavel,
        titulo: "Regras e Instrumentos",
        descricao: "Código de Conduta para agentes públicos, Política de Conflito de Interesses, regulamentação de controle interno e fiscalização permanente.",
        cor: "from-slate-700 to-slate-900",
        shadow: "shadow-slate-500/10"
    },
    {
        icon: FaUsers,
        titulo: "Capacitação e Comunicação",
        descricao: "Treinamentos periódicos sobre ética, LAI, LGPD, prevenção à lavagem de dinheiro e gestão responsável para todos os servidores municipais.",
        cor: "from-emerald-500 to-teal-600",
        shadow: "shadow-emerald-500/10"
    },
    {
        icon: FaFileAlt,
        titulo: "Canais de Denúncia",
        descricao: "Canal de ouvidoria com garantia de anonimato ao denunciante. Proibição de retaliação mediante norma interna e proteção ao servidor que relata irregularidades.",
        cor: "from-blue-500 to-indigo-500",
        shadow: "shadow-blue-400/10"
    },
    {
        icon: FaGlobeAmericas,
        titulo: "Monitoramento Contínuo",
        descricao: "Revisão anual do Programa de Integridade com indicadores de desempenho, relatórios de conformidade e publicação dos resultados no Portal da Transparência.",
        cor: "from-cyan-600 to-blue-800",
        shadow: "shadow-cyan-500/10"
    },
];

const acoes = [
    { descricao: "Publicação da Carta de Serviços ao Cidadão", status: "concluido", prazo: "Jan/2024" },
    { descricao: "Implantação do e-SIC com protocolo eletrônico", status: "concluido", prazo: "Mar/2024" },
    { descricao: "Cadastro de Conflito de Interesses de Agentes Políticos", status: "concluido", prazo: "Jun/2024" },
    { descricao: "Treinamento de servidores sobre LAI e LGPD", status: "concluido", prazo: "Ago/2024" },
    { descricao: "Publicação do Relatório Anual do SIC (art. 30 LAI)", status: "concluido", prazo: "Fev/2025" },
    { descricao: "Mapeamento de riscos em licitações", status: "em_andamento", prazo: "Jun/2025" },
    { descricao: "Implantação de código de conduta do servidor", status: "em_andamento", prazo: "Ago/2025" },
    { descricao: "Revisão e atualização do Programa de Integridade", status: "planejado", prazo: "Dez/2025" },
];

const statusConfig: Record<string, { label: string; cor: string }> = {
    concluido: { label: "Concluído", cor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    em_andamento: { label: "Em Execução", cor: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    planejado: { label: "Agendado", cor: "bg-slate-500/10 text-slate-500 border-slate-500/20" },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

export default function IntegridadePage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Ética e Integridade"
                subtitle="Governança institucional focada na prevenção à corrupção e na cultura da transparência pública."
                variant="premium"
                icon={<FaShieldHalved />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Integridade" }
                ]}
            />

            <motion.main 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-width-[1240px] mx-auto px-6 py-12 -mt-16 relative z-30"
            >
                {/* Intro Section - Diamond Standard Bento */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch">
                    
                    {/* Primary Highlight Card - Compromisso */}
                    <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden group border border-slate-800">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -mr-40 -mt-40 group-hover:bg-blue-600/20 transition-all duration-700" />
                        <div className="relative z-10">
                            <div className="flex flex-wrap items-center gap-4 mb-10">
                                <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">PNTP 2025 Conformidade</span>
                                    </div>
                                </div>
                                <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                    <div className="flex items-center gap-2">
                                        <FaCircleCheck className="text-emerald-400" size={12} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Fiscalização MPE/RN</span>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-5xl font-black tracking-tighter mb-8 leading-[0.9] italic text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
                                Governança & <br/> <span className="text-blue-400 not-italic">Integridade Pública</span>
                            </h2>
                            <p className="text-white/40 font-bold leading-relaxed max-w-2xl text-lg mb-10">
                                O Programa de Integridade de Lajes Pintadas é o conjunto de medidas institucionalizadas com o objetivo de prevenir, detectar e remediar atos de corrupção, fraude e desvio de conduta.
                            </p>
                            
                            <div className="flex flex-wrap gap-12 items-center border-t border-white/5 pt-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Ciclo Vigente</span>
                                    <span className="text-2xl font-black tracking-tight tracking-tighter italic">2024—2025</span>
                                </div>
                                <div className="w-px h-12 bg-white/5 hidden md:block" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Coordenação Geral</span>
                                    <span className="text-2xl font-black tracking-tight uppercase text-blue-400">Controladoria <span className="text-white/40">Geral</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Card - Progresso */}
                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100/50 flex flex-col justify-between relative overflow-hidden group">
                         <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                         <div className="relative">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-inner group-hover:shadow-blue-600/40">
                                <FaShieldAlt className="text-blue-400 group-hover:text-white transition-colors" size={36} />
                            </div>
                            <div className="text-6xl font-black text-slate-900 tracking-tighter mb-2 tabular-nums">
                                {acoes.filter(a => a.status === "concluido").length}/{acoes.length}
                            </div>
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                                Ações de Integridade <br/> <span className="text-blue-600">Concluídas</span>
                            </h4>
                         </div>
                         <div className="pt-10 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Atualizado Jan/2025</span>
                            </div>
                            <FaBolt className="text-amber-400" />
                         </div>
                    </div>
                </motion.div>

                {/* Section Header */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center gap-8 mb-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-900 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 shrink-0">
                        <FaFeatherPointed size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-slate-950 uppercase tracking-tighter leading-none mb-3 italic">Pilares <span className="text-blue-600 font-bold not-italic">Normativos</span></h2>
                        <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.4em] flex items-center gap-3">
                            <span className="w-3 h-1 bg-blue-600 rounded-full" /> Estrutura de Sustentação da Gestão Ética
                        </p>
                    </div>
                </motion.div>

                {/* Pilares Grid */}
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {pilares.map((p, i) => (
                        <motion.div 
                            key={i} 
                            variants={itemVariants}
                            className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden group hover:border-blue-200 hover:shadow-blue-500/5 transition-all duration-700"
                        >
                            <div className="relative z-10">
                                <div className={`w-16 h-16 bg-gradient-to-br ${p.cor} text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl ${p.shadow} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                    <p.icon size={28} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-5 group-hover:text-blue-700 transition-colors leading-tight">{p.titulo}</h3>
                                <p className="text-sm text-slate-400 font-bold italic leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                                    {p.descricao}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Action Plan Section */}
                <motion.div variants={itemVariants} className="mb-24">
                    <div className="flex flex-col md:flex-row md:items-center gap-8 mb-12 px-6">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-inner shrink-0">
                            <FaClockRotateLeft size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tighter leading-none mb-2 italic">Plano de <span className="text-indigo-600 font-bold not-italic">Ação</span></h2>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] flex items-center gap-3">
                                Cronograma de Implementação 2024–2025
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-50">
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Objetivo / Ação Institucional</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Referência</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Status Atual</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {acoes.map((a, i) => (
                                        <tr key={i} className="group hover:bg-slate-50/30 transition-colors">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${a.status === 'concluido' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-300'}`}>
                                                        {a.status === 'concluido' ? <FaCircleCheck size={16} /> : <FaBolt size={14} />}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-tight group-hover:text-slate-900 transition-colors">{a.descricao}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <span className="text-[11px] font-black text-slate-400 font-mono tracking-widest">{a.prazo}</span>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <span className={`inline-flex px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl border tabular-nums ${statusConfig[a.status].cor}`}>
                                                    {statusConfig[a.status].label}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>

                {/* Downloads Section */}
                <motion.div variants={itemVariants} className="mb-24 px-6 lg:px-0">
                    <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter mb-10 flex items-center gap-4 italic underline decoration-blue-600/20 underline-offset-8">
                        Central de <span className="text-blue-600 not-italic">Documentos</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { titulo: "Código de Ética e Conduta", tamanho: "850 KB", data: "15/01/2024" },
                            { titulo: "Plano de Integridade 24-25", tamanho: "1.2 MB", data: "10/02/2024" },
                            { titulo: "Política de Riscos", tamanho: "640 KB", data: "05/03/2024" },
                            { titulo: "Regulamento Ouvidoria", tamanho: "420 KB", data: "20/03/2024" },
                        ].map((doc, i) => (
                            <div key={i} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-red-500/5 transition-all duration-500 flex flex-col items-center text-center hover:border-red-200">
                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-red-500 group-hover:text-white transition-all shadow-inner group-hover:rotate-6">
                                    <FaFileSignature size={28} />
                                </div>
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight mb-2 px-2 leading-tight">{doc.titulo}</h4>
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-8">{doc.tamanho} • {doc.data}</p>
                                <button className="mt-auto w-full py-4 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-100 group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg group-hover:shadow-slate-900/20">
                                    Download PDF <FaExternalLinkAlt size={10} className="opacity-50" />
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <BannerPNTP />
                    <div className="mt-20 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-[2] max-w-2xl mx-auto">
                            PROGRAMA DE INTEGRIDADE • PREFEITURA DE LAJES PINTADAS/RN <br/>
                            <span className="opacity-40 font-bold italic">Cultura da transparência em conformidade com o Programa Nacional de Transparência Pública.</span>
                        </p>
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
}
