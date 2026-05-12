import PageHeader from "@/components/PageHeader";
import { Info, FileText, GraduationCap, Briefcase, UserCheck, UserPlus, Building } from "lucide-react";
import { FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Terceirizados | Portal da Transparência",
    description: "Informações sobre o pessoal terceirizado a serviço do Município de Lajes Pintadas.",
};

export default async function TerceirizadosPage() {
    const terceirizados = await prisma.terceirizado.findMany({
        orderBy: { nome: "asc" }
    });

    const temTerceirizados = terceirizados.length > 0;

    return (
        <div className="bg-[#f8fafc] min-h-screen font-['Montserrat',sans-serif]">
            <PageHeader
                title="Terceirizados"
                subtitle="Consulte a relação de pessoal terceirizado e as empresas prestadoras de serviço."
                variant="premium"
                icon={<UserPlus className="text-white" size={32} />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Terceirizados" }
                ]}
            />

            {/* Banner PNTP */}
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Lei de Licitações", "Transparência Pública", "PNTP 2026"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-[1240px] mx-auto px-6 pt-12">
                {!temTerceirizados ? (
                    <div className="bg-red-50 border-l-8 border-red-500 rounded-r-3xl p-8 flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 shadow-xl shadow-red-500/10 transition-all hover:bg-red-100">
                        <FaInfoCircle className="text-red-500 text-5xl shrink-0 drop-shadow-md" />
                        <div className="text-center md:text-left">
                            <h3 className="text-red-900 font-black text-xl uppercase tracking-tight mb-2">Comunicação Oficial</h3>
                            <p className="text-red-700 font-bold text-lg md:text-xl">
                                A Prefeitura Municipal de Lajes Pintadas informa que <span className="bg-red-200 text-red-900 px-2 py-0.5 rounded-md mx-1 uppercase">Não possuímos pessoal terceirizado</span> em nosso quadro direto de colaboradores através de contratos de mão de obra exclusiva até a data de hoje, {new Date().toLocaleDateString('pt-BR')}.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-500/5 border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <UserCheck className="text-blue-600" /> Relação de Terceirizados
                                </h2>
                                <p className="text-slate-500 font-medium">Dados conforme contratos de prestação de serviços vigentes.</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <th className="px-8 py-5">Profissional / Função</th>
                                        <th className="px-8 py-5">Empresa Contratada</th>
                                        <th className="px-8 py-5">Unidade de Lotação</th>
                                        <th className="px-8 py-5">Início</th>
                                        <th className="px-8 py-5 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {terceirizados.map((t) => (
                                        <tr key={t.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{t.nome}</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t.funcao}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Building size={14} className="text-blue-500" />
                                                    <div className="text-sm font-semibold text-slate-600">{t.empresa}</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-[10px] font-black text-blue-500 uppercase tracking-wider">{t.unidadeLotacao}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-medium text-slate-500">
                                                    {new Date(t.dataInicio).toLocaleDateString('pt-BR')}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                                    t.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="bg-white rounded-[2rem] p-12 shadow-xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <UserPlus size={200} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Info size={24} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Controle de Terceirização</h2>
                        </div>

                        <div className="space-y-6 text-slate-600 font-medium leading-relaxed mb-12">
                            <p>
                                Em conformidade com as diretrizes de transparência pública, esta seção apresenta a relação de profissionais vinculados a empresas prestadoras de serviço que atuam na administração municipal.
                            </p>
                            <p>
                                A gestão municipal assegura que todos os processos de terceirização ocorram mediante licitação pública e fiscalização rigorosa do cumprimento dos deveres trabalhistas e previdenciários pelas empresas contratadas.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link 
                                href="/transparencia/contratos" 
                                className="flex-1 bg-slate-900 text-white text-center py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-3"
                            >
                                <FileText size={16} /> Consultar Contratos
                            </Link>
                            <a 
                                href="/transparencia" 
                                className="flex-1 bg-blue-600 text-white text-center py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3"
                            >
                                Voltar ao Portal
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
