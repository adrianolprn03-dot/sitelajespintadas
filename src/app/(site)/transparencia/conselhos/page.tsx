import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { 
    HiOutlineUsers, 
    HiOutlineDocumentArrowDown, 
    HiOutlineCalendarDays,
    HiOutlineEnvelope,
    HiOutlineIdentification,
    HiOutlineChevronRight
} from "react-icons/hi2";

export const metadata: Metadata = {
    title: "Conselhos Municipais | Prefeitura de Lajes Pintadas",
    description: "Espaço de participação social e controle da gestão pública municipal em Lajes Pintadas – RN.",
};

const defaultCores = [
    "from-[#4f6efe] to-[#3a4dff]",
    "from-[#10b981] to-[#059669]",
    "from-[#6366f1] to-[#4f46e5]",
];

export default async function ConselhosPage() {
    const conselhos = await prisma.conselho.findMany({
        where: { ativo: true },
        include: {
            atas: {
                orderBy: { dataReuniao: "desc" }
            }
        },
        orderBy: { nome: "asc" }
    });

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <PageHeader
                title="Conselhos Municipais"
                subtitle="Espaço de participação social e controle da gestão pública municipal em Lajes Pintadas."
                variant="premium"
                icon={<HiOutlineUsers className="w-8 h-8" />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Conselhos" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-6 py-16 mb-20">
                {conselhos.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium italic">Os conselhos municipais estão sendo atualizados. Retorne em breve!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        {conselhos.map((c, idx) => {
                            const cor = defaultCores[idx % defaultCores.length];
                            return (
                                <div key={c.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 hover:shadow-primary-900/10 transition-all duration-500 border border-transparent hover:border-primary-100 flex flex-col h-full">
                                    {/* Header do Card com Gradiente */}
                                    <div className={`bg-gradient-to-br ${cor} p-8 md:p-10 text-white relative`}>
                                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                            <HiOutlineUsers size={120} />
                                        </div>
                                        
                                        <div className="flex items-start gap-6 relative z-10">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                                                <HiOutlineUsers size={32} className="text-white" />
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-tight mb-2">
                                                    {c.nome}
                                                </h3>
                                                {c.sigla && (
                                                    <span className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">
                                                        {c.sigla}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Corpo do Card */}
                                    <div className="p-8 md:p-10 space-y-8 flex-grow bg-white">
                                        <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                            {c.descricao}
                                        </p>

                                        {/* Composição Section */}
                                        <div className="bg-gray-50/50 rounded-[1.5rem] p-6 border border-gray-100 shadow-inner">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    <HiOutlineIdentification size={14} /> Composição & Atos
                                                </span>
                                                <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 uppercase tracking-wider">
                                                    Ativo
                                                </span>
                                            </div>
                                            
                                            <p className="text-[11px] font-bold text-gray-700 leading-relaxed italic mb-4">
                                                "{c.composicao}"
                                            </p>

                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                                {c.presidente && (
                                                    <div>
                                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Presidente</span>
                                                        <span className="text-[11px] font-black text-gray-800 leading-tight uppercase">{c.presidente}</span>
                                                    </div>
                                                )}
                                                {c.email && (
                                                    <div>
                                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Contato</span>
                                                        <span className="text-[10px] font-black text-primary-600 truncate block">{c.email}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Base Legal</span>
                                                <button className="flex items-center gap-1.5 text-[9px] font-black text-primary-600 hover:text-primary-800 uppercase tracking-widest group/btn transition-colors">
                                                    <HiOutlineDocumentArrowDown size={14} className="text-red-500" /> Baixar Regimento
                                                </button>
                                            </div>
                                        </div>

                                        {/* Atas Section */}
                                        <div className="space-y-4">
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <HiOutlineCalendarDays size={16} /> Atas de Reunião
                                            </h3>
                                            
                                            {c.atas.length > 0 ? (
                                                <div className="flex flex-col gap-2.5">
                                                    {c.atas.slice(0, 3).map((ata) => (
                                                        <a 
                                                            key={ata.id} 
                                                            href={ata.arquivo || "#"} 
                                                            target={ata.arquivo ? "_blank" : undefined}
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-primary-50 rounded-2xl transition-all border border-gray-100 hover:border-primary-100 group/ata"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="text-[11px] font-black text-gray-700 group-hover:text-primary-800 line-clamp-1">{ata.titulo}</span>
                                                                <span className="text-[9px] font-bold text-gray-400 mt-0.5">
                                                                    Data: {new Date(ata.dataReuniao).toLocaleDateString('pt-BR')}
                                                                </span>
                                                            </div>
                                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                                                                <HiOutlineDocumentArrowDown size={14} />
                                                            </div>
                                                        </a>
                                                    ))}
                                                    {c.atas.length > 3 && (
                                                        <button className="w-full text-center py-2 text-[9px] font-black text-gray-400 hover:text-primary-600 uppercase tracking-[0.2em] transition-colors mt-2">
                                                            Visualizar histórico completo de atas ({c.atas.length})
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="p-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-center">
                                                    <span className="text-[10px] text-gray-400 font-bold italic uppercase tracking-widest">Nenhuma ata anexada.</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer do Card */}
                                    <div className="px-10 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between group/footer">
                                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">
                                            Conselhagem & Controle
                                        </span>
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover/footer:bg-primary-600 group-hover/footer:text-white transition-all transform group-hover/footer:translate-x-1">
                                            <HiOutlineChevronRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Call to Action Final */}
                <div className="bg-gradient-to-br from-[#003366] to-[#001a33] rounded-[3rem] p-12 text-center text-white relative overflow-hidden mt-12 shadow-2xl flex flex-col items-center">
                     <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none rotate-12">
                        <HiOutlineUsers size={400} />
                    </div>
                    
                    <div className="relative z-10 max-w-2xl">
                        <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none">Participação Social</h3>
                        <p className="text-blue-200/80 mb-10 font-medium text-sm leading-relaxed">
                            Os conselhos municipais são ferramentas fundamentais para que a sociedade civil organizada possa fiscalizar e ajudar a decidir o futuro das políticas públicas de Lajes Pintadas. Participe!
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="/servicos/ouvidoria" className="w-full sm:w-auto bg-[#FDB913] hover:bg-[#ffc841] text-blue-950 px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all">
                                Fale com a Ouvidoria
                            </a>
                            <a href="/transparencia/institucional" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest border border-white/20 hover:scale-105 transition-all">
                                Estrutura de Gestão
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
