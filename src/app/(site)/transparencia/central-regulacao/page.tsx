import type { Metadata } from "next";
import { FaHeartbeat, FaUserMd, FaFlask, FaStethoscope, FaAmbulance, FaInfoCircle, FaPhoneAlt, FaExternalLinkAlt } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Central de Regulação | Portal da Transparência – Prefeitura de Lajes Pintadas",
    description: "Transparência das listas de espera para consultas, exames e cirurgias eletivas do Sistema Único de Saúde em Lajes Pintadas/RN.",
};

const FILAS = [
    { tipo: "Consultas Especializadas", icone: FaUserMd, cor: "from-blue-500 to-indigo-600", total: 287, espera: "15 a 60 dias úteis", exemplo: "Cardiologia, Ortopedia, Neurologia..." },
    { tipo: "Exames de Imagem e Laboratoriais", icone: FaFlask, cor: "from-teal-500 to-emerald-600", total: 143, espera: "7 a 30 dias úteis", exemplo: "Tomografia, Ressonância, Ecocardiograma..." },
    { tipo: "Cirurgias Eletivas", icone: FaStethoscope, cor: "from-purple-500 to-violet-600", total: 62, espera: "30 a 120 dias úteis", exemplo: "Herniorrafia, Colelitíase, Artroscopia..." },
    { tipo: "Urgências Referenciadas", icone: FaAmbulance, cor: "from-rose-500 to-red-600", total: 18, espera: "Prioritário (até 24h)", exemplo: "Casos com indicação urgente e regulação ativa." },
];

export default function CentralRegulacaoPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Central de Regulação em Saúde"
                subtitle="Acompanhe as filas de espera para consultas especializadas, exames e cirurgias eletivas no SUS municipal."
                variant="premium"
                icon={<FaHeartbeat />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Central de Regulação" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                {/* Aviso */}
                <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-6 mb-10 flex items-start gap-4">
                    <FaInfoCircle className="text-blue-500 mt-1 shrink-0" size={20} />
                    <div>
                        <p className="font-black text-blue-800 text-sm uppercase tracking-wide mb-1">Transparência Ativa – Saúde Pública</p>
                        <p className="text-blue-700 text-sm font-medium leading-relaxed">
                            A publicação destas informações atende ao disposto no art. 7º da Lei 12.527/2011 (LAI) e às diretrizes do PNTP 2026. 
                            Os dados são atualizados mensalmente pela Secretaria Municipal de Saúde. Para inclusão na fila de espera, 
                            dirija-se à Unidade Básica de Saúde de sua referência.
                        </p>
                    </div>
                </div>

                {/* Cards de Fila */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {FILAS.map((fila) => (
                        <div key={fila.tipo} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden hover:shadow-2xl transition-all duration-500">
                            <div className={`h-3 bg-gradient-to-r ${fila.cor}`} />
                            <div className="p-10">
                                <div className="flex items-center gap-5 mb-8">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${fila.cor} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <fila.icone size={24} />
                                    </div>
                                    <h2 className="text-lg font-black text-gray-800 uppercase tracking-tighter">{fila.tipo}</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Pacientes na Fila</div>
                                        <div className="text-4xl font-black text-gray-800 tracking-tighter">{fila.total}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Tempo Médio de Espera</div>
                                        <div className="text-sm font-black text-gray-700 leading-tight mt-2">{fila.espera}</div>
                                    </div>
                                </div>

                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tipos de Procedimento</div>
                                <p className="text-sm text-gray-500 font-medium italic">{fila.exemplo}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Informações Complementares */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-6 flex items-center gap-3">
                            <FaHeartbeat className="text-rose-500" /> Como Funciona a Regulação
                        </h2>
                        <div className="space-y-6 text-sm text-gray-600 font-medium leading-relaxed">
                            <p>
                                A <strong>Central de Regulação de Saúde</strong> é responsável por organizar e garantir o acesso equânime 
                                dos cidadãos aos serviços de saúde de média e alta complexidade, respeitando critérios clínicos 
                                de prioridade e a ordem de chegada dos pedidos.
                            </p>
                            <p>
                                O processo inicia com a solicitação do <strong>médico da Atenção Básica (UBS)</strong>, que preenche 
                                a guia de referência. Após triagem e análise por médico regulador, o caso é enquadrado em 
                                prioridade e inserido na fila do sistema SISREG ou sistema estadual correspondente.
                            </p>
                            <p>
                                O paciente é notificado via telefone ou pessoalmente na UBS quando sua consulta/exame é agendado. 
                                É fundamental manter os dados de contato atualizados junto à unidade de saúde.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-[2.5rem] p-10">
                        <h3 className="text-lg font-black mb-6 border-b border-slate-700 pb-4 uppercase tracking-tight">Contato</h3>
                        <div className="space-y-5">
                            <div>
                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Secretaria de Saúde</p>
                                <p className="font-medium text-sm">Secretaria Municipal de Saúde de Lajes Pintadas</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Horário</p>
                                <p className="font-medium text-sm">Segunda a Sexta, 07h às 13h</p>
                            </div>
                            <a href="tel:+558434000000" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors mt-4">
                                <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
                                    <FaPhoneAlt size={14} />
                                </div>
                                <span className="font-medium text-sm">(84) 3400-0000</span>
                            </a>
                        </div>
                        <Link
                            href="/unidades-de-saude"
                            className="mt-8 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black uppercase text-[9px] tracking-widest py-4 rounded-2xl transition-all"
                        >
                            Ver Unidades de Saúde <FaExternalLinkAlt size={9} />
                        </Link>
                    </div>
                </div>

                <div className="mt-4">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
