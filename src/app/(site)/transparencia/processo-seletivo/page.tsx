import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { FaUserEdit, FaBriefcase, FaCalendarCheck, FaCheckCircle, FaLock, FaArrowRight, FaInfoCircle } from "react-icons/fa";
import ExportButtons from "@/components/transparencia/ExportButtons";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Processos Seletivos | Portal da Transparência",
    description: "Acompanhe os Processos Seletivos Simplificados (PSS) da Prefeitura de Lajes Pintadas.",
};

export default async function ProcessoSeletivoPage() {
    // Busca concursos do tipo PSS ou estagio (seletivos temporários)
    const processos = await prisma.concurso.findMany({
        where: { tipo: { in: ["pss", "estagio", "processo-seletivo"] } },
        orderBy: { dataPublicacao: "desc" }
    });

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Processos Seletivos"
                subtitle="Acompanhe editais, convocações e resultados de contratações temporárias e PSS"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Processos Seletivos" }
                ]}
            />

            {/* Banner PNTP */}
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Art. 37, Constituição Federal", "Contratação Temporária", "PNTP 2025"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-[1240px] mx-auto px-6 pt-12">
                <div className="bg-red-50 border-l-8 border-red-500 rounded-r-3xl p-8 flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 shadow-xl shadow-red-500/10 transition-all hover:bg-red-100">
                    <FaInfoCircle className="text-red-500 text-5xl shrink-0 drop-shadow-md" />
                    <div className="text-center md:text-left">
                        <h3 className="text-red-900 font-black text-xl uppercase tracking-tight mb-2">Comunicação Oficial</h3>
                        <p className="text-red-700 font-bold text-lg md:text-xl">
                            A Prefeitura Municipal de Lajes Pintadas informa que <span className="bg-red-200 text-red-900 px-2 py-0.5 rounded-md mx-1">não realizou processo seletivo</span> para o período de 01/01/2021 à 21/04/2026.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-[1240px] mx-auto px-6 pt-8">
                <ExportButtons data={processos} filename="processos_seletivos_lajes_pintadas" />
            </div>

            <div className="max-w-[1240px] mx-auto px-6 py-8">
                <div className="grid grid-cols-1 gap-6">
                    {processos.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
                           <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                               <FaBriefcase size={32} />
                           </div>
                           <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-2">Sem processos seletivos</h4>
                           <p className="text-gray-400 font-bold text-sm">Não há PSS em andamento ou registrados no momento.</p>
                        </div>
                    ) : (
                        processos.map((item: any) => (
                            <div key={item.id} className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/40 border border-white hover:border-blue-100 transition-all group">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                    <div className="flex items-start gap-8">
                                        <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center shadow-inner group-hover:bg-orange-100 transition-colors">
                                            <FaBriefcase size={28} className="text-orange-400 group-hover:text-orange-500 transition-colors" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">PSS / Seleção Temporária</span>
                                            </div>
                                            <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-2 group-hover:text-blue-600 transition-colors">{item.titulo}</h4>
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    <FaCalendarCheck /> Publicação: {new Date(item.dataPublicacao).toLocaleDateString('pt-BR')}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    <FaUserEdit /> {item.vagas} Vagas
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 lg:shrink-0">
                                        {item.status === 'aberto' ? (
                                            <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100">
                                                <FaCheckCircle /> Inscrições Abertas
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                                                <FaLock /> Encerrado
                                            </div>
                                        )}
                                        
                                        {item.linkEdital ? (
                                            <a 
                                                href={item.linkEdital} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="bg-orange-500 text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-200 hover:bg-orange-600 hover:-translate-y-1 transition-all flex items-center gap-2 group"
                                            >
                                                Ver Edital
                                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                            </a>
                                        ) : (
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Edital Indisponível</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
