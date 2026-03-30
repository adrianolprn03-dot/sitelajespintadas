import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { ShieldCheck, Lock, AlertTriangle, HelpCircle, FileText, Calendar, CheckCircle, Info, ChevronRight, Scale } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Pedidos com Sigilo | Portal da Transparência",
    description: "Consulta de informações classificadas com grau de sigilo conforme a Lei de Acesso à Informação.",
};

async function getPedidosSigilosos() {
    return await prisma.esic.findMany({
        where: {
            NOT: {
                grauSigilo: "Sem Sigilo"
            }
        },
        orderBy: { criadoEm: 'desc' },
        take: 50
    });
}

export default async function SICRelatoriosComSigiloPage() {
    const pedidos = await getPedidosSigilosos();

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Informações Classificadas (Sigilo)"
                subtitle="Relação de solicitações que possuem restrição de acesso temporária por força de lei."
                variant="premium"
                icon={<ShieldCheck />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva", href: "/transparencia/passiva" },
                    { label: "Relatórios", href: "/transparencia/passiva/relatorios" },
                    { label: "Com Sigilo" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                   
                   {/* Coluna de Explicação sobre Sigilo */}
                   <div className="lg:col-span-1 space-y-8">
                      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16" />
                         <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-purple-200">
                             <Lock size={28} />
                         </div>
                         <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-6 leading-tight">Classificação de Sigilo</h2>
                         <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
                            A LAI estabelece que a informação em poder dos órgãos e entidades públicas, observada a sua essencialidade à segurança da sociedade ou do Estado, poderá ser classificada nos graus:
                         </p>
                         <div className="space-y-4">
                            {[
                                { g: "Reservado", p: "5 anos", c: "bg-amber-100 text-amber-700" },
                                { g: "Secreto", p: "15 anos", c: "bg-orange-100 text-orange-700" },
                                { g: "Ultrassecreto", p: "25 anos", c: "bg-rose-100 text-rose-700" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                   <div className="flex items-center gap-3">
                                      <div className={`w-2 h-2 rounded-full ${item.c.split(' ')[0]}`} />
                                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{item.g}</span>
                                   </div>
                                   <span className="text-[9px] font-black text-gray-400">Prazo: {item.p}</span>
                                </div>
                            ))}
                         </div>
                      </div>

                      <div className="bg-amber-50 rounded-[2.5rem] p-10 border border-amber-100">
                         <h3 className="text-lg font-black text-amber-900 uppercase tracking-tighter mb-4 flex items-center gap-3">
                            <AlertTriangle size={20} className="text-amber-600" /> Fundamentação
                         </h3>
                         <p className="text-xs text-amber-800/70 font-medium leading-relaxed">
                            Nesta seção, listamos os pedidos que foram negados ou restritos com base nos Artigos 23 e 24 da Lei Federal nº 12.527/2011. Toda classificação deve possuir um Termo de Classificação de Informação (TCI).
                         </p>
                      </div>
                   </div>

                   {/* Listagem de Pedidos Sigilosos */}
                   <div className="lg:col-span-2 space-y-6">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="w-10 h-1 bg-purple-600 rounded-full"></div>
                         <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Listagem de Solicitações</h2>
                      </div>
                      
                      {pedidos.length > 0 ? (
                         pedidos.map((p) => (
                            <div key={p.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden group">
                               <div className="p-10">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                     <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                                           <ShieldCheck size={28} />
                                        </div>
                                        <div>
                                           <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter mb-1">PROTOCOLO #{p.protocolo}</h3>
                                           <div className="flex items-center gap-4">
                                              <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest font-mono">
                                                 <Calendar size={12} /> {new Date(p.criadoEm).toLocaleDateString('pt-BR')}
                                              </span>
                                              <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                              <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">{p.orgao}</span>
                                           </div>
                                        </div>
                                     </div>
                                     <div className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ring-1 ring-purple-100 ${p.grauSigilo === 'Reservado' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                        Sigilo: {p.grauSigilo}
                                     </div>
                                  </div>

                                  <div className="bg-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                                     <div className="absolute right-0 top-0 p-8 opacity-10">
                                        <Lock size={60} />
                                     </div>
                                     <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Scale size={12} /> Fundamentação Legal
                                     </p>
                                     <p className="text-xs text-gray-400 font-medium leading-relaxed italic mb-0">
                                        "Informação classificada conforme previsto no Artigo 23, inciso VIII da Lei 12.527/2011, por comprometer atividades de inteligência e segurança pública." 
                                        <span className="block mt-2 text-[10px] text-gray-500 not-italic">(Exemplo de justificativa padrão LAI)</span>
                                     </p>
                                  </div>

                                  <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
                                     <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <Info size={12} /> Prazo de Desclassificação: +5 Anos
                                     </div>
                                     <Link href={`/servicos/consulta-protocolo?id=${p.protocolo}`} className="text-purple-600 font-black uppercase text-[10px] tracking-widest hover:text-purple-800 transition-colors flex items-center gap-2">
                                        Detalhes <ChevronRight size={14} />
                                     </Link>
                                  </div>
                               </div>
                            </div>
                         ))
                      ) : (
                        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
                           <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                              <Lock size={40} />
                           </div>
                           <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-4">Sem informações restritas</h4>
                           <p className="text-gray-400 font-medium text-sm max-w-sm mx-auto">
                               Não foram localizados pedidos de informação com grau de sigilo classificado neste período.
                           </p>
                        </div>
                      )}
                      
                      <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
                         <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">Deseja solicitar a desclassificação?</p>
                         <Link href="/servicos/esic" className="inline-flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-900/10">
                            Abrir Pedido de Desclassificação <ArrowRightCircle size={16} className="text-white" />
                         </Link>
                      </div>
                   </div>
                </div>
            </div>
        </div>
    );
}

function ArrowRightCircle({ size, className }: { size: number, className: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10"/><path d="m12 16 4-4-4-4"/><path d="M8 12h8"/>
        </svg>
    )
}
