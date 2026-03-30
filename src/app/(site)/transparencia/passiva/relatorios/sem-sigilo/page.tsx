import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { Eye, Search, Filter, Calendar, FileText, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Pedidos sem Sigilo | Portal da Transparência",
    description: "Consulta detalhada de todas as solicitações de acesso público ao município.",
};

async function getPedidos() {
    return await prisma.esic.findMany({
        where: { grauSigilo: "Sem Sigilo" },
        orderBy: { criadoEm: 'desc' },
        take: 50
    });
}

export default async function SICRelatoriosSemSigiloPage() {
    const pedidos = await getPedidos();

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Pedidos de Acesso Público"
                subtitle="Consulta integral às solicitações realizadas via e-SIC que não possuem restrição de sigilo."
                variant="premium"
                icon={<Eye />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva", href: "/transparencia/passiva" },
                    { label: "Relatórios", href: "/transparencia/passiva/relatorios" },
                    { label: "Sem Sigilo" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                {/* Barra de Filtros (Estética) */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4 grow w-full md:w-auto">
                      <div className="relative grow">
                         <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                         <input 
                            type="text" 
                            placeholder="Buscar por protocolo ou palavra-chave..." 
                            className="w-full pl-16 pr-8 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                         />
                      </div>
                   </div>
                   <div className="flex items-center gap-3 w-full md:w-auto text-center md:text-left">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Filtrar por:</span>
                      <select className="bg-gray-50 border border-gray-100 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-700 focus:outline-none hover:bg-white transition-all">
                         <option>Todos os Status</option>
                         <option>Concluídos</option>
                         <option>Em Aberto</option>
                      </select>
                   </div>
                </div>

                {/* Listagem de Pedidos */}
                <div className="space-y-6">
                    {pedidos.length > 0 ? (
                        pedidos.map((p) => (
                            <div key={p.id} className="bg-white rounded-[2.5rem] border border-gray-50 shadow-lg shadow-gray-200/40 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                                <div className="p-8 md:p-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                       <div className="flex items-center gap-6">
                                          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                             <FileText size={28} />
                                          </div>
                                          <div>
                                             <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-1">PROTOCOLO #{p.protocolo}</h3>
                                             <div className="flex items-center gap-4">
                                                <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                   <Calendar size={12} /> {new Date(p.criadoEm).toLocaleDateString('pt-BR')}
                                                </span>
                                                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Órgão: {p.orgao}</span>
                                             </div>
                                          </div>
                                       </div>
                                       <div className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${p.status === 'concluido' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                          {p.status === 'concluido' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                          {p.status === 'concluido' ? 'Informação Disponibilizada' : 'Pedido em Tramitação'}
                                       </div>
                                    </div>

                                    <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-50">
                                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Teor da Solicitação</p>
                                       <p className="text-sm text-gray-600 font-medium leading-relaxed italic line-clamp-3">
                                          "{p.pedido}"
                                       </p>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                       <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                                          <span className="text-gray-400">Solicitante:</span> {p.nome ? 'Cidadão Identificado' : 'Anônimo'}
                                       </div>
                                       <Link href={`/servicos/consulta-protocolo?id=${p.protocolo}`} className="bg-white text-blue-600 px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-3 self-end">
                                          Ver Detalhes do Pedido <ArrowRight size={14} />
                                       </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
                            <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                               <FileText size={40} />
                            </div>
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-4">Nenhum registro encontrado</h3>
                            <p className="text-gray-400 font-medium text-sm max-w-sm mx-auto">
                                No momento, não há pedidos de acesso público registrados no sistema para exibição nesta listagem.
                            </p>
                        </div>
                    )}
                </div>

                {/* Banner Rodapé Auditoria */}
                <div className="mt-20 p-12 bg-indigo-900 rounded-[3rem] text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/5 opacity-10" />
                    <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">Transparência Ativa x Passiva</h4>
                    <p className="text-indigo-200/70 font-medium text-sm mb-0 max-w-2xl mx-auto">
                        Este relatório reflete a transparência passiva (pedidos sob demanda). Recomendamos verificar as outras seções do portal para informações já publicadas de forma ativa.
                    </p>
                </div>
            </div>
        </div>
    );
}
