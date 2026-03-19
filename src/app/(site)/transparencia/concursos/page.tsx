import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { FaUserEdit, FaSearch, FaBriefcase, FaCalendarCheck, FaCheckCircle, FaLock, FaArrowRight } from "react-icons/fa";
import ExportButtons from "@/components/transparencia/ExportButtons";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Concursos e Seleções | Portal da Transparência",
    description: "Acompanhe todos os editais de concursos públicos e processos seletivos da Prefeitura de Lajes Pintadas.",
};

export default async function ConcursosTransparencyPage() {
    const concursos = await prisma.concurso.findMany({
        orderBy: { dataPublicacao: "desc" }
    });

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Concursos e Seleções"
                subtitle="Acompanhe os editais, convocações e resultados dos processos seletivos municipais."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Concursos e Seleções" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 pt-16">
                <ExportButtons data={concursos} filename="concursos_lajes_pintadas" />
            </div>

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                {/* Cabeçalho de Pesquisa */}
                <div className="bg-white rounded-[3rem] p-10 mb-12 shadow-xl shadow-gray-200/40 border border-white flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Editais Publicados</h3>
                        <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">Acesso a documentos e histórico de certames</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative group">
                            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar por cargo ou edital..."
                                className="pl-14 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold md:w-80 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {concursos.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
                           <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                               <FaBriefcase size={32} />
                           </div>
                           <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-2">Sem editais ativos</h4>
                           <p className="text-gray-400 font-bold text-sm">Não há concursos ou seleções com inscrições abertas no momento.</p>
                        </div>
                    ) : (
                        concursos.map((item: any) => (
                            <div key={item.id} className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/40 border border-white hover:border-blue-100 transition-all group">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                    <div className="flex items-start gap-8">
                                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center shadow-inner group-hover:bg-blue-50 transition-colors">
                                            <FaBriefcase size={28} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{item.tipo}</span>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{item.linkEdital ? 'Documento Vinculado' : 'Sem Edital'}</span>
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
                                                className="bg-blue-600 text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center gap-2 group"
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
                    ) }
                </div>
            </div>
        </div>
    );
}
