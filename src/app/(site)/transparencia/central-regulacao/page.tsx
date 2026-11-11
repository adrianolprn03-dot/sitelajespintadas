import type { Metadata } from "next";
import { FaHeartbeat, FaUserMd, FaFlask, FaStethoscope, FaAmbulance, FaInfoCircle, FaPhone, FaExternalLinkAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Central de Regulação | Portal da Transparência – Prefeitura de Lajes Pintadas",
    description: "Transparência das listas de espera para consultas, exames e cirurgias eletivas do Sistema Único de Saúde em Lajes Pintadas/RN.",
};

const ICON_MAP: Record<string, any> = {
    FaUserMd,
    FaFlask,
    FaStethoscope,
    FaAmbulance,
    FaHeartbeat
};

const DEFAULT_FILAS = [
    { id: "1", tipo: "Consultas Especializadas", icone: "FaUserMd", cor: "from-blue-500 to-indigo-600", totalPacientes: 287, tempoEspera: "15 a 60 dias úteis", procedimentos: "Cardiologia, Ortopedia, Neurologia..." },
    { id: "2", tipo: "Exames de Imagem e Laboratoriais", icone: "FaFlask", cor: "from-teal-500 to-emerald-600", totalPacientes: 143, tempoEspera: "7 a 30 dias úteis", procedimentos: "Tomografia, Ressonância, Ecocardiograma..." },
    { id: "3", tipo: "Cirurgias Eletivas", icone: "FaStethoscope", cor: "from-purple-500 to-violet-600", totalPacientes: 62, tempoEspera: "30 a 120 dias úteis", procedimentos: "Herniorrafia, Colelitíase, Artroscopia..." },
    { id: "4", tipo: "Urgências Referenciadas", icone: "FaAmbulance", cor: "from-rose-500 to-red-600", totalPacientes: 18, tempoEspera: "Prioritário (até 24h)", procedimentos: "Casos com indicação urgente e regulação ativa." },
];

export default async function CentralRegulacaoPage() {
    let dbItens: any[] = [];
    let dbConfig: any = null;

    try {
        const [itens, config] = await Promise.all([
            prisma.centralRegulacaoItem.findMany({
                where: { ativo: true },
                orderBy: { ordem: "asc" }
            }),
            prisma.centralRegulacaoConfig.findUnique({
                where: { id: "config" }
            })
        ]);
        dbItens = itens;
        dbConfig = config;
    } catch {
        // Fallback para valores padrão em caso de erro no DB
    }

    const filas = dbItens.length > 0 ? dbItens : DEFAULT_FILAS;
    const tituloPage = dbConfig?.titulo || "Central de Regulação em Saúde";
    const subtituloPage = dbConfig?.subtitulo || "Acompanhe as filas de espera para consultas especializadas, exames e cirurgias eletivas no SUS municipal.";
    const comoFuncionaTexto = dbConfig?.comoFunciona || "A Central de Regulação de Saúde é responsável por organizar e garantir o acesso equânime dos cidadãos aos serviços de saúde de média e alta complexidade, respeitando critérios clínicos de prioridade e a ordem de chegada dos pedidos.";
    const telefone = dbConfig?.telefone || "(84) 3400-0000";
    const horario = dbConfig?.horarioFuncionamento || "Segunda a Sexta, 07h às 13h";
    const endereco = dbConfig?.endereco || "Secretaria Municipal de Saúde de Lajes Pintadas";
    const linkExterno = dbConfig?.linkSistemaExterno || null;

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title={tituloPage}
                subtitle={subtituloPage}
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
                    {filas.map((fila) => {
                        const IconeComponente = ICON_MAP[fila.icone] || FaUserMd;
                        const corGradient = fila.cor || "from-blue-500 to-indigo-600";

                        return (
                            <div key={fila.id || fila.tipo} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden hover:shadow-2xl transition-all duration-500">
                                <div className={`h-3 bg-gradient-to-r ${corGradient}`} />
                                <div className="p-10">
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className={`w-14 h-14 bg-gradient-to-br ${corGradient} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                                            <IconeComponente size={24} />
                                        </div>
                                        <h2 className="text-lg font-black text-gray-800 uppercase tracking-tighter">{fila.tipo}</h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Pacientes na Fila</div>
                                            <div className="text-4xl font-black text-gray-800 tracking-tighter">{fila.totalPacientes}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Tempo Médio de Espera</div>
                                            <div className="text-sm font-black text-gray-700 leading-tight mt-2">{fila.tempoEspera}</div>
                                        </div>
                                    </div>

                                    {fila.procedimentos && (
                                        <>
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tipos de Procedimento</div>
                                            <p className="text-sm text-gray-500 font-medium italic">{fila.procedimentos}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Informações Complementares */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-6 flex items-center gap-3">
                            <FaHeartbeat className="text-rose-500" /> Como Funciona a Regulação
                        </h2>
                        <div className="space-y-6 text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                            {comoFuncionaTexto}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-[2.5rem] p-10 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-black mb-6 border-b border-slate-700 pb-4 uppercase tracking-tight">Contato & Atendimento</h3>
                            <div className="space-y-5">
                                <div>
                                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Local</p>
                                    <p className="font-medium text-sm">{endereco}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Horário</p>
                                    <p className="font-medium text-sm">{horario}</p>
                                </div>
                                <a href={`tel:${telefone.replace(/\D/g, '')}`} className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors mt-4">
                                    <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
                                        <FaPhone size={14} />
                                    </div>
                                    <span className="font-medium text-sm">{telefone}</span>
                                </a>
                            </div>
                        </div>

                        <div className="mt-8 space-y-3">
                            {linkExterno && (
                                <a
                                    href={linkExterno}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[9px] tracking-widest py-4 rounded-2xl transition-all shadow-lg shadow-rose-600/30"
                                >
                                    Acessar Sistema de Regulação <FaExternalLinkAlt size={10} />
                                </a>
                            )}
                            <Link
                                href="/unidades-de-saude"
                                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black uppercase text-[9px] tracking-widest py-4 rounded-2xl transition-all"
                            >
                                Ver Unidades de Saúde <FaExternalLinkAlt size={9} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
