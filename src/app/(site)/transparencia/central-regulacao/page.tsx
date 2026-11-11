import type { Metadata } from "next";
import {
    FaHeartbeat,
    FaUserMd,
    FaFlask,
    FaStethoscope,
    FaAmbulance,
    FaInfoCircle,
    FaPhone,
    FaExternalLinkAlt,
} from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Central de Regulação | Portal da Transparência – Prefeitura de Lajes Pintadas",
    description:
        "Transparência das listas de espera para consultas, exames e cirurgias eletivas do Sistema Único de Saúde em Lajes Pintadas/RN.",
};

const ICON_MAP: Record<string, any> = {
    FaUserMd,
    FaFlask,
    FaStethoscope,
    FaAmbulance,
    FaHeartbeat,
};

export default async function CentralRegulacaoPage() {
    let dbItens: any[] = [];
    let dbConfig: any = null;

    try {
        const [itens, config] = await Promise.all([
            prisma.centralRegulacaoItem.findMany({
                where: { ativo: true },
                orderBy: { ordem: "asc" },
            }),
            prisma.centralRegulacaoConfig.findUnique({
                where: { id: "config" },
            }),
        ]);
        dbItens = itens;
        dbConfig = config;
    } catch {
        // Sem dados simulados quando o banco não responder
    }

    const filas = dbItens;
    const tituloPage = dbConfig?.titulo || "Central de Regulação em Saúde";
    const subtituloPage =
        dbConfig?.subtitulo ||
        "Acompanhe as filas de espera anonimizadas e o quantitativo por especialidade para consultas, exames e cirurgias eletivas no SUS municipal.";
    const comoFuncionaTexto =
        dbConfig?.comoFunciona ||
        "A Central de Regulação de Saúde é responsável por organizar e garantir o acesso equânime dos cidadãos aos serviços de saúde de média e alta complexidade, respeitando critérios clínicos de prioridade e a ordem cronológica das solicitações, com proteção integral aos dados pessoais e clínicos sensíveis (LGPD).";
    const telefone = dbConfig?.telefone || "(84) 99652-0043";
    const horario = dbConfig?.horarioFuncionamento || "Segunda a Sexta, 07h às 13h";
    const endereco = dbConfig?.endereco || "Secretaria Municipal de Saúde de Lajes Pintadas/RN";
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
                    { label: "Central de Regulação" },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-6 mb-10 flex items-start gap-4">
                    <FaInfoCircle className="text-blue-500 mt-1 shrink-0" size={20} />
                    <div>
                        <p className="font-black text-blue-800 text-sm uppercase tracking-wide mb-1">
                            Transparência Ativa e Proteção de Dados Sensíveis (Critério PNTP 13.3 / LGPD)
                        </p>
                        <p className="text-blue-700 text-sm font-medium leading-relaxed">
                            A divulgação das filas públicas de regulação observa estritamente a anonimização e o uso de protocolo/CNS mascarado, sem expor diagnósticos clínicos ou dados pessoais indevidos.
                        </p>
                    </div>
                </div>

                {filas.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-12 text-center mb-16 shadow-xs">
                        <FaHeartbeat className="text-rose-400 text-4xl mx-auto mb-4" />
                        <h2 className="text-xl font-black text-slate-800 uppercase mb-2">
                            Aguardando Publicação da Competência pela Central de Regulação
                        </h2>
                        <p className="text-sm text-slate-600 max-w-xl mx-auto">
                            Não há filas de espera cadastradas no banco local para o período selecionado. O portal não exibe números simulados quando a base aguarda atualização setorial pela Secretaria Municipal de Saúde.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {filas.map((fila) => {
                            const IconeComponente = ICON_MAP[fila.icone] || FaUserMd;
                            const corGradient = fila.cor || "from-blue-500 to-indigo-600";

                            return (
                                <div
                                    key={fila.id || fila.tipo}
                                    className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden hover:shadow-2xl transition-all duration-500"
                                >
                                    <div className={`h-3 bg-gradient-to-r ${corGradient}`} />
                                    <div className="p-10">
                                        <div className="flex items-center gap-5 mb-8">
                                            <div
                                                className={`w-14 h-14 bg-gradient-to-br ${corGradient} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg`}
                                            >
                                                <IconeComponente size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-black text-gray-800 uppercase tracking-tighter">
                                                    {fila.tipo}
                                                </h2>
                                                {fila.atualizadoEm && (
                                                    <span className="text-[10px] font-bold text-gray-400">
                                                        Atualizado em{" "}
                                                        {new Date(fila.atualizadoEm).toLocaleDateString("pt-BR")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 mb-6">
                                            <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                                    Solicitações em Fila
                                                </div>
                                                <div className="text-4xl font-black text-gray-800 tracking-tighter">
                                                    {fila.totalPacientes}
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                                    Prazo Estimado
                                                </div>
                                                <div className="text-sm font-black text-gray-700 leading-tight mt-2">
                                                    {fila.tempoEspera}
                                                </div>
                                            </div>
                                        </div>

                                        {fila.procedimentos && (
                                            <>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                                    Especialidades / Procedimentos
                                                </div>
                                                <p className="text-sm text-gray-500 font-medium italic">
                                                    {fila.procedimentos}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

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
                            <h3 className="text-lg font-black mb-6 border-b border-slate-700 pb-4 uppercase tracking-tight">
                                Contato & Atendimento
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">
                                        Local
                                    </p>
                                    <p className="font-medium text-sm">{endereco}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">
                                        Horário
                                    </p>
                                    <p className="font-medium text-sm">{horario}</p>
                                </div>
                                <a
                                    href={`tel:${telefone.replace(/\D/g, "")}`}
                                    className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors mt-4"
                                >
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
                                    Acessar Sistema Oficial SISREG <FaExternalLinkAlt size={10} />
                                </a>
                            )}
                            <Link
                                href="/transparencia/unidades-saude"
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
