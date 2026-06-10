import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { FaShieldAlt, FaUserShield, FaServer, FaBalanceScale, FaCheckCircle, FaLock, FaUserCheck, FaEye, FaDownload } from "react-icons/fa";
import { FaScaleBalanced } from "react-icons/fa6";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { MUNICIPIO } from "@/config/municipio";

export const metadata: Metadata = {
    title: `Lei Geral de Proteção de Dados (LGPD) | Transparência Premium — ${MUNICIPIO.nome}`,
    description: "Conheça nossas diretrizes de privacidade, segurança da informação e como protegemos seus dados pessoais de acordo com a Lei 13.709/2018.",
};

export default function LGPDPage() {
    return (
        <div className="min-h-screen bg-[#fcfdfe] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Privacidade e Proteção de Dados (LGPD)"
                subtitle="Segurança jurídica e integridade digital no tratamento das informações da nossa população."
                variant="premium"
                icon={<FaShieldAlt />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Privacidade" }
                ]}
            />
            
            {/* Tagline de Conformidade */}
            <div className="bg-slate-900 overflow-hidden relative border-b border-slate-800">
                <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
                <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-center gap-8 py-5 px-6 relative z-10">
                    {[
                        { label: "Lei Federal 13.709/2018", icon: <FaScaleBalanced className="text-blue-400" /> },
                        { label: "Criptografia de Ponta", icon: <FaLock className="text-emerald-400" /> },
                        { label: "Governança Digital", icon: <FaUserCheck className="text-orange-400" /> }
                    ].map((item) => (
                        <span key={item.label} className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            {item.icon} {item.label}
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-[1240px] mx-auto px-6 py-16 -mt-12 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Card de Compromisso */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-12 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-center">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4 block">Compromisso Institucional</span>
                        <h2 className="text-4xl font-black text-slate-800 mb-8 uppercase tracking-tighter leading-none">Sua privacidade é <br className="hidden md:block" /> nossa prioridade.</h2>
                        <div className="prose prose-slate max-w-none text-slate-500 font-bold leading-relaxed text-lg italic">
                            A Prefeitura de {MUNICIPIO.nome} implementa padrões rigorosos de segurança e transparência no tratamento de dados pessoais, assegurando que cada interação com o poder público municipal respeite a dignidade e a autodeterminação informativa do cidadão.
                        </div>
                    </div>

                    {/* Card de Contato DPO */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-900/10 flex flex-col justify-between group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000">
                            <FaUserShield size={160} />
                        </div>
                        <div className="relative z-10">
                            <div className="p-4 bg-blue-600/20 backdrop-blur-md rounded-2xl w-fit mb-6 border border-blue-500/20">
                                <FaUserShield size={32} className="text-blue-400" />
                            </div>
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2 block">Encarregado de Dados</span>
                            <h3 className="text-2xl font-black tracking-tighter mb-4">Canal Direto com o DPO</h3>
                            
                            <div className="text-slate-300 font-medium text-xs space-y-4 mb-8">
                                <div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Encarregado / Responsável</span>
                                    <span className="font-bold text-white text-sm">{MUNICIPIO.dpo}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Canal de Comunicação</span>
                                    <a href={`mailto:${MUNICIPIO.dpoEmail}`} className="font-bold text-blue-400 hover:underline break-all">
                                        {MUNICIPIO.dpoEmail}
                                    </a>
                                </div>
                                <div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Horário de Expediente</span>
                                    <span className="font-bold text-white">07h às 13h (segunda a sexta-feira)</span>
                                </div>
                            </div>
                        </div>
                        <a href="/servicos/esic" className="relative z-10 h-14 w-full flex items-center justify-center bg-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 border border-blue-500/50">
                            Acessar Portal e-SIC
                        </a>
                    </div>
                </div>

                {/* Grid de Detalhes Bento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-[1.5s]">
                            <FaUserShield size={120} />
                        </div>
                        <div className="relative z-10">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <FaCheckCircle /> Autonomia do Cidadão
                            </span>
                            <h3 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-tighter">Direitos do Titular</h3>
                            <p className="text-slate-500 font-bold text-sm leading-relaxed">
                                Você possui o direito soberano de confirmar a existência de tratamento, acessar seus dados, corrigir informações incompletas e solicitar a eliminação de dados desnecessários ou excessivos em nossas bases.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-[1.5s]">
                            <FaServer size={120} />
                        </div>
                        <div className="relative z-10">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <FaCheckCircle /> Tecnologia de Ponta
                            </span>
                            <h3 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-tighter">Segurança Sistêmica</h3>
                            <p className="text-slate-500 font-bold text-sm leading-relaxed">
                                Nossos sistemas operam sob camadas de proteção avançada, com auditoria de registros de acesso e criptografia de dados sensíveis, mitigando riscos de incidentes e garantindo a continuidade da governança digital.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Legislação e Regulamentação */}
                <div className="bg-white rounded-[3rem] p-12 lg:p-16 border border-slate-100 shadow-xl shadow-slate-200/30 mb-24">
                    <div className="mb-12">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4 block">Base Legal e Normas</span>
                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-4 leading-none">Legislação e Regulamentação</h2>
                        <p className="text-slate-500 font-bold text-sm max-w-2xl italic leading-relaxed">
                            Consulte a legislação federal de proteção de dados e governança digital aplicadas na administração municipal de {MUNICIPIO.nome}.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                titulo: "Lei Geral de Proteção de Dados (LGPD)",
                                subtitulo: "Lei Federal nº 13.709/2018",
                                desc: "Dispõe sobre o tratamento de dados pessoais, inclusive nos meios digitais, por pessoa natural ou por pessoa jurídica de direito público ou privado, com o objetivo de proteger os direitos fundamentais de liberdade e de privacidade.",
                                url: "/docs/lgpd/lei-federal-13709-2018.pdf"
                            },
                            {
                                titulo: "Lei do Governo Digital",
                                subtitulo: "Lei Federal nº 14.129/2021",
                                desc: "Estabelece princípios, regras e instrumentos para o Governo Digital e para o aumento da eficiência pública nas administrações federais, estaduais e municipais.",
                                url: "/docs/lgpd/lei-federal-14129-2021.pdf"
                            }
                        ].map((lei) => (
                            <div key={lei.subtitulo} className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 flex flex-col justify-between group hover:shadow-lg hover:border-blue-100 transition-all duration-300">
                                <div>
                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block mb-2">{lei.subtitulo}</span>
                                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-4 group-hover:text-blue-600 transition-colors">{lei.titulo}</h3>
                                    <p className="text-slate-500 font-bold text-xs leading-relaxed italic mb-8">
                                        "{lei.desc}"
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <a
                                        href={lei.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all text-center"
                                    >
                                        <FaEye size={12} /> Visualizar
                                    </a>
                                    <a
                                        href={lei.url}
                                        download
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-700 hover:text-white rounded-xl text-xs font-bold transition-all text-center"
                                    >
                                        <FaDownload size={11} /> Baixar
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Finalidade do Uso */}
                <div className="bg-slate-50/50 rounded-[3rem] p-12 lg:p-20 border border-slate-100 mb-24">
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="lg:w-1/3">
                            <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-6 leading-none">Finalidade do Tratamento</h3>
                            <p className="text-slate-500 font-bold text-sm leading-relaxed">
                                Por que coletamos e processamos seus dados em nossa administração municipal?
                            </p>
                        </div>
                        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {[
                                "Viabilizar serviços públicos de Saúde e Educação",
                                "Gestão de assistência social e benefícios municipais",
                                "Folha de pagamento e obrigações previdenciárias",
                                "Estatísticas de planejamento para políticas urbanas",
                                "Atendimento de solicitações via Ouvidoria e e-SIC",
                                "Cumprimento de editais e contratos públicos"
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start group">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1 group-hover:bg-blue-600 transition-colors">
                                        <FaCheckCircle className="text-blue-600 group-hover:text-white text-xs transition-colors" />
                                    </div>
                                    <span className="text-slate-600 font-bold text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <BannerPNTP />
            </div>
        </div>
    );
}
