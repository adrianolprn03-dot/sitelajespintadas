import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { FaHospital, FaMapPin, FaClock, FaPhone } from "react-icons/fa";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Unidades de Saúde | Portal da Transparência",
    description: "Relação de UBSs, Hospitais e clínicas da rede municipal de Lajes Pintadas.",
};

export default async function UnidadesSaudePage() {
    const unidades = await prisma.unidadeAtendimento.findMany({
        where: { ativa: true, tipo: "saude" },
        orderBy: { nome: "asc" }
    });

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Unidades de Saúde"
                subtitle="Endereços, telefones e horários de funcionamento da Rede Municipal de Saúde"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Unidades de Saúde" }
                ]}
            />

            {/* Banner PNTP */}
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Atendimento em Saúde", "Rede Municipal (SUS)", "PNTP 2025"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {unidades.length === 0 ? (
                        <div className="col-span-full bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
                           <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                               <FaHospital size={32} />
                           </div>
                           <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-2">Sem unidades listadas</h4>
                           <p className="text-gray-400 font-bold text-sm">As informações das unidades estão sendo atualizadas.</p>
                        </div>
                    ) : (
                        unidades.map((item: any) => (
                            <div key={item.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group overflow-hidden">
                                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 flex items-start gap-4">
                                     <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white shrink-0">
                                         <FaHospital size={28} />
                                     </div>
                                     <div>
                                         <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">{item.nome}</h3>
                                         <p className="text-blue-100 text-sm font-medium leading-relaxed mb-4">{item.descricao}</p>
                                     </div>
                                </div>
                                
                                <div className="p-8 pb-10 space-y-4">
                                    <div className="flex items-start gap-4 text-gray-600">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                            <FaMapPin />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Endereço</span>
                                            <span className="font-bold text-gray-700 text-sm leading-snug">{item.endereco}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4 text-gray-600">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                            <FaClock />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Horário de Funcionamento</span>
                                            <span className="font-bold text-gray-700 text-sm">{item.horario}</span>
                                        </div>
                                    </div>
                                    
                                    {item.telefone && (
                                        <div className="flex items-start gap-4 text-gray-600">
                                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                                <FaPhone />
                                            </div>
                                            <div>
                                                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Telefone</span>
                                                <span className="font-bold text-gray-700 text-sm">{item.telefone}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
