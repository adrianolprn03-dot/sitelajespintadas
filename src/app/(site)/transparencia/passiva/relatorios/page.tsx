import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { FileStack, ShieldCheck, Eye, Download, FileText, ChevronRight, BarChart, Info, Filter } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Relatórios do SIC | Portal da Transparência",
    description: "Acesse os relatórios estatísticos e listagens de pedidos de informação realizados ao município.",
};

async function getStats() {
    const total = await prisma.esic.count();
    const atendidos = await prisma.esic.count({ where: { status: "concluido" } });
    const comSigilo = await prisma.esic.count({ where: { NOT: { grauSigilo: "Sem Sigilo" } } });
    const semSigilo = await prisma.esic.count({ where: { grauSigilo: "Sem Sigilo" } });
    
    return { total, atendidos, comSigilo, semSigilo };
}

export default async function SICRelatoriosPage() {
    const stats = await getStats();

    const basesRelatorios = [
        {
            titulo: "Pedidos com Grau de Sigilo",
            desc: "Relação de informações classificadas como reservadas, secretas ou ultrassecretas, conforme a LAI.",
            href: "/transparencia/passiva/relatorios/com-sigilo",
            icon: ShieldCheck,
            color: "text-purple-600 bg-purple-50",
            count: stats.comSigilo
        },
        {
            titulo: "Pedidos sem Grau de Sigilo",
            desc: "Listagem de todas as solicitações de acesso público que não possuem restrição de sigilo.",
            href: "/transparencia/passiva/relatorios/sem-sigilo",
            icon: Eye,
            color: "text-blue-600 bg-blue-50",
            count: stats.semSigilo
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Relatórios Estatísticos SIC"
                subtitle="Transparência plena: acompanhe a relação de pedidos e o desempenho do e-SIC."
                variant="premium"
                icon={<FileStack />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva", href: "/transparencia/passiva" },
                    { label: "Relatórios" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                {/* Métricas de Cabeçalho */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                   {[
                       { label: "Total de Pedidos", val: stats.total, color: "blue" },
                       { label: "Pedidos Concluídos", val: stats.atendidos, color: "emerald" },
                       { label: "Aguardando Resposta", val: stats.total - stats.atendidos, color: "amber" },
                       { label: "Acesso Público", val: stats.semSigilo, color: "cyan" }
                   ].map((s, idx) => (
                       <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{s.label}</p>
                           <p className={`text-2xl font-black text-${s.color}-600 tracking-tight`}>{s.val}</p>
                       </div>
                   ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Seleção de Relatórios Detalhados */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
                            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Bases de Dados</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           {basesRelatorios.map((rel, idx) => (
                               <Link key={idx} href={rel.href} className="group">
                                   <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                                       <div className={`w-14 h-14 ${rel.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                                           <rel.icon size={28} />
                                       </div>
                                       <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter mb-3">{rel.titulo}</h3>
                                       <p className="text-gray-500 font-bold text-[11px] leading-relaxed mb-8 grow italic opacity-80">
                                           "{rel.desc}"
                                       </p>
                                       <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                                           <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{rel.count} Registros</span>
                                           <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:translate-x-1.5 transition-transform">
                                              <ChevronRight size={16} />
                                           </div>
                                       </div>
                                   </div>
                               </Link>
                           ))}
                        </div>

                        {/* Download de Relatórios Consolidados */}
                        <div className="mt-12 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-8 flex items-center gap-3">
                               <FileText className="text-blue-600" size={24} />
                               Relatórios Consolidados (LAI)
                            </h3>
                            <div className="space-y-3">
                                {[2024, 2023, 2022].map((ano) => (
                                    <div key={ano} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 group hover:bg-blue-600 hover:border-blue-600 transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                               <Download size={18} />
                                            </div>
                                            <div>
                                               <span className="block font-black text-gray-800 uppercase text-[11px] tracking-tight group-hover:text-white transition-colors">Relatório Estatístico Consolidado - {ano}</span>
                                               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-100 transition-colors">PDF • 1.4 MB • Atualizado em Jan/{ano+1}</p>
                                            </div>
                                        </div>
                                        <button className="mt-4 sm:mt-0 bg-white text-blue-600 px-6 py-2 rounded-full font-bold uppercase text-[9px] tracking-widest shadow-sm group-hover:bg-white group-hover:text-blue-600 transition-all active:scale-95">
                                            Baixar PDF
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Informativa */}
                    <div className="space-y-6">
                        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-900/10">
                            <BarChart size={28} className="text-blue-500 mb-6" />
                            <h3 className="text-lg font-black uppercase tracking-tighter mb-3">Análise Visual</h3>
                            <p className="text-gray-400 text-xs font-bold leading-relaxed mb-8 italic opacity-80">
                                Veja os dados de forma simplificada em gráficos de pizza, barras e evolução temporal.
                            </p>
                            <Link href="/transparencia/passiva/graficos" className="flex items-center justify-center gap-2 bg-blue-600 text-white w-full py-4 rounded-full font-black uppercase text-[9px] tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20">
                                Ver Gráficos SIC <ChevronRight size={14} />
                            </Link>
                        </div>

                        <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100">
                             <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-blue-200">
                                <Info size={20} />
                             </div>
                             <h4 className="font-black text-blue-900 text-sm uppercase tracking-tighter mb-3">Proteção de Dados</h4>
                             <p className="text-[11px] text-blue-800/60 font-bold leading-relaxed mb-5 italic">
                                Respeitando a LGPD e o sigilo de dados pessoais, informações como CPF não são exibidas publicamente.
                             </p>
                             <div className="flex items-center gap-1.5 text-blue-600 text-[9px] font-black uppercase tracking-widest">
                                <Filter size={10} /> Dados Tratados
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
