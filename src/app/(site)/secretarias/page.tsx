import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
    HiOutlineBuildingOffice2, 
    HiOutlineUser, 
    HiOutlinePhone, 
    HiOutlineEnvelope, 
    HiOutlineClock, 
    HiOutlineMapPin,
    HiOutlineArrowRight
} from "react-icons/hi2";
import { getSecretariaIcon } from "@/lib/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Secretarias Municipais | Prefeitura de Lajes Pintadas",
    description: "Conheça as secretarias da Prefeitura de Lajes Pintadas e os serviços que cada uma oferece",
};

const defaultCores = [
    "from-[#4f6efe] to-[#3a4dff]", // Blue
    "from-[#10b981] to-[#059669]", // Green
    "from-[#f59e0b] to-[#d97706]", // Yellow/Orange
    "from-[#6366f1] to-[#4f46e5]", // Indigo
    "from-[#ec4899] to-[#db2777]", // Pink
    "from-[#8b5cf6] to-[#7c3aed]", // Violet
    "from-[#06b6d4] to-[#0891b2]", // Cyan
    "from-[#f43f5e] to-[#e11d48]", // Rose
];

export default async function SecretariasPage() {
    // Fetch secretarias directly via Prisma (Server Side)
    const secretarias = await prisma.secretaria.findMany({
        orderBy: { nome: 'asc' }
    });

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <PageHeader
                title="Secretarias Municipais"
                subtitle="Gestão institucional e serviços dedicados à população de Lajes Pintadas."
                variant="premium"
                icon={<HiOutlineBuildingOffice2 className="w-8 h-8" />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Secretarias" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-6 py-16 mb-20 relative z-10 w-full">
                {secretarias.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium italic pulsate">Nenhuma secretaria cadastrada no momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {secretarias.map((s: any, idx: number) => {
                            const cor = defaultCores[idx % defaultCores.length];
                            // Usamos a função de ícone mas agora dentro do contexto premium
                            const IconCard = getSecretariaIcon(s.nome);

                            return (
                                <Link 
                                    key={s.id} 
                                    href={`/secretarias/${s.slug}`} 
                                    className="group bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 hover:shadow-primary-900/10 transition-all duration-500 border border-transparent hover:border-primary-100 flex flex-col h-full"
                                >
                                    {/* Header do Card com Gradiente */}
                                    <div className={`bg-gradient-to-br ${cor} p-8 md:p-10 text-white relative`}>
                                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                            <IconCard size={120} />
                                        </div>
                                        
                                        <div className="flex items-start gap-6 relative z-10">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                                                <IconCard size={32} className="text-white" />
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-tight mb-2">
                                                    {s.nome}
                                                </h3>
                                                {s.secretario && (
                                                    <div className="flex items-center gap-2 text-white/80 text-[10px] font-black uppercase tracking-widest">
                                                        <HiOutlineUser size={14} className="text-white/60" />
                                                        GESTOR: {s.secretario}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Corpo do Card com Informações */}
                                    <div className="p-8 md:p-10 space-y-8 flex-grow bg-white">
                                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 font-medium">
                                            {s.descricao}
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                            {/* Telefone */}
                                            {s.telefone && (
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                                                        <HiOutlinePhone size={18} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Telefone</span>
                                                        <span className="text-[#002241] font-bold text-xs truncate max-w-[150px]">{s.telefone}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Email */}
                                            {s.email && (
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                                                        <HiOutlineEnvelope size={18} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">E-mail</span>
                                                        <span className="text-[#002241] font-bold text-xs truncate max-w-[150px]">{s.email}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Horário */}
                                            {s.horarioFuncionamento && (
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                                                        <HiOutlineClock size={18} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Horário</span>
                                                        <span className="text-[#002241] font-bold text-xs">{s.horarioFuncionamento}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Endereço */}
                                            {s.endereco && (
                                                <div className="flex items-start gap-4 lg:col-span-1">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                                                        <HiOutlineMapPin size={18} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Endereço</span>
                                                        <span className="text-[#002241] font-bold text-[11px] leading-tight line-clamp-2">{s.endereco}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer do Card */}
                                    <div className="px-10 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between group/footer">
                                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">
                                            Estrutura Institucional
                                        </span>
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover/footer:bg-primary-600 group-hover/footer:text-white transition-all transform group-hover/footer:translate-x-1">
                                            <HiOutlineArrowRight size={16} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
